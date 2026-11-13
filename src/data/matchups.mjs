import { PLATFORMS } from './platforms.mjs';

function inferSmartDefaults(a, b) {
  const cats = new Set([a.category, b.category]);

  if (cats.has('newsletter')) {
    return {
      grossMonthly: 2500,
      avgOrderValue: 10,
      billingType: 'recurring',
      intlSharePct: 25,
      fxSharePct: 15,
      paypalSharePct: 0,
      requireGlobalTax: false,
      audienceLabel: 'paid newsletter & media subscriptions ($10/mo avg)'
    };
  }

  if (a.id === 'gumroad' || b.id === 'gumroad' || a.id === 'shopify' || b.id === 'shopify') {
    return {
      grossMonthly: 3500,
      avgOrderValue: 39,
      billingType: 'onetime',
      intlSharePct: 40,
      fxSharePct: 25,
      paypalSharePct: 20,
      requireGlobalTax: true,
      audienceLabel: 'digital products, templates & downloads ($39 avg order)'
    };
  }

  if (cats.has('creator')) {
    return {
      grossMonthly: 4000,
      avgOrderValue: 25,
      billingType: 'recurring',
      intlSharePct: 30,
      fxSharePct: 15,
      paypalSharePct: 10,
      requireGlobalTax: true,
      audienceLabel: 'creator memberships, communities & courses ($25/mo avg)'
    };
  }

  return {
    grossMonthly: 5000,
    avgOrderValue: 29,
    billingType: 'recurring',
    intlSharePct: 45,
    fxSharePct: 25,
    paypalSharePct: 15,
    requireGlobalTax: true,
    audienceLabel: 'global SaaS & AI subscriptions ($29/mo avg, 45% international)'
  };
}

export function generateMatchups() {
  const matchups = [];
  for (let i = 0; i < PLATFORMS.length; i++) {
    for (let j = i + 1; j < PLATFORMS.length; j++) {
      const a = PLATFORMS[i];
      const b = PLATFORMS[j];
      const slug = `${a.slug}-vs-${b.slug}`;
      const defaults = inferSmartDefaults(a, b);
      matchups.push({
        slug,
        platformA: a,
        platformB: b,
        defaults,
        title: `${a.shortName} vs ${b.shortName} Fee Calculator (2026): True Take-Home & Hidden Fees`,
        metaDescription: `Compare ${a.name} vs ${b.name} transaction fees, international card surcharges, and exact monthly take-home pay in 2026. Interactive breakeven calculator for ${defaults.audienceLabel}.`
      });
    }
  }
  return matchups;
}

export const MATCHUPS = generateMatchups();
