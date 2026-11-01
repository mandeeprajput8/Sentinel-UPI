import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { RiskLevel } from "@/types/analysis";
import { cn } from "@/lib/utils";

const CONFIG = {
  LOW: {
    label: "Low risk",
    className: "border-low/30 bg-low/10 text-low",
    Icon: ShieldCheck,
  },
  MEDIUM: {
    label: "Medium risk",
    className: "border-medium/30 bg-medium/10 text-medium",
    Icon: ShieldQuestion,
  },
  HIGH: {
    label: "High risk",
    className: "border-high/30 bg-high/10 text-high",
    Icon: ShieldAlert,
  },
} as const;

export function StatusBadge({
  level,
  compact = false,
}: {
  level: RiskLevel;
  compact?: boolean;
}) {
  const config = CONFIG[level];
  const Icon = config.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {compact ? level : config.label}
    </span>
  );
}
