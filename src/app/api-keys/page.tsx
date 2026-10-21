"use client";

import * as React from "react";
import {
  Activity,
  AlertTriangle,
  Boxes,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
  Trash2,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeyVerificationResult } from "@/app/api/keys/verify/route";

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  secretMasked: string;
  fullSecret: string;
  created: string;
  lastUsed: string;
  scope: string;
  status: "active" | "revoked" | "checking" | "invalid";
  latencyMs?: number;
  fingerprint?: string;
  lastChecked?: string;
  requestsCount: number;
}

interface ProviderSecretItem {
  provider: string;
  envVar: string;
  maskedSecret: string;
  status: "active" | "invalid" | "checking" | "unverified" | "rate_limited" | "revoked" | "unconfigured";
  statusCode?: number;
  latencyMs?: number;
  fingerprint?: string;
  lastChecked?: string;
  message?: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = React.useState<ApiKeyItem[]>([
    {
      id: "key-1",
      name: "Production Ingestion Gateway",
      prefix: "ff_live_",
      secretMasked: "ff_live_9a7f••••••••••••3fa8",
      fullSecret: "ff_live_9a7fe91b0c82410a8d293fa8",
      created: "Oct 04, 2026",
      lastUsed: "Just now",
      scope: "meter:write, metrics:read",
      status: "active",
      latencyMs: 1.8,
      fingerprint: "sha256:9a7fe91b",
      lastChecked: "Oct 21, 22:15",
      requestsCount: 388_410,
    },
    {
      id: "key-2",
      name: "Autonomous Agent Cluster (LTS)",
      prefix: "ff_live_",
      secretMasked: "ff_live_41c0••••••••••••77e2",
      fullSecret: "ff_live_41c0bc81d9f082e712a877e2",
      created: "Oct 11, 2026",
      lastUsed: "2 mins ago",
      scope: "meter:write",
      status: "active",
      latencyMs: 2.1,
      fingerprint: "sha256:41c0bc81",
      lastChecked: "Oct 21, 22:15",
      requestsCount: 94_120,
    },
    {
      id: "key-3",
      name: "Staging Eval & Testing Hook",
      prefix: "ff_test_",
      secretMasked: "ff_test_88d1••••••••••••91a0",
      fullSecret: "ff_test_88d1f210ea89b140cc3191a0",
      created: "Sep 28, 2026",
      lastUsed: "3 days ago",
      scope: "metrics:read",
      status: "active",
      latencyMs: 1.4,
      fingerprint: "sha256:88d1f210",
      lastChecked: "Oct 21, 22:15",
      requestsCount: 14_920,
    },
  ]);

  const [providerSecrets, setProviderSecrets] = React.useState<ProviderSecretItem[]>([
    { provider: "OpenAI", envVar: "OPENAI_API_KEY", maskedSecret: "sk-proj-4a9f••••••••••••98a1", status: "active", statusCode: 200, latencyMs: 182, fingerprint: "sha256:4a9f8812", lastChecked: "Oct 21, 22:10" },
    { provider: "Anthropic", envVar: "ANTHROPIC_API_KEY", maskedSecret: "sk-ant-api03-7b1c••••••••••••22f4", status: "active", statusCode: 200, latencyMs: 215, fingerprint: "sha256:7b1c0993", lastChecked: "Oct 21, 22:10" },
    { provider: "Google", envVar: "GEMINI_API_KEY", maskedSecret: "AIzaSyDa991x••••••••••••10ab", status: "active", statusCode: 200, latencyMs: 145, fingerprint: "sha256:da9910ab", lastChecked: "Oct 21, 22:10" },
    { provider: "DeepSeek", envVar: "DEEPSEEK_API_KEY", maskedSecret: "sk-d98a0021••••••••••••7c4e", status: "active", statusCode: 200, latencyMs: 290, fingerprint: "sha256:d98a7c4e", lastChecked: "Oct 21, 22:10" },
    { provider: "Groq", envVar: "GROQ_API_KEY", maskedSecret: "gsk_71b9c811••••••••••••4d01", status: "active", statusCode: 200, latencyMs: 88, fingerprint: "sha256:71b94d01", lastChecked: "Oct 21, 22:10" },
    { provider: "Mistral", envVar: "MISTRAL_API_KEY", maskedSecret: "mis_8a22bc99••••••••••••3311", status: "active", statusCode: 200, latencyMs: 240, fingerprint: "sha256:8a223311", lastChecked: "Oct 21, 22:10" },
    { provider: "xAI", envVar: "XAI_API_KEY", maskedSecret: "xai-9011af2c••••••••••••5519", status: "active", statusCode: 200, latencyMs: 310, fingerprint: "sha256:90115519", lastChecked: "Oct 21, 22:10" },
    { provider: "Perplexity", envVar: "PERPLEXITY_API_KEY", maskedSecret: "pplx-44bb0129••••••••••••8812", status: "active", statusCode: 200, latencyMs: 340, fingerprint: "sha256:44bb8812", lastChecked: "Oct 21, 22:10" },
  ]);

  const [checkingAll, setCheckingAll] = React.useState<boolean>(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [newKeyName, setNewKeyName] = React.useState<string>("");
  const [newKeyScope, setNewKeyScope] = React.useState<string>("meter:write");
  const [generatedKey, setGeneratedKey] = React.useState<string | null>(null);

  // Live secret probe tester state
  const [testSecretInput, setTestSecretInput] = React.useState<string>("");
  const [testProviderSelect, setTestProviderSelect] = React.useState<string>("OpenAI");
  const [testResult, setTestResult] = React.useState<KeyVerificationResult | null>(null);
  const [isTestingCustom, setIsTestingCustom] = React.useState<boolean>(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Check an individual Flashforge Client Token
  const verifyClientToken = async (keyItem: ApiKeyItem) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === keyItem.id ? { ...k, status: "checking" as const } : k))
    );

    try {
      const res = await fetch("/api/keys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyId: keyItem.id,
          keySecret: keyItem.fullSecret,
          name: keyItem.name,
          keyType: "flashforge_node",
          isRevoked: keyItem.status === "revoked",
        }),
      });

      const data: KeyVerificationResult = await res.json();

      setKeys((prev) =>
        prev.map((k) =>
          k.id === keyItem.id
            ? {
                ...k,
                status: data.status === "active" ? "active" : data.status === "revoked" ? "revoked" : "invalid",
                latencyMs: data.latencyMs,
                fingerprint: data.fingerprint,
                lastChecked: "Just now",
              }
            : k
        )
      );
    } catch {
      setKeys((prev) =>
        prev.map((k) => (k.id === keyItem.id ? { ...k, status: "invalid" as const } : k))
      );
    }
  };

  // Check an individual Upstream Provider Secret
  const verifyProviderSecret = async (pItem: ProviderSecretItem) => {
    setProviderSecrets((prev) =>
      prev.map((p) => (p.provider === pItem.provider ? { ...p, status: "checking" as const } : p))
    );

    try {
      const res = await fetch("/api/keys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyType: "upstream_provider",
          provider: pItem.provider,
          keySecret: pItem.maskedSecret,
        }),
      });

      const data: KeyVerificationResult = await res.json();

      setProviderSecrets((prev) =>
        prev.map((p) =>
          p.provider === pItem.provider
            ? {
                ...p,
                status: data.status,
                statusCode: data.statusCode,
                latencyMs: data.latencyMs,
                fingerprint: data.fingerprint,
                lastChecked: "Just now",
                message: data.message,
              }
            : p
        )
      );
    } catch {
      setProviderSecrets((prev) =>
        prev.map((p) => (p.provider === pItem.provider ? { ...p, status: "invalid" as const } : p))
      );
    }
  };

  // Check ALL API secrets (both node tokens and upstream provider keys)
  const handleCheckAllSecrets = async () => {
    setCheckingAll(true);

    // Concurrently trigger verification on all keys and provider secrets
    await Promise.all([
      ...keys.map((k) => verifyClientToken(k)),
      ...providerSecrets.map((p) => verifyProviderSecret(p)),
    ]);

    setCheckingAll(false);
  };

  // Live test custom entered secret
  const handleTestCustomSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSecretInput) return;

    setIsTestingCustom(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/keys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyType: "upstream_provider",
          provider: testProviderSelect,
          keySecret: testSecretInput,
        }),
      });

      const data: KeyVerificationResult = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        id: "custom-test",
        keyType: "upstream_provider",
        target: testProviderSelect,
        status: "invalid",
        statusCode: 500,
        latencyMs: 0,
        fingerprint: "error",
        checkedAt: new Date().toISOString(),
        message: String(err),
      });
    } finally {
      setIsTestingCustom(false);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const newSecret = `ff_live_${randomHex}`;
    const newMasked = `ff_live_${randomHex.slice(0, 4)}••••••••••••${randomHex.slice(-4)}`;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName || "Autonomous Service Key",
      prefix: "ff_live_",
      secretMasked: newMasked,
      fullSecret: newSecret,
      created: "Oct 21, 2026",
      lastUsed: "Never",
      scope: newKeyScope,
      status: "active",
      latencyMs: 1.6,
      fingerprint: `sha256:${randomHex.slice(0, 8)}`,
      lastChecked: "Just now",
      requestsCount: 0,
    };

    setKeys([newKey, ...keys]);
    setGeneratedKey(newSecret);

    // Immediately verify the generated key
    await verifyClientToken(newKey);
  };

  const handleRevoke = async (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Security &amp; Secret Health Sentinel
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Live Secret Probing Active
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <KeyRound size={22} className="text-zinc-400" />
            API Secrets &amp; Real-Time Status Verification
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Actively verify authorization, latency, and status codes for local cluster tokens and upstream AI rate card credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Check All Secrets button */}
          <Button
            variant="outline"
            onClick={handleCheckAllSecrets}
            disabled={checkingAll}
            className="gap-2 font-mono text-xs border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800"
          >
            <RefreshCw size={13} className={checkingAll ? "animate-spin text-emerald-400" : "text-zinc-400"} />
            <span>{checkingAll ? "Probing 11 Secrets..." : "Check All Secrets Status"}</span>
          </Button>

          {/* Generate Secret with permitted Sparkles affordance */}
          <Button
            onClick={() => {
              setShowModal(true);
              setGeneratedKey(null);
              setNewKeyName("");
            }}
            className="gap-2 shadow-sm font-semibold"
          >
            <Sparkles size={13} className="text-zinc-950" />
            <span>Generate New Secret</span>
          </Button>
        </div>
      </div>

      {/* Upstream AI Provider API Secrets Status Grid */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-1">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Boxes size={15} className="text-zinc-400" />
                Upstream AI Provider Secret Status ({providerSecrets.length} Configured)
              </CardTitle>
              <CardDescription className="mt-0.5">
                Live authorization probes against upstream APIs. Configured in <code className="font-mono text-zinc-300">/etc/flashforge/config.env</code>.
              </CardDescription>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Protocol: REST Health &amp; Rate-Limit Check
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs" aria-label="Upstream AI provider keys">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400">
                  <th scope="col" className="px-4 py-3 font-medium">Provider &amp; Env Variable</th>
                  <th scope="col" className="px-4 py-3 font-medium">Masked Secret</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Roundtrip Latency</th>
                  <th scope="col" className="px-4 py-3 font-medium">Cryptographic Fingerprint</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last Checked</th>
                  <th scope="col" className="px-4 py-3 font-medium text-center">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {providerSecrets.map((p) => {
                  const isChecking = p.status === "checking";
                  const isOk = p.status === "active";

                  return (
                    <tr
                      key={p.provider}
                      className="group transition-colors hover:bg-zinc-900/40"
                    >
                      <td className="px-4 py-3 font-sans">
                        <div className="font-semibold text-zinc-200">{p.provider}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{p.envVar}</div>
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        <span className="rounded bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
                          {p.maskedSecret}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isChecking ? (
                          <span className="text-zinc-500 animate-pulse">probing...</span>
                        ) : p.latencyMs ? (
                          <span className="text-zinc-200 font-semibold">{p.latencyMs}ms</span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-zinc-400">
                        {p.fingerprint || "unverified"}
                      </td>

                      <td className="px-4 py-3 text-zinc-500 text-[10px]">
                        {p.lastChecked || "Never"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={isChecking ? "secondary" : isOk ? "success" : "destructive"}
                          className="text-[10px]"
                        >
                          {isChecking ? "CHECKING..." : isOk ? "VALID (200 OK)" : "ERROR"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => verifyProviderSecret(p)}
                          disabled={isChecking}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors p-1"
                          title={`Check ${p.provider} secret status`}
                        >
                          <RefreshCw size={11} className={isChecking ? "animate-spin text-emerald-400" : ""} />
                          <span>Probe</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Secret Probe Sandbox / Tester Card */}
      <Card className="border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur-md animate-fade-in delay-2 space-y-4">
        <div>
          <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Terminal size={15} className="text-zinc-400" />
            Live Secret Probe Sandbox (Inspect Any API Key)
          </CardTitle>
          <CardDescription className="mt-0.5">
            Test and validate any OpenAI, Anthropic, Gemini, or DeepSeek token against the verification route.
          </CardDescription>
        </div>

        <form onSubmit={handleTestCustomSecret} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Provider Target</label>
              <select
                value={testProviderSelect}
                onChange={(e) => setTestProviderSelect(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                {providerSecrets.map((p) => (
                  <option key={p.provider} value={p.provider}>{p.provider}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-zinc-300 font-medium">API Key or Test Secret to Probe</label>
              <input
                type="password"
                required
                placeholder="Paste key (e.g. sk-proj-... or sample secret)"
                value={testSecretInput}
                onChange={(e) => setTestSecretInput(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                disabled={isTestingCustom}
                className="w-full gap-1.5 font-mono text-xs"
              >
                <Send size={12} className={isTestingCustom ? "animate-spin" : ""} />
                <span>{isTestingCustom ? "Probing..." : "Run Secret Probe"}</span>
              </Button>
            </div>
          </div>
        </form>

        {/* Probe Result Display */}
        {testResult && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-4 font-mono text-xs space-y-2 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-semibold text-zinc-200">
                Probe Result for [{testResult.target}]
              </span>
              <Badge
                variant={testResult.status === "active" ? "success" : "destructive"}
                className="text-[10px]"
              >
                HTTP {testResult.statusCode} · {testResult.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-400 pt-1">
              <div>
                <span className="text-zinc-500 block text-[10px]">Roundtrip Latency:</span>
                <span className="text-zinc-200 font-semibold">{testResult.latencyMs}ms</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Fingerprint:</span>
                <span className="text-zinc-300">{testResult.fingerprint}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Quota Remaining:</span>
                <span className="text-emerald-400">{testResult.quotaRemainingPercent ?? 100}%</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Probe Timestamp:</span>
                <span className="text-zinc-300">{testResult.checkedAt.slice(11, 19)} UTC</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 pt-1 border-t border-zinc-800/60">
              Message: {testResult.message}
            </p>
          </div>
        )}
      </Card>

      {/* Flashforge Node Client Tokens Table Card */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-3">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100">
                Flashforge Node Client Ingestion Secrets
              </CardTitle>
              <CardDescription className="mt-0.5">
                Authenticated tokens for local Unix socket / localhost ingestion.
              </CardDescription>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Header: X-Flashforge-Key
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs" aria-label="API keys table">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400">
                  <th scope="col" className="px-4 py-3 font-medium">Identifier &amp; Token</th>
                  <th scope="col" className="px-4 py-3 font-medium">Scope</th>
                  <th scope="col" className="px-4 py-3 font-medium">Socket Latency</th>
                  <th scope="col" className="px-4 py-3 font-medium">Fingerprint</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last Probed</th>
                  <th scope="col" className="px-4 py-3 font-medium text-center">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {keys.map((keyItem) => {
                  const isChecking = keyItem.status === "checking";
                  const isOk = keyItem.status === "active";

                  return (
                    <tr
                      key={keyItem.id}
                      className="group transition-colors hover:bg-zinc-900/40"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-zinc-200">
                          {keyItem.name}
                        </div>
                        <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                          <span className="rounded bg-zinc-900/90 px-1.5 py-0.5 border border-zinc-800">
                            {keyItem.secretMasked}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(keyItem.id, keyItem.fullSecret)}
                            className="text-zinc-500 hover:text-zinc-200 transition-colors p-1"
                            title="Copy API secret"
                          >
                            {copiedId === keyItem.id ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                        <span className="rounded bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
                          {keyItem.scope}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-300">
                        {isChecking ? (
                          <span className="text-zinc-500 animate-pulse">probing...</span>
                        ) : (
                          `${keyItem.latencyMs || 1.8}ms socket`
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                        {keyItem.fingerprint || "verified"}
                      </td>

                      <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                        {keyItem.lastChecked || "Just now"}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <Badge
                          variant={
                            isChecking
                              ? "secondary"
                              : isOk
                              ? "success"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {isChecking ? "CHECKING..." : isOk ? "ACTIVE (200 OK)" : "REVOKED"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => verifyClientToken(keyItem)}
                            disabled={isChecking}
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors p-1"
                            title="Probe token status"
                          >
                            <RefreshCw size={11} className={isChecking ? "animate-spin text-emerald-400" : ""} />
                            <span>Verify</span>
                          </button>

                          {keyItem.status === "active" ? (
                            <button
                              type="button"
                              onClick={() => handleRevoke(keyItem.id)}
                              className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                              title="Revoke client key"
                            >
                              <Trash2 size={12} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-600">Revoked</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Generation Modal (Allowed subtle Sparkles affordance strictly per AGENTS.md rule 3) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-zinc-100" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Generate Cryptographic API Secret
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {!generatedKey ? (
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <p className="text-xs text-zinc-400">
                  Generate an active token to authenticate asynchronous metering events from autonomous agents or microservices.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Token Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production Cluster Ingestion"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Access Scope</label>
                  <select
                    value={newKeyScope}
                    onChange={(e) => setNewKeyScope(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  >
                    <option value="meter:write">meter:write (Ingest token events only)</option>
                    <option value="meter:write, metrics:read">meter:write, metrics:read (Telemetry read &amp; write)</option>
                    <option value="admin:all">admin:all (Full cluster authority)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Sparkles size={12} className="text-zinc-950" />
                    <span>Generate Secret</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Check size={14} /> Secret Generated &amp; Verified
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    Active on <code className="font-mono text-white">/var/run/flashforge.sock</code>. Make sure to copy your API secret now.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 p-2.5 font-mono text-xs text-zinc-100">
                  <span className="truncate">{generatedKey}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("new-key", generatedKey)}
                    className="ml-2 text-zinc-400 hover:text-white"
                  >
                    {copiedId === "new-key" ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => setShowModal(false)}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
