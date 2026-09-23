# Feature

**You own the design. Plan, review, verify.**

1. Run the **how** skill over the affected subsystem.
2. Run the **architect** skill for design exploration. Skipping stays as `architect skipped: <reason>`. Do not fold the design decision silently into implementation.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target ([Separate Before Serializing Shared State](../../principle-separate-before-serializing-shared-state/SKILL.md)). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Implement from a specific scope: file paths, the named data shape and its organizing structure per [Model the Domain](../../principle-model-the-domain/SKILL.md) (a state machine over scattered booleans, a table/registry over branching, a typed model over repeated shape assumptions), chosen before you write logic, and success criteria. Feature implementation is heavy work and does not fan out: keep it to one owner, the main session inline or a single delegate spawned as your configured `feature` agent that keeps the diff out of the main context (**poor-mans-orchestration** skill; review its diff yourself). When the implementation admits multiple valid shapes (error handling, abstraction layer, test structure), run the **arena** skill so the sketches surface the alternatives and the cross-judge guards the pick. Give any file-writing delegate its own worktree (`isolation: "worktree"`) or an exclusive branch; fencing a file in prose is not a lock ([Separate Before Serializing Shared State](../../principle-separate-before-serializing-shared-state/SKILL.md)). Comments per **Comments**. Surgical edits, re-ground against the source for upstream-derived files. Port shared-primitive improvements to all consumers and verify each. Commit liberally.
5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass. Flag it.
6. Rebase into small, ordered commits. Stack follow-ups. Build, verify, and commit each small unit before the next ([Sequence Work into Verifiable Units](../../principle-sequence-verifiable-units/SKILL.md)).
7. If the design is contested, run the **interrogate** skill before shipping.
8. Run **Opening a PR** ([opening-a-pr.md](opening-a-pr.md)).

**Reply:** what you built, what you chose and why, the throughput checkpoint, open decisions. Tables for design alternatives.
