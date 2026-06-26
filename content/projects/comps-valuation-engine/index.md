---
slug: "comps-valuation-engine"
title: "Automated Comps & Valuation Engine"
tagline: "Finds a company's true peer set, normalizes their financials, and benchmarks valuation multiples into an implied range — the analysis an IB desk runs by hand."
domains: ["Investment Banking"]
status: "Completed"
featured: true
problem: "Comparable company analysis is core IB valuation work, and its accuracy lives or dies on peer selection — pick the wrong comparables and every multiple downstream is meaningless. The judgment-heavy first step is exactly what's hardest to automate honestly."
approach: "Pulls fundamentals from SEC EDGAR companyfacts and prices from yfinance into a static snapshot, so the demo has no runtime API dependency. A transparent peer-similarity model — SIC-based sector bucketing plus standardized weighted-distance ranking over size, profitability, growth, and leverage — surfaces ranked, inspectable peers an analyst can override. It computes EV/Revenue, EV/EBITDA, EV/EBIT, P/E, and P/B, excludes negative or near-zero denominators rather than zero-filling, and renders a peer-median football-field chart with P25–P75 ranges."
stack: ["Python","SEC EDGAR companyfacts API","yfinance","pandas","Streamlit","matplotlib","pytest"]
metrics: [{"label":"Universe","result":"242-company curated snapshot"},{"label":"Peer-set validation","result":"90.6% in-sample agreement (n=8, tuned during bucket design — not held out)"},{"label":"Test suite","result":"32 passing tests"},{"label":"Multiples covered","result":"EV/Revenue, EV/EBITDA, EV/EBIT, P/E, P/B"}]
highlights: ["90.6% in-sample peer-set agreement against 8 hand-labeled reference sets — tuned during bucket design and reported in-sample on a small set (n=8), not held out","Two real bugs caught only by running the app, not by unit tests: an Altair/Python 3.14 incompatibility (moved to matplotlib), and a thin-data peer ranking #1 off a single shared feature (fixed with the ≥4/7 rule)","242-company curated snapshot — a deliberately eyeball-checkable universe over a larger one, with the reasoning documented","Peer-similarity model with full feature provenance and a thin-data flag requiring ≥4/7 comparable features for full ranking","Honest limitation: EDGAR carries fundamentals but not prices, so market data comes from a separate source and the static snapshot goes stale","Honest limitation: negative or near-zero EBITDA breaks EV/EBITDA and is excluded, not zero-filled","Honest limitation: accounting non-comparability (fiscal-year mismatches, one-time items, GAAP vs IFRS for ADRs) is flagged but not fully normalized away","Honest limitation: comps inherit sector mispricing — if the whole peer set is mis-valued, the implied range is too"]
---

# Automated Comps & Valuation Engine

A deterministic, no-LLM, no-heavy-ML comparable-company analysis tool: pick a
target company, get a ranked peer set, see valuation multiples benchmarked
against the peer distribution, and get an implied valuation range — the
classic investment-banking "comps" workflow, automated end to end from
public data.

This folder is a standalone summary of the project (full source lives in
`comps-engine/`). It exists to carry the project's details, real results,
and screenshots in one place.

![Dashboard overview](/projects/comps-valuation-engine/dashboard_overview.png)
![Football field chart](/projects/comps-valuation-engine/football_field_screenshot.png)

---

## Problem

Comparable company analysis is core IB valuation work, and its accuracy
lives or dies on peer selection — pick the wrong comparables and every
multiple downstream is meaningless. The judgment-heavy first step (who is a
*real* peer) is exactly what's hardest to automate honestly, so that's
where most of the engineering effort went, not in model complexity.

## Approach

- **Data strategy:** two free, no-API-key sources, pulled once into a
  **static snapshot** so the dashboard has zero runtime API dependency and
  zero rate-limit fragility.
  - **Fundamentals:** SEC EDGAR `companyfacts` API
    (`https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit}.json`),
    descriptive `User-Agent` required. Revenue, net income, operating
    income, D&A, total debt, cash, shares outstanding, total assets, book
    equity — extracted from the latest 10-K with full tag-level provenance
    (which XBRL tag supplied each number is recorded per company).
  - **Prices / market cap:** yfinance, fetched once at snapshot-build time.
    EDGAR has fundamentals but no market prices, so this is necessarily a
    second source — and the reason the snapshot goes stale by design.
- **Normalization (`normalize.py`):** EBITDA is reconstructed explicitly as
  `OperatingIncomeLoss + DepreciationDepletionAndAmortization` (not a
  reported XBRL tag) — missing components are left `None` and flagged, never
  zero-filled. Total debt, net debt, fiscal-year staleness, and a
  GAAP/IFRS-comparability flag for foreign private issuers are all handled
  the same way: compute what the data supports, flag what it doesn't.
- **Peer-similarity model (`peers.py`) — the intellectual core:** SIC codes
  are hand-bucketed into ~17 sector groups as a **hard filter** (SIC alone
  is too granular for how bankers actually group comps — e.g. apparel
  makers and restaurant chains have nearby SIC codes but are never real
  comps for each other). Within a sector bucket, peers are ranked by a
  weighted Euclidean distance over a standardized feature vector: size
  (log revenue, log market cap, log total assets), profitability (EBITDA
  margin, net margin), growth (revenue CAGR), and leverage (net debt /
  EBITDA). A company with fewer than 4 of 7 comparable features is still
  returned but ranked after fully-compared peers and flagged `thin_data` —
  this exists because an early version let a foreign issuer with only
  market cap data rank #1 purely by coincidence on one shared dimension.
- **Multiples (`multiples.py`):** EV/Revenue, EV/EBITDA, EV/EBIT, P/E, P/B.
  Negative or near-zero EBITDA (and negative EBIT, net income, book equity)
  are excluded from their respective multiples rather than producing a
  meaningless ratio.
- **Valuation (`valuation.py`):** peer multiples are aggregated by
  **median** (not mean, which a single outlier could distort), with the
  full P25–P75 distribution reported. The target's own multiples are placed
  as a percentile within that distribution, and peer-median multiples are
  applied to the target's metrics to produce an implied equity-value range.
- **Dashboard (Streamlit):** target selector, ranked peer panel with
  similarity scores and manual add/remove (analysts always override the
  machine — a credibility feature, not a gap), a multiples table, a
  football-field chart, and a limitations panel rendered straight from
  `LIMITATIONS.md`.

## Real results

| Metric | Result |
|---|---|
| Universe | **242** companies (curated snapshot, not the full market) |
| Companies built with complete data | **242 / 242** (0 missing facts, 0 missing price) |
| Test suite | **32** passing tests |
| Peer-set validation | **90.6%** mean agreement vs. **8** hand-labeled reference sets — **in-sample**, tuned during sector-bucket design, **not held out** |
| Multiples covered | EV/Revenue, EV/EBITDA, EV/EBIT, P/E, P/B |

### Peer validation detail (honest, not cherry-picked)

There is no ground truth for "the correct comp set," so this is a soft spot
check against names the author hand-labeled from general market knowledge —
reported with the misses shown, not hidden:

| Target | Sector bucket | Agreement | Missed by model |
|---|---|---|---|
| JPM | Banks | 100% | — |
| XOM | Energy | 100% | — |
| KO | Consumer Staples | 100% | — |
| NKE | Apparel & Footwear | 100% | — |
| AAL | Transportation | 100% | — |
| SO | Utilities | 100% | — |
| MCD | Restaurants & Leisure | 75% | DPZ |
| HD | General & Specialty Retail | 50% | ROST, TJX |
| **Mean** | | **90.6%** | |

Full machine-readable detail: [`peer_validation.json`](peer_validation.json).
Snapshot build metadata: [`meta.json`](meta.json).

### Two real bugs caught only by running the app (not by unit tests)

1. An Altair/Python 3.14 incompatibility in the football-field chart —
   fixed by moving the chart to matplotlib.
2. A thin-data peer being ranked #1 purely by coincidence on a single
   shared feature (e.g. matching market cap with no other comparable
   data) — fixed by requiring ≥4 of 7 features before a peer is ranked
   ahead of fully-compared candidates (`thin_data` flag otherwise).

## Stack

Python, SEC EDGAR `companyfacts` API, yfinance, pandas, NumPy, Streamlit,
matplotlib, pytest.

## Limitations (the project's honesty discipline, not an afterthought)

1. EDGAR carries fundamentals but not prices, so market data comes from a
   separate source (yfinance) and the static snapshot goes stale the
   moment prices move — by design, to keep the demo dependency-free.
2. Peer selection has no ground truth; the 90.6% is **in-sample** agreement
   on 8 reference sets used *during* sector-bucket design, not a held-out
   test — wide error bars at that sample size.
3. Negative or near-zero EBITDA breaks EV/EBITDA and is excluded, not
   zero-filled (same logic applied to EV/EBIT, P/E, P/B on their own
   denominators).
4. Accounting non-comparability — fiscal-year mismatches, one-time items,
   GAAP vs. IFRS for ADRs/foreign private issuers — is flagged
   (`stale_filing`, `no_10k_data_likely_foreign_private_issuer_or_ifrs`,
   etc.) but not fully normalized away.
5. Comps inherit sector mispricing: if the whole peer set is over- or
   under-valued, the implied range is too.
6. The universe is a fixed 242-name snapshot, not the full market — a
   deliberately eyeball-checkable size, not a coverage target.

Full detail: see `LIMITATIONS.md` in the source repo (`comps-engine/`).

## Source

Full source code, tests, and the live build pipeline live in the sibling
`comps-engine/` directory at the same level as this folder.

---

## Limitations

This is a deterministic, data-discipline project. Every limitation below is
real, specific, and was discovered while building this snapshot — not a
generic disclaimer.

## 1. Prices and fundamentals come from two different sources, at two different times

SEC EDGAR's `companyfacts` API has fundamentals (revenue, income, balance
sheet) but **no market prices** — EDGAR is purely a filings database.
Market cap and the price-based numerator of every multiple come from a
second source (Yahoo Finance, via `yfinance`), fetched in the same
snapshot-build run but representing a *different point in time* than the
underlying fundamentals (the most recent 10-K, which can be many months
old). The snapshot is dated and labeled "data as of {date}" everywhere in
the dashboard, but the moment that date passes, both halves of every
multiple are stale, and they were never perfectly synchronized to begin
with even at build time.

## 2. Peer selection has no ground truth — validation is inherently soft

There is no canonical "correct" comp set for any company. We validated the
peer model by hand-labeling reference peer sets for 8 well-known names and
checking overlap with the model's top-10 ranked peers within the same
sector bucket. Mean agreement: **90.6%** (see
`data/snapshot/peer_validation.json` for the full breakdown, generated by
`src/validate_peers.py`).

This is reported honestly including the misses:
- **MCD (75%)**: missed DPZ (Domino's) — DPZ is a much smaller-cap,
  franchise-heavy model than the other quick-service names, so it scores
  as a size/structure outlier within "Restaurants & Leisure" even though a
  banker would still comp it.
- **HD (50%)**: missed ROST and TJX — these are off-price apparel
  retailers that share a SIC-derived sector bucket ("General & Specialty
  Retail") with big-box names like HD, LOW, COST, WMT, TGT, but are a
  different business model (smaller footprint, inventory-driven margin
  structure) and end up ranked as size/margin outliers relative to the
  big-box names.

An earlier, coarser sector bucket ("Consumer Discretionary" covering
apparel makers, restaurants, hotels, and general retail in one bucket)
scored 0% agreement for NKE and 25% for MCD — splitting it into
Apparel & Footwear / Restaurants & Leisure / General & Specialty Retail
brought mean agreement from 75% to 90.6%. This is direct evidence that
**the SIC-to-sector bucketing is the single biggest lever on peer
quality**, and it is a hand-curated judgment call, not an objective
mapping (see `src/peers.py:SIC_TO_SECTOR`).

## 3. Negative or near-zero EBITDA breaks EV/EBITDA, so it's excluded

EV/EBITDA is mathematically meaningless when EBITDA is negative (the ratio
sign-flips and is uninterpretable) or near zero (small denominator,
arbitrarily large ratio). We exclude — never zero-fill or clip — EV/EBITDA
whenever a company's EBITDA is at or below 0.5% of its revenue. The same
floor logic excludes EV/EBIT for non-positive operating income, P/E for
loss-making companies, and P/B for negative book equity. Every exclusion is
listed per-company in `multiples_excluded` and shown in the dashboard.

In the current 242-company snapshot, **49 companies** are missing one or
both EBITDA reconstruction components (`OperatingIncomeLoss` and/or
`DepreciationDepletionAndAmortization` not found as a duration tag in their
10-K filings) — their `ebitda` field is `None`, not zero, and they're
flagged `ebitda_missing_components`.

## 4. EBITDA is not a reported XBRL tag — it's reconstructed, and the reconstruction is imperfect

EBITDA = `OperatingIncomeLoss + DepreciationDepletionAndAmortization`. This
is the standard banker shorthand, but it is not identical to "true" cash
EBITDA for every filer (e.g. it doesn't add back stock-based compensation,
and some companies tag D&A differently between their income statement,
cash flow statement, and footnotes — we use a fallback chain of tag
synonyms, logged per-company in `tag_provenance`, but a fallback miss means
a real but untagged D&A figure is silently treated as "not found" rather
than zero).

## 5. Accounting non-comparability is flagged, not normalized away

- **Fiscal year-end mismatches**: a company with a January fiscal year-end
  and one with a December fiscal year-end are not reporting the same
  12 months, but nothing in this pipeline aligns them onto a common
  calendar period — each company's actual `fy_end` is preserved and
  surfaced, but multiples computed off mismatched periods are still
  computed and shown side by side.
- **GAAP vs. IFRS / foreign private issuers**: 12 companies in the current
  universe (e.g. ASML, TSM, BABA, JD, PDD, NTES, BIDU, SE, MELI, TM, HMC)
  file Form 20-F instead of 10-K and report no `us-gaap` 10-K duration
  facts at all in EDGAR's `companyfacts` — they are flagged
  `no_10k_data_likely_foreign_private_issuer_or_ifrs` and have no computed
  fundamentals, rather than being silently dropped or, worse, having IFRS
  figures mixed in as if they were GAAP-comparable.
- **One-time items**: `OperatingIncomeLoss` and `NetIncomeLoss` as reported
  include restructuring charges, impairments, and other one-offs. No
  adjustment is made for these — a multiple computed off a year with a
  large impairment will look distorted, and that's left visible rather
  than "cleaned up" with a judgment call this pipeline isn't positioned to
  make defensibly at scale.

## 6. Comps inherit sector mispricing

If an entire peer set is collectively over- or under-valued by the market
(a sector-wide bubble, a sector-wide selloff), the implied valuation range
produced here is too — comps analysis by construction measures relative
value within a peer group, not absolute/intrinsic value. This tool does
not attempt any independent fair-value anchor (e.g. a DCF) to catch that.

## 7. The universe is a fixed, hand-curated snapshot, not the full market

242 tickers, chosen for being large/mid-cap, liquid, and well-covered by
both SEC XBRL and Yahoo Finance — not a systematic index membership pull.
A target ticker not in `data/universe.csv` simply isn't in this tool. Peer
ranking is also constrained to *within this 242-company universe* — the
"best" peer for a company might exist in the broader market but not be in
this seed list.

## 8. A distance computed from too little data can look deceptively small

Early testing surfaced this directly: TSM ranked as AAPL's #1 "closest peer"
in the Tech Hardware & Semis bucket, ahead of CSCO, MU, AVGO, and IBM —
because TSM (a Form 20-F filer with no EDGAR 10-K fundamentals; see #5
above) had only one comparable feature (`log_market_cap`) against AAPL,
and two huge-market-cap companies will always look "close" on that single
dimension even with zero other data in common. The fix:
`src/peers.py:MIN_FEATURES_FOR_FULL_RANKING` requires at least 4 of 7
features to be comparable before a candidate is ranked among the "real"
peers; companies below that threshold are still shown (so the
data-richness gap stays visible) but pushed to the bottom and flagged
`thin_data`, rather than silently winning on an artificially small
distance. The dashboard surfaces a "Features compared" column for exactly
this reason — always check it before trusting a top-ranked peer.

## 9. Winsorization is a blunt instrument

Peer multiple distributions are winsorized at the 5th/95th percentile
before computing min/p25/median/p75/max, when there are at least 4 usable
peer values. This dampens the effect of one or two extreme outliers but
doesn't remove them from the peer set entirely, and the 5% threshold is a
fixed convention, not something tuned per sector.
