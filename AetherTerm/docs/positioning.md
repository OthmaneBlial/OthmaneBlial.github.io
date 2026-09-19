# Positioning evidence and comparison plan

Checked on 2026-09-19. This is a comparison of documented capabilities, **not** a hands-on benchmark, security audit of competitors or proof that AetherTerm is better. Product versions and precise setup measurements are still missing.

## Candidate job

> Give one operator a private browser console for explicitly enrolled Linux agents, without having to expose each agent's shell endpoint to the browser.

This is a hypothesis. AetherTerm now has local operator sign-in, device credentials and a bundled terminal, but its external remote-network path, full terminal interaction set and release artifacts are not yet validated. It has no verified setup advantage or adoption evidence. Agent-initiated connections might simplify some topologies, but NAT/firewall behavior must be measured before making that claim.

## Documented landscape

| Project | Architecture or access documented upstream | Terminal and distribution documented upstream | What AetherTerm must prove before comparison |
| --- | --- | --- | --- |
| [ttyd](https://github.com/tsl0922/ttyd/blob/main/README.md) | Serves a command's terminal over the Web; documents Basic authentication, an authentication-proxy header option, origin checking and TLS flags. | Documents CJK/IME, static binaries and multiple installation methods. | A second-agent scenario, secure first setup and recovery with fewer measured steps. Do not claim a simpler or more secure ttyd replacement. |
| [WeTTY](https://github.com/butlerx/wetty/blob/main/README.md) | Browser terminal using SSH or local login; documents remote SSH host options and HTTPS/proxy deployment. | Documents xterm.js, npm and Docker installation. | Show where an enrolled outbound agent helps compared with an SSH-based workflow, with the same network and credential constraints. |
| [Apache Guacamole](https://guacamole.apache.org/doc/gug/introduction.html) | Browser gateway for SSH, RDP and VNC. Its [SSH configuration guide](https://guacamole.apache.org/doc/gug/configuring-guacamole.html) documents connection and access settings. | Browser access without client-side plugins; broader remote-desktop scope than this project's v1. | Compare only the Linux terminal journey, not Guacamole's wider desktop feature set, and quantify setup/maintenance cost rather than asserting it. |
| AetherTerm at `53ee7fc` | Python server with operator sign-in, enrolled outbound WebSocket agents and browser-owned PTY sessions; local Caddy TLS path checked. | Bundled xterm.js interface; wheel and real PTY tested on macOS and an Ubuntu 24.04 CI runner, with Chromium, Firefox and WebKit journeys and keyboard tab switching. No published release artifact, external-host path or full physical input review yet. | Finish security, deployment and release gates, then run the same tasks on published artifacts. |

The project should avoid a generic “SSH replacement” claim: AetherTerm does not implement SSH, while WeTTY and Guacamole explicitly use it. An honest differentiator may be a narrowly scoped, auditable single-operator agent model, but this remains unproven.

## Reproducible comparison protocol

For each project, record a dated commit/tag or release version, installation environment, network topology, exact commands, start/finish times, number of manual decisions, required exposed ports, authentication/TLS configuration, terminal behavior and recovery after interruption. Use the same Linux target and the same browser. Do not compare a hardened AetherTerm deployment with an intentionally insecure competitor example, or vice versa.

1. **First shell:** from a clean host, install the server or gateway and reach one authorized shell. Record time and steps.
2. **Second Linux host:** add a second target and switch between independent terminal sessions. Record network assumptions and credential handling.
3. **Interruption:** disconnect and reconnect target, browser and server separately. Record shell cleanup, user feedback and operator actions.
4. **Terminal fidelity:** run `vim`, `less`, Ctrl+C, arrows, colors, resize and Unicode/CJK output. Record failures with screenshots or logs that contain no secrets.
5. **Security boundary:** check documented authentication, per-target authorization, TLS and session ownership. This is a product acceptance comparison, not a penetration test of other projects.

## Evidence status

- AetherTerm's first/second host and interruption measurements: **not run** on a release artifact.
- Equivalent hands-on competitor measurements: **not run**.
- 3–5 consented target-user observations: **0 recorded**; see [research status](RESEARCH_STATUS.md).
- Comparative advantage and star potential: **not established**.

Update the table from real measurements before moving any advantage claim into the README or release notes.
