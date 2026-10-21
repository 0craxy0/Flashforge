import * as React from "react";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  Database,
  Gauge,
  KeyRound,
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
      <Card className="hover:border-zinc-700/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Estimated AI Spend</span>
            <CreditCard size={15} className="text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono">
            {formatCurrency(summary.currentSpend)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1 font-mono text-zinc-400">
              <span className="text-emerald-400 font-medium">8 providers</span>
              <span>metered</span>
            </span>
            <span className="text-zinc-500">Period: Oct 1-31</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Tokens Metered */}
      <Card className="hover:border-zinc-700/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Tokens Metered</span>
            <Activity size={15} className="text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono">
            {formatTokens(summary.totalTokensMetered)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">
              <span className="text-zinc-200">{formatTokens(summary.totalInputTokens)}</span> in /{" "}
              <span className="text-zinc-200">{formatTokens(summary.totalOutputTokens)}</span> out
            </span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight size={12} />
              +14.2%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Cache Optimization & Requests */}
      <Card className="hover:border-zinc-700/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Prompt Cache Hits</span>
            <Database size={15} className="text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono">
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
      <Card className="hover:border-zinc-700/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Budget Threshold</span>
            <Gauge size={15} className={isBudgetWarning ? "text-amber-400" : "text-zinc-500"} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold tracking-tight text-zinc-100 font-mono">
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
            <span className={isBudgetWarning ? "text-amber-400" : "text-emerald-400"}>
              {isBudgetWarning ? "Soft limit alert" : "Within quota"}
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
