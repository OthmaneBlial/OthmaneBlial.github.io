# Project status

Web Task Agent turns research into a local package you can inspect, verify, and compare.

[Try a saved sample](https://othmaneblial.github.io/web-task-agent/receipt.html) · [Quick start](https://othmaneblial.github.io/web-task-agent/docs.html#page=getting-started) · [Examples](https://othmaneblial.github.io/web-task-agent/examples.html)

## What works now

- **Decision Receipts:** a versioned format, standalone schema, verifier, and comparison tool.
- **Local review:** a browser verifier and CLI that can check packages without uploading their contents.
- **Agent tools:** a local MCP server and tested imports from Browser Use and GPT Researcher.
- **Local checks:** the test and security commands below cover the project. GitHub Actions are disabled for this repository.

## What still needs outside action

- The owner must bootstrap public npm packages before trusted publishing and the official MCP registry can be completed.
- Independent reviewers must inspect the security boundaries and test the receipts with consent.
- External users must show repeated use before the project can claim adoption or release v1.0.

Local tests and maintainer-created examples do not count as external validation. The [open issues](https://github.com/OthmaneBlial/web-task-agent/issues) track these work items.

## Run checks locally

```bash
npm ci
npm run test:ci
npm run security:review
```

## What verification means

A valid receipt shows that its files match the recorded integrity data and satisfy the format rules. It does not prove that its sources are true, complete, authorized, or current.
