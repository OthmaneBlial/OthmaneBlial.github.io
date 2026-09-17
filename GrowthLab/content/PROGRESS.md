# GrowthLab progress

Current milestone: **Phase 2/3/4 — editable experiment tree with frozen lineage, localized GrowthLab onboarding, controlled local workspace settings edits, measurement and battle/detail UI, read-only settings contract overview, provider-neutral measurement boundary, deterministic local CLI packaging with complete notices, local Linux musl cross-target packaging, estimated accessibility structure hints, public repository review, manual-brief onboarding, executable playbooks, public checkout import and distribution-aware measurement analysis validated** (2026-09-17).
Overall completion: **about 94%, subjective estimate against the full specification**.
The configuration/import, explicit non-Git initialization, read-only URL audit and three-variant replay CLI slices pass locally.
Selected delivery and report behavior pass local Rust, real CLI and browser checks.
Recovery passes local Rust and real CLI interruption/legacy-archive checks.
Validation commands now require an OS confinement driver. macOS isolation and
sealed policy digests pass local checks; Linux runtime verification remains pending.
GitHub Actions is disabled at the user's request.
The GrowthLab API and initial dashboard pass local Rust/UI and synthetic real
browser checks. The bundled fictional replay now passes real CLI/HTTP and browser
checks, including estimated SEO, page-quality and accessibility structure rubrics and a standalone local audit. Native-agent execution
and full visual regression/assistive-technology evaluation remain open release gates; the repository now includes verified desktop and
phone render captures, observed local Chromium layout checks, a transparent static-render rubric plus a continuous
30-second walkthrough captured from an isolated Chrome profile.

The local measurement slice now accepts bounded UTF-8 CSV exports and reports
descriptive means, sample sizes, optional date range and arithmetic baseline
comparisons. An optional distribution or channel column keeps comparisons within
the same acquisition source. Groups with repeated observations also expose
exploratory 95% mean and baseline-difference intervals. The browser dashboard
exposes the same summary from a local file. It is user-supplied **MEASURED** data;
provider identity, causality and statistical significance remain unverified.

The measurement API now exposes a provider-neutral source registry. A typed read-only adapter contract backs the local CSV path; external provider adapters remain planned. Local CSV is
the only available source and is marked **MEASURED** with no network access;
privacy-friendly analytics, web and product analytics, A/B testing, search
performance and GitHub signals are explicit opt-in boundaries marked planned and
**UNTESTED**. No provider credentials, events or requests are implied.

The archived HTML evaluator now also exposes a separate **Page quality hints
(estimated)** record beside the SEO rubric. Ready sealed previews additionally
expose an **OBSERVED** static-render rubric when local Chromium produced the
capture metadata. It checks for a mobile viewport,
named links and buttons, labelled form controls and parser-blocking resource
hints. These signals are source-level prompts; they are not Lighthouse,
screen-reader, Core Web Vital or conversion evidence.
Battle comparisons, reports and standalone local/public page audits also show an
**ESTIMATED** accessibility structure rubric for language, landmarks, heading
hierarchy, image alternatives, named controls and form labels. It is a
source-level prompt and does not certify WCAG conformance or
assistive-technology behavior.
When the browser trace includes navigation timings, comparisons and reports also
show a separate **OBSERVED** browser-timing rubric for DOM readiness, load,
first-paint hints and metadata integrity. It is a local heuristic and does not
claim Lighthouse, Core Web Vitals, accessibility, visual regression or field
performance.

## Completed

- Added executable playbook runs. The CLI, API and workspace dashboard save deterministic role contracts with ordered answers, outputs and guardrails; every run stays UNTESTED.

- Added distribution-aware local measurement. CSV summaries accept an optional
  `distribution` or channel column and compare each variant only with the
  matching distribution baseline; absent columns use `all`. Rust and browser
  calculations stay aligned and make no provider request.

- Added the provider-neutral measurement source registry. The local API and
  browser panel enumerate the available CSV adapter and six planned external
  integration boundaries with network, status, provenance and limitation
  metadata; planned sources remain unconfigured and no provider is contacted.

- Added guarded local workspace settings edits. The selected contract can be
  edited before hypotheses exist; GrowthLab validates the complete schema,
  checks the recorded source and on-disk file for drift, replaces
  `growthlab.yaml` atomically and persists the matching local contract. Active
  battles, existing hypothesis maps and remote or automatic commits are
  refused.

- Localized the measurement panel across all six locale catalogs. Source status,
  file controls, summary headings, table labels, interval explanation and
  provenance limits now follow the shared language picker; Arabic and Persian
  continue to use the document's RTL direction.

- Added a local GrowthLab settings panel. Language and theme preferences can be
  changed from an anchored settings surface and remain browser-local; privacy
  and integration counts are visible without enabling a provider or changing
  product files.

- Expanded the settings surface with a read-only workspace contract overview.
  Product facts, permission mode, allowed and denied paths, validation commands,
  metrics, parallelism and source snapshot are visible for the selected local
  workspace; the home view lists local contracts without exposing secrets or
  enabling integrations.

- Localized the workspace contract labels and permission modes across all six
  locale catalogs. The dashboard now keeps the contract summary, paths,
  validation metadata and permission state readable in RTL as well as LTR.

- Included the committed product description in the read-only settings
  contract, keeping the complete product context visible without enabling file
  writes or provider integrations.

- Rendered the same contract panel on the selected workspace route, so a
  workspace owner can inspect its settings beside the experiment map instead
  of returning to Home.

- Added a typed, read-only measurement adapter contract. The local CSV implementation now runs through `LocalCsvAdapter`; planned provider entries remain unconfigured and no network request is implicit.

- Built and structure-verified a local `x86_64-unknown-linux-musl` CLI archive with `cargo-zigbuild` and Zig. The archive passes checksum, traversal/link and notice checks; Linux runtime and installers remain separate gates.

- Localized the Growth Battle detail surface across all six locale catalogs. Inspection tabs, explicit decision states and self-contained report actions now follow the shared language picker; Arabic and Persian keep the document's RTL direction.

- Added deterministic local CLI packaging and an offline release-archive verifier.
  Host-target archives include the executable, README, demo and distribution
  guide, MIT and OpenResearch notices, and all six checked-in dependency notice
  files. The verifier checks SHA-256, archive traversal/link safety and runs the
  binary only when the target matches the current operating system and CPU.
  Cross-platform runtime evidence, signing and release-attached installers stay
  separate gates.

- Added a conservative page-quality hint evaluator beside the SEO rubric. Battle
  comparisons and shareable reports expose five structural dimensions,
  recommendations and limits with **ESTIMATED** provenance; browser-based
  performance and accessibility validation remain separate release gates.

- Added observed local Chromium render checks to ready static previews. Each
  archived desktop/phone capture records viewport coverage, visible text length,
  horizontal-overflow status and optional local navigation/paint timings. The
  checks are inspectable **OBSERVED** traces of the sanitized document, not
  Lighthouse, Core Web Vitals, accessibility, visual-regression, real-user or
  growth evidence.

- Added the `static-render-hints-v1` rubric to comparisons and shareable reports.
  It decomposes observed desktop/phone capture coverage, overflow, visible copy
  and metadata integrity without combining those signals into a growth claim.

- Added the `browser-timing-hints-v1` rubric to comparisons and shareable
  reports when sealed Chromium captures include timing entries. It shows
  desktop/phone DOM-ready, load, first-paint and metadata dimensions with
  explicit local-only limits; it is not a Lighthouse, Core Web Vital,
  accessibility, visual-regression or real-user result.

- Carried persisted hypothesis IDs into comparison rows and private JSON, Markdown
  and HTML reports. Reviewers can trace a branch from the workspace map through
  its frozen battle variant without relying on a private database path.

- Added explicit public GitHub checkout import. The CLI, API and Home flow clone
  only into a new caller-selected folder, preserve an existing `growthlab.yaml`,
  or commit a supplied local contract when the checkout has none. The clone is
  never pushed or executed during import, and a missing contract stays an
  explicit setup error rather than silently inventing product context.

- Connected the workspace experiment map to battle preparation. Once a local
  three-hypothesis portfolio exists, its stable IDs and evidence lineage are
  reused by the frozen battle contract and variant records; older workspaces
  continue to use the deterministic starter fallback.

- Added controlled experiment-map editing. Users can revise hypothesis wording,
  mechanism, metric, thresholds, guardrails and risks locally; IDs, roles,
  source snapshots, evidence and decision provenance remain immutable, and edits
  are refused while a battle is ready or running.

- Added a localized GrowthLab onboarding shell. The dashboard language picker
  uses the shared persisted locale preference across six catalogs, refreshes the
  visible home flow after switching, and applies right-to-left document direction
  for Arabic and Persian. Battle/detail inspection, decision and report labels now follow all six locale catalogs; remaining dashboard technical detail copy and post-hypothesis settings policy remain open.

- Added public GitHub metadata review and manual-brief onboarding. `repo-audit` and the Home review panel make one unauthenticated metadata request without cloning or executing source. `workspace brief` and the Home form create a private local analysis snapshot with no remote or provider request.

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
  removed; external/unsupported resources are blocked. Ready candidates now
  attempt both desktop and phone PNG captures from the sealed source when local
  Chromium is available. A failed validation can still have a preview.
  Unavailable input records no fabricated document or image.
- Verified all three real demo pages in Chrome, including the failed variant's
  zero h1 elements and disabled selection. Desktop/phone widths fit, keyboard
  focus skips the frame and phone inspection tabs exceed 44px. Real manual UI
  captures are committed; each new ready preview attempts automatic desktop and
  phone PNG captures from the sealed document and verifies their archive digests.
  See
  [static-previews.md](static-previews.md).
- Added a deterministic `seo-page-hygiene-v1` rubric to the comparison and report.
  It scores eight visible structural signals (title, description, headings,
  language, useful copy, canonical, links and image descriptions) from the
  archived candidate HTML. Every dimension exposes its score and observation;
  the rubric is marked **ESTIMATED** and does not claim rankings, traffic,
  accessibility certification, performance or conversion lift.

- Added an estimated `accessibility-structure-v1` rubric to battle comparisons,
  reports and the dashboard. It checks document language, landmarks, heading
  hierarchy, image alternatives, named controls and form labels from archived
  HTML, with explicit recommendations and limitations. It is a source prompt,
  not a WCAG, screen-reader, keyboard or assistive-technology result.
- Extended the same accessibility hints to standalone local and read-only public
  page audits so CLI JSON/Markdown, API responses and the dashboard use one
  explainable rubric surface.
- Added `growthlab seo-audit --html <file>` for a quick local review outside a
  battle. JSON and Markdown output share the eight-dimension rubric, reject
  symlinks and oversized/non-UTF-8 files, and make the no-network boundary
  explicit. This remains structural guidance, not ranking, traffic or conversion
  evidence.
- Expanded the rubric with deterministic next steps for every partial or missing
  dimension, and surfaced them in the CLI, dashboard and exported reports.
- Added a continuous 30-second `docs/assets/growthlab-demo-30s.mp4` screen
  recording captured from an isolated Chrome profile showing the public site and
  real browser evidence. It is labelled as a walkthrough, not an SEO outcome.
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
website analysis, manual briefs and local non-Git folder initialization are now
available behind explicit, bounded flows.
Phase 2 has a tested replay CLI backend, selected delivery, local reports,
checkpoint-based CLI recovery, selected-delivery recovery and macOS validation
confinement validated locally. Local and SSH launchers now self-register their
controller PID before payload work. Native-agent verification, provider-specific
launcher registration and Linux confinement runtime verification remain pending.
The initial GrowthLab API/dashboard operations now pass local and real synthetic
browser checks. The workspace experiment map is visible, groups persisted hypotheses by role in
accessible branches, supports local edits while preserving lineage, and reuses their IDs in battles. Local CSV measurement summaries now
expose descriptive baseline comparisons with sample sizes, date range and
MEASURED provenance. The GrowthLab onboarding shell now follows the shared
locale preference across six languages and applies RTL direction for Arabic and
Persian. Static-preview, evidence and rubric detail copy now uses all six
locale catalogs. Workspace settings expose an explicit lifecycle policy: edits
are available before hypotheses or active battles, then the control is disabled
with a localized explanation. Remaining action/status copy and full browser
quality/performance evaluation remain pending. Restricted previews, archived PNG captures and the
continuous public-site walkthrough now pass local
Rust/HTTP and real browser checks. Windows validation is unsupported.

## Next three concrete tasks

1. Add visual-regression and assistive-technology checks alongside the structural
   accessibility rubric.
2. Add provider adapters over the local measurement model, then verify genuine
   native-agent proposals without inventing provider data.
3. Complete the remaining dashboard action/status strings and cross-platform release
   packaging against the full specification.

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
symlink input. Static-preview unit (2026-09-16): **passed locally**. Full serial
`cargo test --locked -- --test-threads=1` passes **962 tests per binary, 962
passed, zero failures and two inherited ignored tests**;
Clippy with `-D warnings`, formatting, style checks and the debug build pass.
UI typecheck/i18n/build and **174 tests, zero failures/skips** pass; localized detail catalogs lint clean, and Chrome verified the pre-hypothesis edit control plus the post-hypothesis lock explanation; final `ui/dist`
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
The GrowthLab language selector was exercised in Chrome for Spanish and Arabic;
the onboarding shell refreshed its copy, Arabic set `dir=rtl`, desktop scroll width
remained equal to the viewport, and the tab recorded no warning/error logs.
The editable hypothesis API test preserves IDs, roles, evidence and frozen
battle contracts, and refuses updates while a battle is ready or running.
Native providers, richer quality evaluation and release gates remain open. The
continuous 30-second public-site walkthrough is now archived separately from the
short eight-second reel.
All six GitHub workflows remain manually disabled; validation runs locally only.
Local cross-target packaging (2026-09-17): **passed structure verification**. `x86_64-unknown-linux-musl` built with `cargo-zigbuild` and Zig; the offline verifier passed checksum, archive safety and all required notices. The ELF was not run on Linux, so runtime and installer proof remain pending.

Bundled-demo unit (2026-09-16): **passed locally**. `cargo test --locked` passes
**902 tests per binary, zero failures, two inherited ignored tests**;
`cargo clippy --all-targets -- -D warnings`, formatting and `cargo build --locked`
pass. UI typecheck/i18n build/style checks and **174 tests, zero failures/skips**
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
- UI localized generation/typecheck/unit tests: **passed**, 174 tests. New view
  tests distinguish seals/checkpoints, completed selections and actual active
  command phases; deep-link tests preserve inherited route assertions.
- `pnpm build` in ui: **passed**, regenerated embedded assets. The inherited
  circular route-generator warning and eager bundle size warning remain visible.
  Bundle splitting remains pending.
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
remaining dashboard technical detail copy and post-hypothesis settings policy, native-agent battles, Linux confinement runtime verification,
provider-specific launcher registration, interrupted selected-delivery recovery,
real demo recording, richer quality evaluation, cross-platform release installers and telemetry
adapters remain **unverified / not
implemented**. No growth lift, adoption, native-agent execution or public release
is claimed.
