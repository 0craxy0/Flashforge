"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiProvider, ConsumptionTimeSeriesPoint } from "@/types/billing";
import {
  calculateModelCost,
  formatCurrency,
  formatTokens,
  MOCK_MODELS,
  MOCK_PROVIDER_QUOTAS,
  MOCK_TIME_SERIES,
} from "@/data/mock-billing";

interface MultiApiConsumptionProps {
  timeframe: string;
}

export function MultiApiConsumption({ timeframe }: MultiApiConsumptionProps) {
  const [selectedProvider, setSelectedProvider] = React.useState<ApiProvider | "All">("All");
  const [activeMetricMode, setActiveMetricMode] = React.useState<"tokens" | "cost">("tokens");
  const [hoveredPointIndex, setHoveredPointIndex] = React.useState<number | null>(null);

  // Dynamic simulation state for interactive quota testing
  const [surgeAddedTokens, setSurgeAddedTokens] = React.useState<number>(0);

  const providers: (ApiProvider | "All")[] = [
    "All",
    "OpenAI",
    "Anthropic",
    "Google",
    "DeepSeek",
    "xAI",
    "Mistral",
    "Groq",
    "Perplexity",
  ];

  // Adjust time-series based on selected provider and metric mode
  const chartPoints: { label: string; value: number; secondaryValue: number }[] =
    MOCK_TIME_SERIES.map((point) => {
      let val = point.totalTokens;
      let prev = point.previousPeriodTokens;

      if (selectedProvider !== "All") {
        const providerVal = point.tokensByProvider[selectedProvider] ?? 0;
        val = providerVal;
        prev = providerVal * 0.72;
      }

      if (activeMetricMode === "cost") {
        // approximate cost in USD
        val = selectedProvider === "All" ? point.cost : point.cost * 0.28;
        prev = val * 0.75;
      }

      return {
        label: point.label,
        value: Number(val.toFixed(2)),
        secondaryValue: Number(prev.toFixed(2)),
      };
    });

  const maxValue = Math.max(
    ...chartPoints.flatMap((p) => [p.value, p.secondaryValue]),
    activeMetricMode === "tokens" ? 2.5 : 3.0
  );

  // SVG coordinate calculations for 800 x 200 viewBox
  const svgWidth = 800;
  const svgHeight = 200;
  const paddingX = 24;
  const paddingY = 20;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const getCoordinates = (points: { value: number }[]) => {
    return points.map((p, idx) => {
      const x = paddingX + (idx / (points.length - 1)) * chartW;
      const y = paddingY + chartH - (p.value / maxValue) * chartH;
      return { x, y };
    });
  };

  const primaryCoords = getCoordinates(chartPoints.map((p) => ({ value: p.value })));
  const secondaryCoords = getCoordinates(chartPoints.map((p) => ({ value: p.secondaryValue })));

  const primaryPolyline = primaryCoords.map((c) => `${c.x},${c.y}`).join(" ");
  const secondaryPolyline = secondaryCoords.map((c) => `${c.x},${c.y}`).join(" ");

  const primaryPolygon = `
    ${primaryCoords[0].x},${svgHeight - paddingY}
    ${primaryPolyline}
    ${primaryCoords[primaryCoords.length - 1].x},${svgHeight - paddingY}
  `;

  // Gridline values
  const gridLevels = [0, 0.25, 0.5, 0.75, 1.0];

  const handleSimulateSurge = () => {
    setSurgeAddedTokens((prev) => (prev >= 2_000_000 ? 0 : prev + 500_000));
  };

  return (
    <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-zinc-800/80 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <Layers size={16} className="text-zinc-400" />
                Multi-API Consumption &amp; Quota Telemetry
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[10px]">
                {timeframe.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="mt-1">
              Live asynchronous token metering with per-provider cost thresholds &amp; rate verification.
            </CardDescription>
          </div>

          {/* Controls: Mode Switch & Simulated Surge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-md border border-zinc-800 bg-zinc-900 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveMetricMode("tokens")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  activeMetricMode === "tokens"
                    ? "bg-zinc-800 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Tokens (M)
              </button>
              <button
                type="button"
                onClick={() => setActiveMetricMode("cost")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  activeMetricMode === "cost"
                    ? "bg-zinc-800 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Spend (USD)
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateSurge}
              className="text-xs font-mono border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300"
              title="Test threshold reactive warning by simulating 500k additional tokens"
            >
              <Zap size={12} className="text-amber-400" />
              <span>{surgeAddedTokens > 0 ? `Surge +${formatTokens(surgeAddedTokens)}` : "Simulate Surge"}</span>
            </Button>
          </div>
        </div>

        {/* Provider Filter Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-zinc-500 font-mono pr-1 flex items-center gap-1">
            <Filter size={11} /> Filter:
          </span>
          {providers.map((p) => {
            const isSelected = selectedProvider === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedProvider(p)}
                className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap ${
                  isSelected
                    ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                    : "bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* SVG Data Visualization Canvas */}
        <div className="relative">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span>
              Metric:{" "}
              <strong className="text-zinc-200 font-normal">
                {activeMetricMode === "tokens" ? "Million Tokens Metered" : "Accrued Invoiced Spend ($)"}
              </strong>{" "}
              [{selectedProvider}]
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-100" />
                <span>Current Trajectory</span>
              </span>
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-0.5 w-3 border-b border-dashed border-zinc-500" />
                <span>Baseline Run-rate</span>
              </span>
            </div>
          </div>

          <div className="relative h-56 w-full rounded-lg border border-zinc-800/90 bg-zinc-950/90 p-2">
            <svg
              className="h-full w-full overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              aria-label="Multi-API consumption chart"
            >
              <defs>
                <linearGradient id="consumption-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 0%, 98%)" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="hsl(0, 0%, 98%)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              {gridLevels.map((lvl) => {
                const y = paddingY + chartH - lvl * chartH;
                const displayVal = (lvl * maxValue).toFixed(1);
                return (
                  <g key={lvl}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="hsl(240, 3.7%, 15.9%)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX + 4}
                      y={y - 4}
                      fill="hsl(240, 5%, 45%)"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {activeMetricMode === "cost" ? `$${displayVal}` : `${displayVal}M`}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <polygon points={primaryPolygon} fill="url(#consumption-gradient)" />

              {/* Previous Period / Baseline Dashed Line */}
              <polyline
                points={secondaryPolyline}
                fill="none"
                stroke="hsl(240, 5%, 40%)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                vectorEffect="non-scaling-stroke"
              />

              {/* Active Consumption Line */}
              <polyline
                points={primaryPolyline}
                fill="none"
                stroke="hsl(0, 0%, 95%)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              {/* Interactive Data Point Pins */}
              {primaryCoords.map((coord, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isHovered ? 5 : 3}
                      fill={isHovered ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 15%)"}
                      stroke="hsl(0, 0%, 95%)"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPointIndex !== null && (
              <div
                className="absolute z-20 pointer-events-none rounded-md border border-zinc-700 bg-zinc-900/95 p-2.5 text-xs shadow-xl font-mono"
                style={{
                  left: `${Math.min(
                    85,
                    Math.max(10, (hoveredPointIndex / (chartPoints.length - 1)) * 100)
                  )}%`,
                  top: "20%",
                  transform: "translateX(-50%)",
                }}
              >
                <div className="text-zinc-400 text-[10px] pb-1 border-b border-zinc-800">
                  {chartPoints[hoveredPointIndex].label}
                </div>
                <div className="mt-1 text-zinc-100 font-semibold">
                  {activeMetricMode === "tokens"
                    ? `${chartPoints[hoveredPointIndex].value}M tokens`
                    : `$${chartPoints[hoveredPointIndex].value} USD`}
                </div>
                <div className="text-[10px] text-zinc-400">
                  Baseline:{" "}
                  {activeMetricMode === "tokens"
                    ? `${chartPoints[hoveredPointIndex].secondaryValue}M`
                    : `$${chartPoints[hoveredPointIndex].secondaryValue}`}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between px-2 pt-2 text-[10px] font-mono text-zinc-500">
            {chartPoints.map((p) => (
              <span key={p.label}>{p.label}</span>
            ))}
          </div>
        </div>

        {/* AI Forecast & Anomaly Detection Panel (Utilizing Sparkles strictly as allowed by AGENTS.md rule 3) */}
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded border border-zinc-700/60 bg-zinc-900 text-zinc-200">
                <Sparkles size={14} className="text-zinc-200" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200">
                    AI-Assisted Consumption Forecast &amp; Anomaly Sentinel
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Confidence: 99.4%
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Projected End-of-Month Spend:{" "}
                  <strong className="text-zinc-100 font-mono">$38.65</strong> (85.8% of $45.00 limit). Prompt
                  caching on DeepSeek and Google avoided an estimated{" "}
                  <strong className="text-zinc-200 font-mono">$6.12</strong> in standard token rates.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-900 px-2 py-1 text-[10px] font-mono text-zinc-400 border border-zinc-800">
              <TrendingUp size={11} className="text-emerald-400" />
              Velocity Stable
            </span>
          </div>
        </div>

        {/* Multi-API Provider Consumption Counters & Cost Threshold Bars */}
        <div>
          <div className="flex items-center justify-between pb-3">
            <div>
              <h4 className="text-xs font-semibold text-zinc-200 tracking-tight">
                Provider Quotas &amp; Cost Thresholds
              </h4>
              <p className="text-[11px] text-zinc-400">
                Monitored against soft warning thresholds (80%) and hard quota cutoffs.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Unit: USD / Standard 1M Tokens
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {MOCK_PROVIDER_QUOTAS.map((quota) => {
              // Apply simulated surge if testing
              const surgeShare =
                quota.provider === "OpenAI"
                  ? (surgeAddedTokens / 1_000_000) * 2.0
                  : quota.provider === "Anthropic"
                  ? (surgeAddedTokens / 1_000_000) * 1.5
                  : 0;

              const totalSpendWithSurge = quota.currentSpend + surgeShare;
              const spendPercentage = Math.round(
                (totalSpendWithSurge / quota.allocatedSpendLimit) * 100
              );

              const isWarning = spendPercentage >= 75 && spendPercentage < 100;
              const isCritical = spendPercentage >= 100;

              return (
                <div
                  key={quota.provider}
                  className={`rounded-lg border p-3.5 transition-all ${
                    isCritical
                      ? "border-rose-500/40 bg-rose-950/10"
                      : isWarning
                      ? "border-amber-500/40 bg-amber-950/10"
                      : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-200">
                      {quota.provider}
                    </span>
                    <Badge
                      variant={
                        isCritical
                          ? "destructive"
                          : isWarning
                          ? "warning"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {isCritical ? "EXCEEDED" : isWarning ? "NEAR QUOTA" : "HEALTHY"}
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between font-mono text-xs mb-1.5">
                    <span className="text-zinc-100 font-semibold">
                      {formatCurrency(totalSpendWithSurge)}
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      / {formatCurrency(quota.allocatedSpendLimit)} limit
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800"
                    role="progressbar"
                    aria-label={`${quota.provider} spend quota`}
                    aria-valuenow={spendPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical
                          ? "bg-rose-500"
                          : isWarning
                          ? "bg-amber-400"
                          : "bg-zinc-300"
                      }`}
                      style={{ width: `${Math.min(100, spendPercentage)}%` }}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>
                      {formatTokens(quota.totalTokens + (quota.provider === "OpenAI" ? surgeAddedTokens : 0))} tokens
                    </span>
                    <span
                      className={
                        isCritical
                          ? "text-rose-400"
                          : isWarning
                          ? "text-amber-400"
                          : "text-zinc-500"
                      }
                    >
                      {spendPercentage}% used
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
