"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Menu,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

export function Header({
  onMobileMenuToggle,
  selectedRange = "30d",
  onRangeChange,
}: HeaderProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const pageTitles: Record<string, string> = {
    "/": "Overview",
    "/consumption": "Multi-API Metering",
    "/api-keys": "API Secrets",
    "/providers": "Rate Cards",
    "/billing": "Invoices & Quotas",
    "/systemd": "Systemd Daemon",
    "/members": "Access Control",
    "/settings": "Settings",
    "/docs": "Documentation",
  };

  const currentTitle = pageTitles[pathname] || "Billing Telemetry";

  const ranges = [
    { id: "24h", label: "Last 24 Hours" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "billing", label: "Billing Cycle (Oct 2026)" },
  ];

  const currentLabel =
    ranges.find((r) => r.id === selectedRange)?.label || "Last 30 Days";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-black/85 px-4 sm:px-6 backdrop-blur-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden text-zinc-400 hover:text-zinc-100 transition-transform active:scale-95"
          aria-label="Open sidebar menu"
        >
          <Menu size={18} />
        </Button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            flashforge
          </Link>
          <span className="text-zinc-700">/</span>
          <Link href="/systemd" className="font-mono text-zinc-400 hover:text-zinc-200 transition-colors">
            systemd:active
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="font-semibold text-zinc-100">{currentTitle}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Daemon Status indicator */}
        <Link
          href="/systemd"
          className="hidden sm:flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] font-mono text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          <Server size={12} className="text-emerald-400" />
          <span>127.0.0.1:8080</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            ONLINE
          </span>
        </Link>

        {/* Date Range Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-8 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
          >
            <Calendar size={13} className="text-zinc-400" />
            <span className="hidden sm:inline">{currentLabel}</span>
            <span className="sm:hidden">{selectedRange.toUpperCase()}</span>
            <ChevronDown
              size={12}
              className={`text-zinc-500 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-md border border-zinc-800 bg-zinc-950/95 backdrop-blur-md p-1 shadow-2xl z-50 animate-fade-in-down">
              {ranges.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => {
                    onRangeChange?.(range.id);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center px-2.5 py-1.5 text-xs rounded transition-all duration-150 ${
                    selectedRange === range.id
                      ? "bg-zinc-800 text-zinc-100 font-medium translate-x-0.5"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 hover:translate-x-0.5"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <Link
          href="/systemd"
          className="relative grid h-8 w-8 place-items-center rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-all duration-150 active:scale-95"
          aria-label="View system alerts"
        >
          <Bell size={15} className="transition-transform duration-200 hover:rotate-12" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
        </Link>

        {/* User profile avatar / system identifier */}
        <Link
          href="/settings"
          className="grid h-7 w-7 place-items-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-mono font-medium text-zinc-200 transition-all duration-200 hover:scale-105 hover:border-zinc-500 cursor-pointer shadow-sm"
          title="Running as system user: flashforge"
        >
          ff
        </Link>
      </div>
    </header>
  );
}
