# API And Dashboard

The repository includes a local management server that exposes both:

- a simple HTML dashboard
- JSON endpoints for local operators and tooling

## Start The Server

```bash
npm run start -- server run --port 4317
```

## Main Endpoints

```text
GET  /
GET  /api/health
GET  /api/jobs
GET  /api/jobs/:id
GET  /api/jobs/:id/events
GET  /api/jobs/:id/events/stream
POST /api/jobs/:id/control
GET  /api/queue
POST /api/queue/:id/control
GET  /api/recoverable
```

## What The Dashboard Shows

- stored jobs
- queue state
- recoverable runs
- job detail inspection
- live event logs
- pause, resume, cancel, retry, and rerun controls

## Live Logs

Selected jobs expose live event logs through:

- stored run events
- an SSE stream on `/api/jobs/:id/events/stream`

## Why This Matters

For long-running local research, visibility is as important as prompt quality. The dashboard makes it much easier to answer:

- Is the job still moving?
- Did it pause or fail at a checkpoint?
- Which queue item owns this run?
- Can I recover it or rerun it safely?
