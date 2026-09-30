# SPIR-V → SIR → CPU pixels

SILICON implements a **strict SPIR-V 1.0 graphics subset**, implemented directly in
Rust. It parses binary words, validates the supported module and translates it
into SIR. Both vertex and fragment programs execute through the existing CPU VM.
No external compiler or GPU is called at runtime. This is not SPIR-V conformance,
a Vulkan driver, or general GLSL support.

## Reproduce with ordinary GLSL

The committed original GLSL sources and their `.spv` fixtures are in
[`assets/shaders`](https://github.com/OthmaneBlial/silicon/tree/main/assets/shaders). They were compiled with Khronos glslang
16.6.0 and checked with SPIRV-Tools 1.4.357.0. These tools are needed only to
recompile fixtures, not to build, test or run SILICON:

```sh
for shader in textured.vert textured.frag arithmetic.frag lit.vert lit.frag shadow.frag locals.frag control.frag; do
  glslangValidator -V --target-env vulkan1.0 -o "assets/shaders/$shader.spv" "assets/shaders/$shader"
  spirv-val --target-env vulkan1.0 "assets/shaders/$shader.spv"
done
spirv-opt --ssa-rewrite assets/shaders/control.frag.spv -o assets/shaders/control.ssa.frag.spv
spirv-val --target-env vulkan1.0 assets/shaders/control.ssa.frag.spv
glslangValidator -V --target-env vulkan1.0 -Os assets/shaders/boolean.frag -o assets/shaders/boolean.frag.spv
glslangValidator -V --target-env vulkan1.0 assets/shaders/boolean.frag -o assets/shaders/boolean.locals.frag.spv
spirv-val --target-env vulkan1.0 assets/shaders/boolean.frag.spv
spirv-val --target-env vulkan1.0 assets/shaders/boolean.locals.frag.spv
cargo run --release -p silicon-cli -- inspect-shader assets/shaders/textured.vert.spv
cargo run --release -p silicon-cli -- render-shaders assets/shaders/textured.vert.spv assets/shaders/textured.frag.spv --output output/glsl.png
cargo run --release -p silicon-cli -- run spirv_showcase
cargo run --release -p silicon-cli -- render shadow_showcase --backend simd --threads 4 --output output/shadows.png --capture output/shadows.silicon
cargo run --release -p silicon-cli -- run spirv_cutout --backend simd
cargo run --release -p silicon-cli -- run spirv_cube
cargo run --release -p silicon-cli -- render spirv_cube --capture output/glsl.silicon
cargo run --release -p silicon-cli -- replay output/glsl.silicon
```

`render-shaders` loads the supplied binaries and uses the cube's ordinary vertex,
index, uniform and texture resources. It checks stage order and every consumed
varying's location/type before creating the pipeline. Changing a supported
shader changes its executed program; the renderer does not recognize shader
hashes or replace them with native shader closures. `spirv_cube` and `spirv_showcase` cache their
translated built-in programs. The latter records the same 30 draws and 12,588
triangles as the native lit OBJ reference: normal transforms, Lambert/Blinn-Phong,
directional/point lights, fog and display transfer execute in the VM. Captures embed the **lowered SIR**, resources and
commands; replay does not need the original SPIR-V files.

![CPU cutout: discarded region, sampled checks and constant-color branch](../assets/screenshots/spirv_cutout.png)

`shadow_showcase` runs the same 30-draw OBJ scene twice: SILICON first writes a
512×512 CPU depth attachment from a fixed directional light, then the GLSL
fragment shader samples that serialized `Depth32Float` texture to shade visible
surfaces. Both passes use SILICON's rasterizer; no external renderer contributes pixels.

## Accepted subset

- One `main` entry point: Vertex or Fragment, one `void()` function, acyclic structured
  selection blocks, `OpReturn`, Logical/GLSL450 memory model, Shader capability. Fragment
  requires OriginUpperLeft. GLSL.std.450 supports `Pow`, `FMin`, `FMax`,
  `FClamp`, `FMix`, `Length` and `Normalize` with checked operand counts/types.
- Float32 scalars, vec2/3/4, mat4 and scalar bool; int32 constants only for member indices;
  logical input/output/uniform/sampler/Function pointers; one-member structs.
  Float/vector/bool locals must be declared first in the entry block and initialized
  on every live path before loading. Stores preserve previous SSA snapshots; component stores require an
  initialized vector. Local matrices and guest pointer memory are unsupported.
- `OpConstant`, `OpConstantTrue/False`, vector `OpConstantComposite`, `OpVariable`, `OpLoad`, `OpStore`,
  constant-index uniform-member and input/uniform/local vector-component `OpAccessChain`, vector `OpCompositeConstruct`,
  `OpCompositeExtract`, `OpVectorShuffle`, float/vector/matrix/sampler `OpCopyObject`.
- `OpFAdd`, `OpFSub`, `OpFMul`, `OpFDiv`, `OpVectorTimesScalar`,
  uniform `OpMatrixTimesVector`, `OpDot`, combined sampler2D
  `OpImageSampleImplicitLod`, and `OpImageSampleExplicitLod` with a scalar LOD and
  the Lod-only image operand mask.
- `OpBranch`, scalar-bool `OpBranchConditional`, `OpSelectionMerge None`,
  float/vector/bool `OpPhi`, fragment `OpKill`, and early `OpReturn`.
  Scalar float ordered comparisons (equal, unequal, less/greater, inclusive forms),
  `OpFUnordNotEqual`, scalar bool logical equal/unequal/and/or/not, and `OpSelect`
  with a scalar bool and matching scalar float/bool alternatives.
- Location, Binding, DescriptorSet, Block, BuiltIn Position, ColMajor,
  MatrixStride and Offset decorations, checked against the binding contract.
  Debug names and source-language metadata are read without executing them.

The public binary parser checks framing, string padding, supported instruction
shapes, unique IDs and all ID references. Translation then checks accepted types,
operand types, pointer storage/pointees, decorations, functions, blocks and
interfaces. It rejects unsupported instructions with file (CLI), binary word
offset, opcode name/number and reason. This deliberately is not a replacement
for `spirv-val`'s complete SPIR-V/Vulkan validation rules.

`spirv_cutout` uses the SSA fixture directly. No optimization tool runs at runtime.
Branch lowering preserves per-path SSA availability and definite local/output
initialization, then uses SIR masks and reconvergence. Float comparisons retain
SIR's finite-value policy; NaN/infinity are rejected rather than assigned general
GLSL unordered-comparison behavior. Implicit LOD remains SILICON's analytic UV
approximation even in divergent branches, not hardware derivative conformance.

## Binding contract

| GLSL/SPIR-V interface | SILICON resource |
| --- | --- |
| Vertex inputs locations 0/1/2/3 | position vec3 / color vec4 / UV vec2 / normal vec3 |
| Vertex Position | SIR output 0, homogeneous clip position |
| Vertex outputs locations 0..3 | SIR outputs 1..4, perspective varyings |
| Fragment inputs locations 0..3 | SIR inputs 0..3 |
| Fragment output location 0 | RGBA vec4 |
| Set 0, binding B | One float/vector/mat4 member at offset 0; float/vector uses SIR uniform 4B, col-major mat4 with stride 16 uses rows 4B..4B+3 |
| Set 1, binding B | Combined sampler2D at texture slot B |

The shadow shader binds the single-level 32-bit float depth texture at set 1,
binding 1, and supplies its light matrix and bias at uniform bindings 6 and 7.

Bindings are 0..15. This adapter maps mathematical matrices to SIR's row-major
vectors; it does **not** interpret raw Vulkan descriptor memory. The cube binds
MVP at 0, model matrix at 1, normal matrix at 2, material color at 3,
texture/metallic/emission parameters at 4, camera position at 5 and texture 0.
The lit showcase uses the same bindings per draw. The vertex GLSL explicitly redeclares
`gl_PerVertex` with only `gl_Position`; other built-ins/arrays are unsupported.

Implicit sampling currently requires the **unmodified vec2 fragment input at
location 1**. Its LOD uses SILICON's neighboring-center perspective UV derivative
approximation, independently for each bound texture's dimensions. It is not a
hardware quad derivative/conformance claim. Vector padding is zeroed; vec2/3
division uses safe unused lanes and preserves the actual components. Scalar
results are splatted into SIR registers.

Explicit-LOD sampling accepts vec2 coordinates (including transformed
coordinates) and one scalar LOD; offsets, gradients, and other image operands
remain unsupported.

## Limits and evidence

At most 1 MiB per module, ID bound 65536, 256 virtual SSA temporaries, 64
simultaneously live runtime registers and 4096 SIR instructions. Dead temporaries
are recycled after their last use, without increasing VM storage. Selection nesting is bounded to 64 and main to 4096 SPIR-V instructions. There are no
loops, switches, function calls, integer arithmetic, specialization constants,
SSBOs, storage images, implicit samples from transformed coordinates,
explicit sample offsets/gradients, compute,
WGSL or GLSL compiler. Unreachable blocks are accepted only as isolated `OpUnreachable` merge blocks.
Conditional targets must be distinct; overlapping regions, back edges and branches
outside their structured region fail. Phi pairs must match all predecessors,
with values available on the named paths. General arbitrary CFGs and vector bool
are unsupported. Unsupported cases return errors. Zero-length normalization
returns zero; undefined GLSL inputs do not establish a conformance guarantee.

Tests compare compiled GLSL with an independent hand-written SIR reference at
exact framebuffer bytes, then capture/replay and SIMD/four-band rendering.
A second GLSL fixture checks vector shuffle, add/sub/divide, dot, scalar multiply
and implicit sampling against numeric expectations. The lit scene matches native
coverage/depth exactly and colors within one RGBA8 quantization unit; captures
and scalar/SIMD/four-band replays match exactly. A local-variable fixture checks
snapshot aliases, component stores and padded scalar/vec2/vec3 uniform resources.
The shadow fixture verifies explicit-LOD sampling of a serialized depth pass and
pixel/depth/stencil identity across scalar and SIMD four-band replay. The cutout
GLSL fixture and its SPIRV-Tools SSA version check nested discard,
conditional texture calls, local/Phi reconvergence and early returns against
an independent numeric reference for every lane mask. Boolean fixtures cover
logical math and selection. Captured cutout color/depth/stencil match exactly
across scalar, packet and four-band execution. Targeted CFG/Phi/path mutations
and another 1000 binary mutations exercise control-flow rejection. Header/ID/type/storage/
decoration/block errors, truncated inputs, byte-swapped modules and 1500 bounded
deterministic binary mutations are checked. Mutation coverage is not exhaustive
fuzzing or a hostile-shader sandbox guarantee.

References: [Khronos SPIR-V specification](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html)
[GLSL.std.450](https://registry.khronos.org/SPIR-V/specs/unified1/GLSL.std.450.html)
and [Khronos binary grammar](https://github.com/KhronosGroup/SPIRV-Headers/blob/main/include/spirv/unified1/spirv.core.grammar.json).
