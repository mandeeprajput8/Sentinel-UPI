import { DatasetCaveats } from "@/components/insights/DatasetCaveats";
import { LiteratureSurvey } from "@/components/insights/LiteratureSurvey";

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Academic & Literature Survey</span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
            IEEE / Springer Standard
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          Research Framework, Literature & Defense
        </h2>
        <p className="mt-2 text-sm text-muted max-w-3xl leading-relaxed">
          Sentinel: An Explainable and Imbalance-Aware Machine Learning Framework for UPI Fraud Detection.
          A structured investigation of behavioral features, extreme imbalance handling, temporal walk-forward evaluation, and sub-millisecond Explainable AI.
        </p>
      </div>

      {/* Literature Survey, 10 Gaps, and 6 RQs */}
      <LiteratureSurvey />

      {/* Dataset Nuances & Real-Time Defense */}
      <DatasetCaveats />
    </div>
  );
}
