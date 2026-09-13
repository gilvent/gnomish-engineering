---
name: setup-poor-mans-pstack
description: "Configure the model tiers the poor-mans-pstack skills use for subagents. Detects your available Claude models and writes a per-role override sheet at ~/.claude/poor-mans-pstack-models.md, wired in from your CLAUDE.md. Use for /setup-poor-mans-pstack or requests to change which models the poor-mans skills spawn."
---

# Setup poor-mans-pstack

Write `~/.claude/poor-mans-pstack-models.md`, a per-role model override sheet you include from your global `CLAUDE.md`. The **poor-mans-orchestration** skill names each role's default inline; this override sheet adapts those defaults to the models you actually have access to. The role keys follow upstream pstack's granular per-skill convention (`how explorer`, `why investigators`, `arena runners`, `architect runners`, `interrogate reviewers`, and so on), so each skill reads its own line. A **panel** key (`arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`) takes a comma-separated list of models and spawns one subagent per entry; every other key takes a single model. This is where cost is tuned: a shorter panel or a cheaper tier costs less per invocation.

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

Show every role with its current model (a panel key shows its full list), marking any real slug not in the detected set as needing a choice. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` and `auto` as the options. For a panel key, let the user set the whole list, including its length: fewer entries means fewer subagents per invocation. Prefer `AskUserQuestion` over free text. Say the tradeoff in one line each: a higher tier or a longer panel reasons better and drains the usage limit faster.

### 4. Validate

Every real slug written must be in the detected set; `inherit-parent` and `auto` always pass. If a chosen real slug is not available, stop and ask again.

### 5. Write the override sheet

Write `~/.claude/poor-mans-pstack-models.md` with the shape below. Overwrite the whole file so re-runs stay idempotent.

```markdown
# poor-mans-pstack model configuration

Per-role model overrides for the poor-mans-pstack skills. The poor-mans-orchestration skill names each role's default; the values here override it. Delete a line to fall back to the default. A panel key (`arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`) is a comma-separated list, one subagent per entry; every other key is a single model. A value of `inherit-parent` or `auto` (a whole single-model line, or one panel entry) runs on the parent session's model (the `Agent` call omits `model`). The keys follow upstream pstack's per-skill convention: `how`, `why`, `arena`, `architect`, and `interrogate` name their own roles; `no-comments` and `maintain-verification-skill` name theirs; `feature`, `refactoring`, and `bug-fix` are the per-playbook implementation tiers. Interrogate's lead judgment stays in the main session, so it has no line.

how explorer: claude-sonnet-5
how explainer: claude-opus-4-8
why investigators: claude-sonnet-5
why synthesizer: claude-opus-4-8
arena runners: claude-opus-4-8, claude-sonnet-5
arena cross-judge pool: claude-opus-4-8, claude-sonnet-5
architect runners: claude-fable-5-1, claude-opus-4-8
interrogate reviewers: claude-opus-5, claude-opus-4-8
no-comments reviewer: claude-sonnet-5
maintain-verification readers: claude-sonnet-5
feature: claude-opus-4-8
refactoring: claude-opus-4-8
bug-fix: claude-opus-4-8
```

### 6. Wire it in

If `~/.claude/CLAUDE.md` does not already include the sheet, append the `@~/.claude/poor-mans-pstack-models.md` line so it loads on every session. If the user prefers project scope, add the include to the project's `CLAUDE.md` instead.

### 7. Confirm

Tell the user where the sheet was written and how it loads (via the `@` include in CLAUDE.md). Re-running this skill updates the sheet. Only write model slugs that resolve on the Agent tool; when unsure, tell the user the slug is validated on first spawn and self-corrected per the orchestration skill's fallback rule.

## Models

- Available Claude models: Opus 5 (`claude-opus-5`), Opus 4.8 (`claude-opus-4-8`), Fable 5.1 (`claude-fable-5-1`), Sonnet 5 (`claude-sonnet-5`), Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Single-model read/search roles default to the cheap tier: `how explorer`, `why investigators`, `no-comments reviewer`, and `maintain-verification readers` each `claude-sonnet-5`
- Single-model drafting roles: `how explainer` and `why synthesizer` each `claude-opus-4-8`
- Panel keys each default to a two-model list: `arena runners` and `arena cross-judge pool` each `claude-opus-4-8, claude-sonnet-5`; `architect runners` `claude-fable-5-1, claude-opus-4-8`; `interrogate reviewers` `claude-opus-5, claude-opus-4-8`. On one subscription these are distinct tiers, not distinct families, so the panel buys tier diversity, not model-family diversity
- Interrogate's lead judgment and arena's Phase D pick have no line; they run in the main session
- Per-playbook implementation tiers: feature, refactoring, and bug-fix each default to `claude-opus-4-8`, one line per playbook so you can tune them apart
