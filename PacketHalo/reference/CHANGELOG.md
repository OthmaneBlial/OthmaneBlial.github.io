# Changelog

All notable PacketHalo changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and releases use [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- Strict exact-shape privacy validation for flows and recordings.
- Readiness, ingest health, bounded WebSocket backpressure, and structured lifecycle logs.
- Isolated end-to-end test ports and live Docker smoke validation.
- GitHub issue forms, contribution templates, version pins, and a release checklist.

### Changed

- Production server and simulator containers now run bundled JavaScript as an unprivileged user instead of the development TypeScript runner.
- Simulator collectors require an explicit opt-in and TLS before sending metadata to a public endpoint.
- Synthetic device data no longer contains a contributor's personal name.

### Fixed

- The default web container no longer crash-loops when no LAN control token is configured.
- The browser stream reconnects after server startup or a local service restart.

## 0.1.0 - 2026-08-21

### Added

- Initial simulator-first observatory, five Canvas modes, phone control surface, metadata server, Linux agent, Docker and Raspberry Pi assets, documentation, tests, and CI.
