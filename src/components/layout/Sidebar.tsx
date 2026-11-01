"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  History,
  LayoutDashboard,
  ScanSearch,
  Settings2,
  Shield,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze Transaction", icon: ScanSearch },
  { href: "/models", label: "Model Benchmark", icon: BarChart3 },
  { href: "/metrics", label: "Confusion Matrix & KPIs", icon: Target },
  { href: "/insights", label: "Research & Literature", icon: BookOpen },
  { href: "/history", label: "Analysis History", icon: History },
  { href: "/system", label: "System Status", icon: Settings2 },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 lg:hidden",
          open ? "block" : "hidden",
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-border bg-[#0b1016] p-4 transition-transform lg:sticky lg:top-0 lg:translate-x-0 overflow-y-auto scrollbar-thin",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" aria-hidden />
                <span className="text-lg font-semibold tracking-tight text-foreground">SentinelUPI</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">Explainable Transaction Intelligence</p>
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-muted hover:text-foreground lg:hidden cursor-pointer"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition cursor-pointer",
                    active
                      ? "bg-accent/15 text-foreground font-medium"
                      : "text-muted hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Fixed Bottom Pipeline Status Badge - Always Visible Without Scrolling */}
        <div className="mt-4 pt-3 border-t border-border/70 space-y-2 rounded-xl bg-surface/80 p-3 text-xs shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-muted text-[11px]">Active Pipeline</span>
            <span className="font-semibold text-emerald-400 font-mono text-[11px]">XGBoost + TreeSHAP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted text-[11px]">Engine Status</span>
            <span className="flex items-center gap-1.5 font-medium text-foreground text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              Live (0.024ms)
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}