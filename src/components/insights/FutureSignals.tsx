const SIGNALS = [
  { name: "Location", note: "Not present in the current dataset." },
  { name: "Device", note: "Not present in the current dataset." },
  { name: "IP / Network", note: "Reserved for later channel telemetry." },
  { name: "Bank / Channel", note: "Reserved for multi-rail context." },
  { name: "Merchant Context", note: "Beyond merchant-prefixed destination IDs." },
];

export function FutureSignals() {
  return (
    <section className="panel p-6">
      <h2 className="text-xl font-semibold">Future Contextual Signals</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        The current dataset does not contain these attributes. The system architecture is designed to
        accommodate additional contextual signals when available.
      </p>
      <p className="mt-2 text-xs uppercase tracking-wide text-accent">Future data integrations</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SIGNALS.map((signal) => (
          <div key={signal.name} className="rounded-xl border border-dashed border-border p-3">
            <p className="text-sm font-medium">{signal.name}</p>
            <p className="mt-1 text-xs text-muted">{signal.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
