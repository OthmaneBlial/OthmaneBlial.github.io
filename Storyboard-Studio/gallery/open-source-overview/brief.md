# Storyboard Studio — an inspectable presentation compiler
Audience: Developers and maintainers
Objective: Approve a bounded next step for native presentation tooling
Owner: Maintainer
Next action: Approve the pilot and inspect the review evidence
Theme: swiss
Synthetic: true

## The context for native presentation tooling
This fictional team needs a decision it can explain, execute, and revisit. A polished slide does not explain where its claims or layout came from.
Notes: Synthetic scenario. Figures, roles and organizations are invented to demonstrate the renderer.

## The problem is the missing decision boundary
A polished slide does not explain where its claims or layout came from.

## Evidence to gather before committing
Observe the current workflow, record its limitations, and review source excerpts with the accountable owner.

## Two paths make the trade-off explicit
### Generate opaque slide images
Faster to start, with the current operating limitations.
### Compile editable objects from a typed story
More focused initial work, with a clearer review boundary.

## Recommend the bounded path
Build a Rust core shared by the CLI and desktop, with visible diagnostics.

## Risks to review before expansion
Keep the scope narrow. Check whether the new workflow adds manual effort or moves risk elsewhere. Record the unresolved question instead of treating an assumption as a finding.

## Next action: approve the pilot and own the review
### Owner
Maintainer owns the first milestone and its evidence.
### Review
Inspect the pilot evidence before approving the next stage.
