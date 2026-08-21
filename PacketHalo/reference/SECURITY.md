# Security policy

PacketHalo is designed to reveal connection metadata without revealing content.

## Reporting a vulnerability

Please open a private GitHub security advisory. Do not include real packet captures, credentials, tokens, cookies, messages, or browsing data in reports. A minimal synthetic reproduction is preferred.

## Trust boundaries

- The server binds to `127.0.0.1` by default.
- Any non-loopback bind requires `PACKETHALO_CONTROL_TOKEN`.
- The Docker profile publishes every port on host loopback only.
- Appliance LAN mode requires a generated token stored in a root-readable environment file.
- WebSocket messages and HTTP event bodies are capped at 256 KB.
- Flow contracts cannot represent payloads and incoming objects with content-like keys are rejected.
- Secrets and event metadata are not written to application logs.

See [the full security model](docs/security-model.md) for deployment assumptions and limitations.
