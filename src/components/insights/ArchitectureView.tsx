"use client";

import { useState } from "react";

const LAYERS = [
  { name: "Frontend", note: "This interface. Consumes a typed RiskAnalysis contract." },
  { name: "API Layer", note: "Coming next · POST /api/predict" },
  { name: "Feature Engineering", note: "Designed around transaction, temporal, behavioral, and network signals." },
  { name: "ML Model", note: "Simulation · Replace mockPrediction.ts after training." },
  { name: "Explainability Engine", note: "Preview visualizations; live attributions after model hook-up." },
  { name: "Risk Response", note: "Score, classification, recommendations, and history." },
];

export function ArchitectureView() {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">System architecture</h2>
        <button type="button" className="text-sm text-accent" onClick={() => setOpen((v) => !v)}>
          {open ? "Collapse" : "Expand"}
        </button>
      </div>
      {open ? (
        <ol className="mt-6 space-y-3">
          {LAYERS.map((layer, index) => (
            <li key={layer.name} className="rounded-xl border border-border bg-surface-2 p-4">
              <p className="text-xs text-muted">Layer {index + 1}</p>
              <p className="font-medium">{layer.name}</p>
              <p className="mt-1 text-sm text-muted">{layer.note}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Expand to view the Frontend → API → Feature Engineering → Model → Explainability → Response
          path.
        </p>
      )}
    </section>
  );
}
