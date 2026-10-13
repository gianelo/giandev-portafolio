import { createHmac } from "node:crypto";
import { allowedOrigin, validateInquiry } from "../src/lib/inquiry.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ success: false });
  if (!allowedOrigin(req.headers.origin))
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
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INQUIRY_FROM_EMAIL?.trim();
  const to = process.env.INQUIRY_TO_EMAIL?.trim();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!apiKey || !from || !to || !turnstileSecret)
    return res.status(503).json({ success: false });
  try {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: data.turnstileToken,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!verification.ok) return res.status(502).json({ success: false });
    const challenge = await verification.json();
    if (
      challenge?.success !== true ||
      challenge.hostname !== new URL(req.headers.origin).hostname ||
      challenge.action !== "inquiry"
    )
      return res.status(400).json({ success: false });

    // Only validated inquiry fields go into plain text, never headers or HTML.
    const text = [
      ["Name", data.name],
      ["Email", data.email],
      ["Company", data.company],
      ["Current situation", data.today],
      ["Help requested", data.help],
      ["Budget", data.budget],
      ["Timeline", data.timeline],
    ]
      .map(([label, value]) => `${label}: ${value?.trim() || ""}`)
      .join("\n\n");
    // A lost response must not turn a retry of the same inquiry into two emails.
    // The HMAC hides personal details from the provider's idempotency header.
    const retryKey = createHmac("sha256", apiKey)
      .update(JSON.stringify([req.headers.origin, data.startedAt, text]))
      .digest("hex");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Idempotency-Key": `inquiry/${retryKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Project inquiry — gianbarboza.com",
        reply_to: data.email.trim(),
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return res.status(502).json({ success: false });
    const result = await response.json();
    // API acceptance is not a claim of delivery to the recipient's inbox.
    const accepted = typeof result?.id === "string" && !!result.id.trim();
    return res.status(accepted ? 200 : 502).json({ success: accepted });
  } catch {
    return res.status(502).json({ success: false });
  }
}
