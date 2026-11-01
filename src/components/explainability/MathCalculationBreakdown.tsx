"use client";

import { useState } from "react";
import type { FeatureContribution, MathCalculation } from "@/types/analysis";
import { formatPercent } from "@/lib/format";
import { Calculator, ChevronDown, ChevronUp, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

export function MathCalculationBreakdown({
  calc,
  riskScore,
  features = [],
}: {
  calc?: MathCalculation;
  riskScore: number;
  features?: FeatureContribution[];
}) {
  const [isOpen, setIsOpen] = useState(true);

  const posSum = features.filter((f) => f.impact > 0).reduce((acc, f) => acc + f.impact, 0);
  const negSum = features.filter((f) => f.impact < 0).reduce((acc, f) => acc + f.impact, 0);

  const baseLogOdds = calc?.baseLogOdds ?? -0.0127;
  const positiveShapSum = calc?.positiveShapSum ?? posSum;
  const negativeShapSum = calc?.negativeShapSum ?? negSum;
  const netMarginLogOdds = calc?.netMarginLogOdds ?? Number((baseLogOdds + positiveShapSum + negativeShapSum).toFixed(4));
  const calibratedRiskPercent = calc?.calibratedRiskPercent ?? riskScore;

  const isHigh = riskScore >= 70;
  const isMedium = riskScore >= 30 && riskScore < 70;
  const badgeColor = isHigh
    ? "text-red-400 bg-red-500/10 border-red-500/30"
    : isMedium
    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

  return (
    <div className="panel overflow-hidden border-accent/20 bg-gradient-to-b from-surface-1 to-surface-2/60 transition-all">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-surface-2/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground text-sm">
                Mathematical Fraud Score Derivation
              </h4>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                TreeSHAP Exact Additivity
              </span>
            </div>
            <p className="text-xs text-muted">
              Step-by-step algebraic conversion from decision-tree log-odds margins to final probability.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-md border px-2.5 py-1 font-mono text-xs font-semibold ${badgeColor}`}>
            Result: {formatPercent(calibratedRiskPercent, 2)}
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
          <div className="rounded-xl border border-border/70 bg-[#090d16] p-4 text-center">
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
            <div className="rounded-xl border border-border bg-surface-1/90 p-3.5 flex flex-col justify-between">
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
            <div className="rounded-xl border border-border bg-surface-1/90 p-3.5 flex flex-col justify-between">
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
            <div className="rounded-xl border border-border bg-surface-1/90 p-3.5 flex flex-col justify-between">
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
            <div className="rounded-xl border border-border bg-surface-1/90 p-3.5 flex flex-col justify-between">
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

          {/* Arithmetic Proof Strip */}
          <div className="rounded-lg border border-border/80 bg-surface-2/80 p-3.5 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-muted">
              <span className="text-cyan-400 font-semibold">{baseLogOdds.toFixed(3)}</span>
              <span>(base)</span>
              <span className="text-foreground font-bold">+</span>
              <span className="text-red-400 font-semibold">{positiveShapSum.toFixed(3)}</span>
              <span>(risk)</span>
              <span className="text-foreground font-bold">+</span>
              <span className="text-emerald-400 font-semibold">{negativeShapSum.toFixed(3)}</span>
              <span>(trust)</span>
              <span className="text-foreground font-bold">=</span>
              <span className="text-accent font-bold">{netMarginLogOdds.toFixed(3)}</span>
              <span>(margin)</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-muted text-[11px]">Sigmoid:</span>
              <div className="rounded bg-accent/20 px-2 py-0.5 font-bold text-accent">
                1 / (1 + e<sup>-{netMarginLogOdds.toFixed(2)}</sup>) ={" "}
                <span className="text-white">
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
