---
name: setup-poor-mans-pstack
description: "Configure the models and effort levels the poor-mans-pstack skills use for subagents. Writes a per-role sheet at ~/.claude/poor-mans-pstack-models.md, wired in from your CLAUDE.md, and generates one pstack-* Claude Code agent definition per model and effort the sheet names. Use for /setup-poor-mans-pstack or requests to change which models the poor-mans skills spawn."
---

# Setup poor-mans-pstack

Write `~/.claude/poor-mans-pstack-models.md`, a per-role sheet you include from your global `CLAUDE.md`, and generate the Claude Code agent definitions it names. The **poor-mans-orchestration** skill names each role's default inline; the sheet adapts those defaults to the models you have access to. The role keys follow upstream pstack's granular per-skill convention (`how explorer`, `why investigators`, `arena runners`, `architect runners`, `interrogate reviewers`, and so on), so each skill reads its own line. A **panel** key (`arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`) takes a comma-separated list and spawns one subagent per entry; every other key takes a single value. This is where cost is tuned: a shorter panel, a cheaper model, or a lower effort costs less per invocation.

## Why agent definitions

The `Agent` tool's `model` parameter accepts only the aliases `sonnet`, `opus`, `haiku`, and `fable`, so a call cannot pin Opus 4.8 next to Opus 5 or choose an effort level. An agent definition can: its frontmatter `model:` takes a full model ID and `effort:` takes `low`, `medium`, `high`, `xhigh`, or `max`. So every sheet value is the name of a generated agent, and the skills spawn it as `subagent_type` without passing `model`.

## Agent names

A generated agent is named `pstack-<model>-<effort>[-ro]`, where `<model>` is the model ID without its `claude-` prefix:

- `pstack-opus-4-8-high` runs `claude-opus-4-8` at `high` effort.
- `pstack-haiku-4-5-20251001-low` runs `claude-haiku-4-5-20251001` at `low` effort.
- `pstack-opus-4-8` (no effort segment) runs `claude-opus-4-8` at the model's default effort.
- A trailing `-ro` makes the agent read-only: `disallowedTools: Edit, Write, NotebookEdit`. Bash stays available, so `-ro` stops accidental edits but is not a sandbox. Add `-ro` to a role only when the user asks for read-only subagents during setup.

To parse a name, strip `pstack-`, then a trailing `-ro`, then a trailing `-low`, `-medium`, `-high`, `-xhigh`, or `-max` as the effort; what remains, prefixed with `claude-`, is the model ID. Model IDs end in digits, so the split is unambiguous.

The `pstack-` prefix marks the files this skill owns. Setup deletes stale `pstack-*.md` files and never touches another agent definition.

## Steps

### 1. Detect available models

The Claude models in play are listed in [Models](#models) below. Ask the user to confirm them or paste extra model IDs they want. Do not infer availability from the `Agent` tool's `model` values: an agent definition reaches models those aliases cannot. The values `inherit-parent` and `auto` are always valid and generate no agent; both mean the role runs on the parent session's model.

### 2. Load current state

The default role-to-agent mapping is the shape in step 5. If `~/.claude/poor-mans-pstack-models.md` already exists, read it and treat its values as the current choices. A value in the old bare-model form (`claude-opus-4-8`) maps to `pstack-opus-4-8`; show it as needing an effort. Otherwise start from the defaults.

### 3. Map and confirm

Show every role with its current agent (a panel key shows its full list), marking any model not confirmed in step 1 as needing a choice. Ask whether to accept as-is or change specific roles, offering the confirmed models and the five effort levels, plus `inherit-parent` and `auto`. For a panel key, let the user set the whole list, including its length: fewer entries means fewer subagents per invocation. Do not ask about read-only; apply `-ro` only to roles the user names. Prefer `AskUserQuestion` over free text. Say each tradeoff in one line: a higher model, a higher effort, or a longer panel reasons better and drains the usage limit faster.

### 4. Validate

For each distinct agent name the choices use, probe it once in a headless run before writing anything:

```bash
claude -p --agents '{"<name>":{"description":"probe","prompt":"Reply with one line: your model ID and your reasoning effort level.","model":"<model ID>","effort":"<effort>"}}' \
  'Spawn the <name> subagent with the Agent tool (subagent_type <name>, no model). Print its reply verbatim, then any error on a second line.' < /dev/null
```

Omit `"effort"` for a name with no effort segment. The probe passes when the reply names the expected model ID. An invalid effort fails before anything runs (`Invalid --agents configuration`). If a probe fails, stop and ask again for that role.

### 5. Write the sheet

Write `~/.claude/poor-mans-pstack-models.md` with the shape below. Overwrite the whole file so re-runs stay idempotent.

```markdown
# poor-mans-pstack model configuration

Per-role agents for the poor-mans-pstack skills. The poor-mans-orchestration skill names each role's default; the values here override it. Delete a line to fall back to the default. Each value names a `pstack-<model>-<effort>[-ro]` agent definition that `/setup-poor-mans-pstack` generates; a skill spawns it with `subagent_type` set to that name and no `model`. A panel key (`arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`) is a comma-separated list, one subagent per entry; every other key is a single agent. A value of `inherit-parent` or `auto` (a whole single-agent line, or one panel entry) spawns `general-purpose` with no `model`, on the parent session's model. The keys follow upstream pstack's per-skill convention: `how`, `why`, `arena`, `architect`, and `interrogate` name their own roles; `no-comments` and `maintain-verification-skill` name theirs; `feature`, `refactoring`, and `bug-fix` are the per-playbook implementation tiers. Interrogate's lead judgment stays in the main session, so it has no line. Edit this file by re-running `/setup-poor-mans-pstack`, which regenerates the agents to match.

how explorer: pstack-sonnet-5-high
how explainer: pstack-opus-5-5-high
why investigators: pstack-sonnet-5-high
why synthesizer: pstack-opus-5-5-high
arena runners: pstack-sonnet-5-high, pstack-fable-5-1-high, pstack-opus-5-5-high
arena cross-judge pool: pstack-sonnet-5-high, pstack-opus-5-5-high
architect runners: pstack-fable-5-1-high, pstack-opus-5-5-high
interrogate reviewers: pstack-opus-5-5-high, pstack-sonnet-5-high
no-comments reviewer: pstack-sonnet-5-high
maintain-verification readers: pstack-sonnet-5-high
feature: pstack-opus-5-5-medium
refactoring: pstack-opus-5-5-medium
bug-fix: pstack-opus-5-5-medium
```

### 6. Generate the agents

Write one agent definition per distinct `pstack-*` name in the sheet into `~/.claude/agents/<name>.md` (the project's `.claude/agents/` when the user chose project scope in step 7). Use this shape, dropping `effort:` for a name with no effort segment and `disallowedTools:` for a name without `-ro`:

```markdown
---
name: pstack-opus-4-8-high-ro
description: poor-mans-pstack subagent on claude-opus-4-8 at high effort, read-only. Spawned by the poor-mans-pstack skills; not for general use.
model: claude-opus-4-8
effort: high
disallowedTools: Edit, Write, NotebookEdit
---
You are a subagent spawned by a poor-mans-pstack skill. The task prompt is complete: follow it, write output only where it names, and end with the report it asks for.
```

Leave out `tools:`, so the agent keeps every other tool, MCP tools included. Keep the body short: it replaces the general-purpose agent's system prompt, and every generated agent is listed in each session's system prompt. Generate only the names the sheet uses, never every model and effort combination.

Then delete every `pstack-*.md` in that directory the sheet no longer names. Re-running with the same sheet changes nothing.

### 7. Wire it in

If `~/.claude/CLAUDE.md` does not already include the sheet, append the `@~/.claude/poor-mans-pstack-models.md` line so it loads on every session. If the user prefers project scope, add the include to the project's `CLAUDE.md` instead and generate the agents into the project's `.claude/agents/`.

### 8. Confirm

Tell the user where the sheet and the agents were written, that the sheet loads through the `@` include in `CLAUDE.md`, and that agent definitions load at session start: the new agents are spawnable only in a new session. Re-running this skill updates both.

## Models

- Available Claude models: Opus 5.5 (`claude-opus-5-5`), Opus 5 (`claude-opus-5`), Opus 4.8 (`claude-opus-4-8`), Fable 5.1 (`claude-fable-5-1`), Sonnet 5 (`claude-sonnet-5`), Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Effort levels: `low`, `medium`, `high`, `xhigh`, `max`. Every default runs at `high` except the implementation tiers, which run at `medium`
- Single-agent read/search roles default to the cheap model: `how explorer`, `why investigators`, `no-comments reviewer`, and `maintain-verification readers` each `pstack-sonnet-5-high`
- Single-agent drafting roles: `how explainer` and `why synthesizer` each `pstack-opus-5-5-high`
- Panel defaults: `arena runners` is `pstack-sonnet-5-high, pstack-fable-5-1-high, pstack-opus-5-5-high`; `arena cross-judge pool` is `pstack-sonnet-5-high, pstack-opus-5-5-high`; `architect runners` is `pstack-fable-5-1-high, pstack-opus-5-5-high`; `interrogate reviewers` is `pstack-opus-5-5-high, pstack-sonnet-5-high`. On one subscription these are distinct tiers, not distinct families, so a panel buys tier diversity, not model-family diversity
- Interrogate's lead judgment and arena's Phase D pick have no line; they run in the main session
- Per-playbook implementation tiers: feature, refactoring, and bug-fix each default to `pstack-opus-5-5-medium`, one line per playbook so you can tune them apart
- No default is read-only; `-ro` appears only where the user asked for it
