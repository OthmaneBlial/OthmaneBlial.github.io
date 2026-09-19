# Local quickstart

This guide runs one server and one agent on the **same machine**. It is a loopback demonstration, not an Internet deployment. AetherTerm currently targets Python 3.13 and a POSIX shell. The installed wheel has completed an automated real-PTY smoke check on Ubuntu 24.04 and macOS; a fresh human-led Linux installation still needs review before release.

For a disposable first look from a checkout, create a Python 3.13 venv, install this project with `python -m pip install .`, then run `python -m scripts.demo_local`. It starts a real server and agent on a random loopback port, waits for the agent to register, and prints the local URL and a one-time operator password. Select **demo-agent** to open a real shell under your OS account. Press Ctrl+C in the launching terminal to stop both processes and delete the temporary identities. The demo does not modify your normal AetherTerm configuration. The Linux CI runs `python -m scripts.demo_local --check` to verify setup and cleanup without printing the password.

## 1. Install and create private identities

From a checkout of this repository:

```bash
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install .
aetherterm-admin init
aetherterm-admin enroll local-agent --output ~/.config/aetherterm/local-agent.token --description "Local shell"
```

`init` prompts twice for an operator password of at least 12 characters. It refuses to replace an existing operator file. `enroll` creates a new credential file with mode `0600` and refuses to overwrite a file or an existing device ID. Keep both files out of Git and screenshots. The default server files are `~/.config/aetherterm/operator.json` and `~/.config/aetherterm/agents.json`; the agent secret is in the path chosen above.

## 2. Start the server

In another terminal, from the same checkout:

```bash
source .venv/bin/activate
aetherterm-server --port 8001
```

The installed entry point listens on `127.0.0.1` only. Leave it running. If port 8001 is occupied, choose a free port and use the same number for the agent and browser.

## 3. Start the agent

In a third terminal, from the same checkout:

```bash
source .venv/bin/activate
aetherterm-agent --host 127.0.0.1 --port 8001 --device-id local-agent \
  --token-file ~/.config/aetherterm/local-agent.token
```

The shell runs as the OS user who starts this process. Never run the agent as root merely to make a command work. The agent checks that its token file is a regular file owned by that user, with no group or other access.

Open `http://127.0.0.1:8001/web/`, enter the operator password, choose **local-agent**, and type a command into the terminal. No shell command runs automatically. Close the session with **Close session**, then sign out. The browser may reconnect after a temporary server outage, but a server restart loses in-memory operator sessions and requires sign-in again. Previous shells close on disconnection.

## A second local device identity

To check the device list with two independently enrolled agents, create another identity on the server:

```bash
aetherterm-admin enroll second-agent --output ~/.config/aetherterm/second-agent.token
```

Start a second agent process with `--device-id second-agent` and its own `--token-file`. An agent credential cannot register under a different ID. These two processes can run on the same test machine; that does not prove a remote deployment.

## Rotate, revoke and stop

To replace a device secret, create a **new** private file, then restart that agent with the new path:

```bash
aetherterm-admin rotate local-agent --output ~/.config/aetherterm/local-agent-new.token
```

The old credential stops authorizing connections. To disable the device entirely, run `aetherterm-admin revoke local-agent`. A revoked ID cannot be re-enrolled through the current CLI; choose a new ID if another agent is needed. Stop the agent and server with Ctrl+C. Their active PTYs close; the operator password and device registry remain on disk for the next run. Do not delete those files unless you intend to discard the identities.

For a different host, read [deployment and TLS](DEPLOYMENT.md) and [security](SECURITY.md) first. The remote mode is still awaiting the release validations recorded in the [roadmap](../ROADMAP.md).
