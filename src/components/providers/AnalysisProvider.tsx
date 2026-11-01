"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { predictTransaction } from "@/lib/api/prediction";
import {
  ANALYSIS_STAGES,
  AnalysisContext,
  type AnalysisStatus,
} from "@/lib/analysis-context";
import { loadHistory, saveHistory, toHistoryEntry } from "@/lib/history";
import type { HistoryEntry, RiskAnalysis, TransactionInput } from "@/types/analysis";

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [current, setCurrent] = useState<RiskAnalysis | null>(null);
  const [draftInput, setDraftInput] = useState<TransactionInput | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    setStageIndex(0);
    const interval = window.setInterval(() => {
      setStageIndex((index) => Math.min(index + 1, ANALYSIS_STAGES.length - 1));
    }, 320);
    return () => window.clearInterval(interval);
  }, [status]);

  const analyze = useCallback(async (input: TransactionInput) => {
    setLastError(null);
    setStatus("running");
    setCurrent(null);
    const started = Date.now();
    try {
      const result = await predictTransaction(input);
      const elapsed = Date.now() - started;
      const remaining = Math.max(0, 2400 - elapsed);
      await new Promise((resolve) => window.setTimeout(resolve, remaining));
      setCurrent(result);
      setHistory((prev) => {
        const next = [toHistoryEntry(result), ...prev.filter((entry) => entry.analysis.id !== result.id)];
        saveHistory(next);
        return next;
      });
      setStatus("complete");
    } catch {
      setLastError("The simulated analysis could not be completed. Try again.");
      setStatus("idle");
    }
  }, []);

  const openAnalysis = useCallback((entry: HistoryEntry) => {
    setCurrent(entry.analysis);
    setStatus("complete");
    setLastError(null);
  }, []);

  const resetCurrent = useCallback(() => {
    setCurrent(null);
    setDraftInput(null);
    setStatus("idle");
    setStageIndex(0);
    setLastError(null);
  }, []);

  const editCurrent = useCallback(() => {
    if (current) {
      setDraftInput(current.input);
      setCurrent(null);
      setStatus("idle");
      setStageIndex(0);
      setLastError(null);
    }
  }, [current]);

  const value = useMemo(
    () => ({
      status,
      stageIndex,
      current,
      draftInput,
      history,
      lastError,
      analyze,
      openAnalysis,
      resetCurrent,
      editCurrent,
    }),
    [status, stageIndex, current, draftInput, history, lastError, analyze, openAnalysis, resetCurrent, editCurrent],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}