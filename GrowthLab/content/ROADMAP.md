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
  reports, checkpoint-based CLI recovery, explicit selected-delivery recovery and
  the first explainable SEO page-hygiene rubric and a standalone local SEO audit are implemented. Native execution, provider-specific launcher registration and Linux
  confinement runtime proof still prevent marking this phase complete. Windows validation
  isolation is not implemented.
- [ ] **3 — UX/demo:** growth-native onboarding, tree/battle/detail/console/
  evidence/rubric/settings screens, keyboard/mobile checks, one-command bundled
  demo, sanitized self-contained reports, badge, real screenshots/video,
  contributor/security/community documents and release packaging.
  CLI reports and GrowthLab home/workspace/goal/battle/evidence/diff/delivery
  screens are implemented through Rust APIs. Complete tree/settings/localized
  UX and visual/performance evaluation remain pending. Restricted previews
  of immutable static-source bundles pass Rust/HTTP and real desktop/phone checks;
  new runs also archive a verified desktop PNG when local Chromium is available.
  The PNG is a render artifact, not a quality score. The bundled
  key-free `growthlab demo` replay and real Home launch pass local CLI/HTTP and
  browser checks; a concise real recording, quality evaluation and release
  packaging remain pending.
- [ ] **4 — Playbooks:** focused roles and practical positioning, activation,
  onboarding, ethical discovery, pricing research and launch templates with evidence.
  The ten read-only role contracts are available locally and in the dashboard;
  executable, evidence-producing playbook workflows remain pending.
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
