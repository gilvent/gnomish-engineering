---
name: how
description: "Use for 'how does X work', code walkthroughs before changing something, and placement / ownership / layering questions ('where should this live', 'is this the right layer'). Explains subsystem architecture, runtime flow, onboarding mental models. Can critique architecture. Budget port of pstack's how for a single Claude subscription. Use why for motivation."
---

# How

Explore the codebase to answer "how does X work?" questions. Produce clear architectural explanations at the level of a senior engineer onboarding onto a subsystem: enough to build a working mental model, not annotated source code.

Two modes: **Explain** (default) and **Critique** (when the user asks for issues, problems, or improvements, not just understanding). Read the **poor-mans-orchestration** skill before spawning anything.

## Explain mode

1. **Parse the question and assess complexity.** Identify the scope; if ambiguous, state your best-guess interpretation before exploring rather than asking. Simple (a single module, a narrow "how does function X work"): explore and explain yourself, inline, no subagents. Complex (a subsystem spanning many files, a cross-cutting feature, a full overview): spawn **one explorer-tier subagent** (readonly) to do the bulk reading so the raw code stays out of your context (**principle-guard-the-context-window**). When in doubt, lean simple.
2. **Explore.** Whoever explores (you or the explorer) starts broad (glob directories, grep key types), follows the thread from an entry point through the call chain, reads the actual code rather than guessing from file names, and stops only when it can describe the full path from input to output without hand-waving any step. Note things that are surprising or that a newcomer would get wrong. The explorer returns structured findings: components, flow traced, files read, non-obvious notes.
3. **Explain.** Write the explanation yourself from the findings, in the output format below.

### Output format

Adapt to the question; not every section is needed.

- **Overview.** 1-2 paragraphs: what it is, what it does, why it exists.
- **Key Concepts.** The important types, services, or abstractions, briefly defined.
- **How It Works.** The core: what triggers it, what happens step by step, where data goes, the decision points. Prose with file and function references, not code dumps.
- **Where Things Live.** A brief map of the relevant files, just enough to start working in the area.
- **Gotchas.** Non-obvious or surprising things, historical context, known sharp edges.

## Critique mode

1. Run the full explain flow first; you must understand the architecture before critiquing it.
2. Spawn **one reviewer-tier critic subagent** (readonly) with the explanation, the relevant file paths, and instructions to independently identify architectural issues: shallow modules, information leakage, temporal decomposition, pass-through layers, mismatched data structures, boundary violations. While it runs, do your own independent critique pass before reading its findings, to limit anchoring.
3. **Lead judgment.** Merge both critiques as a pragmatic lead, not an aggregator. Categorize every finding: **Act on** (worth fixing now), **Consider** (real but unclear cost/benefit), **Noted** (valid, low priority), **Dismissed** (wrong, missing context, or style preference, with a one-line why). Findings both passes raised independently are the highest signal. Note the reduced diversity (two same-family passes, not a three-model panel).
4. Present the explanation first, the critique verdict below it; the explanation must stand on its own.
