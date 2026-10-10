# Git identity correction

## Intent and final authorization
Correct exact Gian Barboza <gbarboza@hablax.com> author/committer records to Gian Barboza <gianbarboza11@gmail.com>. User initially authorized full history rewrite, then restricted published and local updates to main and feat/open-design-integration; dev is absent. All other branch refs remain untouched. User separately authorized removing two affected GitHub merge signatures. Local identity configured; global configuration not written.

## Completed tasks
- [x] T1 Inventory refs and identities. Read-only scout plus bounded parent Git inventory: 66 commits, 36 work-email authors/committers, six local and five remote branches, no tags.
- [x] T2 Back up and rewrite selected branch history. Worker attempted delegation but refused Git history operations under its role restrictions; parent executed authorized Git-only operations. External complete bundle, refs/config/dirty-file backups and isolated rewrite prepared before mutation. Applied only two approved local branches and tracking refs. Atomic push used explicit original-OID --force-with-lease for each approved remote head.
- [x] T3 Independently verify. gentle-ai-verify checked preparation and actual published delivery; all checks passed. Metadata-only rewrite preserves every tree, so no functional build required. No source code edits.

## Verification and results
Preparation: 66/66 commit mappings, 67 parent edges, exact tree/message/date/name/other-header preservation except authorized identity changes and exactly two gpgsig removals (original merges 57c7ef7 and 1c5ec34). 36 author and 36 committer corrections. Complete recovery bundle verified.
Delivery: 5/5 live remote heads and 12/12 local/tracking refs correct; only main and feature changed. 65 delivered historical commits contain zero work-email authors/committers: 65 personal authors, 63 personal committers, two GitHub committers. Dirty Rentoru bytes/diff, tracking checksum and empty index preserved. Other branches retain original histories by explicit user instruction; GitHub-managed PR refs untouched. Global preservation lacks independent pre-operation baseline, but parent commands used local configuration only.
Main: e4e8fb426f6173f7e727ab57db4bf35137348e8b -> 11b7685e54c0054daedefcc0bc6b36100f2b29bc.
Feature rewritten tip before this evidence commit: eb16cb2d673426f71abde9e475c95fc182f6493e -> aa228ee2f1e2a5e2d41677bd9c3c0c495d17ac37.
Implementation: 3eddc7349226f765e9742abc310cae19aa840b2f -> 020bf68612b5d3ed8a280f5c57686404ebd4e620.

## Recovery
External backup: /var/folders/v2/63ndjq095ks8p2wv0wnw2txm0000gn/T/giandev-identity-backup-frljc07a/. Contains original.bundle, manifest.json (all mappings), delivery.json, original config, dirty patch and file copies. Temporary-directory storage may be cleaned by the OS; retain elsewhere if long-term recovery is needed. No garbage collection/reflog pruning performed.

## Closure
Identity correction and protected pushes complete. This passive evidence document is committed separately on the feature branch with personal identity. Unrelated odd/tasks/rentoru-case-study.md changes remain uncommitted. Other existing clones need to reconcile rewritten main/feature histories before pushing; do not merge the old history back.
