# Examples

## Example 1: Inspect A Complete Package Without Credentials

```bash
npm run start -- demo export local-first-risk-review
```

This writes a source-linked, clearly labelled fixture package to `reports/demos/`. It is the fastest way to learn the report, evidence, and handoff contract without pretending a static example is fresh research.

## Example 2: Research A New Android App Idea

Goal:

- search across product pages, reviews, communities, and competitor discussions
- save evidence locally
- analyze repeated pains and feature gaps
- hand back concept ideas that could have strong momentum

Command:

```bash
npm run start -- workflow run android-opportunity \
  --topic "ai study planner" \
  --preset deep
```

Use this when you want an evidence-backed concept package instead of casual browsing.

## Example 3: Research A Technical Topic For An Article

Goal:

- scan docs, blog posts, release notes, and discussions
- preserve contradictions instead of flattening them
- generate article angles and a claim checklist

Command:

```bash
npm run start -- workflow run article-research \
  --topic "browser automation with Lightpanda and CDP"
```

Use this when the final output is not just research, but better writing based on that research.

## Example 4: Queue A Long Run And Process It Later

Goal:

- enqueue the job now
- let a worker claim it later
- retain resume and recovery behavior if interrupted

Commands:

```bash
npm run start -- workflow enqueue android-opportunity \
  --topic "budgeting app for couples"
npm run start -- worker run --once
```

## Example 5: Run A One-Off General Research Job

Goal:

- use the durable pipeline without forcing the job into a predefined template

Command:

```bash
npm run start -- agent run \
  "Research cheerful launch ideas for our product and write one evidence-backed post"
```

## Example 6: Inspect A Job While It Runs

Commands:

```bash
npm run start -- server run --port 4317
npm run start -- job inspect <job-id>
npm run start -- job logs <job-id> --limit 100
```

This is useful when a run is long enough that you want real operator visibility instead of waiting blindly.

## Example 7: Export Logs For Later Review

Command:

```bash
npm run start -- job logs <job-id> --limit 250 --output ./job-logs.txt
```

Use this when you want to share or archive a long log history without losing the exact event ordering.

## Example 8: Preview A Redacted Decision Receipt Before Sharing

```bash
npm run start -- job export <job-id> \
  --format markdown \
  --redact \
  --dry-run
```

This does not write a file or send data. Remove `--dry-run` only after reviewing the source count and destination. Use `job compare <earlier-job-id> <later-job-id>` to see source additions, source disappearances, and a changed decision excerpt between two local runs.

## Example 9: Find One Workflow In The Catalog

Command:

```bash
npm run start -- workflow list --category "Pricing and Packaging"
npm run start -- workflow list --search ecommerce
```

Use `workflow preview <id> --topic <text>` next to inspect the intended source strategy, output folder, and preset before launching it.

## Example 10: Prepare A Decision Without Launching A Chain Of Agents

```bash
npm run start -- pack plan understand-churn \
  --topic "why teams stop using a shared research workspace"
```

The plan gives an ordered, review-gated sequence. The operator decides whether to run each workflow; the command does not silently spend credits or open websites.
