"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { RiskLevel } from "@/types/analysis";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const RING = 2 * Math.PI * 54;

const ICONS = {
  LOW: ShieldCheck,
  MEDIUM: ShieldQuestion,
  HIGH: ShieldAlert,
};

export function RiskGauge({
  score,
  confidence,
  level,
}: {
  score: number;
  confidence: number;
  level: RiskLevel;
}) {
  const [shown, setShown] = useState(0);
  const color = level === "HIGH" ? "var(--high)" : level === "MEDIUM" ? "var(--medium)" : "var(--low)";
  const Icon = ICONS[level];

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      setShown(score * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="panel flex flex-col items-center p-6">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#1c2a3a" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(shown / 100) * RING} ${RING}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="mb-1 h-5 w-5" style={{ color }} aria-hidden />
          <span className="text-3xl font-semibold tabular-nums">{formatPercent(shown, 1)}</span>
          <span className={cn("text-xs uppercase tracking-wide")} style={{ color }}>
            {level} RISK
          </span>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center text-[11px] text-muted">
        <div>0–30 Low</div>
        <div>30–70 Medium</div>
        <div>70–100 High</div>
      </div>
      <div className="mt-4 flex w-full justify-between text-sm">
        <div>
          <p className="text-xs text-muted">Risk score</p>
          <p className="font-medium tabular-nums">{formatPercent(score, 1)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Confidence</p>
          <p className="font-medium tabular-nums">{formatPercent(confidence, 1)}</p>
        </div>
      </div>
    </div>
  );
}
