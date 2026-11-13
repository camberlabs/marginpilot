import { PLATFORMS } from '../data/platforms.mjs';
import { MATCHUPS } from '../data/matchups.mjs';
import { compareAllPlatforms, calculatePlatformResult } from '../engine/calculator-core.mjs';
import { renderLayout, renderCalculatorWidget, esc, fmtUsd } from './layout.mjs';

export function buildPlatformPage(platform, config, basePath = '') {
  const defaults = {
    grossMonthly: 5000,
    avgOrderValue: platform.category === 'newsletter' ? 10 : 29,
    billingType: platform.id === 'gumroad' || platform.id === 'shopify' ? 'onetime' : 'recurring',
    intlSharePct: 40,
    fxSharePct: 20,
    paypalSharePct: 15,
    requireGlobalTax: true
  };

  const selfRes = calculatePlatformResult(platform, defaults);
  const allRes = compareAllPlatforms(defaults);
  const topAlternatives = allRes.results.filter((r) => r.platformId !== platform.id).slice(0, 3);

  const calcHtml = renderCalculatorWidget({
    config,
    defaults,
    basePath
  });

  const directMatchups = MATCHUPS.filter(
    (m) => m.platformA.id === platform.id || m.platformB.id === platform.id
  );

  const bodyHtml = `
    ${calcHtml}

    <section class="content-section" style="padding-top:8px;">
      <div class="container">
        <div class="content-card">
          <h2>${esc(platform.name)} 2026 Fee X-Ray &amp; Hidden Surcharges</h2>
          <p style="color:#475569;margin-bottom:16px;">
            ${esc(platform.tagline)} Best suited for: <strong>${esc(platform.bestFor)}</strong>.
          </p>

          <div class="table-scroll">
            <table class="data-table tabular">
              <thead>
                <tr>
                  <th>Fee Component</th>
                  <th>2026 Rate</th>
                  <th>Impact at ${fmtUsd(defaults.grossMonthly)}/mo ($${defaults.avgOrderValue} AOV)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fixed Monthly Plan</td>
                  <td>${platform.monthlyFeeUsd > 0 ? fmtUsd(platform.monthlyFeeUsd) + '/mo' : '$0/mo'}${platform.tiers ? ' (Tiered Ladder Available)' : ''}</td>
                  <td>${fmtUsd(selfRes.monthlyPlatformFee)}/mo</td>
                </tr>
                <tr>
                  <td>Base Percentage Fee</td>
                  <td>${platform.baseRatePct}%</td>
                  <td>${fmtUsd(selfRes.basePercentFee)}/mo</td>
                </tr>
                <tr>
                  <td>Fixed Per-Transaction Fee</td>
                  <td>$${platform.fixedFeeUsd.toFixed(2)} per sale</td>
                  <td>${fmtUsd(selfRes.fixedTransactionFees)}/mo (~${Math.round(selfRes.txCount)} tx)</td>
                </tr>
                <tr>
                  <td>International Card Surcharge</td>
                  <td>+${platform.intlCardSurchargePct}%</td>
                  <td>${fmtUsd(selfRes.intlFee)}/mo (at ${defaults.intlSharePct}% intl)</td>
                </tr>
                <tr>
                  <td>Recurring / Tax / PayPal Add-ons</td>
                  <td>+${platform.subscriptionSurchargePct}% Sub · +${platform.paypalSurchargePct}% PayPal · +${platform.taxAddonPct}% Tax</td>
                  <td>${fmtUsd(selfRes.subscriptionFee + selfRes.paypalFee + selfRes.taxAddonFee + selfRes.fxFee + selfRes.payoutFee)}/mo</td>
                </tr>
                <tr style="background:#f8fafc;font-weight:700;">
                  <td>Total Estimated Fees &amp; Net Payout</td>
                  <td>${selfRes.effectiveRatePct.toFixed(2)}% Effective Rate</td>
                  <td>${fmtUsd(selfRes.totalFees)} fees → <span style="color:#059669;">${fmtUsd(selfRes.netMonthly)}/mo Net</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top:18px;background:#fffbeb;border:1px solid #fde68a;padding:14px 16px;border-radius:10px;font-size:0.9rem;">
            <strong>Founder Watchout:</strong> ${esc(platform.hiddenFeeWatch)}
          </div>
        </div>

        <div class="content-card">
          <h2>Strengths &amp; Tradeoffs of ${esc(platform.shortName)}</h2>
          <div class="pros-cons-grid">
            <div>
              <h3 style="color:#059669;margin-top:0;">Where ${esc(platform.shortName)} Wins</h3>
              <ul style="line-height:1.7;">
                ${platform.pros.map((p) => `<li>${esc(p)}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h3 style="color:#dc2626;margin-top:0;">Where ${esc(platform.shortName)} Costs Extra</h3>
              <ul style="line-height:1.7;">
                ${platform.cons.map((c) => `<li>${esc(c)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="content-card">
          <h2>Compare ${esc(platform.shortName)} Against Every Competitor</h2>
          <div class="link-grid">
            ${directMatchups
              .map((m) => {
                const other = m.platformA.id === platform.id ? m.platformB : m.platformA;
                return `
                <a class="link-card" href="${basePath}/vs/${m.slug}/">
                  <strong>${esc(platform.shortName)} vs ${esc(other.shortName)}</strong>
                  <span>Head-to-head 2026 fee calculator →</span>
                </a>`;
              })
              .join('')}
          </div>
        </div>
      </div>
    </section>`;

  const faqs = [
    {
      q: `How much does ${platform.name} actually take per sale in 2026?`,
      a: `${platform.name} starts at ${platform.baseRatePct}% + $${platform.fixedFeeUsd.toFixed(2)} per transaction${platform.monthlyFeeUsd > 0 ? ` plus $${platform.monthlyFeeUsd}/mo` : ' with $0 monthly fee'}. On ${fmtUsd(defaults.grossMonthly)}/mo at a $${defaults.avgOrderValue} average order with ${defaults.intlSharePct}% international buyers, your true effective fee rate is ${selfRes.effectiveRatePct.toFixed(2)}%, leaving ${fmtUsd(selfRes.netMonthly)}/mo net.`
    },
    {
      q: `Is ${platform.name} a Merchant of Record (MoR)?`,
      a: platform.isMoR
        ? `Yes. ${platform.name} acts as a Merchant of Record, automatically calculating, collecting, and remitting global EU VAT, UK VAT, and US sales taxes on your behalf.`
        : `No. ${platform.name} processes payments directly on your merchant account, meaning you remain legally responsible for tax registration, nexus tracking, and VAT/sales tax remittance.`
    },
    {
      q: `What are the highest-payout alternatives to ${platform.shortName}?`,
      a: `At ${fmtUsd(defaults.grossMonthly)}/mo gross revenue, the top net-payout alternatives are ${topAlternatives.map((t) => `${t.platformName} (${fmtUsd(t.netMonthly)}/mo net)`).join(', ')}.`
    }
  ];

  return renderLayout({
    config,
    basePath,
    canonicalPath: `/calculators/${platform.slug}-fee-calculator/`,
    title: `${platform.name} Fee Calculator (2026): Real Take-Home & Hidden Fees`,
    metaDescription: `Calculate exact 2026 ${platform.name} fees, international card surcharges, and net monthly payout. Compare ${platform.shortName} side-by-side against ${topAlternatives.map((t) => t.shortName).join(', ')}.`,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Platform Calculators', path: '/directory/' },
      { label: `${platform.shortName} Fee Calculator`, path: `/calculators/${platform.slug}-fee-calculator/` }
    ],
    h1: `${platform.name} Fee & Take-Home Calculator (2026)`,
    heroSub: `${platform.tagline} Audit every hidden surcharge and compare against 11 alternatives in real time.`,
    bodyHtml,
    faqs
  });
}
