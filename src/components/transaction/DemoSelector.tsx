"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { DEMO_TRANSACTIONS } from "@/lib/demo-transactions";
import { Button } from "@/components/ui/Button";
import type { TransactionInput } from "@/types/analysis";

export function DemoSelector({
  onSelect,
}: {
  onSelect: (input: TransactionInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const items = useMemo(() => Object.values(DEMO_TRANSACTIONS), []);

  return (
    <div className="relative">
      <Button type="button" variant="secondary" onClick={() => setOpen((v) => !v)} className="gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        Test Scenarios ({items.length})
        <ChevronDown className="h-4 w-4 text-muted" />
      </Button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-96 rounded-xl border border-border bg-surface-2 p-2 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Benchmark Demonstration Scenarios
            </p>
            <span className="text-[10px] text-accent font-mono font-medium">Spectrum 0.02%–100%</span>
          </div>
          <div className="mt-1 max-h-[460px] overflow-y-auto space-y-1 pr-1">
            {items.map((item) => {
              const isHigh = item.expectedRisk === "HIGH";
              const isMed = item.expectedRisk === "MEDIUM";
              const badgeClass = isHigh
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : isMed
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";

              return (
                <button
                  key={item.id}
                  type="button"
                  className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-surface-1 transition-colors group"
                  onClick={() => {
                    onSelect(item.input);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </p>
                      <span className="text-[10px] font-mono font-semibold text-muted">
                        {item.scoreLabel}
                      </span>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded ${badgeClass}`}>
                      Truth: {item.groundTruth}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted leading-tight">{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
