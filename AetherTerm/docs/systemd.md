# Same-host Linux user service example

This example runs an enrolled agent under **your own Linux account** and connects to an AetherTerm server on the **same host** at `127.0.0.1:8001`. It does not establish remote TLS or make the server safe to expose. The unit file is [aetherterm-agent@.service](../packaging/aetherterm-agent@.service). It has a restart policy for process failures; the agent itself retries temporary network outages. A deliberate service stop and a rejected credential should not be turned into a restart loop. The [systemd service reference](https://github.com/systemd/systemd/blob/main/man/systemd.service.xml) defines `Restart=on-failure` and clean exits.

Install the wheel in a private venv at the path used by the unit, from a checkout on the agent host:

```bash
install -d -m 700 "$HOME/.local/share/aetherterm"
python3.13 -m venv "$HOME/.local/share/aetherterm/venv"
"$HOME/.local/share/aetherterm/venv/bin/python" -m pip install /path/to/AetherTerm
```

Run the [quickstart enrollment](QUICKSTART.md) on the server for an ID such as `local-agent`. On a same-host setup, its private token file should be `~/.config/aetherterm/local-agent.token`, owned by the service user with mode `0600`. The server must be running on loopback port 8001. Confirm the agent can start manually with its token file before enabling the service.

Install and inspect the user unit:

```bash
install -d -m 700 "$HOME/.config/systemd/user"
install -m 644 packaging/aetherterm-agent@.service "$HOME/.config/systemd/user/aetherterm-agent@.service"
systemctl --user daemon-reload
systemctl --user enable --now aetherterm-agent@local-agent.service
systemctl --user status aetherterm-agent@local-agent.service
journalctl --user -u aetherterm-agent@local-agent.service -n 50 --no-pager
```

The `%i` instance name becomes both the device ID and token filename. Use only an enrolled ID. To stop the service and its PTYs, run `systemctl --user disable --now aetherterm-agent@local-agent.service`. Do not run it as root to make shell commands work; the shell has the service user's operating-system rights. A systemd user manager may stop at logout unless your machine's normal user-service policy keeps it running. This repository has checked the unit's syntax in Linux CI; a full service lifecycle on a separate host and user account is still a release validation task.
