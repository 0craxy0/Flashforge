# Flashforge

A minimal Next.js App Router starter for an AI API billing and usage dashboard.

## Run locally

```bash
npm install
npm run dev
```

The responsive overview lives in `src/app/page.tsx`; shared dark-mode tokens and layout styles are in `src/app/globals.css`. The dashboard currently uses typed illustrative token usage and manually reviewed public model prices for OpenAI, Anthropic, Google Gemini, xAI, DeepSeek, Mistral, Groq, and Perplexity. Per-model estimated spend is calculated as:

```text
(input tokens × input rate + output tokens × output rate) ÷ 1,000,000
```

## Toolchain

Locked versions from `package-lock.json`:

- Next.js: **15.5.28** (manifest range `^15.5.6`)
- React: **19.3.1** (manifest range `^19.1.0`)
- React DOM: **19.3.1** (manifest range `^19.1.0`)
- PostCSS: **8.5.31**, selected by the npm override in `package.json` to avoid vulnerable transitive PostCSS versions

## Validation status

On the current scaffold, these checks passed:

- `npm run typecheck`
- `npm run build` — optimized production build completed and the App Router homepage was statically generated
- `npm audit --omit=dev` — zero production dependency vulnerabilities
- Production homepage smoke test on port 3107 — dashboard headings, providers, pricing table, and cost formula were present in rendered HTML

Port 3000 was occupied by another local service during the smoke test; it was not used for the application check.

## Antigravity handoff notes

- Usage and pricing are sample data, not live metering, billing, or authenticated provider integrations.
- The price list is a manually reviewed snapshot dated October 21, 2026. Provider rates vary by model, cache status, context length, service tier, usage mode, and provider terms; confirm official rate cards before relying on estimates.
- Continue with functional review, responsive/accessibility checks, and integration of actual usage ingestion and billing data.
