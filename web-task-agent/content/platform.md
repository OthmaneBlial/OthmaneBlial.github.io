# How it works

Web Task Agent runs on your computer. Use it in three steps:

1. Choose a workflow and ask a focused question.
2. Review the collected sources and findings.
3. Open the report or verify the saved package.

## Main commands

- `workflow` starts a guided research job.
- `agent` runs an open-ended job.
- `job` inspects, resumes, or exports a result.
- `queue` and `worker` run jobs later.
- `server` opens the local dashboard.

## Where files go

- `.cache/` holds temporary resume state.
- `.data/` holds the local database.
- `reports/` holds reports and handoff packages.

Live runs contact the sources you select and may send selected evidence to your configured AI service. See the [privacy guide](#page=privacy) for details.
