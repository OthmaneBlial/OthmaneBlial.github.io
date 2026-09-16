# GrowthLab release notes

## Next

- Added deterministic local CLI archive packaging with the executable, demo,
  distribution guide, MIT/OpenResearch notices and every checked-in dependency
  notice. The offline verifier checks the checksum, archive paths and target
  runtime before an artifact is shared.
- Comparison rows and private JSON, Markdown and HTML reports now carry the persisted hypothesis ID that links each visible experiment-map branch to its frozen battle variant.
- Grouped the workspace experiment map into accessible role branches while preserving each persisted hypothesis ID through battle preparation and variant records. The map now supports controlled local edits while keeping evidence and frozen battle contracts stable; settings and localized interface work remain pending.
- Added a localized GrowthLab onboarding shell with a persisted six-language picker, refreshed copy on locale changes, and right-to-left document direction for Arabic and Persian. Battle and detail copy remain a follow-up slice.
- Comparisons and shareable reports now include the `static-render-hints-v1`
  rubric when a sealed preview has local Chromium checks. Its observed score is
  decomposed into viewport coverage, overflow, visible copy and metadata
  integrity; it remains separate from performance, accessibility and growth
  evidence.
- Comparisons and shareable reports now include the optional
  `browser-timing-hints-v1` rubric when a sealed Chromium capture includes
  timing entries. It decomposes desktop/phone DOM-ready, load, first-paint and
  metadata observations with explicit local-only limits; it is not Lighthouse,
  Core Web Vitals, accessibility, visual-regression, field-performance or
  growth evidence.
- Ready static previews now record observed local Chromium checks alongside
  verified desktop and phone PNGs: viewport coverage, visible text length,
  horizontal overflow and optional local navigation/paint timings. The checks
  describe the sanitized document and are not Lighthouse, Core Web Vitals,
  accessibility, visual-regression, real-user or growth evidence.
- Ready static previews now attempt verified desktop and phone Chromium PNGs;
  the inspector displays the capture matching the selected viewport.
- Added a browser-local measurement panel for user-supplied CSV exports. It shows descriptive means, sample sizes, date range and baseline comparisons without sending rows to a provider; causality and significance remain unverified.
- Added exploratory 95% mean and baseline-difference intervals for repeated local observations, with the normal-approximation assumptions shown in the CLI, dashboard and docs.

- Expanded the local SEO rubric with deterministic, dimension-specific next
  steps for partial or missing signals. Recommendations are now visible in the
  CLI, dashboard and HTML/Markdown battle reports.
- Added `growthlab measure --csv <file>` for a bounded, no-network summary of
  user-supplied telemetry. JSON and Markdown expose means, sample sizes, date
  range, arithmetic baseline comparisons, warnings and explicit MEASURED limits.
- Added an eight-second demo reel assembled from verified local browser captures.

## 0.1.0-alpha.3 — 2026-09-16 (source prerelease)

- Added `growthlab seo-audit --html <file>` for a quick local SEO page review
  outside a battle. JSON and Markdown output expose the same eight-dimension
  structural rubric used by the dashboard, with an explicit `ESTIMATED`
  provenance label and no network or outcome claims.

## 0.1.0-alpha.2 — 2026-09-16 (source prerelease)

- Added the deterministic `seo-page-hygiene-v1` comparison rubric. Each HTML
  candidate now exposes title, description, heading, language, copy, canonical,
  link and image-description signals with an `ESTIMATED` provenance label.
  The score is structural page guidance; it makes no ranking, traffic or
  conversion claim.
- Repositioned the README, repository About text and public site around GrowthLab
  as a simple SEO growth tool, with explicit credit to the OpenResearch foundation.

## 0.1.0-alpha.1 — 2026-09-16 (source prerelease)

- Published the project website and searchable documentation with actual captures.
- Rebuilt the README and added shared local-only progress synchronization.
- Retained original dashboard ISC/MIT and font OFL notices in source archives.
- Preserved OpenResearch history and MIT attribution; audited its Rust, SQLite,
  worktree, snapshot, run, agent-harness and dashboard foundations.
- Added canonical `growthlab` CLI and retained the `orx` compatibility entry point.
- Added `growthlab demo` and a Home launch button for the original fictional
  PatchKit replay. It creates its own private Git baseline and three real isolated
  proposals, runs structure/link/claims commands and seals actual results.
  One deliberate heading regression remains ineligible; growth outcomes are untested.
  CLI demo startup skips inherited automatic session/run restoration and provider
  monitors, refuses Git repository overrides and never selects/applies automatically.
- Added optional archived static-page bundles from committed permitted candidate
  source, with source/document digests, bounded resource expansion, unavailable
  status and frozen-archive verification. The dashboard displays desktop/phone
  views through verified JSON in an opaque, inert frame; scripts and external
  resources are blocked. Ready runs also attempt a local Chromium desktop PNG;
  its dimensions, size and digest are archived and rechecked. The image remains
  a render artifact, not a quality score.
- Fixed transient macOS cancellation probe errors during owned group reaping;
  persistent permission failures still propagate and group-gone checks remain.
- Added schema-v1 `growthlab.yaml` with explicit product/goal, permission prefixes,
  validation commands/timeouts, metrics/guardrails and bounded parallelism.
- Added atomic config creation, safe parse errors, protected-path/symlink checks
  and common credential detection/redaction.
- Added local Git workspace import pinned to committed product configuration,
  publication disabled, and transactional SQLite growth extensions.
- Added three untested starter hypothesis templates with explicit context,
  mechanism, baseline, source commit, confidence, risks and mandatory provenance.
- Isolated default GrowthLab data/settings/cache and refused the upstream
  updater/release comparison. Upstream publishing/signing jobs are gated away.
- Added three-variant frozen battle contracts, lab-owned Git worktrees/branches,
  compensated registration, real replay edits/commits and snapshot-based validation.
- Reused local controllers/generic runs with minimal environments, independent
  timeout watchdogs, bounded logs, persisted cancellation and descendant cleanup.
- Added atomic digest-verified run seals, immutable SQLite outcomes and pluggable
  transparent command comparison. Replay proposals are simulated; checks observed;
  growth outcomes untested. Native proposal capability checks fail closed.
- Added bounded Linux ETXTBSY retry for OpenCode version detection, retaining
  its deadline, unchanged-binary check and private capture assertions.
- Added explicit eligible-candidate selection and append-only delivery receipts
  through an independent transactional growth schema-v3 migration.
- Added immutable-object patch export and guarded working-tree apply with a
  read-only preview, clean-baseline/policy checks and sealed-artifact verification.
  Product commits, index and remotes are preserved; Git content filters are refused.
- Added create-only local patch/report files and self-contained HTML/Markdown
  reports with actual command failures, provenance, diff counts, selection and
  reproducibility digests. Private context is omitted by default; disclosure is
  explicit and footer attribution removable. Actual CLI report screenshots are
  committed; archived product render screenshots remain pending.
- Removed unnecessary Windows read-only flag clearing from the archive tamper
  fixture; its write-and-refuse-verification assertions remain intact.
- Added transactional growth schema-v4 checkpoint migration, durable attempt/job
  links and explicit recovery without command/provider reruns or worktree resets.
  Interrupted attempts remain failed/cancelled; verified complete terminal
  checkpoints can finalize their original seals without changing sealed siblings.
- Disabled all six GitHub Actions workflows at the user's request. Validation is
  local only until a new instruction enables automation.
- Required OS isolation for configured validation: macOS deny-by-default profiles
  and a Linux Bubblewrap namespace backend, with no unrestricted fallback.
  Captured policies/digests survive checkpoints, seals and recovery; public reports
  disclose static backend labels/digests without private policy paths. A pipe relay
  captures logs while supervisor files remain outside command permissions.
  Linux runtime proof is pending; Windows isolation is not implemented.

- Added GrowthLab domain APIs and local dashboard screens for product import,
  goal composition, three-variant execution, captured status/evidence/diffs/logs,
  check breakdowns, explicit selection/export/apply and report downloads.
- Owned API controllers retain project admission and shared storage leases;
  cancellation/shutdown preserve actual attempts. HTTP integration tests cover
  actual jobs, observed exit 2, cross-origin refusal, seal tampering and selected
  delivery without changing product HEAD/index/remotes.

This source prerelease is not the complete credible release in the specification. The complete experiment-tree/settings UX,
verified native execution, cross-platform confinement proof, incomplete launcher registration
and interrupted selected-delivery recovery,
real demo recording, richer visual evaluation and real outcome measurement
remain work in the roadmap. No telemetry lift, production readiness, public
installer or demonstrated adoption is claimed.
