---
slug: "loan-approval-prediction"
title: "Loan Approval Prediction"
tagline: "A classic credit-decisioning problem, four models compared honestly — and the simplest one, logistic regression, wins on the leaderboard."
domains: ["Commercial Bank"]
status: "Completed"
problem: "Dream Housing Finance wants to automate home-loan eligibility decisions from applicant details — a binary approve/deny classification where the cost of getting it wrong is asymmetric."
approach: "Full EDA across categorical, ordinal, and numerical features against the approval target, missing-value imputation, log-transform outlier handling on loan amount, and engineered features (total income, EMI, balance income). Compared logistic regression, decision tree, random forest, and XGBoost with GridSearchCV tuning and stratified 5-fold cross-validation."
stack: ["Python","pandas","scikit-learn","XGBoost"]
metrics: [{"label":"Best model — Logistic Regression (baseline)","result":"0.7847 leaderboard accuracy, ROC-AUC 0.77"},{"label":"Random Forest (GridSearchCV tuned)","result":"0.7638 leaderboard accuracy (CV improved 0.783 → 0.813 after tuning)"},{"label":"XGBoost (GridSearchCV tuned)","result":"0.7778 leaderboard accuracy"},{"label":"Weakest — Decision Tree","result":"0.6458 leaderboard accuracy"}]
highlights: ["Credit history is by far the strongest single predictor, ahead of total income, balance income, and loan amount","Honest finding: hand-engineered features (total income, EMI, balance income) improved interpretability but did not beat the simple baseline’s leaderboard score — the more complex model did not win"]
---

# Loan Approval Prediction

A machine learning project that predicts whether a loan application should be approved, based on applicant demographic and financial data. Built around the classic "Dream Housing Finance" loan eligibility dataset.

This folder is a self-contained summary of the project: problem statement, approach, results, and all visualizations generated during analysis and modeling. Full working code lives in [`loan-approval-prediction.ipynb`](../loan-approval-prediction.ipynb) in the parent directory.

## Problem Statement

Dream Housing Finance deals in home loans and wants to automate the loan eligibility process based on customer details provided in an online application form: Gender, Marital Status, Education, Number of Dependents, Income, Loan Amount, Credit History, and others. The goal is a binary classification model that predicts `Loan_Status` (Y/N) for new applicants.

## Data

| File | Description |
|---|---|
| `train_u6lujuX_CVtuZ9i.csv` | 614 labeled training records, 13 columns |
| `test_Y3wMUE5_7gLdaTN.csv` | Unlabeled test set for leaderboard submission |
| `my_submission7.csv` | Final prediction submission file |

Features include `Gender`, `Married`, `Dependents`, `Education`, `Self_Employed`, `ApplicantIncome`, `CoapplicantIncome`, `LoanAmount`, `Loan_Amount_Term`, `Credit_History`, `Property_Area`, with target `Loan_Status`.

## Approach

1. **Exploratory Data Analysis (EDA)** — univariate and bivariate analysis of categorical, ordinal, and numerical features against the target.
2. **Data Pre-processing** — missing value imputation (mode for categorical, median for numerical), outlier treatment via log transform on `LoanAmount`.
3. **Feature Engineering** — derived `Total_Income`, `EMI`, and `Balance Income` features from existing columns, then dropped the originals to reduce multicollinearity.
4. **Model Building** — trained and cross-validated four classifiers:
   - Logistic Regression
   - Decision Tree
   - Random Forest (+ `GridSearchCV` hyperparameter tuning)
   - XGBoost (+ `GridSearchCV` hyperparameter tuning)
5. **Evaluation** — stratified 5-fold cross-validation, confusion matrix, classification report, ROC-AUC, and feature importance.

## Results

| Model | Mean CV Accuracy | Leaderboard Accuracy | Notes |
|---|---|---|---|
| **Logistic Regression** (baseline, no feature engineering) | 0.81 | **0.7847** | Best leaderboard score |
| Logistic Regression (with engineered features) | 0.80 | 0.7778 | Feature engineering didn't beat the baseline |
| Random Forest (default params) | 0.78 | — | |
| Random Forest (`GridSearchCV` tuned, max_depth=3, n_estimators=141) | 0.81 | 0.7638 | Tuning improved CV accuracy 0.783 → 0.813 |
| Decision Tree | 0.71 | 0.6458 | Weakest performer |
| XGBoost (default params) | 0.78 | — | |
| XGBoost (`GridSearchCV` tuned, max_depth=1, n_estimators=81) | 0.81 | 0.7778 | Tuning improved CV accuracy 0.78 → 0.813 |

**Baseline Logistic Regression classification report** (validation split):

```
              precision    recall  f1-score   support
           0       0.92      0.43      0.59        51
           1       0.82      0.99      0.89       134
avg/total       0.85      0.83      0.81       185
```

ROC-AUC for the cross-validated logistic model: **0.77**.

### Key findings
- `Credit_History` is the single most important predictor of loan approval, followed by `Total_Income`, `Balance Income`, and `LoanAmount` (see feature importance plot).
- ~69% of applicants in the training set had their loan approved — a moderately imbalanced target.
- Applicant income alone has little effect on approval; what matters more is income relative to requested loan amount.
- Feature engineering (EMI, Balance Income) improved interpretability but did not improve leaderboard accuracy over the simple baseline.

## Conclusion

Logistic Regression achieved the best leaderboard accuracy (0.7847), ahead of Random Forest and XGBoost (0.7778 each) and Decision Tree (0.6458). Hyperparameter tuning via `GridSearchCV` improved cross-validation accuracy for both Random Forest and XGBoost, but neither surpassed the simple logistic baseline on the leaderboard. This is a good illustration that a well-understood, simple model can outperform more complex ones on small, low-noise tabular datasets.

### Suggestions for future improvement
- Combine sparse categories in `Dependents` (1, 2, 3+) into fewer buckets.
- Explore independent-vs-independent variable visualizations for additional patterns.
- Improve the EMI formula to account for interest rates.
- Try ensemble/stacking of the four models.
- Try a neural network (TensorFlow/PyTorch) baseline for comparison.

## Visualizations

All plots referenced above are saved in [`images/`](images/), numbered in the order they appear in the notebook:

| # | File | What it shows |
|---|---|---|
| 01 | `01_loan_status_distribution.png` | Target class balance (Y vs N) |
| 02 | `02_categorical_features_univariate.png` | Distribution of categorical features |
| 03 | `03_ordinal_features_univariate.png` | Distribution of ordinal features |
| 04 | `04_applicant_income_distribution.png` | ApplicantIncome distribution/boxplot |
| 05 | `05_applicant_income_by_education.png` | ApplicantIncome split by Education |
| 06 | `06_coapplicant_income_distribution.png` | CoapplicantIncome distribution |
| 07 | `07_coapplicant_income_extra.png` | Additional CoapplicantIncome view |
| 08 | `08_loan_amount_distribution.png` | LoanAmount distribution |
| 09 | `09_gender_vs_loan_status.png` | Gender vs Loan_Status |
| 10 | `10_married_vs_loan_status.png` | Married vs Loan_Status |
| 11 | `11_dependents_vs_loan_status.png` | Dependents vs Loan_Status |
| 12 | `12_education_vs_loan_status.png` | Education vs Loan_Status |
| 13 | `13_self_employed_vs_loan_status.png` | Self_Employed vs Loan_Status |
| 14 | `14_credit_history_vs_loan_status.png` | Credit_History vs Loan_Status |
| 15 | `15_property_area_vs_loan_status.png` | Property_Area vs Loan_Status |
| 16 | `16_numerical_vs_target_intro.png` | Numerical features vs target (intro plot) |
| 17 | `17_applicant_income_vs_loan_status.png` | Mean ApplicantIncome by Loan_Status |
| 18 | `18_income_bins_vs_loan_status.png` | Income bins vs approval rate |
| 19 | `19_coapplicant_income_bins_vs_loan_status.png` | CoapplicantIncome bins vs approval rate |
| 20 | `20_total_income_bins_vs_loan_status.png` | Total income bins vs approval rate |
| 21 | `21_correlation_heatmap.png` | Correlation matrix of numerical features |
| 22 | `22_loan_amount_outliers_boxplot.png` | LoanAmount outliers before treatment |
| 23 | `23_loan_amount_log_transformed.png` | LoanAmount after log transform |
| 24 | `24_logistic_regression_confusion_matrix.png` | Logistic Regression confusion matrix |
| 25 | `25_logistic_regression_roc_curve.png` | Logistic Regression ROC curve (AUC = 0.77) |
| 26 | `26_feature_engineering_section.png` | Feature engineering section plot |
| 27 | `27_total_income_distribution.png` | Engineered Total_Income distribution |
| 28 | `28_emi_distribution.png` | Engineered EMI distribution |
| 29 | `29_balance_income_distribution.png` | Engineered Balance Income distribution |
| 30 | `30_random_forest_feature_importance.png` | Random Forest feature importance ranking |

## Tech Stack

- Python 3, pandas, NumPy
- scikit-learn (Logistic Regression, Decision Tree, Random Forest, GridSearchCV, StratifiedKFold)
- XGBoost
- matplotlib / seaborn for visualization
