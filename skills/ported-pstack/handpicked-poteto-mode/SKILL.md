---
name: handpicked-poteto-mode
description: Implementation-focused agentic workflow ported from pstack's poteto-mode. Five playbooks (investigation, bug fix, feature, refactoring, prototype) grounded in 21 engineering principles. Smallest change that works, domain-first data shapes, verified results. Use for /handpicked-poteto-mode or requests to code in this style.
---

# Handpicked poteto mode

An agentic workflow focused on implementation, ported from the pstack plugin's poteto-mode skill: five implementation playbooks grounded in all 21 principles. No planning or utility skill routing, no cross-runtime shims. The principles shape the code you write and how you run the task, delegation included.

## How to apply

- Match the task to a playbook below and open its file. Your first todolist actions are the playbook's steps, copied in verbatim, before any task-specific todos. A step you choose not to do stays in the list with a one-line `skip: <reason>`; skipping silently is not allowed.
- On any multi-step coding task, scan the principles index and read in full (`principles/<name>.md`) every principle whose trigger matches the task.
- Before writing any logic, name the data shape and its organizing structure per Model the Domain.
- Before declaring done, verify per Prove It Works.
- In your reply, name the principles that shaped decisions and the choice each changed. A sentence per principle carries both. A citation must trace to a real choice the principle's rule drove; a citation with no decision behind it means you skipped its file.

## Playbooks

- **Investigation** ([playbooks/investigation.md](playbooks/investigation.md)). Read-only question: how does X work, why was Y built this way, are we sure about Z, should we do X or Y. Produces a cited answer, not a code change.
- **Bug fix** ([playbooks/bug-fix.md](playbooks/bug-fix.md)). A reported defect to reproduce, root-cause, and fix with runtime evidence.
- **Feature** ([playbooks/feature.md](playbooks/feature.md)). New or changed behavior, built from a named data shape.
- **Refactoring** ([playbooks/refactoring.md](playbooks/refactoring.md)). A behavior-preserving change to structure or shape (rename, extract, inline, dedupe, move).
- **Prototype** ([playbooks/prototype.md](playbooks/prototype.md)). A throwaway sketch to make a design or behavioral decision cheaply, or to settle an empirical fork by observing it instead of asking the human.

A task none of these fit gets a bespoke plan built from the principles; say so instead of forcing a playbook.

## Principles

**Core**

- **Laziness Protocol** ([principles/laziness-protocol.md](principles/laziness-protocol.md)). Refactoring, sizing a diff, or tempted to add abstractions, layers, or signal threading. Bias to deletion and the smallest change that solves the problem.
- **Foundational Thinking** ([principles/foundational-thinking.md](principles/foundational-thinking.md)). Before writing logic: core types and data structures, scaffold-vs-feature sequencing, what concurrent actors share.
- **Redesign from First Principles** ([principles/redesign-from-first-principles.md](principles/redesign-from-first-principles.md)). Integrating a new requirement into an existing design. Redesign as if it had been foundational from day one.
- **Subtract Before You Add** ([principles/subtract-before-you-add.md](principles/subtract-before-you-add.md)). Sequencing an addition, refactor, or rewrite. Remove dead weight first, then build on the simpler base.
- **Minimize Reader Load** ([principles/minimize-reader-load.md](principles/minimize-reader-load.md)). Reviewing or shaping code that's hard to trace. Count layers and hidden state, collapse one-caller wrappers, shrink mutable scope.
- **Outcome-Oriented Execution** ([principles/outcome-oriented-execution.md](principles/outcome-oriented-execution.md)). Planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture, don't preserve throwaway compatibility states.
- **Experience First** ([principles/experience-first.md](principles/experience-first.md)). Product, UX, or feature-scope tradeoffs. Choose user delight over implementation convenience.
- **Exhaust the Design Space** ([principles/exhaust-the-design-space.md](principles/exhaust-the-design-space.md)). A novel interaction or architectural decision with no precedent. Build 2-3 competing prototypes and compare before committing.
- **Build the Lever** ([principles/build-the-lever.md](principles/build-the-lever.md)). Any non-trivial work. Build the tool that does or proves it (codemod, script, generator), not by hand; the tool is the artifact a reviewer reruns.

**Architecture**

- **Model the Domain** ([principles/model-the-domain.md](principles/model-the-domain.md)). Writing stateful logic, or code that branches a lot or repeats a shape assumption across files. Encode the domain in a structure (state machine, typed model, table or registry, reducer, boundary, the right collection) instead of scattered conditionals.
- **Boundary Discipline** ([principles/boundary-discipline.md](principles/boundary-discipline.md)). Wiring validation, error handling, or framework adapters. Guards at system boundaries, trust internal types, keep business logic pure.
- **Type System Discipline** ([principles/type-system-discipline.md](principles/type-system-discipline.md)). Designing types or a signature in any typed language. Make illegal states unrepresentable, brand primitives, parse external data at boundaries.
- **Make Operations Idempotent** ([principles/make-operations-idempotent.md](principles/make-operations-idempotent.md)). Designing commands, lifecycle steps, or loops that run amid crashes and retries. Converge to the same end state.
- **Migrate Callers Then Delete Legacy APIs** ([principles/migrate-callers-then-delete-legacy-apis.md](principles/migrate-callers-then-delete-legacy-apis.md)). Introducing a new internal API while old callers exist. Migrate and delete in one wave.
- **Separate Before Serializing Shared State** ([principles/separate-before-serializing-shared-state.md](principles/separate-before-serializing-shared-state.md)). Concurrent actors might write the same file, branch, key, or object. Eliminate the sharing first.

**Verification**

- **Prove It Works** ([principles/prove-it-works.md](principles/prove-it-works.md)). After a task, before declaring done. Verify against the real artifact, not a proxy or "it compiles".
- **Fix Root Causes** ([principles/fix-root-causes.md](principles/fix-root-causes.md)). Debugging. Trace each symptom to its root cause, reproduce first, ask why until you reach it.
- **Sequence Work into Verifiable Units** ([principles/sequence-verifiable-units.md](principles/sequence-verifiable-units.md)). Multi-step work (sweeps, migrations, runs of similar edits) and how you stack commits and PRs. Break work into small units that each end in a check, verify each before the next, and order delivery so the sequence proves itself.

**Delegation**

- **Guard the Context Window** ([principles/guard-the-context-window.md](principles/guard-the-context-window.md)). Context fills up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents, keep summaries in the main thread.
- **Never Block on the Human** ([principles/never-block-on-the-human.md](principles/never-block-on-the-human.md)). Tempted to ask "should I do X?" on reversible work. Proceed, present the result, let the human course-correct.

**Meta**

- **Encode Lessons in Structure** ([principles/encode-lessons-in-structure.md](principles/encode-lessons-in-structure.md)). You catch yourself writing the same instruction a second time. Encode it as a lint, metadata flag, runtime check, or script instead of more text.
