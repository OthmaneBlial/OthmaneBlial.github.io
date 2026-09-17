# GrowthLab roadmap

The full requirements live in [SPEC.md](SPEC.md). A phase is complete only when
its working behavior and documented validation prove it. No release is claimed
by this roadmap.

- [x] **0 — Foundation:** audit upstream internals/license, validate inherited
  tests and isolated dashboard, preserve history, create public repository and
  remotes, publish attribution and migration map.
- [x] **1 — Growth domain:** native CLI, versioned `growthlab.yaml`, product
  contexts, typed hypotheses/permissions/provenance, SQLite migrations and tests.
- [ ] **2 — Landing-page loop:** common snapshot/contract, three isolated
  competitors, replay and native harness execution, configured validation,
  immutable run records, failure/cancellation recovery, evidence/diffs/artifacts,
  explainable comparison, safe selected apply/export and local reports.
  The replay CLI backend, explicit selected delivery and local HTML/Markdown
  reports, checkpoint-based CLI recovery, explicit selected-delivery recovery,
  the explainable SEO page-hygiene rubric, standalone local SEO audit,
  public-checkout import and distribution-aware local measurement are implemented.
  Native execution, provider-specific launcher registration and Linux confinement
  runtime proof still prevent marking this phase complete. Windows validation
  isolation is not implemented.
- [ ] **3 — UX/demo:** growth-native onboarding, tree/battle/detail/console/
  evidence/rubric/settings screens, keyboard/mobile checks, one-command bundled
  demo, sanitized self-contained reports, badge, real screenshots/video,
  contributor/security/community documents and release packaging.
  CLI reports and GrowthLab home/workspace/goal/battle/evidence/diff/delivery
  screens are implemented through Rust APIs. The workspace now shows a persisted
  three-branch experiment map and keeps its hypothesis IDs linked into battle
  variants. The experiment tree now supports controlled local edits while
  preserving hypothesis IDs and evidence; battle/detail localization is
  complete, while broader settings coverage remains pending, alongside
  browser-based visual regression/accessibility evaluation.
  Restricted previews
  of immutable static-source bundles pass Rust/HTTP and real desktop/phone checks;
  new runs also archive verified desktop and phone PNGs when local Chromium is
  available, together with observed viewport, overflow, visible-copy and
  optional local timing checks. Comparisons now expose a separate observed
  browser-timing hint rubric when those timings are present. These PNGs and
  checks are render inspection artifacts, not a quality score. The bundled key-free `growthlab demo` replay
  and real Home launch pass local CLI/HTTP and browser checks. Page-quality
  source hints are now shown beside the SEO rubric; a concise real recording,
  browser-based quality evaluation and signed release packaging remain pending.
- [ ] **4 — Playbooks:** focused roles and practical positioning, activation,
  onboarding, ethical discovery, pricing research and launch templates with evidence.
  The ten role contracts and deterministic local playbook runs are available in
  the CLI, API and dashboard; provider-backed research and evidence-producing
  workflows remain pending.
- [ ] **5 — Measurement:** CSV import, baseline/variant comparison, sample size,
  date range, provenance, cautious interval analysis and stable integration
  boundaries. Real telemetry is optional; no invented data.

## Release gate

A fresh user must install without Docker, start the dashboard, import a product
or load the demo, run three variants, inspect actual execution/failures and sealed
evidence, understand provenance, compare rubric inputs, safely apply/export a
selection, and reproduce the documented demo. Relevant inherited/new tests,
license/privacy obligations, real screenshots/video, accurate install docs,
contribution/security documents and tagged truthful release notes are required.

Local passing checks do not establish cross-platform runtime, agent-provider
authorization, analytics lift or publication. Track those gates independently.
