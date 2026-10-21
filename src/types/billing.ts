export type ApiProvider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "DeepSeek"
  | "xAI"
  | "Mistral"
  | "Groq"
  | "Perplexity";

export type QuotaStatus = "healthy" | "warning" | "critical";

export interface ModelUsageMetric {
  id: string;
  provider: ApiProvider;
  model: string;
  endpoint: string;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  requestCount: number;
  inputRatePer1M: number;
  outputRatePer1M: number;
  cachedInputRatePer1M: number;
  costThreshold: number; // in USD
  latencyP95Ms: number;
  rateNote: string;
  documentationUrl: string;
  lastActive: string;
}

export interface ProviderQuotaMetric {
  provider: ApiProvider;
  allocatedSpendLimit: number;
  currentSpend: number;
  totalTokens: number;
  tokenAllocationLimit: number;
  status: QuotaStatus;
  statusReason?: string;
}

export interface ConsumptionTimeSeriesPoint {
  timestamp: string;
  label: string;
  totalTokens: number; // in millions
  cost: number; // in USD
  tokensByProvider: Record<ApiProvider, number>;
  previousPeriodTokens: number;
}

export interface BillingSummary {
  currentSpend: number;
  budgetLimit: number;
  softLimitThreshold: number; // percentage (e.g. 80%)
  totalTokensMetered: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCachedTokens: number;
  totalRequests: number;
  activeKeysCount: number;
  forecastedMonthEndSpend: number;
  anomalyDetected: boolean;
  anomalyMessage?: string;
  periodStart: string;
  periodEnd: string;
}
