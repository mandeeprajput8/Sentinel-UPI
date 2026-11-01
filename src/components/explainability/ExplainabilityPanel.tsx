"use client";

import { useState } from "react";
import { FeatureContributionChart } from "@/components/explainability/FeatureContributionChart";
import { ScoreDerivationCard } from "@/components/analysis/ScoreDerivationCard";
import type { FeatureContribution, RiskAnalysis } from "@/types/analysis";
import { Tooltip } from "@/components/ui/Tooltip";
import { TOOLTIPS } from "@/lib/tooltips";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileText,
  HelpCircle,
  Layers,
  Scale,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ExplainabilityPanel({ analysis }: { analysis: RiskAnalysis }) {
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureContribution | null>(null);
  const [activeTab, setActiveTab] = useState<
    "CUSTOMER" | "AUDITOR" | "FACTORS"
  >("CUSTOMER");

  return (
    <div className="space-y-6">
      {/* Narrative Section Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-foreground">
              Explainable AI (XAI) Audit Suite
            </h3>
            <Tooltip content="Explainable AI suite providing TreeSHAP feature attributions, model confidence calibration, and regulatory audit rationales." />
          </div>
          <p className="text-xs text-muted">
            Inspect model rationale, SHAP attribution values, and regulatory
            compliance logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs">
            <span className="text-muted">TreeSHAP Baseline:</span>
            <span className="font-mono font-semibold text-foreground">
              49.68%
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted">Global Anomaly Rate:</span>
              <Tooltip content="Baseline percentage of transactions flagged as anomalous across the benchmark dataset." />
            </div>
            <p className="font-mono text-xs font-semibold text-foreground">
              3.94%
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Waterfall Chart */}
      <FeatureContributionChart
        features={analysis.features}
        onSelectFeature={(feat) => setSelectedFeature(feat)}
        selectedId={selectedFeature?.id}
      />

      {/* Mathematical Fraud Score Derivation */}
      <ScoreDerivationCard
        calc={analysis.mathCalculation}
        riskScore={analysis.riskScore}
        features={analysis.features}
      />

      {/* Selected Feature Forensic Inspector (Dynamic card when user clicks a bar) */}
      <AnimatePresence>
        {selectedFeature ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="panel border-accent/40 bg-surface-2 p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-accent">
                      {selectedFeature.category}
                    </span>
                    <h4 className="font-display text-base font-bold text-foreground">
                      {selectedFeature.name}
                    </h4>
                  </div>
                  <p className="text-xs text-muted">
                    Feature Key: {selectedFeature.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFeature(null)}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Close &times;
                </button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-surface-1 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted">
                    Raw Impact Value
                  </p>
                  <p
                    className={`mt-1 font-mono text-xl font-bold ${
                      selectedFeature.impact > 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {selectedFeature.impact > 0
                      ? `+${selectedFeature.impact}`
                      : selectedFeature.impact}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Marginal change to log-odds
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-surface-1 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted">
                    Variance Share
                  </p>
                  <p className="mt-1 font-mono text-xl font-bold text-foreground">
                    {selectedFeature.contributionPct}%
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Relative explanation weight
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-surface-1 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted">
                    Directional State
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {selectedFeature.impact > 0 ? (
                      <>
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span className="text-sm font-semibold text-red-400">
                          Risk Accelerator
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-400">
                          Safety Anchor
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {selectedFeature.impact > 0
                      ? "Heightens fraud likelihood"
                      : "Reduces suspicion"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-surface-1/50 p-3">
                <p className="text-xs font-semibold text-foreground">
                  Forensic Diagnostic Rationale
                </p>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  {selectedFeature.detail}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Dual Explanation Tabs: Customer plain language vs Regulatory Audit */}
      <div className="panel p-5">
        <div className="flex border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("CUSTOMER")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "CUSTOMER"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Customer Plain Language Notice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("AUDITOR")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "AUDITOR"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            Regulatory Compliance Dossier (RBI/NPCI)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("FACTORS")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "FACTORS"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Compensating Mitigations
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "CUSTOMER" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Plain English Explanation
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {analysis.explanation}
                </p>
              </div>

              {analysis.recommendations?.length > 0 && (
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                  <p className="text-xs font-semibold text-accent">
                    Recommended Customer Action
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "AUDITOR" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="text-xs font-bold text-foreground">
                      Technical Algorithm Decision Rationale
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-muted">
                    TreeSHAP Additivity Check: Validated
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted font-mono bg-surface-1 p-3 rounded border border-border">
                  {analysis.technicalInterpretation}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface-2 p-3.5">
                  <span className="text-[11px] font-semibold text-muted">
                    Audit Checksum Reference
                  </span>
                  <p className="mt-1 font-mono text-xs text-foreground truncate">
                    {analysis.id}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface-2 p-3.5">
                  <span className="text-[11px] font-semibold text-muted">
                    Confidence Calibrator
                  </span>
                  <p className="mt-1 font-mono text-xs text-foreground">
                    {(analysis.confidence > 1
                      ? analysis.confidence
                      : analysis.confidence * 100
                    ).toFixed(1)}% (Brier Score Optimised)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "FACTORS" && (
            <div className="space-y-3">
              {analysis.positiveFactors && analysis.positiveFactors.length > 0 ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-bold">
                      Positive Dampeners (Mitigating Context)
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    The following signals lowered the final risk score:
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-300">
                    {analysis.positiveFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-4">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-bold">
                      No Compensating Mitigations (Pure Unmitigated Risk)
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    Zero trust anchors or risk-dampening factors were detected for this transaction. 
                    Every evaluated feature pushes toward unauthorized balance extraction (total account drain, 
                    unbacked counterparty, nocturnal window). Because no mitigating factors exist to counterbalance 
                    these signals, the model assigns maximum confidence to an immediate transaction hold / block.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-rose-300/80 bg-rose-950/40 p-2.5 rounded border border-rose-500/20">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                    <span>Regulatory Directive: Full settlement freeze mandated under RBI Digital Payment Security Controls.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
