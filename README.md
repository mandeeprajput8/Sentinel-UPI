# Sentinel: An Explainable and Imbalance-Aware Machine Learning Framework for UPI Fraud Detection

Sentinel is a production-grade fraud intelligence framework designed to detect, evaluate, and explain fraud in instant push-payment networks (such as India's Unified Payments Interface — UPI). Built on a dataset of **6,362,620 transactions**, Sentinel pairs a high-performance **XGBoost ensemble** with **exact polynomial-time TreeSHAP**, completing risk inference and mathematical attribution in **0.024 milliseconds** (~42,134 transactions/sec).

---

## 1. Key Performance Highlights & Benchmark Results

Sentinel was systematically benchmarked against 5 classifiers across 41,643 strictly held-out future transactions (Notebooks 01–04):

| Metric | XGBoost (Sentinel Active) | CatBoost | Random Forest | Decision Tree | Logistic Regression |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **PR-AUC (Primary)** | **0.9981** | 0.9974 | 0.9972 | 0.8841 | 0.7230 |
| **ROC-AUC** | **0.9998** | 0.9997 | 0.9994 | 0.9421 | 0.8912 |
| **Fraud Recall** | **99.70%** (1,638 / 1,643) | 99.63% | 99.51% | 88.45% | 78.20% |
| **False Alarms (FPR)** | **5 in 40,000** (0.0125%) | 8 in 40,000 | 6 in 40,000 | 142 in 40,000 | 812 in 40,000 |
| **Inference Latency** | **4.6 µs** (0.0046 ms) | 12.1 µs | 28.4 µs | 1.8 µs | 0.9 µs |
| **XAI (TreeSHAP) Latency** | **19.1 µs** (0.0191 ms) | 48.2 µs | 114.0 µs | 8.2 µs | N/A |
| **Total Pipeline Cycle** | **0.024 ms** | 0.060 ms | 0.142 ms | 0.010 ms | — |

---

## 2. Research Questions (RQ1–RQ6) Answered

1. **RQ1 (Model Benchmark):** XGBoost decisively outperformed linear models and matched Random Forest at 2x lower computational latency.
2. **RQ2 (Feature Engineering):** 12 engineered behavioral and ledger features (`error_orig`, `orig_emptied`, night-window flags) increased fraud recall by **+17.5%** and PR-AUC from 0.9683 to 0.9987 (+3.04%).
3. **RQ3 (Imbalance Mitigation):** Class Weighting (`scale_pos_weight = 24.3`) matched SMOTE oversampling (0.9981 PR-AUC) with zero synthetic interpolation artifacts and 4x faster training.
4. **RQ4 (Temporal Generalisation):** Walk-forward temporal train/test split (training on steps 1–550, testing on future steps 551–743) maintained **99.95% recall**, proving zero temporal leakage.
5. **RQ5 (Individual Explainability):** Dual-layer XAI delivers user-friendly plain-English guidance for consumers alongside exact mathematical log-odds waterfall attributions for compliance auditors.
6. **RQ6 (Computational Overhead):** Raw inference takes 4.6 µs; TreeSHAP takes 19.1 µs. The total cycle is **0.024 ms**, which easily satisfies NPCI's sub-second switch SLAs.

---

## 3. System Architecture & Tech Stack

```text
[ UPI Client / Next.js 16 Web Dashboard ]
                 │
                 ▼  (HTTP REST / JSON Payload)
[ FastAPI High-Speed Async Serving Engine (Port 8000) ]
                 │
         ┌───────┴────────────────────────┐
         ▼                                ▼
[ 17-Feature Engineering ]        [ XGBoost Inference Engine ]
• Ledger Invariants (error_orig)  • 500 Boosted Decision Trees
• Account Drainage (orig_emptied) • Scale Pos Weight = 24.3
• Circadian Night Windows         • Latency: 4.6 microseconds
         │                                │
         └───────┬────────────────────────┘
                 ▼
[ Exact TreeSHAP Explainability Layer ]
• O(TLD²) Polynomial-Time Algorithm
• Additive Shapley Game Theory Decomposition
• Latency: 19.1 microseconds
                 │
                 ▼  (Total Response: 0.024 ms)
[ Dual-Layer Output Delivery ]
• Customer Tier (Plain-English Guidance & Safety Tips)
• Auditor Tier (Mathematical Waterfall & Forensic Inspector)
```

- **Machine Learning & Backend:** Python 3.11, XGBoost, TreeSHAP, Scikit-Learn, Pandas, NumPy, FastAPI, Uvicorn, Joblib
- **Frontend Dashboard:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Recharts, Framer Motion, Lucide Icons

---

## 4. Directory Structure

```text
UPI/
├── backend/
│   ├── main.py                  # FastAPI server (/api/predict, /api/random-sample, /api/metrics)
│   └── pipeline.py              # 17-feature extraction, XGBoost inference, and TreeSHAP XAI engine
├── artifacts/
│   ├── best_model.joblib        # Serialized XGBoost model (500 trees)
│   ├── shap_explainer.joblib    # Serialized TreeSHAP explainer
│   ├── scaler.joblib            # Feature scaling parameters
│   ├── test_engineered.parquet  # 41,643 strictly held-out test rows
│   └── model_benchmark_results.json # 5-model benchmark metrics
├── notebooks/
│   ├── 01_eda_and_preprocessing.ipynb
│   ├── 02_feature_engineering_and_imbalance.ipynb
│   ├── 03_model_training_and_benchmarking.ipynb
│   └── 04_explainability_and_xai.ipynb
├── data/
│   ├── final_engineered_fraud_data.xlsx # Exported evaluation dataset
│   └── final_engineered_fraud_data.csv
├── src/
│   ├── app/                     # Next.js App Router (/analyze, /models, /metrics, /insights)
│   ├── components/              # Dual-layer XAI, charts, network visualizer, sampler toolbar
│   └── lib/                     # API client, formatting, type definitions
├── _archive/                    # Offline generator scripts, CatBoost training logs, and viva defense notes
├── package.json
└── README.md
```

---

## 5. Quickstart: Running Sentinel Locally

### Step 1: Start the FastAPI ML Backend
From the project root:
```powershell
# Using activated virtual environment:
uvicorn backend.main:app --reload

# Or directly via venv python:
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The ML API will start at `http://127.0.0.1:8000` (interactive Swagger docs available at `http://127.0.0.1:8000/docs`).

### Step 2: Start the Next.js Frontend Dashboard
In a separate terminal:
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Live Dashboard Capabilities

- **Transaction Risk Analyzer (`/analyze`):** Test transactions using the **`🎲 Random Test Sample`** generator (stratified 50/50 balanced draws from the 41,643 held-out test rows), or test curated scenarios. Accepts standard UPI handles (e.g. `user@okhdfcbank`, `merchant@paytm`) and PaySim IDs.
- **Dual-Layer XAI Panel:** Interactive TreeSHAP waterfall chart with Risk/Trust filters and dual-tab perspectives (Customer Plain English vs. Auditor Compliance).
- **Model Comparison Matrix (`/models`):** Full 5-model empirical comparison table, PR-AUC curves, radar charts, and training/inference latency tradeoffs.
- **Confusion Matrix & KPIs (`/metrics`):** Breakdown of the 41,643 held-out test predictions (TP=1,638, FP=5, TN=39,995, FN=5) with plain-language banking risk explanations.
- **Research & Literature (`/insights`):** 5 landmark peer-reviewed papers (Vanini, Chang, Raj, Zhou, Lin & Gao), 10 systematic research gaps, and 6 empirical Research Questions.
