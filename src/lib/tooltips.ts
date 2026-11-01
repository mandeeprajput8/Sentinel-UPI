export const TOOLTIPS = {
  shap: "SHAP estimates how much each feature contributed to a model prediction. The chart here is an explainability preview, not a live SHAP output.",
  temporal:
    "A feature derived from transaction timing or activity patterns across discrete time steps.",
  behavioral:
    "A feature representing patterns in historical sender or receiver transaction behavior.",
  receiverNetwork:
    "Relationships between destination accounts and the participants that transact with them.",
  riskScore:
    "The estimated likelihood that the transaction exhibits fraudulent characteristics.",
  confidence:
    "Simulated certainty of the current assessment. Distinct from the risk score itself.",
  timeStep:
    "In the underlying dataset, each step represents a discrete time interval. It is used to derive temporal activity patterns.",
  balances:
    "Opening and closing balances are present in the current research dataset. They are not necessarily fields a typical retail payment user would see.",
  simulation:
    "Frontend prototype values. The live ML model is not connected yet; this module can be swapped for a real prediction API.",
  featurePreview:
    "Simulated feature contributions used to demonstrate the explainability interface before model integration.",
} as const;
