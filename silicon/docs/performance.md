# Performance snapshot

Collected 2026-09-30T21:40:10+0200 on Apple M2, macOS-26.6-arm64-arm-64bit-Mach-O; rustc 1.95.0 (59807616e 2026-04-14).

Each configuration uses 3 warmups, 20 timed frames, 960×640 and fixed scene time.
This was a shared desktop, not an isolated benchmark host. These are observations,
not a controlled speedup study or a physical GPU comparison. The optional SIMD
path remains opt-in; the SPIR-V cube is an unlit textured scene, while shader_cube
executes additional lighting instructions.

| Scene | Coverage | Workers | Median ms | p95 ms | Render FPS |
| --- | --- | ---: | ---: | ---: | ---: |
| textured_cube | scalar | 1 | 18.2952 | 18.3943 | 54.62 |
| textured_cube | simd | 1 | 18.4590 | 18.5621 | 54.15 |
| textured_cube | scalar | 2 | 10.0439 | 11.2062 | 96.30 |
| textured_cube | scalar | 4 | 9.6715 | 10.1365 | 102.66 |
| textured_cube | simd | 4 | 11.2509 | 11.3894 | 91.48 |
| shader_cube | scalar | 1 | 21.6056 | 21.8745 | 46.18 |
| shader_cube | simd | 1 | 21.6737 | 21.8141 | 46.13 |
| shader_cube | scalar | 2 | 11.5125 | 11.6335 | 86.76 |
| shader_cube | scalar | 4 | 11.5155 | 11.6932 | 85.95 |
| shader_cube | simd | 4 | 11.4997 | 12.4015 | 85.84 |
| spirv_cube | scalar | 1 | 18.1517 | 18.2287 | 55.07 |
| spirv_cube | simd | 1 | 18.1705 | 18.4098 | 54.91 |
| spirv_cube | scalar | 2 | 9.7315 | 9.7576 | 102.77 |
| spirv_cube | scalar | 4 | 9.7644 | 9.8982 | 102.21 |
| spirv_cube | simd | 4 | 9.7806 | 9.8745 | 101.98 |
| showcase | scalar | 1 | 102.3843 | 102.8346 | 9.76 |
| showcase | simd | 1 | 103.9947 | 104.5247 | 9.61 |
| showcase | scalar | 2 | 86.2186 | 86.3407 | 11.60 |
| showcase | scalar | 4 | 60.0750 | 60.6059 | 16.65 |
| showcase | simd | 4 | 60.7345 | 61.0710 | 16.49 |

FPS is measured frame count divided by total elapsed render time; it is not
the reciprocal of the median. Shaded-pixel throughput counts executed fragment
shaders, not framebuffer resolution times frames. Triangle throughput counts
submitted triangles, including culled/clipped primitives. Parallel bands repeat
geometry execution; logical submitted geometry is counted once and shading
work is summed. Tile visits can increase at band boundaries.

The executable SHA-256 and all commands/outputs are in
[the raw 0.2 benchmark record](../benchmarks/apple-m2-spirv-2026-09-30.json).
It was collected from clean source commit `6f9e1fce76ad9cfeb5ceff5bece9bc11c9da7e9a`; subsequent release
preparation only changes measurement documentation. The packaged CLI contains
the same measured executable. The earlier, noisier
[0.1 record](../benchmarks/apple-m2-2026-09-30.json) is retained for provenance;
it is not a controlled before/after comparison.

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
