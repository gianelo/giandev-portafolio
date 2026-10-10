# Open Design integration

## Intent and constraints
Implement supplied Open Design project 7277ca5d-522d-4caa-9ade-0ff4e0d06f80/index.html in Astro, preserving EN/ES content, five cases/categories, routes/SEO, theme persistence/light accent convention, CV files/links and real Web3Forms behavior. No new frameworks/dependencies or mockup runtime/mailto. Unrelated Rentoru task changes preserved. No staging/commits/publication performed; owner audit required by repository policy. Forecast 1000–1500 authored diff lines, advisory heuristic only; native candidate measured 1493.

## Tasks
- [x] T1 Implement design and regressions. Delegated gentle-ai-worker (multi-file/preparation trigger): CSS, Hero/sidebar, Terminal in Journey, responsive navigation, flat sections, accessible accordion, modal styling, OG palette and build tests.
- [x] T2 Independently verify and correct integration. Delegated gentle-ai-verify (browser verification trigger), scoped CSS correction via writer. Completed 320px navigation reflow; independent recheck confirms no overlap and unchanged 375px+ geometry.

## Verification evidence
Worker test-first: six intended RED build failures, GREEN focused 22/22, final production/preview 23/23. Visual styling verified in browser rather than invented deterministic RED.
Independent npm run test:all: zero diagnostics, 22 unit + 23 build passing; production and preview build tests each 23/23. git diff --check passed.
Final browser rerun: 32 configurations (EN/ES × dark/light × 320/374/375/767/768/1023/1024/1440), 48 interaction checks and six modal geometry checks passed. No overflow/browser errors; controls >=44px; 24 configurations at 375px+ unchanged geometry after fix. Theme persistence/locale/PDF links, accordion semantics/focusability, modal focus trap/return/inert, mocked Web3Forms timing/invalid/sending/success/API/network cases and reduced-motion counters passed. No real messages sent. Evidence: /tmp/odd-verify-7277/report.json and screenshots.
Initial 320px overlap fixed and independently confirmed. Initial native assessment lacked untracked declaration; independent high-risk fallback applied. Native review review-84a15dac16fdb3f4 approved; acknowledgement completed with authority burned. Nonblocking informational R3-accordion-transitions at src/components/Projects.astro:121 retained as separate future work.
Skipped intentionally: CV generation (unchanged files), live deployed routing checks (local implementation not deployed). Real email delivery not tested; submission mocked.

## Outcome and next step
Implementation and local verification complete. Owner visual/code audit next; no source commits or deployment performed.
