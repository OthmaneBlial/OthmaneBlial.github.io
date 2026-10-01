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
| SPIR-V / ordinary GLSL | Strict binary parser + typed SIR lowering, textured cube, lit OBJ showcase, local/uniform, arithmetic, and float-negation fixtures |
| Divergent shader control flow | Nested GLSL selections, local/Phi merges, early return/discard; all-mask VM and attachment tests |
| Shadow maps / explicit-LOD sampling | Two SILICON CPU raster passes; 512×512 `Depth32Float` texture sampled by ordinary GLSL/SPIR-V; scalar and SIMD replay match |
| PBR material shading | Cook-Torrance GGX direct lighting, per-material metallic/roughness, tangent-space normal mapping, compiled GLSL/SPIR-V and capture replay |
| Stencil / transparency integration | Circular stencil portal constrains a textured cube and translucent overlay; scalar and SIMD four-band color/depth/stencil match |
| Regression images | Approved SIR cube PNG; cross-platform tolerance <=1 channel step |

Next: add environment lighting to the PBR scene; profile shader costs before
performance changes.

Future research: multiple targets, full tile binning, loops and broader control flow,
compute/storage/shared-memory/atomics, cubemaps, MSAA, JIT,
pipeline caches, C API, a tiny real API compatibility layer, third-party demo,
DOOM geometry through SILICON and possibly a software ray-tracing unit.

None of those future items are advertised as implemented. Vulkan/OpenGL,
general SPIR-V compatibility, WGSL and games are currently **unsupported**. No existing rasterizer,
Mesa, LLVMpipe, SwiftShader, ANGLE or wgpu backend is used.
