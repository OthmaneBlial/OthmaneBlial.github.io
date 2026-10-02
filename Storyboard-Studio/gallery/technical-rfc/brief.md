# A migration boundary the team can test
Audience: Engineering reviewers
Objective: Approve a bounded next step for data migration
Owner: RFC author
Next action: Approve the pilot and inspect the review evidence
Theme: mono
Synthetic: true

## The context for data migration
This fictional team needs a decision it can explain, execute, and revisit. Replacing the storage layer and API simultaneously makes rollback unclear.
Notes: Synthetic scenario. Figures, roles and organizations are invented to demonstrate the renderer.

## The problem is the missing decision boundary
Replacing the storage layer and API simultaneously makes rollback unclear.

## Evidence to gather before committing
Observe the current workflow, record its limitations, and review source excerpts with the accountable owner.

## Two paths make the trade-off explicit
### Replace everything together
Faster to start, with the current operating limitations.
### Migrate one boundary at a time
More focused initial work, with a clearer review boundary.

## Recommend the bounded path
Keep a tested read boundary while migrating writes behind an explicit switch.

## Risks to review before expansion
Keep the scope narrow. Check whether the new workflow adds manual effort or moves risk elsewhere. Record the unresolved question instead of treating an assumption as a finding.

## Next action: approve the pilot and own the review
### Owner
RFC author owns the first milestone and its evidence.
### Review
Inspect the pilot evidence before approving the next stage.
