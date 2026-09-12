# Bug fix

**You own this task. Plan, review, verify.** Delegate investigation and the fix, stay in the lead.

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix. It does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more.

1. Reproduce it yourself on the matching surface (drive the CLI, TUI, or UI directly; on Claude Code the built-in `run` skill drives the app). Don't hand the repro to the user. A debug or instrumentation protocol that says to ask the user does not override this. You drive the instrumented runtime. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. Won't reproduce directly, force it: synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with the **how** skill over the affected subsystem and the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. A long or stubborn hunt drains the usage limit unattended: pause and warn the user before you drive it with Claude Code's `loop` command, and get a go-ahead first (a session override like "run until done" counts). Confirm the surviving *mechanism* with runtime evidence before the step-3 architect pass.
3. Plan the fix. If it crosses a function boundary, run the **architect** skill first. Delegate implementation to a single subagent on your configured bug-fix tier (**poor-mans-orchestration** skill; set tiers with `/setup-poor-mans-pstack`) with a specific scope, then review the diff yourself. No parallel writers on one fix.
4. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history. Write the failing test first when the bug has a cheap local test path; skip it when the test would be expensive, integration-heavy, or unclear.
   This is the canonical [Sequence Work into Verifiable Units](../../principle-sequence-verifiable-units/SKILL.md), the failing test first and the fix on top.
6. Run **Opening a PR** ([opening-a-pr.md](opening-a-pr.md)).

Investigation fans out the **how** and **why** passes as at most two parallel subagents (**poor-mans-orchestration** skill).

**Reply:** what was broken, root cause, fix, how you verified. Paste failing-then-passing repro output verbatim.
