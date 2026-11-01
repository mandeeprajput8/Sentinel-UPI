import type { RiskLevel, TransactionType } from "@/types/analysis";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount >= 100 ? 0 : 2,
  }).format(amount);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatSignedPercent(value: number, digits = 0): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(digits)}%`;
}

export function maskAccount(id: string): string {
  const trimmed = id.trim();
  if (trimmed.length <= 8) return trimmed;
  return `${trimmed.slice(0, 5)}••••${trimmed.slice(-4)}`;
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function riskLabel(level: RiskLevel): string {
  if (level === "HIGH") return "High risk";
  if (level === "MEDIUM") return "Medium risk";
  return "Low risk";
}

export function typeLabel(type: TransactionType): string {
  return type.replace("_", " ");
}
