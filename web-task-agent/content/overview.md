# Overview

Web Task Agent is a **local-first, evidence-backed web research system** built on top of Lightpanda or Chrome DevTools Protocol, SQLite, and an Anthropic-compatible LLM endpoint.

It is not just a browser automation script. The current repository already supports:

- Planning a job before research starts
- Searching multiple queries
- Fetching result pages in batches
- Persisting sources, documents, extractions, and artifacts
- Synthesizing persisted evidence into a report
- Queueing jobs for local worker execution
- Recovering interrupted work instead of restarting from zero
- Preserving citations, freshness, source quality, and contradictions with the resulting brief
- Inspecting jobs through a local dashboard and API

The product promise is simple: turn a messy web question into a package a teammate can inspect, challenge, and resume. Start with a deterministic demo before configuring a browser or LLM.

## What It Is Good At

- Long research runs that may take hours
- Market or product research where you need durable notes and evidence
- Technical article research that should preserve contradictions and source traces
- Local operator workflows where everything should stay on one machine

## What The System Produces

The project writes both **database state** and **file artifacts**.

- SQLite stores jobs, steps, queue state, sources, canonical URLs, documents, extractions, evidence clusters, contradictions, graph links, and artifact metadata.
- The filesystem stores cache snapshots, reports, workflow briefs, raw research JSON, pipeline manifests, and prompt traces.

## Built-In Workflow Entry Points

- Three focused core workflows: `android-opportunity`, `article-research`, and `market-opportunity`
- 240 catalog workflows across 20 domains and 12 decision types
- Five review-gated decision packs for idea validation, launches, churn, defensible articles, and integrations

Every workflow produces a topic-based output folder under `reports/workflows/<template>/<topic-slug>/`.

## Main Operator Surfaces

- CLI for running, queueing, controlling, and inspecting work
- Recovery, budget, and cleanup reports for stored jobs and prompt traces
- Local worker mode for processing queued jobs
- Local management server with HTML dashboard
- JSON API for jobs, queue state, controls, recoverable runs, and logs

## Current Position

The standard test suite is fixture-backed and deterministic. Live research is intentionally separate: its sources and freshness must be reviewed at the time an operator runs it.
