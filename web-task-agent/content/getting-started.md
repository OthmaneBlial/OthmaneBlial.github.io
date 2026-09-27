# Quick start

Requires Node.js 22.12 or later.

## Try a sample

You do not need an account, browser, or API key for the sample.

```bash
npm ci
npm run start -- demo export browser-agent-landscape
npm run start -- receipt verify reports/demos/browser-agent-landscape
```

Open `reports/demos/browser-agent-landscape/receipt.html` to read the result. The demo uses saved data; it does not contact websites or an AI service.

## Run live research

Live research needs a local browser connection and a configured AI service.

Copy `.env.example` to `.env` and add credentials for your chosen service.

Preview a workflow:

```bash
npm run start -- workflow preview article-research --topic "browser automation"
```

Run it when the plan looks right:

```bash
npm run start -- workflow run article-research --topic "browser automation" --preset focused
```

Reports and job data stay on your computer. A live run visits the selected public sources and may send selected evidence to your configured AI service.

## Next

- [Choose a workflow](#page=workflows)
- [Understand the receipt](#page=decision-receipt-spec)
- [Read the privacy guide](#page=privacy)
