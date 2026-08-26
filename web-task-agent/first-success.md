# First-success evidence

This is the deterministic release gate for a new operator. It deliberately exercises the same artifact a GitHub Release will expose, rather than importing the checkout directly.

## Command

```bash
npm ci
npm run first-success
```

The script builds `dist/`, packs the current version with `npm pack`, creates a fresh temporary install, installs the tarball with `npm install --ignore-scripts`, exports `browser-agent-landscape`, and runs `receipt verify` without a model key, browser session, or live request.

## Acceptance output

```text
First-success passed: clean tarball install, demo export, and offline receipt verification.
```

The evidence directory is temporary and contains `receipt.html`, `receipt.json`, `integrity-manifest.json`, the report, source metadata, and the handoff package. The release workflow repeats this check on Ubuntu with Node 22 before attaching the tarball and `SHA256SUMS` to a version-matched GitHub Release.

## Limits

This gate proves packaging, installation, deterministic export, and offline receipt verification. It does not prove that a live model endpoint is available, that an external website is reachable, or that a research claim is true or fresh.
