# noOS showcase integration

## Current scope

The field manual reflects the verified v0.1 runtime: 27 shell commands, VGA/PS2/PIT/CPUID, E820 frames and heap, supervisor paging, persistent noFS on IDE slave, read-only /initrd, real kernel preemption, synchronous ring 3, and the bounded static ELF32 loader. The roadmap reads the repository JSON and computes all 40 defined gates. Its 100% result is explicitly a checklist result, not a production maturity or hardware compatibility claim.

Runtime limits are visible: 128 MiB physical management ceiling; bounded noFS entries/names/files/directories; no real power loss or secure erase guarantee; ring 0 workers share kernel space; one user execution at a time; no FPU context switching, execution timeout, NX, dynamic linking, relocations, PIE, TLS, argv, or Linux ABI. UEFI, real hardware, and the future x86-64 path remain outside the tested target.

## Files

- index.html: current product showcase, authentic QEMU capture, boot path, computed roadmap, and build instructions.
- docs.html: source-based architecture, memory, storage, tasks, syscalls, ELF subset, diagnostics, benchmark interpretation, tests, GDB, and limits.
- app.js / styles.css: safe text-only roadmap rendering, native disclosures, responsive layout, focus styles, and reusable copy controls.
- progress.json: generated from docs/progress.json by the repository progress tool.
- screenshots/noos.png: real QEMU screen; source capture refreshed by the main agent.
- fonts/: self-hosted Unbounded and IBM Plex fonts with their SIL licenses.
- favicon.svg / robots.txt / sitemap.xml: discovery assets.
- test-site.cjs: strict 40-gate parsing, count updates, malformed data, and exact clipboard text self-check.

## Verification

Run:

~~~sh
node --check site/app.js
node site/test-site.cjs
python3 -m http.server 5187 --bind 127.0.0.1 --directory site
~~~

- The main agent verified all 13 full local QEMU/GDB suites. Kernel commit 6d469f3 CI also completed the full suite, reproducibility check, and artifact steps successfully. The showcase review did not repeat kernel tests.
- The source review covers command dispatch, kernel initialization, memory/heap/paging, PIT/CPU, ATA/noFS/initrd, scheduler, ring 3, ELF, benchmark source, and their tests. There are 27 command-table entries; paired table rows do not change that count.
- Website syntax and focused self-check pass; its calculated total matches all 40 current JSON gates. Missing JSON and missing image fallback states were exercised during initial integration.
- Chrome checks cover desktop and 390/320 px CSS widths. The pages have no horizontal page overflow; technical tables and long command lines scroll inside their own containers.
- Copy controls use the existing shared behavior. Native browser success messages and focused exact-text self-checks verify their wiring; the automation session clipboard does not expose the native clipboard contents.
- Keyboard Enter opens roadmap disclosures and reveals verified/pending gate labels. Page IDs and navigation anchors resolve.
- The authentic 720 by 400 QEMU image loads and its caption opens the full-size image. The main agent refreshed the capture after final runtime changes.
- Required page, JS, CSS, JSON, icon, image, font, robots, and sitemap resources resolve over local HTTP. Live verification must be repeated after this final publication.
- Benchmark copy describes 100000 real frame allocation/free pairs and PIT-quantized elapsed ticks, including interrupts/preemption. No numeric throughput, host latency, or runtime binary size is hardcoded. The public manual links to recorded measurements and identifies host/QMP overhead.
- Temporary browser viewport overrides are reset after checks.

## Publication handoff

1. Run the progress tool if verified gates change, keeping README and site/progress.json synchronized.
2. Keep the authentic screenshot synchronized with the runtime; do not substitute a terminal mockup.
3. Publish the complete site directory into the canonical noOS folder with the GitHub Pages skill helper. Inspect the Pages repository actual default branch and preserve unrelated folders.
4. Verify home, docs.html, progress.json, real PNG, fonts, and remaining assets over HTTPS after propagation. Check copy controls, keyboard disclosures, mobile overflow, console errors, and the 40-gate total.

No fabricated artifacts, simulated OS, invented measurements, release badges, or physical hardware claims are included. Commits and external publication belong to the main agent.
