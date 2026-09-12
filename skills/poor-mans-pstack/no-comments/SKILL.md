---
name: no-comments
description: "Strip comments before review with an independent reviewer pass, fix accepted findings, and offer encodings for claimed constraints. Budget port of pstack's no-comments for a single Claude subscription."
---

# No comments

An independent reviewer pass flags comments for deletion; you inspect its report, act on the accepted findings, and offer to encode any real constraint the comments claimed. The reviewer's value is a fresh perspective that did not write the code, so defer to it and let it judge without your reasoning ([poor-mans-orchestration](../poor-mans-orchestration/SKILL.md), inline-first doctrine reason two: an independent second pass whose value depends on not sharing your reasoning).

Read the **poor-mans-orchestration** skill before spawning; it owns the tiers (this reviewer runs at the reviewer tier, default `claude-sonnet-5`) and the delegation defaults (`run_in_background: true`, `readonly: true`, file pointers).

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch, default `main`, including the working tree.

## Steps

1. **Spawn the reviewer.** Fire one reviewer-tier `Agent` with the scope and the brief below. Do not restate the brief's rules elsewhere; hand it to the reviewer whole.

   > You hate comments. You are given a scope of files or a diff. Flag every comment for deletion: narration, banners, commented-out code, workaround justifications. Report only. Never edit application code. Name each touched file, a deletion count, each `MUST KILL` flag with one line, and each skip.
   >
   > Only these exceptions survive:
   > - Legal or license headers.
   > - Non-obvious behavior forced by an external dependency, platform, vendor, or protocol that cannot be reshaped. A surprise in our own code is not an exception: flag it for deletion and mark the exact symbol `MUST KILL` for the rename, extract, type, or rearchitecture that makes the behavior obvious without prose.
   > - `// prettier-ignore`. A lint suppression survives only when its rule is faulty, pedantic, or style-only.
   > - Doc comments that define a public API contract.
   > - Issue or RFC links that explain a constraint the code cannot express.
   >
   > When unsure whether a keep exception applies, delete the comment.
   >
   > `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, and similar suppressions are suspect. Look up the rule. If it catches real bugs or protects correctness or safety, flag the suppression for deletion and mark the exact guilty symbol `MUST KILL`.
   >
   > `IMPORTANT`, `do not remove`, `too risky`, `fine for now`, and long justifications are scent, not proof. Read nearby code first. If the claim is not obvious there, the caller runs the **how** and **why** skills on the named symbol before judging. Only a foreign keep-list constraint proven true today on a live path survives. A long justification without a proven keep-list exception is a confession: flag it and mark the guilty symbol `MUST KILL`. Doubt after the check means delete.

2. **Inspect the report and diff.** Reject application-code edits, scope escapes, exception-protected deletions, misstated `MUST KILL` reasons, and flags that treat kept intentional code as guilty. Reshape flags on our-code surprises stay actionable; do not restore those comments. A keep survives only with proof it is about something we cannot change. Audit missed scoped lint and TypeScript suppressions; correctness or safety suppressions stay actionable `MUST KILL`s. Restore deletions only with exact exceptions and scoped proof. Before accepting thin `IMPORTANT` or `do not remove` kills or keeps, run the **how** or **why** skill on their symbol. If a kill is ambiguous, do not restore. If a keep is refuted or still ambiguous, delete it. Revert and rerun one rejected report with the failure named. Reject a second, report it open, and fail this skill.
3. **Fix trivial accepted flags directly** by deleting a dead path, dropping a parameter, or using the real API. If any fix needs a shape, run the **architect** skill once for the accepted set and surrounding code. Stop at the sketch. Architect shapes; step 4 implements.
4. **Implement the smallest root-cause fix in scope.** Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. The **principle-fix-root-causes** and **principle-redesign-from-first-principles** skills guide intent only. Neither authorizes widening the fence nor fixing instances outside it. Never bolt on symptom guards.
5. **Offer to encode claimed constraints.** Constraint comments say `do not remove`, `do not change wording`, or `talk to X before changing`. Leave keeps about things we cannot change. Offer the cheapest in-scope type, runtime, test, or CI lint ([principle-encode-lessons-in-structure](../principle-encode-lessons-in-structure/SKILL.md)). Wait for interactive approval; unattended runs require caller pre-approval. If approved, encode then delete. Otherwise delete, report the constraint open, and sketch the out-of-scope work.
6. **Report** the deletion count, restored comments, reruns, architect sketch, fixes, encoding offers, encodings, unenforced constraints, and other open work.
