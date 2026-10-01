# Freedoom E1M1 gameplay through SILICON

The Phase 70 sample reads `E1M1` from an external Freedoom Phase 1 IWAD. It
builds BSP-leaf floor and ceiling polygons, one-sided walls, and two-sided upper
and lower wall tiers from the WAD's classic map lumps. It palette-decodes the
64×64 floor and ceiling flats and composes opaque wall textures from
`TEXTURE1`/`TEXTURE2`, `PNAMES`, and classic patch columns, using `PLAYPAL` for
both. Sector light levels tint the sampled pixels. Sidedef offsets and the
linedef upper/lower pegging flags set wall UVs. Geometry, textures, billboards,
transform uniforms, and GLSL SPIR-V shaders are submitted to SILICON's CPU
renderer; no game framebuffer or other renderer is copied.

Download [Freedoom 0.13.0](https://github.com/freedoom/freedoom/releases/tag/v0.13.0)
at upstream commit
[`cfb8644b1a8dc7d7d2177e6a892ccaa2922bdaae`](https://github.com/freedoom/freedoom/commit/cfb8644b1a8dc7d7d2177e6a892ccaa2922bdaae),
extract `freedoom1.wad`, then run:

```sh
cargo run --release --example freedoom_map -- /path/to/freedoom1.wad
cargo run --release --example freedoom_map -- /path/to/freedoom1.wad --interactive
```

The first command writes `output/freedoom_map.png`. The interactive view uses
WASD to move and strafe, arrow keys to turn, Shift to run, Space to fire, and
Escape to exit. Each frame submits the scene again through SILICON. Movement
stays inside a BSP-leaf floor, keeps a 16-unit margin from one-sided or
explicitly blocking lines, limits steps to 24 units, and requires 56 units of
ceiling clearance.

The combat slice loads four normal-skill enemy types from WAD things and their
classic `A1` sprite patches: former humans (20 health), shotgunners (30), imps
(60), and demons (150). Cutout billboards use a SILICON fragment shader. Space
fires a 20-damage hitscan with a 0.35-second cooldown and 200 shots. Enemies
chase within 640 map units and deal 8 melee damage within 48 units, at most once
every 0.85 seconds. Former humans fire 3-damage hitscan attacks and shotgunners
fire 6-damage hitscan attacks within 512 units, at most once every 1.4 seconds
and only with clear sight past blocking lines. This is a fixed prototype rule;
enemy windups and aim spread are not modeled. The window title
reports health, ammunition, kills, draw calls, and submitted triangles. Imps
launch a straight BAL1A0 fireball within 512 units when they have clear sight;
it travels at 180 units per second, lasts up to 3 seconds, and deals 8 damage
on contact, with a 2-second launch cooldown. This is a simple prototype attack,
without Doom's vertical aiming, explosion frames, or projectile physics. The WAD
pistol's PISGA0 patch is the idle camera-aligned billboard; firing briefly uses
its PISGC0 patch for 0.16 seconds. Both weapon poses use SILICON's cutout shader
and draw pipeline.

Freedoom 0.13.0 E1M1 has 29 normal-skill enemy placements. The sample parses
the WAD node partition tree and follows its child references to locate each
thing in a subsector and sector. The checked-in static capture contains 4,872
submitted triangles across 171 SILICON draws: 4,812 map triangles, 29
two-triangle enemy billboards, and a two-triangle pistol billboard. It shows
the player start and pistol; enemies are outside that camera view. A temporary
WAD with only its player start moved was used to capture an enemy sprite in
view; that test fixture is not included.

This is a limited gameplay prototype, not Doom's complete player physics or
game rules. Every BSP leaf is drawn; view-frustum traversal and BSP visibility
culling, masked two-sided middle textures, animated or rotated enemy sprites,
projectile explosion frames and vertical motion, pickups, keys, exits, full
weapon animation beyond the brief idle/fire pose, and sound remain unimplemented.
`F_SKY1` ceilings show the clear color. The checked-in
[`E1M1 screenshot`](../assets/screenshots/freedoom_e1m1.png) was rendered from
the unmodified release WAD. The WAD itself is not included. The release archive
checksum is SHA-256 `3f9b264f3e3ce503b4fb7f6bdcb1f419d93c7b546f4df3e874dd878db9688f59`.

![Freedoom former-human enemy and pistol billboards rendered through SILICON](../assets/screenshots/freedoom_e1m1_enemy.png)

*Sprite verification view from the same WAD with only the player start moved into the enemy corridor; the temporary WAD is not included.*

Freedoom's three-clause BSD notice and contributor list accompany this derived
sample in [`assets/licenses/FREEDOOM-COPYING.txt`](../assets/licenses/FREEDOOM-COPYING.txt)
and [`assets/licenses/FREEDOOM-CREDITS.txt`](../assets/licenses/FREEDOOM-CREDITS.txt).
The upstream project and contributors do not endorse SILICON. See the
[Freedoom 0.13.0 release](https://github.com/freedoom/freedoom/releases/tag/v0.13.0),
[license source](https://raw.githubusercontent.com/freedoom/freedoom/v0.13.0/COPYING.adoc),
and id Software's [WAD](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/w_wad.h),
[map and BSP record](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/doomdata.h),
[BSP point traversal](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/r_main.c),
and [wall rendering](https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/r_segs.c)
references.
