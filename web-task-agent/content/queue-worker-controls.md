# Queue, Worker, And Controls

## Queue A Job

You can queue either a general agent run or a workflow run.

### Queue A General Agent Run

```bash
npm run start -- agent enqueue \
  "Research three new SaaS positioning angles from current web discussion"
```

### Queue A Workflow Run

```bash
npm run start -- workflow enqueue android-opportunity \
  --topic "expense tracking for local merchants"
```

## Run A Local Worker

```bash
npm run start -- worker run --once
```

The worker claims queued jobs, heartbeats while they run, and completes or retries them based on durable queue state in SQLite.
It now exits cleanly on `SIGINT` or `SIGTERM` after finishing the current iteration.

## Queue Controls

```bash
npm run start -- queue list
npm run start -- queue stats
npm run start -- queue pause <queue-id>
npm run start -- queue resume <queue-id>
npm run start -- queue cancel <queue-id>
npm run start -- queue retry <queue-id>
```

## Job Controls

```bash
npm run start -- job pause <job-id>
npm run start -- job cancel <job-id>
npm run start -- job resume <job-id>
npm run start -- job rerun <job-id>
npm run start -- job inspect <job-id>
npm run start -- job report <job-id>
npm run start -- job budget <job-id>
npm run start -- job logs <job-id> --limit 100
```

## What Recovery Looks Like

The project now supports:

- execution leases
- heartbeats
- stale-run recovery
- stage-level resume
- resumed queued stale-run recovery

That means a long job can pause, be interrupted, or be recovered by a later worker without starting from zero.

## Queue Readability

`queue list` now prints each item with stable labels for:

- queue ID
- status
- attempts
- job ID
- label

That makes it easier to scan the queue without mentally decoding a compact status string.

## Job Log Readability

`job logs` now prints a short header and then expands each event into:

- timestamp
- event type
- message

That makes long history dumps easier to read without losing the underlying data.

## Recovery And Debug Views

- `job inspect` shows the stored job summary, artifacts, steps, and evidence graph counts.
- `job report` adds a recovery-focused command recommendation.
- `job budget` surfaces soft latency budgets for search, fetch, extraction, and synthesis.

## Important Scope Note

Graceful pause, cancel, resume, and rerun are currently implemented for **agent jobs**. That covers general agent runs and the built-in workflows because both go through the same agent runner.
