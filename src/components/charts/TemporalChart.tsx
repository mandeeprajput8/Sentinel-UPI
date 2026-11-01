"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TemporalAnalysis } from "@/types/analysis";
import { Tooltip } from "@/components/ui/Tooltip";
import { TOOLTIPS } from "@/lib/tooltips";

export function TemporalChart({ temporal }: { temporal: TemporalAnalysis }) {
  return (
    <section className="panel p-5">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Temporal Activity</h3>
        <Tooltip content={TOOLTIPS.temporal} />
      </div>
      <p className="text-xs text-muted">
        Activity level {temporal.activityLevel} · Time since previous {temporal.timeSincePrevious}
      </p>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temporal.series}>
            <CartesianGrid stroke="#223042" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "#8b97a8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8b97a8", fontSize: 11 }} />
                        <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border bg-[#0f172a] p-2.5 text-xs shadow-xl">
                    <p className="font-semibold text-white">{d.label}</p>
                    <p className="mt-1 font-mono text-accent font-bold">
                      Value: <span className="text-white">{d.value}</span>
                    </p>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#6b8cff" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-sm text-muted">{temporal.explanation}</p>
    </section>
  );
}
