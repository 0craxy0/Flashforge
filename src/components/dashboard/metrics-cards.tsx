import * as React from "react";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  Database,
  Gauge,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatTokens,
  MOCK_BILLING_SUMMARY,
} from "@/data/mock-billing";

export function MetricsCards() {
  const summary = MOCK_BILLING_SUMMARY;
  const budgetPercent = Math.round(
    (summary.currentSpend / summary.budgetLimit) * 100
  );
  const budgetHeadroom = summary.budgetLimit - summary.currentSpend;
  const isBudgetWarning = budgetPercent >= summary.softLimitThreshold;

  return (
    <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key billing metrics">
      {/* 1. Total Spend */}
      <Card className="group animate-fade-in delay-1">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium transition-colors group-hover:text-zinc-200">
              Estimated AI Spend
            </span>
            <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800 transition-all duration-300 group-hover:border-zinc-700 group-hover:scale-110">
              <CreditCard size={14} className="text-zinc-400 transition-colors group-hover:text-zinc-100" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono transition-transform duration-200 group-hover:translate-x-0.5">
            {formatCurrency(summary.currentSpend)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1 font-mono text-zinc-400">
              <span className="text-emerald-400 font-medium">8 providers</span>
              <span>metered</span>
            </span>
            <span className="text-zinc-500 font-mono">Period: Oct 1-31</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Tokens Metered */}
      <Card className="group animate-fade-in delay-2">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium transition-colors group-hover:text-zinc-200">
              Tokens Metered
            </span>
            <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800 transition-all duration-300 group-hover:border-zinc-700 group-hover:scale-110">
              <Activity size={14} className="text-zinc-400 transition-colors group-hover:text-emerald-400" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono transition-transform duration-200 group-hover:translate-x-0.5">
            {formatTokens(summary.totalTokensMetered)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">
              <span className="text-zinc-200">{formatTokens(summary.totalInputTokens)}</span> in /{" "}
              <span className="text-zinc-200">{formatTokens(summary.totalOutputTokens)}</span> out
            </span>
            <span className="text-emerald-400 flex items-center gap-0.5 transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowUpRight size={12} />
              +14.2%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Cache Optimization & Requests */}
      <Card className="group animate-fade-in delay-3">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium transition-colors group-hover:text-zinc-200">
              Prompt Cache Hits
            </span>
            <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800 transition-all duration-300 group-hover:border-zinc-700 group-hover:scale-110">
              <Database size={14} className="text-zinc-400 transition-colors group-hover:text-cyan-400" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono transition-transform duration-200 group-hover:translate-x-0.5">
            {formatTokens(summary.totalCachedTokens)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="font-mono text-zinc-400">
              {Math.round((summary.totalCachedTokens / summary.totalInputTokens) * 100)}% cache savings
            </span>
            <span className="text-zinc-500 font-mono">
              {summary.totalRequests.toLocaleString()} reqs
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Budget & Threshold */}
      <Card className="group animate-fade-in delay-4">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium transition-colors group-hover:text-zinc-200">
              Budget Threshold
            </span>
            <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800 transition-all duration-300 group-hover:border-zinc-700 group-hover:scale-110">
              <Gauge
                size={14}
                className={`transition-colors duration-200 ${
                  isBudgetWarning ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-100"
                }`}
              />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold tracking-tight text-zinc-100 font-mono transition-transform duration-200 group-hover:translate-x-0.5">
              {formatCurrency(summary.budgetLimit)}
            </span>
            <Badge variant={isBudgetWarning ? "warning" : "success"}>
              {budgetPercent}% used
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">
              Headroom: <span className="text-zinc-200">{formatCurrency(budgetHeadroom)}</span>
            </span>
            <span className={isBudgetWarning ? "text-amber-400 animate-pulse" : "text-emerald-400"}>
              {isBudgetWarning ? "Soft limit alert" : "Within quota"}
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
