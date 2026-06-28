---
slug: "mars"
title: "MARS — Multi-Agent Risk Synthesis"
tagline: "Four specialist agents read filings, news, macro data, and earnings calls independently; a deterministic, evidence-weighted engine — not another LLM call — reconciles what they disagree on."
domains: ["AI Engineering","Hedge Fund","Investment Banking"]
status: "Completed"
featured: true
problem: "Risk signals live across disconnected sources (filings, news, macro, earnings calls) that frequently disagree, and asking a single LLM to read everything and decide is a black box."
approach: "Four concurrent specialist agents — FilingAnalyst (SEC EDGAR 10-K/10-Q), NewsSentinel (NewsAPI), MacroMonitor (FRED), EarningsAnalyst (Finnhub transcripts) — each score risk direction and confidence from their own evidence. A pure, deterministic resolution engine combines signals as a confidence- and evidence-quality-weighted average (audited filings weighted highest, soft news lowest), clamped to a stable band near zero, with full dissent reporting whenever an agent disagrees with the resolved direction. Orchestrated via LangGraph fan-out/fan-in with FastAPI + Streamlit, backed by SQLite caching and a ChromaDB evidence store, behind a model-agnostic provider layer (Gemini 2.5 Flash by default)."
stack: ["Python","LangGraph","ChromaDB","FastAPI","Streamlit","SQLite","Gemini 2.5 Flash","provider-abstraction layer","pytest"]
metrics: [{"label":"Test suite","result":"123 passing tests"},{"label":"Specialist agents","result":"4 (Filing, News, Macro, Earnings)"},{"label":"Live run — AAPL composite","result":"+0.65 score, \"increasing\" direction, 65% confidence (3 of 4 agents contributing)"}]
highlights: ["No agent fabricates a signal when its data source has nothing to say — it abstains rather than guessing","Honest limitation: the 20-event historical backtest is built but not run to completion — it hit the Gemini free-tier daily quota partway through, and a full run may still exceed the daily reset","NewsSentinel and EarningsAnalyst abstain across the entire historical date range (free-tier news history and transcript-API access limits), so the backtest that does run measures only FilingAnalyst + MacroMonitor + the resolution engine — stated plainly rather than implied as a full 4-agent result","Model-agnostic provider layer makes the underlying LLM a swappable choice"]
---

# MARS — Multi-Agent Risk Synthesis

## What it is

MARS estimates whether a public company's credit/operational risk is
**increasing**, **decreasing**, or **stable**, by running several specialist
LLM agents over independent evidence sources in parallel and reconciling
their signals through a deterministic, evidence-weighted resolution engine —
rather than asking a single model to "just decide."

Given a ticker (and optionally an `as_of` date, for historical/backtesting
use), MARS produces a structured `RiskAssessment`: a composite score and
direction, a composite confidence, a step-by-step reasoning chain, every
agent's underlying signal and findings, and any dissenting views.

## Why multi-agent, why a resolution engine (not just an LLM call)

A single LLM asked "is this company riskier than last quarter?" has no
principled way to weigh a hard fact buried in a 10-K against a vague,
sentiment-laden news article — it just blends them in whatever way its
training nudges it toward, with no visibility into *why*. MARS instead:

1. Separates evidence into four independent domains (regulatory filings,
   news, macroeconomic context, earnings calls), so each domain gets a
   focused prompt instead of one model juggling four contexts at once.
2. Asks each LLM call to do exactly one thing: read its domain's evidence
   and emit a structured judgment with a direction, confidence, and a
   reasoning chain.
3. Combines those judgments with a **pure, deterministic function** — no
   LLM in the loop — that weights each signal by its evidence type's
   inherent reliability and its stated confidence, explicitly detects when
   agents disagree, and prioritizes hard quantitative evidence over soft
   evidence in a conflict.

The result is explainable by construction: every number in the output can
be traced back to which agent said what, with what confidence, backed by
which evidence type — not a black-box verdict.

## Architecture

```
                 ┌────────────────┐
   ticker ──────▶│   LangGraph     │
   as_of         │   fan-out       │
                 └────────┬────────┘
                           │
        ┌──────────┬───────┴───────┬──────────┐
        ▼          ▼               ▼          ▼
 FilingAnalyst NewsSentinel   MacroMonitor EarningsAnalyst
  (SEC 10-K/    (recent news)  (FRED macro  (earnings call
   10-Q)                        indicators)  transcripts)
        │          │               │          │
        └──────────┴───────┬───────┴──────────┘
                            ▼
                  resolve_signals()
              (evidence-weighted synthesis,
               conflict handling, dissent)
                            │
                            ▼
                     RiskAssessment
```

### The four specialist agents

| Agent | Evidence source | Evidence type | What it looks for |
|---|---|---|---|
| **FilingAnalyst** | SEC EDGAR 10-K / 10-Q (Item 1A Risk Factors, Item 7 MD&A) | `audited_filing` / `unaudited_filing` | Disclosed risk language, going-concern doubt, deteriorating/improving fundamentals |
| **NewsSentinel** | Recent news coverage (NewsAPI) | `hard_news` / `soft_news` | Material events vs. sentiment-only coverage, classified by the agent itself |
| **MacroMonitor** | FRED macro series (fed funds rate, CPI, unemployment, yield curve) | `macro_data` | Sector-relevant macro headwinds/tailwinds |
| **EarningsAnalyst** | Earnings call transcripts (Finnhub) | `earnings_transcript` | Guidance language, hedging, management tone shifts |

Each agent fetches its own evidence, then asks the LLM to fill a structured
`AgentSignalDraft` (direction, confidence 0–1, time horizon, findings with
severity, reasoning chain). **If an agent's data source has nothing usable
for that ticker/date, it abstains** (returns no signal) instead of guessing
or crashing the whole run — this is what lets MARS degrade gracefully when
a data provider has no coverage for a given company or period.

### The resolution engine (`resolve_signals`)

A pure function, fully unit-testable with hand-built fixtures, no I/O:

- **Evidence-quality weights** (fixed, not learned): audited filing 1.0 >
  macro data 0.9 > unaudited filing 0.85 > earnings transcript 0.8 > hard
  news 0.7 > soft news 0.5.
- **Composite score** = Σ(weight·confidence·polarity) / Σ(weight·confidence),
  clamped to [-1, 1]. Polarity is +1/−1/0 for increasing/decreasing/stable.
- **Composite confidence** combines the weighted-average agent confidence
  with how decisive the composite score is (a score near zero can't carry
  full confidence even if every agent was individually confident).
- **Stable band**: scores within ±0.15 of zero resolve to `stable` rather
  than forcing a direction on noise.
- **Conflict handling**: if agents disagree on direction (some increasing,
  some decreasing), MARS checks confidence first — if everyone's confidence
  is low, it flags genuine uncertainty rather than picking a side. Otherwise
  it re-resolves using only quantitative evidence (filings, macro data),
  falling back to the full weighted average only if no quantitative
  evidence exists.
- **Dissent reports**: any agent whose direction differs from the resolved
  direction *and* whose confidence clears a threshold is recorded as a named
  dissenter with its own basis and a recommendation to review it — so a
  user never sees a single number without seeing who disagreed and why.

### Orchestration

A LangGraph graph fans out from `START` to one node per agent (running
concurrently), then fans in to a single synthesis node. `as_of` is threaded
through every layer — ingestion, agents, and the graph state — so a run can
be pinned to a historical date and agents will only use data available on
or before it. This is what makes honest backtesting possible: there's no
way for a historical run to accidentally "see" the outcome it's being
scored against.

### Supporting infrastructure

- **LLM provider abstraction**: a single interface (`structured_call`) with
  a live Gemini implementation (with retry/backoff) and a Claude
  implementation, swappable via one environment variable.
- **Ingestion + cache**: SQLite-backed cache in front of every external
  call (EDGAR, FRED, NewsAPI, Finnhub), so repeated runs against the same
  ticker/date don't re-fetch.
- **Persistence**: every assessment is saved to SQLite (`assessments` →
  `agent_signals` → `findings`, plus `dissents`), retrievable later by
  ticker.
- **RAG evidence store**: every evidence chunk an agent used is embedded
  locally (`sentence-transformers/all-MiniLM-L6-v2`, no embedding API call)
  and stored in ChromaDB with an ID that traces back to the exact run and
  chunk — so any finding can be traced to its source text.
- **API + UI**: a FastAPI service (`POST /assess`, `GET /assess/{ticker}`)
  and a Streamlit front-end that visualizes the composite result, the
  reasoning chain, each agent's expandable signal detail, and dissent.

## Evaluation methodology

`eval/` is a backtesting harness, separate from the production code path,
built to answer one question honestly: *when MARS is run as-of a past date
using only data available then, how often does its predicted direction
match what actually happened?*

- **`eval/events.json`**: 20 independently-verified, real historical events
  (not invented) — companies whose risk direction over a specific window is
  a matter of public record (bankruptcies, going-concern filings, debt
  restructurings, earnings-driven re-ratings, and calm baseline periods for
  stable blue chips). Every event's `description` field cites the specific
  dated evidence (an earnings report, an 8-K, a filing) that would have
  been available as of that date — each one was checked against public
  sources before being added, specifically to avoid "labeling with
  hindsight" (e.g. an event dated *before* the news that justifies its
  label would be future leakage; every event in the file was checked for
  this).
- **`eval/backtest.py`**: runs MARS once per event with `as_of` pinned to
  that event's date, and scores the predicted direction against the
  verified label.
- **`eval/metrics.py`**: directional accuracy, a confusion matrix,
  per-direction precision/recall/support, and confidence calibration
  (does MARS's stated confidence actually track its hit rate?).
- **`eval/ablation.py`**: compares full MARS against each single agent
  alone and against a naive unweighted average — to make the resolution
  engine's contribution (if any) visible rather than assumed.

**Known coverage limits of this specific event set** (confirmed by running
the live ingestion code against the real APIs, not assumed):
- NewsSentinel abstains on every one of the 20 events — NewsAPI's free tier
  only serves articles from roughly the past month, and all 20 events are
  dated 2018–2023.
- EarningsAnalyst abstains for every ticker — Finnhub's transcript-list
  endpoint returns HTTP 403 on the current API plan (premium-only feature).
- FilingAnalyst and MacroMonitor work for all 20 events. Four originally
  candidate tickers (SIVB, SBNY, FRC, WE) were dropped from the set because
  they're delisted and absent from SEC's current ticker→CIK map, which
  would have left only the ticker-agnostic MacroMonitor signal for them —
  not a meaningful test of company-specific reasoning.

So this backtest, as currently scoped, is really testing **FilingAnalyst +
MacroMonitor + the resolution engine**, not all four agents — see
[RESULTS.md](RESULTS.md) for what has and hasn't actually been run.

## Tech stack

Python 3.11+, Pydantic v2 (data contracts), LangGraph (orchestration),
Google Gemini / Anthropic Claude (LLM), httpx (async ingestion), SQLite
(cache + persistence), ChromaDB + sentence-transformers (RAG), FastAPI +
Streamlit (service + UI), pytest + pytest-asyncio (tests, 123 passing).

## Honesty constraints this project holds itself to

- No agent ever fabricates a signal when its data source has nothing — it
  abstains.
- No backtest event's label is accepted without an independently checkable
  source.
- No metric is ever hardcoded to look "measured" — every number in
  [RESULTS.md](RESULTS.md) is either the literal output of a real run
  (timestamped) or explicitly marked as not yet run.

---

## Results — current state, honestly

This file distinguishes three different things that are easy to conflate:
(1) a **live demo run** of the full pipeline against real APIs (done, real
numbers below), (2) the **verified historical backtest** the evaluation
harness exists to run (not yet completed), and (3) what that backtest
*would* measure once it is run. Nothing below is invented or estimated —
every number is either copied directly from a real run's output or marked
as not yet available.

## 1. Live demo run (real, completed 2026-06-23)

Two live end-to-end runs were executed against the running FastAPI service
and Streamlit UI — ticker `AAPL`, current date (no `as_of`, i.e. "as of
today"), using the real Gemini API, real SEC EDGAR filings, real FRED
data, and real NewsAPI articles.

![MARS result for AAPL — composite score, direction, and confidence](/projects/mars/03_ui_result_AAPL.png)

*Live result screen for AAPL: composite score +0.65, direction "increasing,"
65% composite confidence, with each contributing agent's signal shown below.*

**Run 1** (`images/03_ui_result_AAPL.png`):
- Risk direction: **increasing**, composite score **+0.65**, composite
  confidence **65%**
- 3 of 4 agents contributed a signal (EarningsAnalyst abstained — see
  below); no directional conflict among them
  - `filing_analyst`: increasing, confidence 0.95, evidence type
    `unaudited_filing`
  - `macro_monitor`: stable, confidence 0.70, evidence type `macro_data`
  - `news_sentinel`: increasing, confidence 0.70, evidence type `soft_news`
- 1 dissenting agent recorded: `macro_monitor` (called it stable while the
  composite resolved to increasing)

**Run 2**, same ticker, run again minutes later
(`images/04_agent_signal_detail.png`, `images/05_dissenting_views.png`):
- Risk direction: **increasing**, composite score **+0.61**, composite
  confidence **66%**
- Same 3 contributing agents, same qualitative conclusion, slightly
  different confidences (filing_analyst 0.90, macro_monitor 0.80,
  news_sentinel 0.70) and therefore a slightly different composite score —
  this is expected LLM non-determinism between calls, not a bug; the
  *direction* and *which agent dissents* were stable across both runs.

**EarningsAnalyst abstained in both runs.** This is not specific to AAPL or
to historical dates: Finnhub's `/stock/transcripts/list` endpoint returns
HTTP `403 You don't have access to this resource` on the current API plan
for every ticker tested, so EarningsAnalyst currently never contributes —
confirmed by a direct API call, not inferred.

## 2. Verified historical backtest — not yet run to completion

`eval/events.json` contains 20 independently-verified real events spanning
2018–2023 (see [PROJECT_DETAILS.md](PROJECT_DETAILS.md) for how they were
selected and verified). Running

```bash
python -m eval.backtest
```

against this file is what would produce a real, citable accuracy number
for MARS on historical data. **This has not been run to completion**: an
earlier attempt hit Gemini's free-tier quota of 20 `generate_content`
requests/day, which was exhausted partway through the very first event.
The quota appears to reset on a daily cycle — the live demo runs above
succeeded later the same day, after enough time had passed — but a full
20-event run needs on the order of 40 LLM calls (FilingAnalyst +
MacroMonitor per event; NewsSentinel and EarningsAnalyst abstain on this
historical date range — see below), which may still exceed what resets in
a day on the free tier.

**No accuracy/precision/recall/calibration numbers exist yet for the
historical event set.** Reporting any such number without actually running
the harness would be exactly the kind of fabrication this project is
explicit about avoiding. When it is run, `print_report()` will compute and
print all of the following directly from real results, with no hardcoded
values:
- Directional accuracy (overall, and via a confusion matrix)
- Per-direction precision / recall / support
- Confidence calibration (stated confidence vs. actual hit rate, bucketed)
- Ablation: full MARS vs. each single agent alone vs. a naive unweighted
  average — to show whether the resolution engine adds anything over
  simpler baselines

**Known constraint on this specific event set**, confirmed against the
live providers before the events were added: NewsSentinel abstains on all
20 events (NewsAPI free tier only serves ~1 month of history; these events
are dated 2018–2023) and EarningsAnalyst abstains on all of them (same
Finnhub 403 as above). So once run, this backtest measures
**FilingAnalyst + MacroMonitor + the resolution engine**, not the full
four-agent system — that's a real limitation of the current free-tier data
plans, not of the architecture.

## How to actually get a real backtest number

1. Either wait for the Gemini daily quota to reset and run a few events at
   a time (`eval/backtest.py --events <subset-file>` accepts any subset),
   or move to a paid Gemini plan, or set `ANTHROPIC_API_KEY` +
   `LLM_PROVIDER=claude` in `.env` to use a different provider with its own
   quota.
2. Run `python -m eval.backtest` (full default event set) or with
   `--events path/to/subset.json` for a partial run.
3. The printed report is the result — copy it here (or regenerate this
   file) rather than re-typing numbers by hand.
