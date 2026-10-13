# Inquiry delivery: Resend and Turnstile
Objective: Repair the reported live inquiry failure on a new branch from merged `main`; preserve the four-route site and truthful delivery states.
Scope: The owner selected Resend and Cloudflare Turnstile managed mode. Provider credentials, verified sender domain and actual live delivery remain external prerequisites.

## Specs
S1. Reported failure: "me dio este error.\n\nOct 13 12:11:48.77\nPOST\n502\nwww.gianbarboza.com\n/api/inquiry" and "ale nviar el form". Reproduce the observable 502 behavior through the function with isolated provider failure before replacing the delivery route; do not assert the exact live upstream cause without its logs.
S2. Owner proposal and choice: "sera que usamos resend?" → "Migrar a Resend (recomendado)". Preserve server-side validation, rejection without provider acceptance, the entered fields on failure and no secret in the browser. A successful provider API acceptance is not proof of recipient inbox delivery.
S3. Owner proposal and choice: "y agregamos el capchat de cloduflare en el form por si acaso?" → "Sí, Turnstile administrado". Verify the token on the server before forwarding and surface recoverable EN/ES form feedback. No client-side widget alone may approve a submission.
S4. Existing project constraints: Keep the four routes, localized copy, accessible form feedback, honeypot/timing guard, and no simulated delivery; document configuration without committing credentials. Actual live acceptance and retention require a human-controlled deployment/test.

## Tasks
- [x] T1 (S1-S2, server, `eb861e9`): Replaced Web3Forms forwarding with Resend API acceptance checks, retained validation and tested 502/503/invalid/no-side-effect boundaries and stable idempotent retries.
- [x] T2 (S3-S4, client, `eb861e9`): Integrated managed Turnstile on EN/ES forms with token/reset/failure states, localized copy and 14 client checks using the `turnstileToken` contract.
- [x] T3 (S2-S4, parent, `eb861e9` + task-log commit pending): Documented environment setup and ran combined checks and independent verification. Functional browser rendering was unavailable in this environment; no live provider call was made.
- [ ] T4 (S1-S4, external verification blocked): Verify configured sending domain, secrets and site key for each intended Vercel environment, actual Resend API acceptance, recipient inbox receipt and privacy/retention after an owner-authorized deployment and live submission.

## Log
L1. me dio este error.\n\nOct 13 12:11:48.77\nPOST\n502\nwww.gianbarboza.com\n/api/inquiry
L2. ale nviar el form
L3. sera que usamos resend?
L4. y agregamos el capchat de cloduflare en el form por si acaso?
L5. Owner selected "Migrar a Resend (recomendado)" and "Sí, Turnstile administrado" in the questionnaire. The previous server sent to Web3Forms; its official API reference warns that server-side calls need a paid plan and IP allowlist. No production upstream response/log was observed, so the exact cause of the reported 502 is not proven. PR #4 was merged into `main` at ca69fb0; work began on `fix/inquiry-resend-turnstile` from that merge.
L6. T1/T2 and README/package test wiring committed together as `eb861e95952f940d5a099b02f893f4cd598880fb`. Isolated RED: 42 provider contract failures and 6 widget failures before implementation; combined GREEN: `npm run typecheck` 0 diagnostics, `npm run test` 32/32, `npm run test:build` 114/114 (34 built-output, 66 provider, 14 client), `git diff --check` clean. An independent verifier found a P2 unknown-acceptance copy defect; focused RED 2 failures, correction added Resend retry-stable HMAC Idempotency-Key and truthful EN/ES uncertainty copy, focused GREEN 2 passes, followed by full checks above. Independent recheck found no remaining concrete blocker. Native committed-only ASSESS for this work unit returned medium risk and `reviewDue:false` (`under_budget`); no ordinary review was started. No browser runtime was available for breakpoint/widget smoke, and no production upstream logs, verified domain, Vercel credentials, live Resend acceptance, recipient receipt or retention evidence was available. T4 waits on these external conditions. No push, PR, merge or deployment has been authorized for this new branch.
