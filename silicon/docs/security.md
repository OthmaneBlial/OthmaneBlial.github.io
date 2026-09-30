# Input and memory boundaries

No unsafe guest memory access exists. Shader registers and resource accesses are
bounds checked. SIR validation is reused after deserialization. A complete
command stream is validated before submission modifies the target framebuffer.
Runtime shader failure can leave an incomplete frame; submission returns the
specific error rather than reporting success.

Current limits: 16M framebuffer/texture pixels, 1M OBJ/vertex-buffer vertices,
3M indices, 64 uniform vec4s, 65536 commands, 4096 SIR instructions, 64 selection levels. External
captures are limited to 64 MiB before JSON deserialization; OBJ text is limited
to 32 MiB; CLI scene descriptors and SPIR-V binaries to 1 MiB. SPIR-V has an ID
bound of at most 65536 and at most 256 virtual temporaries, lowered to 64 simultaneously live registers, and a main body of at most 4096 SPIR-V instructions. Acyclic region
validation and per-path definition checks prevent guest-controlled loops and
cross-branch reads. JSON nesting also obeys serde_json's
recursion limit. These are validation bounds, not a process-wide allocation
budget. Captures can duplicate resources, and the software GPU is not a hardened
sandbox for hostile shader workloads.

Project unsafe code is isolated to architecture-specific coverage and shader
lane helpers. NEON/SSE2 shader arithmetic loads/stores fixed four-element host
arrays; neither exposes guest pointers. NEON is mandatory on ARM64 and SSE2 on
x86-64. The separate AVX2 coverage path has a runtime feature check. Packet
execution validates masks, checks only active input/LOD resources, and rejects
nonfinite active values after every instruction. Framebuffer bands belong to separate workers.
Tests compare SIMD and parallel framebuffer bytes to the scalar reference. A
deterministic mutation check exercises 500 clipped triangles and invalid SIR
register operands. SPIR-V tests exercise 2500 deterministic binary mutations,
truncation, endian handling and targeted ID/type/storage/block errors; these are
bounded stress checks, not exhaustive fuzzing. Unsupported shader operations
are rejected with binary word offsets rather than delegated to another runtime.

Avoid panicking on external inputs. Constructors return errors for invalid
sizes/storage, invalid model indices and nonfinite positions. Never substitute
another renderer for an unsupported shader. No network access, telemetry or
external service is required by rendering. Presentation and file export are
separate from the CPU rendering pipeline.
