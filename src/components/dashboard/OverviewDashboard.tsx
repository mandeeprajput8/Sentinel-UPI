"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Database,
  Sliders,
  Clock,
  UserCheck,
  Network,
  Cpu,
  Sparkles,
  ChevronRight,
  Zap,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { AnalyzeCta } from "@/components/dashboard/AnalyzeCta";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAnalysis } from "@/lib/analysis-context";

interface PipelineStage {
  id: string;
  name: string;
  shortTag: string;
  icon: any;
  latency: string;
  headline: string;
  description: string;
  technicalDetails: string[];
  sampleTransformation: {
    input: string;
    output: string;
  };
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "input",
    name: "Transaction Ingestion",
    shortTag: "Stage 1",
    icon: Database,
    latency: "< 0.001 ms",
    headline: "Ingesting raw push-payment payload into API schema",
    description: "Accepts incoming UPI/payment attributes over FastAPI. Validates transaction type (TRANSFER, CASH_OUT, PAYMENT), monetary amount, time step, and opening/closing balances for both counterparties.",
    technicalDetails: [
      "Strict Pydantic schema validation on incoming JSON payloads",
      "Compatible with real UPI virtual payment addresses (e.g. user@okhdfcbank) and PaySim account IDs",
      "Handles missing destination balances gracefully via financial domain heuristics"
    ],
    sampleTransformation: {
      input: '{ "type": "TRANSFER", "amount": 250000, "senderOldBalance": 250000 }',
      output: "Validated TransactionPayload instance (In-Memory Buffer)"
    }
  },
  {
    id: "features",
    name: "Feature Engineering",
    shortTag: "Stage 2 (17 Features)",
    icon: Sliders,
    latency: "0.003 ms",
    headline: "Extracting 12 domain ledger-invariants and accounting rules",
    description: "Transforms raw fields into non-linear behavioral signals that expose fraud physics. Evaluates whether the sender balance was drained to zero (orig_emptied) and calculates origin/destination mathematical discrepancies.",
    technicalDetails: [
      "Accounting Invariants: error_orig = oldbalanceOrg - amount - newbalanceOrig",
      "Destination Invariant: error_dest = oldbalanceDest + amount - newbalanceDest",
      "Account Takeover Signature: orig_emptied = 1 (100% balance liquidation)",
      "Ratio Analysis: ratio_orig = amount / (oldbalanceOrg + 1.0)"
    ],
    sampleTransformation: {
      input: "Raw: amount=₹2,50,000 | old=₹2,50,000 | new=₹0",
      output: "Engineered: orig_emptied=1 | error_orig=0.0 | ratio_orig=0.999"
    }
  },
  {
    id: "temporal",
    name: "Temporal Dynamics",
    shortTag: "Stage 3",
    icon: Clock,
    latency: "0.001 ms",
    headline: "Circadian night-window and burst sequence mapping",
    description: "Translates the operational time step into hour-of-day circadian rhythm bands (hour = step % 24). Financial fraud concentrates 4.2x more heavily between 10 PM and 5 AM when users are asleep and unable to notice push notifications.",
    technicalDetails: [
      "Hour Extraction: int(step % 24) maps continuous simulation steps to 24-hour cycles",
      "Night Window Flag: is_night_window = 1 if hour >= 22 or hour < 5",
      "Longitudinal stability proven under walk-forward temporal evaluation (RQ4: 99.95% recall)"
    ],
    sampleTransformation: {
      input: "Time Step 129",
      output: "Hour = 09:00 (Daytime Normal Window | is_night_window = 0)"
    }
  },
  {
    id: "behavioral",
    name: "Behavioral Profiling",
    shortTag: "Stage 4",
    icon: UserCheck,
    latency: "0.002 ms",
    headline: "Sender historical deviation and velocity assessment",
    description: "Benchmarks the transaction amount against typical user expenditure baselines. Spikes exceeding 500% of historical average trigger immediate elevation to secondary authentication tiers.",
    technicalDetails: [
      "Amount Deviation: ((Amount - Historical Average) / Average) * 100",
      "Velocity Classification: Tracks inter-transaction frequency and acceleration",
      "Dynamic thresholds calibrated to maintain ultra-low 0.0125% False Positive Rate"
    ],
    sampleTransformation: {
      input: "Amount: ₹1,00,00,000 vs Baseline Average: ₹15,00,000",
      output: "Amount Deviation: +566.7% (Abnormal Liquidation Velocity)"
    }
  },
  {
    id: "network",
    name: "Receiver Intelligence",
    shortTag: "Stage 5",
    icon: Network,
    latency: "0.002 ms",
    headline: "Destination fan-in, merchant verification, and mule indicators",
    description: "Categorizes destination endpoints between verified merchants (M... prefixes / QR payment settlement) and private accounts. Unverified accounts receiving sudden high-velocity inflows from multiple senders are tagged for mule ring analysis.",
    technicalDetails: [
      "Merchant Flag: dest_is_merchant = 1 if receiverId starts with 'M' or contains 'merchant'",
      "Zero-Fraud Guarantee: PAYMENT to verified merchants historically exhibits 0% fraud",
      "Fan-in Node Analysis: Flags dormant destinations suddenly receiving high-value transfers"
    ],
    sampleTransformation: {
      input: "Receiver: 'C9876543210' with ₹0 opening balance",
      output: "Tag: Unverified Private Destination | Prior Balance = ₹0 (dest_zero_old = 1)"
    }
  },
  {
    id: "xgboost",
    name: "XGBoost Classification",
    shortTag: "Stage 6",
    icon: Cpu,
    latency: "0.0046 ms (4.6 µs)",
    headline: "Ensemble of 500 boosted gradient trees scoring 17 features",
    description: "The engineered vector is evaluated through our winning XGBoost model trained with cost-sensitive class weighting (scale_pos_weight = 24.3). Produces calibrated fraud probability with 99.81% PR-AUC.",
    technicalDetails: [
      "Ensemble Spec: 500 boosted decision trees, max_depth = 6, learning_rate = 0.05",
      "Cost Sensitivity: scale_pos_weight = 24.3 to penalize false negatives without SMOTE distortion",
      "Empirical Benchmark (RQ1): 99.70% recall (1,638 of 1,643 frauds caught) with only 5 false alarms out of 40,000"
    ],
    sampleTransformation: {
      input: "17-element normalized NumPy feature vector",
      output: "Fraud Probability = 99.85% | Classification Tier: HIGH RISK"
    }
  },
  {
    id: "treeshap",
    name: "TreeSHAP Attribution",
    shortTag: "Stage 7",
    icon: Sparkles,
    latency: "0.0191 ms (19.1 µs)",
    headline: "Exact polynomial-time cooperative game-theoretic explanation",
    description: "Computes exact additive Shapley values for all 17 features in 19.1 microseconds using Lundberg's TreeSHAP algorithm (O(TLD²)). Deconstructs the prediction into positive risk drivers and negative trust anchors for instant auditability.",
    technicalDetails: [
      "Exact Additivity: Base Log-Odds (-2.485) + Σ(SHAP_i) = Final Prediction Log-Odds",
      "Ultra-Fast Execution: 0.019 ms enables real-time inline explanation inside UPI's ~1500 ms SLA",
      "Dual-Layer Output: Plain-English security advice for consumers; mathematical waterfall for auditors"
    ],
    sampleTransformation: {
      input: "Tree ensemble structure + active transaction split paths",
      output: "error_orig (+6.38 log-odds) | orig_emptied (+0.42) | is_high_risk (+1.85)"
    }
  }
];

export function OverviewDashboard() {
  const { history } = useAnalysis();
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);

  const analyzed = history.length;
  const highRisk = history.filter((h) => h.riskLevel === "HIGH").length;
  const avg =
    history.length > 0
      ? history.reduce((sum, h) => sum + h.riskScore, 0) / history.length
      : 0;

  const ActiveIcon = selectedStage.icon;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero Banner */}
      <section className="panel overflow-hidden p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Sentinel Fraud Intelligence</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
          Understand the Risk Behind Every Transaction.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base leading-relaxed">
          An explainable and imbalance-aware ML framework for UPI fraud detection. Powered by XGBoost + TreeSHAP with 0.9981 PR-AUC and 0.024 ms inference latency.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20 cursor-pointer"
          >
            Analyze Transaction
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-surface-2 transition cursor-pointer"
          >
            Research & Literature
          </Link>
        </div>
      </section>

      {/* Session Summary KPIs */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Session Summary</h3>
        <p className="mt-1 text-sm text-muted">
          Live analysis counts from your current browser session.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Transactions Analyzed" value={analyzed} hint="This session" />
        <StatCard label="High Risk Detected" value={highRisk} hint="This session" />
        <StatCard label="Average Risk Score" value={avg} suffix="%" decimals={1} hint={analyzed > 0 ? "Session average" : "No data yet"} />
        <StatCard label="Model PR-AUC" value={99.81} suffix="%" decimals={2} hint="XGBoost on 41,643 test rows" />
      </div>

      <AnalyzeCta />

      {/* Dynamic Interactive Inference Pipeline Section */}
      <section className="panel p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <h3 className="text-xl font-semibold text-foreground">Live Inference Pipeline Architecture</h3>
            </div>
            <p className="mt-1 text-xs text-muted">
              Click any stage below to inspect its data transformation, latency SLA, and mathematical mechanics.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-emerald-300 font-mono font-medium">
              Total SLA: 0.024 ms
            </span>
          </div>
        </div>

        {/* Pipeline Stepper Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isSelected = selectedStage.id === stage.id;
            const StageIcon = stage.icon;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStage(stage)}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "border-accent bg-accent/15 shadow-md shadow-accent/10"
                    : "border-border bg-surface-2 hover:border-accent/40 hover:bg-surface"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                    isSelected ? "text-accent" : "text-muted"
                  }`}>
                    Step {idx + 1}
                  </span>
                  <StageIcon className={`h-3.5 w-3.5 ${isSelected ? "text-accent" : "text-muted"}`} />
                </div>
                <p className="text-xs font-semibold text-foreground leading-tight">{stage.name}</p>
                <span className="mt-1 text-[10px] font-mono text-muted">{stage.latency}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activePipelineIndicator"
                    className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rotate-45 border-r border-b border-accent"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card for Selected Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-accent/30 bg-surface-2 p-5 sm:p-6 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/30">
                  <ActiveIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                      {selectedStage.shortTag}
                    </span>
                    <span className="text-muted">•</span>
                    <span className="text-xs text-muted font-mono">Latency SLA: {selectedStage.latency}</span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground mt-0.5">{selectedStage.name}</h4>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active in Production
              </span>
            </div>

            <p className="text-sm text-foreground/90 font-medium leading-relaxed">
              {selectedStage.headline}
            </p>
            <p className="text-xs text-muted leading-relaxed">
              {selectedStage.description}
            </p>

            {/* Technical Specifications & Rules */}
            <div className="grid gap-4 md:grid-cols-2 pt-2">
              <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Engineering & Algorithmic Rules
                </span>
                <ul className="space-y-1.5 text-xs text-muted pt-1">
                  {selectedStage.technicalDetails.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Flow Preview (Input -> Output) */}
              <div className="rounded-xl border border-border bg-surface p-4 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    Input → Output Data Transformation
                  </span>
                  <div className="mt-2 space-y-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-surface-2 border border-border">
                      <span className="text-[10px] text-muted uppercase block mb-0.5">Stage Input:</span>
                      <span className="text-foreground/90 break-all">{selectedStage.sampleTransformation.input}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 uppercase block mb-0.5">Stage Output:</span>
                      <span className="text-emerald-300 break-all">{selectedStage.sampleTransformation.output}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}