# Operating AetherTerm in a controlled environment

The installed server currently uses a single process and one operator. Its local entry point binds to `127.0.0.1`. A remote TLS proxy topology is described in [DEPLOYMENT.md](DEPLOYMENT.md), but public network operation has not yet passed the release gate.

## State and restart behavior

| State | Default location | Persistence |
| --- | --- | --- |
| Operator password verifier | `~/.config/aetherterm/operator.json` | On disk, created `0600` |
| Agent IDs, descriptions and credential digests | `~/.config/aetherterm/agents.json` | On disk, created `0600` |
| Agent secret | Path supplied to `aetherterm-admin enroll --output` | On disk, `0600`, must be securely transferred if agent is on another machine |
| Browser login sessions and live PTY registry | Server memory | Lost on server restart |
| Agent `lastSeen` display time | Server memory | Lost on server restart |
| Terminal output and command history | Not stored by AetherTerm | May still exist in the shell's own history or operating-system logs |

The default paths can be changed with `AETHERTERM_OPERATOR_FILE` and `AETHERTERM_AGENTS_FILE` **on both the administrative command and server process**. Keep them on storage accessible only to the server account. The server refuses symlinks, non-regular identity files, files owned by another account and group/other permissions. If a previously created file has weak permissions, repair ownership and set mode `0600` before restarting; investigate why it changed. Do not make the identity directory publicly writable.

A server stop closes all browser and agent WebSockets. Agents retry after temporary outages with backoff, then register again. Old shells close and are never resumed. Operator cookies cease to authorize access after restart because sessions are in memory; sign in again and open a new shell.

## Back up and recover

Back up `operator.json` and `agents.json` through a private channel, preserving owner-only permissions. Back up each agent token file separately if that identity must survive loss of the agent host. The registry contains hashes, so it cannot regenerate a lost token. For a lost token, rotate that device to a new file and restart its agent. For a lost operator verifier, initialize a new operator file privately; existing browser sessions must be invalidated by stopping the server. Restore files only after confirming their owner and mode. A registry restored from an older backup may reauthorize an old token; rotate affected devices after restoration.

For a recovery drill, stop the server and agent first. Copy the private files to a private backup directory and restore them under their configured paths with mode `0600` and the account that runs each process as owner. Restart both processes, sign in again, and open a new shell; old browser sessions and PTYs do not resume. The automated temporary-directory drill `python -m unittest tests.test_recovery` checks password verification, device authentication, file permissions and invalidation of a prior browser session after restore. It also demonstrates that restoring a stale registry reverses a token rotation. This automated file-level drill does not replace a live recovery rehearsal on the target host.

## Observe and troubleshoot

The server writes bounded JSON audit events to standard output with event name, time and peer address. It does not intentionally log credentials or terminal bytes. Host/container log collection and retention are the deployer's responsibility; session and device IDs in logs may still be sensitive metadata. The agent prints registration, connection and retry status. There is no metrics endpoint, remote audit store or terminal recording.

| Symptom | Check |
| --- | --- |
| “Operator setup required” | Run `aetherterm-admin init` as the server account and check the configured operator path. |
| Sign-in repeatedly fails | Check the password, file owner/mode and server logs; login attempts are limited in process memory. |
| Device listed offline | Confirm the agent process uses the enrolled ID, current private token file, same endpoint and trusted WSS certificate if remote. |
| “Access expired or was revoked” | Sign in again. Restart, logout, password-file replacement or session expiry can require this. |
| Shell closes after connection loss | Expected: old PTYs do not resume. Wait for the agent to reconnect, then open a new shell. |
| Remote connection refused | Check DNS/certificate/proxy forwarding and that only the proxy can reach the loopback backend. Do not disable certificate verification. |

The server limits a received WebSocket frame to 64 KiB, terminal data to 16 KiB per message, 32 total PTYs, four PTYs per browser and agent, 64 connected agents, and 32 browser plus 80 agent open sockets. Shell startup expires after ten seconds. These are defensive bounds rather than a measured capacity recommendation. A sustained load and slow-peer assessment remains open in [ROADMAP.md](../ROADMAP.md).

## Planned service management

A same-host non-root [systemd user unit example](SYSTEMD.md) and restart policy are available. Its syntax is checked in Linux CI, but the complete service lifecycle on a separate machine and user account is not yet validated. Until then, use the [local quickstart](QUICKSTART.md) for a controlled run and stop both processes deliberately with Ctrl+C.
