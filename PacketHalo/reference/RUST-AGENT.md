# PacketHalo Rust agent

The agent observes Linux operating-system socket tables (`/proc/net/*`). It never opens packet-capture devices and has no code path capable of reading packet payloads.

```bash
cargo run --release --manifest-path agent/rust-agent/Cargo.toml
```

The agent reports new TCP/UDP connection metadata to the loopback server. Process names are resolved from `/proc/<pid>/fd` when permissions allow; all unknown fields remain explicitly unknown rather than inferred.
