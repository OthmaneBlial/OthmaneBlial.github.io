# Privacy And Source Acquisition

Web Task Agent is local-first, not offline-by-magic. Its durable state and dashboard stay on the operator's machine; a live job can still contact public websites and the LLM endpoint the operator configures.

Read the full [privacy and local-data contract](../../PRIVACY.md) before putting sensitive material into an instruction.

Agent runs read `agent-memory.md` or `agent-memory.txt` from the working directory by default, or the file passed with `--memory`. That content is included in LLM prompts. Memory files are limited to 16 KB and checked before the job database or browser starts.

## Default Boundaries

- SQLite state, artifacts, reports, caches, prompt traces, and exports are local files.
- The dashboard is local by default and the project includes no product analytics or required hosted control plane.
- Demo export, catalog discovery, workflow preview, pack planning, scaffolding, and the standard test suite do not need an LLM key or a live source request.
- `job export` and `job compare` never upload a package; `--dry-run` previews their local write.

## Live Research Boundaries

Before opening a source, the runtime refuses malformed, credential-bearing, local, private-network, and configured blocked URLs. It resolves the hostname first and fails closed if DNS returns a private/reserved address or cannot be resolved safely. It checks public `robots.txt`; its rules apply to the original site, even when the file redirects. Up to five redirects are followed only after URL and DNS checks, the first 512 KiB are parsed, and cached rules refresh within 24 hours. Other 4xx responses are recorded as unavailable and may proceed; 401, 403, 429, 5xx, network/body failures, and unsafe or excessive redirects deny acquisition. A per-domain delay applies, and browser requests are capped at 12 per domain by default.

```env
WEB_TASK_AGENT_ALLOWED_DOMAINS=docs.example.com,github.com
WEB_TASK_AGENT_BLOCKED_DOMAINS=example-bad-domain.test
WEB_TASK_AGENT_DOMAIN_MIN_DELAY_MS=1200
WEB_TASK_AGENT_DOMAIN_MAX_REQUESTS=12
WEB_TASK_AGENT_REVIEW_DOMAINS=sensitive.example.com
WEB_TASK_AGENT_USER_AGENT=web-task-agent (+https://github.com/OthmaneBlial/web-task-agent)
```

Set the domain request cap to `0` only to deliberately disable it. Domains on `WEB_TASK_AGENT_REVIEW_DOMAINS` are not opened: they require an operator to review the source and deliberately remove the domain from that list before a new run. Source text is untrusted. Suspected page-level prompt injection is quarantined rather than allowed to override an operator instruction.

## Sharing And Retention

Use a redacted preview before writing an export:

On POSIX systems, atomic local outputs, imported receipts, resumable cache files, prompt traces, structured logs, and exports created at a new path use owner-only permissions (`0600`). Newly created output directories use `0700`. A forced overwrite of an existing CLI export keeps that file's existing permissions.
SQLite databases and WAL/SHM files also use `0600`; the default database directory and newly created database directories use `0700`.

```bash
web-task-agent job export <job-id> --format markdown --redact --dry-run
```

The redactor masks recognizable credentials, configured secret environment values, email addresses, local home paths in text, and absolute paths in path fields. It cannot detect every secret or decide whether surrounding content is safe to share. Review every export. Bound local prompt traces with `storage cleanup --prompt-traces <path> --max-traces <count>`. Use `storage backup --output <path>` before a risky local change; `storage restore --input <path> --force` creates a safety copy before replacing the active database. Delete local databases, caches, and reports through your normal retention process.

Before making the repository public or cutting a release, run `npm run audit:secrets`. It scans tracked and non-ignored candidate files, confirms that `.env`, `.data/`, and `reports/` remain ignored, and reports only locations and credential categories. It cannot prove that a secret never existed in Git history; rotate anything that may previously have been committed.
