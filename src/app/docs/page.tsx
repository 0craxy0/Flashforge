"use client";

import * as React from "react";
import {
  BookOpen,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Layers,
  Server,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeSnippets = {
    installUbuntu: `# 1. Create dedicated system user
sudo useradd -r -s /bin/false flashforge

# 2. Provision standard Linux FHS directory structure
sudo mkdir -p /etc/flashforge /var/log/flashforge /opt/flashforge/bin
sudo chown -R flashforge:flashforge /etc/flashforge /var/log/flashforge /opt/flashforge

# 3. Deploy systemd unit
sudo systemctl daemon-reload
sudo systemctl enable --now flashforge.service`,

    ingestPayload: `curl --unix-socket /var/run/flashforge.sock http://localhost/v1/telemetry/ingest \\
  -H "Content-Type: application/json" \\
  -H "X-Flashforge-Key: ff_live_9a7fe91b0c82410a8d293fa8" \\
  -d '{
    "provider": "OpenAI",
    "model": "GPT-6.1 Sol",
    "input_tokens": 4200,
    "cached_tokens": 1200,
    "output_tokens": 850,
    "latency_ms": 482,
    "timestamp": "2026-10-21T22:18:43Z"
  }'`,

    configEnv: `# /etc/flashforge/config.env
FLASHFORGE_LISTEN=127.0.0.1:8080
FLASHFORGE_UNIX_SOCKET=/var/run/flashforge.sock
FLASHFORGE_LOG_LEVEL=info
FLASHFORGE_BUDGET_LIMIT=45.00
FLASHFORGE_SOFT_LIMIT_PERCENT=80
FLASHFORGE_RETENTION_DAYS=90`,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Engineering Guidelines
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <BookOpen size={12} />
              v0.1.0-LTS Docs
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <BookOpen size={22} className="text-zinc-400" />
            Flashforge System Documentation
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Architecture, Ubuntu systemd deployment directives, socket ingestion protocols, and pricing formulas.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 animate-fade-in delay-1">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <Server size={14} className="text-zinc-400" />
            <span>Zero-Overhead Daemon</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Compiled binary running under dedicated user <code className="font-mono text-zinc-300">flashforge</code> listening on Unix domain sockets.
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <Zap size={14} className="text-amber-400" />
            <span>Deterministic Metering</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Evaluates prompt caching discounts, output generation rates, and triggers proactive quota sentinel alarms.
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <Shield size={14} className="text-emerald-400" />
            <span>Strict FHS Conformance</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Adheres strictly to Ubuntu FHS conventions (<code className="font-mono text-zinc-300">/etc/flashforge</code>, <code className="font-mono text-zinc-300">/var/run</code>, journald).
          </p>
        </Card>
      </div>

      {/* Installation Guide */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-2">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Terminal size={15} className="text-zinc-400" />
                1. Ubuntu LTS Deployment (22.04 / 24.04)
              </CardTitle>
              <CardDescription className="mt-0.5">
                Idempotent service installation and non-root execution setup.
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("install", codeSnippets.installUbuntu)}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors p-1"
            >
              {copiedCode === "install" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCode === "install" ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <pre className="p-4 font-mono text-xs text-zinc-300 bg-black/80 overflow-x-auto leading-relaxed">
            <code>{codeSnippets.installUbuntu}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Socket Ingestion Payload */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-3">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Code2 size={15} className="text-zinc-400" />
                2. Ingesting Telemetry Events (Unix Socket Protocol)
              </CardTitle>
              <CardDescription className="mt-0.5">
                Dispatch completion metrics from application runtimes into the daemon.
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("ingest", codeSnippets.ingestPayload)}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors p-1"
            >
              {copiedCode === "ingest" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCode === "ingest" ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <pre className="p-4 font-mono text-xs text-zinc-300 bg-black/80 overflow-x-auto leading-relaxed">
            <code>{codeSnippets.ingestPayload}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Cost Calculation Formula */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md p-5 animate-fade-in delay-4 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <Layers size={15} className="text-zinc-400" />
          3. Deterministic Cost Formula with Prompt Caching
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Standard API invoices deduct prompt cache reads from raw input rates. The Flashforge metering engine executes the following arithmetic on each ingestion tick:
        </p>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3.5 font-mono text-xs text-zinc-200">
          <code>
            Cost ($) = [ (InputTokens - CachedTokens) × Rate_In + (CachedTokens × Rate_Cached) + (OutputTokens × Rate_Out) ] ÷ 1,000,000
          </code>
        </div>

        <p className="text-[11px] text-zinc-500 leading-normal">
          All calculated balances are preserved in 64-bit fixed point floating representations to eliminate currency rounding drift over high-volume pipelines.
        </p>
      </Card>

      {/* Service Configuration */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-5">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Server size={15} className="text-zinc-400" />
                4. Host Daemon Configuration (/etc/flashforge/config.env)
              </CardTitle>
              <CardDescription className="mt-0.5">
                Runtime parameters loaded by systemd on unit initialization.
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("config", codeSnippets.configEnv)}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors p-1"
            >
              {copiedCode === "config" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCode === "config" ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <pre className="p-4 font-mono text-xs text-zinc-300 bg-black/80 overflow-x-auto leading-relaxed">
            <code>{codeSnippets.configEnv}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
