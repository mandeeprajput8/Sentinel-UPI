"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Edit3, RotateCcw } from "lucide-react";
import { AnalysisPipeline } from "@/components/analysis/AnalysisPipeline";
import { BehavioralSignals } from "@/components/analysis/BehavioralSignals";
import { ReceiverIntelligence } from "@/components/analysis/ReceiverIntelligence";
import { RiskBreakdown } from "@/components/analysis/RiskBreakdown";
import { RiskFactorCard } from "@/components/analysis/RiskFactorCard";
import { RiskGauge } from "@/components/analysis/RiskGauge";
import { TemporalChart } from "@/components/charts/TemporalChart";
import { TransactionNetwork } from "@/components/charts/TransactionNetwork";
import { ExplainabilityPanel } from "@/components/explainability/ExplainabilityPanel";
import { MathCalculationBreakdown } from "@/components/explainability/MathCalculationBreakdown";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { TransactionSummary } from "@/components/transaction/TransactionSummary";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tooltip } from "@/components/ui/Tooltip";
import { TOOLTIPS } from "@/lib/tooltips";
import { useAnalysis } from "@/lib/analysis-context";

export function AnalyzeWorkspace() {
  const { status, stageIndex, current, resetCurrent, editCurrent, lastError } = useAnalysis();

  if (status === "running") {
    return <AnalysisPipeline stageIndex={stageIndex} />;
  }

  if (status === "complete" && current) {
    const flagged = current.riskLevel !== "LOW";
    const top =
      current.riskLevel === "LOW"
        ? current.features.filter((f) => f.impact < 0).slice(0, 4)
        : current.riskLevel === "MEDIUM"
        ? [
            ...current.features.filter((f) => f.impact > 0).slice(0, 2),
            ...current.features.filter((f) => f.impact < 0).slice(0, 2),
          ]
        : current.features.filter((f) => f.impact > 0).slice(0, 4);

    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Transaction Risk Assessment</h2>
            <p className="mt-1 text-sm text-muted">{current.headline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              onClick={editCurrent}
              className="flex items-center gap-1.5 border border-accent/40 bg-accent/15 text-accent hover:bg-accent/25 hover:border-accent font-medium px-3.5 py-2 shadow-sm"
            >
              <Edit3 className="h-4 w-4" />
              Edit This Transaction
            </Button>
            <Button
              variant="ghost"
              onClick={resetCurrent}
              className="flex items-center gap-1.5 text-muted hover:text-foreground border border-border/60 hover:bg-surface-2 px-3 py-2 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Blank Transaction
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <RiskGauge score={current.riskScore} confidence={current.confidence} level={current.riskLevel} />
          <div className="panel flex flex-col justify-center p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge level={current.riskLevel} />
              <span className="text-sm text-muted">{current.prediction}</span>
              <Tooltip content={TOOLTIPS.riskScore} />
              <Tooltip content={TOOLTIPS.confidence} />
            </div>
            <p className="mt-4 text-lg font-medium">{current.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 rounded-lg border border-border/60 bg-surface-2/60 p-3.5">
              {current.explanation}
            </p>
            <p className="mt-2 text-xs text-muted">
              Scored by XGBoost (80 trees, 17 features with data-learned circadian &amp; channel risk distributions, PR-AUC 0.9980) with TreeSHAP attribution in &lt; 0.02 ms.
            </p>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-muted">Recommendations</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {current.recommendations.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-3">
            <h3 className="text-lg font-semibold">
              {current.riskLevel === "HIGH"
                ? "Key Forensic Risk Drivers (+SHAP Impact)"
                : current.riskLevel === "MEDIUM"
                ? "Conflicting Signals Equilibrium (Risk vs Trust)"
                : "Primary Safety Anchors & Trust Signals (-SHAP Impact)"}
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              {current.riskLevel === "HIGH"
                ? "The most decisive factors accelerating the risk score toward fraud."
                : current.riskLevel === "MEDIUM"
                ? "A balanced tug-of-war between high-risk indicators and strong mitigating safety dampeners."
                : "The dominant trust signals keeping the transaction securely within the legitimate threshold."}
            </p>
          </div>

          {current.positiveFactors && current.positiveFactors.length > 0 && current.riskLevel !== "HIGH" ? (
            <div className="mb-4 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-low">
                {current.riskLevel === "MEDIUM" ? "Mitigating Trust Dampeners" : "Verified Safety Anchors"}
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {current.positiveFactors.map((factor) => (
                  <li key={factor} className="panel border-low/20 bg-low/5 flex items-start gap-2 p-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-low" aria-hidden />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-3 lg:grid-cols-2">
            {top.map((feature, index) => (
              <motion.div key={feature.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <RiskFactorCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </section>

        <ExplainabilityPanel analysis={current} />
        <TransactionSummary input={current.input} />
        <BehavioralSignals sender={current.senderAnalysis} />
        <ReceiverIntelligence receiver={current.receiverAnalysis} />
        <div className="grid gap-4 lg:grid-cols-2">
          <TemporalChart temporal={current.temporalAnalysis} />
          <TransactionNetwork nodes={current.networkAnalysis.nodes} />
        </div>
        <RiskBreakdown composition={current.composition} />
        <p className="text-center text-xs text-muted">
          Risk scores are decision-support signals, not final banking actions.{" "}
          <Link href="/metrics" className="text-accent">
            View model metrics
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {lastError ? (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/20 p-4">
          <p className="text-sm font-semibold text-red-300">Backend Connection Error</p>
          <p className="mt-1 text-xs text-red-200/80">{lastError}</p>
          <p className="mt-2 text-xs text-muted">
            Make sure the FastAPI server is running:{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-accent">uvicorn backend.main:app --reload</code>
          </p>
        </div>
      ) : null}
      <TransactionForm />
    </div>
  );
}
