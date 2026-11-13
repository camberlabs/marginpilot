import { calculatePlatformResult, findHeadToHeadBreakeven } from '../engine/calculator-core.mjs';
import { MATCHUPS } from '../data/matchups.mjs';
import { renderLayout, renderCalculatorWidget, esc, fmtUsd } from './layout.mjs';

export function buildVersusPage(matchup, config, basePath = '') {
  const { platformA: a, platformB: b, defaults, slug } = matchup;

  const resA = calculatePlatformResult(a, defaults);
  const resB = calculatePlatformResult(b, defaults);
  const analysis = findHeadToHeadBreakeven(a, b, defaults);

  const defaultWinner = resA.netMonthly >= resB.netMonthly ? a : b;
  const defaultLoser = resA.netMonthly >= resB.netMonthly ? b : a;
  const annualDiff = Math.abs(resA.netAnnual - resB.netAnnual);

  const calcHtml = renderCalculatorWidget({
    config,
    defaults,
    filterIds: [a.id, b.id],
    basePath
  });

  const relatedMatchups = MATCHUPS.filter(
    (m) =>
      m.slug !== slug &&
      (m.platformA.id === a.id ||
        m.platformB.id === a.id ||
        m.platformA.id === b.id ||
        m.platformB.id === b.id)
  ).slice(0, 8);

  const crossoverSentence = analysis.crossoverMonthlyUsd
    ? `Based on a $${defaults.avgOrderValue} average order (${defaults.intlSharePct}% international), the fee breakeven crossover between ${a.shortName} and ${b.shortName} happens near ${fmtUsd(analysis.crossoverMonthlyUsd)}/month in gross volume.`
    : `Across standard revenue tiers from $500/mo to $50,000/mo at a $${defaults.avgOrderValue} average order, ${defaultWinner.shortName} consistently leaves more net take-home revenue than ${defaultLoser.shortName}.`;

  const bodyHtml = `
    ${calcHtml}

    <section class="content-section" style="padding-top:8px;">
      <div class="container">
        <div class="content-card">
          <h2>${esc(a.shortName)} vs ${esc(b.shortName)}: Net Take-Home by Monthly Revenue Tier</h2>
          <p style="color:#475569;margin-bottom:18px;">
            ${esc(crossoverSentence)} Below is the exact pre-computed net payout assuming <strong>$${defaults.avgOrderValue} AOV</strong>, <strong>${defaults.billingType === 'onetime' ? 'one-time checkout' : 'recurring billing'}</strong>, and <strong>${defaults.intlSharePct}% international buyers</strong>:
          </p>
          <div class="table-scroll">
            <table class="data-table tabular">
              <thead>
                <tr>
                  <th>Gross Monthly Revenue</th>
                  <th>${esc(a.shortName)} Net / Mo (Eff. Fee)</th>
                  <th>${esc(b.shortName)} Net / Mo (Eff. Fee)</th>
                  <th>Higher Payout Winner</th>
                  <th>Annual Savings</th>
                </tr>
              </thead>
              <tbody>
                ${analysis.tierSnapshots
                  .map(
                    (row) => `
                  <tr>
                    <td><strong>${fmtUsd(row.grossMonthly)}/mo</strong></td>
                    <td>${fmtUsd(row.aNet)} <span style="color:#64748b;font-size:0.82rem;">(${row.aRate.toFixed(2)}%)</span></td>
                    <td>${fmtUsd(row.bNet)} <span style="color:#64748b;font-size:0.82rem;">(${row.bRate.toFixed(2)}%)</span></td>
                    <td><strong style="color:#059669;">${esc(row.winnerName)}</strong></td>
                    <td><strong>+${fmtUsd(row.annualSavings)}/yr</strong></td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="content-card">
          <h2>Side-by-Side Fee &amp; Tax Compliance Breakdown</h2>
          <div class="pros-cons-grid">
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
              <h3 style="margin-top:0;">${esc(a.name)}</h3>
              <p style="font-size:0.9rem;color:#475569;">${esc(a.tagline)}</p>
              <ul style="padding-left:18px;font-size:0.88rem;line-height:1.65;">
                ${a.pros.map((item) => `<li>${esc(item)}</li>`).join('')}
              </ul>
              <p style="font-size:0.83rem;background:#fffbeb;border:1px solid #fde68a;padding:10px;border-radius:8px;margin-bottom:0;">
                <strong>Hidden Fee Watch:</strong> ${esc(a.hiddenFeeWatch)}
              </p>
            </div>

            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
              <h3 style="margin-top:0;">${esc(b.name)}</h3>
              <p style="font-size:0.9rem;color:#475569;">${esc(b.tagline)}</p>
              <ul style="padding-left:18px;font-size:0.88rem;line-height:1.65;">
                ${b.pros.map((item) => `<li>${esc(item)}</li>`).join('')}
              </ul>
              <p style="font-size:0.83rem;background:#fffbeb;border:1px solid #fde68a;padding:10px;border-radius:8px;margin-bottom:0;">
                <strong>Hidden Fee Watch:</strong> ${esc(b.hiddenFeeWatch)}
              </p>
            </div>
          </div>
        </div>

        <div class="content-card">
          <h2>Related Comparisons</h2>
          <div class="link-grid">
            ${relatedMatchups
              .map(
                (m) => `
              <a class="link-card" href="${basePath}/vs/${m.slug}/">
                <strong>${esc(m.platformA.shortName)} vs ${esc(m.platformB.shortName)}</strong>
                <span>Interactive 2026 fee comparison →</span>
              </a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>`;

  const faqs = [
    {
      q: `Which is cheaper in 2026: ${a.name} or ${b.name}?`,
      a: `At ${fmtUsd(defaults.grossMonthly)}/mo gross volume ($${defaults.avgOrderValue} average price, ${defaults.intlSharePct}% international buyers), ${defaultWinner.name} leaves ${fmtUsd(Math.max(resA.netMonthly, resB.netMonthly))}/mo net compared to ${fmtUsd(Math.min(resA.netMonthly, resB.netMonthly))}/mo on ${defaultLoser.name}—a net difference of ${fmtUsd(annualDiff)} per year.`
    },
    {
      q: `Do both ${a.shortName} and ${b.shortName} handle global VAT and sales tax as a Merchant of Record?`,
      a: `${a.shortName} ${a.isMoR ? 'acts as a full Merchant of Record and remits global VAT/sales tax on your behalf' : 'is NOT a Merchant of Record, meaning you are responsible for registering and remitting sales tax/VAT'}. ${b.shortName} ${b.isMoR ? 'acts as a full Merchant of Record and handles global tax compliance automatically' : 'is NOT a Merchant of Record, so tax registration and filings remain your responsibility'}.`
    },
    {
      q: `What hidden surcharges affect ${a.shortName} vs ${b.shortName}?`,
      a: `${a.shortName} charges ${a.baseRatePct}% + $${a.fixedFeeUsd.toFixed(2)} base plus +${a.intlCardSurchargePct}% international card and +${a.subscriptionSurchargePct}% recurring fees. ${b.shortName} charges ${b.baseRatePct}% + $${b.fixedFeeUsd.toFixed(2)} base plus +${b.intlCardSurchargePct}% international card and +${b.subscriptionSurchargePct}% recurring fees.`
    }
  ];

  return renderLayout({
    config,
    basePath,
    canonicalPath: `/vs/${slug}/`,
    title: matchup.title,
    metaDescription: matchup.metaDescription,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Comparisons', path: '/directory/' },
      { label: `${a.shortName} vs ${b.shortName}`, path: `/vs/${slug}/` }
    ],
    h1: `${a.shortName} vs ${b.shortName} Fee Calculator (2026)`,
    heroSub: `Exact monthly take-home, international FX surcharges, and breakeven math for ${defaults.audienceLabel}.`,
    bodyHtml,
    faqs
  });
}
