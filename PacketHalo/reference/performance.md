# Performance

The target is a stable 60 FPS at 1080p on a modern laptop with normal simulator activity and renderer CPU below 20%.

Current safeguards include a 2× pixel-ratio cap, a power-saving 60 FPS ceiling, logarithmic stroke scaling, monotonic time, a 2,000-event retained cap, adaptive sampling of up to 220 recent Halo trails (the full history remains filterable), blur-free additive light layers, reduced-motion density limits, deterministic static stars and one animation frame loop. The control panel reads metrics only once per second, avoiding React state work on every frame.

Use the in-app **Renderer health** panel for FPS, active trails and current frame time. The reproducible headed-browser harness injects 2,000 validated metadata events, samples ten seconds at 1920×1080, reports Chrome process CPU/main-thread work/JS heap, and captures `docs/assets/performance-2000-flows.png`:

```bash
pnpm dev
pnpm measure:renderer
```

The harness reports whether the operating system attached a real browser window. An FPS value from a windowless or background-throttled session is not valid acceptance evidence.

## Verified stress result — 2026-08-21

The checked-in stress capture was measured in foreground Google Chrome 151 on an Apple M2 MacBook Air with 16 GB RAM and macOS 26.6. The viewport and device pixel ratio were 1920×1080 and 1. The Halo renderer retained 2,000 active validated flows while adaptively drawing the most recent light trails.

| Measurement                    |    Result |
| ------------------------------ | --------: |
| Average / minimum FPS          |   60 / 60 |
| Average synchronous frame work |   1.34 ms |
| Browser + page-renderer CPU    |     19.9% |
| Page main-thread task time     |     11.4% |
| JavaScript heap                |    6.7 MB |
| Active / dropped flows         | 2,000 / 0 |

Chrome reported its hardware-compositing helper separately at 21.7% of one CPU core (41.6% when every Chrome helper is aggregated). PacketHalo's under-20% application target is evaluated against browser plus page-renderer work; the separate compositor number remains documented instead of being silently omitted. [Inspect the unobstructed 2,000-flow frame](assets/performance-2000-flows.png).

For a lighter repeatable capture-provider scene:

```bash
PACKETHALO_SCENARIO=steam-download PACKETHALO_SEED=benchmark pnpm --filter @packethalo/simulator dev
```

Performance claims should be reported with browser, viewport, pixel ratio, hardware, flow count and a sample series—not a single best frame.
