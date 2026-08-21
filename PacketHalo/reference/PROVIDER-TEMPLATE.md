# Capture provider template

Providers translate one local source into PacketHalo `FlowEvent` metadata. A provider must make its privacy boundary explicit and must never expose packet or application content.

Copy `provider.ts` into a package, implement `start` and `stop`, then register it with the server's `ProviderRegistry`. Unknown classification data must remain unknown; do not infer a named service from an IP address alone.
