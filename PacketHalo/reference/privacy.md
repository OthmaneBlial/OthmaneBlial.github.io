# Privacy promise

PacketHalo observes relationships, not conversations.

## What may be processed

- connection start, end and duration;
- local and remote IP addresses and ports;
- transport and inferred protocol;
- process name when the operating system permits it;
- device identity or user-defined alias;
- byte and packet counts when the provider exposes them;
- timestamps, capture source and confidence;
- locally derived country, ASN and organization metadata.

## What is never inspected or stored

- packet payloads;
- request and response bodies;
- passwords, cookies or tokens;
- webpages and page contents;
- emails, chats or message bodies;
- uploaded or downloaded file contents.

The Linux provider reads OS socket tables, not interfaces or payload buffers. Future PCAP support must be explicitly enabled, discard payload bytes immediately, and submit header metadata through the same validator.

## Local-first operation

The observatory, simulator, server, database, fonts, geo fallback and control surface run locally. There is no account system, telemetry client, advertising SDK, analytics endpoint, subscription or required hosted API.

The browser stores only display preferences, user-defined device aliases and the current metadata recording. Use **Clear browser data** in the instrument panel to remove those values. The server stores accepted metadata in local SQLite for one hour by default; change `PACKETHALO_RETENTION_MINUTES` or run `pnpm reset:local` after stopping the service. Docker users can intentionally remove all persisted history with `docker compose down -v`.

The database is not encrypted. Anyone with sufficient access to the host or data volume can read stored metadata, so PacketHalo is intended for a trusted single-user machine.

## Honest uncertainty

An ASN or port can suggest a service; it cannot always prove one. Classifiers therefore include a confidence score. Below the service threshold, the interface says “possible” or “unclassified.” Unknown data stays unknown.

## Enforcement

The shared validator permits only declared fields, bounded strings and numbers, valid IP addresses, known enum values and exact nested shapes. It recursively rejects keys associated with payloads, credentials, request bodies and message content. The Rust contract has the same payload-incapable shape, and `pnpm verify:privacy` checks both definitions in CI.
