# Web Task Agent

> ## Make a web-research decision your team can audit — before they have to trust it.
>
> Web Task Agent turns a messy question into a local decision package with the sources, contradictions, recovery state, and next validation still attached.

[![CI](https://github.com/OthmaneBlial/web-task-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/OthmaneBlial/web-task-agent/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![243 executable workflows](https://img.shields.io/badge/workflows-243%20executable-0f766e)](examples/workflows/CATALOG.md)
[![Local-first](https://img.shields.io/badge/privacy-local--first-164e63)](PRIVACY.md)
[![Project site](https://img.shields.io/badge/site-live-0f766e)](https://othmaneblial.github.io/web-task-agent/)

Most research tools stop at an answer. Web Task Agent preserves the path to it: source snapshots, evidence clusters, contradictions, recovery state, and the smallest next validation. The result is a handoff that survives a browser closing, a challenged recommendation, or an interrupted run.

**Proof before setup:** [open the featured deterministic decision receipt](https://othmaneblial.github.io/web-task-agent/receipt.html). It is a standalone fixture with no key, browser session, scripts, analytics, or live request.

```text
Your question
  └─ “What should we validate before building this?”

Local decision package
  ├─ receipt.html                  Visual, portable decision handoff
  ├─ handoff/workflow-brief.md     Start here: recommendation + next validation
  ├─ report.md                     Findings, uncertainty, and contradictions
  ├─ evidence/sources.json         Source trail, role, and collection date
  ├─ package-manifest.json         Explicit, versioned file contract
  └─ runtime/                      Durable state for inspection and recovery
```

This is local research infrastructure, not a hosted scraper, access-control bypass, or generic browser-agent wrapper.

**See the full product story:** [live documentation](https://othmaneblial.github.io/web-task-agent/) · [eight inspectable receipts](RESEARCH_RECEIPTS.md) · [latest release](https://github.com/OthmaneBlial/web-task-agent/releases/latest)

The GitHub Packages mirror is available as `@othmaneblial/web-task-agent`. GitHub's npm registry requires a classic personal access token with `read:packages` even for public packages. Authenticate without committing that token, then install the mirror:

```bash
npm login --scope=@othmaneblial --auth-type=legacy --registry=https://npm.pkg.github.com
npm install @othmaneblial/web-task-agent
```

See [GitHub's npm-registry authentication guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry); never commit the token to `.npmrc` or the repository.

## Get a real package in two minutes — no key, browser, or network

Start with a deterministic research receipt. It has no API key, browser session, or network request, and shows the exact package shape a live workflow produces.

```bash
curl -fsSL https://raw.githubusercontent.com/OthmaneBlial/web-task-agent/main/install.sh \
  | bash -s -- --skip-llm-setup

web-task-agent demo export browser-agent-landscape
open reports/demos/browser-agent-landscape/receipt.html
```

You get a complete, source-linked handoff:

- `receipt.html` — a visual, standalone decision receipt with source cards, uncertainty, and the next validation.
- `handoff/workflow-brief.md` — the decision-ready reading start.
- `report.md` — findings, uncertainty, and the next validation.
- `evidence/sources.json` — the source trail with role and collection date.
- `package-manifest.json` — an explicit, versioned file contract.

Try the other deterministic demos with `web-task-agent demo list`. Every export includes a standalone `receipt.html` you can open locally or attach to a handoff. They are fixtures, clearly marked as such; they never pretend to be fresh research.

Read all eight versioned [research receipts](RESEARCH_RECEIPTS.md) directly in the repository: launch readiness, competitor mapping, GitHub feedback, technical writing, app-review opportunities, workflow quality, and local-first risk review.

## Why teams keep the package instead of just the answer

| When research goes wrong | What stays available |
| --- | --- |
| A run crashes halfway through | SQLite state, leases, heartbeats, queue recovery, and stage resume |
| A recommendation gets challenged | Source snapshots, quality signals, citations, evidence clusters, and contradictions |
| A teammate needs to act | A stable brief, report, raw evidence, manifest, drafts, and smallest next validation |
| A workflow becomes routine | 243 executable workflows, reusable presets, stable output paths, and deterministic fixtures |

The point is not to automate a web page. The point is to make the decision defensible after the browser closes.

## Run live research

Copy the safe template, set a narrow compatible API key only for live research, then choose a workflow and a topic:

```bash
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY (or a compatible endpoint) locally.

web-task-agent workflow list --category "Voice of Customer"

web-task-agent workflow run cybersecurity-voice-of-customer \
  --topic "security review workflow for SaaS teams" \
  --audience "product and security leads" \
  --preset focused
```

For the complete workflow catalog:

```bash
web-task-agent workflow list --search ecommerce
web-task-agent workflow list --category "Pricing and Packaging"
```

There are three focused core workflows plus 240 executable catalog workflows. Browse them in [examples/workflows/CATALOG.md](examples/workflows/CATALOG.md).

## Why this instead of a crawler or generic browser agent?

Browser automation and extraction are necessary infrastructure. Web Task Agent adds the operator-facing research contract:

| Need | Web Task Agent behavior |
| --- | --- |
| A job survives a crash | Durable SQLite state, leases, heartbeats, queue recovery, and stage resume |
| A recommendation is inspectable | Sources, snapshots, evidence clusters, citations, quality signals, and contradictions remain attached |
| A report is useful outside the terminal | Stable workflow package with brief, report, raw research, plan, drafts, manifest, and prompt trace |
| Work stays understandable on one machine | Local CLI, local dashboard, local storage, explicit output paths, and no required hosted control plane |
| A workflow is reusable | Presets, catalog metadata, topic-scoped output paths, examples, and deterministic package fixtures |

Use a crawler or a browser agent when you only need page control or extraction. Use Web Task Agent when the result must remain reviewable, resumable, and decision-ready.

## Find the research decision you actually need

Each catalog entry carries a distinct decision focus, source strategy, query set, expected deliverables, output package, and example. They are grouped by the decision to make:

- Voice of customer and feature-gap discovery
- Competitor mapping and market entry
- Pricing, packaging, segments, and buyer journey
- Launch positioning and content demand
- Integrations and partnerships
- Product validation, retention, and churn

The same decision families are available across AI developer tools, API platforms, DevOps, security, data, B2B SaaS, e-commerce, fintech, HR, education, wellness, creators, marketplaces, real estate, local business, sustainability, productivity, travel, and mobile apps.

## Operator controls

```bash
web-task-agent pack plan validate-an-idea --topic "local research assistant" --dry-run
web-task-agent browser status
web-task-agent workflow enqueue market-opportunity --topic "offline PDF tools"
web-task-agent worker run --once
web-task-agent queue list
web-task-agent job inspect <job-id>
web-task-agent job report <job-id>
web-task-agent job logs <job-id> --limit 100
web-task-agent job budget <job-id>
web-task-agent job export <job-id> --format markdown --redact --dry-run
web-task-agent job compare <earlier-job-id> <later-job-id> --redact --dry-run
web-task-agent storage gate
web-task-agent storage backup --output ./web-task-agent-backup.sqlite
web-task-agent server run --port 4317
```

`pack plan --dry-run` prints its report destinations plus aggregate query, candidate, and runtime bounds without writing a plan or launching a browser/LLM step. The bounds are deliberately not a price estimate: actual usage depends on the selected sources and model.

`browser status` reports whether the configured local CDP endpoint is Lightpanda, Chrome/Chromium, another CDP implementation, or unavailable — without starting or touching a browser. See the browser-backend table in the [getting started guide](docs/content/getting-started.md).

The dashboard is local at `http://127.0.0.1:4317`. Runtime data is kept outside the code tree:

- `.cache/` — resumable work state.
- `.data/web-task-agent.sqlite` — durable jobs, queue data, source/evidence metadata, and artifacts.
- `reports/` — human-facing packages.

Use `storage backup --output <path>` for a consistent local SQLite snapshot. `storage restore --input <path> --force` always writes a safety backup of the database it replaces.

## Safety and privacy

- Browser pages, search snippets, files, and LLM output are untrusted input.
- Do not use the project to bypass access controls, solve CAPTCHAs, or automate high-risk external actions.
- A local workflow can still send selected content to the LLM endpoint configured by the operator. Use the narrowest credentials possible.
- Never commit API keys, cookies, private reports, runtime databases, or prompt traces.
- Use `job export --dry-run --redact` before sharing. It previews the local package, recognizes common secret formats, and writes nothing or sends nothing unless you explicitly choose an output file.
- Direct source acquisition checks configured domain boundaries, resolves hostnames and rejects private or reserved DNS answers, applies public `robots.txt` rules when available, paces repeated domains, caps requests per domain, and quarantines unsafe redirect targets or configured review domains; it never bypasses access controls.

Read [PRIVACY.md](PRIVACY.md), [SECURITY.md](SECURITY.md), and [SUPPORT.md](SUPPORT.md) before running sensitive work or reporting a vulnerability.

## Develop and verify

```bash
npm ci
npm run typecheck
npm test
npm run generate:workflows
npm run audit:secrets
npm run release:check
npm run build
```

`npm test` runs deterministic fixtures for the standard CI path: it does not require an API key or live Play Store/AppBrain pages. `npm run audit:secrets` checks files Git could publish and reports only file, line, and credential type—never a suspected value. Live research remains an operator-invoked command, never a hidden test dependency.

`npm run release:check` adds the production dependency audit and a dry-run of the npm package. Follow [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) before any public release or visibility change.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md), then read the [workflow catalog](examples/workflows/CATALOG.md). Run `web-task-agent workflow validate <proposal/workflow.json>` after scaffolding: it checks the contribution contract without registering or launching it, including explicit freshness and bounded-cost fields. A useful workflow contribution has a repeated decision, a distinct source strategy, a stable evidence-backed output, a safety boundary, and a test/fixture — not just a renamed prompt.

Use [Discussions](https://github.com/OthmaneBlial/web-task-agent/discussions/1) for workflow ideas, reviewable receipts, and first-run questions. Use Issues for reproducible bugs and focused implementation changes.

## Documentation

- [Platform](docs/content/platform.md)
- [Getting started](docs/content/getting-started.md)
- [CLI reference](docs/content/cli-reference.md)
- [Workflow catalog](examples/workflows/CATALOG.md)
- [Example research receipts](examples/receipts/)
- [Research receipts guide](RESEARCH_RECEIPTS.md)
- [Roadmap](ROADMAP.md)
- [Release checklist](RELEASE_CHECKLIST.md)
- [Security policy](SECURITY.md)
