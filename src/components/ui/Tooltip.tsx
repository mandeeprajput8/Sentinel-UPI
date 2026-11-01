"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  label?: string;
  className?: string;
}

export function Tooltip({ content, label = "More information", className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted hover:text-foreground"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-64 -translate-x-1/2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-left text-xs leading-relaxed text-foreground shadow-xl"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
