import type { HistoryEntry, RiskAnalysis } from "@/types/analysis";

const STORAGE_KEY = "sentinel.analysisHistory";
const MAX_ENTRIES = 24;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function toHistoryEntry(analysis: RiskAnalysis): HistoryEntry {
  return {
    id: `${analysis.id}_${analysis.analyzedAt}`,
    analyzedAt: analysis.analyzedAt,
    type: analysis.input.type,
    amount: analysis.input.amount,
    receiverId: analysis.input.receiverId,
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    prediction: analysis.prediction,
    analysis,
  };
}
