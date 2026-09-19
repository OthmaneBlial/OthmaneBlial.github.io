# Security model and current limits

AetherTerm gives a browser control over a shell running as the agent's operating-system user. Treat access to the operator account, agent credential, server and TLS endpoint as access to that shell. This is an early prototype; keep the installed server on loopback until the remaining [release gates](../ROADMAP.md) are met.

## Identities and permissions

- One operator password is stored as a salted scrypt verifier in `~/.config/aetherterm/operator.json` by default. The setup CLI creates it with mode `0600`. The server refuses symlinks and identity files accessible to another user. It retains browser sessions in memory for at most eight hours; logout and a change to the operator file revoke them. A restart also removes them.
- Every agent ID has a separate random credential. The server stores its SHA-256 digest in `~/.config/aetherterm/agents.json`, created with mode `0600`; the agent reads a private regular token file owned by its OS user. The secret is not placed in command arguments, browser code, URLs or logs.
- The sole operator can start a shell on **every active enrolled agent**. There are no per-device operator roles. Browser WebSocket connections own their own shell sessions; knowing another connection's session ID does not authorize input, resize or close.
- A shell inherits the agent process user's permissions. Use a dedicated, least-privileged account where practical. AetherTerm does not sandbox commands, separate tenants or mediate file access.

The trust boundaries and message permissions are listed in the [threat model](THREAT_MODEL.md). The server requires the `aetherterm.v1` WebSocket subprotocol, validates incoming JSON and bounds connections, sessions and terminal frames. Those limits have tests but have not yet passed a sustained load assessment or outside security review.

## Transport

The local quickstart uses HTTP/WS only through loopback. The installed server entry point binds to `127.0.0.1`; the agent refuses plain WS to a non-loopback host. Remote use needs a trusted HTTPS/WSS endpoint and verified certificate. A local direct TLS check and a local Caddy proxy round trip passed, including rejection of an untrusted certificate. A public certificate, a second network host and a graphical remote browser have **not** been validated. Follow [deployment guidance](DEPLOYMENT.md) only in a controlled test environment until that gate is complete.

The reverse proxy is trusted to terminate TLS and forward truthful headers. Never expose the plain backend listener or trust forwarded headers from arbitrary peers. A stolen cookie, agent token, compromised browser, proxy or server remains outside the protection provided by TLS.

## Credential response

If an agent token may have leaked:

1. On the server, run `aetherterm-admin rotate DEVICE_ID --output /new/private/path` or `aetherterm-admin revoke DEVICE_ID`.
2. Stop the old agent process and confirm its connection disappears from the UI. Rotation creates a new token file; transfer it through a trusted channel and restart the intended agent with that file.
3. Inspect access logs and shell activity for misuse. The server does not record terminal sessions, so it cannot reconstruct commands after the fact.

If the operator password or session may have leaked, stop the server to invalidate in-memory sessions, replace the operator credential file through a private setup procedure, and restart. The current CLI intentionally refuses to overwrite an existing operator file; preserve a backup securely while replacing it. Inspect any reachable agent accounts for effects. No password reset UI exists.

Do not paste token files, cookies, raw terminal output or private hostnames into a public issue. See the repository [security reporting policy](../SECURITY.md) for the verified private reporting route.
