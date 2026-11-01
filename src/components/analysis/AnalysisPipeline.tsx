"use client";

import { motion } from "framer-motion";
import { ANALYSIS_STAGES } from "@/lib/analysis-context";

export function AnalysisPipeline({ stageIndex }: { stageIndex: number }) {
  const progress = ((stageIndex + 1) / ANALYSIS_STAGES.length) * 100;

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Analysis pipeline</p>
      <h2 className="mt-3 text-2xl font-semibold">Evaluating contextual risk</h2>
      <p className="mt-2 text-sm text-muted">{ANALYSIS_STAGES[stageIndex]}</p>
      <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full bg-accent"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <ul className="mt-8 space-y-2 text-left">
        {ANALYSIS_STAGES.map((stage, index) => (
          <li
            key={stage}
            className={`rounded-lg px-3 py-2 text-sm ${
              index === stageIndex
                ? "bg-accent/10 text-foreground"
                : index < stageIndex
                  ? "text-muted"
                  : "text-muted/50"
            }`}
          >
            {stage}
          </li>
        ))}
      </ul>
    </div>
  );
}
