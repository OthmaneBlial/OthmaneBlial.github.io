# Security model

PacketHalo assumes the host running the server is trusted. It protects against accidental LAN exposure, unauthenticated control, oversized messages, content entering the metadata contract and secrets reaching logs.

## Defaults

The Node server binds to `127.0.0.1:8787`. Read/write event and control paths are available only through loopback. The display and control dev servers also bind to loopback.

Setting `PACKETHALO_HOST=0.0.0.0` or a LAN address requires `PACKETHALO_CONTROL_TOKEN`. The server compares the token without early exit and never prints it. Send it as a Bearer token for HTTP providers or a `token` query parameter for WebSockets. The phone controller keeps it in component memory only.

The default Docker profile binds host ports to `127.0.0.1`. Its explicit container-loopback flag is safe only because the published ports remain loopback-only. Do not reuse that flag in a LAN deployment.

## Data controls

- Event requests and WebSocket frames are limited to 256 KB.
- Event batches are limited to 500 values; timeline reads and recording imports are bounded.
- Incoming values are structurally validated and recursively checked for forbidden content fields.
- SQLite stores only accepted serialized `FlowEvent` metadata.
- Retention pruning runs every minute and defaults to one hour.
- The service logs lifecycle status, not events, request bodies, headers or secrets.
- Cross-site browser WebSocket upgrades are rejected, slow display sockets are disconnected, and heartbeat checks remove dead clients.
- Production containers use read-only filesystems where practical, non-root service processes, loopback host publishing and `no-new-privileges`.

## Not in scope

PacketHalo does not attempt to hide metadata from administrators of the local machine. SQLite is not encrypted by default. For multi-user hosts, protect the data directory with operating-system permissions or use ephemeral storage. TLS is not terminated by the built-in server; authenticated LAN deployments should remain on a trusted network or sit behind a locally managed TLS reverse proxy.

The built-in token is a deployment safety gate, not an Internet-facing identity system. PacketHalo has no user accounts, authorization roles, per-client rate limiter, TLS certificate automation or hostile multi-tenant isolation. Direct public exposure is unsupported.
