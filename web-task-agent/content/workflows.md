# Workflow Templates

The repository ships three focused core workflows plus 240 catalog workflows. Every workflow uses the same durable research and package contract; catalog entries differ in their decision focus, query strategy, preferred sources, deliverables, and stable output path.

## Find A Workflow Before Running It

```bash
web-task-agent workflow list --category "Voice of Customer"
web-task-agent workflow list --search ecommerce
web-task-agent workflow preview cybersecurity-voice-of-customer \
  --topic "security review workflow for SaaS teams" \
  --preset focused
```

`preview` is a dry run: it displays the decision focus, preferred public source families, expected work, and output path without invoking an LLM or browser. The generated [workflow catalog](../../examples/workflows/CATALOG.md) contains one page per catalog workflow, including its source strategy.

## 1. Android Opportunity Research

Purpose:

- Find promising Android app opportunities
- Extract recurring pains and gaps from product and community sources
- Produce concept ideas, MVP hooks, monetization clues, and launch angles

Example command:

```bash
npm run start -- workflow run android-opportunity \
  --topic "ai study planner" \
  --preset deep
```

Default presets:

- `fast`
- `standard`
- `deep`

The preset changes:

- max queries
- max results per query
- fetch batch size
- max runtime hours

## 2. Technical Article Research

Purpose:

- Research a technical topic that is discussed across docs, blogs, release notes, issues, and commentary
- Preserve the strongest repeated claims and the contradictions
- Produce article angles and a claim checklist before writing

Example command:

```bash
npm run start -- workflow run article-research \
  --topic "browser automation with Lightpanda and CDP"
```

## 3. Market Opportunity Research

```bash
npm run start -- workflow run market-opportunity \
  --topic "offline PDF tools for regulated teams" \
  --preset focused
```

Use this workflow when a product or market decision needs competitor context, repeated pains, positioning options, and a concrete validation plan.

## Decision Packs

When one workflow is not enough, create a review-gated plan instead of launching a hidden chain:

```bash
web-task-agent pack list
web-task-agent pack plan launch-with-proof --topic "a local research tool for product teams"
web-task-agent pack plan launch-with-proof --topic "a local research tool for product teams" --dry-run
```

The five packs are `validate-an-idea`, `launch-with-proof`, `understand-churn`, `write-a-defensible-article`, and `choose-an-integration`. A pack only writes the ordered plan; the operator reviews every step before starting it. Add `--dry-run` to print the plan, report destinations, and aggregate query/candidate/runtime bounds without creating a file or launching work. Those bounds are not a monetary estimate: actual browser and LLM usage depend on the selected sources and model.

## Shared Workflow Behavior

All workflows:

- generate a topic-shaped instruction automatically
- write outputs to stable topic-based folders
- register artifacts in SQLite
- write workflow briefs and package manifests
- support queueing and worker execution

## Choosing A Preset

- `fast`: quick directional check with fewer queries and a shorter runtime
- `standard`: the default balance for normal operator use
- `deep`: more coverage and a longer runtime for higher-confidence outputs

If you are unsure which preset to use, start with `standard`. Use `fast` when you only need a quick sense of direction, and use `deep` when the topic is important enough to justify more runtime.

## Queue A Workflow Instead Of Running It Immediately

```bash
npm run start -- workflow enqueue android-opportunity \
  --topic "family budgeting app"
```

## Workflow Package Structure

```text
report.md
handoff/
  README.md
  package-manifest.json
  research-summary.md
  workflow-brief.md
drafts/
  post-draft.md
  comments-draft.md
plan/
  plan.json
raw/
  research/
runtime/
  llm-prompt-traces.json
  pipeline-manifest.json
```

## Repo Example Files

- `examples/workflows/android-opportunity.md`
- `examples/workflows/article-research.md`
- `examples/workflows/CATALOG.md`

Those files are also copied into this site under the repo source pages.
