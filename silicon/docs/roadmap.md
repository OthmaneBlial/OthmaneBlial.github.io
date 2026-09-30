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
| Capture / replay / inspection / pixel trace | Embedded resources/programs, byte-exact roundtrip and CLI |
| SIMD / tiled parallel rendering | Scalar reference, NEON/AVX2 coverage4, NEON/SSE masked four-fragment SIR, disjoint bands, bitwise equivalence tests |
| SPIR-V / ordinary GLSL | Strict binary parser + typed SIR lowering, textured cube, lit OBJ showcase, local/uniform and arithmetic fixtures |
| Regression images | Approved SIR cube PNG; cross-platform tolerance <=1 channel step |

Next: strengthen stencil/transparency integration demos; profile and optimize
interpolation and shader costs; extend the [current SPIR-V subset](spirv.md)
with bounded control flow driven by ordinary shader fixtures; then shadow mapping and a more advanced scene.

Future research: multiple targets, full tile binning, divergent shader control flow,
compute/storage/shared-memory/atomics, cubemaps, PBR/normal maps, MSAA, JIT,
pipeline caches, C API, a tiny real API compatibility layer, third-party demo,
DOOM geometry through SILICON and possibly a software ray-tracing unit.

None of those future items are advertised as implemented. Vulkan/OpenGL,
general SPIR-V compatibility, WGSL and games are currently **unsupported**. No existing rasterizer,
Mesa, LLVMpipe, SwiftShader, ANGLE or wgpu backend is used.
