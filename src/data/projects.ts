// Single source of truth for portfolio projects.
// To add a project: append one object.
// To ship a roadmap project: fill metric.result values + set status to "Completed".

export type ProjectStatus = 'Completed' | 'Building' | 'Planned'

export type ProjectDomain =
  | 'AI Engineering'
  | 'Investment Banking'
  | 'Commercial Bank'
  | 'Hedge Fund'
  | 'Research'

export interface Metric {
  label: string
  target?: string   // projected value — shown with "Target" label
  result?: string   // achieved value — shown with "Result" label when set
  baseline?: string // e.g. "~50–65% naive-LLM"
  context?: string  // published SOTA / reference points
}

export interface Project {
  slug: string
  title: string
  tagline: string
  domains: ProjectDomain[]
  status: ProjectStatus
  featured?: boolean
  problem: string
  approach: string
  stack: string[]
  metrics?: Metric[]
  highlights?: string[]
  links?: { github?: string; demo?: string; writeup?: string }
}

export const projects: Project[] = [
  // ─── Featured flagship (roadmap) ────────────────────────────────────────────
  {
    slug: 'financial-filings-reasoning-engine',
    title: 'Auditable Numerical-Reasoning Engine for Financial Filings',
    tagline:
      "Question-answering over SEC filings that does the math in executable code, verifies its own work against the source cells, and abstains when it can't confirm.",
    domains: ['AI Engineering', 'Hedge Fund', 'Investment Banking', 'Commercial Bank'],
    status: 'Building',
    featured: true,
    problem:
      'LLMs are unreliable at arithmetic over financial tables and will confabulate numbers — unacceptable for any audience that has to trust the figure.',
    approach:
      "Parses real EDGAR filings (HTML/iXBRL) into structured tables, runs number-aware retrieval over cells and text, generates an executable Program-of-Thought instead of doing arithmetic in text, executes it in a sandbox, then a critic/verifier checks the right cells, units/scale, sign, and magnitude — abstaining and flagging for review when it can't confirm. Every answer is traceable: the UI shows the generated program, the executed result, the highlighted source cells, and a confidence/verification status.",
    stack: [
      'Python', 'LangGraph', 'FAISS/ChromaDB', 'reranker',
      'sandboxed code execution', 'edgartools', 'sec-api',
      'pandas', 'BeautifulSoup', 'MLflow', 'pytest', 'FastAPI', 'Next.js', 'React',
    ],
    metrics: [
      {
        label: 'FinQA execution accuracy (test)',
        target: '72–80%',
        baseline: '~50–65% naive-LLM',
        context: 'APOLLO 71.07 · Fin-R1 76.0 · GPT-4.5 ~70–78%',
      },
      {
        label: 'ConvFinQA execution accuracy (dev)',
        target: '78–85%',
        baseline: '~55–70%',
        context: 'APOLLO 78.46 · Fin-R1 85.0',
      },
      {
        label: 'FinanceBench (open subset)',
        target: '>75–80%',
        context: '80% = production bar; 10–20% failure typical without verification',
      },
      {
        label: 'Lift over naive baseline',
        target: '+15–25 pts (verifier contribution isolated in ablation)',
      },
    ],
    highlights: [
      'Reproducible eval harness; full failure-mode taxonomy (scale/unit, retrieval miss, wrong operation, sign error, multi-table joins, footnote-linked figures)',
      'Abstention path: the system flags rather than confabulates when the verifier cannot confirm',
      'Reads to three audiences: research tooling, the engine under deal/equity-research automation, and auditable abstaining analysis a model-risk function could accept',
    ],
  },

  // ─── Featured completed (real results) ──────────────────────────────────────
  {
    slug: 'mars',
    title: 'MARS — Multi-Agent Risk Synthesis',
    tagline:
      'A LangGraph-orchestrated multi-agent framework that synthesizes financial risk from four specialist data sources with deterministic, evidence-weighted conflict resolution.',
    domains: ['AI Engineering', 'Hedge Fund', 'Investment Banking'],
    status: 'Completed',
    featured: true,
    problem:
      'Risk signals live across disconnected sources (filings, news, macro, market data) that frequently disagree, and naive multi-agent setups paper over the conflicts.',
    approach:
      'Four specialist agents (SEC EDGAR, NewsAPI, FRED, Finnhub) feed a deterministic evidence-weighted conflict-resolution engine, backed by ChromaDB RAG, FastAPI, a Streamlit UI, and SQLite persistence. Gemini 2.5 Flash is the reasoning engine behind a provider-abstraction layer, so the model is swappable.',
    stack: [
      'Python', 'LangGraph', 'ChromaDB', 'FastAPI',
      'Streamlit', 'SQLite', 'Gemini 2.5 Flash',
      'provider-abstraction layer', 'pytest',
    ],
    metrics: [
      { label: 'Test suite', result: '123 passing tests' },
      { label: 'Specialist agents', result: '4 (EDGAR, NewsAPI, FRED, Finnhub)' },
    ],
    highlights: [
      'Live backtesting harness',
      'Honest limitation: historical backtest runs on **2 of 4** agents due to free-tier API constraints — stated, not hidden',
      'Model-agnostic provider layer makes "which LLM for financial reasoning" a swappable choice',
    ],
  },

  // ─── Completed (shipped, real results) ──────────────────────────────────────
  {
    slug: 'pharma-ai',
    title: 'PharmaAI — OTC Pharmacy E-commerce + Recommender',
    tagline:
      'Full-stack OTC pharmacy storefront with a content-based recommender built on real FDA openFDA data.',
    domains: ['AI Engineering'],
    status: 'Completed',
    problem:
      'OTC product discovery is poor; a recommender needs to run on genuine drug data, not toy datasets.',
    approach:
      'Full-stack e-commerce site with a content-based recommendation engine trained on real openFDA data, experiment tracking in MLflow, a FastAPI backend, and a Vite/React/Tailwind front end. Designed with two planned forks: a RAG/GenAI chatbot (Fork A) and a monitoring/drift-detection showcase (Fork B).',
    stack: ['FastAPI', 'Vite', 'React', 'Tailwind', 'MLflow', 'openFDA data', 'content-based recommender'],
    highlights: [
      'Recommender trained on real FDA openFDA data, not synthetic',
      'MLflow experiment tracking wired in',
      'Roadmap forks scoped: RAG/GenAI chatbot and drift-monitoring showcase',
    ],
  },
  {
    slug: 'criteo-uplift',
    title: 'Uplift Modeling on Criteo — Causal Inference',
    tagline:
      'Treatment-effect estimation and uplift modeling on the Criteo dataset, with the failures documented as honestly as the wins.',
    domains: ['AI Engineering', 'Research'],
    status: 'Completed',
    problem:
      'Uplift modeling is easy to overclaim; estimators that look principled often fail to recover ground truth.',
    approach:
      'Built and compared multiple causal estimators on Criteo, validating against RCT ground truth and reporting where methods broke rather than only where they worked.',
    stack: ['Python', 'causal inference', 'T-Learner', 'IPW', 'AIPW', 'X-Learner'],
    metrics: [
      { label: 'T-Learner uplift', result: 'Qini +0.097' },
      { label: 'IPW ATE', result: 'recovers RCT ground truth' },
    ],
    highlights: [
      'AIPW and X-Learner documented as **failures** with honest explanations — the negative results are part of the deliverable',
    ],
  },
  {
    slug: 'learning-mindsets-causal',
    title: 'Learning Mindsets — Causal Inference (ACIC/NSLM)',
    tagline:
      'A full causal-inference treatment of the learning-mindsets question on the ACIC/NSLM dataset, with sensitivity analysis.',
    domains: ['Research', 'AI Engineering'],
    status: 'Completed',
    problem:
      'Estimating a real intervention effect from observational education data requires method breadth and a robustness check, not a single model.',
    approach:
      'Estimated the treatment effect with PSM, IPW, and doubly-robust methods, layered multilevel modeling for the nested structure, and stress-tested the conclusion with Rosenbaum bounds.',
    stack: ['Python', 'PSM', 'IPW', 'doubly-robust estimation', 'multilevel modeling', 'Rosenbaum sensitivity bounds'],
    highlights: [
      'Sensitivity analysis (Rosenbaum bounds) to test how fragile the effect is to hidden confounding',
    ],
  },
  {
    slug: 'seq-lasso-net',
    title: 'SeqLassoNet — Rutgers Capstone',
    tagline:
      'A sequential extension of LassoNet applied to temporal convolutional networks for multivariate time-series forecasting.',
    domains: ['AI Engineering', 'Research'],
    status: 'Completed',
    problem:
      'Feature selection for multivariate time-series forecasting is awkward to bolt onto deep sequence models.',
    approach:
      'Extended LassoNet\'s feature-selection mechanism into a sequential form and applied it to TCNs, evaluated on the Panama electricity-load dataset. Graduate capstone, completed May 2026.',
    stack: ['Python', 'PyTorch', 'TCNs', 'LassoNet', 'time-series forecasting'],
    highlights: [
      'Original method extension, not an application of an off-the-shelf model',
    ],
  },
  {
    slug: 'evidence-asymmetry-study',
    title: 'Gendered Evidence Asymmetry in Human-Evolution Literature',
    tagline:
      'A computational-linguistics study detecting differential treatment of gendered hypotheses across the human-evolution literature.',
    domains: ['Research'],
    status: 'Completed',
    problem:
      'Narrative framing and evidence asymmetry in scientific writing are hard to measure objectively.',
    approach:
      'Co-authored with Professor Cully and Jeffrey Winking. Built paired Male/Female analog postulates and mapped them postulate-by-papers across roughly 55 papers from the Evolution & Human Behavior corpus, then tested for asymmetry with chi-square, odds ratios, WEAT, epistemic-modality analysis, and PCA/MCA.',
    stack: ['Python', 'computational linguistics', 'chi-square', 'odds ratios', 'WEAT', 'epistemic modality analysis', 'PCA/MCA'],
    metrics: [
      { label: 'Corpus', result: '~55 papers (Evolution & Human Behavior)' },
    ],
    highlights: [
      'Academic co-authorship (Professor Cully & Jeffrey Winking)',
    ],
  },

  // ─── Roadmap (targets only; fill result + flip status when shipped) ──────────
  {
    slug: 'comps-valuation-engine',
    title: 'Automated Comps & Valuation Engine',
    tagline:
      "Finds a company's true peer set, normalizes their financials, and benchmarks valuation multiples in a dashboard.",
    domains: ['Investment Banking'],
    status: 'Planned',
    problem:
      'Building and maintaining comparable-company analyses is core IB work — manual, slow, and inconsistent across analysts.',
    approach:
      'Discovers the real peer set with a similarity model, pulls and normalizes peer financials from financial-data APIs, computes valuation multiples (EV/EBITDA, P/E, and others), benchmarks the target against the set, and visualizes it. Deliberately data-engineering-heavy, with no LLM and no heavy ML.',
    stack: ['Python', 'financial-data APIs', 'peer-similarity model', 'pandas', 'analytics dashboard'],
    highlights: [
      'Target metrics to define once scoped: peer-set precision vs. analyst-curated set, multiple-computation accuracy vs. reference',
    ],
  },
  {
    slug: 'regulatory-compliance-engine',
    title: 'Regulatory & Compliance Intelligence Engine',
    tagline:
      "Extracts discrete obligations from financial regulation, maps a bank's policies against them, flags the gaps, and answers compliance questions with citations.",
    domains: ['Commercial Bank'],
    status: 'Planned',
    problem:
      "Compliance teams drown in mapping internal policy against AML, Basel/capital, and consumer-protection rules — regtech is one of banking's largest GenAI spend areas.",
    approach:
      'Ingests a body of regulation plus internal policies, extracts the discrete obligations, maps policies to requirements, flags gaps, and answers questions grounded in cited regulatory text. Obligation-extraction-plus-gap-analysis — the opposite of "chat with a PDF."',
    stack: ['Python', 'LLM', 'RAG', 'structured obligation extraction', 'citation/traceability', 'dashboard'],
    highlights: [
      'Target metrics to define once scoped: obligation-extraction precision/recall, citation-grounding accuracy, gap-detection rate on a labeled set',
    ],
  },
  {
    slug: 'alt-data-nowcasting-engine',
    title: 'Alternative-Data Nowcasting Engine',
    tagline:
      "Nowcasts a company's quarterly KPI ahead of earnings from a non-financial signal — honestly, with uncertainty quantified and failure modes named.",
    domains: ['Hedge Fund'],
    status: 'Planned',
    problem:
      'Funds want visibility into a quarter weeks before the print, but alt-data signals are noisy and easy to overclaim.',
    approach:
      'Takes a non-financial signal (web traffic, app rankings, shipping/satellite, job postings), cleans it, engineers features, forecasts the target KPI, and reports confidence intervals and where the signal breaks down.',
    stack: ['Python', 'data-engineering pipelines', 'feature engineering', 'forecasting models', 'uncertainty quantification'],
    highlights: [
      'Target metrics to define once scoped: nowcast error vs. consensus ahead of print, calibration of confidence intervals',
    ],
  },
  {
    slug: 'ma-target-screening',
    title: "M&A Target-Screening Model — \"Who's in Play\"",
    tagline:
      'Ranks the public companies in a sector by acquisition likelihood and explains why each name screens.',
    domains: ['Investment Banking'],
    status: 'Planned',
    problem:
      "Deal origination is enormous manual effort; coverage teams want a quantified, explainable edge on who's likely to get bought.",
    approach:
      'Predicts acquisition candidates from financial signals (depressed margins, undervaluation vs. peers, weak organic growth), ownership structure (activist stakes, fragmented holders, founder age/succession), and sector-consolidation pressure — then ranks a sector and shows the evidence behind each name.',
    stack: ['Python', 'financial data', 'ownership data', 'ML ranking/classification model', 'explainability', 'dashboard'],
    highlights: [
      'Target metrics to define once scoped: precision@k / ranking quality against historical announced deals, evidence-attribution quality',
    ],
  },
]
