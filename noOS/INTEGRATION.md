# noOS showcase integration

## Files

- `index.html`: product showcase, real runtime image, boot path, computed roadmap, and quick start.
- `docs.html`: source-based field manual with boot architecture, E820, allocators, supervisor paging, all fourteen initial shell commands, PIT, CPUID, test scope, GDB, and current limits.
- `styles.css`: charcoal, cream, and cyan visual system; responsive layouts and keyboard focus styles.
- `app.js`: strict 40-gate roadmap reader, safe text-only rendering, native details disclosures, and command copy actions.
- `progress.json`: published copy of `docs/progress.json`, refreshed by the repository progress tool.
- `fonts/`: self-hosted Unbounded, IBM Plex Sans, and IBM Plex Mono, with their SIL Open Font Licenses.
- `favicon.svg`, `robots.txt`, `sitemap.xml`: project icon and discovery assets.
- `test-site.cjs`: focused parser, progress update, malformed data, and exact clipboard text self-check.

## Local verification

```sh
node --check site/app.js
node site/test-site.cjs
python3 -m http.server 5187 --bind 127.0.0.1 --directory site
```

Checks completed before handoff:

- JavaScript syntax check passes.
- Self-check passes: 40-gate counting, percentage changes when a gate completes, invalid schema rejection, exact multiline copy text, and accessible success message.
- Chrome visually inspected at its default 1280 px viewport and at 390 px and 320 px mobile widths.
- Home and field manual have no page-level horizontal overflow at the checked widths. Wide technical tables scroll inside their own container.
- Roadmap shows eight disclosures and forty gates, calculated from the actual JSON. The displayed total matches the current source data; no completion percentage is hardcoded.
- Disclosure opens with keyboard Enter and exposes verified/pending gate labels.
- Quick start and GDB copy buttons report success in Chrome. The browser automation session clipboard does not expose the native clipboard contents, so exact text is checked through the focused self-check.
- Missing data and missing screenshot fallback states were exercised before the files were supplied. The authentic 720 × 400 QEMU screenshot now loads and was visually reviewed in the desktop and mobile layouts; its caption links to the full size image.
- Internal page links and fragment targets resolve.
- Local HTTP 200 verified for all twelve required resources: the two pages, JavaScript, CSS, favicon, progress JSON, three font files, authentic QEMU screenshot, robots, and sitemap.
- Current documentation was checked against `kernel/main.asm`, shell command dispatch, physical/heap/paging source, PIT/CPU source, and memory/paging/hardware tests. It documents the 128 MiB management ceiling, low MiB reservation, heap and stack ranges, pinned paging structures, null guard, and real fault commands.
- The manual uses the available cross GDB command, `x86_64-elf-gdb`, and documents the actual loopback debug target and kernel entry hardware breakpoint. Runtime boot and the real GDB session were verified by the main agent; the showcase review did not repeat kernel tests.
- The final local browser session reported no warning or error console entries. Temporary viewport overrides were reset.

## Before publication

1. Keep the authentic QEMU image at `site/screenshots/noos.png` synchronized with the running kernel; do not substitute a terminal mockup.
2. Run the repository progress tool after final verified gates change, so the README and `site/progress.json` remain synchronized.
3. Refresh the field manual when later filesystem, scheduling, user mode, or executable loading milestones are verified. The current manual accurately describes the completed initial hardware core and the advanced roadmap boundary.
4. Run the self-check again if the progress schema or site logic changes; repeat HTTP checks against the published site.
5. Publish this complete directory with the GitHub Pages skill helper, preserving the canonical folder name `noOS` and unrelated project folders. Inspect the Pages repository's actual default branch.
6. Verify `https://othmaneblial.github.io/noOS/`, `docs.html`, `progress.json`, font assets, and the authentic screenshot over HTTPS. Successful source push alone does not prove Pages propagation.

No release badges, fabricated download artifacts, simulated OS, invented benchmarks, or physical hardware claims are included. External publication remains the main agent's integration step.
