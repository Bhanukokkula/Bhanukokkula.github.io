---
slug: "ecommerce-engagement-conversion"
title: "E-Commerce Analytics: Engagement vs. Conversion"
tagline: "Tests the assumption that engagement metrics predict revenue across 559K records from six real e-commerce datasets — and finds the relationship is mostly noise."
domains: ["AI Engineering"]
status: "Completed"
problem: "\"More engagement means more sales\" is the default assumption behind a lot of e-commerce product decisions. It’s rarely tested directly against the data that would falsify it."
approach: "Integrated six real datasets (559,167 records) covering site engagement, marketing performance, and sales across two retail platforms. Ran correlation analysis between engagement signals (time on page, session duration, clicks) and conversions, t-tests comparing seller-reputation tiers, a K-Means (k=4) behavioral segmentation of the view-to-purchase funnel, and an efficiency analysis of revenue per dollar spent across products, campaigns, and sellers."
stack: ["Python","pandas","SciPy","scikit-learn","matplotlib","seaborn"]
metrics: [{"label":"Time-on-page vs. conversions","result":"r ≈ 0.03 — effectively no relationship"},{"label":"Seller reputation (≥4★ vs. lower) vs. conversion","result":"p = 0.00012 — the one engagement-adjacent signal that holds up"},{"label":"Revenue contribution","result":"Products ~47% and Campaigns ~47%, Sellers only ~5%"}]
highlights: ["The headline finding is a negative one: surface engagement metrics (time on page, clicks, session length) show near-zero correlation with conversions — the metrics teams often optimize for are not the ones that move revenue","Referral and organic traffic outperform paid and direct by roughly 1 point of conversion rate"]
---

# E-Commerce Analytics: Engagement vs. Conversion


A data-driven investigation into why high customer engagement doesn't always translate into sales — and what actually drives e-commerce revenue.

---

## The Problem

E-commerce platforms often celebrate vanity metrics: page views, session duration, click counts. But do they actually predict revenue? This project challenges that assumption across **559,167 real-world records** from six datasets, using statistical analysis and machine learning to find what truly moves the needle.

> **Core Question**: Are customers browsing but not buying — and if so, why?

---

## Key Findings

| Finding | Evidence |
|---|---|
| Engagement metrics are weak revenue predictors | Time-on-page ↔ Conversions: r ≈ 0.03 |
| Seller reputation drives significant sales lift | High-rated vs. low-rated sellers: p = 0.00012 (t-test) |
| Traffic source matters more than volume | Referral/Organic outperform Paid/Direct by ~1% CVR |
| Products & Campaigns are co-equal growth drivers | ~47% revenue contribution each; Sellers only ~5% |
| Campaign efficiency beats raw budget spend | Best campaigns: 0.21 units converted per budget dollar |

---

## Analyses

### Analysis 1 — Engagement-Sales Disconnection
Explored whether web engagement metrics (bounce rate, session duration, page views) correlate with actual conversions using Pearson correlation. Found near-zero relationships, challenging the assumption that more engagement = more sales.

**Engagement metrics are nearly uncorrelated with conversions:**

![Engagement Correlation Heatmap](/projects/ecommerce-engagement-conversion/1_engagement_heatmap.png)

**Referral and Organic traffic outperform Paid and Direct channels:**

![Conversion Rate by Traffic Source](/projects/ecommerce-engagement-conversion/2_cvr_by_traffic_source.png)

**More clicks do not produce more ROI (r ≈ 0.02):**

![Clicks vs ROI](/projects/ecommerce-engagement-conversion/3_clicks_vs_roi.png)

---

### Analysis 2 — Seller Power vs. Product Appeal
Used hypothesis testing (t-tests) and correlation analysis to compare the influence of seller reputation versus product attributes. High-rated sellers (≥4 stars) significantly outperformed others — seller trust is a stronger lever than product specs alone.

**High-rated sellers sell significantly more units (p = 0.00012):**

![Seller Rating vs Units Sold](/projects/ecommerce-engagement-conversion/4_seller_rating_vs_units.png)

**Session duration has a significant positive effect on conversion (r = 0.18, p < 0.0001):**

![Session Duration vs Conversion Rate](/projects/ecommerce-engagement-conversion/5_session_duration_vs_cvr.png)

---

### Analysis 3 — Conversion Funnel & Bottleneck Identification
Built a customer interaction funnel (Views → Likes → Purchases) and applied **K-Means clustering (k=4)** to segment user behavior. Identified specific drop-off points and friction stages in the path to purchase.

**Most interactions are likes — far fewer convert to purchases:**

![Customer Interaction Funnel](/projects/ecommerce-engagement-conversion/6_interaction_funnel.png)

---

### Analysis 4 — Hidden Growth Drivers
Measured efficiency across Products, Campaigns, and Sellers — not just revenue, but revenue *per unit*, *per dollar spent*, and *per product listed*. Revealed which growth lever has the highest ROI under different business conditions.

**Products and Campaigns are co-equal primary drivers; Sellers play a supporting role:**

![Revenue Contribution Pie Chart](/projects/ecommerce-engagement-conversion/7_revenue_contribution_pie.png)

**Top products by revenue-per-unit efficiency (not just total volume):**

![Top Products by Efficiency](/projects/ecommerce-engagement-conversion/8_top_products_efficiency.png)

---

## Tech Stack

| Category | Tools |
|---|---|
| Language | Python 3 |
| Data Processing | Pandas, NumPy |
| Statistical Analysis | SciPy (Pearson correlation, t-tests) |
| Machine Learning | Scikit-learn (K-Means clustering) |
| Visualization | Matplotlib, Seaborn |
| Environment | Jupyter Notebooks |
| Version Control | Git |

---

## Dataset Overview

| Dataset | Rows | Key Metrics |
|---|---|---|
| Website Engagement | 2,000 | Bounce rate, session duration, traffic source, CVR |
| Marketing & Product Performance | 10,000 | Campaign ROI, budget, clicks, conversions, revenue |
| E-Commerce Sales Analysis | 1,000 | 12-month product sales, ratings, reviews |
| E-Commerce Sales 2024 | 3,294 | User-product interactions (views, likes, purchases) |
| Active Seller Success | 958 | Seller ratings, units sold, discount strategies |
| Online Retail (Historical) | 541,909 | Transactions, invoices, customer IDs, countries |

---

## Project Structure

```
├── Analysis_1.ipynb                       # Engagement vs. conversion analysis
├── Analysis-2.ipynb                       # Seller power vs. product appeal
├── Analysis_3.ipynb                       # Funnel analysis & customer clustering
├── Analysis_4.ipynb                       # Growth driver efficiency comparison
├── website_wata.csv                       # Web session data
├── marketing_and_product_performance.csv  # Campaign & product metrics
├── ecommerce_sales_analysis.csv           # Monthly product sales (1k products)
├── E-commerece sales data 2024.csv        # User interaction logs
├── E-commerce_summer_product_Ratings.csv  # Seller & product ratings
├── online_retail.csv                      # 541k historical transactions
└── AP_PROJECT_REPORT_GROUP_9.docx         # Full project report
```

---

## Getting Started

**Prerequisites**
```bash
pip install pandas numpy scipy scikit-learn matplotlib seaborn jupyter
```

**Run a notebook**
```bash
jupyter notebook Analysis_1.ipynb
```

Run all cells sequentially. Visualizations render inline. All CSV files must be in the same directory as the notebooks.

---

## Skills Demonstrated

- **Data Wrangling** — cleaning, merging, and transforming datasets up to 541k rows
- **Statistical Rigor** — hypothesis testing (t-tests, p-values), Pearson correlation
- **Machine Learning** — unsupervised clustering for customer segmentation
- **Business Analysis** — translating statistical findings into actionable business insights
- **Data Storytelling** — structured narrative connecting data to real e-commerce strategy
- **Multi-dataset Integration** — joining six datasets across different granularities and formats
