# Threat model and access contract

Status: target for v1 implementation. Browser sign-in, WebSocket ownership, device-bound agent credentials and two local PTYs have integration tests. Remote cleartext is rejected in code; direct HTTPS/WSS and a Caddy proxy were tested locally with a temporary trusted certificate. Chrome exercised the local login and PTY, but graphical remote HTTPS and external network access remain unverified. Keep the current prototype on loopback outside that controlled proxy test.

## Assets and trust boundaries

The assets are the operator credential, per-device agent credentials, terminal input/output, the agent's operating-system account and the server's device registry. The browser, server, agent, local shell, TLS proxy and public network are distinct trust domains:

```text
operator browser -- HTTPS/WSS --> trusted TLS endpoint -- loopback --> server
                                                         | authenticated WSS agent connection
                                                         v
                                                    Linux agent -- PTY --> shell as agent OS user
```

In a local demonstration, browser and server both use loopback HTTP/WS. A remote proxy must run on a trusted host, forward only to a loopback server listener and not let arbitrary clients forge forwarded scheme or client-address headers. A remote agent connects through WSS with normal certificate validation. TLS protects traffic in transit; it does not make a compromised browser, proxy, server or OS safe.

## Adversaries and assumptions

- An unauthenticated network visitor can open HTTP and WebSocket connections and send arbitrary messages, including forged session IDs and origins outside a browser.
- An authenticated but revoked agent can retry registration; an active agent may send malformed output or attempt to impersonate another enrolled device.
- A second browser, even if signed in as the same operator, must not control a shell belonging to the first browser connection. This is a session-ownership rule, not a multi-user permission claim.
- A stolen operator session or agent credential is treated as compromised until expiry or revocation. Rate limiting reduces guessing but is not an authorization mechanism.
- The server and the agent's OS user are trusted to execute the operator's commands. A compromised server, shell user or TLS endpoint is outside the protection boundary. Do not expose AetherTerm as a service to untrusted tenants.

## Planned identities and lifetimes

- **Operator:** initialize once with a password entered interactively or from a private input channel; store a salted password verifier. Sign-in issues an opaque, server-managed, HttpOnly cookie with `SameSite=Strict`, `Secure` in HTTPS mode and a bounded lifetime. Sign-out and credential rotation revoke active browser sessions. Non-idempotent HTTP endpoints require CSRF defense.
- **Agent:** enroll an exact device ID with a fresh high-entropy secret. Store only its verifier in the server's durable registry; provide the secret through an owner-readable file or stdin on the agent. No working default tokens, URL query secrets, command-line secrets or secret fragments in logs. Rotation and revocation invalidate the old secret and close live connections.
- **PTY session:** random ID, server record containing exact agent identity and owning browser WebSocket connection. The ID is a reference, never authority. A session ends on explicit close, browser/agent/server disconnect, or enforced lifetime/idle limit; no implicit resumption in v1.

## Route and message authorization contract

| Surface | Required identity | Authorization and failure |
| --- | --- | --- |
| `/`, sign-in page and static sign-in assets | None | Serve only non-sensitive content. Remote cleartext is rejected or redirected to verified HTTPS before credentials are accepted. |
| Operator sign-in and sign-out | Operator credential for sign-in; current session for sign-out | Wrong credentials get a generic rejection; rate limits apply; sign-out revokes the session. |
| Protected app and device metadata | Current operator cookie | Missing/expired session gets no device data; active enrolled devices are visible to the sole operator. |
| `/ws` browser handshake | Current operator cookie plus allowed `Origin` | Missing/expired cookie, wrong origin or remote cleartext is rejected before accepting the socket. |
| `list_devices` | Current operator connection | Return only enrolled devices. If the account/session has been revoked, close the socket. |
| `start_session(deviceId)` | Current operator connection | Device must be enrolled, not revoked and connected; enforce session quota; otherwise typed error, no PTY. |
| `term_input`, `resize`, `close_session` | Owning browser connection | Session must belong to that exact connection and named agent; deny cross-browser IDs even for the same account. Validate size and state before forwarding. |
| `/client` agent handshake and `register` | Device ID plus its own secret | Authenticate once, bind connection to that ID, reject duplicate or revoked identity, and disallow re-registration on the same socket. |
| Agent `term_data`, `session_ready`, `session_exit`, heartbeat | Bound agent connection | Session must belong to that agent. Unknown/malformed data is rejected; no output can be injected into another agent's session. |

All WebSocket frames need a versioned schema, bounded encoded length, bounded terminal dimensions and a typed error. Authentication is rechecked for revocation during long-lived connections. Protocol errors must not include stack traces or secrets.

## Required negative checks

1. An anonymous browser cannot list devices or start a session.
2. A second browser that knows a valid session ID cannot send input, resize or close that session.
3. An agent credential for A cannot register as B or send B's session output.
4. Revoked/expired credentials stop new and active access.
5. Wrong `Origin`, malformed/oversized frames and remote cleartext are rejected without affecting another session.
6. Server, browser and agent disconnects leave no live PTY and no stale device/session registry entry.

Another person should review this contract and the negative-check evidence before the security phase is considered complete. That review is not yet recorded.
