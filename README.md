# SentinelUPI: An Explainable and Imbalance-Aware Machine Learning Framework for Real-Time UPI Fraud Detection

**SentinelUPI** is a production-grade fraud intelligence framework engineered to detect, evaluate, and explain fraud in instant push-payment networks such as India's Unified Payments Interface (UPI). Built on an empirical dataset of **6,362,620 transactions**, SentinelUPI pairs an optimized **XGBoost ensemble** (80 gradient-boosted decision trees) with **exact polynomial-time TreeSHAP**, completing risk inference and mathematical attribution in **< 0.02 milliseconds** (~52,000 transactions/second).

---

## 1. Key Performance Highlights & Benchmark Results

SentinelUPI was systematically benchmarked against 4 baseline classifiers across **41,643 strictly held-out future transactions** (evaluating out-of-time generalisation):

| Metric | XGBoost (SentinelUPI Primary) | CatBoost | Random Forest | Decision Tree | Logistic Regression |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **PR-AUC (Primary Metric)** | **0.9980** | **0.9981** | **0.9984** | 0.9934 | 0.9483 |
| **ROC-AUC** | **0.9996** | 0.9995 | 0.9996 | 0.9983 | 0.9961 |
| **Fraud Recall** | **99.70%** (1,638 / 1,643) | 99.63% (1,637 / 1,643) | 99.70% (1,638 / 1,643) | 99.70% (1,638 / 1,643) | 97.32% (1,599 / 1,643) |
| **Precision** | **99.70%** | **100.0%** | 99.82% | 99.15% | 60.41% |
| **F1-Score** | **0.9970** | **0.9982** | 0.9976 | 0.9942 | 0.7455 |
| **False Positives (FPR)** | **5 in 40,000** (0.0125%) | **0 in 40,000** (0.0%) | 3 in 40,000 | 14 in 40,000 | 1,048 in 40,000 |
| **False Negatives (Missed)** | **5** | 6 | 5 | 5 | 44 |
| **Model Inference Latency** | **3.8 µs** | 1.8 µs | 31.9 µs | 1.8 µs | 0.3 µs |
| **XAI (TreeSHAP) Latency** | **~15.3 µs** | — | — | — | — |
| **Total Engine Cycle Time** | **< 0.02 ms** | — | — | — | — |

> [!NOTE]
> In high-throughput instant payment switches, Precision-Recall AUC (PR-AUC) and False Positive Rate are paramount: a 0.0125% false alarm rate prevents catastrophic alert fatigue and transaction declines for genuine users.

---

## 2. Dynamic Feature Engineering & Distribution Learning

SentinelUPI extracts **17 domain-specific features**, replacing rigid developer heuristics with **empirically learned probability distributions** computed across 166,570 training transactions:

1. **Learned Circadian Risk (`learned_hourly_risk`):** Replaces static binary night thresholds with an empirical 24-hour fraud distribution map. Fraud peaks between 02:00–06:00 (reaching 90.8% concentration) while daylight commercial hours (09:00–20:00) drop to ~2.2% baseline risk.
2. **Learned Channel Risk (`learned_type_risk`):** Replaces hardcoded flags with empirical channel risk weights: push payments (`TRANSFER` and `CASH_OUT`) account for >90% of confirmed losses (8.63% historical risk rate), whereas standard commercial merchant payments (`PAYMENT`, `DEBIT`, `CASH_IN`) reflect 0.0% fraud across 112,000+ benchmark records.
3. **Ledger Discrepancy Invariants (`error_orig`, `error_dest`):** Mathematical balances verifying whether debit/credit arithmetic holds (`oldbalanceOrg - amount - newbalanceOrig`).
4. **Behavioral Account Drainage (`orig_emptied`, `dest_zero_old`):** Binary flags detecting sudden zero-balance depletion of the originating account or transfers into dormant recipient accounts.
5. **Wealth Outflow & Inflow Ratios (`ratio_orig`, `ratio_dest`):** Relative transfer scale relative to sender total liquidity and destination balance.
6. **Merchant Destination & Round Amounts (`dest_is_merchant`, `is_round_amount`):** Distinguishes registered commercial entities and round denominations.

```text
               17-Feature Extraction Vector
 ┌──────────────────────┬──────────────────────┬──────────────────────┐
 │  Financial Balances  │   Learned Dynamics   │ Ledger & Behavioral  │
 ├──────────────────────┼──────────────────────┼──────────────────────┤
 │ • step               │ • learned_hourly_risk│ • error_orig         │
 │ • amount             │ • learned_type_risk  │ • error_dest         │
 │ • oldbalanceOrg      │ • hour (step % 24)   │ • orig_emptied       │
 │ • newbalanceOrig     │                      │ • dest_zero_old      │
 │ • oldbalanceDest     │                      │ • ratio_orig         │
 │ • newbalanceDest     │                      │ • ratio_dest         │
 │                      │                      │ • dest_is_merchant   │
 │                      │                      │ • is_round_amount    │
 └──────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 3. Forensic On-Disk Verification & Auditability

To ensure complete transparency and eliminate synthetic simulation ambiguity, SentinelUPI features a **Cryptographic On-Disk Provenance Engine**:

- **Physical Dataset Partitioning:** The test split consists of **41,643 physical rows** stored on disk in `artifacts/test_engineered.parquet`.
- **Persistent Transaction IDs:** Every transaction possesses an authentic identifier (e.g., `TXN-PS41K-000042` or `TXN-TR166K-...`), authentic sender/receiver account IDs, and a precise zero-based row index (`dataset_index`).
- **Real-Time Disk Verification (`/api/verify-transaction/{id}`):** The API reads directly from the parquet file on disk to confirm record existence, positional index, ground truth, and computes an immutable **SHA-256 financial checksum**.
- **Interactive UI Verification Badge:** The `/analyze` interface highlights whether a loaded transaction is a verified held-out partition record or a custom simulation, offering a one-click verification modal with SHA-256 fingerprint verification.

---

## 4. System Architecture & Tech Stack

```text
[ UPI Client / Next.js 16 Web Dashboard (Port 3000) ]
                 │
                 ▼  (HTTP REST / JSON Payload)
[ FastAPI High-Speed Async Serving Engine (Port 8000) ]
                 │
     ┌───────────┴────────────────────────┐
     ▼                                    ▼
[ 17-Feature Extraction Engine ]     [ Forensic Verification Engine ]
• Learned Circadian Risk (hourly)    • SHA-256 Financial Checksum
• Learned Channel Risk (type)        • On-Disk Parquet Row Lookup
• Ledger Invariants (error_orig)     • Authentic Account Provenance
     │                                    │
     └───────────┬────────────────────────┘
                 ▼
[ XGBoost Inference Engine (80 Trees, depth=6) ]
• Cost-Sensitive Scale Pos Weight = 24.3
• Latency: 3.8 microseconds
                 │
                 ▼
[ Exact TreeSHAP Explainability Layer ]
• O(TLD²) Polynomial-Time Exact Additive Attribution
• Latency: ~15.3 microseconds
                 │
                 ▼  (Total Cycle: < 0.02 ms)
[ Dual-Layer Output Delivery ]
• Customer Tier: Plain-English Risk Warnings & Defensive Guidance
• Compliance Tier: Mathematical Shapley Log-Odds Waterfall Attribution
```

### Core Technologies
- **Machine Learning & Backend:** Python 3.11+, XGBoost 2.x, TreeSHAP, Scikit-Learn, Pandas, NumPy, FastAPI, Uvicorn, Joblib
- **Frontend Dashboard:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Recharts, Framer Motion, Lucide Icons

---

## 5. Repository Structure

```text
SentinelUPI/
├── backend/
│   ├── main.py                  # FastAPI REST engine (/api/predict, /api/verify-transaction, /api/random-sample, /api/test-records, /api/metrics, /api/health)
│   ├── pipeline.py              # 17-feature extraction engine, dynamic risk distribution injection, XGBoost inference, and TreeSHAP attribution
│   └── train_and_save.py        # End-to-end reproducible training pipeline (data ingestion, feature engineering, model training, benchmarking, artifact export)
├── artifacts/
│   ├── best_model.joblib        # Serialized XGBoost model (80 boosted trees)
│   ├── shap_explainer.joblib    # Serialized exact TreeSHAP explainer
│   ├── scaler.joblib            # StandardScaler parameters for baseline models
│   ├── learned_distributions.json # Empirical hourly circadian and transaction channel fraud distributions
│   ├── curated_demo_samples.json  # Curated real-world fraud and legitimate scenarios with SHAP ground truths
│   ├── test_engineered.parquet  # 41,643 strictly held-out test rows with persistent IDs and SHA-256 verifiable signatures
│   └── model_benchmark_results.json # 5-classifier benchmark metrics and latency results
├── src/
│   ├── app/                     # Next.js App Router (/, /analyze, /models, /metrics, /insights, /history, /system)
│   ├── components/              # Analysis workspace, transaction form with on-disk verification, dual-layer XAI waterfall, radar charts, network visualizer
│   ├── lib/                     # API client, verification helpers, formatters, tooltips, analysis context
│   └── types/                   # TypeScript interfaces (TransactionInput, RiskAnalysis, FeatureContribution, etc.)
├── _archive/                    # Offline training partition (train_engineered.parquet), research notebooks, legacy scripts, and defense documentation
├── package.json                 # Next.js dependencies and run scripts
├── requirements.txt             # Python ML and backend dependencies
└── README.md
```

---

## 6. Quickstart: Running SentinelUPI Locally

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Step 1: Set Up Python Virtual Environment & Dependencies
```powershell
# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install required Python packages
pip install -r requirements.txt
```

### (Optional) Retrain Models and Regenerate Artifacts
To execute the complete reproducible training and benchmarking pipeline:
```powershell
python -m backend.train_and_save
```
*This processes the dataset, learns hourly/channel distributions, evaluates all 5 models, and outputs all joblib/json artifacts to `artifacts/`.*

### Step 2: Start the FastAPI Backend
```powershell
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The REST API will be available at `http://127.0.0.1:8000` (interactive OpenAPI docs at `http://127.0.0.1:8000/docs`).

### Step 3: Start the Next.js Frontend
In a separate terminal:
```powershell
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/predict` | `POST` | Accepts a transaction payload, extracts 17 features, performs XGBoost inference, and computes TreeSHAP explanations. |
| `/api/verify-transaction/{id}` | `GET` | Cryptographically and positionally verifies that a transaction exists in the test or train parquet file on disk, returning an immutable SHA-256 checksum. |
| `/api/random-sample` | `GET` | Retrieves an authentic random transaction drawn from the 41,643 held-out test partition (supports `?label=fraud` or `?label=legitimate`). |
| `/api/test-records` | `GET` | Paginated inspector endpoint for held-out physical parquet records (`?offset=0&limit=20&fraud_only=true`). |
| `/api/metrics` | `GET` | Returns 5-classifier benchmark results, confusion matrices, and latency metrics. |
| `/api/test-samples` | `GET` | Returns curated high-risk, borderline, and low-risk demo scenarios. |
| `/api/health` | `GET` | Health check endpoint returning model and explainer status. |

---

## 8. Frontend Dashboard Modules

- **Transaction Risk Analyzer (`/analyze`):** Interactive transaction workbench with support for standard UPI handles (`user@okhdfcbank`, `merchant@paytm`), randomized sampling from the 41,643 held-out test set, and **real-time on-disk cryptographic verification**.
- **Dual-Layer XAI Panel:** Interactive TreeSHAP waterfall visualization featuring customer plain-English security advice alongside mathematical log-odds attributions for compliance auditors.
- **Model Benchmark Matrix (`/models`):** Head-to-head empirical comparison of 5 classifiers (XGBoost, CatBoost, Random Forest, Decision Tree, Logistic Regression) with PR-AUC curves and radar charts.
- **Confusion Matrix & KPIs (`/metrics`):** Breakdown of held-out test predictions (1,638 TP, 5 FP, 39,995 TN, 5 FN) with financial risk interpretations.
- **Research & Literature (`/insights`):** Survey of 5 seminal fraud detection papers, 10 industry research gaps, and formulation of Research Questions RQ1–RQ6.
- **Analysis History (`/history`):** Client-side transaction assessment log persisted in local storage.
- **Live Gateway Telemetry (`/system`):** Real-time monitoring center displaying engine health, diagnostic latency pings, and payment switch SLA compliance.
