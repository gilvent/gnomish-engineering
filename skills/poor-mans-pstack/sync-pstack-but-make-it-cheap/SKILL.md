---
name: sync-pstack-but-make-it-cheap
description: "Refresh the poor-mans-pstack skills against upstream pstack while re-applying every budget guard for a single Claude subscription. Use for /sync-pstack-but-make-it-cheap or a routine sync of the ported skills against the upstream pstack tree."
---

# Sync pstack, but make it cheap

Refresh poor-mans-pstack against upstream pstack, keeping every budget adaptation intact. Upstream supplies the wording, the structure, and the disciplines; the budget guards below are the invariant and win on every conflict. You are not porting upstream wholesale, you are pulling upstream improvements into the skills that are already ported and re-applying the guards.

Upstream reference: `https://github.com/cursor/plugins/tree/main/pstack/skills`. Fetch the whole tree once (a tarball or shallow clone into the scratchpad) and diff directory-to-directory locally; fetching raw files one at a time is slower and misses new reference files. Last synced against upstream revision `5bf2b15` (2026-09-12). Update that revision here when you ship a sync.

## Scope

Sync only the skills that already exist in `poor-mans-pstack/`. Do not add a new upstream skill unless the user asks for it; a new upstream skill (a new panel, a new orchestration mode) is a separate decision, not a sync. Enumerate the ported set from the directory itself so the mapping stays honest as skills are added or dropped:

```bash
ls -1 skills/poor-mans-pstack
```

Map each ported directory to its upstream counterpart before diffing:

- `baked-poteto-mode/SKILL.md` ← upstream `poteto-mode/SKILL.md` (entry skill; the port keeps only the operational core, not the full trigger list).
- `baked-poteto-mode/playbooks/<name>.md` ← upstream `poteto-mode/playbooks/<name>.md`, for the ported playbooks only (investigation, bug-fix, feature, refactoring, prototype, opening-a-pr). Upstream playbooks with no ported counterpart (babysit, shipping, orchestrate, hillclimb, swarm-driven, figure-it-out, and the rest) stay out.
- `how`, `why`, `arena`, `architect`, `interrogate` ← the upstream skill of the same name, **including its `references/` tree**. These five are faithful ports: they keep upstream's phases, panels, parallel investigators, delegated judgment, and reference files. Only the platform adaptation (guard 7) and the recorded cost guards (guards 2 and 3) separate them from upstream. `why` carries only the three source playbooks the port kept (`code-archaeology.md`, `linear.md`, `notion.md`).
- `unslop`, `no-comments`, `technical-writing`, `create-verification-skill`, `maintain-verification-skill` ← the upstream skill of the same name. `unslop` is a verbatim port and tracks upstream exactly; other skills cite its rules by number, so keep the numbering.
- `principle-*` ← upstream `principle-*` of the same name.
- `deslop` has no upstream counterpart: upstream moved it to the external `cursor-team-kit` plugin. It is port-local. Skip it and say so in the PR.
- `poor-mans-orchestration`, `setup-poor-mans-pstack`, and this skill have no upstream counterpart. They encode the budget model. The role-key convention they share does mirror upstream `setup-pstack/SKILL.md`, so diff that file for new or renamed role keys and carry those; re-derive everything else from the guards below.

## Procedure

For each ported file, run a three-way reconcile: upstream (what changed there), the current port (what you have), and the guards (what must hold).

1. Diff the current port file against its upstream counterpart. Read both in full, reference files included.
2. Pull in the genuine upstream improvements: clearer wording, a new principle, a tightened step, a corrected instruction, a new reference file.
3. For a `references/` file, copy the upstream file verbatim over the port's copy, then apply the substitutions in guard 7 with a deterministic pass (`sed` or equivalent). Do not have a subagent retype a reference file; verbatim copy plus substitution is faithful by construction. Delete a port-side reference file that upstream lacks and no ported skill names any more (the old `architect/references/candidate-checklist.md` was one).
4. Re-apply every guard in the checklist below to the merged text. A guard always wins over upstream wording.
5. Keep the port's own additions that upstream lacks (routing hints, inline principle links) only when they still serve; drop stale ones.
6. Cost review is a separate, user-driven step. After the pull, list every place the merged text spends more than before (a longer panel, a new delegated role, a new investigator category, a new loop) and let the user pick the guard for each, one at a time. Apply only the recorded guards below during the sync; do not invent a new cap, and do not silently reshape an upstream skill (the port once grew a `how critic` role upstream never had, and the fix was to re-port faithfully).

## Budget guards

Re-apply all of these on every sync. Each is a rewrite rule from upstream text to the port.

1. **Model slugs → config keys.** Replace any upstream model default (`claude-opus-5-thinking-xhigh`, `gpt-5.6-sol-max`, `grok-4.6-fast-xhigh`, or a raw `claude-*` slug) with the per-skill key: "your configured `<key>` agent (**poor-mans-orchestration** skill; set agents with `/setup-poor-mans-pstack`)", passed as `subagent_type`. A spawn block never passes `model` or `readonly`: the generated `pstack-<model>-<effort>[-ro]` agent pins the model and effort, and the `Agent` tool has no read-only flag. Where upstream reads `~/.cursor/rules/pstack-models.mdc`, the port reads `~/.claude/poor-mans-pstack-models.md` when present and falls back to the orchestration default. Key names follow upstream `setup-pstack` exactly: `how explorer`, `how explainer`, `why investigators`, `why synthesizer`, `arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers`. Never invent a key for a role upstream does not configure (there is no `how critic` and no `interrogate lead`; interrogate's lead judgment runs in the main session with no line). The port-only keys (`no-comments reviewer`, `maintain-verification readers`, `feature`, `refactoring`, `bug-fix`) stay. Defaults live in two places that must agree: the orchestration skill's role table and the setup skill's sheet template. Defaults are `pstack-*` agent names built from model IDs setup can probe (Fable is `claude-fable-5-1`, not `claude-fable-5`), all at `high` effort.
2. **Panels stay panels.** Upstream's multi-model lists remain comma-separated lists of agents, one subagent per entry (`arena cross-judge pool` picks one entry). Cost is tuned by list length, model, and effort in the sheet, not by rewriting the skill to a single tier. Defaults: `arena runners` is `pstack-opus-4-8-high, pstack-sonnet-5-high, pstack-opus-5-high`; `arena cross-judge pool` is `pstack-opus-4-8-high, pstack-opus-5-high`; `architect runners` is `pstack-fable-5-1-high, pstack-opus-4-8-high`; `interrogate reviewers` is `pstack-opus-5-high, pstack-opus-4-8-high`. Keep the disclaimer that on one subscription a panel buys tier diversity, not the model-family diversity upstream assumes, and that a synthesized verdict must say so. Judgment roles delegate the way upstream does (`how explainer`, `why synthesizer`, the arena cross-judge); a value of `inherit-parent` on such a key folds that step back into the main session.
3. **`why` roster capped at three categories.** Source control always runs; the issue-tracker investigator runs when a matching MCP is present; the long-form-documents investigator runs only when a docs MCP is present. Upstream's other categories (real-time chat, infrastructure observability, error tracking, product analytics warehouse) and the cross-cutting incident-postmortem lens stay out, along with their source playbooks (`slack.md`, `datadog.md`, `sentry.md`, `databricks.md`, `incident-postmortem.md`). Propagate the cap everywhere the roster is enumerated: the skill description, the discovery step, the source-playbook index, the investigator prompt, and the synthesizer's "Sources Consulted" template and worked examples, so a synthesized answer never claims it skipped a source the port dropped.
4. **No fan-out for implementation work.** Feature implementation, refactoring edits, bug fixes, and prototyping keep one owner: the main session inline, or a single delegate. Parallel subagents belong to the utility skills' exploration and review roles, sized by guards 2 and 3.
5. **No swarms.** Drop the swarm skill and every reference to it (coverage matrices, races, gauntlets). If an upstream step needs breadth a swarm would give, narrow the scope or hand the breadth back to the user.
6. **Guard long loops.** Any upstream instruction to run a loop, an autonomous run, or a repeated unattended pass gets a pause-and-warn wrapper: tell the user the expected cost and get a go-ahead first. A session override ("don't stop", "run until done") is that go-ahead.
7. **Cursor mechanisms → Claude Code.** Apply this substitution table to SKILL.md and reference files alike:
   - Cursor's `Task` tool → Claude Code's `Agent` tool; `subagent_type: generalPurpose` plus a model line → `subagent_type:` the role's configured agent; a Cursor `readonly` flag is dropped.
   - `~/.cursor/rules/pstack-models.mdc` → `~/.claude/poor-mans-pstack-models.md`.
   - Cursor's MCP discovery mechanics → "list the MCP servers available in this session (the tools whose names carry their server prefix)".
   - Cursor's `/loop` → Claude Code's `loop` command (guarded per guard 6); the "control skill" / "driver skill" abstraction and the Non-negotiables section → drive the surface directly, on Claude Code via the built-in `run` skill.
   - Frontmatter `disable-model-invocation: true` → the port's `user-invocable: false`. Upstream renamed the key; do not adopt the new name until Claude Code is confirmed to honor it.
   - Drop the cross-runtime (Codex) shims entirely.
8. **Drop unported skill references.** A reference to a skill the port does not carry (figure-it-out, tdd, babysit, shipping, orchestrate, reflect, and the like) is removed or inlined: replace the referenced cadence with a short inline instruction, or drop the sentence when the SKILL.md already covers it. Upstream's `/deslop from cursor-team-kit` points at the port's own `deslop`.
9. **Principle references → inline links.** Convert a bare `**principle-slug**` mention to an inline Markdown link to the sibling skill: `[Readable Name](../../principle-<slug>/SKILL.md)` from a playbook, `[Readable Name](../principle-<slug>/SKILL.md)` from a top-level SKILL.md.
10. **Name stays `baked-poteto-mode`.** The entry skill is `baked-poteto-mode` (`/baked-poteto-mode`), not upstream's `poteto-mode`. Keep the name, the title, and every scope example (such as the Opening a PR title example) on the port name.

## Verify

- `grep -rn "grok\|gpt-\|swarm\|figure-it-out\|control skill\|driver skill\|/poteto-mode\|poteto-agent\|generalPurpose\|pstack-models.mdc\|disable-model-invocation\|claude-fable-5[^-]\|readonly" skills/poor-mans-pstack` returns nothing in a ported file, or only a deliberate, explained mention (this skill's own guard text is one).
- `grep -rn "slack\|datadog\|sentry\|databricks\|incident-postmortem" skills/poor-mans-pstack/why` returns nothing.
- The set of config keys the ported skills name equals the set the orchestration table and the setup sheet template define, and the two default lists agree entry for entry.
- Every `references/...` path a SKILL.md names resolves to a file, and every file under a `references/` tree is named by its SKILL.md or by another reference file.
- Every `[...](../...principle-*/SKILL.md)` link resolves to a real directory.
- Every skill the ported files name (`how`, `why`, `architect`, `arena`, `interrogate`, `unslop`, `deslop`, `no-comments`, `technical-writing`, `poor-mans-orchestration`, `setup-poor-mans-pstack`) exists in `poor-mans-pstack/`.
- Each changed SKILL.md still has valid frontmatter (`name`, `description`) and the `name` matches its directory.

## Ship

Commit the sync as small, ordered commits (one per skill or per coherent group), then run the **Opening a PR** playbook ([../baked-poteto-mode/playbooks/opening-a-pr.md](../baked-poteto-mode/playbooks/opening-a-pr.md)). In the PR description, name the upstream revision you synced against, list which guards you re-applied, note any upstream skill that appeared or disappeared (such as `deslop` leaving upstream), and list the cost hotspots you handed back for review. Do not sync and ship unrelated edits in the same PR.
