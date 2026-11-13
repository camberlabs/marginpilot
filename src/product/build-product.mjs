import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PLATFORMS } from '../data/platforms.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'dist-product', 'Founder-Margin-CFO-Kit-2026');
const ZIP_PATH = path.join(ROOT, 'dist-product', 'Founder-Margin-CFO-Kit-2026.zip');

fs.mkdirSync(OUT_DIR, { recursive: true });

// 1. Standalone Offline Interactive 24-Month Founder CFO Simulator HTML App
const simulatorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>2026 Founder CFO &amp; 24-Month Runway Simulator (Offline Pro Edition)</title>
  <style>
    :root { --bg:#0f172a; --card:#1e293b; --border:#334155; --text:#f8fafc; --muted:#94a3b8; --brand:#10b981; --warn:#f59e0b; --danger:#ef4444; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:var(--bg); color:var(--text); line-height:1.5; padding:24px; }
    .wrap { max-width:1220px; margin:0 auto; }
    header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:22px; padding-bottom:16px; border-bottom:1px solid var(--border); }
    h1 { margin:0; font-size:1.5rem; }
    .badge { background:rgba(16,185,129,0.16); color:#6ee7b7; border:1px solid rgba(16,185,129,0.4); padding:4px 10px; border-radius:999px; font-size:0.78rem; font-weight:700; }
    .grid { display:grid; grid-template-columns: 340px 1fr; gap:20px; align-items:start; }
    @media (max-width:920px) { .grid { grid-template-columns:1fr; } }
    .card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px; }
    .field { margin-bottom:12px; }
    .field label { display:flex; justify-content:space-between; font-size:0.82rem; color:#cbd5e1; font-weight:600; margin-bottom:4px; }
    .field input, .field select { width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border); background:#0f172a; color:#fff; font-weight:600; }
    .kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:18px; }
    @media (max-width:760px) { .kpis { grid-template-columns:1fr 1fr; } }
    .kpi { background:#0f172a; border:1px solid var(--border); border-radius:10px; padding:14px; }
    .kpi .lbl { font-size:0.73rem; text-transform:uppercase; color:var(--muted); font-weight:700; }
    .kpi .val { font-size:1.4rem; font-weight:800; margin-top:4px; font-variant-numeric:tabular-nums; }
    .btns { display:flex; gap:8px; margin-top:14px; }
    button { background:var(--brand); color:#052e16; border:none; padding:9px 14px; border-radius:8px; font-weight:800; cursor:pointer; font-size:0.83rem; }
    button.sec { background:#334155; color:#f8fafc; }
    table { width:100%; border-collapse:collapse; font-size:0.82rem; font-variant-numeric:tabular-nums; }
    th, td { padding:9px 10px; border-bottom:1px solid var(--border); text-align:right; }
    th:first-child, td:first-child { text-align:left; }
    th { color:var(--muted); font-size:0.74rem; text-transform:uppercase; background:#0f172a; position:sticky; top:0; }
    .scroll { max-height:480px; overflow:auto; border:1px solid var(--border); border-radius:10px; }
    .bars { display:flex; align-items:flex-end; gap:6px; height:140px; padding:14px 10px 6px; background:#0f172a; border-radius:10px; border:1px solid var(--border); margin-bottom:18px; }
    .bar-col { flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end; }
    .bar-fill { width:100%; background:linear-gradient(180deg,#34d399,#059669); border-radius:4px 4px 0 0; min-height:2px; }
    .bar-lbl { font-size:0.65rem; color:var(--muted); margin-top:4px; }
  </style>
</head>
<body>
<div class="wrap">
  <header>
    <div>
      <span class="badge">Offline Pro Edition · Zero Internet Required</span>
      <h1 style="margin-top:6px;">24-Month SaaS, AI &amp; Creator CFO Runway Simulator</h1>
    </div>
    <div class="btns" style="margin:0;">
      <button class="sec" id="btn-save-json">Save Scenario (.JSON)</button>
      <button id="btn-dl-csv">Export 24-Mo Forecast (.CSV)</button>
    </div>
  </header>

  <div class="grid">
    <div class="card">
      <h3 style="margin-top:0;font-size:1rem;">Model Assumptions</h3>
      <div class="field"><label><span>Starting Active Customers</span></label><input type="number" id="c-start" value="40" min="0" /></div>
      <div class="field"><label><span>New Customers Added / Mo</span></label><input type="number" id="c-new" value="18" min="0" /></div>
      <div class="field"><label><span>Monthly Logo Growth Accel (%)</span></label><input type="number" id="c-accel" value="4" step="0.5" /></div>
      <div class="field"><label><span>Monthly Customer Churn (%)</span></label><input type="number" id="c-churn" value="5.5" step="0.1" min="0.1" max="90" /></div>
      <div class="field"><label><span>Subscription Price ($/mo)</span></label><input type="number" id="c-price" value="29" min="1" /></div>
      <div class="field"><label><span>Payment Processor Fee (%)</span></label>
        <select id="c-fee">
          <option value="4.6">Creem.io (~4.6% eff.)</option>
          <option value="4.9" selected>Polar.sh Pro Ladder (~4.9% eff.)</option>
          <option value="5.9">Paddle All-In (~5.9% eff.)</option>
          <option value="7.2">Lemon Squeezy Global (~7.2% eff.)</option>
          <option value="5.1">Stripe + Billing + Tax (~5.1% eff.)</option>
          <option value="14.8">Gumroad / Substack (~14.8% eff.)</option>
        </select>
      </div>
      <div class="field"><label><span>AI Token + Cloud Cost / User ($/mo)</span></label><input type="number" id="c-cogs" value="1.85" step="0.1" min="0" /></div>
      <div class="field"><label><span>Paid CAC per New User ($)</span></label><input type="number" id="c-cac" value="22" step="1" min="0" /></div>
      <div class="field"><label><span>Fixed Monthly Overhead / Burn ($)</span></label><input type="number" id="c-fixed" value="650" step="50" min="0" /></div>
      <div class="field"><label><span>Starting Cash Reserve ($)</span></label><input type="number" id="c-cash" value="5000" step="100" min="0" /></div>
    </div>

    <div class="card">
      <div class="kpis">
        <div class="kpi"><div class="lbl">Month 12 Net MRR</div><div class="val" id="k-m12">$0</div></div>
        <div class="kpi"><div class="lbl">Month 24 ARR</div><div class="val" id="k-m24arr" style="color:#34d399;">$0</div></div>
        <div class="kpi"><div class="lbl">LTV : CAC Ratio</div><div class="val" id="k-ltvcac">0x</div></div>
        <div class="kpi"><div class="lbl">24-Mo Ending Cash</div><div class="val" id="k-endcash">$0</div></div>
      </div>

      <div style="font-size:0.8rem;color:var(--muted);margin-bottom:6px;font-weight:700;">24-Month Gross MRR Trajectory</div>
      <div class="bars" id="chart-bars"></div>

      <div class="scroll">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Users</th>
              <th>Gross MRR</th>
              <th>Payment Fees</th>
              <th>AI/COGS</th>
              <th>CAC Spend</th>
              <th>Net Profit</th>
              <th>Bank Balance</th>
            </tr>
          </thead>
          <tbody id="tbl-body"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script>
  const ids = ['c-start','c-new','c-accel','c-churn','c-price','c-fee','c-cogs','c-cac','c-fixed','c-cash'];
  let rowsData = [];
  const fmt = (n) => (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US');

  function run() {
    let users = Number(document.getElementById('c-start').value) || 0;
    let newBase = Number(document.getElementById('c-new').value) || 0;
    const accel = (Number(document.getElementById('c-accel').value) || 0) / 100;
    const churn = Math.max(0.001, (Number(document.getElementById('c-churn').value) || 5) / 100);
    const price = Number(document.getElementById('c-price').value) || 29;
    const feePct = (Number(document.getElementById('c-fee').value) || 5) / 100;
    const cogs = Number(document.getElementById('c-cogs').value) || 0;
    const cac = Number(document.getElementById('c-cac').value) || 0;
    const fixed = Number(document.getElementById('c-fixed').value) || 0;
    let cash = Number(document.getElementById('c-cash').value) || 0;

    rowsData = [];
    for (let m = 1; m <= 24; m++) {
      const added = Math.round(newBase * Math.pow(1 + accel, m - 1));
      const lost = Math.round(users * churn);
      users = Math.max(0, users + added - lost);
      const gross = users * price;
      const fees = gross * feePct;
      const aiCost = users * cogs;
      const cacCost = added * cac;
      const netProfit = gross - fees - aiCost - cacCost - fixed;
      cash += netProfit;
      rowsData.push({ m, users, added, lost, gross, fees, aiCost, cacCost, netProfit, cash });
    }

    const m12 = rowsData[11];
    const m24 = rowsData[23];
    const netArpu = Math.max(0, price * (1 - feePct) - cogs);
    const ltv = netArpu / churn;
    const ratio = cac > 0 ? (ltv / cac).toFixed(1) + 'x' : '∞ (Organic)';

    document.getElementById('k-m12').textContent = fmt(m12.gross - m12.fees);
    document.getElementById('k-m24arr').textContent = fmt(m24.gross * 12);
    document.getElementById('k-ltvcac').textContent = ratio;
    const endEl = document.getElementById('k-endcash');
    endEl.textContent = fmt(m24.cash);
    endEl.style.color = m24.cash >= 0 ? '#34d399' : '#ef4444';

    const maxGross = Math.max(1, ...rowsData.map(r => r.gross));
    document.getElementById('chart-bars').innerHTML = rowsData.map(r => {
      const h = Math.max(3, Math.round((r.gross / maxGross) * 100));
      return '<div class="bar-col" title="M' + r.m + ': ' + fmt(r.gross) + '"><div class="bar-fill" style="height:' + h + '%"></div><div class="bar-lbl">M' + r.m + '</div></div>';
    }).join('');

    document.getElementById('tbl-body').innerHTML = rowsData.map(r => \`
      <tr>
        <td>Month \${r.m}</td>
        <td>\${r.users.toLocaleString()} <span style="color:#64748b;font-size:0.72rem;">(+\${r.added}/-\${r.lost})</span></td>
        <td>\${fmt(r.gross)}</td>
        <td>\${fmt(r.fees)}</td>
        <td>\${fmt(r.aiCost)}</td>
        <td>\${fmt(r.cacCost)}</td>
        <td style="color:\${r.netProfit >= 0 ? '#34d399' : '#f87171'};font-weight:700;">\${fmt(r.netProfit)}</td>
        <td style="font-weight:700;">\${fmt(r.cash)}</td>
      </tr>\`).join('');
  }

  ids.forEach(id => document.getElementById(id).addEventListener('input', run));

  document.getElementById('btn-dl-csv').addEventListener('click', () => {
    const hdr = ['Month','Active Users','Added','Churned','Gross MRR','Payment Fees','AI & Cloud COGS','CAC Spend','Net Profit','Ending Cash'];
    const lines = [hdr.join(',')].concat(rowsData.map(r => [r.m,r.users,r.added,r.lost,r.gross.toFixed(2),r.fees.toFixed(2),r.aiCost.toFixed(2),r.cacCost.toFixed(2),r.netProfit.toFixed(2),r.cash.toFixed(2)].join(',')));
    const b = new Blob([lines.join('\\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = '24-month-founder-cfo-forecast.csv';
    a.click();
  });

  document.getElementById('btn-save-json').addEventListener('click', () => {
    const snap = Object.fromEntries(ids.map(id => [id, document.getElementById(id).value]));
    const b = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = 'founder-scenario.json';
    a.click();
  });

  run();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, 'Founder-CFO-Simulator.html'), simulatorHtml, 'utf8');

// 2. 2026 Verified MoR & Gateway Audit Matrix CSV
const matrixHeaders = [
  'Platform',
  'Category',
  'Merchant of Record',
  'Fixed Monthly USD',
  'Base Rate %',
  'Fixed Fee USD',
  'Intl Card Surcharge %',
  'FX Surcharge %',
  'Recurring Sub Surcharge %',
  'PayPal Surcharge %',
  'Best For',
  'Hidden Fee Watchout'
];
const matrixRows = PLATFORMS.map((p) =>
  [
    `"${p.name}"`,
    `"${p.categoryLabel}"`,
    p.isMoR ? 'Yes' : 'No',
    p.monthlyFeeUsd,
    p.baseRatePct,
    p.fixedFeeUsd,
    p.intlCardSurchargePct,
    p.fxSurchargePct,
    p.subscriptionSurchargePct,
    p.paypalSurchargePct,
    `"${p.bestFor.replace(/"/g, '""')}"`,
    `"${p.hiddenFeeWatch.replace(/"/g, '""')}"`
  ].join(',')
);
fs.writeFileSync(
  path.join(OUT_DIR, '2026-MoR-and-Gateway-Audit-Matrix.csv'),
  [matrixHeaders.join(','), ...matrixRows].join('\n'),
  'utf8'
);

// 3. 24-Month Spreadsheet Starter CSV
const sheetLines = [
  'Scenario,Monthly Price USD,Active Users,Monthly Churn %,Processor Effective %,LLM & Infra Cost Per User,Net Margin %,Annual Founder Take-Home USD',
  '"Micro-SaaS Starter ($29 on Creem)",29,50,5.0,4.6,0.80,92.6%,$16119',
  '"Scaling AI Wrapper ($29 on Polar Pro)",29,250,6.0,4.8,3.20,84.1%,$73167',
  '"Global B2B SaaS ($79 on Paddle)",79,150,3.2,5.6,1.50,92.5%,$131535',
  '"Paid Newsletter ($10 on beehiiv Lite)",10,400,4.5,6.8,0.00,91.9%,$44136',
  '"Digital Template Shop ($39 on Polar)",39,120,0.0,5.8,0.00,94.2%,$52899'
];
fs.writeFileSync(
  path.join(OUT_DIR, 'SaaS-Unit-Economics-Benchmarks-2026.csv'),
  sheetLines.join('\n'),
  'utf8'
);

// 4. Comprehensive 2026 Indie Pricing & Tax Playbook Markdown
const playbookMd = `# The 2026 Indie Founder Pricing, Margin & Global Tax Playbook

Thank you for downloading **The 2026 Founder Margin & Pricing CFO Kit**!

## Quick Start
1. Double-click **\`Founder-CFO-Simulator.html\`** to launch the interactive 24-month runway & churn modeler right in your browser (100% offline).
2. Import **\`2026-MoR-and-Gateway-Audit-Matrix.csv\`** and **\`SaaS-Unit-Economics-Benchmarks-2026.csv\`** into Google Sheets, Excel, or Notion.

---

## 1. Exact 2026 Platform Switch & Breakeven Thresholds

* **$0 to $1,380/mo (SaaS & AI Apps):** Use **Creem.io** (3.9% + 40¢, 0% intl card fee) or **Polar.sh Starter** (5% + 50¢) to get full global VAT/sales tax compliance with **$0 fixed monthly overhead**.
* **Past ~$1,380/mo (SaaS & Developer Tools):** Upgrade **Polar.sh Starter → Polar Pro ($20/mo)**. Dropping from 5% + 50¢ to 3.8% + 40¢ immediately nets extra profit every month above ~$1,380.
* **Past ~$21,500/mo:** Upgrade **Polar Pro → Polar Growth ($100/mo)** (3.6% + 35¢), or negotiate custom enterprise volume rates on **Paddle** if >60% of customers pay outside the US.
* **Paid Newsletters (~$490/mo Crossover):** Start free on **Substack** if you need Notes discovery from 0 readers, OR launch on **beehiiv** once paid subscriptions cross **~$490/month** (~50 subscribers at $10/mo). Above $490/mo, Substack's permanent 10% cut costs more than beehiiv Lite's flat monthly fee—saving **$2,400+/year at $2,500 MRR**.
* **Digital Downloads & Notion Templates:** Migrate direct links off **Gumroad** (10% + 50¢ + ~2.9% + 30¢ card processing) to **Polar**, **Creem**, or **Whop**, keeping Gumroad strictly as a secondary discovery funnel if Gumroad Discover sends you free marketplace buyers.

---

## 2. The Fixed-Fee Micro-Pricing Trap (And How to Fix It Today)

On a **$5/month** plan, a 50¢ fixed checkout fee equals **10.0%** before the percentage fee is even touched!
* **Fix #1:** Raise entry plans from $5–$7/mo to **$12–$19/mo** and bundle higher-value templates or usage credits.
* **Fix #2:** Make **Annual Billing (2 Months Free)** the default toggle on your pricing page. One $99/year charge incurs **one** 40¢–50¢ fixed fee instead of twelve ($0.40 vs $6.00), boosting net margin AND giving you 10 months of upfront cashflow to fund acquisition.

---

## 3. AI Wrapper Margin Guardrails (Avoiding "Death by Power User")

Never offer "Unlimited Frontier Reasoning" on a $19/mo plan.
1. **Route 80% of lightweight tasks** (classification, titles, summaries) to fast tiers (~$0.15/$0.60 per 1M tokens).
2. **Enforce monthly credit pools** so the 99th-percentile power user cannot burn more than **35% of your post-fee net price** (e.g., max $9.00 token cap on a $29/mo subscription).
3. Sell **$10 Top-Up Credit Packs** (one-time checkout, zero churn liability, 75%+ margin).

---

## 4. EU VAT, UK VAT & US Economic Nexus in Plain English

* **EU & UK Digital Services VAT:** Strictly **zero minimum revenue threshold** for non-resident sellers selling digital software/downloads to consumers (B2C). Technically, your very first €19 sale to Germany or £19 sale to London owes local VAT.
* **Why Indie Founders Use a Merchant of Record (Polar, Creem, Paddle, Lemon Squeezy, Dodo):** The MoR legally acts as the seller of record on the buyer's receipt, collects local VAT/GST/sales tax, and files global tax returns under *their* registrations—saving solo founders $2,500–$6,000/yr in multi-jurisdiction tax accounting.
`;

fs.writeFileSync(
  path.join(OUT_DIR, '2026-Indie-Pricing-and-Global-Tax-Playbook.md'),
  playbookMd,
  'utf8'
);

// 5. Package into ready-to-upload .ZIP archive
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}

try {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${OUT_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force"`,
    { stdio: 'pipe' }
  );
  console.log(`Built ready-to-sell digital product bundle: ${ZIP_PATH}`);
} catch (err) {
  console.warn('Compress-Archive warning (folder output still ready):', err.message);
}
