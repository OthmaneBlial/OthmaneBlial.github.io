# Native presentation gallery

Every example is synthetic and built by the Rust CLI. Editable objects, typed stories, integrity receipts and diagnostics are included. Historical Python decks outside this directory do not certify these native outputs.

- [Fieldwork — the research workspace](startup-pitch/README.md) — midnight, 9 slides
- [A roadmap with room to learn](product-roadmap/README.md) — product, 7 slides
- [Where AI earns a place in the workflow](ai-strategy/README.md) — technical, 7 slides
- [Make the runtime boundary explicit](engineering-architecture/README.md) — technical, 7 slides
- [A quarter of focus, not a list of activities](quarterly-business-review/README.md) — consulting, 8 slides
- [Choose the operating model the team can sustain](consulting-recommendation/README.md) — consulting, 8 slides
- [Find the reachable first market](market-analysis/README.md) — research, 7 slides
- [A launch that earns the next release](launch-plan/README.md) — modern, 7 slides
- [Turn a recovery into a reliability decision](incident-postmortem/README.md) — terminal, 8 slides
- [Make the next step visible](design-review/README.md) — swiss, 7 slides
- [What the pilot can and cannot tell us](research-report/README.md) — research, 8 slides
- [Evaluate the pilot before funding scale](investment-memo/README.md) — investor, 7 slides
- [A proposal built around one customer outcome](sales-proposal/README.md) — editorial, 8 slides
- [A migration boundary the team can test](technical-rfc/README.md) — mono, 7 slides
- [Start with an owned decision](project-kickoff/README.md) — minimal, 7 slides
- [The decision behind the update](executive-briefing/README.md) — midnight, 8 slides
- [Choose where the company will say no](company-strategy/README.md) — investor, 8 slides
- [Compare mechanisms, not marketing claims](competitive-analysis/README.md) — consulting, 7 slides
- [Reduce the paths that can expose a project](security-review/README.md) — technical, 7 slides
- [Storyboard Studio — an inspectable presentation compiler](open-source-overview/README.md) — swiss, 7 slides

Rebuild all examples with `node scripts/native/generate-gallery.mjs` after `cargo build --release`. Node is authoring tooling, not a product runtime.
