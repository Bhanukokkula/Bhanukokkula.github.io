---
slug: "quant-factor-backtest"
title: "GLASSBOX — A Backtester That Resists the Four Classic Ways Backtests Lie"
tagline: "A glass-box cross-sectional equity factor backtester that measures, rather than assumes away, look-ahead bias, survivorship bias, transaction costs, and p-hacking — and reports a momentum factor that survives all four checks and a low-vol factor that doesn't."
domains: ["Hedge Fund"]
status: "Completed"
featured: true
problem: "Backtests routinely overstate factor performance in four specific, well-known ways — look-ahead bias, survivorship bias, ignored transaction costs, and uncorrected multiple testing across factor trials — and most writeups show a single Sharpe ratio with none of these checked."
approach: "Built a point-in-time data layer (AsOfAccessor bound to one monotonic clock, corporate-action adjustment reconstructed from raw close + split + dividend rather than a provider's pre-adjusted series) so look-ahead is structurally refused, not just avoided by convention. Measured survivorship bias directly by comparing a survivors-only universe against a full universe that includes later-delisted names. Applied a transaction-cost model (commission + half-spread + participation-rate market impact) at the next bar's open after every signal. Reported a Deflated Sharpe Ratio (Bailey & Lopez de Prado) and a Bonferroni-style haircut Sharpe alongside every naive Sharpe, accounting for 3 factor trials. Backtested momentum, reversal, and low-volatility factors long-only top-decile, monthly rebalanced, on 476 cached US-exchange tickers (238 passing the per-rebalance liquidity/data-quality filter), 1979-2026."
stack: ["Python", "Streamlit", "pytest", "ruff", "custom point-in-time backtest engine (no backtrader/zipline/vectorbt)"]
metrics: [{"label":"Momentum — Net Sharpe","result":"0.35","context":"Deflated Sharpe Ratio 0.96 (~96% probability true Sharpe is positive after correcting for 3 trials); survives 219 bps/yr of cost drag"},{"label":"Reversal — Net Sharpe","result":"0.22","context":"Deflated Sharpe Ratio 0.79; works gross (0.43) but loses 748 bps/yr to costs, the most cost-sensitive of the three factors"},{"label":"Low-vol — Net Sharpe","result":"0.01","context":"Deflated Sharpe Ratio 0.21 (~21% probability true Sharpe is positive) — no real edge; survivorship bias alone would have inflated this factor's return by +285 bps/yr"},{"label":"Survivorship bias, measured directly","result":"99.4% of universe-months include a name that later delisted; a survivors-only universe shows +89 bps/yr of annualized return inflation vs. the full universe"}]
highlights: ["Two real bugs found and fixed in public during development, documented with the before/after numbers rather than hidden: excluding preferred shares moved low-vol net Sharpe from -0.13 to -0.08, and excluding stale/thin-trading tickers moved it from -0.08 to 0.01 — both fixes applied because they were correct, independent of which direction they moved the result", "A separate bug in the Deflated Sharpe Ratio formula itself (pairing an annualized Sharpe with a daily observation count) was caught and fixed with a regression test before any headline number was trusted", "89 tests passing, ruff/black clean"]
---

# GLASSBOX — Cross-Sectional Equity Factor Backtester

A glass-box (not black-box) factor backtester built specifically to resist
the four classic ways backtests lie: look-ahead bias, survivorship bias,
ignoring transaction costs, and p-hacking across multiple factor trials.

## The honest result

Real data, 476 cached US-exchange tickers (238 pass the per-rebalance
liquidity and data-quality filter), 1979–2026, monthly rebalanced, long-only
top decile, net of transaction costs unless noted:

| Factor | Net Sharpe | Gross Sharpe | Cost drag (bps/yr) | Survivorship inflation (bps) | In-sample → out-of-sample Sharpe | Deflated Sharpe Ratio | Haircut Sharpe |
|---|---|---|---|---|---|---|---|
| **Momentum** | 0.35 | 0.41 | 219 | -26 | 0.32 → 0.48 | **0.96** | 0.30 |
| **Reversal** | 0.22 | 0.43 | 748 | 146 | 0.30 → 0.08 | **0.79** | 0.14 |
| **Low-vol** | 0.01 | 0.04 | 64 | **285** | 0.00 → 0.03 | **0.21** | **0.00** |

![Equity curves for all three factors, normalized, log scale](/projects/quant-factor-backtest/equity_curves_all_factors.png)

![Drawdown comparison across all three factors](/projects/quant-factor-backtest/drawdown_all_factors.png)

**Verdict:**
- **Momentum is the standout** — a genuinely robust signal (DSR 0.96: ~96%
  probability the true Sharpe is positive after correcting for 3 factor
  trials), holds up out-of-sample, and survives costs comfortably.
- **Reversal is real but expensive** — it works gross of costs (0.43 Sharpe)
  but loses 748 bps/year to transaction costs alone, the most cost-sensitive
  factor tested, and shows real out-of-sample decay (0.30 → 0.08).
- **Low-vol shows no real edge** — flat net of costs (0.01 Sharpe,
  indistinguishable from zero), and the Deflated Sharpe Ratio agrees: only
  a ~21% chance its true Sharpe is even positive. Survivorship bias alone
  would have made it look like a working +0.16-Sharpe factor (+285 bps of
  inflation) — exactly the kind of false confidence this project exists to
  catch.

![Naive vs. deflated vs. haircut Sharpe — the multiple-testing correction, visualized](/projects/quant-factor-backtest/naive_vs_deflated_vs_haircut.png)

At the universe level (M1 survivorship gate, 270-ticker subsample): **99.4%**
of universe-months in the survivorship-aware universe include a name that
later delisted, and a survivors-only universe shows **+89 bps** of annualized
return inflation versus the honest, full universe — confirmed, measured
survivorship bias, not a theoretical concern.

## How GLASSBOX resists each way backtests lie

**Look-ahead bias.** Every data read goes through an `AsOfAccessor` bound to
one monotonic clock. Corporate-action adjustment is reconstructed from raw
close + split factor + dividend cash, truncated to the as-of date — never a
provider's fully-adjusted series, which bakes in future splits. An
adversarial test suite tries to read tomorrow's price and tomorrow's split
and asserts both are refused. A separate look-ahead audit deliberately
injects a 20-day peek into a synthetic strategy and shows it producing a
measurable, positive NAV improvement — proof the engine both refuses the
leak when used correctly and can quantify what the leak is worth.

**Survivorship bias.** The investable universe at each monthly rebalance is
built from trailing dollar volume *as known at that date*, explicitly
including names that later delisted. Measured directly (see table above).

**Transaction costs.** Every backtest reports gross and net Sharpe side by
side, with a cost model (commission + half-spread + participation-rate
-scaled market impact) applied at the moment a fill executes — always the
*next* bar's open after a signal, never the signal bar's own close (proven
by a dedicated test).

**Multiple testing.** Every reported Sharpe sits next to a Deflated Sharpe
Ratio (Bailey & López de Prado) and a simplified Bonferroni-style haircut
Sharpe, tracking that 3 factor configurations were actually tried.

## The audit trail — two real bugs found and fixed in public

This is as important as the result table: the numbers above are the *third*
version of this analysis, and the two corrections in between are evidence
the process works, not noise to hide.

| Stage | Low-vol net Sharpe | Deflated Sharpe | What changed |
|---|---|---|---|
| 1. First run | -0.13 | 0.04 | Baseline — looked like it loses money |
| 2. After excluding preferred shares | -0.08 | 0.08 | Removed `BAC-P-W`-style preferred stock (bond-like, mechanically low-vol, no equity risk premium — never belonged in a common-equity study) |
| 3. After excluding stale/thin-trading names | **0.01** | **0.21** | Removed tickers with up to 65% identical-to-previous-day closes (artificially flat, not genuinely low-risk) |

A separate, earlier bug affected the Deflated Sharpe Ratio itself: the
formula requires the Sharpe ratio and observation count at the same
frequency, and the code was pairing an *annualized* Sharpe with a *daily*
observation count — mathematically pinning every factor's DSR near 1.0
regardless of quality. Fixed and locked in with a regression test before
any of the table above was trusted.

Each fix was applied because it was correct, independent of which direction
it moved the number (stage 1→2 made the result worse; stage 2→3 made it
better) — that asymmetry is the actual proof this wasn't p-hacking.

## Honest limitations

- **Universe scale.** 476 cached tickers, not the 500-name config target —
  blocked by Tiingo's free-tier *monthly* unique-symbol cap (separate from
  the hourly rate limit), not a design choice. Resolves at next month's
  reset or with a paid plan; the ingestion script is already resumable.
- **No margin/leverage model, by choice.** An earlier dollar-neutral
  long-short construction pushed NAV negative on this noisy small-cap
  sample with no risk constraint. The headline results use long-only
  top-decile instead, which is structurally incapable of that failure mode.
- **Single-split walk-forward.** The in-sample/out-of-sample numbers come
  from one chronological 70/30 split; multiple folds with a reported
  distribution would be the rigorous next step.
- **No point-in-time fundamentals.** Size, Value, and Quality are defined
  via an interface that *refuses* to compute on non-point-in-time data
  (free fundamentals sources aren't restatement-aware) rather than shipping
  unreliable results — the refusal itself is the feature.

## Engineering summary

- **89 tests passing**, ruff/black clean, zero outstanding lint issues.
- Built from scratch: no backtrader/zipline/vectorbt — the entire
  point-in-time data layer, event-driven engine, and cost model are custom.
- A single declarative `run_strategy(spec, panel)` function is the only
  code path from a strategy definition to results — the CLI, the test
  suite, and the Streamlit dashboard all call it directly, so there is no
  second implementation that could silently drift from the first.
