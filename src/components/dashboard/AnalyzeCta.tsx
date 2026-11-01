"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function AnalyzeCta() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 className="text-lg font-semibold">Analyze a Transaction</h2>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Evaluate a financial transaction and understand the factors contributing to its risk
          score.
        </p>
      </div>
      <Link
        href="/analyze"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white"
      >
        Start Analysis
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.section>
  );
}
