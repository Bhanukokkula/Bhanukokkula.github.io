---
slug: "filings-reasoning-engine"
title: "Filings Reasoning Engine — Financial Math QA over SEC Filings"
tagline: "Question-answering over SEC filings that does the math in executable code, verifies its own work, and abstains when it can’t confirm — including the honest negative result it found along the way."
domains: ["AI Engineering","Hedge Fund","Investment Banking","Commercial Bank"]
status: "Completed"
featured: true
problem: "LLMs asked to read a financial table and \"just answer\" a math question hallucinate at rates that make them unsafe for unsupervised use. The system needs to show its work and know when not to answer."
approach: "Hybrid FAISS + cross-encoder retrieval separates table cells from narrative text. The LLM reasons in natural language about numerator, denominator, period, and operation, then writes Python that references source cells by ID — never inventing numbers directly. Code runs in a restricted sandbox (import allowlist, hard timeout, no filesystem/network). A 5-check verifier (cell relevance, unit consistency, scale consistency, magnitude plausibility, provenance) confirms or rejects the answer before it’s shown, abstaining with a stated reason when it can’t confirm. Built on LangGraph with a swappable LLM provider layer (Gemini default, Claude/Ollama interchangeable), real SEC 10-K filings via edgartools, and MLflow experiment tracking."
stack: ["Python","LangGraph","FAISS","sentence-transformers","cross-encoder reranking","sandboxed code execution","edgartools","MLflow","pytest","FastAPI"]
metrics: [{"label":"Full verified system — accuracy on answered questions (FinQA dev, n=100)","result":"68.1%","baseline":"naive LLM baseline: 71.4%"},{"label":"Abstention rate","result":"31% — flags rather than guesses when it can’t confirm"},{"label":"Overall accuracy incl. abstentions","result":"47%","baseline":"baseline: 70.0%"},{"label":"Unverified Program-of-Thought, before vs. after adding an explicit reasoning step","result":"54.1% → 64.4%"}]
highlights: ["Honest negative result: the verified system trails the naive baseline on raw accuracy — investigated and explained rather than hidden","Audit found two real measurement bugs (metadata leakage favoring the baseline, scoring that penalized abstention) plus a root cause: under-prompting. Adding an explicit \"reason about numerator/denominator/period/operation, then write code\" step closed about 60% of the original gap (54.1% → 64.4% unverified)","The verifier has a measured blind spot: it reliably catches provenance errors (wrong cell, wrong units, fabricated numbers) but cannot catch a syntactically valid program that uses the right cells with the wrong formula","49 tests, including adversarial sandbox tests for disallowed imports, filesystem writes, network sockets, and infinite loops; two real infrastructure bugs found this way (a multiprocessing timeout bug, a missing HTTP timeout that once blocked a batch run for over an hour)"]
---

# Filings Reasoning Engine — Project Case Study

**An auditable AI system that answers financial math questions about real SEC
filings by writing and executing code, verifying its own work, and refusing
to guess when it can't confirm the answer.**

> This folder is self-contained: `CASE_STUDY.md` plus `confirmed-answer.png`
> and `abstention.png` sitting alongside it. Copy the whole folder as one
> unit — no other files are needed to render this document.

---

## One-line summary

Built an end-to-end pipeline — real SEC filing ingestion, semantic retrieval,
LLM-generated code execution in a sandbox, and an independent verifier — that
answers quantitative questions about 10-K filings with full source-cell
citation, then measured it honestly against a published financial-QA
benchmark, including a surprising negative result that was investigated and
explained rather than hidden.

---

## The problem

Large language models asked to read a financial table and "just answer" a
math question hallucinate numbers at a rate that makes them unsafe for
unsupervised use in finance — this is the most commonly documented failure
mode of LLMs applied to financial data. The standard research mitigation is
**Program-of-Thought (PoT)**: instead of doing arithmetic in free text, the
model writes code that operates on the actual data, and the code's output is
the answer. That idea is well established in papers but rarely shipped with
the two things that make it actually trustworthy in production:

1. A sandbox that genuinely executes the generated code safely (not just a
   `eval()` with good intentions).
2. A verifier that catches cases where the code ran successfully but used
   the wrong data, the wrong units, or an implausible result — i.e.,
   confidently wrong rather than honestly uncertain.

This project builds both, wires them into a full retrieval → generate →
execute → verify → abstain pipeline, and — critically — measures whether any
of it actually helps, rather than assuming it does.

---

## What it does

A user asks a question like *"What were Apple's net sales in fiscal year
2025?"* against real, ingested 10-K filings. The system:

1. **Retrieves** the relevant table cells and narrative text via a hybrid
   FAISS + cross-encoder reranking pipeline.
2. **Generates** a short Python program that reads named cells by ID — the
   model is structurally prevented from inventing a number, because the
   only numbers available to it are the ones it's handed.
3. **Executes** that program in a restricted subprocess sandbox: no network,
   no filesystem access, a hard timeout, and an import allowlist.
4. **Verifies** the result against five concrete, inspectable checks before
   calling it confirmed: did execution succeed, were the cells it used
   actually the ones it was given, are those cells relevant to the question,
   are their units and scale consistent, and is the magnitude plausible.
5. **Answers or abstains.** If verification fails, the system says "cannot
   confirm" and states the specific reason — abstention is tracked as a
   first-class metric, not an edge case to minimize.

Every answer in the UI shows its full trace: the generated program, the
exact source cells (ticker, label, value, period, statement), and which
verification checks passed or failed.

### Visual: a confirmed answer with full citation

![Confirmed answer](/projects/filings-reasoning-engine/confirmed-answer.png)

*The system answers "What were Apple's net sales in fiscal year 2025?"
correctly, showing the generated program, the exact cited source cell, and
all seven verification checks passing.*

### Visual: abstaining instead of guessing

![Abstention](/projects/filings-reasoning-engine/abstention.png)

*Asked about Microsoft — a company not in the indexed filings — the system
retrieves the nearest available cell (Apple's net sales) but the verifier
catches that "Net sales" doesn't actually relate to "Microsoft's revenue"
and abstains with the exact reason, instead of confidently returning the
wrong company's number.*

---

## Architecture

```
question
   │
   ▼
retrieve   FAISS, two separate indices (table cells + narrative text),
           merged before cross-encoder reranking
   │
   ▼
generate   LLM reasons in natural language about numerator/denominator/
           period/operation, then writes Python referencing retrieved
           cells by ID — never invents a number
   │
   ▼
execute    restricted subprocess sandbox: hard timeout, import allowlist
           (pandas/math/decimal/numpy only), no filesystem or network
   │
   ▼
verify     5 checks: cell relevance, unit consistency, scale consistency,
           magnitude plausibility, cell provenance
   │
   ▼
confirmed answer  OR  abstain + human-readable reason
```

Orchestrated end-to-end as a LangGraph state graph. The reasoning LLM sits
behind a provider-abstraction interface — Gemini (default), Anthropic
Claude, and a local Ollama model are all swappable via one config value,
with no provider-specific code outside that one module.

---

## Results — measured, not claimed

Evaluated on **FinQA dev, n=100 real questions**, comparing four system
variants on the exact same questions with identical grading:

| System | Accuracy on answered | Abstention rate | Overall accuracy |
|---|---|---|---|
| Naive LLM baseline (no code execution, no verifier) | 71.4% | 2.0% | 70.0% |
| PoT, bare (code generation, unverified) | 54.1% | 2.0% | 53.0% |
| PoT, reasoning-augmented (unverified) | 64.4% | 10.0% | 58.0% |
| **Full system** (reasoning-augmented PoT + verifier) | **68.1%** | 31.0% | 47.0% |

### The honest story behind these numbers

The first measured result was a surprise: the verified system trailed a
naive "just answer in text" baseline by 17 points — the *opposite* of the
published finding that program-execution approaches beat free-text reasoning
on this benchmark. Rather than report that number or quietly adjust the
methodology until it looked better, it was treated as a hypothesis to test:

**Step 1 — Audit the harness for unfairness before trusting the result.**
Two real bugs were found and fixed: the code-generation path was being fed
fabricated placeholder metadata (a synthetic date and unit) that the
baseline's prompt never saw, and the comparison was scoring "always answers"
against "can abstain" using overall accuracy alone — which penalizes a
system for correctly declining to answer while giving the always-answering
baseline no equivalent penalty. Fixing both narrowed the gap but didn't
close it.

**Step 2 — Find the real cause.** With harness fairness no longer a
confound, the actual cause turned out to be under-prompting: the original
generation prompt asked the model to emit code directly, with no reasoning
step. Adding an explicit "reason about which value is the numerator, which
period is earlier, what operation is needed — *then* write the code" mode,
tested on the identical 100 questions, raised unverified accuracy from
54.1% to 64.4% — closing about 60% of the original gap. This was confirmed
by checking that the newly-correct answers were exactly the predicted error
class (sign flips, scale errors, numerator/denominator confusion), not a
random change.

**Step 3 — Characterize what's left, and decide what's actually worth
building next.** The remaining gap (68.1% vs. the baseline's 71.4%) was
spot-checked and found to be *systematic* table-structure misreading (e.g.
summing the wrong combination of subtotal and total rows in a multi-column
table) rather than random noise. That distinction matters: a common next
step for this kind of error — self-consistency, generating the answer
multiple times and accepting only on agreement — only helps with random
errors. Since the residual errors are systematic, that fix was deliberately
**not built**, and a more targeted table-structure-aware retrieval
improvement was identified as the better next candidate instead.

The verifier itself adds real value on top of generation quality (64.4% →
68.1% accuracy-on-answered) but has a known, now-evidenced blind spot: it
catches *provenance* errors (wrong cell, wrong units, fabricated numbers)
reliably, but cannot catch *logic* errors where the right cells were used
with the wrong formula — confirmed directly in one case where the model
hardcoded a literal number instead of referencing a cell, which the verifier
correctly caught and abstained on.

---

## Engineering rigor — what this demonstrates beyond the architecture

- **Investigated a negative result instead of hiding it.** The pipeline
  above (surprise → audit → root-cause experiment → honest re-report) is the
  actual deliverable, not just the final number.
- **Built and verified a real security boundary**, not just code review: the
  sandbox is tested against actual disallowed-import, filesystem-write,
  network-socket, and infinite-loop attempts.
- **Found and fixed real infrastructure bugs under load**, including a
  `multiprocessing` start-method bug that silently broke every sandbox
  timeout during heavier eval runs, and a missing HTTP client timeout that
  let one hung API call block an entire batch run for over an hour.
- **Diagnosed a retrieval failure with real measurements, not guesses**: an
  initial hit-rate of 40% on hand-written questions was traced through three
  separate, measured causes (narrative text crowding out numeric cells in a
  shared index, a reranker preferring fluent prose over terse facts, and a
  ticker-vs-legal-name mismatch) to a fully fixed 100%.
- **Kept the system swappable by design**: the LLM provider, the PoT
  generation mode (bare vs. reasoning-augmented), and the eval dataset
  split are all config-level choices, not hardcoded paths.

---

## Tech stack

- **Backend:** Python 3.11, FastAPI, LangGraph
- **LLM access:** provider-abstraction layer (Gemini default, Anthropic
  Claude and local Ollama as swap-in alternatives)
- **Filing ingestion:** `edgartools`, real iXBRL-tagged SEC 10-K data
- **Retrieval:** FAISS (two separate indices for table cells vs. narrative
  text), `sentence-transformers` embeddings, a cross-encoder reranker
- **Execution:** restricted subprocess sandbox (import allowlist, no
  network/filesystem, hard timeout)
- **Experiment tracking:** MLflow
- **Frontend:** Next.js 16, React, Tailwind
- **Testing:** pytest, 49 tests covering ingestion, retrieval, the sandbox's
  security boundary, the verifier, the API, and full end-to-end runs

---

## Known limitations (stated plainly, not buried)

- The verifier's checks are heuristic and hand-tuned against observed
  failure cases, not learned or formally validated against a labeled
  error-detection benchmark.
- It cannot catch "right data, wrong formula" errors — a known, measured
  blind spot, not a hypothetical one.
- Sandbox isolation is Python-level (restricted builtins/imports), not
  OS-level (no container or seccomp boundary) — adequate for a portfolio
  project, not for untrusted multi-tenant production use without additional
  isolation.
- A smaller local 7B model was tested and does not reliably follow the
  cell-referencing contract that the configured default does — model
  capability isn't a drop-in swap without re-validating prompt reliability.
- Evaluated on FinQA only; ConvFinQA, TAT-QA, and FinanceBench loaders are
  scaffolded but not yet built out.

---

## Links

- Full repository README, architecture detail, and setup instructions: see
  the project root.
- Full audit methodology, the four-way comparison table, and worked
  examples of the error-class analysis: `eval/AUDIT_NOTES.md`.
- Complete taxonomy of every bug found during development, with root cause
  and fix: `FAILURE_MODES.md`.
- System capabilities, intended use, and verifier specifics: `MODEL_CARD.md`.
