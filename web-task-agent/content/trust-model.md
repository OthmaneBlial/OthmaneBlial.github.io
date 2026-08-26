# Trust Model

Web Task Agent is designed to make a research decision inspectable. It does not turn an unverified web page or model response into truth. The trust boundary is explicit so a reviewer can tell what the software proves, what it records, and what still needs human judgment.

## What the package proves

| Layer | Evidence produced | What it does not prove |
| --- | --- | --- |
| Acquisition policy | HTTPS-only targets, public-address checks, robots signals, redirect quarantine, domain pacing, and prompt-injection flags | That a publisher is honest or that a page is complete |
| Evidence linkage | Claims point to source IDs and excerpts; source records include canonical URL, role, and collection time | That the claim follows logically from the source |
| Artifact integrity | `integrity-manifest.json` stores SHA-256 hashes for exported files and snapshots | That the source content was correct before collection |
| Decision receipt | Decision, confidence, limitations, contradictions, and next validation are versioned in `receipt.json` | That the decision is suitable for every operator or context |
| Runtime durability | SQLite state, leases, events, and recovery metadata survive an interrupted run | That a resumed run has the same external web state |

Run `web-task-agent receipt verify <directory>` before sharing a package. Verification is offline and deterministic. A valid status means the package is internally consistent; it is not a fact-check, freshness guarantee, or authorization check.

## Data flow and boundaries

1. An operator supplies a topic, policy, and optional model endpoint. The local process writes job state and evidence to the configured state directory.
2. Search and browser fetches are constrained by the source-acquisition policy before navigation. Private or reserved network targets are denied; redirects are re-checked.
3. Pages can contain hostile instructions. Extracted text is evidence, never executable configuration. Injection indicators are recorded for review and are not passed through as operator commands.
4. A compatible model may receive the bounded instruction and selected evidence. The model endpoint, key, prompt trace, and request payload are operator-controlled; the project does not provide a hosted control plane or telemetry service.
5. The synthesised report and receipt are written locally. Redaction is available for exports, but operators must still inspect the package before sharing sensitive material.

## Operator checklist

- Treat every receipt as a reviewable hypothesis, not an authority.
- Re-open the cited excerpts and check the collection date for decisions with cost, safety, legal, or security impact.
- Keep API keys, browser profiles, cookies, databases, prompt traces, and private reports outside Git.
- Use a narrow, operator-owned compatible endpoint for live research; deterministic demos make no network or model request.
- Share the receipt and its limitations together. Do not strip the invalidation conditions or contradictory evidence from the handoff.
- If a maintainer signs a receipt, treat the Ed25519 key ID as an authorship/byte-integrity signal only; it is not an approval of factual truth.

## Reporting a trust issue

If a package can bypass source policy, leak a secret, execute page instructions, or misrepresent verification, follow [SECURITY.md](../../SECURITY.md). Product-quality questions belong in [SUPPORT.md](../../SUPPORT.md) or a focused issue with a minimal, non-sensitive fixture.
