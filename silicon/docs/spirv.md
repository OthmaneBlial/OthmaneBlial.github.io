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
for shader in textured.vert textured.frag arithmetic.frag lit.vert lit.frag locals.frag; do
  glslangValidator -V --target-env vulkan1.0 -o "assets/shaders/$shader.spv" "assets/shaders/$shader"
  spirv-val --target-env vulkan1.0 "assets/shaders/$shader.spv"
done
cargo run --release -p silicon-cli -- inspect-shader assets/shaders/textured.vert.spv
cargo run --release -p silicon-cli -- render-shaders assets/shaders/textured.vert.spv assets/shaders/textured.frag.spv --output output/glsl.png
cargo run --release -p silicon-cli -- run spirv_showcase
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

## Accepted subset

- One `main` entry point: Vertex or Fragment, one `void()` function, one basic
  block, `OpReturn`, Logical/GLSL450 memory model, Shader capability. Fragment
  requires OriginUpperLeft. GLSL.std.450 supports `Pow`, `FMin`, `FMax`,
  `FClamp`, `FMix`, `Length` and `Normalize` with checked operand counts/types.
- Float32 scalars, vec2/3/4, mat4; int32 constants only for member indices;
  logical input/output/uniform/sampler/Function pointers; one-member structs.
  Float/vector locals must be declared first in the block and initialized before
  loading. Stores preserve previous SSA snapshots; component stores require an
  initialized vector. Local matrices and guest pointer memory are unsupported.
- `OpConstant`, vector `OpConstantComposite`, `OpVariable`, `OpLoad`, `OpStore`,
  constant-index uniform-member and uniform/local vector-component `OpAccessChain`, vector `OpCompositeConstruct`,
  `OpCompositeExtract`, `OpVectorShuffle`, float/vector/matrix/sampler `OpCopyObject`.
- `OpFAdd`, `OpFSub`, `OpFMul`, `OpFDiv`, `OpVectorTimesScalar`,
  uniform `OpMatrixTimesVector`, `OpDot`, combined sampler2D
  `OpImageSampleImplicitLod`.
- Location, Binding, DescriptorSet, Block, BuiltIn Position, ColMajor,
  MatrixStride and Offset decorations, checked against the binding contract.
  Debug names and source-language metadata are read without executing them.

The public binary parser checks framing, string padding, supported instruction
shapes, unique IDs and all ID references. Translation then checks accepted types,
operand types, pointer storage/pointees, decorations, functions, blocks and
interfaces. It rejects unsupported instructions with file (CLI), binary word
offset, opcode name/number and reason. This deliberately is not a replacement
for `spirv-val`'s complete SPIR-V/Vulkan validation rules.

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

## Limits and evidence

At most 1 MiB per module, ID bound 65536, 256 virtual SSA temporaries, 64
simultaneously live runtime registers and 4096 SIR instructions. Dead temporaries
are recycled after their last use, without increasing VM storage. There are no
branches, phi, loops, function calls, integer arithmetic, specialization constants,
SSBOs, storage images, explicit LOD, transformed sample coordinates, compute,
WGSL or GLSL compiler. Unsupported cases return errors. Zero-length normalization
returns zero; undefined GLSL inputs do not establish a conformance guarantee.

Tests compare compiled GLSL with an independent hand-written SIR reference at
exact framebuffer bytes, then capture/replay and SIMD/four-band rendering.
A second GLSL fixture checks vector shuffle, add/sub/divide, dot, scalar multiply
and implicit sampling against numeric expectations. The lit scene matches native
coverage/depth exactly and colors within one RGBA8 quantization unit; captures
and scalar/SIMD/four-band replays match exactly. A local-variable fixture checks
snapshot aliases, component stores and padded scalar/vec2/vec3 uniform resources. Header/ID/type/storage/
decoration/block errors, truncated inputs, byte-swapped modules and 1500 bounded
deterministic binary mutations are checked. Mutation coverage is not exhaustive
fuzzing or a hostile-shader sandbox guarantee.

References: [Khronos SPIR-V specification](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html)
[GLSL.std.450](https://registry.khronos.org/SPIR-V/specs/unified1/GLSL.std.450.html)
and [Khronos binary grammar](https://github.com/KhronosGroup/SPIRV-Headers/blob/main/include/spirv/unified1/spirv.core.grammar.json).
