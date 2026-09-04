# Candidate design checklist

Every candidate design package contains: type sketch, function signatures, module map, and prose rationale shaped per [`rationale-template.md`](rationale-template.md). Candidates are compared on these axes to pick a base.

- Caller's usage first. Write the README-style usage and two or three real call sites before the types, then derive the type sketch from them. The usage is the spec; the two must agree, so reconcile the sketch to the usage, not the reverse.
- Data structures first. Get the core types right and the code becomes obvious. Trace each dominant access pattern through the proposed structure; if the answer is "we'll add a map / index / cache later," the structure is wrong.
- Interface depth. Compare the capability hidden behind the public surface relative to the size of that surface. Prefer a simple interface that pulls complexity into the callee, even when the implementation becomes less simple. Do not put transport or wire types on the public surface; parse into domain types behind the interface.
- Shared state: if two actors might both write, ask "what happens?" If the answer isn't "nothing," default to per-actor state with a merge at the read boundary, per the **principle-separate-before-serializing-shared-state** skill.
- Make boundaries visible. `not implemented` errors for bodies, `// TODO` pseudocode for tricky logic, doc comments stating intent and invariants. A reader should trace data from input to output by reading types and signatures alone.
- Encode invariants in types: hard-to-misuse types > runtime checks > prose comments, per the **principle-encode-lessons-in-structure** skill.
- Validate at boundaries, trust types inside, per the **principle-boundary-discipline** skill. Business logic as pure functions; the shell stays thin.
- Single source of truth per invariant. Derive instead of sync.
- Idempotent state transitions where applicable, per the **principle-make-operations-idempotent** skill. Ask what happens if the operation runs twice or crashes halfway.
- Short call chains. If tracing the flow needs more than three files, flatten the hierarchy, per the **principle-laziness-protocol** and **principle-minimize-reader-load** skills.

Candidates must be structurally distinct. A second flavor of the first shape does not count; differences between candidates are the signal used to pick a base and graft. Converging on a safe-looking middle defeats the exploration.
