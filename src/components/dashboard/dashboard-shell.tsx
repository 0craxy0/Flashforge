"use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [selectedRange, setSelectedRange] = React.useState<string>("30d");

  return (
    <div className="flex min-h-screen bg-black text-zinc-100">
      {/* Sidebar Navigation */}
      <Sidebar
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
          {children}
        </main>
      </div>
    </div>
  );
}
