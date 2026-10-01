# Performance measurements

## Pipeline-cache probe

`silicon pipeline-cache vertex.spv fragment.spv` compiles and links one cold
pipeline, then records 100 warm cache hits. It reports the cold wall time, mean
warm lookup time, and accumulated compile/key-lookup timings. This is a local
single-pair probe, not a multi-scene or repeated-run speedup claim.

Five sequential release runs on 2026-10-01 for the textured shader pair measured
a median 0.147 ms cold miss and 1.345 µs per warm hit. Warm-hit samples ranged
from 1.320 to 29.708 µs, showing shared-host timing noise. The probe excludes
rendering and covers only this shader pair; it is not a general speedup claim.

## 0.7 perspective interpolation

The [alternating raw record](../benchmarks/apple-m2-interpolation-2026-10-01.json)
compares the released 0.7.0 executable with commit `f097e9ed8b90c68a63d6752d5869c7961ac1cedb`
and candidate binary SHA-256 `3185558349ae15d3c37563c140c3e7a1e7285e5d1c3289e2259f1934987ef4d4`.
On the shared Apple M2 (macOS 26.6), each configuration used 3 warmups,
60 timed frames, 960×640, fixed scene time 0, and two rounds with reversed
order. The scene was `spirv_showcase`; the compared path was four-worker NEON.

| Build | Round 1 median / p95 ms | Round 2 median / p95 ms |
| --- | ---: | ---: |
| 0.7.0 baseline | 275.90 / 284.51 | 256.77 / 266.15 |
| Interpolation candidate | 254.85 / 266.03 | 252.22 / 268.75 |

Across the two run medians, the candidate was 4.8% lower (266.34 → 253.54 ms);
the average p95 was 2.9% lower. The baseline drifted 7% between rounds, so treat
this as a modest result for this host and scene, not a general performance claim.
Both executables performed exactly 23,297,700 shaded fragments, 755,280
submitted triangles, and 3,184,437,960 shader instructions. Five scenes also
produced byte-identical 320×200 PNGs between builds in each of scalar and SIMD
modes.

The change interpolates all varyings at the fragment position, but only the UV
varying at the two derivative probes used for implicit texture LOD. An
instrumented four-worker profile measured 300.20 ms of accumulated fragment
shader time inside 377.76 ms accumulated raster-stage time, against 183.05 ms
wall time. These worker sums overlap and the per-packet timing is instrumented;
they are not exclusive stage shares. Native sampling still points to shader
execution as the next optimization target.

## 0.7 PBR direct-light baseline before normal mapping

The [raw PBR record](../benchmarks/apple-m2-pbr-2026-10-01.json) measures the
pre-normal-map source commit `3288feddd24bd26d2c1213641da9f2d94523af73` and its
recorded binary hash on the shared Apple M2 / macOS 26.6. The `pbr_showcase` ran at
640×400 with SIMD coverage, four workers, three warmups, and 30 timed frames.
The median was 91.74 ms, p95 was 92.88 ms, and throughput was 10.88 FPS.
The run executed 871,258,590 SIR instructions across 4,586,070 shaded
fragments (about 190 instructions per fragment). This is a single-scene
baseline, not a performance comparison or a general throughput claim.

An instrumented profile at the same size and worker count reported 106.43 ms
wall time, 164.81 ms accumulated fragment-shader time, and 222.22 ms summed
worker-stage time. These worker sums overlap; the instrumentation adds clock
overhead, so they identify shader work as a profiling target without defining
exclusive stage shares.

## Normal-map PBR shader-work sample

The [raw post-normal-map record](../benchmarks/apple-m2-pbr-normal-map-2026-10-01.json)
uses commit `23959a2015923135c4fe4c2a67fa35490bcfb716`, 640×400, four-worker
NEON coverage, three warmups and 30 timed frames. Its counter totals correspond
to about 207 SIR instructions and 1.06 texture samples per shaded fragment,
compared with about 190 instructions and 1.00 sample in the earlier direct-light
record. The wall-clock median was 395.60 ms, but frames ranged from 215.98 to
772.71 ms while the host showed heavy external CPU activity. Treat this as a
shader-work sample only; rerun on an idle host before using its timing values.

## 0.5 control-flow checkpoint

The [pre-optimization alternating record](../benchmarks/apple-m2-control-before-counters-2026-10-01.json)
uses the released 0.4 executable and control-flow source commit
`204361fbf8f53e7a534c3fa8342020f2870abb72`, each with 3 warmups,
20 timed frames, 960×640, scene time 0, and reversed configuration order.
It retains per-frame reports from both executables. No other SILICON build,
test or render ran during this comparison; the Mac remained a shared desktop.

Large drift occurred in both executables: baseline SIMD/one-worker median
changed from 1390.28 to 795.06 ms; the initial control-flow SIMD median changed
from 2480.51 to 1038.73 ms. These runs do not establish a regression or speedup,
and are not the final packaged executable's measurements.

A subsequent three-second native CPU sample of the initial 0.5 executable
(SHA-256 `764fb7b5f10c214d35252e636cc280c0cd502a50cad0342869c3b83c28775f9d`)
and ARM64 disassembly located repeated result-counter loads/adds/stores in the
fragment VM. The counter update now groups consecutive instructions with the same execution
mask and applies each run's count to its active fragments, while traces use a
combined mask to bypass the per-lane tracing loop when disabled.
All-mask scalar/packet tests retain identical instruction totals and traces.
A [histogram-counter trial](../benchmarks/apple-m2-control-histogram-2026-10-01.json)
did not demonstrate a gain on the cutout scene and was replaced by this run
counter; the raw unsuccessful measurement is retained.

The [final run-counter cutout record](../benchmarks/apple-m2-control-runs-2026-10-01.json)
uses clean source commit `4233bfc7b259a2af16e5a09f55a9be0255ee2bd5`
and executable SHA-256 `e2ea05675672264772ff8364c3bf76a351da8dc5538ee601646c1b55085e2a9f`.
With 30 timed frames, 3 warmups, 960×640 and time 0, scalar/four-worker median
was 40.38 / 44.32 ms and SIMD/four-worker median was 32.69 / 35.71 ms;
render throughput was 22.92 / 21.21 and 27.55 / 25.99 FPS respectively.
The pre-counter SIMD baseline moved from 50.35 to 30.42 ms, so these samples
do not establish a reliable optimization gain. This small 12-triangle cube is
not a performance result for the 12,588-triangle lit scene or window presentation.
Each timed cutout frame shades 75,726 invocations, discards
8,970 and performs 39,344 texture lookups. Reports retain actual dynamic work counts and per-frame samples.

## 0.5 packaged executable check

The [final lit-scene alternating record](../benchmarks/apple-m2-release-0.5-2026-10-01.json)
uses that exact packaged executable and the released 0.4 baseline. Each
configuration ran twice in reversed order, with 3 warmups, 20 timed frames,
960×640 and time 0. The working tree contained only the preceding benchmark
record and documentation updates; rendering/compiler code and the binary
were unchanged from `4233bfc7b259a2af16e5a09f55a9be0255ee2bd5`.
No other SILICON build, test or render ran concurrently.

Both rounds are shown as first / second; FPS uses total timed rendering duration.

| Backend | Workers | Median ms | p95 ms | Render FPS |
| --- | ---: | ---: | ---: | ---: |
| 0.4 SIMD | 1 | 1392.58 / 337.62 | 1789.04 / 497.79 | 0.75 / 2.78 |
| 0.5 scalar | 1 | 1163.89 / 829.79 | 1592.69 / 925.21 | 0.82 / 1.23 |
| 0.5 SIMD | 1 | 752.52 / 1790.48 | 920.86 / 3250.68 | 1.33 / 0.51 |
| 0.4 SIMD | 4 | 335.95 / 943.32 | 464.95 / 1388.05 | 2.89 / 1.10 |
| 0.5 scalar | 4 | 583.26 / 552.63 | 771.12 / 1815.28 | 1.68 / 1.21 |
| 0.5 SIMD | 4 | 367.94 / 552.64 | 517.59 / 1014.78 | 2.62 / 1.64 |

The baseline itself varies by several times between rounds. These shared-host
samples establish neither a reliable speedup nor a regression. They exclude
presentation and image export. The earlier 0.4 results below are historical
measurements from a different run, not a current 0.5 performance promise.

Each frame submits 12,588 triangles, shades 388,295 fragments, performs
388,295 texture lookups and discards none. Actual SIR instructions total
51,127,254 with one worker or 53,073,966 with four: worker bands repeat vertex
execution, while submitted geometry is counted once. SIMD uses 113,864 packets
at 85.3% active-lane occupancy. Scalar/SIMD output remains byte-identical to
the approved lit-scene PNG.

## 0.4 masked shader packets

The [alternating raw record](../benchmarks/apple-m2-packets-2026-09-30.json)
compares the released 0.3 executable with 0.4 scalar/SIMD, with one/four workers.
Each configuration ran twice in reversed order, with 3 warmups, 20 timed frames,
960×640 and scene time 0. No build or other SILICON test/render ran concurrently.
The host remains a shared Apple M2 desktop, macOS 26.6; these are observations for
this scene, not general hardware or x86 performance claims.

Both rounds are shown as first / second; FPS uses total timed rendering duration.

| Backend | Workers | Median ms | p95 ms | Render FPS |
| --- | ---: | ---: | ---: | ---: |
| 0.3 coverage SIMD | 1 | 441.68 / 442.52 | 442.44 / 443.01 | 2.26 / 2.26 |
| 0.4 scalar | 1 | 457.48 / 456.45 | 458.63 / 457.48 | 2.19 / 2.19 |
| 0.4 coverage + shader SIMD | 1 | 285.01 / 283.41 | 285.84 / 284.24 | 3.51 / 3.53 |
| 0.3 coverage SIMD | 4 | 224.95 / 224.94 | 225.28 / 225.45 | 4.44 / 4.44 |
| 0.4 scalar | 4 | 230.96 / 231.16 | 231.68 / 232.31 | 4.33 / 4.32 |
| 0.4 coverage + shader SIMD | 4 | 142.05 / 141.40 | 142.32 / 142.85 | 7.04 / 7.06 |

On this run, the combined SIMD backend's median render time was about 38–39% lower
than 0.4 scalar, and about 35–37% lower than the released 0.3 coverage-only SIMD.
The comparison includes rendering, command creation/validation and packet setup;
it is not a shader-only microbenchmark. Scalar remains the default and SIMD opt-in.

The 0.4 record identifies clean source commit
`87836287eb8dff700618b0e807e8f325ff97f95d` and executable SHA-256
`83862ae62f119a901ee258c4f3c8e833753df63fd1091637843028043b3fa2fe`.
It also retains chronological per-frame samples for 0.4, commands, CLI metadata,
logical work counters and both instrumented profiles. The older CLI exposes
aggregate timings only; per-frame baseline samples are unavailable.

At one worker, the scene executes 388,295 active fragments in 113,864 shader
packets: 85.3% occupancy. Logical SIR work remains 50,716,583 instructions and
388,295 texture samples, including vertex-stage work. Both executables reproduce
the approved 960×640 lit-scene PNG byte-for-byte. Profile clocks differ between
one call per fragment and one call per packet; use the uninstrumented timings
above for comparisons. See [SIMD implementation and mask checks](simd.md).

```sh
cargo build --release -p silicon-cli
python3 benchmarks/compare.py --baseline /path/to/silicon-0.3.0/silicon --frames 20 --output output/comparison.json
```

## 0.3 historical snapshot

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

## 0.3 packaged executable check

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
cargo run --release -p silicon-cli -- profile spirv_showcase --threads 4
python3 benchmarks/compare.py --baseline /path/to/silicon-baseline --scene spirv_showcase --workers 4 --frames 60 --output output/comparison.json
```

The benchmark excludes PNG export, window creation, pixel-buffer conversion
and presentation. Cached built-in mesh/texture construction is amortized by
warmups. SIR scene command creation and validation are included. All allocations,
clipping, shader execution, depth/stencil and blending during rendering are
included. `silicon profile` reports command processing, vertex processing,
primitive setup, coverage/depth rasterization, fragment shading, and blend/write
time, plus the triangle, fragment, early-Z, shader, and texture counters. Stage
timers are instrumented; parallel worker sums can overlap and exceed wall time.
Presentation is not measured by the headless profile command.

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
