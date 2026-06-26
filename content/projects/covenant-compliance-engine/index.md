---
slug: "covenant-compliance-engine"
title: "COVENANT — Regulatory & Compliance Intelligence Engine"
tagline: "Extracts obligations from real banking regulation, maps a policy against them, flags coverage gaps, and answers compliance questions with citations — evaluated against hand-labeled ground truth."
domains: ["Commercial Bank"]
status: "Completed"
problem: "A bank's compliance team needs to know whether its internal policy actually covers every legal obligation in the regulation it's subject to — and grading that automatically requires a ground truth to check against, which most compliance-AI demos skip."
approach: "Nine phases end-to-end: deterministic segmentation of a real 10-section slice of 31 CFR Chapter X via the eCFR API with exact character offsets, Gemini-based obligation extraction with citations resolved by exact substring match, a hand-labeled 100-obligation gold set with span-IoU evaluation, a synthetic policy with deliberately seeded coverage flaws, an embedding-narrowed + LLM-judged coverage mapper (covered / partial / absent / contradictory), gap detection graded against the seeded ground truth, and a cited Q&A layer over ChromaDB with two-layer refusal for out-of-scope questions."
stack: ["Python","Pydantic v2","SQLite","Gemini Flash","sentence-transformers","ChromaDB","Streamlit","pytest"]
metrics: [{"label":"Obligation extraction — F1","result":"0.741","target":"0.85"},{"label":"Gap detection — false-positive rate","result":"0.400","target":"0.10","context":"lower is better; over-flagging is the safer failure mode for compliance triage, but 40% is still high"},{"label":"Cited Q&A — citation precision","result":"0.933","target":"0.85"},{"label":"Cited Q&A — abstention accuracy","result":"0.933","target":"0.90"},{"label":"Test suite","result":"97/97 passing, zero LLM calls required"}]
highlights: ["124 obligations extracted from a real 10-section slice of 31 CFR Chapter X (Bank Secrecy Act / FinCEN), segmented deterministically with exact character offsets","Single seeded contradiction (a $15,000 vs. $10,000 CTR reporting threshold) caught correctly with full confidence","Honest limitation: the 40% gap false-positive rate misses its 0.10 target — roughly half is explained by extraction granularity mismatches, but the mapper’s conservative bias toward \"partial\" coverage is a real, independent weakness that a merge/dedup pass would only partly fix","Actor-accuracy correction revealed most \"errors\" were the model naming \"the CIP\" or \"the procedures\" instead of \"the bank\" — a normalization issue, not a comprehension failure"]
---

# COVENANT — Regulatory & Compliance Intelligence Engine

A complete writeup of what was built, how it was built, and what the
measured results actually show. Screenshots are in `images/`; the full
metrics breakdown (including two findings that were tested rather than
assumed) is in `RESULTS.md`.

## The problem

A bank's compliance team needs to answer a deceptively hard question:
*does our internal policy actually cover every legal obligation in the
regulation we're subject to?* Doing this by hand means a compliance
analyst reading hundreds of pages of regulation, breaking it into
discrete duties, then reading the bank's policy and manually
cross-referencing each one.

This project automates that pipeline — extraction, mapping, gap
detection — and evaluates each stage independently against real ground
truth, rather than building a demo that looks good and hoping it's right.

## What this is *not*

Not a "chat with a PDF" tool. The retrieval-augmented Q&A feature
(Phase 7) is the smallest, last-built part of the system. The center of
the system is a **materialized, queryable database of legal obligations**
that exists independently of any question — you can `SELECT COUNT(*)`
from it with zero LLM involved.

## Architecture

```
31 CFR regulation text (eCFR)              Synthetic bank policy (seeded gaps)
        |                                            |
        v                                            v
  deterministic segmentation              deterministic segmentation
  (exact char offsets, no LLM)            (exact char offsets, no LLM)
        |                                            |
        v                                            |
  Gemini extraction -> obligations                   |
  (citations resolved by exact                       |
   substring match, never trusted                    |
   from the model)                                   |
        |                                            |
        v                                            |
  +----------------------------+                     |
  |  SQLite obligation database |  <- the spine       |
  +----------------------------+                      |
        |                    \                        |
        v                     \                        v
  hand-labeled gold set         \          sentence-transformers retrieval
  -> extraction eval             \          + Gemini coverage classification
  (precision/recall/F1,           \                    |
   field accuracy)                 \                   v
                                     +---->   PolicyMapping rows (covered /
                                              partial / absent / contradictory)
                                                        |
                                                        v
                                              deterministic gap derivation
                                                        |
                                                        v
                                              gap eval vs. seeded ground truth
                                              (false-positive / false-negative
                                               rate, confusion matrix)

  Separately: ChromaDB index over the regulation -> hybrid (semantic +
  keyword) retrieval -> Gemini answer generation with two-layer abstention
  -> citations resolved to exact pre-computed spans -> QA eval

  Streamlit dashboard: reads the SQLite database directly for 3 of 4 tabs;
  only the Q&A tab makes a live LLM call.
```

## Build order (and why it matters)

Ingestion → extraction → obligation database → extraction eval → policy
ingestion → mapping → gap detection → gap eval → Q&A → dashboard.

The retriever and the chat-style Q&A feature were built **last**, after
six other phases were already evaluated. This is deliberate: it is easy
to build a system that retrieves a regulation passage and asks an LLM to
answer a question, and it is easy for that to look impressive in a demo
while never being checked against anything. The obligation database, the
gap detector, and their evals exist and are correct *before* the
Q&A surface exists at all.

## What was built, phase by phase

**Phase 0 — Scaffold.** Pydantic schemas for `Obligation`, `Citation`,
`PolicyMapping`, and `Gap`. A single chokepoint (`covenant/llm/client.py`)
for every LLM call in the project: model pinned, temperature fixed at 0,
every response cached to disk by prompt hash, and a hard rule that any
quota/rate-limit error stops the run and reports rather than retrying
silently or falling back to a different model.

**Phase 1 — Ingestion.** Downloaded the real text of 10 sections of 31
CFR Chapter X (the bank secrecy / anti-money-laundering rules) from the
U.S. government's live eCFR API and split it into addressable chunks with
exact character offsets — no LLM involved, fully deterministic, and every
chunk round-trips to the exact source text.

**Phase 2 — Extraction.** Gemini reads each section and proposes
obligations; the system then locates each proposed obligation's exact
text in the source itself, rather than trusting any offset the model
reports. **124 obligations extracted.** A real bug was caught and fixed
here: one section of the regulation repeats a nearly identical paragraph
twice (once for banks with a federal regulator, once for banks without
one) — the first version of the matching logic collapsed both onto the
same citation; fixed by tracking occurrence order.

**Phase 3 — Gold set and evaluation.** 100 obligations from the same
regulation were hand-labeled independently (by the same agent that wrote
the extraction prompt — a disclosed limitation, not a hidden one) to
create an answer key, with written annotation guidelines defining what
counts as one obligation. The extraction was then scored against this
answer key with exact, reproducible math (character-span overlap
matching), not eyeballing.

**Phase 4 — Synthetic policy.** A fake bank's internal AML policy was
written with specific, deliberate flaws: an entire topic (beneficial
ownership) is never mentioned; one numeric threshold contradicts the
regulation outright ($15,000 stated where the law says $10,000); and one
section is only vaguely gestured at rather than genuinely covered. Every
deliberate flaw is recorded in a separate ground-truth file before any
model ever sees the policy.

**Phase 5 — Mapping.** Every one of the 124 obligations is compared
against the policy: a fast, local embedding model first narrows the
policy down to a handful of plausibly relevant passages, then Gemini
judges whether the policy covers, partially covers, omits, or contradicts
the obligation — citing its evidence by index into the retrieved
passages, never by re-quoting text, so every citation is an exact,
pre-computed span.

**Phase 6 — Gap detection and evaluation.** Every obligation not marked
"covered" becomes a flagged gap with a severity. The flagged gaps are
then checked against the deliberate flaws planted in Phase 4 — this is
the headline result, and it is not flattering (see Results below), and
it is reported anyway.

**Phase 7 — Cited Q&A.** A small ChromaDB index over the regulation
text, hybrid (semantic + keyword) retrieval, and an answer-generation
step with two layers of refusal: if retrieval can't find a confident
match, the system never even calls the LLM; if the LLM itself can't
support an answer from what it's given, it says so rather than guessing.

**Phase 8 — Dashboard.** A 4-tab Streamlit application, verified live in
a headless browser (not just read as code) — which caught a second real
bug: SQLite connections can't cross threads, but Streamlit's caching
reuses objects across threads on rerun, causing a crash on the first real
interaction. Fixed and re-verified.

**Phase 9 — Honest writeup.** This document and `RESULTS.md`.

## Screenshots

### Obligation Explorer
Every one of the 124 obligations, searchable, with the exact source text
highlighted for the selected obligation.

![Obligation Explorer](/projects/covenant-compliance-engine/01_obligation_explorer.png)

### Coverage View
124 obligations classified covered / partial / absent / contradictory
against the synthetic policy, with the model's rationale for each
judgment.

![Coverage View](/projects/covenant-compliance-engine/02_coverage_view.png)

### Gap Report
67 flagged gaps, sorted by severity, each expandable to show the policy
evidence (or lack of it) the model considered.

![Gap Report](/projects/covenant-compliance-engine/03_gap_report.png)

### Compliance Q&A
A live question answered with a citation that resolves to the exact
supporting regulation text — highlighted, not just named.

![Compliance Q&A](/projects/covenant-compliance-engine/04_compliance_qa.png)

## Results — the short version

Full breakdown, including two findings that were tested rather than
assumed, is in **`RESULTS.md`**. The headline numbers:

| Stage | Metric | Result |
|---|---|---|
| Extraction | F1 vs. 100 hand-labeled obligations | 0.741 |
| Extraction | Actor field accuracy (corrected scorer) | 0.807 |
| Gap detection | False-negative rate (misses a real gap) | 0.154 |
| Gap detection | False-positive rate (flags a non-gap) | 0.400 |
| Q&A | Citation precision / answer correctness / abstention accuracy | 0.933 / 0.933 / 0.933 |

The single worst number — the 40% gap false-positive rate — is the
front-page finding, not something buried in an appendix. It was
investigated, not just reported: the data shows it's a real, independent
weakness in the coverage classifier's calibration (a tendency to under-
credit policy language that genuinely covers an obligation), only
partially explained by extraction-granularity mismatches. For a
compliance triage tool, this is the defensible direction to err in —
missing a real gap is worse than over-flagging one — but 40% is still
high enough that a production version would need to fix it.

## Tech stack

Python 3.11+, Pydantic v2, SQLite, Gemini Flash (`gemini-2.5-flash` — the
originally specified `gemini-2.0-flash` was retired by Google mid-build;
disclosed in `RESULTS.md`), sentence-transformers, ChromaDB, Streamlit,
pytest. 97/97 tests pass with zero LLM calls required to run the suite.

## How to run it

```bash
python -m pytest                                    # full suite, no API key needed
streamlit run src/covenant/dashboard/app.py          # the dashboard shown above
python3 scripts/print_eval_report.py                 # extraction eval
python3 scripts/print_gap_report.py                  # gap eval
python3 scripts/print_qa_eval_report.py              # Q&A eval
```

See the repository's main `README.md` for full setup instructions.

---

## COVENANT — Results

All numbers below were measured by running the eval against this build's
actual data (124 extracted obligations, 100 hand-labeled gold obligations,
39 seeded policy gaps, 15 Q/A pairs). No placeholder numbers. Where a
number turned out to be a measurement artifact rather than a real model
weakness, that's stated explicitly and the corrected number is reported
alongside the raw one — not in place of it.

## 1. Extraction (Phase 3)

124 obligations extracted from the 10-section CFR slice, evaluated
against 100 hand-labeled gold obligations. Matching is by character-span
IoU (≥0.5, greedy, same-section only).

| metric | target | result |
|---|---|---|
| detection precision | 0.85 | **0.669** |
| detection recall | 0.85 | **0.830** |
| detection F1 | 0.85 | **0.741** |
| modality accuracy (matched pairs) | 0.90 | **0.831** |
| obligation_type accuracy (matched pairs) | 0.80 | **0.831** |
| actor accuracy — raw exact-string match | 0.80 | 0.229 |
| actor accuracy — normalized | 0.80 | **0.807** |

83 of 124 predicted obligations matched a gold obligation; 41 predicted
obligations had no gold match (likely over-split or extra judgment
calls, not necessarily hallucinations); 17 gold obligations were missed
entirely.

### The actor-accuracy correction

The first pass scored actor agreement by exact string match and got
**22.9%** — clearly broken, since "the bank" vs. "A bank" vs. "every
bank" vs. "a bank, or any director, officer, employee, or agent of any
bank" all name the same real-world actor but fail a literal string
comparison. `normalize_actor()` (`src/covenant/eval/extraction_eval.py`)
groups both gold and predicted actor strings into ~10 categories (bank,
covered financial institution, transmittor/recipient/intermediary
institution, federal regulator, government authority, FinCEN, USPS) by
keyword, with deliberate care to *not* erase real errors: phrases like
"the CIP" or "the record" — which a regulatory analyst would never accept
as the actor of an obligation, since a document doesn't act, the bank
does — map to a dedicated `non_actor_error` bucket and continue to score
as wrong.

This raised actor accuracy from 22.9% to **80.7%**, clearing the 0.80
target. Of the 16 remaining mismatches on matched pairs (out of 83), 15
are exactly this `non_actor_error` case (the model named "the CIP" or
"the procedures" instead of "the bank") and 1 is a real but minor
specificity miss (generic "financial institution" instead of "covered
financial institution"). All 16 are genuine errors, confirmed by
inspection — the corrected number is not hiding anything, it's measuring
the right thing.

One bug surfaced and fixed while building the normalizer: an early
version checked "federal functional regulator" before checking "bank" in
its keyword priority list, which misclassified "A bank regulated by a
Federal functional regulator" (the actor is the bank; the regulator is
only a modifier) as `federal_regulator` instead of `bank`. Reordering the
priority list fixed 22 of the false mismatches in one change. Locked in
with `tests/test_extraction_eval.py::test_normalize_actor_does_not_let_regulator_mention_override_bank_actor`.

## 2. Gap detection (Phase 6)

124 obligations mapped against the synthetic policy; compared against
`data/policy/seeded_gaps.json` (39 deliberately-seeded gaps: 21 absent, 1
contradictory, 17 partial).

| metric | target | result |
|---|---|---|
| gap false-positive rate (seeded covered, flagged as a gap anyway) | 0.10 | **0.400** |
| gap false-negative rate (seeded gap, missed entirely) | 0.10 | **0.154** |
| coverage-label accuracy (exact 4-way label match) | 0.80 | **0.557** |

Confusion matrix (rows = ground truth, columns = predicted):

| | covered | partial | absent | contradictory |
|---|---|---|---|---|
| **covered** | 51 | 20 | 13 | 1 |
| **partial** | 3 | 10 | 4 | 0 |
| **absent** | 3 | 11 | 7 | 0 |
| **contradictory** | 0 | 0 | 0 | 1 |

The single seeded contradiction (the policy's $15,000 CTR threshold vs.
the regulation's $10,000) was caught correctly with full confidence.

### Why the false-positive rate is high: tested, not assumed

Hypothesis going in: Phase 3's extraction granularity mismatches
propagate into Phase 6 as spurious gaps — if one regulatory requirement
gets extracted as several narrower obligation rows, and the policy
addresses the requirement holistically in one place, each narrow row may
fail to find a single policy span that fully covers *it specifically*,
even though the requirement as a whole is genuinely covered.

This was tested two ways before being written up, not assumed:

1. **Gold-overlap grouping** (group predicted obligations by which gold
   obligation's span they overlap, in the same section): found almost no
   actual 1-gold-to-many-predicted splitting in this dataset — only 3
   gold concepts had 2 overlapping predicted obligations, and the
   gap-flag rate for those (33%) was statistically indistinguishable from
   singletons (34%). **This test did not support the hypothesis.**
2. **Direct correlation, extraction agreement vs. gap-flag rate**: among
   ground-truth-*covered* obligations, those that matched a gold
   obligation cleanly (extraction agrees with the hand-labeled
   granularity) were flagged as a gap **32.8%** of the time (20/61);
   those that *didn't* match cleanly (extraction disagreed with gold —
   evidence of a granularity or boundary mismatch) were flagged **58.3%**
   of the time (14/24).

The second test does support the underlying mechanism — extraction
granularity disagreement correlates with roughly double the spurious-gap
rate — but the first test shows the *literal* "one gold concept split
into many predicted rows" pattern is rare in this specific dataset. The
honest conclusion: granularity/boundary mismatches between extraction and
the gold standard are a real contributor to the gap false-positive rate,
but they are not the dominant single cause of the 40% figure — the
sample for the second test is small (24 vs. 61 obligations) and a
majority of false positives (resolves to roughly half) occur on
obligations that *did* match gold cleanly, meaning the mapper's
conservative bias toward "partial" is a real, independent weakness on
top of any granularity effect, not a costume for one underlying bug.

**What this means for a fix**: a merge/dedup pass in Phase 3 (collapsing
extraction output toward gold-like granularity) would likely reduce both
the extraction false-positive rate and *some* of the gap false-positive
rate, but would not by itself fix the gap mapper's standalone
over-conservative tendency on cleanly-matched obligations. Both are worth
fixing; neither fully explains the other away.

### The asymmetry is the right one for this domain

A 15.4% false-negative rate paired with a 40% false-positive rate is, for
a compliance triage tool, the correct direction to err in. Missing a real
gap (false negative) means a regulatory exposure goes unnoticed until an
examiner finds it. Over-flagging (false positive) means a compliance
analyst spends a few extra minutes confirming something that was actually
fine. Those costs are not symmetric, and a tool that's supposed to
support — not replace — human review should be tuned to flag too much
rather than too little. The 15% vs. 40% split is consistent with that
design stance, whether or not it was explicitly tuned for it.

## 3. Q&A with citations (Phase 7)

**15 questions** (12 in-scope, 3 designed to test abstention).

| metric | target | result |
|---|---|---|
| citation precision | 0.85 | **0.933** |
| answer correctness | 0.85 | **0.933** |
| abstention accuracy | 0.90 | **0.933** |

14 of 15 questions scored correctly on every axis. The system correctly
declined to answer both off-topic questions (sourdough bread, Apple stock
price) and correctly abstained rather than guess on a third case where
the available context didn't fully support an answer.

**The one "miss" is the system doing the right thing for a chunking
reason, not a model reasoning failure.** The question asked which four
pieces of information the CIP rule requires before opening an account.
The regulation states this as one sentence followed by an enumerated
list (name; date of birth; address; ID number), but the eCFR text's
line-based layout puts each list item on its own line, and the
segmenter (Phase 1) turns each line into its own retrievable chunk.
Retrieval surfaced the intro sentence ("the bank must obtain...the
following information") but not all four enumerated items in the same
top-k window, so the model correctly declined to assert a complete
four-item list it didn't have full evidence for, rather than guessing.
The fix is a segmentation change — keep an enumerated list and its
intro sentence in one chunk — not a prompt or retrieval-threshold change.
With only 15 questions, this single case moves every metric by ~6.7
points; the takeaway is "abstention worked as designed, and the fix is
known and scoped," not "the system is 93% accurate" as a standalone
headline number.

## Files

- `eval/gold_obligations.json` — 100 hand-labeled gold obligations
- `eval/ANNOTATION_GUIDELINES.md` — shared definition used by both the
  extraction prompt and the gold labeling
- `eval/qa_gold.json` — 15 Q/A pairs
- `data/policy/seeded_gaps.json` — 39 seeded ground-truth gaps
- `src/covenant/eval/extraction_eval.py` — IoU matching, field accuracy,
  `normalize_actor()`
- `src/covenant/gaps/gap_eval.py` — gap FP/FN rates, confusion matrix
- `src/covenant/qa/qa_eval.py` — citation precision, answer correctness,
  abstention accuracy

Reproduce with: `python3 scripts/print_eval_report.py`,
`python3 scripts/print_gap_report.py`, `python3 scripts/print_qa_eval_report.py`.
