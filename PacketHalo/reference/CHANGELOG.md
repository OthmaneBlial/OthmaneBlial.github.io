# Changelog

All notable PacketHalo changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and releases use [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-08-21

### Added

- Initial simulator-first observatory with five Canvas modes and nine coordinated palettes.
- Phone control surface, metadata server, deterministic simulator, and session recording/replay.
- Linux metadata agent, Docker and Raspberry Pi appliance assets, documentation, tests, and CI.
- Strict exact-shape privacy validation for flows and recordings.
- Readiness, ingest health, bounded WebSocket backpressure, and structured lifecycle logs.
- Isolated end-to-end test ports and live Docker smoke validation.
- GitHub issue forms, contribution templates, version pins, and a release checklist.
- Interactive project showcase and searchable field guide published on GitHub Pages.

### Changed

- Production server and simulator containers now run bundled JavaScript as an unprivileged user instead of the development TypeScript runner.
- Simulator collectors require an explicit opt-in and TLS before sending metadata to a public endpoint.
- Synthetic device data no longer contains a contributor's personal name.

### Fixed

- The default web container no longer crash-loops when no LAN control token is configured.
- The browser stream reconnects after server startup or a local service restart.

[Unreleased]: https://github.com/OthmaneBlial/PacketHalo/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/OthmaneBlial/PacketHalo/releases/tag/v0.1.0
