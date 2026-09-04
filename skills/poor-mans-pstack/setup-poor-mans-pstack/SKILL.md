---
name: setup-poor-mans-pstack
description: "Configure the model tiers the poor-mans-pstack skills use for subagents. Writes the per-role override sheet at ~/.claude/poor-mans-pstack-models.md. Use for /setup-poor-mans-pstack or requests to change which models the poor-mans skills spawn."
---

# Setup poor-mans-pstack

Writes the role-to-model override sheet that the **poor-mans-orchestration** skill reads. Roles and defaults live in that skill's table; this skill only manages the overrides.

1. Read `~/.claude/poor-mans-pstack-models.md` if it exists and show the user the current values next to the defaults (explorer and investigator: `claude-haiku-4-5`; runner and reviewer: `claude-sonnet-5`; judgment: `inherit-parent`).
2. Apply the changes the user asked for. If they invoked this with no specific change, ask which roles to adjust, offering the tradeoff in one line each: higher tiers reason better and drain the usage limit faster.
3. Write the sheet, one `role: model` line per override:

```markdown
# poor-mans-pstack model configuration
# A role line overrides the default in the poor-mans-orchestration skill.
# Delete a line to fall back. inherit-parent / auto = run on the main session's model.
explorer: claude-haiku-4-5
investigator: claude-haiku-4-5
runner: claude-sonnet-5
reviewer: claude-sonnet-5
judgment: inherit-parent
```

4. Confirm what changed. Only write model slugs that resolve on the Agent tool; when unsure, tell the user the slug will be validated on first spawn and self-corrected per the orchestration skill's fallback rule.
