# MarginPilot — $0 Bootstrap Automated Calculator Network + Ready-to-Sell CFO Kit

An end-to-end, zero-maintenance programmatic web asset and ready-to-sell digital product built for **$0 hosting cost** and **automated search engine indexing**.

## What Is Built Inside This Project

1. **99 Interactive High-Intent Web Calculators (`dist/`)**
   - **1 All-in-One Matrix Homepage** comparing 12 payment processors, Merchants of Record, and creator platforms in real time (`Polar.sh`, `Creem.io`, `Paddle`, `Lemon Squeezy`, `Dodo Payments`, `Stripe`, `Whop`, `Gumroad`, `beehiiv`, `Substack`, `Patreon`, `Shopify`).
   - **66 Head-to-Head Comparison Calculators** (`/vs/polar-vs-lemon-squeezy/`, `/vs/beehiiv-vs-substack/`, `/vs/whop-vs-gumroad/`, etc.) with automatic breakeven detection and MRR tier tables.
   - **12 Platform Hidden-Fee X-Ray Calculators** (`/calculators/polar-fee-calculator/`, etc.).
   - **18 Founder & AI SaaS Margin Scenario Calculators** (`/scenarios/ai-saas-wrapper-margin-calculator/`, etc.) modeling LLM API token costs + checkout fees.
   - **`sitemap.xml` + `llms.txt` (AI search index) + Automated `IndexNow` submission** for Bing, DuckDuckGo, and Copilot.

2. **Ready-to-Sell Digital Product Bundle (`dist-product/Founder-Margin-CFO-Kit-2026.zip`)**
   - **`Founder-CFO-Simulator.html`**: Standalone offline 24-month SaaS, AI & creator runway simulator with CSV/JSON export.
   - **`2026-MoR-and-Gateway-Audit-Matrix.csv`** & **`SaaS-Unit-Economics-Benchmarks-2026.csv`**: Ready for Excel, Google Sheets, or Notion.
   - **`2026-Indie-Pricing-and-Global-Tax-Playbook.md`**: Actionable breakeven & EU/UK/US tax nexus guide.

---

## One-Time 10-Minute Payout & Launch Checklist

Because payment processors and affiliate programs legally require **your** identity/bank account for payouts, do this **once** and the system runs itself:

### Step 1: List the Ready-Made `$19` Digital Product ($0/mo)
1. Create a free seller account on **[Polar.sh](https://polar.sh)** or **[Gumroad](https://gumroad.com)** ($0 monthly cost).
2. Create a `$19` product titled **"The 2026 Founder Margin & Pricing CFO Kit"** and upload `dist-product/Founder-Margin-CFO-Kit-2026.zip`.
3. Paste your checkout link into `config/monetization.json` under `digitalProduct.checkoutUrl`.

### Step 2: Add High-Payout Partner Links (Optional, Increases Passive Upside)
Join any of these free self-serve partner programs and paste your referral URLs into `config/monetization.json` under `affiliateLinks`:
- **beehiiv Partner Program**: Pays **50% recurring commission for 12 months** on referred paid plans.
- **Shopify / Whop / Lemon Squeezy / Mercury**: High-converting software & fintech referral bounties.

### Step 3: Push Live for $0/month (Automated Weekly Refresh + IndexNow)
Run:
```powershell
npm run launch:github
```
GitHub Actions will build all 99 pages (automatically adapting all links to your GitHub Pages URL), deploy to GitHub Pages for **$0/month**, and ping **IndexNow** every Monday automatically.
