import * as React from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  calculateModelCost,
  formatCurrency,
  formatTokens,
  MOCK_MODELS,
} from "@/data/mock-billing";

export function ApiMeteringTable() {
  return (
    <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-3">
      <CardHeader className="border-b border-zinc-800/80 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-100">
              Provider Rate Cards &amp; Invoiced Unit Cost
            </CardTitle>
            <CardDescription className="mt-1">
              Deterministic calculations based on input tokens, cached reads, and completion tokens.
            </CardDescription>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Formula: (Input × Rate + Output × Rate) ÷ 1,000,000
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs" aria-label="API Model Billing Table">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400">
                <th scope="col" className="px-4 py-3 font-medium">Provider &amp; Model</th>
                <th scope="col" className="px-4 py-3 font-medium">Endpoint Route</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Input Tokens</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Cached Read</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Output Tokens</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Rates / 1M (In/Out)</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Est. Spend</th>
                <th scope="col" className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {MOCK_MODELS.map((model) => {
                const cost = calculateModelCost(model);
                const hasWarning = cost >= model.costThreshold * 0.8;

                return (
                  <tr
                    key={model.id}
                    className="group transition-all duration-150 hover:bg-zinc-900/60 cursor-default"
                  >
                    {/* Provider & Model */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-100 transition-colors group-hover:text-white">
                          {model.provider}
                        </span>
                        <a
                          href={model.documentationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-zinc-200 transition-all duration-150 hover:scale-125"
                          title={`View ${model.provider} pricing`}
                        >
                          <ExternalLink size={11} />
                        </a>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {model.model}
                      </div>
                    </td>

                    {/* Endpoint Route */}
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300 border border-zinc-800 transition-colors group-hover:border-zinc-700">
                        /{model.endpoint}
                      </span>
                      <div className="mt-1 text-[10px] text-zinc-500 font-mono">
                        p95: {model.latencyP95Ms}ms · {model.lastActive}
                      </div>
                    </td>

                    {/* Input Tokens */}
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-200 transition-colors group-hover:text-white">
                      {formatTokens(model.inputTokens)}
                    </td>

                    {/* Cached Tokens */}
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-400">
                      {formatTokens(model.cachedTokens)}
                    </td>

                    {/* Output Tokens */}
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-200 transition-colors group-hover:text-white">
                      {formatTokens(model.outputTokens)}
                    </td>

                    {/* Rates */}
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-300 text-[11px]">
                      ${model.inputRatePer1M.toFixed(2)} / ${model.outputRatePer1M.toFixed(2)}
                    </td>

                    {/* Estimated Spend */}
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-zinc-100 transition-transform duration-150 group-hover:translate-x-0.5">
                      {formatCurrency(cost)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <Badge
                        variant={hasWarning ? "warning" : "success"}
                        className={`text-[10px] ${hasWarning ? "animate-pulse" : ""}`}
                      >
                        {hasWarning ? "WARN" : "ACTIVE"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footnote and rate verification details */}
        <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-4 text-[11px] text-zinc-500 space-y-1.5">
          <p className="flex items-center gap-1.5 text-zinc-400">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>
              Rates verified against public provider rate cards (October 2026). Ingested via local systemd unit.
            </span>
          </p>
          <p>
            Note: Token counts exclude batch volume discounts and dynamic cache hits under 1,024 context tokens. Threshold alarms trigger at 80% of configured provider ceilings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
