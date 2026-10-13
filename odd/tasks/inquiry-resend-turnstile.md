# Inquiry delivery: Resend and Turnstile
Objective: Repair the reported live inquiry failure on a new branch from merged `main`; preserve the four-route site and truthful delivery states.
Scope: The owner selected Resend and Cloudflare Turnstile managed mode. Provider credentials, verified sender domain and actual live delivery remain external prerequisites.

## Specs
S1. Reported failure: "me dio este error.\n\nOct 13 12:11:48.77\nPOST\n502\nwww.gianbarboza.com\n/api/inquiry" and "ale nviar el form". Reproduce the observable 502 behavior through the function with isolated provider failure before replacing the delivery route; do not assert the exact live upstream cause without its logs.
S2. Owner proposal and choice: "sera que usamos resend?" → "Migrar a Resend (recomendado)". Preserve server-side validation, rejection without provider acceptance, the entered fields on failure and no secret in the browser. A successful provider API acceptance is not proof of recipient inbox delivery.
S3. Owner proposal and choice: "y agregamos el capchat de cloduflare en el form por si acaso?" → "Sí, Turnstile administrado". Verify the token on the server before forwarding and surface recoverable EN/ES form feedback. No client-side widget alone may approve a submission.
S4. Existing project constraints: Keep the four routes, localized copy, accessible form feedback, honeypot/timing guard, and no simulated delivery; document configuration without committing credentials. Actual live acceptance and retention require a human-controlled deployment/test.

## Tasks
- [ ] T1 (S1-S2, server, commit pending): Replace Web3Forms forwarding with Resend API acceptance checks; retain validation and test real boundary via mocked providers including 502/503/invalid/no side effects.
- [ ] T2 (S3-S4, client, commit pending): Integrate managed Turnstile on EN/ES forms with token/reset/failure states, local copy and structural/client checks; coordinate `turnstileToken` field with T1.
- [ ] T3 (S2-S4, parent, commit pending): Document environment setup, review security/content, run combined checks and independent verification; live provider acceptance, recipient delivery and privacy/retention stay blocked until credentials/domain/deployment and authorized human testing.

## Log
L1. me dio este error.\n\nOct 13 12:11:48.77\nPOST\n502\nwww.gianbarboza.com\n/api/inquiry
L2. ale nviar el form
L3. sera que usamos resend?
L4. y agregamos el capchat de cloduflare en el form por si acaso?
L5. Owner selected "Migrar a Resend (recomendado)" and "Sí, Turnstile administrado" in the questionnaire. The current server sends to Web3Forms; its official API reference warns that server-side calls need a paid plan and IP allowlist. No production upstream response/log was observed, so the exact cause of the reported 502 is not proven. PR #4 was merged into `main` at ca69fb0; work begins on `fix/inquiry-resend-turnstile` from that merge.
