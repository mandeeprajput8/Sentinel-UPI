import { createContext, useContext } from "react";
import type { RiskAnalysis, TransactionInput } from "@/types/analysis";
import type { HistoryEntry } from "@/types/analysis";

export const ANALYSIS_STAGES = [
  "Validating transaction...",
  "Extracting transaction features...",
  "Evaluating temporal activity...",
  "Analyzing sender behavior...",
  "Analyzing receiver behavior...",
  "Evaluating transaction network...",
  "Generating explainability...",
  "Finalizing risk assessment...",
] as const;

export type AnalysisStatus = "idle" | "running" | "complete";

export interface AnalysisContextValue {
  status: AnalysisStatus;
  stageIndex: number;
  current: RiskAnalysis | null;
  draftInput: TransactionInput | null;
  history: HistoryEntry[];
  lastError: string | null;
  analyze: (input: TransactionInput) => Promise<void>;
  openAnalysis: (entry: HistoryEntry) => void;
  resetCurrent: () => void;
  editCurrent: () => void;
}

export const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysis must be used within AnalysisProvider");
  }
  return ctx;
}
