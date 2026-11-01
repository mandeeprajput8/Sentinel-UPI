"use client";

import { motion } from "framer-motion";
import type { NetworkNode } from "@/types/analysis";
import { ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export function TransactionNetwork({ nodes }: { nodes: NetworkNode[] }) {
  const sender = nodes.find((n) => n.isCurrentSender) || nodes[0];
  const receiver = nodes.find((n) => !n.isCurrentSender) || nodes[1];

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Transaction Counterparty Topology</h3>
          <p className="text-xs text-muted">
            Observed endpoint relationship for the evaluated payment.
          </p>
        </div>
        <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px] font-mono text-muted">
          P2P Channel
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center space-y-4 py-4 sm:flex-row sm:space-y-0 sm:space-x-8">
        {/* Sender Node */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-accent bg-accent/10 shadow-lg shadow-accent/10">
            <UserCheck className="h-8 w-8 text-accent" />
          </div>
          <span className="mt-2 text-xs font-semibold text-foreground">Origin Account</span>
          <span className="text-[11px] font-mono text-muted">{sender?.label || "Sender"}</span>
          <span className="mt-1 rounded bg-surface-2 px-2 py-0.5 text-[10px] text-muted">Active Payer</span>
        </div>

        {/* Directed Flow Arrow */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="flex items-center gap-1 text-accent">
            <div className="h-0.5 w-12 bg-gradient-to-r from-accent to-emerald-400 sm:w-20" />
            <ArrowRight className="h-5 w-5 text-emerald-400 -ml-1" />
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-muted font-mono">Push Payment</span>
        </div>

        {/* Receiver Node */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <span className="mt-2 text-xs font-semibold text-foreground">Destination Account</span>
          <span className="text-[11px] font-mono text-muted">{receiver?.label || "Receiver"}</span>
          <span className="mt-1 rounded bg-surface-2 px-2 py-0.5 text-[10px] text-muted">Beneficiary</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-2/60 p-3 text-xs text-muted leading-relaxed">
        <p>
          <strong className="text-foreground">Network Integrity Note:</strong> The PaySim dataset does not record longitudinal multi-hop graph rings or historical counterparty links for individual account IDs. This visualizer honestly reflects the direct sender-to-receiver channel without fabricating synthetic prior transactions.
        </p>
      </div>
    </section>
  );
}