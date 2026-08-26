# Case study: Launch Risk Review

## Question

Can a public promise be reproduced by a new visitor on a clean machine?

## Evidence package

The deterministic [launch-readiness receipt](../../examples/receipts/product-launch-readiness/receipt.html) connects the promise to source cards, uncertainty, and a next validation. The [Launch Risk Review golden path](../../examples/golden-paths/launch-risk-review/) turns the same question into a live, reviewable workflow.

```bash
npm run build
node dist/cli.js receipt verify examples/receipts/product-launch-readiness
```

## Decision and next validation

Ship only the claims a clean visitor can reproduce, with the release tag and documentation aligned. The smallest next validation is a first-success run from a fresh environment, followed by opening the receipt without credentials.

## Invalidation

Green CI or polished copy does not prove onboarding. A failed clean install, a drifted release asset, or a missing source excerpt invalidates the promise until the package and docs are corrected.
