---
name: handpicked-poteto-mode
description: Entry point of poor-mans-pstack, the budget port of pstack's poteto-mode. Five implementation playbooks (investigation, bug fix, feature, refactoring, prototype) grounded in 21 principle skills, routed to single-subscription utility skills (how, why, architect, arena, interrogate, unslop). Use for /handpicked-poteto-mode or requests to code in this style.
---

# Handpicked poteto mode

The entry point of poor-mans-pstack, an implementation-focused port of the pstack plugin's poteto-mode for a single Claude subscription: five playbooks, 21 sibling principle skills, and budget utility skills that keep pstack's disciplines while replacing its multi-model panels with tiered subagents per the **poor-mans-orchestration** skill. No cross-runtime shims, no pstack plugin required.

## How to apply

- Match the task to a playbook below and open its file. Your first todolist actions are the playbook's steps, copied in verbatim, before any task-specific todos. A step you choose not to do stays in the list with a one-line `skip: <reason>`; skipping silently is not allowed.
- On any multi-step coding task, scan the principles index and read in full (the sibling `principle-<name>` skills) every principle whose trigger matches the task.
- Before writing any logic, name the data shape and its organizing structure per Model the Domain.
- Route to the utility skills: nontrivial change or "are we sure?" fork, the **how** skill; motivation and rationale questions, the **why** skill; code crossing a function boundary, the **architect** skill; multiple valid implementation shapes, the **arena** skill; contested design before shipping, the **interrogate** skill; every prose surface, your reply included, the **unslop** skill.
- Before any subagent or model choice, read the **poor-mans-orchestration** skill; configure tiers with `/setup-poor-mans-pstack`.
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

- **Laziness Protocol** ([../principle-laziness-protocol/SKILL.md](../principle-laziness-protocol/SKILL.md)). Refactoring, sizing a diff, or tempted to add abstractions, layers, or signal threading. Bias to deletion and the smallest change that solves the problem.
- **Foundational Thinking** ([../principle-foundational-thinking/SKILL.md](../principle-foundational-thinking/SKILL.md)). Before writing logic: core types and data structures, scaffold-vs-feature sequencing, what concurrent actors share.
- **Redesign from First Principles** ([../principle-redesign-from-first-principles/SKILL.md](../principle-redesign-from-first-principles/SKILL.md)). Integrating a new requirement into an existing design. Redesign as if it had been foundational from day one.
- **Subtract Before You Add** ([../principle-subtract-before-you-add/SKILL.md](../principle-subtract-before-you-add/SKILL.md)). Sequencing an addition, refactor, or rewrite. Remove dead weight first, then build on the simpler base.
- **Minimize Reader Load** ([../principle-minimize-reader-load/SKILL.md](../principle-minimize-reader-load/SKILL.md)). Reviewing or shaping code that's hard to trace. Count layers and hidden state, collapse one-caller wrappers, shrink mutable scope.
- **Outcome-Oriented Execution** ([../principle-outcome-oriented-execution/SKILL.md](../principle-outcome-oriented-execution/SKILL.md)). Planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture, don't preserve throwaway compatibility states.
- **Experience First** ([../principle-experience-first/SKILL.md](../principle-experience-first/SKILL.md)). Product, UX, or feature-scope tradeoffs. Choose user delight over implementation convenience.
- **Exhaust the Design Space** ([../principle-exhaust-the-design-space/SKILL.md](../principle-exhaust-the-design-space/SKILL.md)). A novel interaction or architectural decision with no precedent. Build 2-3 competing prototypes and compare before committing.
- **Build the Lever** ([../principle-build-the-lever/SKILL.md](../principle-build-the-lever/SKILL.md)). Any non-trivial work. Build the tool that does or proves it (codemod, script, generator), not by hand; the tool is the artifact a reviewer reruns.

**Architecture**

- **Model the Domain** ([../principle-model-the-domain/SKILL.md](../principle-model-the-domain/SKILL.md)). Writing stateful logic, or code that branches a lot or repeats a shape assumption across files. Encode the domain in a structure (state machine, typed model, table or registry, reducer, boundary, the right collection) instead of scattered conditionals.
- **Boundary Discipline** ([../principle-boundary-discipline/SKILL.md](../principle-boundary-discipline/SKILL.md)). Wiring validation, error handling, or framework adapters. Guards at system boundaries, trust internal types, keep business logic pure.
- **Type System Discipline** ([../principle-type-system-discipline/SKILL.md](../principle-type-system-discipline/SKILL.md)). Designing types or a signature in any typed language. Make illegal states unrepresentable, brand primitives, parse external data at boundaries.
- **Make Operations Idempotent** ([../principle-make-operations-idempotent/SKILL.md](../principle-make-operations-idempotent/SKILL.md)). Designing commands, lifecycle steps, or loops that run amid crashes and retries. Converge to the same end state.
- **Migrate Callers Then Delete Legacy APIs** ([../principle-migrate-callers-then-delete-legacy-apis/SKILL.md](../principle-migrate-callers-then-delete-legacy-apis/SKILL.md)). Introducing a new internal API while old callers exist. Migrate and delete in one wave.
- **Separate Before Serializing Shared State** ([../principle-separate-before-serializing-shared-state/SKILL.md](../principle-separate-before-serializing-shared-state/SKILL.md)). Concurrent actors might write the same file, branch, key, or object. Eliminate the sharing first.

**Verification**

- **Prove It Works** ([../principle-prove-it-works/SKILL.md](../principle-prove-it-works/SKILL.md)). After a task, before declaring done. Verify against the real artifact, not a proxy or "it compiles".
- **Fix Root Causes** ([../principle-fix-root-causes/SKILL.md](../principle-fix-root-causes/SKILL.md)). Debugging. Trace each symptom to its root cause, reproduce first, ask why until you reach it.
- **Sequence Work into Verifiable Units** ([../principle-sequence-verifiable-units/SKILL.md](../principle-sequence-verifiable-units/SKILL.md)). Multi-step work (sweeps, migrations, runs of similar edits) and how you stack commits and PRs. Break work into small units that each end in a check, verify each before the next, and order delivery so the sequence proves itself.

**Delegation**

- **Guard the Context Window** ([../principle-guard-the-context-window/SKILL.md](../principle-guard-the-context-window/SKILL.md)). Context fills up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents, keep summaries in the main thread.
- **Never Block on the Human** ([../principle-never-block-on-the-human/SKILL.md](../principle-never-block-on-the-human/SKILL.md)). Tempted to ask "should I do X?" on reversible work. Proceed, present the result, let the human course-correct.

**Meta**

- **Encode Lessons in Structure** ([../principle-encode-lessons-in-structure/SKILL.md](../principle-encode-lessons-in-structure/SKILL.md)). You catch yourself writing the same instruction a second time. Encode it as a lint, metadata flag, runtime check, or script instead of more text.
