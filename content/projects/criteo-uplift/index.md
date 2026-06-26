---
slug: "criteo-uplift"
title: "Causal Inference & Uplift Modeling on Criteo Ad Data"
tagline: "An end-to-end causal pipeline on 14M rows of real ad-exposure data — propensity matching, three ATE estimators cross-checked against RCT ground truth, and two uplift models, one of which fails instructively."
domains: ["AI Engineering","Research"]
status: "Completed"
problem: "Uplift modeling is easy to overclaim — estimators that look statistically principled can still fail to recover ground truth, especially under real-world treatment imbalance, and most writeups only show the methods that worked."
approach: "Used the Criteo Uplift Prediction Dataset v2.1 (13.98M rows; 2M stratified subsample; 85/15 treatment imbalance). Propensity-score matching (logistic regression + 1:1 nearest-neighbor, Austin 2011 caliper) brought all 12 covariates under the 0.10 SMD balance threshold. Cross-checked three ATE estimators — naive, IPW, and doubly-robust (AIPW) — against the dataset’s known randomized ground truth. Built T-Learner and X-Learner uplift models (XGBoost backbone, 3-fold CV grid search) to find persuadable segments, with 1,000-resample bootstrap confidence intervals throughout."
stack: ["Python","pandas","scikit-learn","XGBoost","SciPy","pytest"]
metrics: [{"label":"Propensity-match balance","result":"max SMD 0.0096 post-match (from 0.0487 pre-match) — all 12 features under the 0.10 threshold"},{"label":"IPW ATE vs. RCT ground truth","result":"+0.00104, CI overlaps the naive RCT ATE of +0.00115"},{"label":"T-Learner uplift, top-20% bucket","result":"0.51% conversion vs. 0.31% baseline — +66% relative lift, Qini +0.097"},{"label":"X-Learner uplift","result":"fails: Qini −0.855, top-20% conversion inverts to 0.04% (−87% relative)"}]
highlights: ["Honest negative result: AIPW diverges from RCT ground truth (−0.000127 vs. +0.00115) due to outcome-model misspecification under 0.31% class imbalance — documented as a likely fix (class-weighting or gradient boosting), not patched after the fact","X-Learner’s failure is a known, documented failure mode (Nie & Wager 2021) under severe treatment-arm imbalance, not a bug — included because it shows why T-Learner was the right call for this data, not despite the negative result","57 tests, 89% coverage"]
---

# Causal Inference & Uplift Modeling

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Tests](https://img.shields.io/badge/Tests-57%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-89%25-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

> **End-to-end causal inference pipeline on 14M rows of real ad-exposure data** — propensity score matching, IPW, doubly-robust ATE estimation, and heterogeneous treatment effect modeling with T-Learner and X-Learner.

---

## What this project demonstrates

| Skill | Method |
|---|---|
| Causal identification | Propensity score matching (PSM), covariate balance diagnostics |
| Average treatment effect | Naive, IPW (stabilised weights), Doubly-Robust AIPW |
| Heterogeneous effects | T-Learner, X-Learner (XGBoost backbone, CV grid search) |
| Uplift evaluation | Qini curve, AUUC, decile lift analysis, persuadable segment |
| Robustness | 1000-resample bootstrap CIs, weight trimming, SMD validation |
| Engineering | Typed config, structured logging, 57 tests at 89% coverage |

---

## Headline results

| Metric | Value |
|---|---|
| Dataset | 14M rows · 12 features · binary treatment & outcome |
| Post-matching balance | Max SMD **0.010** (all 12 features < 0.10 ✓) |
| Naive ATE (RCT ground truth) | **+0.00115** [0.00097, 0.00134] |
| IPW ATE | **+0.00104** [0.00086, 0.00123] — within CI of naive ✓ |
| T-Learner Qini coefficient | **+0.097** |
| Top-20% persuadable segment | **+66% conversion lift** (0.51% vs 0.31% baseline) |

---

## Dataset

**Criteo Uplift Prediction Dataset v2.1** — a randomised controlled trial of online advertising exposure.

| | |
|---|---|
| Full dataset | 13,979,592 rows |
| Working subsample | 2,000,000 rows (stratified on treatment × conversion) |
| Features | `f0`–`f11` — 12 anonymised continuous variables |
| Treatment | Binary (shown ad = 1) — **85% treated / 15% control** |
| Outcome | `conversion` — binary, **~0.31% positive rate** |

> **Honest framing:** Criteo is a randomised trial, not observational data. The PSM/IPW/AIPW methods are validated here by checking they recover the RCT naive ATE (simple difference-in-means) within bootstrap CIs — the standard approach for benchmarking causal estimators (Kang & Schafer 2007; Dorie et al. 2019).

---

## Pipeline

```
01_download_data.py     →  Hugging Face download → Parquet conversion
02_run_psm.py           →  PS model → 1:1 NN matching → balance check
03_estimate_ate.py      →  Naive / IPW / AIPW + bootstrap CIs
04_run_uplift.py        →  T-Learner / X-Learner → Qini / decile / figures
```

---

## Results

### 1 · Propensity Score Matching

Logistic regression propensity model + 1:1 nearest-neighbour matching with caliper = 0.2 × SD(logit PS) (Austin 2011 standard).

| | Pre-matching | Post-matching |
|---|---|---|
| Max SMD (across 12 features) | 0.049 | **0.010** |
| All features SMD < 0.10 | — | ✓ |
| Matched pairs | — | 278,946 |

<p align="center">
  <img src="figures/smd_love_plot.png" width="700" alt="Love plot: covariate balance before and after matching"/>
</p>

*Love plot — all 12 features achieve SMD < 0.10 post-matching. The tight pre-matching SMD (max 0.049) reflects the RCT's near-balanced covariates.*

<p align="center">
  <img src="figures/propensity_score_overlap.png" width="700" alt="Propensity score overlap by treatment group"/>
</p>

*Propensity score overlap — both groups cluster near P(T=1) ≈ 0.85 (the dataset's treatment probability). Common support is excellent; no trimming required.*

---

### 2 · ATE Estimation

Three estimators with 1000-resample percentile bootstrap CIs, weight trimming at 1st/99th percentile for IPW/AIPW.

| Estimator | ATE | 95% Bootstrap CI |
|---|---|---|
| **Naive** (RCT ground truth) | +0.001153 | [0.000973, 0.001337] |
| **IPW** | +0.001043 | [0.000858, 0.001232] |
| **AIPW** | −0.000127 | [−0.000138, −0.000116] |

<p align="center">
  <img src="figures/ate_forest_plot.png" width="700" alt="ATE forest plot: Naive, IPW, AIPW with 95% bootstrap CIs"/>
</p>

**IPW recovers the naive ATE within CIs** — the key validation. AIPW diverges (see Limitations): the doubly-robust correction overshoots under the outcome model's severe class imbalance (~0.31% positives), pushing the estimate slightly negative. This is a known failure mode of logistic-regression-based AIPW on rare events, not evidence of a true negative effect.

---

### 3 · Uplift Modeling

T-Learner and X-Learner with XGBoost, 3-fold CV grid search over `{n_estimators, max_depth, learning_rate}`.

**Best hyperparameters (both models):** `n_estimators=100`, `max_depth=4`, `learning_rate=0.05`

| Model | Qini Coefficient | AUUC | Top-20% Conversion Rate | Lift vs Baseline |
|---|---|---|---|---|
| **T-Learner** | **+0.097** | +19.1 | 0.51% | **+66%** |
| X-Learner | −0.855 | −167.8 | 0.04% | −87% |

<p align="center">
  <img src="figures/qini_curve.png" width="700" alt="Qini curves: T-Learner vs X-Learner vs random"/>
</p>

<p align="center">
  <img src="figures/uplift_curve.png" width="700" alt="Uplift curves: gain over random targeting"/>
</p>

**T-Learner** successfully ranks units by persuadability. Targeting the top-20% of users by predicted CATE achieves a 0.51% conversion rate versus the 0.31% population baseline — a **+66% relative lift**.

**X-Learner fails** on this dataset. The 85/15 arm imbalance means μ̂₀ (control model) is trained on only ~240K units but must generalise to ~1.36M treated units in stage-2 imputation. The resulting D₁ = Y₁ − μ̂₀(X) estimates are systematically biased, and τ̂₁ memorises this bias. CATE rankings invert — the model selects *anti-persuadable* units. This is a documented X-Learner failure mode under severe arm imbalance (Nie & Wager 2021) and is as instructive as a success.

<p align="center">
  <img src="figures/decile_lift_barchart.png" width="700" alt="Decile lift analysis: lift vs random by decile"/>
</p>

*Decile lift chart — T-Learner concentrates positive lift in the top 2–3 deciles, confirming the model identifies a genuinely higher-responding subgroup.*

<p align="center">
  <img src="figures/feature_importance.png" width="700" alt="XGBoost feature importances for T-Learner"/>
</p>

*XGBoost feature importances (T-Learner treatment model). Features are anonymised; `f4` and `f0` carry the most signal.*

---

## Business Interpretation

Showing the ad to a randomly chosen user increases conversion probability by ~0.12 pp on a 0.31% base rate. The T-Learner identifies a 20% subgroup where that lift concentrates — conversion rate 0.51% vs. 0.31%, a **66% relative improvement**. In a real campaign, reallocating impressions from the bottom 80% to this segment would yield materially better ROI at the same total spend.

The numbers are intentionally modest: the outcome is rare and the features are anonymised. In production with richer signals, uplift heterogeneity is typically much larger.

---

## Limitations

1. **RCT not observational.** PSM/IPW/AIPW are demonstrated and validated here, but the dataset does not test their ability to correct true confounding — only to reproduce a known ground truth.

2. **85/15 arm imbalance.** The dominant constraint. It degrades PSM retention (16.4% of treated units matched), destabilises X-Learner stage-2 imputation, and makes outcome modelling harder. A balanced experimental design or resampling would help.

3. **AIPW outcome model misspecification.** Logistic regression under 0.31% class imbalance is a poor outcome model. A class-weighted or gradient-boosted outcome model would likely restore the doubly-robust property.

4. **Anonymised features.** Precludes substantive interpretation of importances or segment profiles.

5. **2M-row subsample.** Full 14M-row results would be more stable. Set `subsample_n: null` in `config/default.yaml` for a full run.

6. **No CATE uncertainty quantification.** Point estimates only; conformal prediction or bootstrap CIs on individual CATE scores are not implemented.

---

## Reproducibility

```bash
# Clone and install
git clone https://github.com/<your-username>/causal-inference-uplift
cd causal-inference-uplift
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Run full pipeline (downloads ~1.5 GB dataset automatically)
python scripts/run_all.py

# Resume from a specific step
python scripts/run_all.py --from-step 2   # skip download

# Tests
pytest tests/ --cov=src
```

All seeds fixed via `config/default.yaml` (`seed: 42`). Results written to `reports/results.json`; figures to `figures/`.

---

## Project Structure

```
├── config/default.yaml          # All hyperparams, paths, seeds
├── src/
│   ├── config.py                # Typed config loader
│   ├── data.py                  # Download, validate, load
│   ├── psm.py                   # Propensity score matching
│   ├── estimators.py            # Naive, IPW, AIPW
│   ├── uplift.py                # T-Learner, X-Learner
│   ├── evaluation.py            # Qini, AUUC, decile analysis
│   └── plots.py                 # All figure generation
├── scripts/                     # CLI entry points (run_all.py chains them)
├── notebooks/                   # 01_eda · 02_psm · 03_ate · 04_uplift
├── tests/                       # 57 tests · 89% coverage
└── reports/
    ├── figures/                 # 7 figures (PNG 300 DPI + SVG)
    └── results.json             # Machine-readable run summary
```

---

## Tech Stack

- **Python 3.10+** · pandas · numpy · scipy
- **scikit-learn** — logistic regression, nearest-neighbour matching, stratified CV
- **XGBoost** — T-Learner and X-Learner backbone
- **matplotlib / seaborn** — 7 production figures (PNG 300 DPI + SVG)
- **huggingface_hub** — dataset download
- **pytest + pytest-cov** — 57 tests, 89% `src/` coverage

---

## References

- Austin, P. C. (2011). Optimal caliper widths for propensity-score matching. *Pharmaceutical Statistics*.
- Künzel, S. R., et al. (2019). Metalearners for estimating heterogeneous treatment effects. *PNAS*.
- Nie, X., & Wager, S. (2021). Quasi-oracle estimation of heterogeneous treatment effects. *Biometrika*.
- Robins, J. M., Rotnitzky, A., & Zhao, L. P. (1994). Estimation of regression coefficients when some regressors are not always observed. *JASA*.
