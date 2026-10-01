# Graphics pipeline

World coordinates are right-handed with +Y up. Matrices are row-major and act on
column vectors. The clip volume is `-w <= x,y <= w` and `0 <= z <= w`. Six-plane
Sutherland–Hodgman clipping linearly interpolates positions and varyings in
homogeneous space, then a triangle fan assembles the resulting polygon. The
viewport maps NDC +Y to screen top; depth remains 0..1. Backface culling respects
CW/CCW before the internal coverage winding normalization.

Screen X/Y are rounded to 8 fractional bits. Three signed i64 edge functions
advance across pixels. Coverage is evaluated at pixel centers `(x+.5,y+.5)` with
the top-left tie rule. Two triangles sharing an edge cover it exactly once;
alpha blending in the shared-edge test detects double coverage and cracks.
Tiles visit only the triangle's clipped screen bounding box. This is tiled
coverage, not yet a pre-binned tile command queue or hierarchical Z.

For barycentrics `b_i`, each varying is reconstructed as
`sum(b_i * attribute_i / w_i) / sum(b_i / w_i)`. Clip/NDC depth is interpolated
*affinely* in screen space. Texture derivatives use the perspective reconstruction
at the neighboring X/Y pixel center as an approximation; LOD is the logarithm
of the larger texel-space derivative length. Unlike hardware derivative quads,
these neighbors do not depend on other shader invocations.

Depth and stencil comparisons precede fragment shading. This is valid because
shader interfaces cannot write depth or produce side effects. A discarded Rust or SIR
fragment does not write depth or stencil-pass results. Failed stencil/depth
comparisons execute their respective stencil operations. All eight depth compare
modes, stencil masks, saturation/invert operations and replace/alpha/add/multiply
color blending are implemented. Alpha blending uses unpremultiplied source RGB.
Transparency requires caller-provided draw ordering and disabled depth writes.
The `stencil` scene uses a circular mask to limit both a textured cube and an
alpha-blended triangle to a portal. The overlay keeps depth writes disabled and
also tests the mask; its fragments outside the portal leave the clear color
untouched. `tests/stencil.rs` checks that boundary and exact framebuffer, depth,
and stencil results between scalar and four-band SIMD rendering.

Textures own RGBA-expanded texels from RGBA8, RGB8 or R8 input. Nearest and
bilinear filters support clamp, repeat and mirror addressing. Bilinear samples
texel centers and wraps each neighbor, including at seams. Mips average source
regions and include all texels for odd dimensions; dimensions use floor halving.
Nearest-mip and trilinear filtering are available. Filtering is in stored numeric
color space; sRGB texture decoding, anisotropy, multiple color attachments and
MSAA are future work.

`CubeMap` owns six square color textures in +X, -X, +Y, -Y, +Z, -Z order. A
direction selects the face with the largest absolute component; the other two
components map to face UVs and use the ordinary texture sampler with clamped
addressing. Faces must have matching mip dimensions. `cubemap_showcase` uses this
sampler for an environment skybox and reflected directions on the native Rust
shader scene. Material roughness selects a box-filtered mip level, which blurs
reflections without implementing split-sum image-based lighting. The SPIR-V
command interface does not yet expose a cube sampler.

The scalar reference and optional NEON/AVX2 coverage paths both process four
adjacent pixel masks with identical i64 arithmetic. With the SIMD backend,
recorded SIR fragment shaders execute surviving lanes as a masked group of four;
vertex shaders and native closures retain scalar execution. See [SIMD masks](simd.md).
Parallel rendering assigns disjoint horizontal bands to
Rust scoped threads, each using local 16x16 coverage tiles. Draw order is preserved
within every band, including depth, stencil and blending. Geometry setup repeats
per band; full primitive binning and persistent workers remain optimization work.

See [Khronos rasterization conventions](https://docs.vulkan.org/spec/latest/chapters/primsrast.html)
for background on pixel coverage and interpolation. These conventions do not
constitute Vulkan compatibility.
