# Release checklist

1. Confirm `CHANGELOG.md` describes only implemented behavior and set the release date.
2. Run `pnpm install --frozen-lockfile`, `pnpm audit --audit-level=moderate`, `pnpm verify`, `pnpm bench`, and `pnpm test:e2e`.
3. Run `docker compose up -d --build`; verify `/health`, `/ready`, ports 8080/8081, proxied WebSocket flow, container health, restart behavior, and clean shutdown.
4. Test the default simulator, recording export/import, phone controller, keyboard controls, reduced motion, a narrow phone viewport, and a 1080p display.
5. Run the Linux agent tests on Linux and manually smoke the agent when its code changed.
6. Review tracked files for secrets, private metadata, debug output, generated databases, and oversized assets.
7. Verify README commands, local links, screenshots, version requirements, current limitations, and the privacy/security documents.
8. Create a signed version tag only after CI succeeds on the exact commit. Publish release notes from the changelog; do not upload real captures or databases.
