"use client";

import { useRouter } from "next/navigation";
import { formatCurrency, formatDateTime, maskAccount, typeLabel } from "@/lib/format";
import { useAnalysis } from "@/lib/analysis-context";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AnalysisHistory() {
  const { history, openAnalysis } = useAnalysis();
  const router = useRouter();

  if (history.length === 0) {
    return (
      <div className="panel p-8 text-center">
        <h2 className="text-lg font-semibold">No analyses yet</h2>
        <p className="mt-2 text-sm text-muted">
          Run a transaction assessment to populate local history. Nothing is stored on a server.
        </p>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Receiver</th>
              <th className="px-4 py-3">Risk score</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr
                key={entry.id}
                className="cursor-pointer border-b border-border/70 hover:bg-surface-2"
                onClick={() => {
                  openAnalysis(entry);
                  router.push("/analyze");
                }}
              >
                <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(entry.analyzedAt)}</td>
                <td className="px-4 py-3">{typeLabel(entry.type)}</td>
                <td className="px-4 py-3 tabular-nums">{formatCurrency(entry.amount)}</td>
                <td className="px-4 py-3 font-mono text-xs">{maskAccount(entry.receiverId)}</td>
                <td className="px-4 py-3 tabular-nums">{entry.riskScore.toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <StatusBadge level={entry.riskLevel} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
