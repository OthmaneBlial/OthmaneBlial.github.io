# Input and memory boundaries

No unsafe guest memory access exists. Shader registers and resource accesses are
bounds checked. SIR validation is reused after deserialization. A complete
command stream is validated before submission modifies the target framebuffer.
Runtime shader failure can leave an incomplete frame; submission returns the
specific error rather than reporting success.

Current limits: 16M framebuffer/texture pixels, 1M OBJ/vertex-buffer vertices,
3M indices, 64 uniform vec4s, 65536 commands, 4096 SIR instructions. External
captures are limited to 64 MiB before JSON deserialization; OBJ text is limited
to 32 MiB; CLI scene descriptors to 1 MiB. JSON nesting also obeys serde_json's
recursion limit. These are validation bounds, not a process-wide allocation
budget. Captures can duplicate resources, and the software GPU is not a hardened
sandbox for hostile shader workloads.

The only project unsafe code is the architecture-specific coverage helper:
NEON uses fixed two-lane loads/stores; AVX2 has a runtime feature check and no
caller-controlled memory loads. Framebuffer bands belong to separate workers.
Tests compare SIMD and parallel framebuffer bytes to the scalar reference. A
deterministic mutation check exercises 500 clipped triangles and invalid SIR
register operands; this is bounded stress coverage, not exhaustive fuzzing.

Avoid panicking on external inputs. Constructors return errors for invalid
sizes/storage, invalid model indices and nonfinite positions. Never substitute
another renderer for an unsupported shader. No network access, telemetry or
external service is required by rendering. Presentation and file export are
separate from the CPU rendering pipeline.
