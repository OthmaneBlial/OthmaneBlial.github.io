# Performance snapshot

Collected 2026-09-30T20:59:48+0200 on Apple M2, macOS-26.6-arm64-arm-64bit-Mach-O; rustc 1.95.0 (59807616e 2026-04-14).

Each configuration uses 3 warmups, 20 timed frames, 960×640 and fixed scene time.
This was a shared desktop with substantial background activity. Variance is
large: these observations are not a controlled speedup study or a physical GPU
comparison. The optional SIMD path is therefore not the default.

| Scene | Coverage | Workers | Median ms | p95 ms | Render FPS |
| --- | --- | ---: | ---: | ---: | ---: |
| textured_cube | scalar | 1 | 49.2965 | 74.7541 | 20.37 |
| textured_cube | simd | 1 | 43.9793 | 69.8523 | 20.61 |
| textured_cube | scalar | 2 | 22.5887 | 48.4757 | 39.41 |
| textured_cube | scalar | 4 | 22.4569 | 26.9256 | 45.75 |
| textured_cube | simd | 4 | 22.8580 | 27.0263 | 44.30 |
| shader_cube | scalar | 1 | 53.1550 | 115.5639 | 16.90 |
| shader_cube | simd | 1 | 55.2054 | 122.5557 | 14.92 |
| shader_cube | scalar | 2 | 24.2961 | 34.0831 | 38.44 |
| shader_cube | scalar | 4 | 34.1409 | 56.7236 | 28.22 |
| shader_cube | simd | 4 | 24.7005 | 44.0852 | 36.38 |
| showcase | scalar | 1 | 273.5383 | 389.3506 | 3.59 |
| showcase | simd | 1 | 177.7756 | 185.8388 | 5.63 |
| showcase | scalar | 2 | 166.7940 | 252.8583 | 5.68 |
| showcase | scalar | 4 | 226.6528 | 448.4498 | 4.03 |
| showcase | simd | 4 | 119.4767 | 226.1342 | 6.68 |

FPS is measured frame count divided by total elapsed render time; it is not
the reciprocal of the median. Shaded-pixel throughput counts executed fragment
shaders, not framebuffer resolution times frames. Triangle throughput counts
submitted triangles, including culled/clipped primitives. Parallel bands repeat
geometry execution; logical submitted geometry is counted once and shading
work is summed. Tile visits can increase at band boundaries.

The captured executable SHA-256 and commands are in
[the raw benchmark record](../benchmarks/apple-m2-2026-09-30.json). Collection
occurred before the publication commit, with the current release sources in a
dirty worktree; the record says so. Do not interpret its git_head as a clean
release tag benchmark.

## Reproduce

```sh
python3 benchmarks/run.py --frames 30 --output output/benchmarks.json
cargo run --release -p silicon-cli -- profile showcase --threads 4
```

The benchmark excludes PNG export, window creation, pixel-buffer conversion
and presentation. Cached built-in mesh/texture construction is amortized by
warmups. SIR scene command creation and validation are included. All allocations,
clipping, shader execution, depth/stencil and blending during rendering are
included. The profile command additionally times each fragment shader call;
clock instrumentation adds overhead. Accumulated worker stage times can exceed
wall time and must not be summed as if they were exclusive stages.

## Next measurements

Use an otherwise idle host, repeat alternating configurations, retain full
per-frame samples, and isolate shader/interpolation cost before selecting SIMD
or changing scheduling. Persistent workers and triangle binning should be driven
by those measurements. AVX2 needs a native x86 run; cross-platform correctness
in CI alone does not establish its performance.

## Animation provenance

`cargo run --release --example animation` generates 96 PNG frames through the
CPU renderer at scene times i/24. FFmpeg libx264 encodes them at 24 fps into
`assets/demos/showcase.mp4` (640×400, four seconds). The encoded cadence is an
offline playback rate, not a measured real-time frame rate.
