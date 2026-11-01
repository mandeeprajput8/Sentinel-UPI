"use client";

import { AlertTriangle, Database, Info, Network, Zap } from "lucide-react";

export function DatasetCaveats() {
  return (
    <section className="panel p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Database className="h-5 w-5 text-accent" />
        <div>
          <h3 className="text-xl font-semibold text-foreground">Dataset Nuances, UPI Translation & Operational Caveats</h3>
          <p className="text-xs text-muted">
            Academic transparency regarding PaySim simulation origins, Indian banking regulations, and operational assumptions.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Caveat 1: PaySim to UPI Translation */}
        <div className="rounded-xl border border-border bg-surface-2 p-4 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/20 p-1 text-accent">
              <Info className="h-3.5 w-3.5" />
            </span>
            <h4 className="font-semibold text-foreground">PaySim Simulator & UPI Mapping</h4>
          </div>
          <p className="text-muted leading-relaxed">
            Due to banking confidentiality regulations (e.g. RBI Master Directions on IT Governance and GDPR), real Indian UPI transaction logs are inaccessible to academic researchers. We build upon PaySim—a high-fidelity multi-agent financial simulator derived from 6.36M mobile money logs.
          </p>
          <div className="rounded-lg bg-surface p-2.5 border border-border text-[11px] text-muted space-y-1">
            <p><strong className="text-foreground">P2P Transfers:</strong> Mapped to <code className="text-accent">TRANSFER</code> transactions between customer accounts.</p>
            <p><strong className="text-foreground">P2M Merchant Payments:</strong> Mapped to <code className="text-accent">PAYMENT</code> transactions to verified merchant endpoints (<code className="text-accent">M...</code>).</p>
            <p><strong className="text-foreground">ATM / Liquidation Outflows:</strong> Mapped to <code className="text-accent">CASH_OUT</code> transactions.</p>
          </div>
        </div>

        {/* Caveat 2: Behavioral History vs Synthetic Account IDs */}
        <div className="rounded-xl border border-border bg-surface-2 p-4 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 p-1 text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            <h4 className="font-semibold text-foreground">Why Synthetic Account IDs Aren&apos;t Enough</h4>
          </div>
          <p className="text-muted leading-relaxed">
            In simulated datasets, accounts appear only once or twice, preventing persistent multi-year profile lookup tables. Our framework solves this by extracting <em>ledger-invariant physics</em> rather than memorizing account strings.
          </p>
          <div className="rounded-lg bg-surface p-2.5 border border-border text-[11px] text-muted space-y-1">
            <p><strong className="text-foreground">Balance Invariants:</strong> Fraudulent account takeovers typically empty the sender balance to 0 (<code className="text-accent">orig_emptied = 1</code>).</p>
            <p><strong className="text-foreground">Discrepancy Signatures:</strong> Destination balance jumps without corresponding sender deductions (<code className="text-accent">error_orig ≠ 0</code>, <code className="text-accent">error_dest ≠ 0</code>).</p>
          </div>
        </div>

        {/* Caveat 3: Real-Time Inference vs Real-Time Blocking */}
        <div className="rounded-xl border border-border bg-surface-2 p-4 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 p-1 text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
            </span>
            <h4 className="font-semibold text-foreground">Real-Time Inference vs Real-Time Blocking</h4>
          </div>
          <p className="text-muted leading-relaxed">
            In modern UPI banking architecture, millisecond machine learning is used for risk scoring, not necessarily unconditional payment drops. High-confidence flags trigger <em>stepped-up authentication</em> (biometrics, MPIN confirmation) or delayed settlement rather than blind rejection.
          </p>
          <div className="rounded-lg bg-surface p-2.5 border border-border text-[11px] text-muted">
            <span className="text-emerald-400 font-semibold">Low-Latency Guarantee:</span> Sentinel executes inference + TreeSHAP in <strong>0.024 ms</strong>, well beneath NPCI&apos;s ~1,500 ms round-trip switch SLA.
          </div>
        </div>

        {/* Caveat 4: Graph Fraud & Mule Accounts */}
        <div className="rounded-xl border border-border bg-surface-2 p-4 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/20 p-1 text-blue-400">
              <Network className="h-3.5 w-3.5" />
            </span>
            <h4 className="font-semibold text-foreground">Next Frontier: Mule Networks & Graph AI</h4>
          </div>
          <p className="text-muted leading-relaxed">
            Organized UPI syndicates employ layering networks (money dispersed across dozens of student mule accounts within minutes). While tabular XGBoost detects individual account takeover signatures, enterprise deployments combine Sentinel with Graph Neural Networks (GNNs).
          </p>
          <div className="rounded-lg bg-surface p-2.5 border border-border text-[11px] text-muted">
            <span className="text-blue-400 font-semibold">Production Hybrid:</span> Tabular XGBoost scores each hop inline (0.024 ms) while background graph engines aggregate cross-bank community clusters.
          </div>
        </div>
      </div>
    </section>
  );
}
