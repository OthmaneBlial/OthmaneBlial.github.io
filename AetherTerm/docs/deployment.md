# Transport and deployment modes

The current implementation has a **local development mode** and the beginnings of a remote TLS mode. Production deployment, proxy configuration, load behavior and Linux service operation have not yet passed the full release gate. Keep the server on loopback until the remaining roadmap work is validated.

## Local mode

Run Uvicorn with `--host 127.0.0.1`. HTTP and WS are permitted only for loopback peers. The agent accepts `--host 127.0.0.1` or `localhost` without `--tls`; another hostname is refused. A local development run is described in the [README](../README.md).

## Remote mode through a trusted TLS proxy

The intended topology keeps Uvicorn on `127.0.0.1:8001` on the same host as the TLS proxy. Only the proxy is reachable from a remote browser or agent. The proxy must use a certificate trusted by the browser and agent, pass the original `Host`, support WebSocket upgrades, and set a truthful `X-Forwarded-Proto: https`. Uvicorn must trust forwarded headers **only** from the local proxy, never from arbitrary clients. [FastAPI's proxy guide](https://fastapi.tiangolo.com/advanced/behind-a-proxy/) explains that forwarded scheme and client headers are interpreted only for trusted proxy addresses. The installed Uvicorn middleware maps HTTPS forwarding to WSS for WebSocket scopes.

Illustrative Caddy configuration for a real domain with working DNS and certificate issuance ([Caddy reverse proxy behavior](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy), [automatic HTTPS](https://caddyserver.com/docs/automatic-https)):

```caddyfile
term.example.com {
    reverse_proxy 127.0.0.1:8001
}
```

Start the backend with a single worker (live device/session state is still process-local):

```bash
python -m uvicorn server.main:app --host 127.0.0.1 --port 8001 \
  --proxy-headers --forwarded-allow-ips 127.0.0.1 --ws-max-size 65536
```

After securely copying its newly enrolled credential file to the agent machine with owner-only permissions, connect it to the public TLS endpoint:

```bash
python client/main.py --host term.example.com --port 443 --tls \
  --device-id my-linux-host --token-file /private/path/my-linux-host.token
```

For a private CA, add `--ca-file /private/path/ca.pem` on the agent. This adds a trust anchor; it does **not** disable hostname or certificate verification. The browser must separately trust that CA through its normal trust store. Do not bypass browser certificate warnings. The [websockets encryption guide](https://websockets.readthedocs.io/en/stable/howto/encryption.html) documents the verified WSS client behavior.

Do not expose Uvicorn's loopback listener with a port-forwarding rule. Do not set `--forwarded-allow-ips='*'` or let clients send their own trusted forwarding headers. The proxy must overwrite incoming forwarding headers. Avoid path-prefix rewriting: this app currently expects `/login`, `/web/`, `/ws` and `/client` at the root.

## Current evidence and remaining work

- A local direct HTTPS/WSS test with a temporary self-signed localhost certificate completed an authenticated WebSocket–server–agent–PTY round trip. The same certificate was rejected when it was **not** added to the test client's trusted CA set.
- A repeatable local check using **Caddy 2.11.4 as the actual TLS proxy** completed sign-in, WSS agent registration and a real PTY command. It also checked the `Secure` cookie and rejected the untrusted certificate. Run `python scripts/verify_tls_proxy.py --caddy /path/to/caddy` with dependencies and OpenSSL installed. This uses a programmatic WebSocket client rather than a graphical browser and stays on loopback.
- The server-side cleartext policy and agent URL policy have unit tests. The browser derives `ws:` or `wss:` from the loaded page's protocol.
- Public DNS/certificate issuance, an external network path, a graphical phone browser and a live Linux service have **not** yet been verified. The complete remote mode remains a roadmap gate.
