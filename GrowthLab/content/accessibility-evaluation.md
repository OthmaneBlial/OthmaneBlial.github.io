# Accessibility evaluation handoff

GrowthLab keeps source hints, browser interaction checks and assistive
technology evaluation separate. The first two are reproducible locally; a
screen-reader result requires a person to exercise the rendered dashboard.

## Reproduce the local signal

Run the bundled fixture from the repository root:

```sh
python3 scripts/test-growth-accessibility.py \
  --output /tmp/growthlab-accessibility.json
```

The smoke starts the real key-free demo, opens its recorded battle in the
installed Chromium build, checks the DOM and accessibility tree, then advances
through thirty Tab events. It also installs provider sentinels so replay cannot
silently invoke Claude, Codex, OpenCode or Cursor. The JSON handoff records the
browser digest, role/name pairs, heading count, focus count and
`providerInvoked: false` without copying product files, prompts or logs.

This is a local structure and keyboard result. It does not certify WCAG,
contrast, touch targets, dynamic announcements, a screen reader or every
browser. The archived HTML rubric remains **ESTIMATED** and the keyboard/tree
smoke remains **OBSERVED**.

## Manual VoiceOver and Safari pass

Execute this checklist on a disposable local demo when a macOS accessibility
reviewer and Safari are available:

1. Start `growthlab demo --no-browser`, open the printed loopback URL in Safari,
   and record the macOS, Safari and GrowthLab source commit.
2. Turn on VoiceOver for this review session. Navigate by landmarks, headings,
   links, buttons, tabs and form controls; confirm each announced name matches
   its visible purpose.
3. Open a recorded battle, inspect the comparison, variant detail, evidence,
   diff/log and static-preview views, and verify that focus remains visible and
   returns to the invoking control when a dialog or tab panel closes.
4. Trigger the deliberate failed check and any loading, empty, cancellation and
   error states available in the fixture. Confirm status changes are announced
   or otherwise discoverable without relying on color alone.
5. Repeat the key path at the phone viewport and with Arabic or Persian
   selected. Check reading order, direction, clipping, zoom and keyboard escape
   behavior.
6. Record each finding with the route, control name, expected announcement,
   actual announcement and severity. Attach screenshots only when they contain
   no private product data.

Safari Remote Automation is not required for this manual pass. If automation is
used later, enable it explicitly for the test session and record that fact; do
not turn it on silently as part of a local smoke.

## Evidence status

Until a reviewer completes the manual steps above, report the result as
**UNVERIFIED**. A passing Chromium tree, a passing keyboard loop or a perfect
source rubric must not be rewritten as a screen-reader, WCAG or conversion
claim. Keep the JSON handoff and the reviewer notes beside the source commit
that was tested.
