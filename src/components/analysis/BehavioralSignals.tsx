import { formatCurrency, formatSignedPercent } from "@/lib/format";
import type { SenderAnalysis } from "@/types/analysis";
import { Tooltip } from "@/components/ui/Tooltip";
import { TOOLTIPS } from "@/lib/tooltips";

export function BehavioralSignals({ sender }: { sender: SenderAnalysis }) {
  const items = [
    { label: "Previous transactions", value: String(sender.previousTransactions) },
    { label: "Average transaction", value: formatCurrency(sender.averageTransaction) },
    { label: "Current amount deviation", value: formatSignedPercent(sender.amountDeviationPct) },
    { label: "Transaction velocity", value: sender.velocity },
  ];

  return (
    <section className="panel p-5">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Behavioral Signals</h3>
        <Tooltip content={TOOLTIPS.behavioral} />
      </div>
      <p className="mt-1 text-xs text-muted">Derived from transaction ledger and timing patterns via feature engineering.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-xs text-muted">{item.label}</p>
            <p className="mt-1 font-medium">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">{sender.explanation}</p>
    </section>
  );
}
