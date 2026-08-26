# Platform

Web Task Agent is a local-first research platform for long-running browser work, evidence-backed analysis, and repeatable operator workflows.

If you want the shortest possible mental model, use this one:

1. start a job with the CLI
2. let the runner search, fetch, extract, and synthesize
3. inspect the stored job, report, and artifact bundle
4. resume, rerun, or recover if the run stops early
5. use the hardening gate before treating the local setup as ready enough

## What Makes It Useful

- jobs keep durable state in SQLite
- queue workers can pick up long runs later
- prompt traces and workflow packages stay on disk for review
- recovery and debug commands make interrupted runs understandable
- budget and cleanup commands keep long-lived local setups manageable

## Operator Surfaces

- `workflow` for opinionated research templates
- `agent` for free-form research jobs
- `queue` for queued execution control
- `job` for inspection, recovery, budgets, and logs
- `storage` for maintenance, cleanup, and the hardening gate
- `worker` for background execution
- `server` for the local dashboard and API

## Output Layout

- `.cache/` for resumable local state
- `.data/web-task-agent.sqlite` for durable structured state
- `reports/` for human-facing deliverables
- `reports/workflows/<template>/<topic-slug>/` for stable workflow bundles

## Ready Enough

The local platform is in good shape when:

- `storage gate` passes
- `job report` is easy to interpret
- `job budget` does not expose obvious slow paths
- `storage cleanup --prompt-traces <path>` keeps trace manifests bounded
- the docs still match the commands people actually use

## Where To Go Next

- [README](../../README.md)
- [CLI Reference](cli-reference.md)
- [Getting Started](getting-started.md)
- [Queue, Worker, And Controls](queue-worker-controls.md)
