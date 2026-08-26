# Testing And Hardening

## Current Automated Coverage

The repo currently includes automated tests for:

- queue recovery
- job controls
- management API controls and endpoints
- prompt traces
- research quality filters and extractor behavior
- workflow output packaging
- interrupted agent checkpoints

At the time this site was generated, the standard suite has **117 unit tests and 4 integration tests** and covers many of the highest-risk local operator paths.

## Working Quality Bar

The project is healthiest when these remain true:

- recovery behavior survives interruption without data loss
- workflow outputs stay tied to evidence and source traces
- docs describe the current command flow and artifact layout
- queue controls stay safe to use on long-running jobs
- new changes add or update tests where state or recovery can regress

Useful health signals:

- first-run setup should stay short and obvious
- interrupted jobs should resume with minimal manual cleanup
- artifact inspection should not require database spelunking
- docs drift should be rare and easy to spot

For a more detailed product-surface view of the tests, read the test suite map page in the docs site.

## Pre-Merge Checklist

- run the relevant test subset or full build for the touched area
- confirm the docs and examples still match the command or output shape
- confirm the artifact layout and runtime paths still look the same to an operator
- run `storage gate` before treating the local platform as ready enough for the current phase
- update the living roadmap with the commit reference when the phase is complete

## Current Hardening Position

Most of the large platform milestones are already complete:

- browser and task foundation
- durable job execution
- deep research pipeline
- durable storage and reuse
- evidence analysis layer
- workflow templates
- queue and worker mode
- API and dashboard
- job controls and live logs
- research quality hardening
- workflow output polish

## Remaining Focus

The remaining emphasis is:

- broader failure-mode coverage
- stronger recovery and debug artifacts for long local runs
- tighter verification around workflow and runtime outputs

## Maintenance Rules

- Keep the living roadmap updated as phases land.
- Mark completed phases with `[x]` and record the commit that did the work.
- Treat docs drift as a regression when behavior or paths change.
- Keep commit messages narrow enough that one roadmap phase maps cleanly to one commit when possible.
- If a phase ends up spanning multiple commits, record the last commit that completed the work.

## Repo Source Pages

This site also includes copied versions of:

- the repository `README.md`
- the repository `ROADMAP.md`
- generated catalog workflow examples and the mirrored static site

Use those when you want the exact project-authored source text inside the portable site.
