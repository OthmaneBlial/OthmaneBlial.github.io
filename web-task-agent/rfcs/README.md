# Decision Receipt RFC process

An RFC is mandatory before merging any breaking Decision Receipt change. This keeps a format used for verification from changing through an incidental implementation pull request.

## Changes that require an RFC

- a new spec major or removal/renaming of an accepted field;
- changed canonical JSON or signature bytes;
- changed integrity-manifest, snapshot, archive-root, or path-safety semantics;
- a previously valid receipt becoming invalid, except for a coordinated security repair;
- changed meaning for `supported`, `contradicted`, `insufficient`, origin labels, verification status, or compatibility guarantees;
- a new implicit network, telemetry, authentication, or provider-data boundary.

An additive optional field still needs a spec-minor proposal and conformance case, but may use a shorter RFC when it does not change existing semantics.

## Flow

1. Open the **Schema RFC** issue form before implementation.
2. Copy [0000-template.md](0000-template.md) to `docs/rfcs/NNNN-short-title.md`, using the issue number.
3. Include motivation, byte-level contract, alternatives, compatibility, migration, security/privacy impact, conformance cases, rollout, and rollback.
4. Collect public review. Resolve objections in the document; do not hide disagreement in a squashed commit.
5. A maintainer records `accepted`, `rejected`, or `withdrawn` with a rationale. Acceptance authorizes implementation, not release.
6. The implementation PR links the RFC and adds schema/runtime tests, migration when required, documentation, and compatibility-matrix updates.

Security-sensitive details belong in a private advisory until disclosure is safe. The public RFC may be delayed, but the eventual change record and regression test remain required.

## Status vocabulary

- `draft`: open for review, not approved for implementation;
- `accepted`: contract approved, implementation still pending;
- `implemented`: landed on `main`, not necessarily released;
- `released`: verified in a public release;
- `rejected` or `withdrawn`: retained for decision history.
