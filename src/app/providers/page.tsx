"use client";

import * as React from "react";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ExternalLink,
  Filter,
  Layers,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTokens, MOCK_MODELS } from "@/data/mock-billing";

export default function ProvidersPage() {
  const [search, setSearch] = React.useState<string>("");
  const [selectedProvider, setSelectedProvider] = React.useState<string>("All");

  const providerDetails = [
    { name: "OpenAI", status: "Operational", modelsCount: 14, latencyAvg: "480ms", cacheSupport: true },
    { name: "Anthropic", status: "Operational", modelsCount: 8, latencyAvg: "510ms", cacheSupport: true },
    { name: "Google", status: "Operational", modelsCount: 12, latencyAvg: "240ms", cacheSupport: true },
    { name: "DeepSeek", status: "Operational", modelsCount: 6, latencyAvg: "310ms", cacheSupport: true },
    { name: "xAI", status: "Operational", modelsCount: 4, latencyAvg: "590ms", cacheSupport: false },
    { name: "Mistral", status: "Operational", modelsCount: 9, latencyAvg: "440ms", cacheSupport: true },
    { name: "Groq", status: "Operational", modelsCount: 11, latencyAvg: "95ms", cacheSupport: true },
    { name: "Perplexity", status: "Operational", modelsCount: 5, latencyAvg: "720ms", cacheSupport: false },
  ];

  const filteredModels = MOCK_MODELS.filter((m) => {
    if (selectedProvider !== "All" && m.provider !== selectedProvider) return false;
    if (search && !m.model.toLowerCase().includes(search.toLowerCase()) && !m.provider.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Rate Cards &amp; Pricing Directory
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 size={12} />
              Rates Verified Oct 21, 2026
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Boxes size={22} className="text-zinc-400" />
            AI Provider Rate Cards &amp; Pricing Registry
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Public rate cards for 8 AI providers with input, prompt caching, and output unit pricing per 1M tokens.
          </p>
        </div>
      </div>

      {/* Provider Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in delay-1">
        {providerDetails.map((p) => (
          <div
            key={p.name}
            onClick={() => setSelectedProvider(selectedProvider === p.name ? "All" : p.name)}
            className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 active:scale-95 ${
              selectedProvider === p.name
                ? "border-zinc-500 bg-zinc-900 text-white shadow-md scale-[1.02]"
                : "border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>{p.name}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between font-mono text-[11px] text-zinc-400">
              <span>{p.latencyAvg}</span>
              <span className="text-[10px] text-zinc-500">{p.modelsCount} models</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Directory Table */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-2">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Layers size={15} className="text-zinc-400" />
                Standard API Pricing Directory
              </CardTitle>
              <CardDescription className="mt-0.5">
                Standard token rates in USD per 1,000,000 tokens.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search model or provider..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-48 sm:w-60 rounded-md border border-zinc-800 bg-zinc-900 pl-7 pr-2.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs" aria-label="Provider rate cards">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400">
                  <th scope="col" className="px-4 py-3 font-medium">Provider &amp; Model</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Input Rate / 1M</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Cached Read / 1M</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Output Rate / 1M</th>
                  <th scope="col" className="px-4 py-3 font-medium">Rate Description</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {filteredModels.map((m) => (
                  <tr
                    key={m.id}
                    className="group transition-colors hover:bg-zinc-900/40"
                  >
                    <td className="px-4 py-3.5 font-sans">
                      <div className="font-semibold text-zinc-200">{m.provider}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{m.model}</div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold text-zinc-100">
                      ${m.inputRatePer1M.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 text-right text-emerald-400 font-semibold">
                      ${m.cachedInputRatePer1M.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold text-zinc-100">
                      ${m.outputRatePer1M.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 text-zinc-400 font-sans text-xs">
                      {m.rateNote}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={m.documentationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                      >
                        <span>Rate Card</span>
                        <ExternalLink size={10} />
                      </a>
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
