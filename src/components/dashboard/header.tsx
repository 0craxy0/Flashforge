"use client";

import * as React from "react";
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
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export function Header({
  onMobileMenuToggle,
  selectedRange,
  onRangeChange,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const ranges = [
    { id: "24h", label: "Last 24 Hours" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "billing", label: "Billing Cycle (Oct 2026)" },
  ];

  const currentLabel =
    ranges.find((r) => r.id === selectedRange)?.label || "Last 30 Days";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-black/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden text-zinc-400 hover:text-zinc-100"
          aria-label="Open sidebar menu"
        >
          <Menu size={18} />
        </Button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">flashforge</span>
          <span className="text-zinc-700">/</span>
          <span className="font-mono text-zinc-400">systemd:active</span>
          <span className="text-zinc-700">/</span>
          <span className="font-semibold text-zinc-100">Billing Telemetry</span>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Daemon Status indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
          <Server size={12} className="text-emerald-400" />
          <span>127.0.0.1:8080</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={10} />
            OK
          </span>
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-8 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
          >
            <Calendar size={13} className="text-zinc-400" />
            <span className="hidden sm:inline">{currentLabel}</span>
            <span className="sm:hidden">{selectedRange.toUpperCase()}</span>
            <ChevronDown size={12} className="text-zinc-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-md border border-zinc-800 bg-zinc-950 p-1 shadow-xl z-50">
              {ranges.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => {
                    onRangeChange(range.id);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center px-2.5 py-1.5 text-xs rounded transition-colors ${
                    selectedRange === range.id
                      ? "bg-zinc-800 text-zinc-100 font-medium"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-zinc-400 hover:text-zinc-100"
          aria-label="View system alerts"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
        </Button>

        {/* User profile avatar / system identifier */}
        <div
          className="grid h-7 w-7 place-items-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-mono font-medium text-zinc-200"
          title="Running as system user: flashforge"
        >
          ff
        </div>
      </div>
    </header>
  );
}
