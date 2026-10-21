"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/consumption", label: "Multi-API Metering", icon: Activity },
    { href: "/api-keys", label: "API Secrets", icon: KeyRound },
    { href: "/providers", label: "Rate Cards", icon: Boxes },
    { href: "/billing", label: "Invoices & Quotas", icon: CreditCard },
  ];

  const orgItems = [
    { href: "/systemd", label: "Systemd Daemon", icon: Terminal },
    { href: "/members", label: "Access Control", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings2 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 animate-fade-in"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-black p-4 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-2 py-1 mb-4">
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="grid h-7 w-7 place-items-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Zap size={14} className="text-zinc-100 transition-colors group-hover:text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                flashforge
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">v0.1.0-lts</span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            active
          </span>
        </div>

        {/* Workspace Switcher */}
        <Link
          href="/settings"
          onClick={onMobileClose}
          className="mb-6 block rounded-lg border border-zinc-800 bg-zinc-950/80 p-2.5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded bg-zinc-800 text-[11px] font-bold text-zinc-200 transition-colors hover:bg-zinc-700">
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
            <ChevronDown size={13} className="text-zinc-500 shrink-0 transition-transform duration-200 hover:translate-y-0.5" />
          </div>
        </Link>

        {/* Navigation list */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div>
            <p className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
              Telemetry &amp; Billing
            </p>
            <nav className="space-y-1" aria-label="Telemetry">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-zinc-900 text-zinc-100 border border-zinc-800/80 shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 hover:translate-x-1"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "text-zinc-100"
                          : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                    <span className="transition-transform duration-200">
                      {item.label}
                    </span>
                  </Link>
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
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-zinc-900 text-zinc-100 border border-zinc-800/80 shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 hover:translate-x-1"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "text-zinc-100"
                          : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                    <span className="transition-transform duration-200">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with Plan Upgrade Card */}
        <div className="mt-auto pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="group rounded-lg border border-zinc-800 bg-zinc-950/90 p-3 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-1">
              <span>Cluster Tier</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400 transition-colors group-hover:bg-zinc-700">
                PRO HOST
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal mb-2.5">
              High-throughput asynchronous metering pipeline active across 8 providers.
            </p>
            <Link
              href="/billing"
              onClick={onMobileClose}
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1.5 text-xs font-semibold text-zinc-950 transition-all duration-200 hover:bg-white active:scale-[0.97] hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]"
            >
              <Sparkles size={12} className="text-zinc-900 transition-transform duration-300 group-hover:rotate-12" />
              <span>Modify Quotas</span>
              <ArrowRight size={11} className="text-zinc-900 ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between px-2 text-[11px] text-zinc-500">
            <Link
              href="/docs"
              onClick={onMobileClose}
              className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors duration-150"
            >
              <CircleHelp size={12} />
              <span>Docs</span>
            </Link>
            <span className="text-zinc-700">·</span>
            <a
              href="https://github.com/0craxy0/Flashforge"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors duration-150"
            >
              <LifeBuoy size={12} />
              <span>Support</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
