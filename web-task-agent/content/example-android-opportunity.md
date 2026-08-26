# Android Opportunity Example

This workflow produces a topic-based package under:

```text
reports/workflows/android-opportunity/<topic-slug>/
```

Expected handoff shape:

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
  pipeline-manifest.json
```

The short operator flow is:

1. Read `handoff/workflow-brief.md`
2. Validate the top 2 concepts in `report.md`
3. Review source evidence in `raw/research/` only when needed
