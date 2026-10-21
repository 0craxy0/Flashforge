"use client";

import * as React from "react";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Download,
  HardDrive,
  Network,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Square,
  Terminal,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  source: string;
  message: string;
}

export default function SystemdPage() {
  const [isRunning, setIsRunning] = React.useState<boolean>(true);
  const [isRestarting, setIsRestarting] = React.useState<boolean>(false);
  const [logFilter, setLogFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [logs, setLogs] = React.useState<LogEntry[]>([
    { timestamp: "2026-10-21 22:18:42", level: "INFO", source: "ipc", message: "Accepted connection on /var/run/flashforge.sock from client PID 87838 (Alex Morgan / Next.js)" },
    { timestamp: "2026-10-21 22:18:43", level: "INFO", source: "metering", message: "Ingested completion event: provider=OpenAI model=GPT-6.1 Sol tokens=4,280 cost=$0.0248" },
    { timestamp: "2026-10-21 22:19:02", level: "INFO", source: "metering", message: "Ingested completion event: provider=Anthropic model=Claude Sonnet 5.5 tokens=2,150 cost=$0.0125" },
    { timestamp: "2026-10-21 22:19:15", level: "WARN", source: "quota", message: "Provider OpenAI spend ($14.10) reached 78.3% of soft threshold limit ($18.00)" },
    { timestamp: "2026-10-21 22:19:40", level: "INFO", source: "cache", message: "Prompt cache hit on DeepSeek Flash: 4,100,000 tokens evaluated at discounted rate ($0.04/1M)" },
    { timestamp: "2026-10-21 22:20:01", level: "INFO", source: "cron", message: "Hourly sync with upstream rate cards completed: 8 providers verified (0 changes detected)" },
    { timestamp: "2026-10-21 22:20:12", level: "INFO", source: "systemd", message: "Watchdog heartbeat ping sent to systemd supervisor; status=OK uptime=14d 6h" },
  ]);

  const handleRestart = () => {
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
      setLogs((prev) => [
        {
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          level: "INFO",
          source: "systemd",
          message: "flashforge.service restarted by operator; reload configuration /etc/flashforge/config.env",
        },
        ...prev,
      ]);
    }, 1200);
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter !== "ALL" && log.level !== logFilter) return false;
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Host Runtime &amp; Daemon
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              systemd unit active
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Terminal size={22} className="text-zinc-400" />
            Ubuntu Systemd Daemon Telemetry
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Kernel process supervisor, Unix domain socket telemetry, and live journald streaming.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            disabled={isRestarting}
            className="font-mono text-xs gap-1.5"
          >
            <RotateCcw size={13} className={isRestarting ? "animate-spin" : ""} />
            <span>{isRestarting ? "Restarting..." : "systemctl restart flashforge"}</span>
          </Button>
        </div>
      </div>

      {/* Daemon Status Terminal Card */}
      <Card className="border-zinc-800 bg-zinc-950/90 font-mono text-xs overflow-hidden animate-fade-in delay-1 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-zinc-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-semibold text-zinc-200">systemctl status flashforge.service</span>
          </div>
          <span className="text-zinc-500">Ubuntu 24.04 LTS (kernel 6.8.0-45-generic)</span>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-3 leading-relaxed">
          <div className="text-emerald-400 flex items-center gap-2 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>● flashforge.service - Flashforge High-Performance API Metering Daemon</span>
          </div>

          <div className="text-zinc-300 pl-4 space-y-1 text-[11px]">
            <p>
              <strong className="text-zinc-500">Loaded:</strong> loaded (/etc/systemd/system/flashforge.service; enabled; vendor preset: enabled)
            </p>
            <p>
              <strong className="text-zinc-500">Active:</strong>{" "}
              <span className="text-emerald-400 font-semibold">active (running)</span> since Wed 2026-10-07 14:02:11 UTC; 14 days ago
            </p>
            <p>
              <strong className="text-zinc-500">Docs:</strong> https://github.com/0craxy0/Flashforge
            </p>
            <p>
              <strong className="text-zinc-500">Process User:</strong> flashforge (UID: 998, GID: 998, nologin shell)
            </p>
            <p>
              <strong className="text-zinc-500">Main PID:</strong> 61028 (flashforge-daemon)
            </p>
            <p>
              <strong className="text-zinc-500">Tasks:</strong> 8 (limit: 18884)
            </p>
            <p>
              <strong className="text-zinc-500">Memory:</strong> 28.4M (peak: 34.2M, limit: 512.0M)
            </p>
            <p>
              <strong className="text-zinc-500">CPU:</strong> 18min 42.112s
            </p>
            <p>
              <strong className="text-zinc-500">IPC Socket:</strong> /var/run/flashforge.sock (srw-rw---- 1 flashforge flashforge)
            </p>
            <p>
              <strong className="text-zinc-500">Loopback Listen:</strong> 127.0.0.1:8080 (REST / prometheus telemetry)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Linux FHS Specification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 animate-fade-in delay-2">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <Network size={14} className="text-zinc-300" />
            <span className="font-semibold text-zinc-200">IPC Unix Domain Socket</span>
          </div>
          <p className="font-mono text-[11px] text-zinc-300 bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
            /var/run/flashforge.sock
          </p>
          <p className="text-[11px] text-zinc-500">
            High-throughput local socket connection. 0 HTTP roundtrip overhead for collocated microservices.
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <HardDrive size={14} className="text-zinc-300" />
            <span className="font-semibold text-zinc-200">Configuration File</span>
          </div>
          <p className="font-mono text-[11px] text-zinc-300 bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
            /etc/flashforge/config.env
          </p>
          <p className="text-[11px] text-zinc-500">
            Protected root-owned configuration with read permissions restricted to group <code className="text-zinc-400 font-mono">flashforge</code>.
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <Activity size={14} className="text-zinc-300" />
            <span className="font-semibold text-zinc-200">Systemd Journal Logging</span>
          </div>
          <p className="font-mono text-[11px] text-zinc-300 bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
            journalctl -u flashforge -f
          </p>
          <p className="text-[11px] text-zinc-500">
            Structured standard out captured natively by journald with log rotation and syslog forwarding.
          </p>
        </Card>
      </div>

      {/* Live Journald Logs Stream */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-3">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Terminal size={14} className="text-zinc-400" />
                Live Journald Stream (journalctl -u flashforge)
              </CardTitle>
              <CardDescription className="mt-0.5">
                Real-time daemon events, socket connections, and token ingestion telemetry.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Level Filter */}
              <div className="inline-flex rounded-md border border-zinc-800 bg-zinc-900 p-0.5 text-xs font-mono">
                {(["ALL", "INFO", "WARN", "ERROR"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLogFilter(lvl)}
                    className={`rounded px-2 py-0.5 text-[10px] transition-colors ${
                      logFilter === lvl
                        ? "bg-zinc-800 text-zinc-100 font-medium"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 w-36 sm:w-44 rounded-md border border-zinc-800 bg-zinc-900 pl-7 pr-2.5 text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-900 font-mono text-[11px] bg-black/60 p-2">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-2 hover:bg-zinc-900/40 transition-colors"
              >
                <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
                <span
                  className={`shrink-0 rounded px-1 text-[9px] font-bold ${
                    log.level === "ERROR"
                      ? "bg-rose-500/20 text-rose-400"
                      : log.level === "WARN"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-zinc-500 shrink-0">[{log.source}]</span>
                <span className="text-zinc-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
