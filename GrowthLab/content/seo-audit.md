# Local SEO page audit

GrowthLab can review one local HTML page before you put it into a battle. The
command reads a regular UTF-8 file, makes no network request and prints the
same explainable page-hygiene rubric used by the comparison dashboard.

```sh
growthlab seo-audit --html ./website/index.html
growthlab seo-audit --html ./website/index.html --format markdown
```

The JSON result includes the input path, the rubric id
`seo-page-hygiene-v1`, the total score and eight inspectable dimensions:
title, description, headings, document language, useful copy, canonical URL,
useful links and image descriptions. Markdown is intended for a quick review
or a local issue description.

Every score is labeled **ESTIMATED**. The audit checks supplied HTML only; it
does not crawl, index, rank or measure traffic. It cannot predict search
position or conversion, and it does not replace accessibility, performance,
structured-data, backlink or real-user measurement. A missing or weak signal
is evidence for a page review, not evidence of a business outcome.

The input must be a regular local file of at most 4 MiB. Symlinks, directories,
non-UTF-8 bytes and larger files are refused so a quick audit cannot silently
read an unexpected target.
