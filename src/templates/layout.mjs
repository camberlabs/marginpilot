import { PLATFORMS } from '../data/platforms.mjs';
import { compareAllPlatforms } from '../engine/calculator-core.mjs';
import { AI_MODELS_2026 } from '../data/scenarios.mjs';

export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function fmtUsd(n, decimals = 0) {
  return (
    '$' +
    Number(n || 0).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  );
}

export function renderProKitCard(config, basePath = '') {
  const dp = config.digitalProduct;
  if (!dp || !dp.enabled) return '';
  const href =
    dp.checkoutUrl && !dp.checkoutUrl.startsWith('#')
      ? dp.checkoutUrl
      : `${basePath}/pro-kit/`;

  return `
  <aside class="pro-kit-card" id="pro-kit-offer">
    <div>
      <span class="pro-kit-badge">${esc(dp.badge)}</span>
      <h3>${esc(dp.title)}</h3>
      <p>${esc(dp.subtitle)}</p>
      <ul class="pro-kit-list">
        <li>✓ Offline 24-Month MRR, Churn &amp; AI Runway Simulator</li>
        <li>✓ Excel / Google Sheets Unit Economics Templates</li>
        <li>✓ Global EU VAT &amp; US Nexus Breakeven Playbook</li>
      </ul>
    </div>
    <div class="pro-price-box">
      <div style="margin-bottom:8px;">
        <span class="price-strike">${esc(dp.originalPriceDisplay)}</span>
        <span class="price-now tabular">${esc(dp.priceDisplay)}</span>
      </div>
      <a class="btn-primary" style="width:100%;" href="${esc(href)}">Get Instant Access →</a>
      <div style="font-size:0.74rem;color:#94a3b8;margin-top:7px;">One-time purchase · Free 2026 updates</div>
    </div>
  </aside>`;
}

export function renderCalculatorWidget({
  config,
  defaults,
  filterIds = null,
  isAiMode = false,
  aiDefaults = null,
  basePath = ''
}) {
  const initial = compareAllPlatforms(defaults, filterIds);
  const top = initial.winner;
  const bottom = initial.worst;
  const second = initial.results[1] || bottom;
  const topAff = config.affiliateLinks[top.affiliateKey] || {
    url: '#',
    ctaLabel: `Try ${top.shortName}`
  };

  const presets = [
    { label: '$1k MRR Indie', data: { grossMonthly: 1000, avgOrderValue: 29, billingType: 'recurring', intlSharePct: 40, paypalSharePct: 10 } },
    { label: '$5k MRR SaaS', data: { grossMonthly: 5000, avgOrderValue: 29, billingType: 'recurring', intlSharePct: 45, paypalSharePct: 15 } },
    { label: '$25k MRR Scale', data: { grossMonthly: 25000, avgOrderValue: 59, billingType: 'recurring', intlSharePct: 50, paypalSharePct: 10 } },
    { label: '$10 Newsletter', data: { grossMonthly: 2000, avgOrderValue: 10, billingType: 'recurring', intlSharePct: 20, paypalSharePct: 0 } },
    { label: '$39 Template', data: { grossMonthly: 3500, avgOrderValue: 39, billingType: 'onetime', intlSharePct: 45, paypalSharePct: 20 } }
  ];

  const bootPayload = {
    basePath,
    platforms: PLATFORMS,
    affiliateLinks: config.affiliateLinks,
    defaults,
    filterIds,
    isAiMode,
    aiDefaults,
    aiModels: isAiMode ? AI_MODELS_2026 : undefined
  };

  const savingsVal =
    initial.results.length === 2
      ? Math.abs(top.netAnnual - second.netAnnual)
      : initial.maxAnnualSpread;

  return `
  <section class="calc-section">
    <div class="container">
      <div class="calc-grid">
        <div class="panel panel-sticky">
          <div class="panel-title">
            <span>Configure Your Revenue</span>
            <span style="font-size:0.75rem;color:#059669;font-weight:700;">Live 2026 Rates</span>
          </div>

          <div class="preset-pills">
            ${presets
              .map(
                (p) =>
                  `<button type="button" class="preset-btn" data-preset='${ JSON.stringify(p.data) }'>${esc(p.label)}</button>`
              )
              .join('')}
          </div>

          <div class="control-group">
            <div class="control-header">
              <label for="inp-rev-num">Monthly Gross Revenue</label>
              <span class="control-val tabular" id="val-rev">${fmtUsd(defaults.grossMonthly)}/mo</span>
            </div>
            <input type="range" id="inp-rev-slider" min="100" max="50000" step="100" value="${Math.min(50000, defaults.grossMonthly)}" />
            <div style="margin-top:6px;">
              <input type="number" id="inp-rev-num" min="0" max="1000000" step="100" value="${defaults.grossMonthly}" aria-label="Monthly Gross Revenue in USD" />
            </div>
          </div>

          <div class="control-group">
            <div class="control-header">
              <label for="inp-aov-num">Average Price / Order (AOV)</label>
              <span class="control-val tabular" id="val-aov">${fmtUsd(defaults.avgOrderValue)}</span>
            </div>
            <input type="range" id="inp-aov-slider" min="5" max="300" step="1" value="${Math.min(300, defaults.avgOrderValue)}" />
            <div style="margin-top:6px;">
              <input type="number" id="inp-aov-num" min="1" max="10000" step="1" value="${defaults.avgOrderValue}" aria-label="Average Order Value in USD" />
            </div>
          </div>

          <div class="control-group">
            <div class="control-header"><span>Billing Model</span></div>
            <div class="segmented">
              <button type="button" id="btn-bill-recurring" class="${defaults.billingType !== 'onetime' ? 'active' : ''}">Recurring Sub</button>
              <button type="button" id="btn-bill-onetime" class="${defaults.billingType === 'onetime' ? 'active' : ''}">One-Time Sale</button>
            </div>
          </div>

          <div class="control-group">
            <div class="control-header">
              <label for="inp-intl-slider">International Buyers</label>
              <span class="control-val tabular" id="val-intl">${defaults.intlSharePct}%</span>
            </div>
            <input type="range" id="inp-intl-slider" min="0" max="100" step="5" value="${defaults.intlSharePct}" />
          </div>

          <div class="control-group">
            <div class="control-header">
              <label for="inp-pp-slider">PayPal / Alt Wallet Share</label>
              <span class="control-val tabular" id="val-pp">${defaults.paypalSharePct}%</span>
            </div>
            <input type="range" id="inp-pp-slider" min="0" max="60" step="5" value="${defaults.paypalSharePct}" />
          </div>

          <label class="toggle-row">
            <span>Include Global Tax / VAT Add-ons</span>
            <input type="checkbox" id="inp-tax-check" ${defaults.requireGlobalTax !== false ? 'checked' : ''} />
          </label>

          <div class="utility-actions">
            <button type="button" class="btn-secondary" id="btn-copy-link">Copy Scenario Link</button>
            <button type="button" class="btn-secondary" id="btn-export-csv">Export CSV</button>
          </div>
        </div>

        <div class="panel">
          ${
            isAiMode
              ? `
          <div class="ai-box">
            <div style="font-weight:800;font-size:0.96rem;color:#1e3a8a;">AI Wrapper Token &amp; Inference Cost Layer</div>
            <div class="ai-grid">
              <div>
                <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:4px;">LLM Model Tier</label>
                <select id="ai-model-select">
                  ${AI_MODELS_2026.map(
                    (m) =>
                      `<option value="${m.id}" ${m.id === (aiDefaults?.modelId || 'frontier-pro') ? 'selected' : ''}>${esc(m.name)} ($${m.inputPer1M}/$${m.outputPer1M} per 1M)</option>`
                  ).join('')}
                </select>
              </div>
              <div>
                <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:4px;">Active Paid Users</label>
                <input type="number" id="ai-users-input" value="${aiDefaults?.activeUsers ?? 200}" min="1" max="100000" />
              </div>
              <div>
                <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:4px;">Prompts / User / Mo</label>
                <input type="number" id="ai-prompts-input" value="${aiDefaults?.promptsPerUserPerMonth ?? 180}" min="1" max="50000" />
              </div>
            </div>
            <div id="ai-summary-text" style="margin-top:10px;font-size:0.84rem;color:#1e40af;"></div>
          </div>`
              : ''
          }

          <div class="kpi-strip tabular">
            <div class="kpi-card highlight">
              <div class="kpi-label">Best Net Take-Home</div>
              <div class="kpi-value" id="kpi-winner-net">${fmtUsd(top.netMonthly)}</div>
              <div class="kpi-sub" id="kpi-winner-sub">Best on ${esc(top.shortName)} (${fmtUsd(top.netAnnual)}/yr)</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Lowest Effective Fee</div>
              <div class="kpi-value" id="kpi-rate">${top.effectiveRatePct.toFixed(2)}%</div>
              <div class="kpi-sub" id="kpi-rate-sub">${fmtUsd(top.totalFees)}/mo total fees (~${Math.round(top.txCount)} sales)</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Annual Fee Savings</div>
              <div class="kpi-value" id="kpi-savings">+${fmtUsd(savingsVal)}/yr</div>
              <div class="kpi-sub" id="kpi-savings-sub">Saved by picking #1 vs lowest-ranked option</div>
            </div>
          </div>

          <div class="winner-banner">
            <div>
              <h3 id="winner-headline">#1 Highest Take-Home: ${esc(top.platformName)}</h3>
              <p id="winner-desc">You keep ${fmtUsd(top.netMonthly)}/mo (${(100 - top.effectiveRatePct).toFixed(1)}% of gross) — saving ${fmtUsd(savingsVal)}/year.</p>
            </div>
            <a class="btn-primary" id="winner-cta" href="${esc(topAff.url)}" target="_blank" rel="noopener">${esc(topAff.ctaLabel)} →</a>
          </div>

          <div class="result-list" id="calc-results-list">
            ${initial.results
              .map((r, idx) => {
                const gross = Math.max(1, defaults.grossMonthly);
                const keepPct = Math.max(0, Math.min(100, (r.netMonthly / gross) * 100));
                const baseCore = r.monthlyPlatformFee + r.basePercentFee + r.fixedTransactionFees;
                const basePct = Math.max(0, Math.min(100 - keepPct, (baseCore / gross) * 100));
                const surPct = Math.max(0, 100 - keepPct - basePct);
                const aff = config.affiliateLinks[r.affiliateKey] || {
                  url: '#',
                  ctaLabel: `Visit ${r.shortName}`
                };
                const diffFromTop = top.netMonthly - r.netMonthly;

                return `
                <div class="result-card ${idx === 0 ? 'rank-1' : ''}">
                  <div class="result-top">
                    <div class="result-name-wrap">
                      <span class="rank-pill">#${idx + 1}</span>
                      <a class="result-title" href="${basePath}/calculators/${r.slug}-fee-calculator/">${esc(r.platformName)}</a>
                      ${
                        r.isMoR
                          ? '<span class="tag-badge tag-mor">MoR Tax Handled</span>'
                          : '<span class="tag-badge tag-diy">DIY Tax</span>'
                      }
                      ${
                        r.activeTierName && r.activeTierName !== 'Standard'
                          ? `<span class="tag-badge">${esc(r.activeTierName)}</span>`
                          : ''
                      }
                    </div>
                    <div class="result-numbers tabular">
                      <div class="net-amount">${fmtUsd(r.netMonthly)}<span style="font-size:0.8rem;font-weight:600;color:#64748b;">/mo net</span></div>
                      <div class="fee-meta">${fmtUsd(r.totalFees)} fees (${r.effectiveRatePct.toFixed(2)}%)${
                  idx > 0
                    ? ` · <span style="color:#dc2626;">-${fmtUsd(diffFromTop * 12)}/yr</span>`
                    : ' · <span style="color:#059669;font-weight:700;">Best Net</span>'
                }</div>
                    </div>
                  </div>
                  <div class="bar-track">
                    <div class="bar-keep" style="width:${keepPct.toFixed(2)}%"></div>
                    <div class="bar-base" style="width:${basePct.toFixed(2)}%"></div>
                    <div class="bar-surcharge" style="width:${surPct.toFixed(2)}%"></div>
                  </div>
                  <div class="breakdown-chips tabular">
                    <div class="chip-list">
                      <span>Base + Fixed: <strong>${fmtUsd(baseCore)}</strong></span>
                      <span>Intl/FX/Sub Add-ons: <strong>${fmtUsd(r.surchargesTotal)}</strong></span>
                    </div>
                    <div class="result-actions">
                      <a class="result-cta" href="${esc(aff.url)}" target="_blank" rel="noopener">${esc(aff.ctaLabel)} ↗</a>
                    </div>
                  </div>
                </div>`;
              })
              .join('')}
          </div>

          ${renderProKitCard(config, basePath)}
        </div>
      </div>
    </div>
    <script type="application/json" id="mp-boot-data">${JSON.stringify(bootPayload)}</script>
  </section>`;
}

export function renderLayout({
  config,
  basePath = '',
  canonicalPath = '/',
  title,
  metaDescription,
  breadcrumbs = [],
  badgeText = 'Verified November 2026 Fee Schedules',
  h1,
  heroSub,
  bodyHtml,
  faqs = [],
  includeCalcScript = true
}) {
  const siteUrl = config.brand.siteUrl.replace(/\/$/, '');
  const fullCanonical = `${siteUrl}${basePath}${canonicalPath}`;

  const schemaGraph = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      url: fullCanonical,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      description: metaDescription
    }
  ];

  if (breadcrumbs.length > 0) {
    schemaGraph.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.label,
        item: `${siteUrl}${basePath}${b.path}`
      }))
    });
  }

  if (faqs.length > 0) {
    schemaGraph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a
        }
      }))
    });
  }

  const faqHtml =
    faqs.length > 0
      ? `
    <div class="content-card">
      <h2>Frequently Asked Questions</h2>
      ${faqs
        .map(
          (f) => `
        <div class="faq-item">
          <h3 class="faq-q">${esc(f.q)}</h3>
          <p class="faq-a">${esc(f.a)}</p>
        </div>`
        )
        .join('')}
    </div>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(metaDescription)}" />
  <link rel="canonical" href="${esc(fullCanonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(metaDescription)}" />
  <meta property="og:url" content="${esc(fullCanonical)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(metaDescription)}" />
  <link rel="stylesheet" href="${basePath}/assets/styles.css" />
  <script type="application/ld+json">${JSON.stringify(schemaGraph)}</script>
</head>
<body>
  <header class="site-header">
    <div class="container nav-inner">
      <a class="brand-logo" href="${basePath}/">
        <span class="brand-mark">M</span>
        <span>${esc(config.brand.name)}</span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="${basePath}/">All-in-One Matrix</a>
        <a href="${basePath}/scenarios/ai-saas-wrapper-margin-calculator/">AI Margin Calc</a>
        <a href="${basePath}/vs/polar-vs-lemon-squeezy/">Polar vs LS</a>
        <a href="${basePath}/vs/beehiiv-vs-substack/">beehiiv vs Substack</a>
        <a href="${basePath}/directory/">All 95+ Calculators</a>
        <a class="nav-cta" href="${basePath}/pro-kit/">Founder CFO Kit (${esc(config.digitalProduct.priceDisplay)})</a>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      ${
        breadcrumbs.length > 0
          ? `<nav class="breadcrumbs" aria-label="Breadcrumb">
              ${breadcrumbs
                .map((b, idx) =>
                  idx < breadcrumbs.length - 1
                    ? `<a href="${basePath}${b.path}">${esc(b.label)}</a> <span>/</span>`
                    : `<span>${esc(b.label)}</span>`
                )
                .join(' ')}
            </nav>`
          : ''
      }
      <div class="hero-badge">● ${esc(badgeText)}</div>
      <h1>${esc(h1)}</h1>
      <p class="hero-sub">${esc(heroSub)}</p>
    </div>
  </section>

  <main>
    ${bodyHtml}
    ${
      faqHtml
        ? `<section class="content-section" style="padding-top:0;"><div class="container">${faqHtml}</div></section>`
        : ''
    }
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>${esc(config.brand.name)} — ${esc(config.brand.tagline)}</h4>
          <p style="max-width:360px;line-height:1.6;">
            Independent, transparent fee &amp; net take-home modeling for indie hackers, SaaS founders, AI builders, and newsletter creators. Updated ${esc(config.brand.lastVerifiedDate)}.
          </p>
          <p style="font-size:0.78rem;color:#64748b;">
            Disclosure: Some platform links may earn a partner referral commission at zero extra cost to you. Fee math is 100% deterministic and unranked by sponsorship.
          </p>
        </div>
        <div>
          <h4>Top Head-to-Head</h4>
          <ul>
            <li><a href="${basePath}/vs/polar-vs-lemon-squeezy/">Polar.sh vs Lemon Squeezy</a></li>
            <li><a href="${basePath}/vs/polar-vs-creem/">Polar.sh vs Creem.io</a></li>
            <li><a href="${basePath}/vs/paddle-vs-stripe/">Paddle vs Stripe Tax</a></li>
            <li><a href="${basePath}/vs/lemon-squeezy-vs-gumroad/">Lemon Squeezy vs Gumroad</a></li>
            <li><a href="${basePath}/vs/beehiiv-vs-substack/">beehiiv vs Substack</a></li>
            <li><a href="${basePath}/vs/whop-vs-gumroad/">Whop vs Gumroad</a></li>
          </ul>
        </div>
        <div>
          <h4>Platform Fee Audits</h4>
          <ul>
            <li><a href="${basePath}/calculators/polar-fee-calculator/">Polar.sh Fee Calculator</a></li>
            <li><a href="${basePath}/calculators/creem-fee-calculator/">Creem.io Fee Calculator</a></li>
            <li><a href="${basePath}/calculators/lemon-squeezy-fee-calculator/">Lemon Squeezy Calculator</a></li>
            <li><a href="${basePath}/calculators/stripe-fee-calculator/">Stripe SaaS Fee Calculator</a></li>
            <li><a href="${basePath}/calculators/whop-fee-calculator/">Whop Fee Calculator</a></li>
            <li><a href="${basePath}/calculators/gumroad-fee-calculator/">Gumroad True Fee Calculator</a></li>
          </ul>
        </div>
        <div>
          <h4>Founder Scenarios</h4>
          <ul>
            <li><a href="${basePath}/scenarios/ai-saas-wrapper-margin-calculator/">AI SaaS Token Margin Calc</a></li>
            <li><a href="${basePath}/scenarios/saas-5k-mrr-fee-calculator/">$5,000 MRR SaaS Audit</a></li>
            <li><a href="${basePath}/scenarios/substack-to-beehiiv-savings-calculator/">Substack Switcher Calc</a></li>
            <li><a href="${basePath}/scenarios/notion-template-store-fee-calculator/">Notion Template Fees</a></li>
            <li><a href="${basePath}/pro-kit/">2026 Founder CFO Kit</a></li>
            <li><a href="${basePath}/directory/">Full Calculator Directory</a></li>
          </ul>
        </div>
      </div>
      <div style="border-top:1px solid #1e293b;padding-top:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <span>© ${new Date().getFullYear()} ${esc(config.brand.name)}. Built for bootstrapped founders.</span>
        <span><a href="${basePath}/sitemap.xml">XML Sitemap</a> · <a href="${basePath}/llms.txt">llms.txt (AI Index)</a></span>
      </div>
    </div>
  </footer>
  ${includeCalcScript ? `<script src="${basePath}/assets/client-app.js" defer></script>` : ''}
</body>
</html>`;
}
