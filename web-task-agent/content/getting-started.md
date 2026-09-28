# Get started

## Read a saved example

Open the [sample report](https://othmaneblial.github.io/web-task-agent/receipt.html). It uses saved data and does not start a search.

## Run live research

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

Run the preview first. Check the plan, then start the research run.

Live research visits public websites. It may send source text to your AI service. Reports and job data stay on your computer.

## Next

- [Choose a workflow](#page=workflows)
- [Read the privacy guide](#page=privacy)
