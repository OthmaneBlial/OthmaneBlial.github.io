# SILICON 0.6.0 — macOS ARM64 CLI

A GPU built entirely in software. This experimental pre-1.0 CLI generates every
scene pixel through SILICON's Rust CPU pipeline. The window presents the finished
framebuffer; headless rendering needs no display or graphics device.

This archive is for Apple Silicon Macs. It was tested on Apple M2 / macOS 26.6.
The executable is ad hoc signed, without Developer ID signing or notarization.
Linux ARM64/x86-64 are source/CI targets; this archive does not contain Linux builds.

From the extracted directory:

```sh
./silicon info
./silicon render spirv_showcase --backend simd --threads 4 --output output/scene.png
./silicon render spirv_cutout --backend simd --threads 4 --output output/cutout.png --capture output/frame.silicon
./silicon render shadow_showcase --backend simd --threads 4 --output output/shadows.png --capture output/shadows.silicon
./silicon replay output/frame.silicon --output output/replay.png
./silicon debug-pixel spirv_cutout --pixel 320,200
./silicon run spirv_showcase --backend simd --threads 4
./silicon benchmark spirv_cutout --backend simd --threads 4 --frames 20 --report output/frames.json
```

Window keys: Escape exits, Space pauses, arrows adjust rotation. Performance
measurements exclude image encoding and presentation; host load affects timings.
SIMD remains opt-in. The independent scalar VM is the correctness reference.

External shader fixtures are included for inspection and headless cube rendering:

```sh
./silicon inspect-shader assets/shaders/control.ssa.frag.spv
./silicon render-shaders assets/shaders/textured.vert.spv assets/shaders/control.ssa.frag.spv --backend simd --output output/external.png
```

The SPIR-V 1.0 subset supports acyclic structured selections, Phi/local merges,
scalar bool, early return, fragment discard and scalar explicit-LOD texture
sampling. `shadow_showcase` samples a SILICON-generated CPU depth map. General
GLSL/SPIR-V conformance, loops, switches, Vulkan/OpenGL drivers, compute, JIT,
MSAA and games remain unsupported. Captures embed lowered SIR and owned resources; newer SIR
instructions require this CLI or newer. Older version-1 captures remain readable.

Documentation and benchmark records are included in `docs/` and `benchmarks/`.
Source: https://github.com/OthmaneBlial/silicon
Site: https://othmaneblial.github.io/silicon/
Online docs: https://othmaneblial.github.io/silicon/docs.html
Changelog: https://github.com/OthmaneBlial/silicon/blob/main/CHANGELOG.md
Input boundaries: https://github.com/OthmaneBlial/silicon/blob/main/docs/security.md

Apache-2.0; dependency license texts are in THIRD_PARTY_NOTICES.txt.
