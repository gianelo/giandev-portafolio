import { createHmac, timingSafeEqual } from "node:crypto";

const NOTION_VERSION = "2025-09-03";
const NOTION_PAGES_URL = "https://api.notion.com/v1/pages";
const PAGE_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

function richText(value) {
  const characters = Array.from(value?.trim() || "");
  const parts = [];
  for (let i = 0; i < characters.length; i += 2000) {
    parts.push({ type: "text", text: { content: characters.slice(i, i + 2000).join("") } });
  }
  return parts;
}

function notionRecord(data, dataSourceId) {
  const value = (field) => ({ rich_text: richText(data[field]) });
  return {
    parent: { type: "data_source_id", data_source_id: dataSourceId },
    properties: {
      "Consulta": { title: richText([data.name.trim(), data.company?.trim()].filter(Boolean).join(" — ")) },
      "Nombre": value("name"),
      "Correo": { email: data.email.trim() },
      "Empresa": value("company"),
      "Situación actual": value("today"),
      "Ayuda solicitada": value("help"),
      "Presupuesto": value("budget"),
      "Plazo": value("timeline"),
      "Aviso por email": { select: { name: "Pendiente" } },
    },
  };
}

function isSavedPage(page, pageId, dataSourceId) {
  return page?.object === "page" && PAGE_ID.test(page.id) &&
    (!pageId || page.id === pageId) && page.parent?.type === "data_source_id" &&
    page.parent.data_source_id === dataSourceId && !page.in_trash && !page.archived;
}

function retryReference(pageId, retryKey, apiKey) {
  const signature = createHmac("sha256", apiKey).update(`${pageId}:${retryKey}`).digest("hex");
  return `${pageId}.${signature}`;
}

function verifiedRetry(reference, retryKey, apiKey) {
  if (typeof reference !== "string" || !/^([a-f0-9-]{36})\.([a-f0-9]{64})$/i.test(reference)) return null;
  const pageId = reference.slice(0, 36);
  if (!PAGE_ID.test(pageId)) return null;
  const expected = retryReference(pageId, retryKey, apiKey);
  return timingSafeEqual(Buffer.from(reference.toLowerCase()), Buffer.from(expected)) ? pageId : null;
}
import { allowedOrigin, validateInquiry } from "../src/lib/inquiry.js";

export async function handleInquiry(req, res, environment = process.env) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ success: false });
  if (!allowedOrigin(req.headers.origin, environment))
    return res.status(403).json({ success: false });
  if (!req.headers["content-type"]?.startsWith("application/json"))
    return res.status(415).json({ success: false });
  const declaredLength = req.headers["content-length"];
  if (
    declaredLength !== undefined &&
    (!/^\d+$/.test(String(declaredLength)) || Number(declaredLength) > 16000)
  )
    return res.status(413).json({ success: false });
  // Vercel parses JSON before invoking the handler. Bound the parsed payload as
  // well, including requests without Content-Length; the platform's own body
  // limit remains the first line of defense against huge raw request streams.
  const data = req.body;
  let size;
  try {
    size = Buffer.byteLength(
      typeof data === "string" ? data : JSON.stringify(data ?? {}),
    );
  } catch {
    return res.status(400).json({ success: false });
  }
  if (size > 16000) return res.status(413).json({ success: false });
  if (typeof data === "string") return res.status(400).json({ success: false });
  if (!data || typeof data !== "object" || Array.isArray(data))
    return res.status(400).json({ success: false });
  if (
    typeof data.website !== "undefined" &&
    (typeof data.website !== "string" || data.website.trim())
  )
    return res.status(400).json({ success: false });
  if (
    !Number.isFinite(data.startedAt) ||
    Date.now() - data.startedAt < 2000 ||
    Date.now() - data.startedAt > 86400000
  )
    return res.status(400).json({ success: false });
  const invalid = validateInquiry(data);
  if (invalid.length) return res.status(400).json({ success: false, invalid });
  if (
    typeof data.turnstileToken !== "string" ||
    !data.turnstileToken.trim() ||
    data.turnstileToken.length > 2048
  )
    return res.status(400).json({ success: false });
  const apiKey = environment.RESEND_API_KEY?.trim();
  const from = environment.INQUIRY_FROM_EMAIL?.trim();
  const to = environment.INQUIRY_TO_EMAIL?.trim();
  const turnstileSecret = environment.TURNSTILE_SECRET_KEY?.trim();
  const notionToken = environment.NOTION_API_TOKEN?.trim();
  const dataSourceId = environment.NOTION_DATA_SOURCE_ID?.trim();
  if (!apiKey || !from || !to || !turnstileSecret || !notionToken || !dataSourceId || !PAGE_ID.test(dataSourceId))
    return res.status(503).json({ success: false });

  // Only validated inquiry fields go into provider payloads, never the challenge or retry reference.
  const text = [
    ["Name", data.name], ["Email", data.email], ["Company", data.company],
    ["Current situation", data.today], ["Help requested", data.help],
    ["Budget", data.budget], ["Timeline", data.timeline],
  ].map(([label, value]) => `${label}: ${value?.trim() || ""}`).join("\n\n");
  // Stable for retries of the same form entry, excluding each fresh Turnstile token.
  const retryKey = createHmac("sha256", apiKey)
    .update(JSON.stringify([req.headers.origin, data.startedAt, text])).digest("hex");
  const isRetry = Object.hasOwn(data, "retryToken");
  const existingPageId = isRetry ? verifiedRetry(data.retryToken, retryKey, apiKey) : null;
  if (isRetry && !existingPageId) return res.status(400).json({ success: false });
  const notionHeaders = {
    "Authorization": `Bearer ${notionToken}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
  try {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret: turnstileSecret, response: data.turnstileToken }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!verification.ok) return res.status(502).json({ success: false });
    const challenge = await verification.json();
    if (challenge?.success !== true ||
      challenge.hostname !== new URL(req.headers.origin).hostname ||
      challenge.action !== "inquiry")
      return res.status(400).json({ success: false });

    // A confirmed partial response contains a signed page reference: retry only
    // the email, after verifying that the original page still exists in our source.
    const stored = await fetch(existingPageId ? `${NOTION_PAGES_URL}/${existingPageId}` : NOTION_PAGES_URL, {
      method: existingPageId ? "GET" : "POST",
      headers: notionHeaders,
      ...(!existingPageId && { body: JSON.stringify(notionRecord(data, dataSourceId)) }),
      signal: AbortSignal.timeout(10000),
    });
    if (!stored.ok) return res.status(502).json({ success: false });
    const page = await stored.json();
    if (!isSavedPage(page, existingPageId, dataSourceId))
      return res.status(502).json({ success: false });
    const pageId = page.id;
    const retryToken = retryReference(pageId, retryKey, apiKey);

    let accepted = false;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`,
          "Idempotency-Key": `inquiry/${retryKey}`,
        },
        body: JSON.stringify({
          from, to: [to], subject: "Project inquiry — gianbarboza.com",
          reply_to: data.email.trim(), text,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        const result = await response.json();
        accepted = typeof result?.id === "string" && !!result.id.trim();
      }
    } catch {
      // The provider may have accepted the email before losing the response.
      // Resend's stable idempotency key protects an immediate retry in its window.
    }

    let statusSync = "pending";
    try {
      const update = await fetch(`${NOTION_PAGES_URL}/${pageId}`, {
        method: "PATCH", headers: notionHeaders,
        body: JSON.stringify({ properties: {
          "Aviso por email": { select: { name: accepted ? "Aceptado por Resend" : "Falló" } },
        } }),
        signal: AbortSignal.timeout(10000),
      });
      if (update.ok) {
        const updated = await update.json();
        if (updated?.object === "page" && updated.id === pageId) statusSync = "updated";
      }
    } catch {
      // The record exists even when its email-status update cannot be confirmed.
    }
    if (accepted) return res.status(200).json({ success: true, email: "accepted", statusSync });
    return res.status(202).json({ success: true, email: "pending", statusSync, retryToken });
  } catch {
    // A lost Notion create response is unknown, not proof that no row was saved.
    return res.status(502).json({ success: false });
  }
}

export default function handler(req, res) {
  return handleInquiry(req, res);
}
