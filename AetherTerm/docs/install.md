# Installation paths currently under test

There is **no verified public release download** yet. The commands below build from this checkout. Only Python 3.13 is declared; the real PTY integration runs on Ubuntu 24.04 CI and macOS development. Follow the [local quickstart](QUICKSTART.md) for identity setup and first use.

On 2026-09-19, a fresh shallow clone of `main` at commit `06939e7` was installed in a new macOS Python 3.13 environment with the hashed runtime lock. The installed package passed the documentation-link check and `python -m scripts.demo_local --check`, including disposable server and agent startup/cleanup. The matching CI run [35451933231](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35451933231) passed all eight required jobs. This is macOS onboarding evidence; it does not replace the pending human-led Linux installation review.

## Python wheel

The checked-in Web bundle is included in the Python wheel. From a checkout:

```bash
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install build==1.6.1
python -m build --wheel --sdist
python -m pip install --require-hashes -r requirements-runtime.lock
python -m pip install --no-deps dist/aetherterm-0.1.0a0-py3-none-any.whl
python -m pip check
```

The three entry points are `aetherterm-admin`, `aetherterm-server` and `aetherterm-agent`. The CI installs the built wheel in a **separate clean virtual environment outside the checkout** and completes an authenticated server–agent–PTY round trip. The wheel requires Python; the separate Linux agent binary is described below. The version and filename here must be updated when the package version changes.

The `python-distributions` artifact in [run 35452256389](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35452256389) contains the wheel, source archive and `SHA256SUMS`, retained for seven days. That artifact was downloaded to a separate temporary directory, both checksums matched, and the downloaded wheel was installed into a fresh Python 3.13 venv outside the checkout. The installed package reported version `0.1.0a0`. This verifies that particular CI download, not a permanent public release asset.

## Linux x86_64 agent binary in CI

The [`linux-agent-binary` CI job](../.github/workflows/ci.yml) also builds a PyInstaller one-file agent named `aetherterm-agent-0.1.0a0-linux-x86_64`. The job checks its command-line startup and SHA-256 manifest, then uses **that binary** to open a real Linux PTY through a server installed from the wheel. This passed on Ubuntu 24.04 in [run 35450521219](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35450521219).

The `linux-agent-x86_64` workflow artifact contains the binary and `SHA256SUMS` for seven days. It is a CI artifact, **not a GitHub Release download**. After obtaining the artifact from that run, verify it in its extracted directory before first use:

The artifact from [run 35452256389](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35452256389) was downloaded to a temporary directory with `gh run download`. Its `SHA256SUMS` check passed; the binary identifies as an ELF Linux x86-64 executable. macOS cannot execute that ELF; the Linux CI job supplies the real PTY execution evidence. This check does not establish a permanent public download.

```bash
sha256sum --check SHA256SUMS
chmod +x aetherterm-agent-0.1.0a0-linux-x86_64
./aetherterm-agent-0.1.0a0-linux-x86_64 --help
```

Follow [QUICKSTART.md](QUICKSTART.md) to create the private device credential, then replace `aetherterm-agent` in its example with the verified binary path. The build targets Linux x86_64 and still depends on the target system's libc and `/bin/bash`; compatibility with other Linux distributions, architectures and real remote hosts has not been established.

## Linux server container

The repository's [Dockerfile](../Dockerfile) builds a server image from the wheel. The image runs as UID 10001, stores operator and device files under `/data`, and keeps the server bound to `127.0.0.1` through the installed entry point. The Linux CI container smoke test starts the image with host networking, a read-only root filesystem and a bind-mounted state directory, then connects a host agent and runs a real PTY command. This establishes that topology on the runner only; it is not evidence of a public HTTPS deployment.

For a **controlled same-host Linux test**, build the image and prepare a private state directory owned by the container UID:

```bash
docker build --tag aetherterm:local .
install -d -m 700 "$HOME/.local/share/aetherterm-server"
sudo chown 10001:10001 "$HOME/.local/share/aetherterm-server"
```

Run `aetherterm-admin init` and `enroll` inside the image with the same `/data` mount. Use `docker run -it --rm --network host --mount type=bind,src="$HOME/.local/share/aetherterm-server",dst=/data --entrypoint aetherterm-admin aetherterm:local init`, then repeat with `enroll DEVICE_ID --output /data/DEVICE_ID.token`. The `init` command needs an interactive terminal for password entry. Transfer the resulting token file to the intended agent through a trusted channel, preserve mode `0600` and ownership by the agent account, then remove any extra server-side copy only when you have verified the agent has its copy. The server registry retains only its digest.

Start the server container with the same mount:

```bash
docker run --rm --network host --read-only \
  --tmpfs /tmp:rw,nosuid,nodev,size=16m --cap-drop ALL \
  --security-opt no-new-privileges \
  --mount type=bind,src="$HOME/.local/share/aetherterm-server",dst=/data \
  aetherterm:local --port 8001
```

Linux host networking is intentional here: the server still listens **only** on host loopback. Do not publish a Docker port or change the bind address to expose an unaudited plain WebSocket service. A trusted same-host TLS proxy remains necessary for remote browser or agent access, and the [remote deployment gate](DEPLOYMENT.md) is not complete. The bind mount is the only durable container state; stop the container to invalidate in-memory browser sessions and close active shells.
