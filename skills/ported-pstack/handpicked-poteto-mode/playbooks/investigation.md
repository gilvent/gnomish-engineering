# Investigation

**You own the answer. Plan, read, write.**

Read-only requests: "how does X work?", "why was Y built this way?", "are we sure about Z?", "should we do X or Y?". They produce a cited explanation or a recommendation, not a code change.

1. Read the affected code yourself until you can answer from evidence. Cite files and lines for every claim; git history and blame for motivation questions.
2. Throughput checkpoint stays one line: `throughput checkpoint: n/a, read-only investigation`. The four-item version is for code-shaped work.
3. Produce the structured output (Overview / Key Concepts / How It Works / Where Things Live / Gotchas), or a recommendation with a tradeoffs table if the request is a decision between alternatives.

No PR. If the investigation precedes a code change, hand back to the user and re-route to Bug fix or Feature.

**Reply:** the investigation output. For "are we sure?" answers, include your real judgment with reasons. Push back if the premise is wrong.
