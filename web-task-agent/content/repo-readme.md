# Web Task Agent

> Research with sources attached.

Turn a research question into a local package with a short report, source links, and an offline file check.

[Try the sample](https://othmaneblial.github.io/web-task-agent/receipt.html) · [Quick start](https://othmaneblial.github.io/web-task-agent/docs.html#page=getting-started) · [Documentation](https://othmaneblial.github.io/web-task-agent/) · [GitHub](https://github.com/OthmaneBlial/web-task-agent)

## Try a saved sample

Requires Node.js 22.12 or later. This sample uses saved data; it needs no API key, browser, or live research request.

```bash
npm ci
npm run start -- demo export browser-agent-landscape
npm run start -- receipt verify reports/demos/browser-agent-landscape
open reports/demos/browser-agent-landscape/receipt.html
```

The folder contains a readable report, source snapshots, a decision receipt, and an integrity manifest. Verification checks that the package matches its manifest. It does not prove the sources or decision are correct.

## Run live research

Live research needs a local browser and a configured AI service. Set its key in `.env`, then preview and run a workflow:

```bash
cp .env.example .env
# Add your AI service key to .env.
npm run start -- workflow preview article-research --topic "browser automation"
npm run start -- workflow run article-research --topic "browser automation" --preset focused
```

A live run visits selected public websites and may send selected evidence to your configured AI service. Reports and job data stay on your computer.

## Check or compare a package

```bash
npm run start -- receipt verify reports/demos/browser-agent-landscape
npm run start -- receipt compare earlier-package later-package
```

The verifier works offline. Integrity checks show whether files changed after export; they do not prove a source is true, complete, authorized, or fresh.

## Local checks

GitHub Actions are disabled for this repository. Run the checks locally before pushing:

```bash
npm ci
npm run test:ci
npm run security:review
```

## Guides

- [Quick start and workflow guide](https://othmaneblial.github.io/web-task-agent/docs.html#page=getting-started)
- [Try the 60-second tamper challenge](https://othmaneblial.github.io/web-task-agent/challenge.html)
- [Browse example receipts](examples/receipts/)
- [Browse golden paths](examples/golden-paths/)
- [Workflow catalog](examples/workflows/CATALOG.md)
- [Privacy](PRIVACY.md) · [Security](SECURITY.md) · [Support](SUPPORT.md)
- [Contributing](CONTRIBUTING.md) · [Release checklist](RELEASE_CHECKLIST.md)
