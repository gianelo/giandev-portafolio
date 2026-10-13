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
  if (!process.env.PUBLIC_WEB3FORMS_KEY)
    return res.status(503).json({ success: false });
  try {
    const payload = {
      access_key: process.env.PUBLIC_WEB3FORMS_KEY,
      subject: "Project inquiry — gianbarboza.com",
      from_name: data.name,
    };
    for (const field of [
      "name",
      "email",
      "company",
      "today",
      "help",
      "budget",
      "timeline",
    ])
      payload[field] = data[field] || "";
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return res.status(502).json({ success: false });
    const result = await response.json();
    return res
      .status(result.success === true ? 200 : 502)
      .json({ success: result.success === true });
  } catch {
    return res.status(502).json({ success: false });
  }
}
