---
name: setup-poor-mans-pstack
description: "Configure the model tiers the poor-mans-pstack skills use for subagents. Detects your available Claude models and writes a per-role override sheet at ~/.claude/poor-mans-pstack-models.md, wired in from your CLAUDE.md. Use for /setup-poor-mans-pstack or requests to change which models the poor-mans skills spawn."
---

# Setup poor-mans-pstack

Write `~/.claude/poor-mans-pstack-models.md`, a per-role model override sheet you include from your global `CLAUDE.md`. The **poor-mans-orchestration** skill names each role's default inline; this override sheet adapts those defaults to the models you actually have access to. Unlike pstack's multi-model panels, every poor-mans role takes a single model and fan-out never exceeds two subagents, so there are no panel lists here.

Claude Code has no auto-applied "rules" mechanism. Inclusion is explicit: the user adds a line to `~/.claude/CLAUDE.md` (or a project `CLAUDE.md`) such as:

```text
@~/.claude/poor-mans-pstack-models.md
```

so the sheet loads as context for every session.

## Steps

### 1. Detect available models

Enumerate the model slugs you can pass to an `Agent` subagent in this session; that is the dependable source. The Claude models in play are listed in [Models](#models) below. Ask the user to confirm or paste any extra slugs they want available. Never write a real slug you have not confirmed is available. The aliases `inherit-parent` and `auto` are always valid even though they are not detected slugs; both mean the role runs on the parent session's model, which the `Agent` call expresses by omitting `model`.

### 2. Load current state

The default role-to-model mapping is the shape in step 5. If `~/.claude/poor-mans-pstack-models.md` already exists, read it and treat its values as the current choices. Otherwise start from the defaults.

### 3. Map and confirm

Show every role with its current model, marking any real slug not in the detected set as needing a choice. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` and `auto` as the options. Prefer `AskUserQuestion` over free text. Say the tradeoff in one line each: a higher tier reasons better and drains the usage limit faster. Every poor-mans role is a single model, not a panel list.

### 4. Validate

Every real slug written must be in the detected set; `inherit-parent` and `auto` always pass. If a chosen real slug is not available, stop and ask again.

### 5. Write the override sheet

Write `~/.claude/poor-mans-pstack-models.md` with the shape below. Overwrite the whole file so re-runs stay idempotent.

```markdown
# poor-mans-pstack model configuration

Per-role model overrides for the poor-mans-pstack skills. The poor-mans-orchestration skill names each role's default; the values here override it. Delete a line to fall back to the default. A value of `inherit-parent` or `auto` runs that role on the parent session's model (the `Agent` call omits `model`). The explorer, investigator, runner, and reviewer roles serve the utility skills (how, why, arena, architect, interrogate); feature, refactoring, and bug-fix are the per-playbook implementation tiers. Judgment stays in the main session and has no line here.

explorer: claude-sonnet-5
investigator: claude-opus-4-8
runner: claude-sonnet-5
reviewer: claude-opus-4-8
feature: claude-opus-4-8
refactoring: claude-opus-4-8
bug-fix: claude-opus-4-8
```

### 6. Wire it in

If `~/.claude/CLAUDE.md` does not already include the sheet, append the `@~/.claude/poor-mans-pstack-models.md` line so it loads on every session. If the user prefers project scope, add the include to the project's `CLAUDE.md` instead.

### 7. Confirm

Tell the user where the sheet was written and how it loads (via the `@` include in CLAUDE.md). Re-running this skill updates the sheet. Only write model slugs that resolve on the Agent tool; when unsure, tell the user the slug is validated on first spawn and self-corrected per the orchestration skill's fallback rule.

## Models

- Available Claude models: Opus 5 (`claude-opus-5`), Opus 4.8 (`claude-opus-4-8`), Fable 5 (`claude-fable-5`), Sonnet 5 (`claude-sonnet-5`), Haiku 4.5 (`claude-haiku-4-5`)
- Utility-skill role defaults: explorer `claude-sonnet-5`, investigator `claude-opus-4-8`, runner `claude-sonnet-5`, reviewer `claude-opus-4-8`
- Per-playbook implementation tiers: feature, refactoring, and bug-fix each default to `claude-opus-4-8`, one line per playbook so you can tune them apart
- Judgment (synthesis, picking, verdicts) has no configurable line: it stays in the main session per the poor-mans-orchestration Judge inline doctrine
