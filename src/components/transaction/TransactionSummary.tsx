import { formatCurrency, maskAccount, typeLabel } from "@/lib/format";
import type { TransactionInput } from "@/types/analysis";
import { ShieldCheck, UserCheck } from "lucide-react";

export function TransactionSummary({ input }: { input: TransactionInput }) {
  const hour = ((input.step % 24) + 24) % 24;
  const timeDisplay = input.occurredAt
    ? (input.occurredAt.includes("T") ? input.occurredAt.split("T")[1].slice(0, 5) : input.occurredAt)
    : `${String(hour).padStart(2, "0")}:00`;

  const rows = [
    { label: "Transaction Type", value: typeLabel(input.type) },
    { label: "Amount", value: formatCurrency(input.amount) },
    { label: "Sender", value: maskAccount(input.senderId) },
    { label: "Receiver", value: maskAccount(input.receiverId) },
    { label: "Transaction Time", value: timeDisplay },
  ];

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Transaction profile</h3>
          {input.transactionId && (
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-2 border border-border text-muted">
              {input.transactionId}
            </span>
          )}
        </div>
        {input.isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified PaySim Test Record {input.datasetIndex !== undefined ? `(Row #${input.datasetIndex})` : ""}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 border border-border px-2.5 py-0.5 text-xs text-muted">
            <UserCheck className="h-3.5 w-3.5" />
            Custom User Input
          </span>
        )}
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs text-muted">{row.label}</dt>
            <dd className="mt-1 font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
