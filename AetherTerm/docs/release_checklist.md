# First release checklist

This is a preparation document, not evidence that a release exists. Record the exact commit, test platform, artifact digest and public URL when each step is performed. Keep credentials, private hostnames and terminal contents out of the checklist and release notes.

## Gate 1: product and security

- [ ] All P0 and P1 items before phase 6.4 in [ROADMAP.md](../ROADMAP.md) are complete with linked evidence. A reviewer other than the implementer has checked the threat model and auth/session boundary.
- [ ] A browser and agent on separate machines reach a real shell through a trusted HTTPS/WSS endpoint. Invalid certificates and remote cleartext fail. Confirm the browser's certificate trust and proxy forwarding headers.
- [ ] A clean Linux account follows the installation and service guide, then backs up and restores its identities without leaving an old shell or session active.
- [ ] Three to five consenting target users have attempted the documented first-shell, second-device and recovery tasks; anonymized findings and resulting product decisions are recorded.
- [ ] The exact terminal programs, keyboard, clipboard, touch and browser/platform combinations claimed in the README have been checked on real devices.

## Gate 2: source and candidate artifacts

- [ ] Review the candidate diff, update the version and this changelog, and define supported OS/architecture/Python combinations from native test results.
- [ ] Run the full CI on the exact candidate commit. Save its run URL and require every job to pass: secret scan, Python tests/typecheck/audit, Web assets, browser journey, container and Linux agent binary.
- [ ] Compare the generated source archive, wheel, Linux binary, image source commit and SHA-256 manifests to the candidate. Install each announced downloadable artifact outside the source checkout on its declared platform.
- [ ] From those installed files, complete operator sign-in, agent enrollment, a real shell command, close/reconnect and logout. Verify the Web UI loads without external asset requests.
- [ ] Review release notes for exact features, installation commands, limitations, compatibility, security boundary and support/reporting links. Do not claim SSH compatibility, production safety or an untested platform.

## Gate 3: publish and independently verify

- [ ] Only after gates 1 and 2, create the intended signed tag if the signing chain is available; otherwise document why the tag is unsigned. Publish the release and attach the tested artifacts plus `SHA256SUMS`.
- [ ] The tag must equal the package version (for example `v0.1.0a0`). The pinned [release workflow](../.github/workflows/release.yml) rebuilds the wheel, source archive and Linux x86_64 agent from that tag, verifies their hashes, and uploads only those checked files. A green workflow on a tag is still required before calling the public release complete.
- [ ] Download every advertised asset from the public release page in a fresh location, verify SHA-256 and repeat the authorized shell smoke test. Confirm the release page, README links and GitHub metadata actually resolve.
- [ ] Record the rollback path: stop the agent and server, restore a known-good image/wheel and private identity backup, rotate credentials if an old registry backup may reauthorize one, and verify a new shell. Do not promise shell continuity across rollback.
- [ ] Observe first public reports and route suspected access-control defects through [SECURITY.md](../SECURITY.md). Update the changelog and support status from real outcomes.

Only after these gates and phase 6.4 are complete may the real product video in phase 7 be captured and edited.
