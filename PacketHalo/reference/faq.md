# FAQ

## Is PacketHalo a packet sniffer?

No. The current real provider reads Linux socket metadata. A future PCAP adapter will be opt-in and header-only. PacketHalo's model cannot represent payload content.

## Does it identify every website or app?

No. IPs, ASNs and ports are ambiguous. PacketHalo shows confidence and uses “possible” or “unclassified” when evidence is weak.

## Does the simulator use my traffic?

No. It is generated from built-in profiles and a local deterministic seed.

## Is an Internet connection required?

No. Fonts, themes, simulator data, the fallback geo catalog, server and database are local. The README badges are the only externally hosted presentation assets and are not loaded by the application.

## Can I leave it on a projector?

Yes. Ambient mode, Projector theme, rotation, fullscreen and Raspberry Pi kiosk assets exist for that use case.

## Why Canvas instead of WebGL?

Canvas meets the present visual and performance goals with a smaller compatibility and maintenance cost. WebGL is reserved for a 3D globe or measured scenes where it clearly improves the result.

## Can the control panel be used from a phone?

Yes, in authenticated LAN or appliance mode. Development defaults to loopback for safety.
