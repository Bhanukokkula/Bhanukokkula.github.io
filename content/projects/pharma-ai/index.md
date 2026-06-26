---
slug: "pharma-ai"
title: "PharmaAI — OTC Pharmacy E-commerce + Recommender"
tagline: "A full-stack OTC storefront with a content-based recommender evaluated against hidden synthetic user segments — more than double a random baseline, with the one segment it’s weak on named and explained."
domains: ["AI Engineering"]
status: "Completed"
problem: "Most recommender demos report a single aggregate metric and call it done. The harder, more honest question is which user segments the model actually serves well, and which it doesn’t."
approach: "Full storefront — landing, category browse, product detail pulling real FDA purpose/warning text from openFDA, cart, 3-step checkout — backed by a content-based recommender (TF-IDF over name/purpose/ingredient/category, blended with co-occurrence and popularity signals). Evaluated with precision@k and recall@k against six hidden synthetic user personas the recommender never sees during scoring, plus a coverage check across the full catalog. A thin MLOps spine logs every training run’s params/metrics/artifacts to MLflow and every live recommendation to a prediction log."
stack: ["FastAPI","SQLAlchemy","Vite","React 19","TypeScript","Tailwind","MLflow","openFDA data"]
metrics: [{"label":"Precision@10 — segment affinity","result":"0.799","baseline":"random baseline: 0.390 (more than 2x lift)"},{"label":"Category recall@10 (leave-one-out)","result":"0.521"},{"label":"Catalog coverage@10","result":"0.79 of the 200-product catalog appears across sampled users’ top-10"},{"label":"Weakest segment — \"explorer / one-off\" precision@10","result":"0.315"}]
highlights: ["Per-segment precision@10 ranges from 0.991 (chronic vitamin reorderer) down to 0.315 (explorer/one-off, sparse purchase history) — the cold-start weakness is named rather than averaged away","29 tests passing in 1.74s, covering the full cart/checkout flow and the recommender scoring math against an in-memory SQLite DB","Honest limitation: mock auth (no real passwords/JWT) and a non-functional checkout payment step — this is a v1 to iterate on, not a finished storefront"]
---

# PharmaAI — Project Details & Results

A local-first OTC (over-the-counter) pharmacy e-commerce demo: a full
storefront (landing page, browse, cart, multi-step checkout) on top of a
real FastAPI + SQLite catalog seeded from openFDA, with a content-based
recommendation engine and a thin, honest MLOps spine — training,
evaluation, MLflow tracking, and prediction logging.

**This is v1 — a base to iterate on, not a finished product.**

---

## 1. What this project is

- **A real storefront**, not a wireframe: landing page, category browse
  with filters, product detail pages with real FDA purpose/warnings text,
  cart, and a 3-step checkout — all running against a real database.
- **A content-based recommender**, not an LLM wrapper: it blends
  item-content similarity (TF-IDF over name/purpose/ingredient/category),
  co-occurrence ("frequently bought together"), and popularity, then
  evaluates itself against hidden synthetic user segments it never sees
  during scoring.
- **A thin, honest MLOps spine**: `python -m ml.train` logs params,
  metrics, and artifacts to a local MLflow registry; every `/recommend`
  call writes a `PredictionLog` row for later analysis.
- **Mock auth, no real accounts**: a sign-in page with one-click "shop as
  a sample customer" personas, held entirely in React state — no
  localStorage, no passwords, no JWTs.
- **No real payments**: checkout's payment step is styled but
  non-functional; "placing an order" writes through the existing cart API.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Backend | FastAPI (Python 3.11+) |
| Frontend | Vite + React 19 + TypeScript + Tailwind CSS + lucide-react icons |
| Database | SQLite via SQLAlchemy ORM (ORM-only, so a Postgres swap later is a connection-string change) |
| Model registry | MLflow, local file store (`./mlruns`) |
| Auth | None — mock login UI sets an `X-User-Id` header, held in React state only |

## 3. Architecture

```
┌──────────────────┐        HTTP/JSON        ┌──────────────────────────┐
│  Vite + React +  │ ──────────────────────▶ │        FastAPI            │
│  Tailwind (SPA)   │ ◀────────────────────── │  ┌──────────────────────┐ │
│                   │   X-User-Id header      │  │ routes/               │ │
│  pages/           │   (mock session)        │  │  catalog, cart,       │ │
│   Home            │                          │  │  users, orders,       │ │
│   Catalog (/shop) │                          │  │  recommend            │ │
│   ProductDetail   │                          │  └──────────┬───────────┘ │
│   Login (mock)    │                          │             │             │
│   Cart / Checkout │                          │  ┌──────────▼───────────┐ │
│   Account         │                          │  │ services/recommender/ │ │
└──────────────────┘                          │  │  base.py (interface) │ │
                                                │  │  content_based.py    │ │
                                                │  │  features.py,        │ │
                                                │  │  artifacts.py        │ │
                                                │  └──────────┬───────────┘ │
                                                │             │             │
                                                │  ┌──────────▼───────────┐ │
                                                │  │ SQLAlchemy ORM → SQLite│ │
                                                │  │ Product, User,        │ │
                                                │  │ Interaction,          │ │
                                                │  │ PredictionLog, Cart,  │ │
                                                │  │ Order                 │ │
                                                │  └───────────────────────┘ │
                                                └──────────────────────────┘

ml/
 ingest_openfda.py  ──▶ real OTC products  ──┐
 generate_synthetic.py ──▶ users + interactions ├──▶ seed.py ──▶ SQLite
 train.py ──▶ writes ml/artifacts/ (loaded by content_based.py) and
              logs params/metrics/model to ./mlruns (MLflow file store)
```

The fork-agnostic boundary: `app/services/recommender/base.py` defines
`RecommenderService`. Routes and the frontend depend only on this
interface — never on `ContentBasedRecommender` directly. Swapping in a
future RAG/chatbot assistant or a drift-prone forecasting model is a
one-line change in `get_recommender()`.

## 4. Recommender training results (latest MLflow run)

Run: `content-based-v1-20260612T145046Z` (registered model
`pharmaai-content-based`, version 2) — see
[images/09-mlflow-run-detail.png](/projects/pharma-ai/09-mlflow-run-detail.png).

**Parameters**

| Parameter | Value |
|---|---|
| n_products | 200 |
| n_users | 2000 |
| n_interactions | 76,860 |
| n_purchase_interactions | 20,488 |
| signal_weight_similarity | 0.33 |
| signal_weight_cooccurrence | 0.33 |
| signal_weight_popularity | 0.34 |
| category_weight | 2.0 |
| tfidf_max_features | 300 |
| eval_k | 10 |
| eval_sample_size | 500 |
| top_affinity_categories | 2 |

**Metrics**

| Metric | Value | What it means |
|---|---|---|
| `precision_at_k_segment_affinity` | **0.7988** | Do top-k recommendations land in the categories a user's *hidden* synthetic segment favors? (Recommender never sees `segment`.) |
| `precision_at_k_random_baseline` | 0.3895 | Same question for a random-recommendation baseline — the recommender more than doubles it. |
| `category_recall_at_k` | 0.5208 | Leave-one-out: hide a user's most recent purchase, re-score, does its *category* reappear in top-k? |
| `item_recall_at_k` | 0.1357 | Same leave-one-out test, but for the exact *item* reappearing (a much harder bar). |
| `coverage_at_k` | 0.79 | Fraction of the 200-product catalog that appears across sampled users' top-k lists (diversity check). |

**Per-segment precision@k** (segment affinity, broken out):

| Segment | Precision@10 |
|---|---|
| Chronic vitamin reorderer | 0.991 |
| Digestive-health buyer | 0.988 |
| Allergy-season buyer | 0.979 |
| Pain-management regular | 0.953 |
| Cold/flu episodic | 0.735 |
| Explorer / one-off | 0.315 |

The "explorer/one-off" segment scores lowest by design — these synthetic
users have sparse, low-signal interaction histories, which is exactly
where a content-based recommender is expected to struggle most (and a
reasonable place to point future model improvements).

See [images/08-mlflow-experiments.png](/projects/pharma-ai/08-mlflow-experiments.png)
for the full run history.

## 5. Test suite results

```
$ cd backend && pytest -q
.............................                                            [100%]
29 passed in 1.74s
```

Coverage: catalog browsing, the mock user session, the cart/checkout
flow (`test_catalog.py`, `test_users.py`, `test_cart.py`), the
`/recommend` route including `PredictionLog` writes
(`test_recommend.py`), and unit tests for the scoring math itself
(`test_recommender_scoring.py`), all run against an in-memory SQLite DB
with dependency overrides — no seeded database required.

## 6. Storefront walkthrough (screenshots)

| Page | Screenshot |
|---|---|
| Home — hero, categories, "Recommended for you" | [images/01-home.png](/projects/pharma-ai/01-home.png) |
| Shop — filterable product grid | [images/02-shop.png](/projects/pharma-ai/02-shop.png) |
| Product detail — FDA purpose/warnings + "you might also like" | [images/03-product-detail.png](/projects/pharma-ai/03-product-detail.png) |
| Cart — editable line items, order summary | [images/04-cart.png](/projects/pharma-ai/04-cart.png) |
| Checkout — 3-step flow (Shipping → Payment → Review) | [images/05-checkout.png](/projects/pharma-ai/05-checkout.png) |
| Sign in — mock auth + one-click sample-customer personas | [images/06-login.png](/projects/pharma-ai/06-login.png) |
| Account — signed-in user + order history | [images/07-account.png](/projects/pharma-ai/07-account.png) |
| MLflow — experiment run list | [images/08-mlflow-experiments.png](/projects/pharma-ai/08-mlflow-experiments.png) |
| MLflow — run detail (params + metrics) | [images/09-mlflow-run-detail.png](/projects/pharma-ai/09-mlflow-run-detail.png) |

## 7. What's NOT in v1 (by design)

- No real auth/OAuth/passwords/JWT — mock session in React state only, no
  browser storage.
- No payment processing — the checkout payment step is visual only.
- No Airflow / Feast / Kubernetes / Prometheus / Grafana / drift detection.
- No prescription drugs, no clinical-advice framing, no symptom→drug
  "diagnosis".
- No raw SQL — ORM only, to keep a Postgres swap open.
- No copyrighted brand imagery, logos, or stock photos — product visuals
  are CSS/icon-based.

## 8. Roadmap / next versions

- **v1 (this build):** OTC store + content-based recommender + thin
  MLOps spine + prediction logging + test suite + one-command run.
- **Fork A — GenAI assistant:** swap `RecommenderService` for a
  RAG-grounded OTC guidance chatbot (hybrid retrieval over
  DailyMed/MedlinePlus, citations, groundedness guardrail,
  triage/escalation, eval harness).
- **Fork B — MLOps showcase:** swap in a drift-prone model (demand
  forecasting); the `PredictionLog` table already captures what real
  drift detection + retrain triggers + champion/challenger would need.
- **Fork C — store depth:** real search, payments, inventory.

---

*Generated 2026-06-23 by running the live app end-to-end (frontend on
Vite dev server, FastAPI backend, MLflow UI against `./mlruns`) and
capturing the results above. See the main [README.md](../README.md) for
setup instructions.*
