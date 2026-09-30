# Four-fragment SIR execution

`--backend simd` enables two independent optimizations: fixed-point coverage4
(NEON on ARM64, runtime-detected AVX2 on x86-64) and four-fragment SIR arithmetic
(NEON on ARM64, baseline SSE/SSE2 on x86-64). Other architectures use portable
four-lane arithmetic. `--backend scalar` retains the independent scalar SIR VM.
No dependency or host GPU executes shader instructions.

The rasterizer visits four adjacent x positions within a 16×16 tile. Coverage,
framebuffer edges, worker band boundaries, stencil and early depth rejection form
a four-bit mask. Only surviving lanes run a shader. These are horizontal packets,
not 2×2 derivative quads: implicit texture LOD still uses the renderer's existing
analytic neighboring interpolation. Fragments own distinct pixels; triangle and
draw order are preserved. Blend, depth, stencil and shader discard run per pixel.
Rejected debug pixels retain their rejection trace without executing a shader.

`Program::execute4` stores 64 component registers in structure-of-arrays form:
each x/y/z/w component contains four fragment values. Instruction dispatch is
shared; add/subtract/multiply/divide, dots, matrix transforms, lengths and
normalization use four-float arithmetic. Full division/square root and the scalar
operation order are retained. Power, min/max, clamp and texture callbacks use
scalar operations. Vertex shaders and native Rust shader closures remain scalar.
Structured selections carry true/false lane masks and reconverge at `EndIf`.
Nested branches preserve masked register writes; returned/discarded lanes stay
terminated. See [SIR control flow](sir.md).

Masks outside 0..15 fail. A zero mask accesses no resources. Inactive inputs,
LODs, samples, outputs and traces are never consumed. Finite-value checks run
after every instruction, including samples. SIMD exponent checks combine all
four components into a bad-lane mask; inactive NaN/infinity values are ignored.
Errors identify the SIR instruction and lane; command errors add mask and pixel
coordinates. Validation and register bounds are unchanged from the scalar VM.
The small intrinsic helpers access only fixed host arrays, with documented
unsafe blocks. See [Rust's architecture intrinsics](https://doc.rust-lang.org/stable/core/arch/).

`tests/packets.rs` compares output and intermediate trace bits, logical instruction
counts and sample coordinates for every mask, including zero normals and scalar
normalization. It tests infinity/NaN in every component/lane, finite extremes and
subnormals, missing resources and inactive lanes. Recorded SIR/GLSL cube and lit
showcase replay compare exact color, depth and stencil with one/four workers at
an odd framebuffer size. The control-flow tests also compare nested divergence, Phi/local merges, early
return, discard, skipped resources, mutable registers and attachment preservation.
CI runs these checks on ARM64 and x86-64.

```sh
cargo run --release -p silicon-cli -- render spirv_showcase --backend simd
cargo run --release -p silicon-cli -- profile spirv_showcase --backend simd
cargo run --release -p silicon-cli -- benchmark spirv_showcase --backend simd --frames 30 --report output/packet-frames.json
```

Packet count and active-lane count measure actual fragment VM work. Occupancy is
`active / (4 × packets)`; SIR instruction/sample counters count actual
per-lane executions, excluding skipped branches. They include vertex work repeated
by each band; submitted geometry counts remain logical, counted once.
`discarded` counts shaded invocations that produce no attachment writes. Native scenes report no SIR
packets. Profile clocks instrument packet calls and can change timing overhead;
use uninstrumented benchmarks for performance comparisons. Reports preserve
chronological frame times, scene dimensions/time, backend, warmups and workers.
SIMD remains opt-in; a SIMD implementation alone does not establish a speedup.
See [measured performance](performance.md).
