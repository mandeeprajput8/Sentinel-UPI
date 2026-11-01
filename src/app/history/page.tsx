import { AnalysisHistory } from "@/components/history/AnalysisHistory";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Analysis History</h2>
        <p className="mt-1 text-sm text-muted">
          Previous simulated assessments stored locally in this browser.
        </p>
      </div>
      <AnalysisHistory />
    </div>
  );
}
