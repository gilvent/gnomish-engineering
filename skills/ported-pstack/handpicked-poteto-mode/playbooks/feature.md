# Feature

**You own the design. Plan, review, verify.**

1. Read the affected subsystem until you can name its data shapes, call graph, and conventions.
2. When the change crosses a function boundary or has no precedent, sketch 2-3 competing designs and compare before committing ([Exhaust the Design Space](../principles/exhaust-the-design-space.md)). Skipping stays as `design exploration skipped: <reason>`; do not fold the design decision silently into implementation.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target ([Separate Before Serializing Shared State](../principles/separate-before-serializing-shared-state.md)). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Implement from the named data shape and its organizing structure, chosen before writing logic ([Model the Domain](../principles/model-the-domain.md)): a state machine over scattered booleans, a table/registry over branching, a typed model over repeated shape assumptions. If you delegate, give a specific scope (file paths, the named data shape, success criteria) and review the diff yourself. Surgical edits. Port shared-primitive improvements to all consumers and verify each. Commit liberally.
5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass; flag it.
6. Rebase into small, ordered commits; stack follow-ups. Build, verify, and commit each small unit before the next ([Sequence Work into Verifiable Units](../principles/sequence-verifiable-units.md)).
7. Open a PR.

**Reply:** what you built, what you chose and why, open decisions. Tables for design alternatives.
