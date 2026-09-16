# GrowthLab portable site

`index.html`, `docs.html`, `styles.css` and `app.js` work below a project subpath.
No build step, external fonts, third-party JavaScript, analytics or local product
data is used. Screenshots are copied unchanged from the repository; their JPEG
file names match the actual format.

`docs/status.json` in the project is authoritative. Run
`node scripts/sync-project-status.mjs` from the project root to refresh the README
progress block, `site/status.json` and the copies in `site/content/`. Publish the
whole `site/` directory after each validated milestone that changes progress.
The browser fetches its published status snapshot with no-store; an accurate
embedded fallback remains visible if fetching fails. This does not automatically
watch an unpublished local repository or execute GitHub CI.

Optional published prerelease data:

```json
{
  "release": {
    "published": true,
    "version": "0.1.0-alpha.1",
    "url": "https://github.com/OthmaneBlial/GrowthLab/releases/tag/v0.1.0-alpha.1",
    "platform": "macOS arm64",
    "limitation": "Exact platform, signing and verification limitations."
  }
}
```

The release panel stays hidden until published=true and the URL points to this
repository's GitHub release tag. No download exists merely because this schema
or a local release build exists.

Browser QA: desktop and 390px phone widths; mobile Menu and Escape; all local
links; gallery choices and pressed state; image dialog Close/Escape and returned
focus; quick-start and multiline snippet Copy; docs topic search and empty
results; fetched progress/release visibility; warning/error logs. Respect reduced
motion. Serve over HTTP for status fetching.

The final local HTML/JS/file checks are documented in the parent task. Actual
browser review and hosted HTTPS publication are owned by the parent agent.
