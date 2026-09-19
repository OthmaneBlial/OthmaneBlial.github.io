# Changelog

## Unreleased — 0.1.0a0 development candidate

There is no GitHub release for this version. The entries below describe work in the repository and its CI, not an installable public release.

### Added

- Single-operator browser sign-in, device-bound agent enrollment, rotation and revocation, and browser-owned shell sessions.
- Interactive xterm.js terminal with isolated PTYs, resize and explicit close; local loopback demo, wheel, non-root server image and Linux x86_64 agent binary builds.
- Python, Chromium, container and binary smoke checks in CI; dependency and secret scans, hashed Python dependency locks and real browser screenshots.
- Architecture, threat model, deployment, operations, installation and contribution guides.
- Tag-gated release automation that waits for the matching CI run, rebuilds the declared artifacts and publishes their SHA-256 manifest; fresh-clone onboarding verification on macOS.

### Security and behavior changes from the original prototype

- Removed public example tokens and anonymous browser access to shell sessions.
- Refused remote cleartext connections and rejected untrusted WSS certificates in local tests.
- Bounded frames, sessions, startup, connection attempts and slow WebSocket sends; terminal output and audit logs do not intentionally record credentials.

### Before a release

The open P0/P1 gates in [ROADMAP.md](ROADMAP.md) and the [release checklist](docs/RELEASE_CHECKLIST.md) must be satisfied. In particular, remote deployment, independent security review, target-user trials, physical browser input and actual published downloads are not yet verified. No release date or compatibility beyond the declared test platforms is promised.
