"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  Boxes,
  ChevronDown,
  CircleHelp,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Settings2,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "consumption", label: "Multi-API Metering", icon: Activity },
    { id: "api-keys", label: "API Secrets", icon: KeyRound },
    { id: "providers", label: "Rate Cards", icon: Boxes },
    { id: "billing", label: "Invoices & Quotas", icon: CreditCard },
  ];

  const orgItems = [
    { id: "systemd", label: "Systemd Daemon", icon: Terminal },
    { id: "members", label: "Access Control", icon: Users },
    { id: "settings", label: "Settings", icon: Settings2 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-black p-4 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-2 py-1 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-sm">
              <Zap size={14} className="text-zinc-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                flashforge
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">v0.1.0-lts</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            active
          </span>
        </div>

        {/* Workspace Switcher */}
        <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-950/80 p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded bg-zinc-800 text-[11px] font-bold text-zinc-200">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-200">
                  Acme Autonomous
                </p>
                <p className="truncate text-[10px] text-zinc-500 font-mono">
                  unix:/var/run/flashforge.sock
                </p>
              </div>
            </div>
            <ChevronDown size={13} className="text-zinc-500 shrink-0" />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div>
            <p className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
              Telemetry &amp; Billing
            </p>
            <nav className="space-y-1" aria-label="Telemetry">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      onMobileClose();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-900 text-zinc-100 border border-zinc-800/80"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-zinc-100" : "text-zinc-500"} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
              Host Environment
            </p>
            <nav className="space-y-1" aria-label="Host">
              {orgItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      onMobileClose();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-900 text-zinc-100 border border-zinc-800/80"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-zinc-100" : "text-zinc-500"} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with Plan Upgrade Card - high value sparkle usage */}
        <div className="mt-auto pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-1">
              <span>Cluster Tier</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                PRO HOST
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal mb-2.5">
              High-throughput asynchronous metering pipeline active across 8 providers.
            </p>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              <Sparkles size={12} className="text-zinc-900" />
              <span>Modify Quotas</span>
              <ArrowRight size={11} className="text-zinc-900 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-2 text-[11px] text-zinc-500">
            <a
              href="https://github.com/0craxy0/Flashforge"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <LifeBuoy size={12} />
              <span>Support</span>
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href="#docs"
              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <CircleHelp size={12} />
              <span>Docs</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
