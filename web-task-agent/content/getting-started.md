# Getting Started

## 1. See A Real Package Before Configuring Anything

```bash
npm ci
npm run start -- demo list
npm run start -- demo export browser-agent-landscape
```

The bundled demos use checked-in fixtures. They do not call an LLM, open a browser, or request a source. Open `reports/demos/browser-agent-landscape/receipt.html` first for a visual decision handoff, then inspect `receipt.json`, the source snapshots, and `integrity-manifest.json`. Verify it with `web-task-agent receipt verify reports/demos/browser-agent-landscape`. The receipt is standalone: it has no scripts, analytics, or live requests.

For a source installation, use Node.js 22 or later. The `install.sh` helper can also create a local launcher; add `--skip-llm-setup` if you only want demos and local commands.

## 2. Configure Environment For Live Research

Start from the checked-in template, then set only the variables your live run needs:

```bash
cp .env.example .env
```

The template contains safe local defaults and no credentials. For example:

```env
CDP_PORT=9222
LIGHTPANDA_DISABLE_TELEMETRY=true
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_TIMEOUT_MS=90000
WEB_TASK_AGENT_DB_PATH=.data/web-task-agent.sqlite
```

The demo, catalog, pack plan, preview, and scaffold commands do not need a key. Job-launching commands fail immediately with a clear message when no compatible API key is configured.

### Cloud and local-compatible model endpoints

The runtime speaks the Anthropic Messages API. It works with a cloud-compatible endpoint such as the configuration above, or with a local endpoint that implements `POST /v1/messages` with Anthropic-compatible request and response shapes:

```env
ANTHROPIC_API_KEY=local-token-chosen-by-you
ANTHROPIC_BASE_URL=http://127.0.0.1:4000
ANTHROPIC_MODEL=your-local-compatible-model
```

This is not a generic OpenAI-compatible mode: use a proxy or local server that explicitly implements the Anthropic Messages contract, including its `x-api-key` authentication header. The automated suite starts a local endpoint fixture and verifies the request path, authentication header, payload, and parsed response without contacting a provider.

### Choose a browser backend deliberately

The fetcher attaches to a local Chrome DevTools Protocol (CDP) endpoint. Check the current choice without launching or navigating a browser:

```bash
web-task-agent browser status
```

| Backend | Best fit in this project | Operating boundary |
| --- | --- | --- |
| Lightpanda | Default managed, headless research backend | `npm run lightpanda:start` installs/starts it locally; its telemetry disable flag defaults to `true`. Treat site-specific compatibility as something to test on the target source. |
| Chrome or Chromium | An existing local CDP session when a source needs a fuller browser engine | Launch it yourself with a local debugging port (for example `scripts/start-chrome.sh --headless`). The project attaches through CDP; it does not use an authenticated browsing profile or bypass access controls. |
| Other CDP endpoint | Advanced operator setup | `browser status` labels it `unknown`; verify the CDP methods the workflow needs before a live run. |

Both paths keep durable job state, reports, and artifacts on disk. The browser only receives source URLs the operator asks the workflow to research; a live workflow may still send selected extracted evidence to the configured LLM endpoint.

## 3. Preview A Workflow Before Spending Time Or Tokens

```bash
npm run start -- workflow list --category "Voice of Customer"
npm run start -- workflow preview cybersecurity-voice-of-customer \
  --topic "security review workflow for SaaS teams" \
  --preset focused
```

The preview shows the planned queries, source boundaries, output folder, and preset budget without starting browser or LLM work.

## 4. Run Your First Research Job

### Direct Agent Run

```bash
web-task-agent agent run \
  "Research cheerful launch ideas for our product and write one evidence-backed post"
```

### Workflow Run

```bash
web-task-agent workflow run article-research \
  --topic "browser automation with Lightpanda and CDP" \
  --preset focused
```

If you are learning the system, run the workflow template first. It exercises the same durable pipeline but gives you a more structured output package.

## 4b. Choose A Pack When The Goal Is A Decision

If you need a sequence rather than one workflow, generate a review-gated plan:

```bash
web-task-agent pack list
web-task-agent pack plan validate-an-idea \
  --topic "offline document signing for independent contractors" \
  --dry-run
```

Packs only write a plan. They never launch a sequence of paid or browser actions without an explicit human review between steps. The dry run prints each stable report destination and aggregate query, candidate, and runtime bounds before it writes anything.

## 5. Inspect Outputs

After a run, expect state in these places:

- `.cache/` for resumable local state
- `.data/web-task-agent.sqlite` for durable structured storage
- `reports/` for markdown reports and workflow handoff packages

The quickest way to understand a fresh run is to open the workflow package first, then compare it with the stored job state and the local dashboard.

The main distinction to remember is:

- `.cache/` is for temporary resume state
- `.data/` is for durable job and queue data
- `reports/` is for human-facing outputs

### Suggested First Walkthrough

1. install dependencies
2. start Lightpanda
3. run `workflow run article-research` or export a demo
4. open the resulting report package
5. open the dashboard and compare the visible job state with the files on disk

## 6. Start The Local Dashboard

```bash
web-task-agent server run --port 4317
```

Then open the local management UI at `http://127.0.0.1:4317`.

The command accepts only `127.0.0.1` or `::1` for `--host`; it deliberately refuses LAN and public interfaces because the dashboard can inspect and control local jobs.

## First Commands Worth Memorizing

```bash
web-task-agent workflow list
web-task-agent workflow list --search ecommerce
web-task-agent workflow scaffold <new-workflow-id>
web-task-agent workflow validate <proposal/workflow.json>
web-task-agent queue list
web-task-agent job inspect <job-id>
web-task-agent job report <job-id>
web-task-agent job budget <job-id>
web-task-agent job logs <job-id> --limit 100
web-task-agent storage cleanup --prompt-traces <path>
web-task-agent worker run --once
```

## Where Workflow Packages Land

A workflow run typically writes a package shaped like this:

```text
report.md
handoff/
  README.md
  package-manifest.json
  research-summary.md
  workflow-brief.md
drafts/
  post-draft.md
  comments-draft.md
plan/
  plan.json
raw/
  research/
runtime/
  llm-prompt-traces.json
  pipeline-manifest.json
```

## Verify A Release Candidate

After `npm ci`, run:

```bash
npm run release:check
```

It runs the deterministic suite, checks production dependencies, and previews the npm tarball without publishing it. Then follow the root [release checklist](../../RELEASE_CHECKLIST.md) before publishing anything or changing repository visibility.

## Rehearse The Public First Success

The canonical public install is the versioned GitHub Release tarball plus its `SHA256SUMS` file. It needs no npm registry token. Before cutting a tag, run:

```bash
npm run first-success
```

This builds the package, installs the tarball into a fresh temporary directory, exports the deterministic browser-agent demo, and verifies its receipt offline. The exact gate and limits are recorded in [first-success evidence](../first-success.md). The release workflow runs the same check on Node 22 before attaching the tarball and checksum to the release.
