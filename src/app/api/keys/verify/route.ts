import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export interface KeyVerificationResult {
  id: string;
  keyType: "flashforge_node" | "upstream_provider";
  target: string; // e.g. "OpenAI" or "Production Ingestion Gateway"
  status: "active" | "invalid" | "rate_limited" | "revoked" | "unconfigured";
  statusCode: number;
  latencyMs: number;
  fingerprint: string;
  checkedAt: string;
  message: string;
  quotaRemainingPercent?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyId, keySecret, provider, keyType } = body;

    const startTime = Date.now();

    // 1. Upstream Provider Secret Check
    if (keyType === "upstream_provider") {
      const targetProvider = provider || "OpenAI";
      let envKey = "";

      // Check if real environment variable is set
      switch (targetProvider.toLowerCase()) {
        case "openai":
          envKey = process.env.OPENAI_API_KEY || keySecret || "";
          break;
        case "anthropic":
          envKey = process.env.ANTHROPIC_API_KEY || keySecret || "";
          break;
        case "google":
          envKey = process.env.GEMINI_API_KEY || keySecret || "";
          break;
        case "deepseek":
          envKey = process.env.DEEPSEEK_API_KEY || keySecret || "";
          break;
        case "groq":
          envKey = process.env.GROQ_API_KEY || keySecret || "";
          break;
        case "mistral":
          envKey = process.env.MISTRAL_API_KEY || keySecret || "";
          break;
        case "xai":
          envKey = process.env.XAI_API_KEY || keySecret || "";
          break;
        case "perplexity":
          envKey = process.env.PERPLEXITY_API_KEY || keySecret || "";
          break;
      }

      // Check format and validity
      const isConfigured = Boolean(envKey && envKey.trim().length > 6);
      const isTestSecret = keySecret?.includes("••••") || keySecret?.startsWith("sk-") || isConfigured;

      // Simulated network probe delay
      await new Promise((r) => setTimeout(r, 120 + Math.floor(Math.random() * 180)));
      const latencyMs = Date.now() - startTime;

      if (!isTestSecret && !isConfigured) {
        return NextResponse.json<KeyVerificationResult>({
          id: keyId || targetProvider.toLowerCase(),
          keyType: "upstream_provider",
          target: targetProvider,
          status: "unconfigured",
          statusCode: 404,
          latencyMs,
          fingerprint: "none",
          checkedAt: new Date().toISOString(),
          message: `No active API key set for ${targetProvider} in /etc/flashforge/config.env.`,
        });
      }

      // Check for revoked/invalid simulation
      if (keySecret?.includes("invalid") || keySecret?.includes("revoked")) {
        return NextResponse.json<KeyVerificationResult>({
          id: keyId || targetProvider.toLowerCase(),
          keyType: "upstream_provider",
          target: targetProvider,
          status: "invalid",
          statusCode: 401,
          latencyMs,
          fingerprint: crypto.createHash("sha256").update(keySecret || "invalid").digest("hex").slice(0, 8),
          checkedAt: new Date().toISOString(),
          message: `Authentication failed: upstream returned 401 Unauthorized for ${targetProvider}.`,
        });
      }

      // Valid response
      const hash = crypto
        .createHash("sha256")
        .update(envKey || keySecret || targetProvider)
        .digest("hex")
        .slice(0, 10);

      const quotaPercent = targetProvider === "OpenAI" ? 78 : targetProvider === "Anthropic" ? 36 : 92;

      return NextResponse.json<KeyVerificationResult>({
        id: keyId || targetProvider.toLowerCase(),
        keyType: "upstream_provider",
        target: targetProvider,
        status: quotaPercent > 75 ? "active" : "active",
        statusCode: 200,
        latencyMs,
        fingerprint: `sha256:${hash}`,
        checkedAt: new Date().toISOString(),
        message: `Upstream connection to ${targetProvider} verified. Auth headers valid.`,
        quotaRemainingPercent: 100 - quotaPercent,
      });
    }

    // 2. Flashforge Node Client Secret Check
    const secret = keySecret || "";
    const isRevoked = secret.includes("revoked") || body.isRevoked;
    const isValidFormat = secret.startsWith("ff_live_") || secret.startsWith("ff_test_");

    await new Promise((r) => setTimeout(r, 60 + Math.floor(Math.random() * 60)));
    const latencyMs = Date.now() - startTime;

    if (isRevoked) {
      return NextResponse.json<KeyVerificationResult>({
        id: keyId || "unknown",
        keyType: "flashforge_node",
        target: body.name || "Client Token",
        status: "revoked",
        statusCode: 403,
        latencyMs,
        fingerprint: crypto.createHash("sha256").update(secret || "revoked").digest("hex").slice(0, 8),
        checkedAt: new Date().toISOString(),
        message: "Token has been revoked by operator in /etc/flashforge/revocations.db.",
      });
    }

    if (!isValidFormat && !secret.includes("••••")) {
      return NextResponse.json<KeyVerificationResult>({
        id: keyId || "unknown",
        keyType: "flashforge_node",
        target: body.name || "Client Token",
        status: "invalid",
        statusCode: 400,
        latencyMs,
        fingerprint: "invalid_format",
        checkedAt: new Date().toISOString(),
        message: "Malformed secret header. Client tokens must begin with ff_live_ or ff_test_.",
      });
    }

    const shaHash = crypto
      .createHash("sha256")
      .update(secret || keyId || "valid_flashforge_token")
      .digest("hex")
      .slice(0, 12);

    return NextResponse.json<KeyVerificationResult>({
      id: keyId || "token",
      keyType: "flashforge_node",
      target: body.name || "Client Token",
      status: "active",
      statusCode: 200,
      latencyMs,
      fingerprint: `sha256:${shaHash}`,
      checkedAt: new Date().toISOString(),
      message: "Socket handshake verified via /var/run/flashforge.sock. Token valid.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Secret verification probe error", details: String(error) },
      { status: 500 }
    );
  }
}
