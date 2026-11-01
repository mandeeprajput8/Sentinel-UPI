"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { RiskComposition } from "@/types/analysis";

export function RiskBreakdown({ composition }: { composition: RiskComposition }) {
  const data = [
    { name: "Transaction", value: composition.transaction, color: "#6b8cff" },
    { name: "Temporal", value: composition.temporal, color: "#8b7dff" },
    { name: "Behavioral", value: composition.behavioral, color: "#e7b549" },
    { name: "Receiver Network", value: composition.receiverNetwork, color: "#ef6b6b" },
  ];

  return (
    <section className="panel p-5">
      <h3 className="font-semibold">Risk Composition</h3>
      <p className="text-xs text-muted">XGBoost SHAP attribution weight across the four context families.</p>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {data.map((item) => (
          <li key={item.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
              {item.name}
            </span>
            <span className="tabular-nums text-muted">{item.value}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
