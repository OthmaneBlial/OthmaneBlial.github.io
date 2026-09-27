# Web Task Agent

Run web research, keep the sources with the results, and review the evidence before you act.

## Try the bundled example

```bash
npm ci
npm run start -- demo export browser-agent-landscape
```

Open `reports/demos/browser-agent-landscape/receipt.html`. This demo uses saved sample data and makes no live research request.

## Run live research

Follow the [quick start](#page=getting-started) to preview a workflow and configure a browser and AI service. Live runs contact the sources you select and may send extracted evidence to your configured AI service. Reports and saved research data stay on your computer.

## Review a result

Open a report, follow its source links, and check the package integrity. A matching file hash does not prove that a source or conclusion is true.

For details, see [privacy and source access](#page=privacy), the [CLI guide](#page=cli-reference), and the [receipt specification](#page=decision-receipt-spec).
