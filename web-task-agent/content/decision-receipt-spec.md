# Decision Receipt specification

`Decision Receipt v1` is a portable, provider-neutral claim-to-evidence contract for AI-assisted research decisions.

## Version identifiers

- `schemaVersion: 1` selects the JSON shape family.
- `specVersion: "1.0.0"` selects the semantic contract.
- `profile: "minimal" | "full"` states whether the producer emits only the review contract or the complete Web Task Agent package.

Patch releases clarify text or validation without changing accepted receipts. Minor releases add optional semantics. A v1 reader ignores fields it does not understand, while canonicalization and manifest hashes continue to cover their bytes. Major releases require a migration and may reject previously valid receipts. Unknown major versions fail explicitly.

## Required review contract

Every receipt includes:

- the decision title and summary;
- provenance kind and known producer versions;
- claims with `supported`, `contradicted`, or `insufficient` status;
- evidence references linking each claim to a source and non-empty excerpt;
- source metadata, collection date, capture type, and optional snapshot hash;
- contradictions, limitations, and the smallest next validation;
- an integrity-manifest pointer and optional Ed25519 operator signature.

An `insufficient` claim needs an explicit limitation. A `contradicted` claim needs at least one evidence relation marked `contradicts`.

## Canonical signature bytes

Signatures cover UTF-8 bytes of the receipt without its `signature` property. Object keys are sorted recursively, arrays retain their order, properties with `undefined` values are omitted, JSON uses no insignificant whitespace, and one final newline is appended.

The signature marker is `canonical-receipt-without-signature`. Earlier experimental signatures using insertion-order pretty JSON are not v1-compatible.

## Paths and URLs

- Artifact paths are relative POSIX paths and may not be absolute, contain backslashes, empty components, `.` or `..` components.
- Source URLs must use public HTTP(S) and may not embed credentials.
- A producer must refuse private-network targets, unsafe redirects, access-control bypasses, cookies, or authenticated session data before a source enters a shareable receipt.

## Integrity and truth boundary

`integrity-manifest.json` declares SHA-256 and byte counts for receipt files. Verification checks available file bytes, snapshot hashes, evidence excerpts, and optional signatures.

Successful verification does **not** prove that a source or claim is true, complete, authorized, representative, or fresh. It proves only that the checked contract and bytes were internally consistent.

## Limits and migration

The structural schema does not impose arbitrary caps on claim or source counts. Implementations should bound input bytes and rendering work at their trust boundary. The core is pure and in-memory; callers decide those operational limits.

The experimental schema-v1 format from Web Task Agent 0.5.1 lacked `specVersion` and `profile`. `migrateDecisionReceipt()` upgrades unsigned receipts, after which the manifest must be regenerated. Experimental signatures must be removed and re-created because their canonical bytes differ. See the [compatibility matrix](../../COMPATIBILITY.md).

## Machine-readable contract

- [JSON Schema](../../schema/decision-receipt.v1.schema.json)
- [Conformance recipes](../../conformance/cases.json)
- [Core SDK](../../packages/decision-receipt/README.md)
- [Compatibility and migration](../../COMPATIBILITY.md)
- [Complete examples](../../examples/receipt-spec/README.md)
- [Local browser verifier](../verify.html)
