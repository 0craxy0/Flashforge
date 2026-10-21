# [AGENTS.md](http://AGENTS.md) — Flashforge Engineering &amp; Agent Guidelines

## 1. Project Overview &amp; Scope

- **Product:** Flashforge
- **Nature:** High-performance, self-hosted API billing, metering, and usage analytics dashboard.
- **Target OS:** Ubuntu Linux (x86_64, aarch64) native environments and systemd-managed services.
- **Design Philosophy:** Minimalist, sleek, modern dark mode inspired strictly by [`ui.shadcn.com`](http://ui.shadcn.com).

## 2. Technical Stack &amp; Environment

- **Platform:** Ubuntu LTS (22.04 / 24.04). All filesystem paths, process managers, and scripts must follow standard Linux FHS conventions (`/etc/flashforge`, `/var/log/flashforge`, `/opt/flashforge`).
- **Frontend Architecture:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
- **Component Primitives:** Radix UI primitives wired via [`ui.shadcn.com`](http://ui.shadcn.com) patterns.
- **Backend / Daemon:** Go or Node.js running as an Ubuntu systemd unit (`flashforge.service`) communicating over local Unix domain sockets or standard loopback (`127.0.0.1:8080`).

## 3. UI/UX &amp; Design Tokens

### Color Palette

- Strict monochrome high-contrast hierarchy:
  - **Background / Canvas:** `hsl(0, 0%, 0%)` (Pure pitch black) or `hsl(240, 10%, 3.9%)` (Zinc dark slate).
  - **Foreground / Text:** `hsl(0, 0%, 98%)` (High-contrast pure white) for primary headings and critical numerical data.
  - **Muted / Subtext:** `hsl(240, 5%, 64.9%)` (Zinc neutral gray) for labels, units, and timestamps.
  - **Borders &amp; Separators:** `hsl(240, 3.7%, 15.9%)` (Subtle 1px zinc borders).
  - **Accents:** Restrained monochrome or subtle status fills (Emerald for active keys/healthy status, Rose for overdue/failed charges, Amber for rate-limit warnings).

### Styling Rules

- **No unnecessary colors:** Avoid arbitrary gradients or oversaturated accent fills.
- **Cards &amp; Surfaces:** Flat black or dark zinc containers with thin border lines (`border border-zinc-800 bg-zinc-950/50 backdrop-blur`).
- **Typography:** Monospace fonts (`Geist Mono`, `JetBrains Mono`) for API tokens, endpoint routes, JSON payloads, and exact currency balances. Sans-serif (`Geist Sans`, `Inter`) for structural UI.
- **Sparkle Affordances:**
  - Reserve subtle sparkle icons (`lucide-react: Sparkles`) and low-intensity glow effects strictly for high-value actions:
    - Plan upgrades and tier changes.
    - AI-assisted billing forecast or anomaly detection flags.
    - Active API secret generation.
  - Avoid overuse; sparkles should signify real utility or active automation, never plain decorative noise.

## 4. Coding Standards &amp; Best Practices

### Code Cleanliness

- Keep code clean, lean, and self-documenting.
- Avoid obvious or conversational comments. Use comments solely when documenting non-trivial algorithms or Linux kernel/systemd interop quirks.
- Run static checks before suggesting implementations: verify all imports exist, remove deprecated patterns, and ensure strict TypeScript typing (no raw `any`).

### Component Design

- Structure all UI elements around standard reusable shadcn primitives (`Card`, `Badge`, `Button`, `Dialog`, `Table`, `Tabs`).
- Ensure every interactive element provides visual feedback: subtle hover state changes (`hover:bg-zinc-900`), loading skeletons, and accessible keyboard focus outlines (`ring-1 ring-zinc-400`).

## 5. Ubuntu Deployment &amp; Operational Directives

- **Filesystem Permissions:** Avoid running core services as root. Enforce execution under a dedicated system user:

Bash

```
useradd -r -s /bin/false flashforge

```

- **Service Configuration:**
  - Place configuration under `/etc/flashforge/config.env`.
  - Expose logs via standard stdout/stderr captured by `journald`.
- **System Dependencies:**
  - Ensure compatibility with Ubuntu packages (`curl`, `ca-certificates`, `jq`, `ufw`).
  - Keep installation steps idempotent (safe to rerun without duplicating files or config lines).
