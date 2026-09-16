# GrowthLab progress

Current milestone: **Phase 2/3/4 — read-only public URL audit, measurement analysis, playbooks and local-folder onboarding validated** (2026-09-16).
Overall completion: **about 65%, subjective estimate against the full specification**.
The configuration/import, explicit non-Git initialization, read-only URL audit and three-variant replay CLI slices pass locally.
Selected delivery and report behavior pass local Rust, real CLI and browser checks.
Recovery passes local Rust and real CLI interruption/legacy-archive checks.
Validation commands now require an OS confinement driver. macOS isolation and
sealed policy digests pass local checks; Linux runtime verification remains pending.
GitHub Actions is disabled at the user's request.
The GrowthLab API and initial dashboard pass local Rust/UI and synthetic real
browser checks. The bundled fictional replay now passes real CLI/HTTP and browser
checks, including an estimated SEO page-hygiene rubric and standalone local audit. Native-agent execution
and visual/performance evaluation remain open release gates; the repository now includes an eight-second
walkthrough assembled from the real browser captures.

The local measurement slice now accepts bounded UTF-8 CSV exports and reports
descriptive means, sample sizes, optional date range and arithmetic baseline
comparisons. Groups with repeated observations also expose exploratory 95% mean
and baseline-difference intervals. The browser dashboard exposes the same summary
from a local file. It is user-supplied **MEASURED** data; provider identity,
causality and statistical significance remain unverified.

## Completed

- Added a read-only public URL SEO audit in the CLI, local API and Home screen.
  It accepts one HTTPS page after a same-origin `robots.txt` check, follows no
  redirects, sends no credentials, bounds the UTF-8 response and applies the
  existing structural rubric as **ESTIMATED**. Refusals and limitations remain
  visible; no crawl, analytics provider or ranking claim is introduced.

- Added explicit local-folder onboarding. `workspace import --init-git` creates a
  local-only `main` snapshot for a reviewed, valid `growthlab.yaml`, rejects
  protected paths before the first commit and configures no remote. Existing
  repositories are never auto-committed. The API and Home form expose the same
  opt-in flag, with focused CLI/API tests covering both acceptance and refusal.

- Published [source prerelease v0.1.0-alpha.5](https://github.com/OthmaneBlial/GrowthLab/releases/tag/v0.1.0-alpha.5) at the validated source line. It adds exploratory 95% mean and baseline-difference intervals for repeated local observations, with matching CLI/browser calculations and documented descriptive limits.

- Published [source prerelease v0.1.0-alpha.6](https://github.com/OthmaneBlial/GrowthLab/releases/tag/v0.1.0-alpha.6) at the validated source line. It adds ten role-based growth playbooks with explicit questions, outputs and guardrails, exposed through the local API, dashboard and searchable docs.

- Published [source prerelease v0.1.0-alpha.4](https://github.com/OthmaneBlial/GrowthLab/releases/tag/v0.1.0-alpha.4) at the validated source line. It adds the browser-local measurement dashboard, keeps the CSV rows local, and includes no standalone binaries or installers.

- Published [source prerelease v0.1.0-alpha.3](https://github.com/OthmaneBlial/GrowthLab/releases/tag/v0.1.0-alpha.3)
  at the validated source line ending in `18cad1f2a617a942a744798b16435690eaf0fac1`.
  The release adds the standalone local SEO audit with JSON/Markdown output;
  all six workflows remain manually disabled and no binaries/installers are attached.

- Published [source prerelease v0.1.0-alpha.2](https://github.com/OthmaneBlial/GrowthLab/releases/tag/v0.1.0-alpha.2)
  at immutable source commit `4a3f073cc1e601ae58db87efa2b10c5e4d785b64`. GitHub
  confirmed public, non-draft prerelease metadata and tagged source archive links;
  no binaries/installers are attached. The release documents the explainable SEO
  page-hygiene rubric and the explicitly subjective 48% full-spec estimate. All
  six workflows remain manually disabled; source publication does not close
  pending product gates.

- Published the canonical [website](https://othmaneblial.github.io/GrowthLab/)
  and [searchable docs](https://othmaneblial.github.io/GrowthLab/docs.html). Native
  Pages build `79f66a22647f1270a42508a8fd3616d5862cb8f3` completed; landing, docs,
  CSS, JavaScript, status and the current 50% progress snapshot matched source
  bytes over HTTPS. Desktop/390px phone checks covered gallery/dialog, menu/Escape, docs
  filtering and actual command copy/paste, with fitting scroll widths and no
  captured console errors. No GitHub CI workflow was enabled or dispatched.
- Prepared source prerelease `v0.1.0-alpha.1`: fresh locked macOS arm64 release
  build and real release-binary import, selected delivery and HTTP demo smokes
  passed, including exact embedded UI assets. Added original dashboard dependency
  and font notices. Standalone binaries/installers and complete target distribution
  remain pending; this does not close the credible-release specification gate.

- Added explicit selected-delivery recovery for durable pending apply/export
  receipts. Inspection finalizes an exact candidate or existing export; `--resume`
  applies only files still matching the frozen baseline or creates the exact
  missing patch. Local files matching neither baseline nor candidate remain a
  pending conflict and are never rolled back. A per-workspace lease is inherited
  by Git children so an orphaned writer cannot be mistaken for completion. The
  focused battle suite passes **20 tests on both binaries**, including this
  interruption path, with HEAD/index/remotes and local conflict bytes preserved.

- Closed the local/SSH launcher registration gap: each detached launcher writes
  its own controller PID before payload work, and local submission waits for that
  registration before returning. Existing lifecycle and cancellation tests pass;
  provider-specific launchers remain a separate gate.

- Rebuilt the README around the working alpha: real variants, visible failure,
  archived previews, current local validation and explicitly pending product work.
  Added `docs/status.json` and a local-only synchronization command for README
  progress, badges and website status copies. Future validated milestones must
  update the shared status; no GitHub automation is enabled. The new README was pushed first, followed by the project website, then
  repository About/homepage/topics, as requested.

- Added opt-in `static_preview` configuration and CLI init flags. Candidate Git
  objects supply archived HTML/CSS/local assets, a bounded self-contained document
  and source/document hashes; mutable checkout contents cannot supply the preview.
  Existing configuration/run serialization stays unchanged when the option is absent.
- Added verified static-preview JSON and desktop/phone inspection with an opaque,
  inert iframe and restrictive archived CSP. Scripts, forms and navigation are
  removed; external/unsupported resources are blocked. A failed validation can
  still have a preview. Unavailable input records no fabricated document or image.
- Verified all three real demo pages in Chrome, including the failed variant's
  zero h1 elements and disabled selection. Desktop/phone widths fit, keyboard
  focus skips the frame and phone inspection tabs exceed 44px. Real manual UI
  captures are committed; each new ready preview attempts an automatic desktop
  PNG capture from the sealed document and verifies its archive digest. See
  [static-previews.md](static-previews.md).
- Added a deterministic `seo-page-hygiene-v1` rubric to the comparison and report.
  It scores eight visible structural signals (title, description, headings,
  language, useful copy, canonical, links and image descriptions) from the
  archived candidate HTML. Every dimension exposes its score and observation;
  the rubric is marked **ESTIMATED** and does not claim rankings, traffic,
  accessibility certification, performance or conversion lift.
- Added `growthlab seo-audit --html <file>` for a quick local review outside a
  battle. JSON and Markdown output share the eight-dimension rubric, reject
  symlinks and oversized/non-UTF-8 files, and make the no-network boundary
  explicit. This remains structural guidance, not ranking, traffic or conversion
  evidence.
- Expanded the rubric with deterministic next steps for every partial or missing
  dimension, and surfaced them in the CLI, dashboard and exported reports.
- Added an eight-second `docs/assets/growthlab-demo.mp4` walkthrough assembled
  from the real local browser captures; it is labelled as a visual reel, not as
  a continuous recording or an SEO outcome.
- Fixed a macOS cancellation probe race exposed by the full parallel suite.
  No-signal EPERM probes retry briefly while the owned group is reaped; persistent
  permission failures and actual signal failures still propagate. Existing real
  cancellation/group-gone assertions remain unchanged.

- Added `growthlab demo` and Home's **Run bundled demo**, sharing the real owned
  battle controller. Each creates an original fictional PatchKit baseline in a
  new private data-root directory and three actual competitor worktrees. Replay
  proposals are SIMULATED, actual checks OBSERVED and growth outcomes UNTESTED.
  Structure/links/claims exits reproduce **0/0/0, 2/0/0, 0/0/0**; the deliberate
  heading regression is ineligible, with no automatic selection or apply.
- Verified CLI demo startup does not invoke provider CLIs, resumes no inherited
  sessions/runs automatically, rejects Git repository overrides before seeding
  and preserves its clean fictional baseline. The real binary serves the built
  dashboard bundle, private reports and all three verified sealed attempts.
- Captured the real Home launch, running checks, failure breakdown and phone
  layout. Desktop/phone root and main scroll widths fit their viewport; keyboard
  focus is visible, the demo touch target is 44px and captured console warnings/
  errors are empty. Fixed route-first CSS layer ordering so the inherited base
  reset cannot override GrowthLab button styling. See [demo.md](demo.md).

- Reworked the bundled PatchKit surface so the demo shows the product's review
  loop directly: intent, proposed change, evidence and an explicit next action.
  The three real variants still keep the deliberate heading failure and the
  same observed `0/0/0`, `2/0/0`, `0/0/0` contract; no outcome claim was added.

- Verified authenticated GitHub account and absence of `OthmaneBlial/GrowthLab`.
- Created the public repository and preserved full upstream Git history locally.
- Set origin to `git@github.com:OthmaneBlial/GrowthLab.git` and upstream to
  `https://github.com/alphaXiv/OpenResearch.git`.
- Audited MIT permission/notice obligations; retained LICENSE and added NOTICE.
- Inspected Rust store, tree, Git/worktree, snapshot, run, harness/chat, prompt,
  skill, dashboard, UI, privacy and CI/release foundations. Recorded migration
  decisions in `openresearch-foundation.md`.
- Gated inherited upstream release dispatch/signing so this fork cannot publish
  an upstream-branded release on its initial push.
- Retained the full requested scope in SPEC.md and phase/release gates in ROADMAP.
- Added the native `growthlab` binary and compatible `orx` entry point, with
  separate default GrowthLab data/settings/cache namespaces and no upstream updater.
- Added strict versioned `growthlab.yaml`, atomic creation, three permission
  modes, allowed/denied path checks, symlink rejection and credential redaction.
  These checks are not yet agent process isolation.
- Added typed workspace/hypothesis/evidence/provenance records and transactional
  SQLite extensions with an independent migration ledger.
- Added local Git product import pinned to committed context/HEAD, workspace
  inspection, and three deterministic UNTESTED hypothesis templates. Input
  evidence is observed configuration, not market research or outcome evidence.
- Added real-binary CLI smoke validation of permissions, import, persistence,
  untouched product files/HEAD/remotes and refused updater cache preservation.
- Fixed an inherited database lease lifetime issue exposed by concurrent tests;
  a duplicated-descriptor regression failed before the fix and passes afterward.
- Added three competitors with a frozen contract and common imported source
  commit/digest, lab-owned branches/worktrees and transactional registration.
  Failed registration removes only its new worktrees/branches; moving the
  product HEAD does not move a prepared battle's baseline.
- Executed declared replay proposals as real allowed edits/commits, then ran
  configured commands on immutable candidate source archives. Actual failures,
  exit codes, bounded logs, timeout and cancellation remain inspectable.
- Added independent timeout watchdogs, descendant termination, exclusive
  execution leases and terminal-attempt rerun refusal using inherited job/run
  primitives. Host confinement is provided separately by the validation policy below.
- Sealed contract, proposal context/instructions, diffs, committed file artifacts
  and validation logs in digest-verified archives. SQLite rejects sealed run
  updates; comparison refuses tampered evidence.
- Added a pluggable transparent command comparison: replay proposals SIMULATED,
  executed checks OBSERVED and growth outcomes UNTESTED. Multiple eligible
  candidates require user review; no measured growth winner is inferred.
- Preserved the native harness registry with strict tools-disabled proposal
  capability checks. Only Claude declares that capability currently; native
  execution has not passed in this environment.
- Added explicit eligible-candidate selection and append-only delivery receipts
  in a transactional schema-v3 migration that preserves existing product data.
- Added selected patch export from exact committed objects, checked against
  sealed file artifacts. Mutable branches/worktrees cannot supply delivery contents.
- Added read-only apply preview and guarded product working-tree apply. Dirty,
  staged, untracked, sparse/assume-unchanged or changed-baseline/policy states are
  refused. External Git diff/fsmonitor execution is disabled and content filters
  refused before inspecting status. No automatic product commit/push occurs.
- Added create-only owner-private Unix patch/report files with collision and
  dangling-symlink refusal. Audit intent must persist before product delivery.
- Added self-contained HTML/Markdown reports with actual check failures, diff
  counts, selected candidate, digests, low confidence and visible provenance.
  Private context is withheld by default; disclosure and footer removal are explicit.
  Report summaries remain exportable when the original checkout is unavailable.
- Added transactional growth schema-v4 checkpoint records while preserving
  older sealed run serialization. Proposal context, committed files/diffs,
  collected logs and active job links are captured before external execution.
- Added explicit CLI recovery using the battle lease, verified checkpoints and
  registered jobs. Live jobs stay waiting; interrupted attempts remain failed
  or cancelled. Complete terminal checkpoints can finalize their original seals.
  Recovery never reruns providers/commands or reads/resets mutable worktrees.
- Required OS confinement for configured validation commands, with no unrestricted
  fallback. macOS restricts host files, network, signalling and other processes'
  information; candidate snapshots and private scratch remain writable. Linux
  bubblewrap support is implemented but has not run here; Windows is refused.
  Read-only system runtimes remain trusted inputs; resource quotas are not provided.
- Sealed exact confinement policies and SHA-256 metadata in active checkpoints,
  completed checks and reports. Recovery/comparison verify their digests; older
  checks without metadata retain their original seals and remain isolation-unverified.
- Kept captured logs outside the jail through trusted pipe relays. Unix cancellation
  now signals the registered process group directly and uses absolute process tools,
  preserving termination when the supervisor's PATH contains no tools.
- Added GrowthLab domain APIs for committed workspace import, hypotheses, battles,
  execution/cancellation/recovery, comparison, verified artifacts and explicit
  selected delivery/report downloads, reusing the exact Rust CLI battle engine.
- Added owned background controllers with captured Store roots, exact project
  admission and shared storage leases. Other dashboards cannot move storage
  during these API operations/controllers; live readers do not hold the execution
  gate. Shutdown requests cancellation only for owned workers.
- Added real HTTP integration tests with three genuinely live gated jobs, two
  eligible variants and actual exit 2. They verify cancellation/shutdown,
  storage/deletion guards, cross-origin refusal, verified SSE snapshots, artifact
  privacy/tampering refusal and explicit delivery with product HEAD/index/remotes
  preserved. Gates strengthened live-overlap proof without weakening assertions.
- Added GrowthLab home/recent workspaces, workspace/goal composer, battle cards,
  active checkpoint/sealed status, decomposable configured-check fractions,
  evidence and escaped diff/files/logs, explicit selection/export/apply preview
  and private-context-free report downloads through those APIs.
  Replay proposals, observed checks and untested growth outcomes remain distinct.
- Added deep-link UUID validation, keyboard inspection tabs, phone-accessible
  workspace links, theme support, stale-view guards and failed-evidence delivery
  refusal. Inherited research routes and their resume tests remain compatible.

## Work in progress

The Phase 1 identity/domain foundation is implemented. Public repository URLs,
website analysis, manual briefs and richer product context remain required work;
local non-Git folder initialization is now available behind an explicit flag.
Phase 2 has a tested replay CLI backend, selected delivery, local reports,
checkpoint-based CLI recovery, selected-delivery recovery and macOS validation
confinement validated locally. Local and SSH launchers now self-register their
controller PID before payload work. Native-agent verification, provider-specific
launcher registration and Linux confinement runtime verification remain pending.
The initial GrowthLab API/dashboard operations now pass local and real synthetic
browser checks. Local CSV measurement summaries now expose descriptive baseline
comparisons with sample sizes, date range and MEASURED provenance. Complete
tree/settings/localized UX, cautious statistical analysis, continuous recording and richer
quality evaluation remain pending. Restricted previews and archived PNG captures now pass local
Rust/HTTP and real browser checks. Windows validation is unsupported.

## Next three concrete tasks

1. Add a continuous screen recording and richer inspectable quality evaluation from
   the archived preview captures.
2. Add provider adapters and distribution-aware analysis over the local CSV summaries,
   then verify genuine native-agent proposals without inventing provider data.
3. Complete tree/settings/localized UX, executable playbook workflows, public
   repository URL/manual-brief inputs and cross-platform release packaging against
   the full specification.

## Architectural decisions

- Keep Rust/Axum/SQLite and inherited generic Git, run and harness primitives.
- Extend domain records; do not replace the upstream persistence model.
- Immutable source archives are insufficient for immutable evaluation evidence.
- GrowthLab defaults must not contact upstream telemetry/update/publishing
  services. Inherited compatibility screens are not a GrowthLab experience.
- Results require provenance per input/check; proxy ranking is a Recommended
  candidate, not a claim of measured conversion success.
- Docker is absent from the local workflow; inherited optional remote/release
  container artifacts are isolated pending GrowthLab release tooling.

## Latest validation

Standalone SEO audit and rubric unit tests (2026-09-16): **passed locally**;
the real binary emitted JSON and Markdown for a UTF-8 fixture and refused a
symlink input. Static-preview unit (2026-09-16): **passed locally**. Full `cargo test --locked`
passes **933 tests per binary, 931 passed, zero failures and two inherited ignored tests**;
Clippy with `-D warnings`, formatting, style checks and the debug build pass.
UI typecheck/i18n/build and **171 tests, zero failures/skips** pass; final `ui/dist`
is included. The real CLI demo regression verifies ready previews, exact served
built assets, source/document/seal hashes and its existing no-provider, privacy,
baseline and shutdown checks. Debug RustEmbed serves assets from disk; this is
not fresh release-binary embedding or installer proof.
The first full suite exposed an owned cancellation probe returning transient
EPERM after shutdown. After the bounded macOS probe fix, both complete suites pass;
permission-error regressions and the original real group-gone assertions pass.
Real dev-slot execution produces three sealed static bundles, nine observed checks
with exits **0/0/0, 2/0/0, 0/0/0**, zero omitted demo resources and no selection/apply.
Browser checks verify the actual candidate text/styles, 1280px/390px CSS viewports,
opaque/inert attributes, phone default, keyboard exclusion, no horizontal overflow
and empty captured warning/error logs. Hot reload interrupted an initial phone
selector read; final checks/capture ran after the build completed and a reload.
Automatic PNG archival, native providers, recording and release gates remain open.
All six GitHub workflows remain manually disabled; validation runs locally only.

Bundled-demo unit (2026-09-16): **passed locally**. `cargo test --locked` passes
**902 tests per binary, zero failures, two inherited ignored tests**;
`cargo clippy --all-targets -- -D warnings`, formatting and `cargo build --locked`
pass. UI typecheck/i18n build/style checks and **166 tests, zero failures/skips**
pass; generated `ui/dist` is included. `scripts/test-growth-demo.py` passes with
the real binary, built JS serving, nine actual checks, policy/seal verification,
private reports, provider sentinels, Git-override refusal and graceful shutdown.
The first full parallel suite exposed the new demo test's 20-second polling
deadline while two attempts still ran without controller errors. Its wait now
allows 60 seconds; all terminal, seal, exit-code, provenance and untouched-product
assertions remain, and both complete suites pass. Existing one-check API tests
retain their original wait budget. Real dev-slot Home execution reproduces the
same results and baseline preservation; owned tabs/viewport/slot are cleaned up.
Inherited build warnings about the route generator, CSS Highlight optimization
and large eager bundle remain visible. No GitHub workflow is enabled/dispatched.

Earlier validation evidence follows; it is not a release or provider claim.

- GitHub Actions: **disabled at the user's request (2026-09-16)**. All six
  workflows are `disabled_manually`; no active runs remain. Validation runs
  locally only. Workflow definitions are preserved for possible future reuse.

- `pnpm install --frozen-lockfile` in ui: **passed**.
- `node --test scripts/dev-slot.test.mjs`: **passed**.
- `node ui/scripts/check-i18n.mjs`: **passed**.
- `node ui/scripts/check-styles.mjs`: **passed**.
- `cargo fmt --all --check`: **passed**.
- `cargo test --locked`: **passed**, 900 tests per binary on macOS; 2 inherited
  tests ignored per binary (production telemetry contract and live Slurm cluster).
- `cargo clippy --all-targets -- -D warnings`: **passed**.
- Real macOS isolation checks: **passed**. Node can write its candidate/scratch
  files but cannot access synthetic host credentials, private lab directories/logs,
  escape through symlinks/hard links, signal an owned host process or connect to
  an owned localhost listener. Child processes inherit restrictions. Full process
  argument reads of an owned synthetic host process are denied; self reads work.
  Policy tampering is refused. No user credentials or user process arguments were read.
- Unix cancellation with an empty supervisor tool PATH: **passed**. The regression
  failed before direct process-group signalling and passes after it, proving the
  owned group is gone. Existing timeout/checkpoint assertions also pass unchanged.
- Recovery Rust checks: **passed**. Real gated child jobs survive controller
  interruption and remain waiting until terminal. Tampered checkpoints,
  unrelated controller paths and missing source digests refuse outcome changes.
  Missing process registration stays unverified. Terminal seal-finalization faults
  preserve complete checkpoints and sealed siblings; launch-checkpoint failure
  prevents command submission. Migration failures retain old records/version.
- `cargo build --locked` and real-binary `scripts/test-growth-cli.py`: **passed**.
  Three UNTESTED templates persisted; permissions rejected invalid targets;
  product files/HEAD/remotes and existing cache on refused update were preserved.
- Real-binary `scripts/test-growth-battle.py`: **passed**. Three real Git
  worktrees shared one baseline; two candidates passed and one failed with
  observed exit code 2. Explicit selection, patch export, apply preview and actual
  selected working-tree apply passed; HEAD/index/remotes were preserved. Default
  reports omitted private context; overwrite, rerun and evidence tampering were
  refused. Archived confinement policies matched every reported digest; reports
  withheld private policy paths. Product files stayed unchanged until explicit apply. These are synthetic fixtures,
  not native-agent or real growth-outcome evidence.
- Real-binary `scripts/test-growth-recovery.py`: **passed**, including actual
  older binaries in previous and current checks. Only its own synthetic CLI controller was hard-killed;
  three real child commands stayed alive on their registered handles. Recovery
  waited, then retained actual logs, exit 2, proposal context, diffs and committed
  file artifacts and confinement metadata with the product checkout unavailable. Interrupted attempts
  stayed failed and ineligible. Repeat recovery preserved seals; no new jobs were
  launched and the product HEAD/index/remotes/files stayed unchanged. Actual older
  sealed comparisons and selected patch export survived schema-v4 migration.
  Current isolation checks also preserve the exact comparison JSON and selected
  export of archives created by the actual pre-confinement `1117bf4` binary.
- HTML report browser review: **passed**, desktop 1600×782 CSS pixels and phone
  390×844 CSS pixels; scrollWidth equaled innerWidth with expanded command details,
  including new isolation labels and policy digests. Earlier seal/reproducibility
  review also passed. Keyboard Enter toggled a disclosure; actual failed exit 2,
  source and policy digests were inspectable. No captured warning/error
  logs. The page contained zero scripts and only a data favicon resource element.
  Temporary viewport override was reset. Real report screenshots are in
  `screenshots/cli-report-desktop.jpg` and `screenshots/cli-report-phone.jpg`, with
  current phone isolation details in `screenshots/cli-report-phone-isolation.png`;
  these show synthetic CLI report output, not the future dashboard or product renders.
- UI localized generation/typecheck/unit tests: **passed**, 166 tests. New view
  tests distinguish seals/checkpoints, completed selections and actual active
  command phases; deep-link tests preserve inherited route assertions.
- `pnpm build` in ui: **passed**, regenerated embedded assets. The inherited
  circular route-generator warning and eager bundle size warning remain visible.
  GrowthLab screen localization and bundle splitting remain pending.
- GrowthLab dashboard real Chrome flow: **passed** on an owned fictional product
  in an empty isolated development slot. UI import, goal preparation, local replay
  file loading and actual execution produced three real worktrees/checks. All
  three displayed active command execution; terminal exit codes were 0, 2 and 0.
  The failed candidate could not be selected. Actual source diffs, captured logs,
  observed failure/calculation/policy digests and private-context-free reporting
  were inspectable. No native execution or growth-outcome evidence is inferred.
- Dashboard selected delivery: **passed**. UI selection/export generated the
  exact reviewed patch while leaving the product untouched. A separate apply
  checkbox/button changed only the selected homepage in the owned fixture;
  actual filesystem checks preserved product HEAD/index/remotes and confirmed
  the completed delivery receipt. No product commit/push/deploy occurred.
- Dashboard responsive/keyboard checks: **passed**, desktop 1280×800 and phone
  390×844 CSS pixels. Root scrollWidth equaled innerWidth; main scrollWidth equaled
  clientWidth, including expanded failure details and wrapped artifact text.
  ArrowRight/End selected the artifact tab; keyboard Enter expanded the failed
  check. Phone Home exposed existing workspace links. Invalid non-Git import
  showed an actionable error without creating another workspace. No captured
  console warnings/errors. Temporary viewport override was reset and the owned
  browser tab closed after verification.
- Actual browser HTML report download: **passed**, 16,137 bytes, verified against
  the same API report apart from its fresh generation timestamp. Private product
  name/path were absent; SIMULATED/OBSERVED/UNTESTED remained visible. The browser
  download-event watcher timed out although the file was successfully saved;
  file contents provided the authoritative confirmation.
- Actual dashboard screenshots are committed in `screenshots/growth-battle-live.png`,
  `growth-battle-desktop.png`, `growth-battle-phone.png`, `growth-battle-phone-failure.png`
  and `growth-battle-phone-artifacts.png`. They show real Rust execution of an
  owned synthetic replay, not native-agent runs, candidate HTML renders or growth lift.
- Upstream baseline `node scripts/dev-slot.mjs start --db empty`: **passed**,
  backend 4901/UI 5201; slot subsequently stopped cleanly.
- Upstream baseline `/api/health`: **passed**, protocol 2, version 0.2.3.
- Upstream baseline Chrome initial onboarding render: **passed**, no captured error/warning logs;
  scrollWidth=innerWidth=1280. No broader interaction/mobile claim.
- Foundation/documentation GitHub CI for
  `53e40bcd77567fb11faafbe5f9987397dc891156`: **passed**.
- Battle backend commit `2eefabc3506bc449f99d970ac9445d1285031bdf`, CI run
  `35088486941`: **Linux passed; Windows failed** in an archive-tamper fixture
  Clippy check for clearing a read-only flag. Linux passed the real CLI smokes,
  874 tests per binary and the inherited private-output/ETXTBSY regressions.
  Removed unnecessary Windows flag clearing while retaining direct tampering
  and verification-refusal assertions. Selected delivery/report commit `76bedfa`
  ended with Linux/Windows Clippy failures before runtime checks. Replaced the
  constant `chunks_exact(2)` loop with checked `as_chunks::<2>()`; local Clippy
  and full tests pass. Cross-platform runtime validation remains unverified. GitHub CI
  will remain disabled per the latest user instruction.
- Community issue templates: **passed**, parsed with Ruby standard YAML.
- GitHub topics/discussions/private vulnerability reporting: **verified enabled**.

Known environment warning: installed external Claude CLI `--version` failed
during inherited harness detection. Native-agent execution is not verified.
Local CLI/domain/replay validation passed. Selected delivery/report behavior on Linux/Windows,
complete GrowthLab tree/settings/localized UX, native-agent battles, Linux confinement runtime verification,
provider-specific launcher registration, interrupted selected-delivery recovery,
real demo recording, richer quality evaluation, release installers and telemetry
adapters remain **unverified / not
implemented**. No growth lift, adoption, native-agent execution or public release
is claimed.
