---
name: arena
description: "Compete 2+ design sketches (not full implementations) at the same task, pick a base, graft the strongest parts of the losers into it. Budget port of pstack's arena for a single Claude subscription. Use for /arena, 'arena this', or when one attempt at a non-trivial artifact would lock in the wrong shape."
---

# Arena (sketch arena)

Fan out competing attempts at the same task, pick the strongest as the base, graft the best ideas from the others into it, verify the synthesized result. The budget rule that makes this affordable: **candidates are sketches, not implementations.** A sketch package (caller usage, types, signatures, module map, rationale) costs 10-20x less than a full build and captures most of the decision value. Compete full implementations only when the user explicitly asks and accepts the cost.

Read the **poor-mans-orchestration** skill before spawning anything; it owns the model tiers and the budget rules.

## Phase A: Frame

The candidates receive the same prompt, so the prompt is the contract.

1. State the artifact each candidate is sketching.
2. Derive the rubric: 3-6 concrete gradeable criteria for *this* task. Concrete: "Adds a --dry-run flag that skips writes". Vague: "code is correct". Candidates see the task, not the rubric.
3. Pick the budget. Default: 2 candidates from one runner-tier subagent asked for two structurally distinct packages in one pass. Higher stakes: 2 parallel runner-tier subagents, one candidate each. Only on explicit request: 3+ runners or full implementations.
4. Assign output paths. Each candidate writes to its own scratch location; shared write targets fail the **principle-separate-before-serializing-shared-state** test.

## Phase B: Fan out

Spawn the runner(s) with the task, the grounding, the output path(s), and the candidate discipline from the architect skill's [`candidate-checklist.md`](../architect/references/candidate-checklist.md). The rationale is mandatory: each candidate names the alternatives it considered and rejected. Without it you cannot tell whether a candidate's structure is principled or accidental, which makes grafting unreliable.

## Phase C: Judge and pick

You are the judge; no separate judge agent at default budget. Read every candidate end to end, then score criterion by criterion against the rubric, not on holistic feel. Skimming surfaces only the candidate whose surface looks most familiar. Pick the base on which candidate a future maintainer can extend most easily without breaking invariants; prefer the cleaner boundary or smaller surface when tied (**principle-laziness-protocol**). Record the pick and the reason in a short synthesis note. State the reduced diversity plainly: same-family candidates, self-judged.

## Phase D: Graft

Walk each losing candidate once more and identify what is worth porting into the base; usually one or two things per candidate, not most of it. Fold each graft in by hand per **principle-redesign-from-first-principles**; the result must remain coherent under one mental model. Record what was grafted, from which candidate, and what was rejected and why. The rejection notes are the highest-signal part of the record.

When candidates converge on the same shape, ship the consensus and note it; no graft needed. When they wildly diverge, Phase A was under-specified: reframe and re-run rather than averaging.

## Phase E: Verify

The synthesized artifact holds up under the same scrutiny as any other output, per **principle-prove-it-works**. The arena does not earn a pass. If verification surfaces a problem, either Phase A was wrong (reframe, re-run) or a losing candidate caught it and you missed the graft (back to Phase D).

## Outputs

One synthesized artifact. One synthesis note naming the base, the grafts with source candidate, the rejections, and the verification result.
