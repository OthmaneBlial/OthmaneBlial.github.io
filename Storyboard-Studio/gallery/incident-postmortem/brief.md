# Turn a recovery into a reliability decision
Audience: Service owners
Objective: Approve a bounded next step for incident recovery
Owner: Reliability lead
Next action: Approve the pilot and inspect the review evidence
Theme: terminal
Synthetic: true

## The context for incident recovery
This fictional team needs a decision it can explain, execute, and revisit. The service recovered but the same dependency remains on the critical path.
Notes: Synthetic scenario. Figures, roles and organizations are invented to demonstrate the renderer.

## The problem is the missing decision boundary
The service recovered but the same dependency remains on the critical path.

## Evidence to gather before committing
Observe the current workflow, record its limitations, and review source excerpts with the accountable owner.

## Two paths make the trade-off explicit
### Patch the immediate trigger
Faster to start, with the current operating limitations.
### Remove the shared failure boundary
More focused initial work, with a clearer review boundary.

## Recommend the bounded path
Prioritize isolation and test the recovery procedure before closing the incident.

## Risks to review before expansion
Keep the scope narrow. Check whether the new workflow adds manual effort or moves risk elsewhere. Record the unresolved question instead of treating an assumption as a finding.

## Next action: approve the pilot and own the review
### Owner
Reliability lead owns the first milestone and its evidence.
### Review
Inspect the pilot evidence before approving the next stage.
