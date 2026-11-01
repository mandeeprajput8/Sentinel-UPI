"use client";

import { Network, Timer, Wallet, Workflow } from "lucide-react";
import type { FeatureContribution } from "@/types/analysis";

const ICONS = {
  network: Network,
  temporal: Timer,
  transaction: Wallet,
  behavioral: Workflow,
};

export function RiskFactorCard({ feature }: { feature: FeatureContribution }) {
  const Icon = ICONS[feature.category];
  const positive = feature.impact >= 0;

  return (
    <article className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 rounded-lg border p-2 ${positive ? "border-red-500/30 bg-red-950/20 text-red-400" : "border-emerald-500/30 bg-emerald-950/20 text-emerald-400"}`}>
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">
              {positive
                ? feature.severity === "HIGH"
                  ? "Critical Risk Driver"
                  : "Risk Accelerator"
                : feature.severity === "HIGH"
                ? "Dominant Safety Anchor"
                : "Mitigating Trust Signal"}
            </p>
            <h3 className="mt-1 font-medium">{feature.name}</h3>
            <p className="mt-1 text-sm text-muted">{feature.summary}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-mono font-semibold tabular-nums ${positive ? "text-high" : "text-low"}`}>
            {positive ? "+" : ""}{feature.impact.toFixed(2)} SHAP
          </p>
          <span
            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
              positive
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {positive ? "ELEVATES RISK" : "MITIGATES RISK"}
          </span>
        </div>
      </div>
      
      {/* Forensic explanation visible by default */}
      <div className="mt-3 border-t border-border/50 pt-2.5">
        <p className="text-xs text-foreground/90 leading-relaxed font-normal bg-surface-2/60 p-2.5 rounded-lg border border-border/40">
          <strong className={positive ? "text-red-400 font-medium" : "text-emerald-400 font-medium"}>
            {positive ? "Forensic Risk Signal: " : "Safety Assurance Rationale: "}
          </strong>
          {feature.detail}
        </p>
      </div>
    </article>
  );
}