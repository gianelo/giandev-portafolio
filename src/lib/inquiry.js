export const limits = {
  name: 200,
  email: 200,
  company: 200,
  today: 5000,
  help: 5000,
  budget: 200,
  timeline: 200,
};
export function validateInquiry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return ["name", "email", "today", "help"];
  const invalid = [];
  for (const [field, limit] of Object.entries(limits)) {
    const value = input[field];
    if (
      value !== undefined &&
      (typeof value !== "string" || value.length > limit)
    )
      invalid.push(field);
    if (
      ["name", "email", "today", "help"].includes(field) &&
      (!value || typeof value !== "string" || !value.trim())
    )
      invalid.push(field);
  }
  if (
    typeof input.email === "string" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
  )
    invalid.push("email");
  return [...new Set(invalid)];
}
export function allowedOrigin(origin) {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return (
      url.origin === "https://gianbarboza.com" ||
      url.origin === "https://www.gianbarboza.com" ||
      (process.env.VERCEL_URL &&
        url.origin === `https://${process.env.VERCEL_URL}`) ||
      (process.env.NODE_ENV !== "production" &&
        ["localhost", "127.0.0.1"].includes(url.hostname))
    );
  } catch {
    return false;
  }
}
