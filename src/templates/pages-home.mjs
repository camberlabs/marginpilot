import { PLATFORMS } from '../data/platforms.mjs';
import { MATCHUPS } from '../data/matchups.mjs';
import { SCENARIOS } from '../data/scenarios.mjs';
import { renderLayout, renderCalculatorWidget, renderProKitCard, esc, fmtUsd } from './layout.mjs';

export function buildHomePage(config, basePath = '') {
  const defaults = {
    grossMonthly: 5000,
    avgOrderValue: 29,
    billingType: 'recurring',
    intlSharePct: 45,
    fxSharePct: 25,
    paypalSharePct: 15,
    requireGlobalTax: true
  };

  const calcHtml = renderCalculatorWidget({ config, defaults, basePath });

  const featuredMatchups = [
    'polar-vs-lemon-squeezy',
    'polar-vs-creem',
    'paddle-vs-lemon-squeezy',
    'paddle-vs-stripe',
    'lemon-squeezy-vs-dodo-payments',
    'lemon-squeezy-vs-gumroad',
    'whop-vs-gumroad',
    'beehiiv-vs-substack',
    'whop-vs-patreon',
    'creem-vs-stripe',
    'polar-vs-paddle',
    'substack-vs-patreon'
  ]
    .map((s) => MATCHUPS.find((m) => m.slug === s))
    .filter(Boolean);

  // Fallback to first 12 if any slug differs
  const matchupCards = (featuredMatchups.length >= 8 ? featuredMatchups : MATCHUPS.slice(0, 12))
    .map(
      (m) => `
      <a class="link-card" href="${basePath}/vs/${m.slug}/">
        <strong>${esc(m.platformA.shortName)} vs ${esc(m.platformB.shortName)}</strong>
        <span>Compare hidden FX, recurring &amp; MoR fees →</span>
      </a>`
    )
    .join('');

  const bodyHtml = `
    ${calcHtml}

    <section class="content-section" style="padding-top:8px;">
      <div class="container">
        <div class="content-card">
          <h2>2026 Master Payment &amp; Merchant of Record Fee Schedule</h2>
          <p style="color:#475569;margin-bottom:18px;">
            Headline rates rarely tell the truth. Once you factor in international cards (+1.5%), currency conversion (+1%), subscription billing (+0.5%–0.7%), and PayPal surcharges, effective take-rates shift dramatically.
          </p>
          <div class="table-scroll">
            <table class="data-table tabular">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Model</th>
                  <th>Monthly Fee</th>
                  <th>Base Card Rate</th>
                  <th>Intl / Sub / PayPal Add-ons</th>
                  <th>Audit</th>
                </tr>
              </thead>
              <tbody>
                ${PLATFORMS.map(
                  (p) => `
                  <tr>
                    <td><strong>${esc(p.name)}</strong></td>
                    <td>${p.isMoR ? 'Merchant of Record' : 'Direct / DIY Tax'}</td>
                    <td>${p.monthlyFeeUsd > 0 ? fmtUsd(p.monthlyFeeUsd) + '/mo' : '$0/mo'}${p.tiers ? ' (Ladder)' : ''}</td>
                    <td>${p.baseRatePct}% + $${p.fixedFeeUsd.toFixed(2)}</td>
                    <td>+${p.intlCardSurchargePct}% Intl · +${p.subscriptionSurchargePct}% Sub · +${p.paypalSurchargePct}% PayPal</td>
                    <td><a href="${basePath}/calculators/${p.slug}-fee-calculator/">Calculator →</a></td>
                  </tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="content-card">
          <h2>Popular Head-to-Head Fee Comparisons</h2>
          <div class="link-grid">
            ${matchupCards}
          </div>
          <div style="margin-top:16px;">
            <a href="${basePath}/directory/" style="font-weight:700;">Browse all ${MATCHUPS.length + SCENARIOS.length + PLATFORMS.length} interactive calculators →</a>
          </div>
        </div>

        <div class="content-card">
          <h2>Founder Scenario &amp; AI Margin Calculators</h2>
          <div class="link-grid">
            ${SCENARIOS.slice(0, 9)
              .map(
                (s) => `
              <a class="link-card" href="${basePath}/scenarios/${s.slug}/">
                <strong>${esc(s.h1.split(':')[0])}</strong>
                <span>${esc(s.subtitle.slice(0, 72))}...</span>
              </a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>`;

  const faqs = [
    {
      q: 'What is the cheapest Merchant of Record for SaaS and AI apps in 2026?',
      a: 'Under $1,380/mo in revenue, Creem.io (3.9% + 40¢, $0/mo, 0% international surcharge) typically yields the highest net payout among full Merchants of Record. Above ~$1,400/mo, Polar.sh Pro ($20/mo, 3.8% + 40¢) and Polar Growth ($100/mo, 3.6% + 35¢) overtake flat-rate 5% platforms—unless over 65% of buyers use international cards, where Creem and Paddle (5% + 50¢ with 0% international surcharge) perform exceptionally well.'
    },
    {
      q: 'Why does Stripe often cost almost as much as a Merchant of Record on global SaaS?',
      a: 'While Stripe starts at 2.9% + 30¢ for domestic one-time cards, recurring global SaaS stacks +0.5% for Stripe Billing, +0.5% for Stripe Tax, +1.5% for international cards, and +1% for currency conversion—pushing cross-border renewals to ~6.4% + 30¢ while still leaving VAT/sales tax remittance and filing to the founder.'
    },
    {
      q: 'At what revenue does beehiiv beat Substack for paid newsletters?',
      a: 'Substack charges 10% of revenue forever on top of Stripe processing + 0.7% recurring billing. beehiiv Lite ($49/mo annual-equivalent) charges a 0% platform cut, breaking even right around ~$490/mo in gross paid subscriptions (~50 paid readers at $10/mo).'
    }
  ];

  return renderLayout({
    config,
    basePath,
    canonicalPath: '/',
    title: 'SaaS, AI & Creator Payment Fee Calculator (2026) — Polar vs Creem vs Stripe vs Lemon Squeezy',
    metaDescription:
      'Interactive 2026 fee & take-home calculator comparing Polar.sh, Creem, Paddle, Lemon Squeezy, Dodo Payments, Stripe, Whop, Gumroad, beehiiv, and Substack.',
    h1: 'Keep Thousands More of Your SaaS, AI & Creator Revenue',
    heroSub:
      'Model hidden international card surcharges, subscription fees, PayPal cuts, and Merchant of Record tier ladders across 12 platforms in real time.',
    bodyHtml,
    faqs
  });
}

export function buildDirectoryPage(config, basePath = '') {
  const bodyHtml = `
    <section class="content-section">
      <div class="container">
        <div class="content-card">
          <h2>Platform-Specific Hidden Fee Calculators (${PLATFORMS.length})</h2>
          <div class="link-grid">
            ${PLATFORMS.map(
              (p) => `
              <a class="link-card" href="${basePath}/calculators/${p.slug}-fee-calculator/">
                <strong>${esc(p.name)} Fee Calculator</strong>
                <span>${esc(p.baseRatePct + '% + $' + p.fixedFeeUsd.toFixed(2))} · ${esc(p.categoryLabel)}</span>
              </a>`
            ).join('')}
          </div>
        </div>

        <div class="content-card">
          <h2>Founder Revenue &amp; AI Margin Scenarios (${SCENARIOS.length})</h2>
          <div class="link-grid">
            ${SCENARIOS.map(
              (s) => `
              <a class="link-card" href="${basePath}/scenarios/${s.slug}/">
                <strong>${esc(s.title.replace(' (2026)', ''))}</strong>
                <span>Interactive preset &amp; margin audit →</span>
              </a>`
            ).join('')}
          </div>
        </div>

        <div class="content-card">
          <h2>All Head-to-Head Platform Comparisons (${MATCHUPS.length})</h2>
          <div class="link-grid">
            ${MATCHUPS.map(
              (m) => `
              <a class="link-card" href="${basePath}/vs/${m.slug}/">
                <strong>${esc(m.platformA.shortName)} vs ${esc(m.platformB.shortName)}</strong>
                <span>Breakeven &amp; MRR tier table →</span>
              </a>`
            ).join('')}
          </div>
        </div>
      </div>
    </section>`;

  return renderLayout({
    config,
    basePath,
    canonicalPath: '/directory/',
    title: `All ${PLATFORMS.length + SCENARIOS.length + MATCHUPS.length} SaaS, MoR & Creator Fee Calculators — ${config.brand.name}`,
    metaDescription:
      'Browse every interactive Merchant of Record, payment gateway, AI SaaS token margin, and creator platform fee calculator for 2026.',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Calculator Directory', path: '/directory/' }
    ],
    h1: 'Complete 2026 Fee & Margin Calculator Directory',
    heroSub: 'Every head-to-head matchup, platform fee audit, and SaaS/creator unit-economics model in one place.',
    bodyHtml,
    includeCalcScript: false
  });
}

export function buildProKitPage(config, basePath = '') {
  const dp = config.digitalProduct;
  const externalCheckout =
    dp.checkoutUrl && !dp.checkoutUrl.startsWith('#') ? dp.checkoutUrl : null;

  const bodyHtml = `
    <section class="content-section">
      <div class="container">
        <div class="content-card" style="border:2px solid #059669;">
          <span class="tag-badge tag-mor" style="margin-bottom:10px;display:inline-block;">${esc(dp.badge)}</span>
          <h2 style="font-size:1.75rem;margin-bottom:10px;">${esc(dp.title)}</h2>
          <p style="font-size:1.05rem;color:#475569;max-width:760px;">
            Stop guessing whether your $19 or $29/mo plan actually makes money after churn, LLM API tokens, international card FX, and VAT compliance. Built specifically for bootstrapped SaaS founders, AI app builders, and digital creators.
          </p>

          <div class="pros-cons-grid" style="margin:24px 0;">
            <div style="background:#f8fafc;padding:20px;border-radius:12px;border:1px solid #e2e8f0;">
              <h3 style="margin-top:0;">What's Inside the Instant Download (.ZIP)</h3>
              <ul style="line-height:1.8;padding-left:20px;color:#334155;">
                <li><strong>Offline Founder CFO Simulator (<code>Founder-CFO-Simulator.html</code>):</strong> Zero-dependency interactive 24-month MRR, churn, CAC payback, AI token cost &amp; runway modeler that runs 100% offline in any browser with JSON/CSV save &amp; export.</li>
                <li><strong>24-Month SaaS Unit Economics Workbook (<code>.CSV</code> for Excel / Sheets):</strong> Pre-structured cohort churn, LTV:CAC, annual-plan cashflow boost, and founder salary forecast.</li>
                <li><strong>2026 MoR &amp; Gateway Audit Matrix (<code>.CSV</code>):</strong> Complete side-by-side fee formulas across 12 platforms.</li>
                <li><strong>The 2026 Indie Pricing &amp; Global Tax Playbook (<code>.MD</code> + Printable Guide):</strong> Exact MRR breakeven thresholds, annual pricing psychology, and EU/UK/US sales tax nexus rules.</li>
              </ul>
            </div>

            <div style="background:#0f172a;color:#fff;padding:26px;border-radius:12px;display:flex;flex-direction:column;justify-content:center;">
              <div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;color:#6ee7b7;font-weight:700;">Founder Launch Offer</div>
              <div style="margin:10px 0;">
                <span class="price-strike" style="font-size:1.15rem;">${esc(dp.originalPriceDisplay)}</span>
                <span class="price-now tabular" style="font-size:2.5rem;">${esc(dp.priceDisplay)}</span>
                <span style="color:#94a3b8;font-size:0.9rem;"> one-time</span>
              </div>
              <p style="color:#cbd5e1;font-size:0.9rem;margin-bottom:18px;">
                Save $500–$4,000+ in avoidable processor fees and mispriced plans in your first 12 months.
              </p>
              ${
                externalCheckout
                  ? `<a class="btn-primary" style="font-size:1rem;padding:14px 20px;" href="${esc(externalCheckout)}" target="_blank" rel="noopener">Buy &amp; Download Instantly (${esc(dp.priceDisplay)}) →</a>`
                  : `<a class="btn-primary" style="font-size:1rem;padding:14px 20px;" href="${basePath}/">Try the Free Online Calculators First →</a>
                     <p style="font-size:0.76rem;color:#94a3b8;margin-top:10px;margin-bottom:0;">Storefront checkout link configurable in <code>config/monetization.json</code>.</p>`
              }
            </div>
          </div>
        </div>
      </div>
    </section>`;

  return renderLayout({
    config,
    basePath,
    canonicalPath: '/pro-kit/',
    title: `${dp.title} — ${config.brand.name}`,
    metaDescription: dp.subtitle,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Founder CFO Kit', path: '/pro-kit/' }
    ],
    badgeText: 'Digital Financial Modeling Toolkit',
    h1: dp.title,
    heroSub: dp.subtitle,
    bodyHtml,
    includeCalcScript: false
  });
}
