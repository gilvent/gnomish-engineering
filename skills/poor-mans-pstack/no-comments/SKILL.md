---
name: no-comments
description: "Strip comments before review with an independent reviewer pass, fix accepted findings, and offer encodings for claimed constraints. Budget port of pstack's no-comments for a single Claude subscription."
---

# No comments

An independent reviewer pass flags comments for deletion; you inspect its report, act on the accepted findings, and offer to encode any real constraint the comments claimed. The reviewer's value is a fresh perspective that did not write the code, so defer to it and let it judge without your reasoning.

The reviewer spawns as the `no-comments reviewer` line in `~/.claude/poor-mans-pstack-models.md`, default `pstack-comment-sicko-sonnet-5-high`. Pass the agent name as `subagent_type` and never pass `model`.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch, default `main`, including the working tree.

## Steps

1. **Spawn the reviewer.** Fire one `Agent` as your configured `no-comments reviewer` agent. Pass the scope. Do not restate its rules. The agent's body carries them, generated from the [Comment Sicko template](../setup-poor-mans-pstack/references/comment-sicko.md). If the agent you spawn lacks that body (an `inherit-parent` value, a missing agent, or a sheet written before templates), open the prompt with a pointer to the template file and tell the reviewer to follow its body first.
2. **Inspect the report and diff.** Reject application-code edits, scope escapes, exception-protected deletions, misstated `MUST KILL` reasons, and flags that treat kept intentional code as guilty. Reshape flags on our-code surprises stay actionable; do not restore those comments. A keep survives only with proof it is about something we cannot change. Audit missed scoped lint and TypeScript suppressions; correctness or safety suppressions stay actionable `MUST KILL`s. Restore deletions only with exact exceptions and scoped proof. Before accepting thin `IMPORTANT` or `do not remove` kills or keeps, run the **how** or **why** skill on their symbol. If a kill is ambiguous, do not restore. If a keep is refuted or still ambiguous, delete it. Revert and rerun one rejected report with the failure named. Reject a second, report it open, and fail this skill.
3. **Fix trivial accepted flags directly** by deleting a dead path, dropping a parameter, or using the real API. If any fix needs a shape, run the **architect** skill once for the accepted set and surrounding code. Stop at the sketch. Architect shapes; step 4 implements.
4. **Implement the smallest root-cause fix in scope.** Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. The **principle-fix-root-causes** and **principle-redesign-from-first-principles** skills guide intent only. Neither authorizes widening the fence nor fixing instances outside it. Never bolt on symptom guards.
5. **Offer to encode claimed constraints.** Constraint comments say `do not remove`, `do not change wording`, or `talk to X before changing`. Leave keeps about things we cannot change. Offer the cheapest in-scope type, runtime, test, or CI lint ([principle-encode-lessons-in-structure](../principle-encode-lessons-in-structure/SKILL.md)). Wait for interactive approval; unattended runs require caller pre-approval. If approved, encode then delete. Otherwise delete, report the constraint open, and sketch the out-of-scope work.
6. **Report** the deletion count, restored comments, reruns, architect sketch, fixes, encoding offers, encodings, unenforced constraints, and other open work.
