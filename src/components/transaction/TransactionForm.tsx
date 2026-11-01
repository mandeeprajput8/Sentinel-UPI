"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Dice5,
  ShieldCheck,
  X,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoSelector } from "@/components/transaction/DemoSelector";
import { Tooltip } from "@/components/ui/Tooltip";
import { TOOLTIPS } from "@/lib/tooltips";
import { useAnalysis } from "@/lib/analysis-context";
import { fetchRandomSample, verifyTransactionOnDisk } from "@/lib/api/prediction";
import type { TransactionInput, TransactionType } from "@/types/analysis";

const TYPES: TransactionType[] = ["TRANSFER", "CASH_OUT", "PAYMENT"];

const EMPTY: FormState = {
  type: "TRANSFER",
  amount: "",
  senderId: "",
  receiverId: "",
  time: "14:30",
  senderOldBalance: "",
  senderNewBalance: "",
  receiverOldBalance: "",
  receiverNewBalance: "",
};

interface FormState {
  type: TransactionType;
  amount: string;
  senderId: string;
  receiverId: string;
  time: string;
  senderOldBalance: string;
  senderNewBalance: string;
  receiverOldBalance: string;
  receiverNewBalance: string;
}

function optionalNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function getTimeFromInput(input: TransactionInput): string {
  if (input.occurredAt) {
    if (/^\d{1,2}:\d{2}$/.test(input.occurredAt.trim())) {
      const [h, m] = input.occurredAt.trim().split(":");
      return `${h.padStart(2, "0")}:${m}`;
    }
    if (input.occurredAt.includes("T")) {
      const parts = input.occurredAt.split("T")[1];
      return parts.slice(0, 5);
    }
  }
  if (typeof input.step === "number" && !isNaN(input.step)) {
    const hour = ((input.step % 24) + 24) % 24;
    return `${String(hour).padStart(2, "0")}:00`;
  }
  return "14:30";
}

function fromInput(input: TransactionInput): FormState {
  return {
    type: input.type,
    amount: String(input.amount),
    senderId: input.senderId,
    receiverId: input.receiverId,
    time: getTimeFromInput(input),
    senderOldBalance: input.senderOldBalance?.toString() ?? "",
    senderNewBalance: input.senderNewBalance?.toString() ?? "",
    receiverOldBalance: input.receiverOldBalance?.toString() ?? "",
    receiverNewBalance: input.receiverNewBalance?.toString() ?? "",
  };
}

export function TransactionForm() {
  const { analyze, draftInput } = useAnalysis();
  const [form, setState] = useState<FormState>(EMPTY);
  const [sampleStep, setSampleStep] = useState<number | null>(null);
  const [activeTxnId, setActiveTxnId] = useState<string | undefined>(undefined);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState<number | undefined>(undefined);
  const [activeIsVerified, setActiveIsVerified] = useState<boolean>(false);

  useEffect(() => {
    if (draftInput) {
      setState(fromInput(draftInput));
      setSampleStep(draftInput.step ?? null);
      setActiveTxnId(draftInput.transactionId);
      setActiveDatasetIndex(draftInput.datasetIndex);
      setActiveIsVerified(Boolean(draftInput.isVerified));
    }
  }, [draftInput]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [sampleInfo, setSampleInfo] = useState<{
    title: string;
    groundTruth: string;
    step?: number;
    amount?: number;
    transactionId?: string;
    datasetIndex?: number;
  } | null>(null);

  const valid = useMemo(() => {
    const amount = Number(form.amount.replace(/,/g, ""));
    return (
      form.senderId.trim().length >= 3 &&
      form.receiverId.trim().length >= 3 &&
      Number.isFinite(amount) &&
      amount > 0 &&
      Boolean(form.time)
    );
  }, [form]);

  function apply(input: TransactionInput) {
    setState(fromInput(input));
    setSampleStep(input.step ?? null);
    setActiveTxnId(input.transactionId);
    setActiveDatasetIndex(input.datasetIndex);
    setActiveIsVerified(Boolean(input.isVerified));
    setErrors({});
    setVerificationResult(null);
  }

  async function handleLoadRandom(label?: "fraud" | "legitimate" | "medium") {
    setIsLoadingSample(true);
    setVerificationResult(null);
    try {
      const sample = await fetchRandomSample(label);
      if (sample) {
        apply({
          type: sample.type,
          amount: sample.amount,
          senderId: sample.senderId,
          receiverId: sample.receiverId,
          step: sample.step,
          senderOldBalance: sample.senderOldBalance,
          senderNewBalance: sample.senderNewBalance,
          receiverOldBalance: sample.receiverOldBalance,
          receiverNewBalance: sample.receiverNewBalance,
          transactionId: sample.transactionId,
          datasetIndex: sample.datasetIndex,
          isVerified: sample.isVerified ?? true,
        });
        const hour = ((sample.step % 24) + 24) % 24;
        const formattedTime = `${String(hour).padStart(2, "0")}:00`;
        setSampleInfo({
          title: `Held-Out Test Sample (${formattedTime}, ₹${sample.amount.toLocaleString("en-IN")})`,
          groundTruth: sample.ground_truth || (label === "fraud" ? "FRAUD" : "LEGITIMATE"),
          step: sample.step,
          amount: sample.amount,
          transactionId: sample.transactionId,
          datasetIndex: sample.datasetIndex,
        });
      }
    } finally {
      setIsLoadingSample(false);
    }
  }

  async function handleVerifyDiskProof(txnId: string) {
    try {
      const res = await verifyTransactionOnDisk(txnId);
      setVerificationResult(res);
    } catch (e: any) {
      setVerificationResult({ verified: false, error: e.message });
    }
  }

  function validate(): TransactionInput | null {
    const next: Record<string, string> = {};
    const amount = Number(form.amount.replace(/,/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) next.amount = "Enter a valid amount.";
    if (!/^[A-Za-z0-9@._-]{3,35}$/.test(form.senderId.trim())) {
      next.senderId = "Use 3–35 characters, e.g. user@okhdfcbank or C123456789.";
    }
    const trimmedReceiver = form.receiverId.trim();
    if (!/^[A-Za-z0-9@._-]{3,35}$/.test(trimmedReceiver)) {
      next.receiverId = "Use 3–35 characters, e.g. merchant@paytm or M987654321.";
    } else if (form.type === "PAYMENT") {
      const isMerchant = trimmedReceiver.startsWith("M") || trimmedReceiver.toLowerCase().includes("merchant");
      if (!isMerchant) {
        next.receiverId = "PAYMENT is strictly for merchants. Enter an ID starting with 'M' (e.g. M987654321) or containing 'merchant' (e.g. dmart_merchant@paytm).";
      }
    }
    
    const timeVal = form.time?.trim() || "14:30";
    const parts = timeVal.split(":");
    const hour = parseInt(parts[0], 10);
    if (isNaN(hour) || hour < 0 || hour > 23) {
      next.time = "Select a valid transaction time (00:00 to 23:59).";
    }

    const baseDayStep = sampleStep !== null ? Math.floor(sampleStep / 24) * 24 : 120;
    const step = baseDayStep + (isNaN(hour) ? 14 : hour);

    setErrors(next);
    if (Object.keys(next).length) return null;
    return {
      type: form.type,
      amount,
      senderId: form.senderId.trim(),
      receiverId: form.receiverId.trim(),
      step,
      occurredAt: timeVal,
      senderOldBalance: optionalNumber(form.senderOldBalance),
      senderNewBalance: optionalNumber(form.senderNewBalance),
      receiverOldBalance: optionalNumber(form.receiverOldBalance),
      receiverNewBalance: optionalNumber(form.receiverNewBalance),
      transactionId: activeTxnId,
      datasetIndex: activeDatasetIndex,
      isVerified: activeIsVerified,
    };
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const input = validate();
    if (!input) return;
    await analyze(input);
  }

  function field(
    name: keyof FormState,
    label: string,
    options?: { type?: string; tooltip?: string; placeholder?: string },
  ) {
    return (
      <label className="block">
        <span className="mb-1.5 flex items-center gap-1.5 text-sm text-muted">
          {label}
          {options?.tooltip ? <Tooltip content={options.tooltip} /> : null}
        </span>
        <input
          value={form[name]}
          onChange={(e) => setState((s) => ({ ...s, [name]: e.target.value }))}
          type={options?.type ?? "text"}
          placeholder={options?.placeholder}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent [color-scheme:dark]"
        />
        {errors[name] ? <p className="mt-1 text-xs text-high">{errors[name]}</p> : null}
      </label>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Analyze Transaction</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Provide transaction details or sample authentic records with verifiable unique IDs from the 41,643-row held-out test partition.
          </p>
        </div>
        <DemoSelector onSelect={(tx) => { apply(tx); setSampleInfo(null); }} />
      </div>

      {/* Ground Truth & Verifiable Record Banner if loaded from test set */}
      {sampleInfo && (
        <div className={`rounded-xl border p-4 text-xs ${
          sampleInfo.groundTruth === "FRAUD"
            ? "border-red-500/40 bg-red-950/20 text-red-200"
            : "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {sampleInfo.groundTruth === "FRAUD" ? (
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold tracking-wide">
                    Ground Truth: [{sampleInfo.groundTruth}]
                  </span>
                  {sampleInfo.transactionId && (
                    <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-[11px] font-bold text-accent border border-accent/40">
                      ID: {sampleInfo.transactionId}
                    </span>
                  )}
                  {sampleInfo.datasetIndex !== undefined && (
                    <span className="text-[11px] text-muted">
                      (Row #{sampleInfo.datasetIndex} in held-out partition)
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  Physical source: <code className="text-[10px] text-foreground">artifacts/test_engineered.parquet</code> • Verifiable row on disk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {sampleInfo.transactionId && (
                <button
                  type="button"
                  onClick={() => handleVerifyDiskProof(sampleInfo.transactionId!)}
                  className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/25 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verify on Disk
                </button>
              )}
              <button
                type="button"
                onClick={() => { setSampleInfo(null); setVerificationResult(null); }}
                className="p-1 text-muted hover:text-foreground"
                title="Dismiss banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded Verification Proof Card */}
          {verificationResult && (
            <div className="mt-3 pt-3 border-t border-border/40 font-mono text-[11px] bg-surface-2/80 rounded p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-accent font-semibold">
                <FileCheck2 className="h-3.5 w-3.5" />
                Physical Disk Verification Confirmed
              </div>
              <div className="text-muted">
                File: <span className="text-foreground">{verificationResult.dataset_source}</span>
              </div>
              <div className="text-muted">
                Row Index: <span className="text-foreground">#{verificationResult.dataset_index}</span> of {verificationResult.total_partition_records} records
              </div>
              <div className="text-muted">
                SHA-256 Checksum: <span className="text-accent">{verificationResult.sha256_checksum}</span>
              </div>
              <div className="text-muted text-[10px]">
                {verificationResult.provenance}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="panel space-y-6 p-5 sm:p-6">
        {/* Held-Out Test Set Random Sampler Toolbar */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
              <Dice5 className="h-3.5 w-3.5" />
              Held-Out Test Set Generator (41,643 Rows)
            </span>
            <span className="text-[11px] text-muted">Zero cherry-picking • Authentic test partitions</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isLoadingSample}
              onClick={() => handleLoadRandom()}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-foreground transition disabled:opacity-50"
            >
              <Dice5 className="h-3.5 w-3.5 text-accent" />
              {isLoadingSample ? "Loading..." : "🎲 Random Test Sample"}
            </button>
            <button
              type="button"
              disabled={isLoadingSample}
              onClick={() => handleLoadRandom("fraud")}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:border-red-500 hover:bg-red-950/40 transition disabled:opacity-50"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              Sample Real Fraud
            </button>
            <button
              type="button"
              disabled={isLoadingSample}
              onClick={() => handleLoadRandom("medium")}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-xs font-medium text-amber-300 hover:border-amber-500 hover:bg-amber-950/40 transition disabled:opacity-50"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              Sample Borderline Review
            </button>
            <button
              type="button"
              disabled={isLoadingSample}
              onClick={() => handleLoadRandom("legitimate")}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:border-emerald-500 hover:bg-emerald-950/40 transition disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Sample Real Legitimate
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Transaction Type</span>
            <select
              value={form.type}
              onChange={(e) => setState((s) => ({ ...s, type: e.target.value as TransactionType }))}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm"
            >
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          {field("amount", "Amount", { placeholder: "25000" })}
          {field("senderId", "Sender Account ID", { placeholder: "e.g. user@okhdfcbank or C123456789" })}
          {field("receiverId", form.type === "PAYMENT" ? "Receiver Account ID (Merchant Only)" : "Receiver Account ID", {
            placeholder: form.type === "PAYMENT" ? "e.g. M987654321 or store_merchant@paytm" : "e.g. user@okhdfcbank or C987654321",
            tooltip: form.type === "PAYMENT" ? "For PAYMENT, the recipient must be a registered merchant (starts with M or includes 'merchant')." : "Counterparty receiving the funds."
          })}
          {field("time", "Transaction Time", {
            type: "time",
            tooltip: "Time of day when the transfer was initiated. Off-peak hours (10:00 PM – 5:00 AM) are evaluated as high-risk night windows.",
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <fieldset className="rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-medium">Sender balances</legend>
            <p className="mb-3 text-xs text-muted">
              Dataset fields used as accounting-consistency signals.
              <Tooltip content={TOOLTIPS.balances} className="ml-1" />
            </p>
            {field("senderOldBalance", "Opening balance")}
            <div className="mt-3">{field("senderNewBalance", "Closing balance")}</div>
          </fieldset>
          <fieldset className="rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-medium">Receiver balances</legend>
            <p className="mb-3 text-xs text-muted">Available in the current research dataset.</p>
            {field("receiverOldBalance", "Opening balance")}
            <div className="mt-3">{field("receiverNewBalance", "Closing balance")}</div>
          </fieldset>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="ghost" onClick={() => { setState(EMPTY); setSampleInfo(null); setActiveTxnId(undefined); setActiveDatasetIndex(undefined); setActiveIsVerified(false); }}>
          Reset
        </Button>
        <Button type="submit" disabled={!valid}>
          Analyze Transaction
        </Button>
      </div>
    </form>
  );
}
