---
name: poor-mans-orchestration
description: "Budget orchestration rules for the poor-mans-pstack skills on a single Claude subscription. Read before any poor-mans-pstack skill spawns a subagent: inline-first doctrine, role-to-tier model defaults, delegation defaults, reduced-diversity disclosure, escalation rule."
user-invocable: false
---

# Poor man's orchestration

pstack's skills fan out multi-model panels (3+ agents on Opus-tier models per invocation, 8-20 for architect). On a single Claude subscription that volume drains usage limits fast. These rules keep the same disciplines at a fraction of the cost.

## Doctrine

1. **Inline first.** The main session does the work by default. A subagent exists for exactly two reasons: keeping bulk reads out of the main context (**principle-guard-the-context-window**), or an independent second pass whose value depends on not sharing your reasoning. Never spawn to "parallelize" work you could do in sequence for the same tokens.
2. **Tier down.** Search-bound and read-bound roles do not need frontier reasoning. Spend the cheap tiers on volume and keep judgment in the main session.
3. **Judge inline.** Synthesis, picking, and lead judgment stay in the main session; its model is already the strongest one configured. Do not spawn judge or synthesizer agents at default budget.
4. **Disclose reduced diversity.** pstack's panels get signal from independent models. A one-reviewer-plus-own-pass setup is weaker; verdicts say so plainly ("diversity reduced: two same-family passes") so the reader can weight accordingly.
5. **Escalate deliberately.** Bump a panel to 2-3 parallel reviewer subagents only when the user asks for it or the stakes are irreversible (security-sensitive, data loss, hard-to-revert migrations). Name the escalation and its reason.

## Roles and default tiers

| Role | Used by | Default model |
|---|---|---|
| explorer (bulk code reading) | how, maintain-verification-skill | `claude-sonnet-5` |
| investigator (evidence search per MCP) | why | `claude-opus-4-8` |
| runner (candidate sketch generation) | arena, architect | `claude-sonnet-5` |
| reviewer (critique, adversarial review) | interrogate, how critique | `claude-opus-4-8` |
| feature (delegated implementation) | Feature playbook | `claude-opus-4-8` |
| refactoring (delegated implementation) | Refactoring playbook | `claude-opus-4-8` |
| bug-fix (delegated implementation) | Bug fix playbook | `claude-opus-4-8` |

The implementation tiers are playbook-specific, one per playbook that delegates code-writing, so you can tune them apart the way upstream pstack keeps a per-playbook model line. Implementation is judgment-heavy, so `feature`, `refactoring`, and `bug-fix` default to `claude-opus-4-8` rather than a cheap tier; a delegated implementer also keeps a large diff's reads and edits out of the main context (**principle-guard-the-context-window**). Tier one down only for a delegate doing purely mechanical edits (a scripted rename sweep, for example). Judgment (synthesis, picking, verdicts) has no tier and no configurable line: it stays in the main session per the Judge inline doctrine above.

A role line in `~/.claude/poor-mans-pstack-models.md` overrides the default; the `setup-poor-mans-pstack` skill writes that sheet. A missing line keeps the default. A value of `inherit-parent` or `auto` means omit `model` on the `Agent` call. If a slug is rejected as unresolvable, pick the closest valid slug from the Agent tool's error message and continue; fix the sheet afterward, don't block.

## Delegation defaults

Every `Agent` call: `run_in_background: true`; file pointers instead of inlined content; `readonly: true` for exploration and review roles. You own every subagent's work: read its actual output artifact, not its summary (**principle-prove-it-works**), and write your own synthesis. Give each concurrent agent its own output path (**principle-separate-before-serializing-shared-state**). Rather than resuming an interrupted subagent, fire a fresh one with consolidated scope.
