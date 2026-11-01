"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {display.toLocaleString("en-IN", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function StatCard({
  label,
  value,
  suffix,
  decimals = 0,
  hint,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  hint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel p-5"
    >
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </p>
      <p className="mt-2 text-[11px] text-muted">{hint}</p>
    </motion.div>
  );
}
