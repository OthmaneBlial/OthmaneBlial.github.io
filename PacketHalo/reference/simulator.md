# Simulator and replay

The simulator is the default capture provider and a permanent product feature. It makes visual design, demos, tests and documentation repeatable without network permissions.

## Scenes

PacketHalo includes 24 scenes: Movie Night, Netflix Premiere, YouTube, Spotify, Discord Call, Zoom Meeting, Gaming Session, Steam Download, Software Update, Smart Home Morning, Security Camera Upload, Phone Backup, Large Git Clone, Rust Build, Docker Pull, Windows Update, Linux Package Update, Suspicious Beacon, IoT Device, Night Mode, Airport Wi-Fi, Coffee Shop, Office Network and Developer Laptop.

Each scene defines only plausible synthetic metadata profiles. Named classifications have a confidence level. The suspicious beacon is deliberately low-confidence and identified as an unclassified VPS, not asserted malware.

## Determinism

The PRNG is seeded with the scene ID and user seed. Given the same scene, seed and epoch, the generated event sequence is byte-for-byte identical. Use a seed to reproduce a visual bug or a demo take.

IDs include the engine epoch. Reusing a scene and seed after a process restart therefore preserves reproducible metadata without colliding with events already stored in SQLite.

## Recording

Recording captures validated `FlowEvent` values, the scene ID, seed and relative duration. Stop recording to reveal the timeline. You can pause, scrub to any point, replay, and change playback speed. Recordings contain no packet contents because their only event type is the privacy-gated protocol contract.

Recordings are limited to 10,000 events, and browser imports are limited to 10 MB. The importer rejects undeclared fields and invalid metadata rather than repairing them silently.

The headless simulator can feed the local server:

```bash
PACKETHALO_SCENARIO=developer-laptop \
PACKETHALO_SEED=demo-7 \
pnpm --filter @packethalo/simulator dev
```

The headless client accepts loopback HTTP endpoints by default. Sending to a non-local endpoint requires both HTTPS and `PACKETHALO_ALLOW_REMOTE=1`; URLs containing embedded credentials or fragments are rejected.
