# Quick start

## Try the sample

Open the [sample receipt](https://othmaneblial.github.io/web-task-agent/receipt.html). No install, account, or API key needed.

## Run your own research

You need Node.js 22.12 or later, a local browser, and an AI service key.

```bash
git clone https://github.com/OthmaneBlial/web-task-agent.git
cd web-task-agent
npm ci
cp .env.example .env
# Add your AI service key to .env.
npm run start -- workflow preview article-research --topic "browser automation"
npm run start -- workflow run article-research --topic "browser automation" --preset focused
```

Review the preview before running. Research visits public websites and may send selected evidence to your AI service. Reports and job data stay on your computer.

## Next

- [Choose a workflow](#page=workflows)
- [Read the privacy guide](#page=privacy)
