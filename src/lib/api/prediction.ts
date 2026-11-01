/**
 * Prediction client used by the UI.
 * Connects to the live Python FastAPI backend serving XGBoost + TreeSHAP.
 */

import type { RiskAnalysis, TransactionInput } from "@/types/analysis";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function predictTransaction(input: TransactionInput): Promise<RiskAnalysis> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_BASE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: input.type,
        amount: input.amount,
        senderId: input.senderId,
        receiverId: input.receiverId,
        step: input.step,
        occurredAt: input.occurredAt,
        senderOldBalance: input.senderOldBalance,
        senderNewBalance: input.senderNewBalance,
        receiverOldBalance: input.receiverOldBalance,
        receiverNewBalance: input.receiverNewBalance,
        transactionId: input.transactionId,
        datasetIndex: input.datasetIndex,
        isVerified: input.isVerified,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json() as RiskAnalysis;
    }
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`Backend returned ${response.status}: ${errorBody}`);
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      throw new Error("Backend did not respond within 5 seconds. Make sure the FastAPI server is running on port 8000.");
    }
    throw new Error(
      err?.message?.includes("fetch") || err?.message?.includes("Failed")
        ? "Cannot reach the ML backend. Run: uvicorn backend.main:app --reload"
        : err?.message ?? "Unknown prediction error"
    );
  }
}

export async function fetchBenchmarkMetrics(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/metrics`);
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function fetchCuratedSamples(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/api/test-samples`);
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

export async function fetchRandomSample(label?: "fraud" | "legitimate" | "medium"): Promise<any | null> {
  try {
    const url = label ? `${API_BASE}/api/random-sample?label=${label}` : `${API_BASE}/api/random-sample`;
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to fetch random test sample from backend:", err);
  }
  return null;
}

export async function verifyTransactionOnDisk(transactionId: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/api/verify-transaction/${encodeURIComponent(transactionId)}`);
    if (res.ok) return await res.json();
    const errText = await res.text();
    return { verified: false, error: errText };
  } catch (err: any) {
    return { verified: false, error: err?.message || "Failed to reach verification endpoint" };
  }
}
