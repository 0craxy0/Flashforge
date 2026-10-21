import {
  ApiProvider,
  BillingSummary,
  ConsumptionTimeSeriesPoint,
  ModelUsageMetric,
  ProviderQuotaMetric,
} from "@/types/billing";

export const MOCK_MODELS: ModelUsageMetric[] = [
  {
    id: "openai-gpt-6-sol",
    provider: "OpenAI",
    model: "GPT-6.1 Sol",
    endpoint: "v1/chat/completions",
    inputTokens: 3_420_000,
    outputTokens: 860_000,
    cachedTokens: 1_200_000,
    requestCount: 42_190,
    inputRatePer1M: 2.0,
    outputRatePer1M: 10.0,
    cachedInputRatePer1M: 1.0,
    costThreshold: 20.0,
    latencyP95Ms: 480,
    rateNote: "Standard · USD / 1M tokens",
    documentationUrl: "https://developers.openai.com/api/docs/pricing",
    lastActive: "1 min ago",
  },
  {
    id: "anthropic-claude-3-7-sonnet",
    provider: "Anthropic",
    model: "Claude Sonnet 5.5",
    endpoint: "v1/messages",
    inputTokens: 2_100_000,
    outputTokens: 470_000,
    cachedTokens: 850_000,
    requestCount: 18_420,
    inputRatePer1M: 2.0,
    outputRatePer1M: 10.0,
    cachedInputRatePer1M: 0.5,
    costThreshold: 15.0,
    latencyP95Ms: 512,
    rateNote: "Standard · USD / 1M tokens",
    documentationUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing",
    lastActive: "Just now",
  },
  {
    id: "google-gemini-3-8-flash",
    provider: "Google",
    model: "Gemini 3.8 Flash",
    endpoint: "v1beta/models/gemini-3.8-flash:generateContent",
    inputTokens: 4_860_000,
    outputTokens: 1_240_000,
    cachedTokens: 1_900_000,
    requestCount: 88_930,
    inputRatePer1M: 0.75,
    outputRatePer1M: 3.75,
    cachedInputRatePer1M: 0.18,
    costThreshold: 12.0,
    latencyP95Ms: 240,
    rateNote: "Paid standard · through Dec 31, 2026",
    documentationUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    lastActive: "3 mins ago",
  },
  {
    id: "deepseek-flash",
    provider: "DeepSeek",
    model: "DeepSeek Flash",
    endpoint: "v1/chat/completions",
    inputTokens: 7_400_000,
    outputTokens: 1_300_000,
    cachedTokens: 4_100_000,
    requestCount: 142_500,
    inputRatePer1M: 0.15,
    outputRatePer1M: 0.6,
    cachedInputRatePer1M: 0.04,
    costThreshold: 5.0,
    latencyP95Ms: 310,
    rateNote: "Off-peak · cache miss · USD / 1M",
    documentationUrl: "https://api-docs.deepseek.com/quick_start/pricing/",
    lastActive: "Just now",
  },
  {
    id: "xai-grok-4",
    provider: "xAI",
    model: "Grok 4.7",
    endpoint: "v1/chat/completions",
    inputTokens: 1_720_000,
    outputTokens: 520_000,
    cachedTokens: 420_000,
    requestCount: 12_800,
    inputRatePer1M: 2.0,
    outputRatePer1M: 6.0,
    cachedInputRatePer1M: 1.0,
    costThreshold: 10.0,
    latencyP95Ms: 590,
    rateNote: "Global · short context (<200k) · USD / 1M",
    documentationUrl: "https://docs.x.ai/developers/pricing",
    lastActive: "8 mins ago",
  },
  {
    id: "mistral-large-4",
    provider: "Mistral",
    model: "Mistral Large 4",
    endpoint: "v1/chat/completions",
    inputTokens: 1_800_000,
    outputTokens: 330_000,
    cachedTokens: 500_000,
    requestCount: 9_120,
    inputRatePer1M: 1.36,
    outputRatePer1M: 4.18,
    cachedInputRatePer1M: 0.68,
    costThreshold: 8.0,
    latencyP95Ms: 440,
    rateNote: "Standard · USD / 1M tokens",
    documentationUrl: "https://docs.mistral.ai/inference/pricing",
    lastActive: "15 mins ago",
  },
  {
    id: "groq-gpt-oss",
    provider: "Groq",
    model: "OpenAI GPT-OSS 120B",
    endpoint: "openai/v1/chat/completions",
    inputTokens: 5_500_000,
    outputTokens: 980_000,
    cachedTokens: 2_100_000,
    requestCount: 76_400,
    inputRatePer1M: 0.15,
    outputRatePer1M: 0.6,
    cachedInputRatePer1M: 0.05,
    costThreshold: 6.0,
    latencyP95Ms: 95,
    rateNote: "Groq LPUs · USD / 1M tokens",
    documentationUrl: "https://console.groq.com/docs/models",
    lastActive: "Just now",
  },
  {
    id: "perplexity-sonar",
    provider: "Perplexity",
    model: "Sonar",
    endpoint: "v1/chat/completions",
    inputTokens: 1_200_000,
    outputTokens: 180_000,
    cachedTokens: 300_000,
    requestCount: 6_240,
    inputRatePer1M: 0.25,
    outputRatePer1M: 2.5,
    cachedInputRatePer1M: 0.12,
    costThreshold: 4.0,
    latencyP95Ms: 720,
    rateNote: "Agent API token rates · web search included",
    documentationUrl: "https://docs.perplexity.ai/docs/agent-api/models",
    lastActive: "22 mins ago",
  },
];

export function calculateModelCost(model: ModelUsageMetric): number {
  const nonCachedInput = Math.max(0, model.inputTokens - model.cachedTokens);
  const cost =
    (nonCachedInput * model.inputRatePer1M +
      model.cachedTokens * model.cachedInputRatePer1M +
      model.outputTokens * model.outputRatePer1M) /
    1_000_000;
  return Number(cost.toFixed(4));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000_000) {
    return `${(tokens / 1_000_000_000).toFixed(2)}B`;
  }
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}k`;
  }
  return tokens.toLocaleString("en-US");
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

const totalModelSpend = MOCK_MODELS.reduce(
  (sum, m) => sum + calculateModelCost(m),
  0
);

export const MOCK_BILLING_SUMMARY: BillingSummary = {
  currentSpend: totalModelSpend,
  budgetLimit: 45.0,
  softLimitThreshold: 80,
  totalTokensMetered: MOCK_MODELS.reduce(
    (sum, m) => sum + m.inputTokens + m.outputTokens,
    0
  ),
  totalInputTokens: MOCK_MODELS.reduce((sum, m) => sum + m.inputTokens, 0),
  totalOutputTokens: MOCK_MODELS.reduce((sum, m) => sum + m.outputTokens, 0),
  totalCachedTokens: MOCK_MODELS.reduce((sum, m) => sum + m.cachedTokens, 0),
  totalRequests: MOCK_MODELS.reduce((sum, m) => sum + m.requestCount, 0),
  activeKeysCount: 14,
  forecastedMonthEndSpend: 38.65,
  anomalyDetected: true,
  anomalyMessage: "Token velocity increased +14.2% on OpenAI & Anthropic; spend projected within $45.00 threshold.",
  periodStart: "Oct 01, 2026",
  periodEnd: "Oct 31, 2026",
};

export const MOCK_PROVIDER_QUOTAS: ProviderQuotaMetric[] = [
  {
    provider: "OpenAI",
    allocatedSpendLimit: 18.0,
    currentSpend: calculateModelCost(MOCK_MODELS[0]),
    totalTokens: MOCK_MODELS[0].inputTokens + MOCK_MODELS[0].outputTokens,
    tokenAllocationLimit: 6_000_000,
    status: "warning",
    statusReason: "Approaching 80% soft limit warning threshold",
  },
  {
    provider: "Anthropic",
    allocatedSpendLimit: 10.0,
    currentSpend: calculateModelCost(MOCK_MODELS[1]),
    totalTokens: MOCK_MODELS[1].inputTokens + MOCK_MODELS[1].outputTokens,
    tokenAllocationLimit: 4_000_000,
    status: "healthy",
  },
  {
    provider: "Google",
    allocatedSpendLimit: 8.0,
    currentSpend: calculateModelCost(MOCK_MODELS[2]),
    totalTokens: MOCK_MODELS[2].inputTokens + MOCK_MODELS[2].outputTokens,
    tokenAllocationLimit: 10_000_000,
    status: "healthy",
  },
  {
    provider: "DeepSeek",
    allocatedSpendLimit: 3.0,
    currentSpend: calculateModelCost(MOCK_MODELS[3]),
    totalTokens: MOCK_MODELS[3].inputTokens + MOCK_MODELS[3].outputTokens,
    tokenAllocationLimit: 15_000_000,
    status: "healthy",
  },
  {
    provider: "xAI",
    allocatedSpendLimit: 6.0,
    currentSpend: calculateModelCost(MOCK_MODELS[4]),
    totalTokens: MOCK_MODELS[4].inputTokens + MOCK_MODELS[4].outputTokens,
    tokenAllocationLimit: 3_000_000,
    status: "healthy",
  },
  {
    provider: "Mistral",
    allocatedSpendLimit: 5.0,
    currentSpend: calculateModelCost(MOCK_MODELS[5]),
    totalTokens: MOCK_MODELS[5].inputTokens + MOCK_MODELS[5].outputTokens,
    tokenAllocationLimit: 3_500_000,
    status: "healthy",
  },
  {
    provider: "Groq",
    allocatedSpendLimit: 3.5,
    currentSpend: calculateModelCost(MOCK_MODELS[6]),
    totalTokens: MOCK_MODELS[6].inputTokens + MOCK_MODELS[6].outputTokens,
    tokenAllocationLimit: 12_000_000,
    status: "healthy",
  },
  {
    provider: "Perplexity",
    allocatedSpendLimit: 2.5,
    currentSpend: calculateModelCost(MOCK_MODELS[7]),
    totalTokens: MOCK_MODELS[7].inputTokens + MOCK_MODELS[7].outputTokens,
    tokenAllocationLimit: 2_000_000,
    status: "healthy",
  },
];

export const MOCK_TIME_SERIES: ConsumptionTimeSeriesPoint[] = [
  {
    timestamp: "2026-10-01",
    label: "Oct 01",
    totalTokens: 0.62,
    cost: 0.65,
    tokensByProvider: { OpenAI: 0.12, Anthropic: 0.08, Google: 0.15, DeepSeek: 0.14, xAI: 0.04, Mistral: 0.03, Groq: 0.05, Perplexity: 0.01 },
    previousPeriodTokens: 0.45,
  },
  {
    timestamp: "2026-10-04",
    label: "Oct 04",
    totalTokens: 0.74,
    cost: 0.82,
    tokensByProvider: { OpenAI: 0.14, Anthropic: 0.09, Google: 0.18, DeepSeek: 0.18, xAI: 0.05, Mistral: 0.03, Groq: 0.06, Perplexity: 0.01 },
    previousPeriodTokens: 0.52,
  },
  {
    timestamp: "2026-10-07",
    label: "Oct 07",
    totalTokens: 0.88,
    cost: 0.94,
    tokensByProvider: { OpenAI: 0.16, Anthropic: 0.11, Google: 0.22, DeepSeek: 0.22, xAI: 0.05, Mistral: 0.04, Groq: 0.07, Perplexity: 0.01 },
    previousPeriodTokens: 0.61,
  },
  {
    timestamp: "2026-10-10",
    label: "Oct 10",
    totalTokens: 1.05,
    cost: 1.18,
    tokensByProvider: { OpenAI: 0.21, Anthropic: 0.14, Google: 0.26, DeepSeek: 0.25, xAI: 0.06, Mistral: 0.04, Groq: 0.08, Perplexity: 0.01 },
    previousPeriodTokens: 0.73,
  },
  {
    timestamp: "2026-10-13",
    label: "Oct 13",
    totalTokens: 1.22,
    cost: 1.35,
    tokensByProvider: { OpenAI: 0.25, Anthropic: 0.15, Google: 0.31, DeepSeek: 0.32, xAI: 0.06, Mistral: 0.04, Groq: 0.08, Perplexity: 0.01 },
    previousPeriodTokens: 0.84,
  },
  {
    timestamp: "2026-10-16",
    label: "Oct 16",
    totalTokens: 1.48,
    cost: 1.62,
    tokensByProvider: { OpenAI: 0.31, Anthropic: 0.19, Google: 0.38, DeepSeek: 0.36, xAI: 0.08, Mistral: 0.05, Groq: 0.09, Perplexity: 0.02 },
    previousPeriodTokens: 0.96,
  },
  {
    timestamp: "2026-10-19",
    label: "Oct 19",
    totalTokens: 1.76,
    cost: 1.94,
    tokensByProvider: { OpenAI: 0.38, Anthropic: 0.22, Google: 0.44, DeepSeek: 0.43, xAI: 0.09, Mistral: 0.06, Groq: 0.12, Perplexity: 0.02 },
    previousPeriodTokens: 1.08,
  },
  {
    timestamp: "2026-10-21",
    label: "Oct 21 (Today)",
    totalTokens: 1.92,
    cost: 2.15,
    tokensByProvider: { OpenAI: 0.42, Anthropic: 0.25, Google: 0.49, DeepSeek: 0.46, xAI: 0.1, Mistral: 0.06, Groq: 0.12, Perplexity: 0.02 },
    previousPeriodTokens: 1.15,
  },
];
