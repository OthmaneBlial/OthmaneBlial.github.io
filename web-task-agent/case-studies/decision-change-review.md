# Case study: Decision Change Review

## Question

Would a new public signal change a prior direction for local browser research?

## Before and after

The deterministic comparison uses `browser-agent-landscape` as the earlier package and `local-first-risk-review` as the later package. They are intentionally different fixtures: this exercises the diff contract (three sources added, three removed, changed claim, changed decision) without pretending to be a time-series result.

```bash
npm run build
node dist/cli.js receipt compare \
  examples/receipts/browser-agent-landscape \
  examples/receipts/local-first-risk-review \
  --output /tmp/decision-change.md
```

Open both `receipt.html` files and the generated Markdown before accepting the later direction. The diff names source churn, changed claims, and the reason the decision summary changed.

## Decision and next validation

The package is useful when a reviewer can identify which evidence moved the decision and run a small follow-up check. The next validation is deliberately kept in each receipt rather than inferred from the diff.

## Invalidation

This fixture cannot establish a live trend. A stale, unrepresentative, or policy-filtered source would invalidate a real decision; re-open the changed excerpts and collect a dated primary signal before acting.
