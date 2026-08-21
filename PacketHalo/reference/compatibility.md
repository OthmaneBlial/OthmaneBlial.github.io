# Compatibility

## Supported toolchains

| Component | Supported baseline            | Automated evidence                         |
| --------- | ----------------------------- | ------------------------------------------ |
| Node.js   | 22.5 or newer; 22.23.2 pinned | typecheck, tests, builds, service bundles  |
| pnpm      | 10.15.0                       | frozen install in CI and Docker            |
| Rust      | 1.95.0 pinned                 | format, Clippy and unit tests              |
| Docker    | Compose v2 with BuildKit      | four-service startup and live smoke checks |

## Browsers

Current desktop and Pixel-sized mobile Chromium receive automated interaction, keyboard, viewport and console-error coverage. The renderer uses Canvas 2D, standard WebSocket, Fullscreen and File APIs. Firefox and Safari are expected to support the core display, but they remain manual release checks and should not be described as CI-verified.

The observatory is responsive on narrow screens. The separate phone controller is the preferred control surface for a wall or projector installation.

## Capture hosts

The deterministic simulator works anywhere Node.js or the browser runs. Real host observation is implemented only for Linux systems exposing `/proc/net/tcp*` and `/proc/net/udp*`. Process attribution depends on permission to inspect `/proc/<pid>/fd`; missing values remain unknown. macOS, Windows, PCAP metadata, router capture and online geo enrichment are not implemented.

## Deployment boundaries

The default source and Docker profiles are supported only on a trusted local machine. Authenticated LAN appliance mode is supported on a trusted network. Public Internet hosting, multi-user authorization, encrypted-at-rest history and clustered databases are outside the current product boundary.
