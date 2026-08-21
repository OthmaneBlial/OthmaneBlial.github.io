# How rendering works

PacketHalo uses one retained event list and a Canvas 2D animation loop. Canvas keeps thousands of connections cheaper than equivalent DOM nodes while remaining widely available on low-power devices.

The renderer stores monotonic arrival time beside each immutable event. On every frame it:

1. resizes for device pixel ratio, capped at 2×;
2. prunes events outside retention;
3. paints a theme atmosphere and deterministic star field;
4. projects destinations with a stable organization/country hash;
5. interpolates curves, particles, nodes and afterglow;
6. publishes FPS, active-trail and frame-time metrics.

At most 2,000 live events are retained and up to 220 recent trails are adaptively sampled in Halo mode. Older overflow is counted, not allowed to stall the page. Transfer size changes arc weight logarithmically. Direction changes eased particle travel, with endpoint fading that prevents visible teleportation. Suspicious classifications use the alert channel without turning the experience into an alarm dashboard.

Reduced motion freezes globe rotation and removes traveling particles. High contrast changes both canvas and instrument palette. Ambient mode reduces orbit and trail density while allowing the dock to return on focus or hover.
