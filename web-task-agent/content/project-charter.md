# Project Charter

This page is the working reference for how Web Task Agent should evolve.

## North Star

Web Task Agent should be a local-first research system that can:

- run long jobs without losing progress
- preserve evidence and provenance
- produce useful outputs instead of raw notes
- stay understandable to one operator on one machine

## Core Vocabulary

Use these terms consistently across docs, CLI output, and implementation notes:

- `job`: one research run with its own state and outputs
- `workflow`: a predefined job shape with its own presets and defaults
- `queue item`: a job waiting for a worker to claim it
- `artifact`: a file output registered in SQLite
- `source`: a canonicalized web reference that may be reused across runs
- `document`: a fetched or stored page snapshot
- `snapshot`: a stored capture of page content or state
- `extraction`: structured evidence pulled from a document
- `evidence cluster`: grouped claims and supporting material
- `handoff package`: the final workflow bundle that a human or downstream tool can use

Rules of thumb:

- Use `job` for the end-to-end run and `queue item` only while it is waiting to be claimed.
- Use `workflow` for named templates and presets, not for ad hoc instructions.
- Use `artifact` for on-disk outputs that are registered in SQLite.
- Use `source` and `document` to distinguish a canonical web reference from a fetched page snapshot.

## Architecture Map

The canonical flow is:

1. CLI command enters through `src/cli.ts`
2. The job is created or queued in the local store
3. The agent runner executes plan, search, fetch, extract, and synthesize stages
4. Evidence and artifacts are persisted in SQLite and on disk
5. The workflow package is written under `reports/workflows/<template>/<topic-slug>/`
6. The dashboard and API expose the job state back to the operator

Ownership boundaries:

- `src/cli.ts` should stay focused on command parsing and dispatch.
- `src/tasks/agent-runner.ts` owns stage orchestration and resume behavior.
- `src/lib/job-store.ts` owns durable job and evidence state.
- `src/lib/job-queue.ts` owns queue state and claim bookkeeping.
- `src/server/management-server.ts` owns operator-facing API and dashboard responses.
- `src/workflows/*` owns workflow shape, presets, and output packaging.

## Success Metrics

The project is healthy when:

- a first-time operator can get a useful run working without reading source code
- long runs can recover from interruption without losing the trail
- outputs stay grounded in stored evidence and source traces
- docs stay close to implementation behavior
- tests cover the places where state, recovery, and artifacts can regress

Helpful signals to watch:

- time to first useful run after clone
- percentage of interrupted jobs that resume cleanly
- number of docs pages that still match the code paths they describe
- number of high-risk paths covered by tests
- amount of time needed to inspect a failed job

## Maintenance Rules

- Keep runtime data out of git.
- Prefer local, small, reviewable changes over sprawling rewrites.
- Update docs whenever behavior changes.
- Treat the living roadmap as an execution checklist, not a wish list.
- Capture a commit reference when a phase is complete.
- Keep the roadmap entries in phase order so future progress is easy to scan.
- Prefer one commit per roadmap phase when the work is easy to separate.
- Update `base/roadmap.md` locally as work lands, even though it stays ignored by git.
- When a phase is split across multiple commits, keep the final commit reference in the roadmap entry.

## Runtime Layout

The project uses a small number of stable locations:

- `.cache/` for resumable local state
- `.data/` for durable SQLite data
- `reports/` for generated reports and workflow packages
- `base/` for the private living roadmap and other local-only planning notes
- `reports/workflows/<template>/<topic-slug>/` for the canonical workflow package output path
- `.data/web-task-agent.sqlite` for the main durable database file

## First Operator Journey

The shortest useful path should stay simple:

1. install dependencies
2. start Lightpanda
3. run a workflow or direct agent job
4. inspect the report package
5. open the local dashboard if the run is long or needs recovery

First 15 minutes checklist:

- confirm the environment file is populated
- run one built-in workflow before trying a custom job
- open the generated report package and verify the artifact paths
- check the dashboard once to see where the job state lives

## Quality Gate

Before a major change is considered done:

- the relevant tests should pass
- the docs should describe the new behavior
- the output package should still be easy to inspect
- the change should not break recovery, queueing, or artifact paths

Pre-merge checklist:

- verify the changed command path with a quick local run
- make sure the docs mention any new flags, files, or output paths
- confirm the roadmap entry for the work is updated after the commit lands
