"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/": "Transaction Intelligence",
  "/analyze": "Analyze Transaction",
  "/insights": "Research & Literature",
  "/history": "Analysis History",
  "/models": "Model Benchmark",
  "/metrics": "Confusion Matrix & KPIs",
  "/system": "System",
};

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Sentinel";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-[#07090d]/85 px-4 py-3 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-border p-2 text-muted lg:hidden"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="text-sm font-medium text-foreground sm:text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted sm:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-low" aria-hidden />
          System online
        </span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
          XGBoost + TreeSHAP · Live
        </span>
      </div>
    </header>
  );
}
