---
name: poor-mans-orchestration
description: "Model-tier map and delegation defaults for the poor-mans-pstack skills on a single Claude subscription. Read before any poor-mans-pstack skill spawns a subagent: per-skill role-to-tier defaults (matching upstream pstack's keys), panel semantics, delegation defaults, and where to tune cost."
user-invocable: false
---

# Poor man's orchestration

The `how`, `why`, `arena`, `architect`, and `interrogate` skills are ported faithfully from upstream pstack: they keep upstream's phases, multi-agent panels, parallel investigators, and delegated judgment. This skill holds the model-tier map those skills read and the delegation defaults every `Agent` call follows. Cost lives in the panel sizes and tiers below; tune them in `~/.claude/poor-mans-pstack-models.md` (written by `setup-poor-mans-pstack`). Budget guards specific to a single subscription (collapsing a panel to one tier, capping fan-out, folding a judgment step back inline) are applied per skill on review, not baked in here.

## Role keys and default tiers

The keys are per-skill, matching upstream pstack's granular convention, so each skill reads its own line. A **panel** key takes a comma-separated list of models and spawns one subagent per entry; every other key takes a single model.

| Role key | Shape | Used by | Default |
|---|---|---|---|
| `how explorer` | single | how, Step 2a explore | `claude-sonnet-5` |
| `how explainer` | single | how, Step 2b / Step 3 synthesize | `claude-opus-4-8` |
| `why investigators` | single | why, Step 3 (source control + issue tracker, plus docs when present) | `claude-sonnet-5` |
| `why synthesizer` | single | why, Step 4 | `claude-opus-4-8` |
| `arena runners` | panel | arena, Phase B | `claude-opus-4-8, claude-sonnet-5` |
| `arena cross-judge pool` | panel (pick one) | arena, Phase C | `claude-opus-4-8, claude-sonnet-5` |
| `architect runners` | panel | architect, Phase B via arena | `claude-fable-5-1, claude-opus-4-8` |
| `interrogate reviewers` | panel | interrogate, Step 3 | `claude-opus-5, claude-opus-4-8` |
| `no-comments reviewer` | single | no-comments | `claude-sonnet-5` |
| `maintain-verification readers` | single | maintain-verification-skill | `claude-sonnet-5` |
| `feature` | single | Feature playbook | `claude-opus-4-8` |
| `refactoring` | single | Refactoring playbook | `claude-opus-4-8` |
| `bug-fix` | single | Bug fix playbook | `claude-opus-4-8` |

Read-bound and search-bound roles do not need frontier reasoning, so `how explorer`, `why investigators`, `no-comments reviewer`, and `maintain-verification readers` default to the cheap `claude-sonnet-5` tier. Drafting and judgment roles (`how explainer`, `why synthesizer`) default to `claude-opus-4-8`.

The panel keys (`arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`) each default to a two-model list (see the table above). On a single subscription the entries are distinct Claude tiers, not distinct model families, so the panel buys tier diversity, not the independent-model diversity upstream's panels assume; at two entries that diversity is thinner still, and `arena runners` shares its two tiers with `arena cross-judge pool`, so the candidates and the judge that scores them are drawn from the same pool. State that reduced diversity plainly in any synthesized verdict. `arena cross-judge pool` is a panel the skill picks one entry from; the others spawn one subagent per entry.

Interrogate's lead judgment (Step 5) runs in the main session and has no line. `arena` Phase D (pick), `why` synthesis quality-check, and the parent's own review passes stay with the main session too, whose model is already configured.

The implementation tiers are playbook-specific, one per playbook that delegates code-writing, so you can tune them apart the way upstream pstack keeps a per-playbook model line. `feature`, `refactoring`, and `bug-fix` default to `claude-opus-4-8`; tier one down only for a delegate doing purely mechanical edits.

A role line in `~/.claude/poor-mans-pstack-models.md` overrides the default; a missing line keeps it. A value of `inherit-parent` or `auto` (valid for any single-model key, or as a panel entry) means omit `model` on that `Agent` call, running it on the parent session's model. If a slug is rejected as unresolvable, pick the closest valid slug from the `Agent` tool's error message and continue; fix the sheet afterward, don't block.

## Delegation defaults

Every `Agent` call: `run_in_background: true`; file pointers instead of inlined content; `readonly: true` for exploration and review roles (`readonly: false` where a role needs MCP access, as the skill states). You own every subagent's work: read its actual output artifact, not its summary (**principle-prove-it-works**), and write your own synthesis. Give each concurrent agent its own output path (**principle-separate-before-serializing-shared-state**). Rather than resuming an interrupted subagent, fire a fresh one with consolidated scope.
