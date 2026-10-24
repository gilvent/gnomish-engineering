# pstack to bpstack

Upstream pstack skills use Cursor names. When you sync or port an upstream skill into bpstack, map each Cursor name with the tables below and write the Claude Code form into the bpstack skill. `<pstack>` means the folder that holds `skills/` and `docs/`. This file is a porting guideline only: no bpstack skill mentions or links to it.

## Tools

| Cursor | Claude Code |
| --- | --- |
| `Task` | `Agent` |
| `Grep`, `Glob` | `Bash` with `rg` when the session has no `Grep` or `Glob`. |

## Subagent fields

| Cursor | Claude Code |
| --- | --- |
| `subagent_type: generalPurpose` | The `bpstack-<model>-<effort>` agent that the role's line in the sheet names, as `subagent_type`, with no `model`. A line of `inherit-parent` or `auto` spawns `general-purpose` with no `model`. |
| `poteto-agent` | The `bpstack-baked-poteto-<model>-<effort>` agent that the playbook's `feature`, `refactoring`, or `bug-fix` line names. A helper in a playbook with no line of its own uses the `feature` line. |
| `comment-sicko` | The `bpstack-comment-sicko-<model>-<effort>` agent that the `no-comments reviewer` line names. |
| `environment: "cloud"` | `isolation: "worktree"`. Name the branch or commit the worker checks out. |
| `environment: "local"` | Omit. |

## Models

| Cursor | Claude Code |
| --- | --- |
| `claude-<family>-<version>-<effort>[-fast]`, such as `claude-opus-5-5-xhigh` | The generated agent `bpstack-<family>-<version>-<effort>`, as `subagent_type`, with no `model`. A playbook role takes the `baked-poteto-` segment and `no-comments reviewer` takes `comment-sicko-`. Drop `-fast`. |
| A `grok-*`, `gpt-*`, or other non-Claude slug | The role's bpstack default in the Models section of `setup-bpstack`. A new role gets a Claude default there. |
| `auto` or `inherit-parent` | `general-purpose` with no `model`, on the parent session's model. |
| The `pstack-models.mdc` rule, `~/.cursor/rules/pstack-models.mdc` | The sheet, `~/.claude/bpstack-models.md`. The `@~/.claude/bpstack-models.md` line in `~/.claude/CLAUDE.md` loads it into every session. If the sheet or the role's line is missing, use the skill's default. |
| A role value `<model> <effort>`, such as `opus high` | An agent name, `bpstack-[<template>-]<model>-<effort>[-ro]`, such as `bpstack-opus-5-5-high`. A panel key takes a comma-separated list of names. |

## setup-bpstack

`setup-bpstack` replaces `setup-pstack`. The `Agent` tool's `model` takes only the aliases `opus`, `sonnet`, `haiku`, and `fable`, so a spawn cannot pin a model ID. Its `effort` parameter is only for an effort the user explicitly asks for on that spawn, so it cannot carry a per-role effort either. An agent definition pins both, so bpstack generates one per model and effort it uses:

- The sheet, `~/.claude/bpstack-models.md`, has one line per role. Each value is an agent name. A panel key (`arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`) takes a comma-separated list, one subagent per entry.
- `setup-bpstack` writes one `~/.claude/agents/<name>.md` per distinct name in the sheet. The name is `bpstack-[<template>-]<model>-<effort>[-ro]`, and its frontmatter pins the full model ID and the effort. The template segment picks the body: none for general-purpose, `baked-poteto` for the playbook roles, `comment-sicko` for the `no-comments reviewer`. `-ro` adds `disallowedTools: Edit, Write, NotebookEdit`.
- A skill reads its role's line and spawns that name as `subagent_type`, never passing `model`.
- Agent definitions load at session start, so a new or changed agent is spawnable only in a new session.

Follow `setup-pstack` with these changes:

- Detect. The models are the list in the Models section of `setup-bpstack`, confirmed by the user. Do not read them from the `Agent` tool schema.
- Budget. There is no budget step. Each role's effort is part of its agent name.
- Roles. When an upstream skill adds or renames a role, add its key to the sheet shape in step 5, its default to the Models section, and its row to the Agent templates table of `setup-bpstack`.
- Write. Write the sheet to `~/.claude/bpstack-models.md` and include it from `~/.claude/CLAUDE.md`, not `~/.claude/rules/`.

## Paths

| Cursor | Claude Code |
| --- | --- |
| `.cursor/skills/`, `~/.cursor/skills/` | `.claude/skills/`, `~/.claude/skills/` |
| `~/.cursor/plugins/`, `.cursor-plugin/plugin.json` | `~/.claude/plugins/`, `.claude-plugin/plugin.json` |
| `.cursor/rules/*.mdc`, always-applied rules | `CLAUDE.md`, or `AGENTS.md` when no `CLAUDE.md` exists. Claude Code never reads `.mdc` files. The model rule is the exception. See Models. |
| `https://github.com/cursor/plugins/blob/main/pstack/<path>` | `<pstack>/<path>` when that file exists. The plugin ships the skills, `docs/guide/`, and `README.md`. Read the local copy and never fetch it. Give the user the URL when they need a link. |
| Transcripts in `~/.cursor/projects/<slug>/agent-transcripts/` | `~/.claude/projects/<slug>/<session>.jsonl`. The slug is the workspace path with each `/` and `.` changed to `-`, so `/Users/you/proj` is `-Users-you-proj`. The newest `.jsonl` directly in that folder is the current session. Its `<session>/subagents/` folder holds subagent transcripts. Read only this workspace's folder. |

## Cursor-only features

| Cursor | Claude Code |
| --- | --- |
| Bugbot | Bugbot comments on a GitHub PR are ordinary review threads, so triage them with the forge command that the step gives. Skip a step that starts, waits for, or configures Bugbot when the PR has no Bugbot check or comment. |
| Cursor cloud agents | `general-purpose` with no `model` and `isolation: "worktree"`, so the agent runs on the session's model and effort in its own worktree. Name the branch or commit it checks out. A Cursor cloud agent is never a baked-poteto delegate. Skip a step that needs the cloud agent itself, such as its dashboard status or its own machine. |
