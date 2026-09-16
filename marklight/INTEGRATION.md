# Portable Marklight site

`index.html` is the showcase. `docs.html` contains the usage guide. All runtime
assets and navigation use relative paths and work below `/marklight/`.
No external fonts, libraries, analytics, build step or GitHub Actions are used.

Source repository: `https://github.com/OthmaneBlial/marklight` (lowercase).
Canonical site: `https://othmaneblial.github.io/marklight/`.

The images are local copies of `docs/images/reader-{light,dark,narrow}.png`.
They show the reader interface and do not claim native-platform validation.
If the final app screenshots change, refresh these copies before publication.
The downloadable Markdown and plain terminal output are copied from
`fixtures/markdown/gfm.md` and `gfm.terminal.txt`.

The public installation guide uses source builds; it does not claim crates.io
availability, a completed package release, cross-platform validation or measured
performance. The project owner can add verified release download links later.

Local verification:

```sh
node --check site/app.js
python3 -m http.server 8765 --bind 127.0.0.1 --directory site
```

For subpath checks, serve the repository root and request `/site/index.html` and
`/site/docs.html`. Check theme preview switching, snippet copies, anchor links,
keyboard focus and viewport overflow at mobile and desktop widths.
