# Product contract for AetherTerm v1

Status: v1 implementation contract. Local browser sign-in, device credentials, separate PTYs and a bundled terminal now have tests; remote deployment, packaging and release gates remain open. This is not a production-readiness claim.

## Audience and job

One operator manages Linux machines they already own or administer. The operator installs a small agent on each machine, opens a private Web console and starts a shell on an explicitly enrolled machine. A successful first use takes a clean Linux host from installation to an authorized shell without editing source code or exposing a reusable secret in a process argument.

The candidate value is a self-hosted, browser-accessible control plane for a small set of Linux agents. It must be evaluated against existing terminal gateways on setup effort, terminal fidelity, access control and operating burden before a comparative claim is made. AetherTerm does not implement SSH and cannot claim SSH compatibility.

## v1 boundaries

- One operator account per server installation. Every enrolled, active device belongs to that account. There are no roles, shared sessions or multi-tenant isolation claims.
- One server process is authoritative for live WebSocket and PTY session state. Durable operator and device identities survive a restart; live shells do not.
- Multiple enrolled agents and independent sessions per agent are in scope. Each browser session owns only the PTYs it starts. No shell resumes after browser, agent or server disconnection; close and start a new session instead.
- The agent runs a shell with its own operating-system user permissions. AetherTerm does not sandbox that shell or elevate its privilege.
- Local mode binds the server to loopback and permits plain HTTP/WS only on that loopback path. Remote mode requires HTTPS/WSS through a trusted TLS endpoint. The agent validates the server certificate. The server must reject remote cleartext access by default.
- Secrets, commands and terminal output are never written to application logs. No command history or session recording is stored by default.
- Supported agent platform for the first release is Linux on architectures actually exercised by release tests. A native macOS agent, Windows agent, mobile native app, SaaS service and SSH protocol are outside v1 unless separately implemented and validated.

## Core journeys

1. **First shell:** install server and agent, initialize the operator, enroll the device, sign in in a browser, select it, run a command and close the session.
2. **Second device:** enroll a distinct agent identity, see both names and connection states, and use each independently without crossed output.
3. **Network interruption:** observe a clear offline state, keep no orphan shell, reconnect the agent with bounded backoff, sign in again if the browser session expired, then start a fresh PTY.

These journeys define release acceptance. Automated local and Linux CI checks cover parts of them; user-observation results and competitive measurements belong in `docs/RESEARCH_STATUS.md` and `docs/POSITIONING.md` when collected.

## Release proof

The release gate requires a clean install from the published artifact, a verified authorized browser–server–agent–PTY round trip, a negative anonymous-access test, a negative cross-browser injection test, TLS verification for remote access, and artifact checksums. CI results support only their tested matrix. Public release and user-adoption statements need separate external evidence.
