---
name: sync-pstack-but-make-it-cheap
description: "Refresh the poor-mans-pstack skills against upstream pstack while re-applying every budget guard for a single Claude subscription. Use for /sync-pstack-but-make-it-cheap or a routine sync of the ported skills against the upstream pstack tree."
---

# Sync pstack, but make it cheap

Refresh poor-mans-pstack against upstream pstack, keeping every budget adaptation intact. Upstream supplies the wording and the disciplines; the budget guards below are the invariant and win on every conflict. You are not porting upstream wholesale, you are pulling upstream improvements into the skills that are already ported and re-applying the guards.

Upstream reference: `https://github.com/cursor/plugins/tree/main/pstack/skills`. Fetch raw files from `https://raw.githubusercontent.com/cursor/plugins/main/pstack/skills/<path>`.

## Scope

Sync only the skills that already exist in `poor-mans-pstack/`. Do not add a new upstream skill unless the user asks for it; a new upstream skill (a new panel, a new orchestration mode) is a separate decision, not a sync. Enumerate the ported set from the directory itself so the mapping stays honest as skills are added or dropped:

```bash
ls -1 skills/poor-mans-pstack
```

Map each ported directory to its upstream counterpart before diffing:

- `baked-poteto-mode/SKILL.md` ← upstream `poteto-mode/SKILL.md` (entry skill; the port keeps only the operational core, not the full trigger list).
- `baked-poteto-mode/playbooks/<name>.md` ← upstream `poteto-mode/playbooks/<name>.md`, for the ported playbooks only (investigation, bug-fix, feature, refactoring, prototype, opening-a-pr). Upstream playbooks with no ported counterpart (babysit, shipping, orchestrate, hillclimb, swarm-driven, figure-it-out, and the rest) stay out.
- `how`, `why`, `architect`, `arena`, `interrogate`, `unslop`, `deslop`, `no-comments`, `technical-writing`, `create-verification-skill`, `maintain-verification-skill` ← the upstream skill of the same name.
- `principle-*` ← upstream `principle-*` of the same name.
- `poor-mans-orchestration`, `setup-poor-mans-pstack`, and this skill have no upstream counterpart. They encode the budget model. Re-derive them from the guards below, not from upstream.

## Procedure

For each ported file, run a three-way reconcile: upstream (what changed there), the current port (what you have), and the guards (what must hold).

1. Diff the current port file against its upstream counterpart. Read both in full.
2. Pull in the genuine upstream improvements: clearer wording, a new principle, a tightened step, a corrected instruction.
3. Re-apply every guard in the checklist below to the merged text. A guard always wins over upstream wording.
4. Keep the port's own additions that upstream lacks (routing hints, inline principle links) only when they still serve; drop stale ones.

## Budget guards

Re-apply all of these on every sync. Each is a rewrite rule from upstream text to the port.

1. **Model slugs → tiers.** Replace any upstream model default (for example `grok-4.6-fast-xhigh`, or a raw `claude-*` slug) with the poor-mans role tier: "your configured `<role>` tier (**poor-mans-orchestration** skill; set tiers with `/setup-poor-mans-pstack`)". Never carry an upstream slug into a playbook.
2. **No multi-model panels.** Upstream panel lists (arena runners, architect runners, interrogate reviewers, swarm workers as model lists) collapse to a single role tier. Route all subagent and model choices through the **poor-mans-orchestration** skill.
3. **Fan-out cap.** Exploration (the **how**, **why**, and **arena** skills) fans out to at most two parallel subagents. Medium and heavy work (feature implementation, refactoring edits, prototyping) does not fan out: one owner, inline or a single delegate. State the cap where upstream says "fan out" or "parallel subagents".
4. **No swarms.** Drop the swarm skill and every reference to it (coverage matrices, races, gauntlets). If an upstream step needs breadth a swarm would give, narrow the scope or hand the breadth back to the user.
5. **Guard long loops.** Any upstream instruction to run a loop, an autonomous run, or a repeated unattended pass gets a pause-and-warn wrapper: tell the user the expected cost and get a go-ahead first. A session override ("don't stop", "run until done") is that go-ahead.
6. **Cursor mechanisms → Claude Code.** Rewrite Cursor-specific mechanisms to their Claude Code equivalent: Cursor's `/loop` → Claude Code's `loop` command (guarded per guard 5); the "control skill" / "driver skill" abstraction and the Non-negotiables section → drive the surface directly, on Claude Code via the built-in `run` skill. Drop the cross-runtime (Codex) shims entirely.
7. **Drop unported skill references.** A reference to a skill the port does not carry (figure-it-out, tdd, babysit, shipping, orchestrate, reflect, and the like) is removed or inlined: replace the referenced cadence with a short inline instruction, or drop the sentence when the SKILL.md already covers it.
8. **Principle references → inline links.** Convert a bare `**principle-slug**` mention to an inline Markdown link to the sibling skill: `[Readable Name](../../principle-<slug>/SKILL.md)` from a playbook, `[Readable Name](../principle-<slug>/SKILL.md)` from a top-level SKILL.md.
9. **Name stays `baked-poteto-mode`.** The entry skill is `baked-poteto-mode` (`/baked-poteto-mode`), not upstream's `poteto-mode`. Keep the name, the title, and every scope example (such as the Opening a PR title example) on the port name.

## Verify

- `grep -rn "grok\|swarm\|figure-it-out\|control skill\|driver skill\|/poteto-mode\|poteto-agent" skills/poor-mans-pstack` returns nothing in a ported file, or only a deliberate, explained mention.
- Every `[...](../...principle-*/SKILL.md)` link resolves to a real directory.
- Every skill the ported files name (`how`, `why`, `architect`, `arena`, `interrogate`, `unslop`, `deslop`, `no-comments`, `technical-writing`, `poor-mans-orchestration`, `setup-poor-mans-pstack`) exists in `poor-mans-pstack/`.
- Each changed SKILL.md still has valid frontmatter (`name`, `description`) and the `name` matches its directory.

## Ship

Commit the sync as small, ordered commits (one per skill or per coherent group), then run the **Opening a PR** playbook ([../baked-poteto-mode/playbooks/opening-a-pr.md](../baked-poteto-mode/playbooks/opening-a-pr.md)). In the PR description, name the upstream revision you synced against and list which guards you re-applied. Do not sync and ship unrelated edits in the same PR.
