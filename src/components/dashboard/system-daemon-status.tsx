import * as React from "react";
import { Check, Cpu, HardDrive, Network, Terminal } from "lucide-react";

export function SystemDaemonStatus() {
  return (
    <footer className="mt-8 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5 backdrop-blur-sm text-xs font-mono text-zinc-400">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-200 font-semibold">flashforge.service</span>
            <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-800">
              systemd unit
            </span>
          </div>

          <span className="text-zinc-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 text-[11px]">
            <Network size={12} className="text-zinc-500" />
            <span>ipc: /var/run/flashforge.sock</span>
          </div>

          <span className="text-zinc-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 text-[11px]">
            <Terminal size={12} className="text-zinc-500" />
            <span>env: /etc/flashforge/config.env</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Cpu size={12} />
            0.4% CPU
          </span>
          <span className="flex items-center gap-1">
            <HardDrive size={12} />
            28.4 MB RAM
          </span>
          <span className="text-zinc-400">Ubuntu 24.04 LTS (x86_64)</span>
        </div>
      </div>
    </footer>
  );
}
