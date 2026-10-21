"use client";

import * as React from "react";
import Link from "next/link";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { MultiApiConsumption } from "@/components/dashboard/multi-api-consumption";
import { ApiMeteringTable } from "@/components/dashboard/api-metering-table";
import { SystemDaemonStatus } from "@/components/dashboard/system-daemon-status";
import { Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Tuesday, October 21, 2026
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Telemetry Synced
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">
            AI Billing &amp; Metering Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Multi-API token consumption analytics, rate verification, and proactive cost threshold sentinel.
          </p>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          <Link
            href="/systemd"
            className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 active:scale-95 transition-all duration-200"
          >
            <Terminal size={12} className="text-zinc-400 transition-colors group-hover:text-emerald-400" />
            <span className="transition-transform group-hover:translate-x-0.5">systemctl status flashforge</span>
          </Link>
        </div>
      </div>

      {/* Top KPI Metrics Cards */}
      <MetricsCards />

      {/* Primary Multi-API Consumption Telemetry & Quota Visualization */}
      <section id="consumption" aria-label="Multi-API Consumption Visualizer">
        <MultiApiConsumption timeframe="30d" />
      </section>

      {/* In-depth API Model Metering & Rate Cards Table */}
      <section id="providers" aria-label="Provider Pricing and Estimated Cost">
        <ApiMeteringTable />
      </section>

      {/* Ubuntu Systemd Daemon Host Status */}
      <SystemDaemonStatus />
    </div>
  );
}
