"use client";

import * as React from "react";
import {
  Bell,
  CheckCircle2,
  HardDrive,
  Network,
  Save,
  Server,
  Settings2,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = React.useState<string>("Acme Autonomous");
  const [workspaceDomain, setWorkspaceDomain] = React.useState<string>("acme.flashforge.dev");
  const [unixSocket, setUnixSocket] = React.useState<string>("/var/run/flashforge.sock");
  const [httpBind, setHttpBind] = React.useState<string>("127.0.0.1:8080");
  const [slackWebhook, setSlackWebhook] = React.useState<string>("https://hooks.slack.com/services/T00/B00/XXXXXX");
  const [retentionDays, setRetentionDays] = React.useState<number>(90);
  const [saved, setSaved] = React.useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Cluster Configuration
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 size={12} />
              Host Synced
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Settings2 size={22} className="text-zinc-400" />
            Cluster &amp; Daemon Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure systemd socket endpoints, alarm notification webhooks, and raw telemetry retention rules.
          </p>
        </div>

        <Button onClick={handleSave} className="gap-2 font-semibold">
          <Save size={14} />
          <span>{saved ? "Settings Saved" : "Save Changes"}</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Identity */}
        <Card className="p-5 space-y-4 animate-fade-in delay-1">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-100">
              Workspace &amp; Organization Identity
            </CardTitle>
            <CardDescription className="mt-0.5">
              Friendly organization metadata displayed in headers and monthly invoices.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Routing Domain</label>
              <input
                type="text"
                value={workspaceDomain}
                onChange={(e) => setWorkspaceDomain(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>
        </Card>

        {/* Linux Daemon Endpoints */}
        <Card className="p-5 space-y-4 animate-fade-in delay-2">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Terminal size={15} className="text-zinc-400" />
              Ubuntu Systemd Daemon Ingestion Sockets
            </CardTitle>
            <CardDescription className="mt-0.5">
              Local IPC interfaces managed under <code className="font-mono text-zinc-300">/etc/flashforge/config.env</code>.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Network size={12} className="text-zinc-500" />
                <span>Unix Domain Socket (Recommended)</span>
              </label>
              <input
                type="text"
                value={unixSocket}
                onChange={(e) => setUnixSocket(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Server size={12} className="text-zinc-500" />
                <span>HTTP Loopback Interface</span>
              </label>
              <input
                type="text"
                value={httpBind}
                onChange={(e) => setHttpBind(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>
        </Card>

        {/* Alert Webhooks */}
        <Card className="p-5 space-y-4 animate-fade-in delay-3">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Bell size={15} className="text-zinc-400" />
              Budget &amp; Anomaly Webhook Integrations
            </CardTitle>
            <CardDescription className="mt-0.5">
              Dispatches alerts when token velocity exceeds 80% soft limits or anomaly spikes are flagged.
            </CardDescription>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Slack / Discord Alert Webhook URL</label>
            <input
              type="url"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
        </Card>

        {/* Retention Policy */}
        <Card className="p-5 space-y-4 animate-fade-in delay-4">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <HardDrive size={15} className="text-zinc-400" />
              Telemetry Data Retention
            </CardTitle>
            <CardDescription className="mt-0.5">
              Configure how long raw prompt token records are preserved in local SQLite/DuckDB storage.
            </CardDescription>
          </div>

          <div className="space-y-1.5 max-w-xs">
            <label className="text-xs font-medium text-zinc-300">Retention Horizon (Days)</label>
            <input
              type="number"
              min="14"
              max="365"
              step="30"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
        </Card>

        {/* Danger Zone */}
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/10 p-5 space-y-3 animate-fade-in delay-5">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <ShieldAlert size={16} />
            <span>Danger Zone</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Flushing the local cache will invalidate cached rate cards and force an immediate re-sync with upstream provider endpoints.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => alert("Cache purged. Re-syncing provider rate cards.")}
            className="font-mono text-xs"
          >
            Flush Cached Rate Cards
          </Button>
        </div>
      </form>
    </div>
  );
}
