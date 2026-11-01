"use client";

import { useState } from "react";
import type { FeatureContribution, MathCalculation } from "@/types/analysis";
import { formatPercent } from "@/lib/format";
import { Calculator, ChevronDown, ChevronUp, Sparkles, ArrowRight } from "lucide-react";

export function ScoreDerivationCard({
  calc,
  riskScore,
  features = [],
}: {
  calc?: MathCalculation;
  riskScore?: number;
  features?: FeatureContribution[];
}) {
  const [isOpen, setIsOpen] = useState(true);

  const posSum = features.filter((f) => f.impact > 0).reduce((acc, f) => acc + f.impact, 0);
  const negSum = features.filter((f) => f.impact < 0).reduce((acc, f) => acc + f.impact, 0);

  const baseLogOdds = calc?.baseLogOdds ?? -0.0127;
  const positiveShapSum = calc?.positiveShapSum ?? posSum;
  const negativeShapSum = calc?.negativeShapSum ?? negSum;
  const netMarginLogOdds = calc?.netMarginLogOdds ?? Number((baseLogOdds + positiveShapSum + negativeShapSum).toFixed(4));
  const calibratedRiskPercent = calc?.calibratedRiskPercent ?? (riskScore !== undefined ? riskScore : Number((100 / (1 + Math.exp(-netMarginLogOdds))).toFixed(2)));

  const isHigh = calibratedRiskPercent >= 70;
  const isMedium = calibratedRiskPercent >= 30 && calibratedRiskPercent < 70;
  const badgeColor = isHigh
    ? "text-red-400 bg-red-500/15 border-red-500/40"
    : isMedium
    ? "text-amber-400 bg-amber-500/15 border-amber-500/40"
    : "text-emerald-400 bg-emerald-500/15 border-emerald-500/40";

  return (
    <div className="panel overflow-hidden border border-accent/30 bg-surface-1 shadow-xl">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-surface-2/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground text-sm">
                Mathematical Fraud Score Derivation
              </h4>
              <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                TreeSHAP Exact Additivity
              </span>
            </div>
            <p className="text-xs text-muted">
              Step-by-step algebraic conversion from decision-tree log-odds margins to final calibrated probability.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className={`rounded-lg border px-3 py-1 font-mono text-xs font-bold ${badgeColor}`}>
            Final Probability: {formatPercent(calibratedRiskPercent, 2)}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="border-t border-border p-5 space-y-5">
          {/* Formula Callout */}
          <div className="rounded-xl border border-border bg-[#090d16] p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              Core Sigmoid Link Equation
            </p>
            <div className="mt-2 font-mono text-sm sm:text-base text-foreground font-semibold">
              <span className="text-muted">P(Fraud)</span> ={" "}
              <span className="text-accent">&sigma;</span>(
              <span className="text-cyan-400">&phi;<sub>0</sub></span> +{" "}
              <span className="text-red-400">&Sigma;&phi;<sub>risk</sub></span> +{" "}
              <span className="text-emerald-400">&Sigma;&phi;<sub>trust</sub></span>) ={" "}
              <span className="inline-block border-b border-border pb-0.5">1</span> /{" "}
              <span>(1 + e<sup>-f(x)</sup>)</span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              Where <span className="font-mono text-foreground">f(x)</span> is the net margin in log-odds space, guaranteed by TreeSHAP efficiency.
            </p>
          </div>

          {/* Step by Step Breakdown Cards */}
          <div className="grid gap-3 sm:grid-cols-4">
            {/* Step 1: Base Prior */}
            <div className="rounded-xl border border-border bg-surface-2/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Step 1 · Base Prior (&phi;<sub>0</sub>)
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <p className="mt-2 font-mono text-lg font-bold text-foreground">
                  {baseLogOdds >= 0 ? `+${baseLogOdds.toFixed(4)}` : baseLogOdds.toFixed(4)}
                </p>
                <p className="text-[11px] text-muted">Expected tree baseline</p>
              </div>
              <p className="mt-2 text-[10px] text-muted border-t border-border/50 pt-1.5">
                Baseline log-odds prior before factoring in features.
              </p>
            </div>

            {/* Step 2: Risk Multipliers */}
            <div className="rounded-xl border border-border bg-surface-2/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    Step 2 · &Sigma;&phi; Risk Drivers
                  </span>
                  <span className="text-xs font-bold text-red-400">+SHAP</span>
                </div>
                <p className="mt-2 font-mono text-lg font-bold text-red-400">
                  +{positiveShapSum.toFixed(3)}
                </p>
                <p className="text-[11px] text-muted">Anomalous signals</p>
              </div>
              <p className="mt-2 text-[10px] text-muted border-t border-border/50 pt-1.5">
                Features pushing margin higher toward fraud.
              </p>
            </div>

            {/* Step 3: Trust Dampeners */}
            <div className="rounded-xl border border-border bg-surface-2/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Step 3 · &Sigma;&phi; Trust Dampeners
                  </span>
                  <span className="text-xs font-bold text-emerald-400">-SHAP</span>
                </div>
                <p className="mt-2 font-mono text-lg font-bold text-emerald-400">
                  {negativeShapSum.toFixed(3)}
                </p>
                <p className="text-[11px] text-muted">Solvency & safety signals</p>
              </div>
              <p className="mt-2 text-[10px] text-muted border-t border-border/50 pt-1.5">
                Features pulling margin lower toward legitimate.
              </p>
            </div>

            {/* Step 4: Net Margin Score */}
            <div className="rounded-xl border border-border bg-surface-2/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    Step 4 · Net Margin f(x)
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="mt-2 font-mono text-lg font-bold text-accent">
                  {netMarginLogOdds >= 0 ? `+${netMarginLogOdds.toFixed(4)}` : netMarginLogOdds.toFixed(4)}
                </p>
                <p className="text-[11px] text-muted">Final raw log-odds</p>
              </div>
              <p className="mt-2 text-[10px] text-muted border-t border-border/50 pt-1.5">
                Sum: &phi;<sub>0</sub> + &Sigma;&phi;<sub>risk</sub> + &Sigma;&phi;<sub>trust</sub>
              </p>
            </div>
          </div>

          {/* High-Visibility Arithmetic Proof Strip */}
          <div className="rounded-xl border-2 border-accent/40 bg-[#090f1a] p-4 sm:p-5 shadow-2xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            {/* Left side: Clean Formula Operation */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base">
              {/* Base */}
              <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-2.5 py-1.5">
                <span className="font-bold text-cyan-300">
                  {baseLogOdds >= 0 ? `+${baseLogOdds.toFixed(3)}` : baseLogOdds.toFixed(3)}
                </span>
                <span className="text-[11px] font-medium text-cyan-400/80">base</span>
              </div>

              <span className="text-lg font-bold text-slate-300">+</span>

              {/* Risk */}
              <div className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-950/50 px-2.5 py-1.5">
                <span className="font-bold text-red-400">
                  +{positiveShapSum.toFixed(3)}
                </span>
                <span className="text-[11px] font-medium text-red-400/80">risk</span>
              </div>

              <span className="text-lg font-bold text-slate-300">
                {negativeShapSum < 0 ? "-" : "+"}
              </span>

              {/* Trust */}
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-1.5">
                <span className="font-bold text-emerald-400">
                  {negativeShapSum < 0 ? Math.abs(negativeShapSum).toFixed(3) : negativeShapSum.toFixed(3)}
                </span>
                <span className="text-[11px] font-medium text-emerald-400/80">trust</span>
              </div>

              <span className="text-lg font-bold text-accent">=</span>

              {/* Net Margin */}
              <div className="flex items-center gap-1.5 rounded-lg border border-accent/60 bg-accent/25 px-3 py-1.5 shadow-sm">
                <span className="text-base sm:text-lg font-extrabold text-white">
                  {netMarginLogOdds >= 0 ? `+${netMarginLogOdds.toFixed(3)}` : netMarginLogOdds.toFixed(3)}
                </span>
                <span className="text-[11px] font-medium text-accent">margin</span>
              </div>
            </div>

            {/* Right side: High-Visibility Sigmoid Output */}
            <div className="flex items-center gap-2.5 shrink-0 rounded-xl border border-accent/40 bg-gradient-to-r from-accent/20 via-surface-1 to-accent/10 px-4 py-2 font-mono">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Sigmoid:</span>
              <div className="text-sm sm:text-base font-bold text-slate-200">
                1 / (1 + e<sup>{netMarginLogOdds >= 0 ? `-${netMarginLogOdds.toFixed(2)}` : `+${Math.abs(netMarginLogOdds).toFixed(2)}`}</sup>) ={" "}
                <span className="text-base sm:text-xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                  {formatPercent(calibratedRiskPercent, 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}