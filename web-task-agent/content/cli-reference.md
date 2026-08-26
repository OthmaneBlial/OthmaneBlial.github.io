# CLI Reference

The root help output is organized around the main operator paths:

- workflow discovery and execution
- general agent research jobs
- queue inspection and controls
- job inspection and controls
- worker execution
- local dashboard and API

## Common Commands

```bash
web-task-agent demo list
web-task-agent demo export <demo-id>
web-task-agent browser status
web-task-agent workflow list
web-task-agent workflow list --category <name>
web-task-agent workflow list --search <term>
web-task-agent workflow preview <template> --topic <text>
web-task-agent workflow run <template> --topic <text>
web-task-agent workflow enqueue <template> --topic <text>
web-task-agent workflow scaffold <new-workflow-id>
web-task-agent workflow validate <proposal/workflow.json>
web-task-agent pack list
web-task-agent pack plan <pack-id> --topic <text> [--dry-run]
web-task-agent agent run <instruction>
web-task-agent agent enqueue <instruction>
web-task-agent queue list
web-task-agent queue stats
web-task-agent job logs <job-id> --limit 100
web-task-agent job report <job-id>
web-task-agent job budget <job-id>
web-task-agent job export <job-id> --format markdown --redact --dry-run
web-task-agent job compare <earlier-job-id> <later-job-id> --redact --dry-run
web-task-agent storage maintain
web-task-agent storage backup --output <path>
web-task-agent storage restore --input <path> --force
web-task-agent storage cleanup --prompt-traces <path>
web-task-agent storage gate
web-task-agent worker run --once
web-task-agent server run --port 4317
```

## What To Use First

- `demo export` when you want to inspect the exact output contract with no key, browser, or network request.
- `browser status` when you want to confirm the local CDP backend without starting, restarting, or attaching to a browser.
- `workflow list --category` or `--search` when you want to find one of the 240 catalog workflows.
- `workflow preview` when you need to inspect one workflow's source strategy, queries, outputs, and budgets before doing work.
- `pack plan --dry-run` when you need the full ordered plan and its aggregate run bounds without writing a file.
- `workflow validate` when you want to check a proposal's required decision, source-policy, query, deliverable, freshness, bounded-cost, and risk fields before review.
- `workflow run` when you want a full research package immediately.
- `agent run` when you want a free-form instruction without a template.
- `queue list` and `job logs` when you are already operating a long run.
- `queue stats` when you want a quick status snapshot without scanning each queue item.
- `storage maintain` when you want database counts or a vacuum pass.

## Output Conventions

The commands print stable labels for:

- `Job ID`
- `Queue ID`
- `Job DB`
- `Cache`
- `Report`
- `Artifacts`

Those labels make it easier to copy values into follow-up commands or inspect paths in the filesystem.

## Artifact Discovery

Use `job inspect <job-id>` when you want to see:

- the stored job summary
- the report path
- the artifact directory
  - the artifact keys and file paths
  - the number of stored steps and evidence graph nodes

## Recovery Reports

Use `job report <job-id>` when you want a compact recovery-focused summary that highlights:

- whether the job is recoverable right now
- the recommended next command
- the latest stored events and error message

## Performance Budgets

Use `job budget <job-id>` when you want to check whether a long run spent too much time in:

- search
- fetch
- extraction
- synthesis

The report is soft, not fatal. It is there to catch obvious regressions before they become the new normal.

## Cleanup And Retention

Use `storage cleanup --prompt-traces <path>` when you want to trim an existing prompt-trace manifest without touching the job database or artifact evidence.

- `--max-traces` keeps the newest records and drops older ones
- `--dry-run` previews the change without rewriting the file

## Backup And Restore

Create a consistent SQLite copy without uploading any data:

```bash
web-task-agent storage backup --output ./web-task-agent-backup.sqlite
```

Restoration is intentionally explicit because it replaces the local database. It requires `--force`, validates the SQLite input, and first creates a safety backup of the current state (or writes it to `--backup <path>` when you choose the location):

```bash
web-task-agent storage restore \
  --input ./web-task-agent-backup.sqlite \
  --force
```

## Hardening Gate

Use `storage gate` when you want a quick readiness check for the local platform.

- storage health must be clean
- recoverable jobs should be resolved
- paused or failed queue items should be cleared before you call the system done enough

## Log Export

Use `job logs <job-id> --output <path>` to write the recent event history to a file for later review or sharing.

## Shareable Job Exports And Run Comparisons

Use `job export` to write a local Markdown decision receipt, structured JSON, or a CSV of cached source metadata. The command never sends content anywhere. It refuses overwrites unless `--force` is deliberate.

```bash
web-task-agent job export <job-id> --format markdown --redact --dry-run
web-task-agent job export <job-id> --format csv --output ./sources.csv
web-task-agent job compare <earlier-job-id> <later-job-id> --redact --dry-run
```

`--dry-run` previews the destination, source count, format, and redaction setting without writing a file. A comparison identifies new and disappeared cached sources and whether the report or its decision excerpt changed. Redaction recognizes common API, GitHub, AWS, and bearer-token patterns; it is a safety aid, not a license to share data the operator has not reviewed.

## Failure Messages

Most command failures now print a short action-oriented hint. The goal is to point you to the next useful command or missing environment variable instead of dumping a raw stack trace first.

## Environment Validation

Job-launching commands fail fast when the API key is missing. Set one of:

- `ANTHROPIC_API_KEY`
- `ZAI_API_KEY`
- `ANTHROPIC_AUTH_TOKEN`

before running `agent`, `workflow`, `github`, `playstore`, or `worker` commands.

## Source Boundaries

The runtime rejects malformed, credential-bearing, local, private-network, and configured blocked URLs before browser work begins. It also quarantines unsafe redirect targets and flags cross-origin redirects for review. Set these optional controls in `.env`:

```env
WEB_TASK_AGENT_ALLOWED_DOMAINS=docs.example.com,github.com
WEB_TASK_AGENT_BLOCKED_DOMAINS=example-bad-domain.test
WEB_TASK_AGENT_DOMAIN_MAX_REQUESTS=12
WEB_TASK_AGENT_REVIEW_DOMAINS=sensitive.example.com
```

Allow lists are intentionally restrictive: when configured, any domain outside the list is refused. Browser source acquisition is capped at 12 requests per domain by default; set `WEB_TASK_AGENT_DOMAIN_MAX_REQUESTS=0` only to deliberately disable the cap. Domains placed in `WEB_TASK_AGENT_REVIEW_DOMAINS` are quarantined before navigation until an operator reviews and removes them from that list. Source content is also treated as untrusted; pages whose text looks like prompt-injection instructions are flagged rather than treated as an operator command.
