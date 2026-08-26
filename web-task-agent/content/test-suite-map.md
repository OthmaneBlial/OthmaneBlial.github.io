# Test Suite Map

This page maps the main product surfaces to the current automated coverage.

## Surface To Coverage

- Queue recovery and worker claims:
  - `src/tests/queue-recovery.test.ts`
  - `src/tests/job-controls.test.ts`
- Job controls and dashboard API:
  - `src/tests/management-server.test.ts`
  - `src/tests/management-server-security.test.ts`
  - `src/tests/api-contract.test.ts`
- Runtime summaries and structured logging:
  - `src/tests/runtime-summary.test.ts`
  - `src/tests/local-logging.test.ts`
- Workflow output packages:
  - `src/tests/workflow-output.test.ts`
  - `src/tests/debug-format.test.ts`
- Evidence quality and research synthesis:
  - `src/tests/research-quality.test.ts`
  - `src/tests/evidence-summary.test.ts`
  - `src/tests/recommendation-generation.test.ts`
  - `src/tests/claim-checklist.test.ts`
- Extraction, browser, and fallback behavior:
  - `src/tests/cdp-backend.test.ts`
  - `src/tests/extraction-dedup.test.ts`
  - `src/tests/scoring-balance.test.ts`
  - `src/tests/llm-synthesis-hardening.test.ts`
  - `src/tests/search-adapter-fallback.test.ts`
  - `src/tests/llm-compatible-endpoint.test.ts`
- Source trust and privacy:
  - `src/tests/source-policy.test.ts`
  - `src/tests/redaction.test.ts`
  - `src/tests/direct-source.test.ts`
- Product activation and contribution surfaces:
  - `src/tests/demo.test.ts`
  - `src/tests/decision-packs.test.ts`
  - `src/tests/workflow-catalog.test.ts`
  - `src/tests/workflow-scaffold.test.ts`
  - `src/tests/integration/cli-flow.test.ts` (three end-to-end review-gated decision packs)

## How To Use This Map

- If a change touches a listed surface, update the matching tests first or alongside the code.
- If a new surface appears, add a short test file and map it here immediately.
- Keep the map short enough that an operator can scan it before merging a risky change.

## CI Contract

`npm test` builds the project, runs unit and integration tests, regenerates the workflow catalog, verifies that `site/` mirrors the canonical `docs/` tree, and checks local Markdown links. GitHub Actions then audits publishable files for secrets and production dependencies. The test fixtures do not depend on live Play Store/AppBrain content or an LLM API key.

## Coverage Gaps To Watch

- long-run soak coverage for worker and recovery behavior
- explicit opt-in live-web smoke tests, kept separate from CI
- additional CLI regression coverage around new shortcuts
- production-hardening checks around storage cleanup and retention
