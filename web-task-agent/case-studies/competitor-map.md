# Case study: Competitor Map

## Question

Where should a team deliberately *not* compete when adjacent tools already own a surface?

## Evidence package

The deterministic [competitor decision receipt](../../examples/receipts/competitor-decision-map/receipt.html) keeps three source roles, one decision claim, explicit limitations, and the smallest next validation together. Verify it locally:

```bash
npm run build
node dist/cli.js receipt verify examples/receipts/competitor-decision-map
```

Use the [Competitor Map golden path](../../examples/golden-paths/competitor-map/) for a live, operator-controlled run. It expects first-party positioning and pricing, user evidence, and gaps rather than a flat feature checklist.

## Decision and next validation

The handoff should identify a defensible gap and one falsifiable test with target operators. The receipt's limitation stays attached so a promotional competitor page cannot masquerade as independent demand.

## Invalidation

An apparent gap is invalid if the target segment does not value it, if a competitor has already shipped the capability, or if the sources are stale. Re-check current product pages and interview the affected operators before investing.
