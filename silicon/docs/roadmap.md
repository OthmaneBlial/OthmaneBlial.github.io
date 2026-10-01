# Roadmap and evidence

The original brief describes seventy progressive phases, many explicitly
long-term. This repository ships working stages and labels the remaining work.

| Milestone | Current evidence |
| --- | --- |
| Math / framebuffer / first pixel | Unit tests and `pixel` PNG |
| Lines / triangle / barycentrics | Exact shared-edge, line and varying tests; `triangle` PNG |
| Depth / clipping / culling | Six-plane, depth-discard and culling tests |
| Vertex / fragment programmability | Native Rust closures and SIR programs |
| Perspective / textures / mipmaps | Numeric perspective/sampling tests; textured cube |
| Lit OBJ scene / normals | Original sculpture OBJ, normal matrix, Lambert/Blinn-Phong and point light |
| Window / loop / measured statistics | CLI `run`, finite frame mode, render time in title |
| Commands / buffers / shader VM | Owned typed buffers, validated commands, SIR shader cube |
| Frame capture and replay | Versioned capture owns buffers, textures, pipeline state, SIR modules and commands; byte-exact replay; MSAA state is not captured |
| Frame inspector | `silicon inspect` reports render passes, draw/triangle totals, resources, pipeline state and SIR module instruction counts; no GUI |
| Headless mode | `render` and `replay` write PNGs without opening a window |
| SIMD / tiled parallel rendering | Scalar reference, NEON/AVX2 coverage4, NEON/SSE masked four-fragment SIR, disjoint bands, bitwise equivalence tests |
| SPIR-V / ordinary GLSL | Strict binary parser + typed SIR lowering, textured cube, lit OBJ showcase, local/uniform, arithmetic, and float-negation fixtures |
| Divergent shader control flow | Nested GLSL selections, local/Phi merges, early return/discard; all-mask VM and attachment tests |
| Shadow maps / explicit-LOD sampling | Two SILICON CPU raster passes; 512×512 `Depth32Float` texture sampled by ordinary GLSL/SPIR-V; scalar and SIMD replay match |
| PBR material shading | Cook-Torrance GGX direct lighting, per-material metallic/roughness, tangent-space normal mapping, compiled GLSL/SPIR-V and capture replay |
| Cube-map sampling and visual reflections | Six-face `CubeMap` sampler, mip-selected roughness approximation, native Rust skybox/reflection scene, scalar/SIMD pixel equivalence |
| MSAA | Deterministic 2×/4× coverage with separate color/depth/stencil samples, resolved framebuffer, CLI control, scalar/SIMD band equivalence |
| Anisotropic texture filtering | Derivative-aware 1×–16× sampling, minor-axis mip selection, focused unit test and side-by-side steep-angle scene |
| GPU profiler | Command, vertex, primitive setup, coverage/depth, shader, and blend/write timing with render counters; headless presentation is marked unmeasured |
| Stencil / transparency integration | Circular stencil portal constrains a textured cube and translucent overlay; scalar and SIMD four-band color/depth/stencil match |
| Image regression tests | Approved SIR cube PNG, exact backend comparisons and <=1 channel-step tolerance; failures save `output/shader_cube.diff.png` |
| Fuzzing | cargo-fuzz targets cover SPIR-V parsing/lowering, capture/resource validation and bounded replay, plus triangle setup and texture sampling; see `docs/security.md` |
| Safety review | Explicit input/resource bounds and targeted malformed-input tests; this is not a hostile-workload sandbox or process-wide memory budget |
| JIT shaders | Not implemented; execution stays in the validated SIR interpreter |
| CPU backends | Scalar and four-lane SIMD paths; runtime selects NEON on ARM64 or AVX2 coverage on x86-64, with SSE2 shader arithmetic; no SIMD8, AVX-512 or JIT |
| Pipeline cache (phase 65) | Caller-owned 16-entry cache keyed by exact SPIR-V pairs and pipeline state; built-in cube scenes also retain linked pipeline `Arc`s across frames; reports hit/miss/eviction plus compile/lookup time and has a 100-hit CLI probe |
| Simple Rust graphics API (phase 66) | Versioned `silicon::api` facade, bounded SPIR-V shader/pipeline creation, owned typed buffers, command submission to an explicit renderer, and a runnable direct-triangle example |
| C API (phase 67) | Version-1 shared library and header expose opaque device/resource/command handles, synchronous draw submission and RGBA8 readback; standalone C client renders a SPIR-V triangle |
| Vulkan-like compatibility subset (phase 68) | Rust-only instance/device, typed buffers, RGBA8 images, SPIR-V pipelines, descriptor-like bindings, one offscreen render pass and synchronous queue; indexed textured triangle example. This is not Vulkan ABI, loader, or conformance support |
| Third-party demo (phase 69) | Khronos Vulkan-Samples `hello_triangle` at a pinned upstream commit; adapted vertex layout, upstream SPIR-V fragment shader, CPU framebuffer output and a color-interpolation integration test |
| DOOM (phase 70, in progress) | Reads Freedoom 0.13.0 E1M1, palette-decodes flats, composes opaque wall textures from WAD patches, and submits 4,812 BSP-leaf/wall triangles across 141 SILICON draws. Masked mid-textures, visibility traversal, and gameplay remain. See [Freedoom checkpoint](freedoom.md) |

Next: JIT remains an advanced experiment; only consider it after more interpreter evidence. The
current cube-map demo and anisotropic sampler use native Rust closures; SPIR-V
`samplerCube` binding and anisotropic implicit sampling remain future work.

Future research: multiple targets, full tile binning, loops and broader control flow,
compute/storage/shared-memory/atomics, JIT, DOOM masked textures and gameplay, and
possibly a software ray-tracing unit.

None of those future items are advertised as implemented. Conformant Vulkan/OpenGL
drivers, general SPIR-V compatibility, WGSL and games are **unsupported**. The
small Rust-only subset does not provide Vulkan loader or binary compatibility.
No existing rasterizer, Mesa, LLVMpipe, SwiftShader, ANGLE or wgpu backend is used.
