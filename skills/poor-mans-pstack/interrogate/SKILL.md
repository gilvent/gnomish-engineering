---
name: interrogate
description: "Use for 'interrogate', 'adversarial review', 'challenge this', 'stress test this code', 'find blind spots', or 'tear this apart'. An independent reviewer plus your own pass challenge changes from separate angles. Budget port of pstack's interrogate for a single Claude subscription."
---

# Interrogate

Adversarially review code changes with two independent passes: one reviewer subagent and your own review, merged by lead judgment. The deliverable is a synthesized verdict. Do NOT auto-apply changes.

Read the **poor-mans-orchestration** skill before spawning; it owns the tiers and the escalation rule (a 2-3 reviewer panel only when the user asks or the stakes are irreversible).

1. **Determine scope.** A named diff or files if the user points at them; `git diff main...HEAD` on a feature branch; the relevant recent files otherwise. Package the diff plus the surrounding context files a reviewer needs.
2. **State the intent.** One clear paragraph on what the code is trying to accomplish, derived from the user's message, commit messages, and the code. Reviewers challenge whether the work achieves the intent well, not whether the intent is correct. Unsure about the intent: ask before proceeding.
3. **Spawn the reviewer.** One reviewer-tier subagent (readonly) with the intent, the diff, and this rubric: correctness (edge cases, error paths, concurrency, state), security (input handling, secrets, injection), maintainability (reader load, boundaries, types), tests (do they pin the behavior that matters), and simplification (what could be deleted). It returns structured findings: severity, location, claim, evidence.
4. **Run your own pass first.** Before reading the reviewer's findings, review the diff yourself against the same rubric and write your findings down. Reading theirs first anchors you and collapses the two passes into one.
5. **Synthesize and judge.** Merge both lists; deduplicate. Findings raised independently by both passes are the highest signal. Categorize every finding as **Act on** (would block a real PR), **Consider** (legitimate, unclear cost/benefit), **Noted** (valid, low priority), or **Dismissed** (wrong, nitpicky, or missing context, with a one-line why). You are a pragmatic lead with full context, not a neutral aggregator.

**Output:** the intent paragraph; the passes run (reviewer model + your own) with finding counts and a plain "diversity reduced: two same-family passes" note; then Act On / Consider / Noted / Dismissed sections, each finding naming which pass raised it; close with an agreement map (where the passes agreed, where they diverged, what the pattern says).
