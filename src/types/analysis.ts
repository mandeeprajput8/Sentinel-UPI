export type TransactionType =
  | "TRANSFER"
  | "CASH_OUT"
  | "PAYMENT";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type PredictionLabel = "LEGITIMATE" | "SUSPICIOUS" | "REVIEW";

export type FeatureCategory =
  | "transaction"
  | "temporal"
  | "behavioral"
  | "network";

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  senderId: string;
  receiverId: string;
  step: number;
  occurredAt?: string;
  senderOldBalance?: number;
  senderNewBalance?: number;
  receiverOldBalance?: number;
  receiverNewBalance?: number;
  transactionId?: string;
  datasetIndex?: number;
  isVerified?: boolean;
  datasetSource?: string;
}

export interface FeatureContribution {
  id: string;
  name: string;
  impact: number;
  contributionPct: number;
  severity: RiskLevel;
  category: FeatureCategory;
  summary: string;
  detail: string;
}

export interface TemporalAnalysis {
  activityLevel: "NORMAL" | "ELEVATED" | "HIGH";
  timeSincePrevious: string;
  burstDetected: boolean;
  series: { label: string; value: number; current?: boolean }[];
  explanation: string;
}

export interface SenderAnalysis {
  previousTransactions: number;
  averageTransaction: number;
  amountDeviationPct: number;
  velocity: "LOW" | "MODERATE" | "HIGH";
  explanation: string;
}

export interface ReceiverAnalysis {
  transactionCount: number;
  uniqueSenders: number;
  historicalRisk: RiskLevel;
  recentActivity: "NORMAL" | "UNUSUAL" | "ELEVATED";
  networkConnectivity: "LOW" | "MODERATE" | "HIGH";
  explanation: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  transactions: number;
  isCurrentSender?: boolean;
}

export interface NetworkAnalysis {
  nodes: NetworkNode[];
  explanation: string;
}

export interface RiskComposition {
  transaction: number;
  temporal: number;
  behavioral: number;
  receiverNetwork: number;
}

export interface MathCalculation {
  baseLogOdds: number;
  baseProbability: number;
  positiveShapSum: number;
  negativeShapSum: number;
  netMarginLogOdds: number;
  rawProbability?: number;
  calibratedRiskPercent?: number;
  formula?: string;
}

export interface RiskAnalysis {
  id: string;
  transactionId?: string;
  isVerified?: boolean;
  datasetIndex?: number;
  analyzedAt: string;
  input: TransactionInput;
  riskScore: number;
  riskLevel: RiskLevel;
  prediction: PredictionLabel;
  confidence: number;
  headline: string;
  features: FeatureContribution[];
  temporalAnalysis: TemporalAnalysis;
  senderAnalysis: SenderAnalysis;
  receiverAnalysis: ReceiverAnalysis;
  networkAnalysis: NetworkAnalysis;
  composition: RiskComposition;
  explanation: string;
  technicalInterpretation: string;
  recommendations: string[];
  positiveFactors: string[];
  mathCalculation?: MathCalculation;
}

export interface HistoryEntry {
  id: string;
  analyzedAt: string;
  type: TransactionType;
  amount: number;
  receiverId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  prediction: PredictionLabel;
  analysis: RiskAnalysis;
}
