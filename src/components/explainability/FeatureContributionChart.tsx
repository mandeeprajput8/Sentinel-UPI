"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FeatureContribution } from "@/types/analysis";
import { Tooltip } from "@/components/ui/Tooltip";
import { TOOLTIPS } from "@/lib/tooltips";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface Props {
  features: FeatureContribution[];
  onSelectFeature?: (feature: FeatureContribution | null) => void;
  selectedId?: string | null;
}

export function FeatureContributionChart({ features, onSelectFeature, selectedId }: Props) {
  const [filter, setFilter] = useState<"ALL" | "POSITIVE" | "NEGATIVE">("ALL");

  const filteredFeatures = useMemo(() => {
    if (filter === "POSITIVE") return features.filter((f) => f.impact > 0);
    if (filter === "NEGATIVE") return features.filter((f) => f.impact < 0);
    return features;
  }, [features, filter]);

  const chartData = useMemo(() => {
    return filteredFeatures.map((f) => ({
      id: f.id,
      name: f.name,
      impact: Number(f.impact.toFixed(3)),
      category: f.category,
      summary: f.summary,
      detail: f.detail,
      rawFeature: f,
    }));
  }, [filteredFeatures]);

  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">SHAP Feature Attribution Waterfall</h3>
            <Tooltip content={TOOLTIPS.shap} />
          </div>
          <p className="mt-1 text-xs text-muted">
            Directional attribution showing how each transactional and behavioral signal shifted the model score.
          </p>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 p-1 text-xs">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              filter === "ALL" ? "bg-accent text-white" : "text-muted hover:text-foreground"
            }`}
          >
            All ({features.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("POSITIVE")}
            className={`flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
              filter === "POSITIVE" ? "bg-red-500/20 text-red-400" : "text-muted hover:text-red-400"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Risk Escalators ({features.filter((f) => f.impact > 0).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("NEGATIVE")}
            className={`flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
              filter === "NEGATIVE" ? "bg-emerald-500/20 text-emerald-400" : "text-muted hover:text-emerald-400"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Trust Anchors ({features.filter((f) => f.impact < 0).length})
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 24, right: 32, top: 8, bottom: 8 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const item = state.activePayload[0].payload.rawFeature;
                onSelectFeature?.(item);
              }
            }}
          >
            <XAxis
              type="number"
              
              tick={{ fill: "#8b97a8", fontSize: 11 }}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)} SHAP`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: "#e8eef5", fontSize: 11 }}
            />
            <ReferenceLine x={0} stroke="#3b4858" strokeDasharray="3 3" />
            <RechartsTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                const isRisk = d.impact > 0;
                return (
                  <div className="rounded-lg border border-border bg-[#0f172a] p-3 text-xs shadow-xl">
                    <p className="font-semibold text-foreground">{d.name}</p>
                    <p className="mt-0.5 text-muted capitalize">Category: {d.category}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          isRisk ? "bg-red-500" : "bg-emerald-500"
                        }`}
                      />
                      <span className={`font-semibold ${isRisk ? "text-red-400" : "text-emerald-400"}`}>
                        {isRisk ? "+" : ""}
                        {d.impact > 0 ? "+" : ""}{d.impact.toFixed(3)} SHAP Shift
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-xs text-muted leading-relaxed">{d.summary}</p>
                    <p className="mt-2 text-[10px] text-accent">Click bar to view full forensic detail</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="impact" radius={4} className="cursor-pointer">
              {chartData.map((entry) => {
                const isSelected = selectedId === entry.id;
                const isPositive = entry.impact >= 0;
                return (
                  <Cell
                    key={entry.id}
                    fill={isPositive ? "#ef4444" : "#10b981"}
                    stroke={isSelected ? "#ffffff" : undefined}
                    strokeWidth={isSelected ? 2 : 0}
                    opacity={selectedId && !isSelected ? 0.45 : 1}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Guide */}
      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-border/50 pt-3 text-xs text-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
            <span>Elevates Risk (+SHAP)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span>Mitigates Risk (-SHAP)</span>
          </span>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-muted">
          <Info className="h-3 w-3" />
          Click any bar to expand full regulatory explanation
        </span>
      </div>
    </section>
  );
}
