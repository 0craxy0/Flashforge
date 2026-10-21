"use client";

import * as React from "react";
import { Activity, CheckCircle2, Database, Layers, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiApiConsumption } from "@/components/dashboard/multi-api-consumption";
import { formatCurrency, formatTokens, MOCK_BILLING_SUMMARY } from "@/data/mock-billing";

export default function ConsumptionPage() {
  const summary = MOCK_BILLING_SUMMARY;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Telemetry &amp; Asynchronous Pipeline
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Pipeline Healthy (0 dropped events)
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Activity size={22} className="text-zinc-400" />
            Multi-API Consumption Deep Dive
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            High-resolution token counters, cache hit optimization ratios, and per-endpoint velocity monitoring.
          </p>
        </div>
      </div>

      {/* Cache Optimization Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-fade-in delay-1">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Metered Volume</span>
            <Layers size={14} className="text-zinc-500" />
          </div>
          <div className="text-xl font-bold font-mono text-zinc-100">
            {formatTokens(summary.totalTokensMetered)}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            {formatTokens(summary.totalInputTokens)} input / {formatTokens(summary.totalOutputTokens)} output
          </p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Prompt Caching Efficiency</span>
            <Database size={14} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatTokens(summary.totalCachedTokens)} cached
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            Avoided est. $6.12 in redundant token spend
          </p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Ingested Events</span>
            <Zap size={14} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-zinc-100">
            {summary.totalRequests.toLocaleString()} reqs
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            Avg latency: 310ms across 8 providers
          </p>
        </Card>
      </div>

      {/* Main Consumption Telemetry Visualizer */}
      <MultiApiConsumption timeframe="30d" />
    </div>
  );
}
