# Troubleshooting

## `pnpm` is not installed

Install pnpm 10 with `npm install --global pnpm@10.15.0`, then rerun `pnpm install`.

## The screen is alive but no real flows appear

The simulator intentionally remains active by default. Check `http://127.0.0.1:8787/health`, then start the Linux agent on a Linux host. macOS and Windows real-host providers are not yet implemented.

## The phone controller is offline

The default development profile is loopback-only and is not reachable from another device. Use authenticated appliance/LAN mode, set a long `PACKETHALO_CONTROL_TOKEN`, and enter `ws://PI_ADDRESS:8787/control` plus that token on the phone.

## LAN mode refuses to start

This is a safety gate. A non-loopback `PACKETHALO_HOST` requires `PACKETHALO_CONTROL_TOKEN`. Do not use the Docker-only container-loopback escape hatch for LAN exposure.

## Rendering is slow

Choose Ambient mode, lower particles and afterglow, enable reduced motion, close DevTools and test at 1080p. The health panel should distinguish a low FPS from a delayed source.

## SQLite cannot open

Set `PACKETHALO_DATABASE` to a writable local path. Avoid network filesystems; the store uses WAL mode.

## A port is already in use

The development defaults are 5173, 5174 and 8787. Stop the conflicting process or set `PACKETHALO_WEB_PORT`, `PACKETHALO_CONTROL_PORT` and `PACKETHALO_PORT` to unused ports before `pnpm dev`. The server logs a structured `server_error` and exits on bind failure.

Production previews default to 4173 and 4174. Override them with `PACKETHALO_WEB_PREVIEW_PORT` and `PACKETHALO_CONTROL_PREVIEW_PORT` when those ports are occupied.

## Docker starts but the display has no live flows

Run `docker compose ps`, then inspect `docker compose logs server simulator`. `/ready` must return HTTP 200, and `/health` should show `ingest.acceptedEvents` increasing. Rebuild after source changes with `docker compose up -d --build --wait`.

## A deterministic simulator restart appears silent

Current event IDs include the engine epoch and should not collide with stored rows. If an older database predates that behavior, stop the service and run `pnpm reset:local`, or intentionally remove the Docker volume with `docker compose down -v`.
