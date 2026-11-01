import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-[#7b98ff] disabled:bg-accent/40 disabled:text-white/70",
  secondary:
    "border border-border bg-surface-2 text-foreground hover:border-accent/50 disabled:opacity-50",
  ghost: "text-muted hover:bg-surface-2 hover:text-foreground",
  danger: "bg-high/15 text-high hover:bg-high/25",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
