"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  Cpu,
  HelpCircle,
  ShieldAlert,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchBenchmarkMetrics } from "@/lib/api/prediction";

interface ModelMetric {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  pr_auc: number;
  roc_auc: number;
  false_positives: number;
  false_negatives: number;
  train_time_sec: number;
  latency_us: number;
}

const STATIC_BENCHMARK: Record<string, ModelMetric> = {
  "Logistic Regression": {
    accuracy: 0.9692,
    precision: 0.5634,
    recall: 0.9702,
    f1_score: 0.7129,
    pr_auc: 0.941,
    roc_auc: 0.9955,
    false_positives: 1235,
    false_negatives: 49,
    train_time_sec: 0.357,
    latency_us: 0.1,
  },
  "Decision Tree": {
    accuracy: 0.9996,
    precision: 0.9939,
    recall: 0.997,
    f1_score: 0.9954,
    pr_auc: 0.994,
    roc_auc: 0.9981,
    false_positives: 10,
    false_negatives: 5,
    train_time_sec: 0.736,
    latency_us: 0.2,
  },
  "Random Forest": {
    accuracy: 0.9998,
    precision: 0.9982,
    recall: 0.997,
    f1_score: 0.9976,
    pr_auc: 0.9986,
    roc_auc: 0.9998,
    false_positives: 3,
    false_negatives: 5,
    train_time_sec: 0.884,
    latency_us: 0.7,
  },
  XGBoost: {
    accuracy: 0.9998,
    precision: 0.997,
    recall: 0.997,
    f1_score: 0.997,
    pr_auc: 0.9981,
    roc_auc: 0.9996,
    false_positives: 5,
    false_negatives: 5,
    train_time_sec: 0.342,
    latency_us: 0.2,
  },
  CatBoost: {
    accuracy: 0.9997,
    precision: 0.9964,
    recall: 0.997,
    f1_score: 0.9967,
    pr_auc: 0.9986,
    roc_auc: 0.9996,
    false_positives: 6,
    false_negatives: 5,
    train_time_sec: 0.802,
    latency_us: 0.1,
  },
};

export default function ModelComparisonPage() {
  const [metrics, setMetrics] = useState<Record<string, ModelMetric>>(STATIC_BENCHMARK);
  const [selectedMetric, setSelectedMetric] = useState<"f1_score" | "pr_auc" | "precision" | "recall">("pr_auc");

  useEffect(() => {
    fetchBenchmarkMetrics().then((res) => {
      if (res && Object.keys(res).length > 0) {
        setMetrics(res);
      }
    });
  }, []);

  const chartData = Object.entries(metrics).map(([name, data]) => ({
    name,
    score: Number((data[selectedMetric] * 100).toFixed(2)),
    isWinner: name === "XGBoost",
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Banner */}
      <section className="panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Empirical Benchmark</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                41,643 Held-Out Test Transactions
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Multi-Model Performance Study (RQ1)
            </h2>
            <p className="mt-2 text-sm text-muted max-w-3xl leading-relaxed">
              Systematic evaluation of 5 classification paradigms trained with cost-sensitive class balancing.
              Models are benchmarked on Precision-Recall trade-off, false alarm control, and inference speed.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 p-3.5 text-accent">
            <Award className="h-6 w-6" />
            <div>
              <p className="text-xs font-semibold">Production Winner</p>
              <p className="text-sm font-bold text-foreground">XGBoost Classifier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Metric Comparison Bar Chart */}
      <section className="panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Comparative Metric Spectrum</h3>
            <p className="mt-1 text-xs text-muted">
              Select a metric to observe how model architectures perform across the precision-recall trade-off.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 p-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedMetric("pr_auc")}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                selectedMetric === "pr_auc" ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              PR-AUC
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric("f1_score")}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                selectedMetric === "f1_score" ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              F1-Score
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric("precision")}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                selectedMetric === "precision" ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              Precision
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric("recall")}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                selectedMetric === "recall" ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              Recall
            </button>
          </div>
        </div>

        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 16, left: -10, bottom: 8 }}>
              <XAxis dataKey="name" tick={{ fill: "#8b97a8", fontSize: 11 }} />
              <YAxis domain={[90, 100]} tick={{ fill: "#8b97a8", fontSize: 11 }} unit="%" />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-[#0f172a] p-3 text-xs shadow-xl">
                      <p className="font-semibold text-white">{item.name}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-muted uppercase tracking-wider">{selectedMetric.replace("_", " ").toUpperCase()}:</span>
                        <span className="font-mono font-bold text-accent text-sm">{item.score}%</span>
                      </div>
                      {item.isWinner && (
                        <p className="mt-1 text-[10px] font-semibold text-emerald-400">
                          ★ Production Deployment Winner
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.isWinner ? "#10b981" : "#0284c7"}
                    stroke={entry.isWinner ? "#ffffff" : undefined}
                    strokeWidth={entry.isWinner ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Full Benchmark Matrix Table */}
      <section className="panel overflow-hidden">
        <div className="border-b border-border bg-surface-2/60 p-4">
          <h3 className="font-semibold text-foreground">Complete Cross-Model Evaluation Matrix</h3>
          <p className="mt-0.5 text-xs text-muted">
            Evaluated on held-out test data (40,000 legitimate transactions and 1,643 fraudulent transactions).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-1 text-muted">
              <tr>
                <th className="py-3 px-4 font-semibold">Algorithm</th>
                <th className="py-3 px-3 font-semibold">PR-AUC</th>
                <th className="py-3 px-3 font-semibold">F1-Score</th>
                <th className="py-3 px-3 font-semibold">Recall</th>
                <th className="py-3 px-3 font-semibold">Precision</th>
                <th className="py-3 px-3 font-semibold text-red-400">False Positives (FP)</th>
                <th className="py-3 px-3 font-semibold text-amber-400">False Negatives (FN)</th>
                <th className="py-3 px-3 font-semibold">Train Time</th>
                <th className="py-3 px-4 font-semibold text-emerald-400">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {Object.entries(metrics).map(([name, row]) => {
                const isWinner = name === "XGBoost";
                return (
                  <tr key={name} className={isWinner ? "bg-accent/5 font-medium" : "hover:bg-surface-2/40"}>
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      {isWinner ? <Award className="h-4 w-4 text-emerald-400" /> : null}
                      <span>{name}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400 font-semibold">
                      {(row.pr_auc * 100).toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-3 font-mono">{(row.f1_score * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-3 font-mono">{(row.recall * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-3 font-mono">{(row.precision * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-3 font-mono text-red-400 font-semibold">{row.false_positives}</td>
                    <td className="py-3.5 px-3 font-mono text-amber-400">{row.false_negatives}</td>
                    <td className="py-3.5 px-3 font-mono text-muted">{row.train_time_sec.toFixed(2)}s</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">{row.latency_us.toFixed(1)} us</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rationale Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <div className="flex items-center gap-2 text-accent">
            <Cpu className="h-4 w-4" />
            <h4 className="font-semibold text-sm text-foreground">Why XGBoost Won</h4>
          </div>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Delivers the optimal Pareto frontier: <strong>0.9981 PR-AUC</strong>, 99.70% recall, only 5 false positives,
            and ultra-fast <strong>0.2us latency</strong>.
          </p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="h-4 w-4" />
            <h4 className="font-semibold text-sm text-foreground">Why Linear Baseline Failed</h4>
          </div>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Logistic Regression generated <strong>1,235 false positives</strong> (56.3% precision) because financial fraud
            involves non-linear feature interactions that linear boundaries cannot separate.
          </p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Zap className="h-4 w-4" />
            <h4 className="font-semibold text-sm text-foreground">Sub-Microsecond Speed</h4>
          </div>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            At 0.2 microseconds per decision, the model can evaluate <strong>500,000 transactions/second</strong>,
            easily exceeding peak UPI national demand (~10,000 txns/sec).
          </p>
        </div>
      </div>
    </div>
  );
}
