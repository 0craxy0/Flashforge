"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Gauge,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTokens } from "@/data/mock-billing";

interface InvoiceItem {
  id: string;
  number: string;
  period: string;
  providers: string;
  tokensTotal: number;
  amount: number;
  status: "paid" | "processing" | "scheduled";
  dueDate: string;
}

export default function BillingPage() {
  const [budgetLimit, setBudgetLimit] = React.useState<number>(45.0);
  const [softThresholdPercent, setSoftThresholdPercent] = React.useState<number>(80);
  const [savedSuccess, setSavedSuccess] = React.useState<boolean>(false);

  const currentSpend = 23.48;
  const currentTokens = 24_680_000;
  const percentUsed = Math.round((currentSpend / budgetLimit) * 100);

  const invoices: InvoiceItem[] = [
    {
      id: "inv-1",
      number: "INV-2026-09",
      period: "Sep 01 – Sep 30, 2026",
      providers: "OpenAI, Anthropic, Google, DeepSeek",
      tokensTotal: 34_820_000,
      amount: 32.4,
      status: "paid",
      dueDate: "Oct 05, 2026",
    },
    {
      id: "inv-2",
      number: "INV-2026-08",
      period: "Aug 01 – Aug 31, 2026",
      providers: "OpenAI, Anthropic, Mistral",
      tokensTotal: 29_150_000,
      amount: 28.15,
      status: "paid",
      dueDate: "Sep 05, 2026",
    },
    {
      id: "inv-3",
      number: "INV-2026-07",
      period: "Jul 01 – Jul 31, 2026",
      providers: "OpenAI, Anthropic",
      tokensTotal: 18_900_000,
      amount: 19.5,
      status: "paid",
      dueDate: "Aug 05, 2026",
    },
  ];

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Finance &amp; Metering Quotas
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 size={12} />
              Current Cycle Active
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <CreditCard size={22} className="text-zinc-400" />
            Invoices, Spend Limits &amp; Quotas
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage hard budget cutoffs, soft threshold alerting webhooks, and consolidated multi-API invoices.
          </p>
        </div>

        {/* Plan Upgrade button with permitted Sparkles affordance */}
        <Button className="gap-2 font-semibold shadow-sm">
          <Sparkles size={13} className="text-zinc-950" />
          <span>Upgrade Cluster Quota Tier</span>
        </Button>
      </div>

      {/* Current Cycle Summary & Budget Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in delay-1">
        {/* Current Cycle Spend */}
        <Card className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100">
                Current Billing Period: October 2026
              </CardTitle>
              <CardDescription className="mt-0.5">
                Cycle: Oct 01 – Oct 31, 2026 · Estimated monthly invoice based on current run-rate
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              Cycle Day 21 / 31
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <span className="text-[11px] text-zinc-400 font-medium">Accrued Invoiced Spend</span>
              <div className="mt-1 text-2xl font-bold font-mono text-zinc-100">
                {formatCurrency(currentSpend)}
              </div>
              <span className="mt-1 inline-block text-[10px] text-zinc-500 font-mono">
                {percentUsed}% of ${budgetLimit.toFixed(2)} limit
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <span className="text-[11px] text-zinc-400 font-medium">Metered Tokens</span>
              <div className="mt-1 text-2xl font-bold font-mono text-zinc-100">
                {formatTokens(currentTokens)}
              </div>
              <span className="mt-1 inline-block text-[10px] text-emerald-400 font-mono">
                +14.2% vs previous month
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <span className="text-[11px] text-zinc-400 font-medium">Projected EOM Spend</span>
              <div className="mt-1 text-2xl font-bold font-mono text-zinc-100">
                $38.65
              </div>
              <span className="mt-1 inline-block text-[10px] text-zinc-500 font-mono">
                Forecasted headroom: $6.35
              </span>
            </div>
          </div>

          {/* Progress to Budget */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Budget Consumption</span>
              <span className="text-zinc-200">
                {formatCurrency(currentSpend)} / {formatCurrency(budgetLimit)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800 shimmer-track">
              <div
                className="h-full rounded-full bg-zinc-200 transition-all duration-700 ease-out"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Spend Quota Controls */}
        <Card className="p-5 space-y-4">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Gauge size={15} className="text-zinc-400" />
              Budget Threshold Sentinel
            </CardTitle>
            <CardDescription className="mt-0.5">
              Set hard stop and soft alert limits.
            </CardDescription>
          </div>

          <form onSubmit={handleSaveBudget} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Hard Monthly Limit ($ USD)</label>
              <input
                type="number"
                min="10"
                max="1000"
                step="5"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Soft Alert Threshold (%)</label>
              <input
                type="number"
                min="50"
                max="95"
                step="5"
                value={softThresholdPercent}
                onChange={(e) => setSoftThresholdPercent(Number(e.target.value))}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <Button type="submit" className="w-full">
              {savedSuccess ? "Quotas Saved!" : "Update Thresholds"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Historical Invoices */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-2">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <FileText size={15} className="text-zinc-400" />
                Historical Statements &amp; Invoices
              </CardTitle>
              <CardDescription className="mt-0.5">
                Past monthly billing summaries across all connected upstream AI providers.
              </CardDescription>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Tax Invoices (USD)
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs" aria-label="Invoices Table">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400">
                  <th scope="col" className="px-4 py-3 font-medium">Invoice Number</th>
                  <th scope="col" className="px-4 py-3 font-medium">Period</th>
                  <th scope="col" className="px-4 py-3 font-medium">Providers Metered</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Tokens</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Amount (USD)</th>
                  <th scope="col" className="px-4 py-3 font-medium text-center">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="group transition-colors hover:bg-zinc-900/40"
                  >
                    <td className="px-4 py-3.5 font-mono font-semibold text-zinc-200">
                      {inv.number}
                    </td>

                    <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                      {inv.period}
                    </td>

                    <td className="px-4 py-3.5 text-zinc-300">
                      {inv.providers}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono text-zinc-200">
                      {formatTokens(inv.tokensTotal)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-zinc-100">
                      {formatCurrency(inv.amount)}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <Badge variant="success" className="text-[10px]">
                        {inv.status.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Downloading PDF for ${inv.number}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors p-1"
                        title="Download PDF Invoice"
                      >
                        <Download size={12} />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
