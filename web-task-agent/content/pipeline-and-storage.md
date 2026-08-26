# Pipeline And Storage

## Research Pipeline

The current agent run is not monolithic anymore. The system is split into durable stages:

1. Plan the job
2. Search sources
3. Fetch result pages
4. Persist documents and extract evidence
5. Synthesize persisted research
6. Write the report and workflow package

This staged structure matters because it enables:

- Stage-level resume
- Clear step tracking in the job database
- Easier debugging of interrupted work
- Larger runs across many fetched pages

## Search

Search runs through an adapter interface. The current default adapter uses DuckDuckGo HTML, but the pipeline is now shaped to support more adapters cleanly.

## Fetch

Fetching runs through a fetcher interface. The default fetcher opens readable pages through the browser/CDP path and batches fetch work so progress can be checkpointed.

## Extract

Extraction runs through an extractor interface. The default heuristic extractor is source-aware and adapts to:

- documentation-style pages
- forum/community discussions
- review-style pages

Low-quality or thin pages are filtered before evidence is persisted.

## Synthesis

The synthesis step now reads from **persisted evidence**, not only from in-memory research state. That means summaries and reports can be rebuilt from stored sources, documents, extractions, clusters, and contradictions.

## Durable Storage

The SQLite store keeps:

- jobs and steps
- leases and heartbeats
- queue state
- research queries
- sources and source aliases
- documents and snapshots
- extractions
- evidence clusters
- contradictions
- evidence graph nodes and edges
- artifact metadata

## Canonicalization And Reuse

The system canonicalizes URLs so later runs can reuse source rows and document snapshots instead of refetching the same page every time.

## Artifact Files

The database stores **artifact metadata and paths**. The actual artifact file contents live on disk under paths such as:

- `reports/`
- `.cache/`
- `reports/workflows/<template>/<topic-slug>/`

## Prompt And Runtime Traces

Workflow packages now include:

- `runtime/llm-prompt-traces.json`
- `runtime/pipeline-manifest.json`

These files are useful when you need to understand what the run asked the model to do and where the pipeline paused or failed.
