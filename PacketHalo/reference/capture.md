# How capture works

Capture providers are adapters. They own source-specific observation and normalization, but the shared protocol decides what can cross into PacketHalo.

## Built-in simulator

Always available, entirely synthetic and permission-free. It can run in the browser or as a headless process that posts events to the server.

## Linux host provider

The Rust agent polls `/proc/net/tcp`, `tcp6`, `udp` and `udp6` every 250 ms. It excludes listening sockets, detects newly observed tuples, and maps socket inodes to process names when `/proc/<pid>/fd` is readable. It makes no packet-capture system calls.

Linux socket tables do not expose reliable per-flow byte counters. The agent reports zero instead of fabricating a measurement. Geography and ASN are also unknown until a local enrichment provider supplies them.

## PCAP metadata provider

Planned and opt-in. Its acceptance criteria are stricter than simply “not storing payloads”: capture filters must copy only header metadata, payload bytes must be discarded before normalization, fixtures must prove that content cannot cross the provider boundary, and the UI must show that PCAP metadata capture is active.

## Recordings and router adapters

Recorded sessions replay the versioned local recording format and are available through browser import/export today. A recording is capped at 10,000 validated events and imports are capped at 10 MB. A future router adapter will be another plugin and must authenticate to its device locally. Neither feature is allowed to introduce a hosted relay.

## Provider availability

`GET /api/providers` reports both implementation status and integration path. The simulator, browser recording and external Linux agent are available. PCAP metadata and router adapters are marked `planned`; they are not silent fallbacks and are never presented as active capture.
