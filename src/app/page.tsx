import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  MoreHorizontal,
  Settings2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

type Metric = {
  label: string;
  value: string;
  change: string;
  direction: "up" | "down";
  detail: string;
  icon: typeof Activity;
};

type ModelUsage = {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  inputRate: number;
  outputRate: number;
  rateNote: string;
  source: string;
  sourceUrl: string;
};

const models: ModelUsage[] = [
  { provider: "OpenAI", model: "GPT-6.1 Sol", inputTokens: 3_420_000, outputTokens: 860_000, inputRate: 2, outputRate: 10, rateNote: "Standard · USD / 1M tokens", source: "OpenAI pricing", sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  { provider: "Anthropic", model: "Claude Sonnet 5.5", inputTokens: 2_100_000, outputTokens: 470_000, inputRate: 2, outputRate: 10, rateNote: "Standard · USD / 1M tokens", source: "Anthropic pricing", sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing" },
  { provider: "Google", model: "Gemini 3.8 Flash", inputTokens: 4_860_000, outputTokens: 1_240_000, inputRate: 0.75, outputRate: 3.75, rateNote: "Paid standard · through Dec 31, 2026", source: "Gemini API pricing", sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing" },
  { provider: "xAI", model: "Grok 4.7", inputTokens: 1_720_000, outputTokens: 520_000, inputRate: 2, outputRate: 6, rateNote: "Global · short context (<200k) · USD / 1M", source: "xAI pricing", sourceUrl: "https://docs.x.ai/developers/pricing" },
  { provider: "DeepSeek", model: "DeepSeek Flash", inputTokens: 7_400_000, outputTokens: 1_300_000, inputRate: 0.15, outputRate: 0.6, rateNote: "Off-peak · cache miss · USD / 1M", source: "DeepSeek pricing", sourceUrl: "https://api-docs.deepseek.com/quick_start/pricing/" },
  { provider: "Mistral", model: "Mistral Large 4", inputTokens: 1_800_000, outputTokens: 330_000, inputRate: 1.36, outputRate: 4.18, rateNote: "Standard · USD / 1M tokens", source: "Mistral pricing", sourceUrl: "https://docs.mistral.ai/inference/pricing" },
  { provider: "Groq", model: "OpenAI GPT-OSS 120B", inputTokens: 5_500_000, outputTokens: 980_000, inputRate: 0.15, outputRate: 0.6, rateNote: "Groq-hosted · USD / 1M tokens", source: "Groq models", sourceUrl: "https://console.groq.com/docs/models" },
  { provider: "Perplexity", model: "Sonar", inputTokens: 1_200_000, outputTokens: 180_000, inputRate: 0.25, outputRate: 2.5, rateNote: "Agent API token rates · tool fees separate", source: "Perplexity model pricing", sourceUrl: "https://docs.perplexity.ai/docs/agent-api/models" },
];

const totalInputTokens = models.reduce((total, model) => total + model.inputTokens, 0);
const totalOutputTokens = models.reduce((total, model) => total + model.outputTokens, 0);
const totalTokens = totalInputTokens + totalOutputTokens;
const totalSpend = models.reduce((total, model) => total + estimateCost(model), 0);
const spendLimit = 100;

function estimateCost(model: ModelUsage): number {
  return (model.inputTokens * model.inputRate + model.outputTokens * model.outputRate) / 1_000_000;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);
}

function formatTokens(amount: number): string {
  return `${(amount / 1_000_000).toFixed(2)}M`;
}

const metrics: Metric[] = [
  { label: "Estimated AI spend", value: formatCurrency(totalSpend), change: `${models.length} providers`, direction: "up", detail: "current billing period", icon: CreditCard },
  { label: "Tokens processed", value: formatTokens(totalTokens), change: `${formatTokens(totalInputTokens)} in`, direction: "up", detail: `${formatTokens(totalOutputTokens)} out`, icon: Activity },
  { label: "Models metered", value: String(models.length), change: `${models.length} providers`, direction: "up", detail: "sample model rates", icon: KeyRound },
  { label: "Spend budget", value: formatCurrency(spendLimit), change: `${Math.round((totalSpend / spendLimit) * 100)}% used`, direction: "down", detail: `${formatCurrency(spendLimit - totalSpend)} remaining`, icon: Gauge },
];

const usage = [
  { name: "Total tokens", used: formatTokens(totalTokens), limit: "40.00M", percent: Math.round((totalTokens / 40_000_000) * 100) },
  { name: "Estimated spend", used: formatCurrency(totalSpend), limit: formatCurrency(spendLimit), percent: Math.round((totalSpend / spendLimit) * 100) },
  { name: "Input tokens", used: formatTokens(totalInputTokens), limit: "30.00M", percent: Math.round((totalInputTokens / 30_000_000) * 100) },
];

const chartSeries = [
  { label: "This period", values: [36, 41, 39, 48, 44, 52, 49, 61, 54, 67, 60, 72, 65, 77, 71, 84, 76, 88, 81, 94, 85, 99, 90, 103, 95, 108, 98, 112, 102, 119, 108, 124, 114, 130, 119, 138] },
  { label: "Previous period", values: [30, 35, 34, 39, 37, 43, 41, 49, 45, 54, 50, 59, 53, 63, 57, 66, 62, 71, 65, 75, 70, 78, 72, 82, 76, 86, 80, 89, 84, 95, 88, 98, 92, 103, 96, 109] },
];

function chartPoints(points: number[]): string {
  const maximum = 150;
  return points.map((point, index) => {
    const x = (index / (points.length - 1)) * 760;
    const y = 172 - (point / maximum) * 148;
    return `${x},${y}`;
  }).join(" ");
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <a className="brand" href="#overview" aria-label="Flashforge home">
        <span className="brand-mark"><Zap size={15} strokeWidth={2.2} /></span>
        <span>flashforge</span>
      </a>
      <button className="workspace" type="button" aria-label="Current workspace: Acme Inc">
        <span className="workspace-icon">A</span>
        <span className="workspace-copy"><strong>Acme Inc.</strong><span>acme.flashforge.dev</span></span>
        <ChevronDown size={14} color="hsl(240 5% 55%)" />
      </button>
      <nav className="nav-list" aria-label="Workspace">
        <p className="side-label">Workspace</p>
        <a className="nav-link active" href="#overview" aria-current="page"><LayoutDashboard /> Overview</a>
        <a className="nav-link" href="#usage"><Activity /> Usage</a>
        <a className="nav-link" href="#api-keys"><KeyRound /> API keys</a>
        <a className="nav-link" href="#pricing-sources"><Boxes /> AI providers</a>
        <a className="nav-link" href="#billing"><CreditCard /> Billing</a>
      </nav>
      <nav className="nav-list" aria-label="Organization">
        <p className="side-label">Organization</p>
        <a className="nav-link" href="#members"><Users /> Members</a>
        <a className="nav-link" href="#settings"><Settings2 /> Settings</a>
      </nav>
      <div className="sidebar-bottom">
        <div className="plan-card">
          <div className="plan-top"><span>AI usage plan</span><span className="plan-tag">Sample</span></div>
          <p>Track token costs across providers with transparent per-model rates.</p>
          <a className="plan-button" href="#pricing-sources"><Sparkles size={13} /> View rate sources <ArrowRight size={13} /></a>
        </div>
        <div className="nav-list" style={{ marginTop: 17 }}>
          <a className="nav-link" href="#support"><LifeBuoy /> Support</a>
          <a className="nav-link" href="#documentation"><CircleHelp /> Documentation</a>
        </div>
      </div>
    </aside>
  );
}

function UsageChart() {
  const horizontalLines = [24, 61, 98, 135, 172];
  return (
    <div className="chart-wrap" role="img" aria-label="Estimated daily AI token usage increased over the last 30 days compared with the previous period">
      <svg className="chart" viewBox="0 0 760 180" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(0 0% 85%)" stopOpacity=".13" />
            <stop offset="100%" stopColor="hsl(0 0% 85%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {horizontalLines.map((y) => <line key={y} x1="0" x2="760" y1={y} y2={y} stroke="hsl(240 3.7% 15.9%)" strokeDasharray="3 5" />)}
        <polygon points={`0,180 ${chartPoints(chartSeries[0].values)} 760,180`} fill="url(#area-fill)" />
        <polyline points={chartPoints(chartSeries[1].values)} fill="none" stroke="hsl(240 5% 40%)" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <polyline points={chartPoints(chartSeries[0].values)} fill="none" stroke="hsl(0 0% 86%)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="chart-labels"><span>Sep 22</span><span>Sep 29</span><span>Oct 06</span><span>Oct 13</span><span>Oct 20</span></div>
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  const TrendIcon = metric.direction === "up" ? ArrowUpRight : ArrowDownRight;
  const trendClass = metric.label === "Spend budget" ? "status-warn" : "status-good";
  return (
    <article className="card stat-card">
      <div className="stat-label"><span>{metric.label}</span><Icon aria-hidden="true" /></div>
      <div className="stat-value">{metric.value}</div>
      <div className="stat-foot"><span className={trendClass}><TrendIcon size={12} /> {metric.change}</span><span>{metric.detail}</span></div>
    </article>
  );
}

export default function Home() {
  return (
    <div className="app-shell" id="overview">
      <Sidebar />
      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><button className="icon-button mobile-menu" type="button" aria-label="Open navigation"><Menu size={17} /></button><span>Workspace</span><span aria-hidden="true">/</span><strong>Overview</strong></div>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="Notifications"><Bell size={16} /></button>
            <span className="avatar" aria-label="Account: Alex Morgan">AM</span>
          </div>
        </header>
        <main className="content">
          <div className="page-heading">
            <div><p className="eyebrow">Tuesday, October 21, 2026</p><h1>AI billing overview</h1><p className="heading-subtitle">Token usage and estimated costs across AI providers.</p></div>
            <button className="date-button" type="button"><CalendarDays size={13} /> Last 30 days <ChevronDown size={13} /></button>
          </div>

          <section className="stats-grid" aria-label="Key metrics">
            {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
          </section>

          <div className="content-grid">
            <section className="card panel" id="usage" aria-labelledby="usage-title">
              <div className="panel-heading"><div><h2 id="usage-title">AI token usage</h2><p>Daily input and output volume across providers</p></div><button className="panel-select" type="button">Daily <ChevronDown size={12} /></button></div>
              <UsageChart />
              <div className="legend"><span><i className="legend-dot" /> This period</span><span><i className="legend-dot secondary" /> Previous period</span></div>
            </section>
            <section className="card panel" aria-labelledby="limits-title">
              <div className="panel-heading"><div><h2 id="limits-title">Billing overview</h2><p>Illustrative current period</p></div><button className="icon-button" type="button" aria-label="More billing options"><MoreHorizontal size={17} /></button></div>
              <div className="usage-list">
                {usage.map((item) => <div className="usage-row" key={item.name}><div className="usage-meta"><span>{item.name}</span><span>{item.used} / {item.limit}</span></div><div className="progress-track" role="progressbar" aria-label={item.name} aria-valuenow={item.percent} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{ width: `${item.percent}%` }} /></div></div>)}
              </div>
              <p className="usage-caption">Cost estimates use the displayed model rates. Actual invoices may differ by cache hits, context length, service tier, discounts, and provider billing rules.</p>
            </section>
          </div>

          <section className="card table-panel" id="pricing-sources" aria-labelledby="pricing-title">
            <div className="table-title"><div><h2 id="pricing-title">AI provider pricing &amp; estimated cost</h2><p className="table-subtitle">Standard public API rates in USD per 1M tokens, matched to sample usage.</p></div><a className="text-link" href="https://developers.openai.com/api/docs/pricing">Pricing references <ArrowRight size={12} /></a></div>
            <div className="table-scroll">
              <table>
                <thead><tr><th scope="col">Provider / model</th><th scope="col">Input tokens</th><th scope="col">Output tokens</th><th scope="col">Input rate / 1M</th><th scope="col">Output rate / 1M</th><th scope="col">Est. cost</th></tr></thead>
                <tbody>{models.map((model) => <tr key={model.provider}><td><strong>{model.provider}</strong><br /><span className="endpoint">{model.model}</span></td><td>{formatTokens(model.inputTokens)}</td><td>{formatTokens(model.outputTokens)}</td><td>{formatCurrency(model.inputRate)}</td><td>{formatCurrency(model.outputRate)}</td><td className="cost-cell">{formatCurrency(estimateCost(model))}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="pricing-notes">{models.map((model) => <span key={model.provider}><a href={model.sourceUrl} target="_blank" rel="noreferrer">{model.source}</a>: {model.rateNote}.</span>)}</div>
            <p className="pricing-formula">Cost = (input tokens × input rate + output tokens × output rate) ÷ 1,000,000. Cache, batch, regional, long-context, priority, image/audio, taxes, and negotiated discounts may change actual charges. Rates are a manually reviewed snapshot; confirm current prices with each provider.</p>
          </section>
          <footer className="footer-note"><span>Illustrative AI API data · Provider rates checked Oct 21, 2026.</span><span>USD · token-based estimate</span></footer>
        </main>
      </div>
    </div>
  );
}
