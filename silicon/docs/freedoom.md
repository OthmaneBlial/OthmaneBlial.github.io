# Freedoom E1M1 geometry checkpoint

The Phase 70 sample reads `E1M1` from an external Freedoom Phase 1 IWAD. It
builds BSP-leaf floor and ceiling polygons, one-sided walls, and two-sided upper
and lower wall tiers from the WAD's classic map lumps. Sector light levels tint
the solid-color surfaces. The resulting triangles, transform uniform, and GLSL
SPIR-V shaders are submitted to SILICON's CPU renderer; no game framebuffer or
other renderer is copied.

Download [Freedoom 0.13.0](https://github.com/freedoom/freedoom/releases/tag/v0.13.0)
at upstream commit
[`cfb8644b1a8dc7d7d2177e6a892ccaa2922bdaae`](https://github.com/freedoom/freedoom/commit/cfb8644b1a8dc7d7d2177e6a892ccaa2922bdaae),
extract `freedoom1.wad`, then run:

```sh
cargo run --release --example freedoom_map -- /path/to/freedoom1.wad
```

The sample writes `output/freedoom_map.png`. The checked-in
[`E1M1 screenshot`](../assets/screenshots/freedoom_e1m1.png) was rendered from
that release's WAD. The WAD itself is not included. The release archive checksum
is SHA-256 `3f9b264f3e3ce503b4fb7f6bdcb1f419d93c7b546f4df3e874dd878db9688f59`.

This is a static geometry render, not a playable Doom engine. It does not yet
compose wall textures from `TEXTURE1`/`PNAMES`, render flats, masked middle
textures or sprites, traverse BSP nodes for visibility, or implement movement,
collision, weapons, enemies, sound, or game rules. The camera's starting floor
currently comes from the nearest BSP-leaf centroid; use actual `NODES`
traversal before relying on it for arbitrary maps.

Freedoom's three-clause BSD notice and contributor list accompany this derived
sample in [`assets/licenses/FREEDOOM-COPYING.txt`](../assets/licenses/FREEDOOM-COPYING.txt)
and [`assets/licenses/FREEDOOM-CREDITS.txt`](../assets/licenses/FREEDOOM-CREDITS.txt).
The upstream project and contributors do not endorse SILICON. See the
[Freedoom 0.13.0 release](https://github.com/freedoom/freedoom/releases/tag/v0.13.0),
[license source](https://raw.githubusercontent.com/freedoom/freedoom/v0.13.0/COPYING.adoc),
and id Software's [WAD](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/w_wad.h),
[map record](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/doomdata.h),
and [wall rendering](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/r_segs.c)
references.
