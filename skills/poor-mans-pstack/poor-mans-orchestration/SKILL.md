---
name: poor-mans-orchestration
description: "Role-to-agent map and delegation defaults for the poor-mans-pstack skills on a single Claude subscription. Read before any poor-mans-pstack skill spawns a subagent: per-skill role-to-agent defaults (matching upstream pstack's keys), panel semantics, delegation defaults, and where to tune cost."
user-invocable: false
---

# Poor man's orchestration

The `how`, `why`, `arena`, `architect`, and `interrogate` skills are ported faithfully from upstream pstack: they keep upstream's phases, multi-agent panels, parallel investigators, and delegated judgment. This skill holds the role-to-agent map those skills read and the delegation defaults every `Agent` call follows. Cost lives in the panel sizes, models, and effort levels below; tune them in `~/.claude/poor-mans-pstack-models.md` (written by `setup-poor-mans-pstack`, which also generates the agents). Budget guards specific to a single subscription (collapsing a panel to one tier, capping fan-out, folding a judgment step back inline) are applied per skill on review, not baked in here.

## Role keys and default agents

The keys are per-skill, matching upstream pstack's granular convention, so each skill reads its own line. A **panel** key takes a comma-separated list of agents and spawns one subagent per entry; every other key takes a single agent.

Each value names a `pstack-<model>-<effort>[-ro]` agent definition that `setup-poor-mans-pstack` generates: `pstack-opus-4-8-high` runs `claude-opus-4-8` at `high` effort, and a trailing `-ro` removes the edit tools. An agent definition is the only way to pin a full model ID or an effort level, because the `Agent` tool's `model` parameter takes only the `sonnet`, `opus`, `haiku`, and `fable` aliases.

| Role key | Shape | Used by | Default |
|---|---|---|---|
| `how explorer` | single | how, Step 2a explore | `pstack-sonnet-5-high` |
| `how explainer` | single | how, Step 2b / Step 3 synthesize | `pstack-opus-5-5-high` |
| `why investigators` | single | why, Step 3 (source control + issue tracker, plus docs when present) | `pstack-sonnet-5-high` |
| `why synthesizer` | single | why, Step 4 | `pstack-opus-5-5-high` |
| `arena runners` | panel | arena, Phase B | `pstack-sonnet-5-high, pstack-fable-5-1-high, pstack-opus-5-5-high` |
| `arena cross-judge pool` | panel (pick one) | arena, Phase C | `pstack-sonnet-5-high, pstack-opus-5-5-high` |
| `architect runners` | panel | architect, Phase B via arena | `pstack-fable-5-1-high, pstack-opus-5-5-high` |
| `interrogate reviewers` | panel | interrogate, Step 3 | `pstack-opus-5-5-high, pstack-sonnet-5-high` |
| `no-comments reviewer` | single | no-comments | `pstack-sonnet-5-high` |
| `maintain-verification readers` | single | maintain-verification-skill | `pstack-sonnet-5-high` |
| `feature` | single | Feature playbook | `pstack-opus-5-5-medium` |
| `refactoring` | single | Refactoring playbook | `pstack-opus-5-5-medium` |
| `bug-fix` | single | Bug fix playbook | `pstack-opus-5-5-medium` |

Read-bound and search-bound roles do not need frontier reasoning, so `how explorer`, `why investigators`, `no-comments reviewer`, and `maintain-verification readers` default to the cheap `pstack-sonnet-5-high`. Drafting and judgment roles (`how explainer`, `why synthesizer`) default to `pstack-opus-5-5-high`. Every default runs at `high` effort except the implementation tiers.

The panel keys (`arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`) default to the lists in the table above: three runners for `arena runners`, two entries for the others. On a single subscription the entries are distinct Claude tiers, not distinct model families, so the panel buys tier diversity, not the independent-model diversity upstream's panels assume; at two entries that diversity is thinner still, and `arena cross-judge pool` draws both its entries from the `arena runners` models, so the judge that scores the candidates is one of the tiers that wrote them. State that reduced diversity plainly in any synthesized verdict. `arena cross-judge pool` is a panel the skill picks one entry from; the others spawn one subagent per entry.

Interrogate's lead judgment (Step 5) runs in the main session and has no line. `arena` Phase D (pick), `why` synthesis quality-check, and the parent's own review passes stay with the main session too, whose model is already configured.

The implementation tiers are playbook-specific, one per playbook that delegates code-writing, so you can tune them apart the way upstream pstack keeps a per-playbook model line. `feature`, `refactoring`, and `bug-fix` default to `pstack-opus-5-5-medium`: the main session reviews every delegate's diff, so the delegate runs at `medium` effort. Tier one down only for a delegate doing purely mechanical edits.

A role line in `~/.claude/poor-mans-pstack-models.md` overrides the default; a missing line keeps it.

## Spawning a role

Pass the role's agent name as `subagent_type` and never pass `model`: the agent definition pins the model and the effort. A value of `inherit-parent` or `auto` (valid for any single-agent key, or as a panel entry) means `subagent_type: "general-purpose"` with no `model`, running on the parent session's model.

If the named agent type is not available in this session (the session started before setup generated it, or the file was removed), spawn `general-purpose` with the nearest `model` alias for the name's model (`opus`, `sonnet`, `haiku`, or `fable`), continue, and tell the user to re-run `/setup-poor-mans-pstack` and start a new session. Don't block on it.

## Delegation defaults

Every `Agent` call: `run_in_background: true`; file pointers instead of inlined content. The `Agent` tool has no read-only flag: an exploration or review prompt says the subagent must not edit files, and only a `-ro` agent the user opted into during setup enforces it. You own every subagent's work: read its actual output artifact, not its summary (**principle-prove-it-works**), and write your own synthesis. Give each concurrent agent its own output path (**principle-separate-before-serializing-shared-state**). Rather than resuming an interrupted subagent, fire a fresh one with consolidated scope.
