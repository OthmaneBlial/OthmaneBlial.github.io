# Performance snapshot

Collected 2026-09-30T22:25:48+0200 on Apple M2, macOS-26.6-arm64-arm-64bit-Mach-O; rustc 1.95.0 (59807616e 2026-04-14).

Each configuration uses 3 warmups, 20 timed frames, 960×640 and fixed scene time.
Configurations run sequentially. This was a shared desktop with large timing
variation, not an isolated benchmark host or a controlled speedup study. In this
run, the lit GLSL scene's SIMD/four-worker median was 374.4041 ms and its p95 was
1382.1179 ms. These observations should not be treated as representative hardware
limits or compared to a physical GPU. The optional SIMD path remains opt-in.

| Scene | Coverage | Workers | Median ms | p95 ms | Render FPS |
| --- | --- | ---: | ---: | ---: | ---: |
| textured_cube | scalar | 1 | 75.9830 | 216.6606 | 9.12 |
| textured_cube | simd | 1 | 50.2925 | 110.5602 | 17.73 |
| textured_cube | scalar | 2 | 21.0002 | 31.4864 | 45.36 |
| textured_cube | scalar | 4 | 18.4642 | 19.8192 | 55.69 |
| textured_cube | simd | 4 | 18.7459 | 26.8375 | 50.42 |
| shader_cube | scalar | 1 | 146.7632 | 373.7324 | 6.19 |
| shader_cube | simd | 1 | 99.6398 | 193.3388 | 8.55 |
| shader_cube | scalar | 2 | 21.3068 | 40.5008 | 42.26 |
| shader_cube | scalar | 4 | 30.2131 | 39.7540 | 33.73 |
| shader_cube | simd | 4 | 25.2862 | 44.6897 | 37.39 |
| spirv_cube | scalar | 1 | 67.7740 | 191.4304 | 11.36 |
| spirv_cube | simd | 1 | 72.4892 | 139.1521 | 12.33 |
| spirv_cube | scalar | 2 | 28.9307 | 48.1746 | 31.92 |
| spirv_cube | scalar | 4 | 20.9803 | 25.6809 | 46.07 |
| spirv_cube | simd | 4 | 19.8150 | 27.5042 | 48.42 |
| showcase | scalar | 1 | 834.3721 | 975.8861 | 1.29 |
| showcase | simd | 1 | 478.4805 | 690.9882 | 2.00 |
| showcase | scalar | 2 | 272.0346 | 463.6082 | 3.31 |
| showcase | scalar | 4 | 189.0539 | 357.2982 | 4.96 |
| showcase | simd | 4 | 215.7500 | 283.0581 | 4.93 |
| spirv_showcase | scalar | 1 | 1306.2305 | 2232.2314 | 0.72 |
| spirv_showcase | simd | 1 | 913.2619 | 1051.4174 | 1.08 |
| spirv_showcase | scalar | 2 | 679.0865 | 857.1012 | 1.42 |
| spirv_showcase | scalar | 4 | 515.5181 | 617.4358 | 1.96 |
| spirv_showcase | simd | 4 | 374.4041 | 1382.1179 | 1.73 |

FPS is measured frame count divided by total elapsed render time; it is not
the reciprocal of the median. Shaded-pixel throughput counts executed fragment
shaders, not framebuffer resolution times frames. Triangle throughput counts
submitted triangles, including culled/clipped primitives. Parallel bands repeat
geometry execution; logical submitted geometry is counted once and shading
work is summed. Tile visits can increase at band boundaries.

The executable SHA-256 and all commands/outputs are in
[the raw 0.3 benchmark record](../benchmarks/apple-m2-lit-2026-09-30.json).
It was collected from clean source commit `a742e4531622f20d4f86a3f492e0a062adb1c467`. Release
preparation changes docs, artifacts and the animation example, without changing
the rendering implementation. The record identifies its exact benchmark
executable; the packaged CLI also includes the subsequent capture-directory I/O fix.
The earlier [0.2 record](../benchmarks/apple-m2-spirv-2026-09-30.json) and
[0.1 record](../benchmarks/apple-m2-2026-09-30.json) are retained for provenance;
the runs are not controlled before/after comparisons.

A [sequential alternating native check](../benchmarks/apple-m2-native-alternating-2026-09-30.json)
then ran the released 0.2 and current 0.3 CLI, twice each, with 10 timed frames
and scalar coverage/one worker. Render throughput was 3.44/3.66 FPS followed by
4.01/4.00 FPS. The old executable also showed substantial timing variation.
These samples do not establish either a regression or a speedup.

## Final executable check

The [packaged 0.3 CLI record](../benchmarks/apple-m2-release-0.3-2026-09-30.json) was measured after the
capture-directory correction, from clean commit `88aa3b781df9fab4dfebe2f936b4a784ec3ff75b`. At 960×640,
3 warmups and 20 timed frames, the lit GLSL scene with SIMD coverage/four workers
measured median 307.5993 ms, p95 357.7266 ms and 3.10 render FPS on the same
shared desktop. Its executable SHA-256 is `a586469ce1ff05f773d59caca396631dbb51114d73764f90c92ee1e68945d3f6`;
the release archive contains that exact binary. These results exclude presentation
and PNG encoding, and do not demonstrate a speedup over the earlier noisy run.

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

The GLSL version uses `cargo run --release --example animation -- spirv_showcase
output/spirv-frames`. Its 96 frames at scene times i/24 were encoded with FFmpeg
libx264, CRF 20, yuv420p, at 24 fps into `assets/demos/spirv_showcase.mp4`
(640×400, four seconds). Both shader stages run through translated SPIR-V/SIR.
This is also offline playback, not a real-time FPS claim.
