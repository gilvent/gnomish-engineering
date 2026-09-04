# Bug fix

**You own this task. Plan, review, verify.**

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix; it does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more.

1. Reproduce it yourself on the matching surface (drive the CLI, TUI, or UI directly; on Claude Code the built-in `run` skill drives the app). Don't hand the repro to the user. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. Won't reproduce directly, force it: synthesize the trigger, tighten conditions, or instrument until it fires. A bug you can't reproduce, you can't prove fixed.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with the **how** skill over the affected subsystem and the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess ([Fix Root Causes](../../principle-fix-root-causes/SKILL.md)). Confirm the surviving *mechanism* with runtime evidence before designing the fix; a design grounded on a plausible-but-unconfirmed cause can be wrong while the real cause sits one subsystem over.
3. Plan and implement the fix: the smallest change the evidence justifies. If it crosses a function boundary, run the **architect** skill first. If you delegate the implementation, give a specific scope and review the diff yourself.
4. Verify on the same surface; the original repro now passes. "Inconclusive" or wrong-surface is not a pass; flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history; the diff tells the story. Write the failing test first when the bug has a cheap local test path; skip it when the test would be expensive, integration-heavy, or unclear. This is the canonical [Sequence Work into Verifiable Units](../../principle-sequence-verifiable-units/SKILL.md): the failing test first and the fix on top.
6. Commit in small ordered units and open a PR.

**Reply:** what was broken, root cause, fix, how you verified. Quote the decisive failing and passing output, trimmed to the assertion and the counts.
