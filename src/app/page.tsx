"use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { MultiApiConsumption } from "@/components/dashboard/multi-api-consumption";
import { ApiMeteringTable } from "@/components/dashboard/api-metering-table";
import { SystemDaemonStatus } from "@/components/dashboard/system-daemon-status";
import { Sparkles, Terminal } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<string>("overview");
  const [selectedRange, setSelectedRange] = React.useState<string>("30d");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-black text-zinc-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />

        <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Page Heading */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Tuesday, October 21, 2026
                </span>
                <span className="text-zinc-700">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
              <a
                href="#systemd"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-900 transition-colors"
              >
                <Terminal size={12} className="text-zinc-400" />
                <span>systemctl status flashforge</span>
              </a>
            </div>
          </div>

          {/* Top KPI Metrics Cards */}
          <MetricsCards />

          {/* Primary Multi-API Consumption Telemetry & Quota Visualization */}
          <section id="consumption" aria-label="Multi-API Consumption Visualizer">
            <MultiApiConsumption timeframe={selectedRange} />
          </section>

          {/* In-depth API Model Metering & Rate Cards Table */}
          <section id="providers" aria-label="Provider Pricing and Estimated Cost">
            <ApiMeteringTable />
          </section>

          {/* Ubuntu Systemd Daemon Host Status */}
          <SystemDaemonStatus />
        </main>
      </div>
    </div>
  );
}
