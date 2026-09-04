---
name: why
description: "Use for 'why does X work this way', 'why did we pick Y', design rationale, regressions, postmortems, or data-backed thresholds. Investigates the historical record and returns a cited, confidence-calibrated read on decisions and tradeoffs. Budget port of pstack's why for a single Claude subscription. Use how for runtime behavior."
---

# Why

Reconstruct why code is the way it is from the historical record. Operate as a careful, precise investigator piecing together a case from fragmentary records. When the record is thin, say so.

## Epistemics (non-negotiable)

- **Hedge on purpose.** Match language to evidence strength: a PR description stating the reason supports "because"; a suggestive commit sequence supports "appears to" or "likely"; absence of evidence supports only "the record doesn't say".
- **Null results are first-class evidence.** "No design doc, no linked ticket, shipped in one commit" tells you how the decision was made. Report the nulls alongside the hits.
- **Never present inference as record.** Distinguish "the commit says X" from "I infer X from the timing".

## Steps

1. **Anchor in code.** Find the exact files, symbols, and constants the question is about; read the current implementation. Capture seed context: file paths, symbols, suspicious constants.
2. **Mine source control, inline.** This is the only guaranteed evidence source and it's free: `git log --follow` and `git log -S <constant>` for when and how the code arrived, `git blame` for who and in what commit, `gh pr view` / `gh pr list --search` for the PR description and review threads, plus code comments, test names (they encode motivating edge cases), and commit-message ticket links. Implementation-time rationale captured during review is the most trustworthy evidence because it ties directly to the diff that shipped.
3. **Widen only where evidence systems exist.** If the environment has MCPs for tickets, docs, chat, observability, error tracking, or analytics, spawn **one investigator-tier subagent per attached category** that plausibly holds the answer, in a single message (see the **poor-mans-orchestration** skill). No attached MCPs means step 2 is the investigation; don't simulate the other categories.
4. **Synthesize with calibrated confidence.** Answer the question, cite every claim to its evidence (commit hash, PR number, ticket ID, doc link), report the null results, and name the gaps: what you could not determine and where the answer might live (a person, a system you lack access to).

**Output:** the question restated, the answer with confidence-matched phrasing, the evidence trail with citations, null results, and open gaps. If the record contradicts the user's premise, say so plainly.
