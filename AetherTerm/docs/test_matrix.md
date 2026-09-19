# Test and evidence matrix

This matrix maps the security and shell contract to executable checks. It describes coverage in this checkout, not a production audit. The [CI workflow](../.github/workflows/ci.yml) runs Python tests on Ubuntu 24.04 with Python 3.13, Chromium, Firefox, WebKit, a non-root container and a frozen Linux x86_64 agent. Local macOS checks add a second development environment.

| Contract or failure | Executable evidence | Remaining boundary |
| --- | --- | --- |
| Anonymous, wrong-origin or second-browser access cannot control a shell | `tests/test_browser_auth.py`: login/origin/ownership, cross-browser injection, logout and credential replacement | Independent security review and real proxy/browser origin behavior |
| Only the enrolled device can register; rotation/revocation takes effect | `tests/test_agent_credentials.py`, `test_browser_auth.py`: two devices, forged output, rotation and live revocation | Separate host and service-account drill |
| Identity files are private and recovery does not retain a browser session | `tests/test_server_factory.py`, `test_recovery.py`: owner/mode/symlink checks, backup/restore and stale-registry regression | Full recovery on target Linux host |
| Invalid, oversized or rapid protocol messages stay bounded | `tests/test_protocol.py`, `test_browser_auth.py`: schemas, frame and session limits, reconnection burst | Internet-facing deployment rate behavior |
| Terminal bytes and PTYs stay isolated and close on interruption | `tests/test_browser_auth.py`: two real PTYs, split Unicode, server restart, agent SIGINT/SIGTERM, unready timeout | Physical keyboard, touch and clipboard combinations |
| Sustained output and a slow reader do not stall a sibling | `tests/test_browser_auth.py`: 4.7 MiB over more than 10 seconds, 1.6 MiB to a nonreading browser, Linux RSS/CPU and sibling latency | Larger scale and long-running production workload |
| Browser can recover from a network loss without resuming an old shell | `scripts/verify_browser.py`: Chromium, Firefox and WebKit offline/online, real PTY before and after, plus server restart and reauthentication | Different networks, proxies and physical browsers |
| Two terminal tabs expose their panels and switch from the keyboard | `scripts/verify_browser.py`: two real sessions, ARIA tab/panel links, Left/Right/Home/End, focus and close in Chromium, Firefox and WebKit in [run 35449548707](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35449548707) | Human screen-reader review and physical keyboard/touch devices |
| Installed artifacts contain real code and Web assets | `scripts/verify_installed_wheel.py`, `verify_container.py`, `verify_browser.py` and CI binary job | Published release downloads and a second machine |
| Remote cleartext fails and TLS trust is checked | `tests/test_transport_policy.py`, `scripts/verify_tls_proxy.py` with a local Caddy proxy and temporary certificate | Public certificate, graphical remote browser and external route |
| A failing PR cannot satisfy the required CI gate | [Draft PR #1](https://github.com/OthmaneBlial/AetherTerm/pull/1) intentionally failed one Python test in [run 35449706256](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35449706256); seven other checks passed and GitHub reported `BLOCKED` | Repository administrators can bypass this rule to preserve the requested direct pushes to `main` |

The suite has intentional limits: no fixture contains a real credential, all test listeners stay on loopback, the fake agent in the output stress checks tests server relay behavior, and the three browser journeys use a real agent/PTY. A green CI run does not prove external deployment, independent review or acceptance by target users. See [ROADMAP.md](../ROADMAP.md) for those gates.
