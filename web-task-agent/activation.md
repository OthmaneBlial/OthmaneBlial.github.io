# Activation measures

Web Task Agent is local-first and has no required telemetry. These measures are operator- or maintainer-recorded release signals, not hidden product analytics.

## Definitions

| Signal | Definition | Evidence | Why it matters |
| --- | --- | --- | --- |
| `first_success_completed` | A clean tarball install exports and verifies the demo | `npm run first-success` output | A new user reached the first useful artifact |
| `receipt_verified` | A recipient runs offline verification on a shared package | `receipt verify` output or attached log | The handoff is inspectable, not just readable |
| `decision_diff_shared` | A reviewer opens a generated diff and can name the changed evidence | `receipt compare` artifact | The product explains change, not only conclusions |
| `case_study_reproduced` | Someone reproduces one of the three documented studies | Redacted command and receipt | The story survives outside the maintainer machine |
| `contribution_started` | A focused issue, discussion, fixture, or pull request follows the contribution loop | Public link or repository artifact | Interest becomes reusable product evidence |

## Baseline and review cadence

Record a dated baseline in a release note or issue. Review these signals after each release and case study. Do not infer product-market fit from stars alone: pair stars with installs, verified receipts, reproduced case studies, and contributions.

## Privacy boundary

No event is sent by the CLI. Maintainers should record only aggregate counts or public links, never prompts, source contents, API keys, browser profiles, or private reports.
