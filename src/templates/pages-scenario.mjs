import { SCENARIOS } from '../data/scenarios.mjs';
import { compareAllPlatforms } from '../engine/calculator-core.mjs';
import { renderLayout, renderCalculatorWidget, esc, fmtUsd } from './layout.mjs';

export function buildScenarioPage(scenario, config, basePath = '') {
  const { defaults, filterPlatforms = null, isAiCalculator = false, aiDefaults = null } = scenario;
  const comp = compareAllPlatforms(defaults, filterPlatforms);

  const calcHtml = renderCalculatorWidget({
    config,
    defaults,
    filterIds: filterPlatforms,
    isAiMode: isAiCalculator,
    aiDefaults,
    basePath
  });

  const otherScenarios = SCENARIOS.filter((s) => s.slug !== scenario.slug).slice(0, 8);

  const bodyHtml = `
    ${calcHtml}

    <section class="content-section" style="padding-top:8px;">
      <div class="container">
        <div class="content-card">
          <h2>Strategic Margin Insight for This Scenario</h2>
          <p style="font-size:1.02rem;line-height:1.7;color:#334155;background:#f0fdf4;border:1px solid #bbf7d0;padding:18px 20px;border-radius:12px;margin:0 0 20px;">
            <strong>CFO Rule of Thumb:</strong> ${esc(scenario.insight)}
          </p>

          <h3>Pre-Computed Leaderboard (${fmtUsd(defaults.grossMonthly)}/mo Gross · $${defaults.avgOrderValue} AOV · ${defaults.intlSharePct}% Intl)</h3>
          <div class="table-scroll">
            <table class="data-table tabular">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Platform</th>
                  <th>Tax Handling</th>
                  <th>Monthly Fees</th>
                  <th>Effective Rate</th>
                  <th>Net Annual Take-Home</th>
                </tr>
              </thead>
              <tbody>
                ${comp.results
                  .map(
                    (r, i) => `
                  <tr>
                    <td><strong>#${i + 1}</strong></td>
                    <td><a href="${basePath}/calculators/${r.slug}-fee-calculator/"><strong>${esc(r.platformName)}</strong></a></td>
                    <td>${r.isMoR ? 'Merchant of Record' : 'DIY Tax'}</td>
                    <td>${fmtUsd(r.totalFees)}/mo</td>
                    <td>${r.effectiveRatePct.toFixed(2)}%</td>
                    <td><strong>${fmtUsd(r.netAnnual)}/yr</strong></td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="content-card">
          <h2>More Founder Revenue &amp; Margin Scenarios</h2>
          <div class="link-grid">
            ${otherScenarios
              .map(
                (s) => `
              <a class="link-card" href="${basePath}/scenarios/${s.slug}/">
                <strong>${esc(s.title.replace(' (2026)', ''))}</strong>
                <span>Run interactive scenario →</span>
              </a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>`;

  const faqs = [
    {
      q: `Which payment platform leaves the highest net payout for this scenario?`,
      a: `At ${fmtUsd(defaults.grossMonthly)}/mo gross volume ($${defaults.avgOrderValue} average order, ${defaults.intlSharePct}% international cards), ${comp.winner.platformName} ranks #1 with ${fmtUsd(comp.winner.netMonthly)}/mo net (${comp.winner.effectiveRatePct.toFixed(2)}% effective fee), saving ${fmtUsd(comp.maxAnnualSpread)}/year compared to ${comp.worst.platformName}.`
    },
    {
      q: 'How can I immediately reduce effective payment fees without raising prices?',
      a: 'First, introduce an annual plan (2 months free) to slash fixed 30¢–50¢ per-transaction fees by 12x. Second, check whether you have crossed tier-upgrade breakevens such as Polar Pro ($20/mo past ~$1,380/mo) or beehiiv Lite ($49/mo past ~$490/mo vs Substack).'
    }
  ];

  return renderLayout({
    config,
    basePath,
    canonicalPath: `/scenarios/${scenario.slug}/`,
    title: scenario.title,
    metaDescription: scenario.metaDescription,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Scenarios', path: '/directory/' },
      { label: scenario.h1.split(':')[0], path: `/scenarios/${scenario.slug}/` }
    ],
    h1: scenario.h1,
    heroSub: scenario.subtitle,
    bodyHtml,
    faqs
  });
}
