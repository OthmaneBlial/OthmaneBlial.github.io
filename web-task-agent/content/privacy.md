# Privacy And Source Acquisition

Web Task Agent is local-first, not offline-by-magic. Its durable state and dashboard stay on the operator's machine; a live job can still contact public websites and the LLM endpoint the operator configures.

Read the full [privacy and local-data contract](../../PRIVACY.md) before putting sensitive material into an instruction.

## Default Boundaries

- SQLite state, artifacts, reports, caches, prompt traces, and exports are local files.
- The dashboard is local by default and the project includes no product analytics or required hosted control plane.
- Demo export, catalog discovery, workflow preview, pack planning, scaffolding, and the standard test suite do not need an LLM key or a live source request.
- `job export` and `job compare` never upload a package; `--dry-run` previews their local write.

## Live Research Boundaries

Before opening a source, the runtime refuses malformed, credential-bearing, local, private-network, and configured blocked URLs. It checks public `robots.txt` rules when available, applies a per-domain delay, and caps browser requests per domain at 12 by default. A redirect that resolves to an unsafe target is quarantined before its content is extracted or persisted; cross-origin redirects are explicitly flagged. An unavailable robots file is visible in the source signals; it does not mean permission was granted.

```env
WEB_TASK_AGENT_ALLOWED_DOMAINS=docs.example.com,github.com
WEB_TASK_AGENT_BLOCKED_DOMAINS=example-bad-domain.test
WEB_TASK_AGENT_DOMAIN_MIN_DELAY_MS=1200
WEB_TASK_AGENT_DOMAIN_MAX_REQUESTS=12
WEB_TASK_AGENT_REVIEW_DOMAINS=sensitive.example.com
WEB_TASK_AGENT_USER_AGENT=web-task-agent/0.2 (+https://github.com/OthmaneBlial/web-task-agent)
```

Set the domain request cap to `0` only to deliberately disable it. Domains on `WEB_TASK_AGENT_REVIEW_DOMAINS` are not opened: they require an operator to review the source and deliberately remove the domain from that list before a new run. Source text is untrusted. Suspected page-level prompt injection is quarantined rather than allowed to override an operator instruction.

## Sharing And Retention

Use a redacted preview before writing an export:

```bash
web-task-agent job export <job-id> --format markdown --redact --dry-run
```

The redactor recognizes common secret formats but cannot decide whether the surrounding content is safe to share. Review every export. Bound local prompt traces with `storage cleanup --prompt-traces <path> --max-traces <count>`. Use `storage backup --output <path>` before a risky local change; `storage restore --input <path> --force` creates a safety copy before replacing the active database. Delete local databases, caches, and reports through your normal retention process.

Before making the repository public or cutting a release, run `npm run audit:secrets`. It scans tracked and non-ignored candidate files, confirms that `.env`, `.data/`, and `reports/` remain ignored, and reports only locations and credential categories. It cannot prove that a secret never existed in Git history; rotate anything that may previously have been committed.
