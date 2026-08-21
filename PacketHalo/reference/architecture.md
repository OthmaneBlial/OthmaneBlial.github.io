# Architecture

PacketHalo separates observation, truth, transport and presentation so each layer can be inspected independently.

## Data flow

1. A provider observes or generates a connection.
2. It normalizes the observation into the TypeScript/Rust `FlowEvent` shape.
3. The protocol boundary rejects forbidden content-like fields and invalid metadata.
4. The local server appends accepted metadata to SQLite and broadcasts it over WebSocket.
5. The Canvas renderer interpolates events into the selected visual grammar.
6. A separate control socket changes settings without restarting the renderer.

The built-in browser simulator can feed the renderer directly. That intentional fast path makes `pnpm dev` useful even if the server is still starting, while using the exact same event contract as the server path. The headless simulator and Linux agent use authenticated HTTP ingestion; displays and the phone controller use separate WebSocket paths.

## Trust boundaries

- Providers can submit only exact-shape, metadata-only `FlowEvent` values. Unknown fields, invalid addresses and content-like keys are rejected before storage.
- The server is loopback-only by default. A non-loopback bind requires a strong control token.
- Displays receive flows and settings but cannot mutate them. Only the authenticated control path accepts settings or simulator commands.
- Browser preferences and aliases remain in local storage. Accepted history remains in local SQLite and is pruned by the configured retention window.
- The production web container proxies the stream internally, keeping the appliance token out of display JavaScript.

## Monorepo boundaries

`protocol` is the narrow shared truth. `simulator-core` depends on it but knows nothing about React or Canvas. `renderer` consumes immutable events and display settings. The web app schedules sources and presents controls. The server owns retention and remote coordination. Capture providers do not import rendering code.

The Rust agent mirrors the protocol with serializable structs. `scripts/verify-privacy.mjs` inspects both language contracts to prevent prohibited fields from entering either model.

## Time

Every event has an epoch timestamp and duration. The renderer also records a monotonic local `bornAt` time when an event arrives; animation and fading therefore do not jump if the wall clock changes. Simulator metadata and relative timing are repeatable for a seed. Event IDs include the engine epoch so a deterministic process restart cannot collide with persisted history.

## Extensibility

Providers implement a small lifecycle and emit validated events. Geo providers expose local lookup. Render modes share palette and flow primitives, which keeps a new display mode from changing capture behavior. Settings messages are bounded, exact-shape partial patches and take effect on the next animation frame. `/health` exposes process and ingestion status; `/ready` proves the SQLite schema can be queried.
