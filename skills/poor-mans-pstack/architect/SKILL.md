---
name: architect
description: "Sketch types, signatures, and module structure before code, then stay in the loop while implementation fills in. Budget port of pstack's architect for a single Claude subscription. Use for /architect, 'architect this', 'design this', or non-trivial work where jumping to code would lock in the wrong shape."
---

# Architect

Design before implementing. Sketch types, function signatures, class shapes, and module boundaries with `not implemented` bodies and pseudocode; fill in code against the chosen sketch. If implementation proves the sketch wrong, throw it out and redesign.

Open a todolist with one entry per phase: Ground, Sketch, Agree, Implement, Scrap.

## Phase A: Ground the problem

Build a real mental model of every system the new code touches: run the **how** skill over the relevant subsystems (Critique mode if existing structure is the constraint). Naming a file isn't grounding; produce the traced model. If the design redefines ownership or layering, also run the **why** skill on the existing shape so the rationale becomes a constraint, not a guess. Skip Phase A only for genuinely greenfield work with no surrounding system.

## Phase B: Sketch

Run the **arena** skill in its default sketch mode with the Phase A grounding. Require at least two structurally distinct candidates, even when the first looks sufficient; this is **principle-exhaust-the-design-space** made concrete. Whole-shape alternatives, not point fixes inside one shape. Each candidate follows [`references/candidate-checklist.md`](references/candidate-checklist.md) and ships a package shaped per [`references/rationale-template.md`](references/rationale-template.md).

Screen every candidate against [`references/design-red-flags.md`](references/design-red-flags.md) before synthesis: reject or revise shallow modules, information leakage, temporal decomposition, pass-through methods. Compare viable candidates on interface depth; prefer the design that hides more complexity behind a smaller public surface.

## Phase C: Agree (opt-in)

Default: proceed directly to implementation with the synthesized design; no human checkpoint. Opt in when the invoker asks ("with checkpoint", "show me before implementing"). The synthesis can ship as its own commit either way: the scaffold-first mode of **principle-foundational-thinking**, with later commits filling in bodies against a stable contract. Planned, scoped breakage during fill-in is fine per **principle-outcome-oriented-execution**. For adversarial pressure on the design before implementing, run the **interrogate** skill on the sketch. If the human pushes back on the shape, treat it as Phase A evidence: re-ground and re-run Phase B.

## Phase D: Implement against the sketch

Replace `not implemented` bodies with code, pseudocode with logic. The sketch is the contract. Deviations are signal worth surfacing, not friction to absorb silently: if a function needs a parameter the sketch didn't anticipate, ask whether the sketch was wrong, the requirement was missed, or the implementation is overreaching. Surface it; don't bolt it on.

## Phase E: Scrap when the architecture is wrong

If implementation keeps producing friction the sketch can't absorb, throw the sketch out; don't bolt fixes onto a wrong design (**principle-redesign-from-first-principles**, **principle-fix-root-causes**). The signal is a *pattern*, not single instances:

- The same shape of workaround appearing repeatedly across unrelated code.
- Multiple unrelated edge cases that all need special-case branches.
- Types that need escape hatches (`any`, casts, optional fields always set in practice) to compile.
- The "we need a lock" reflex when the sketch said the state wasn't shared.
- Callers having to know the abstraction's internal rules to use it.
- Two or more independent Phase D deviations of the same shape.

Use judgment: a few edge cases don't condemn an architecture, and complexity in the data is not complexity in the design. When you scrap: re-ground over what's been built (the implementation lessons enter the new design as inputs), redesign as if the new constraints had been day-one assumptions, subtract before adding (**principle-subtract-before-you-add**), and return to Phase B.

## Outputs

The caller's usage written first and the type sketch derived from it. One file with new types and signatures for small changes; module map plus type definitions for larger work. The rationale ships alongside per [`references/rationale-template.md`](references/rationale-template.md), including the usage sketch and the synthesis decision.
