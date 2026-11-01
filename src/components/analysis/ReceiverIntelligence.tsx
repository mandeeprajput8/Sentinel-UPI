import type { ReceiverAnalysis } from "@/types/analysis";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tooltip } from "@/components/ui/Tooltip";
import { TOOLTIPS } from "@/lib/tooltips";

export function ReceiverIntelligence({ receiver }: { receiver: ReceiverAnalysis }) {
  const items = [
    { label: "Receiver transaction count", value: receiver.transactionCount.toLocaleString("en-IN") },
    { label: "Unique senders", value: receiver.uniqueSenders.toLocaleString("en-IN") },
    { label: "Recent activity", value: receiver.recentActivity },
    { label: "Network connectivity", value: receiver.networkConnectivity },
  ];

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Destination Account Intelligence</h3>
          <Tooltip content={TOOLTIPS.receiverNetwork} />
        </div>
        <StatusBadge level={receiver.historicalRisk} />
      </div>
      <p className="mt-1 text-xs text-muted">Inferred from destination account transaction volume and network connectivity patterns.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-xs text-muted">{item.label}</p>
            <p className="mt-1 font-medium">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">{receiver.explanation}</p>
    </section>
  );
}
