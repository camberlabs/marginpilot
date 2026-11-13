import { PLATFORMS, PLATFORM_MAP } from '../data/platforms.mjs';

/**
 * Pure, deterministic fee & net margin calculation engine.
 * Shared between SSG build-time HTML pre-rendering and client-side interactive UI.
 */
export function calculatePlatformResult(platform, inputs) {
  const grossMonthly = Math.max(0, Number(inputs.grossMonthly) || 0);
  const avgOrderValue = Math.max(1, Number(inputs.avgOrderValue) || 29);
  const isRecurring = inputs.billingType !== 'onetime';
  const intlShare = Math.min(1, Math.max(0, (Number(inputs.intlSharePct) ?? 35) / 100));
  const fxShare = Math.min(1, Math.max(0, (Number(inputs.fxSharePct) ?? 20) / 100));
  const paypalShare = Math.min(1, Math.max(0, (Number(inputs.paypalSharePct) ?? 15) / 100));
  const requireGlobalTax = inputs.requireGlobalTax !== false;

  const txCount = grossMonthly > 0 ? grossMonthly / avgOrderValue : 0;

  // Evaluate tiered ladder if platform has tiers (e.g., Polar.sh Starter -> Pro -> Growth -> Scale)
  let activeTier = {
    name: 'Standard',
    monthlyUsd: platform.monthlyFeeUsd || 0,
    ratePct: platform.baseRatePct,
    fixedUsd: platform.fixedFeeUsd
  };
  let starterComparisonSavings = 0;

  if (Array.isArray(platform.tiers) && platform.tiers.length > 0) {
    let bestCost = Infinity;
    let starterCost = 0;

    platform.tiers.forEach((tier, idx) => {
      const basePctFee = grossMonthly * (tier.ratePct / 100);
      const fixedTxFee = txCount * tier.fixedUsd;
      const tierTotal = (grossMonthly > 0 ? tier.monthlyUsd : 0) + basePctFee + fixedTxFee;
      if (idx === 0) starterCost = tierTotal;
      if (tierTotal < bestCost) {
        bestCost = tierTotal;
        activeTier = tier;
      }
    });
    starterComparisonSavings = Math.max(0, starterCost - bestCost);
  }

  const monthlyPlatformFee = grossMonthly > 0 ? activeTier.monthlyUsd : (platform.monthlyFeeUsd || 0);
  const basePercentFee = grossMonthly * (activeTier.ratePct / 100);
  const fixedTransactionFees = txCount * activeTier.fixedUsd;

  const intlFee = grossMonthly * intlShare * ((platform.intlCardSurchargePct || 0) / 100);
  const fxFee = grossMonthly * fxShare * ((platform.fxSurchargePct || 0) / 100);
  const subscriptionFee = isRecurring
    ? grossMonthly * ((platform.subscriptionSurchargePct || 0) / 100)
    : 0;
  const paypalFee = grossMonthly * paypalShare * ((platform.paypalSurchargePct || 0) / 100);
  const taxAddonFee = requireGlobalTax
    ? grossMonthly * ((platform.taxAddonPct || 0) / 100)
    : 0;

  const prePayoutNet = Math.max(
    0,
    grossMonthly -
      monthlyPlatformFee -
      basePercentFee -
      fixedTransactionFees -
      intlFee -
      fxFee -
      subscriptionFee -
      paypalFee -
      taxAddonFee
  );

  const payoutFee =
    grossMonthly > 0
      ? (platform.payoutMonthlyFixedUsd || 0) + prePayoutNet * ((platform.payoutPct || 0) / 100)
      : 0;

  const totalFees =
    monthlyPlatformFee +
    basePercentFee +
    fixedTransactionFees +
    intlFee +
    fxFee +
    subscriptionFee +
    paypalFee +
    taxAddonFee +
    payoutFee;

  const netMonthly = Math.max(0, grossMonthly - totalFees);
  const effectiveRatePct = grossMonthly > 0 ? (totalFees / grossMonthly) * 100 : 0;

  return {
    platformId: platform.id,
    platformName: platform.name,
    shortName: platform.shortName,
    slug: platform.slug,
    category: platform.category,
    isMoR: platform.isMoR,
    badge: platform.badge,
    affiliateKey: platform.affiliateKey,
    activeTierName: activeTier.name,
    starterComparisonSavings,
    txCount,
    grossMonthly,
    monthlyPlatformFee,
    basePercentFee,
    fixedTransactionFees,
    intlFee,
    fxFee,
    subscriptionFee,
    paypalFee,
    taxAddonFee,
    payoutFee,
    surchargesTotal: intlFee + fxFee + subscriptionFee + paypalFee + taxAddonFee + payoutFee,
    totalFees,
    netMonthly,
    netAnnual: netMonthly * 12,
    annualFees: totalFees * 12,
    effectiveRatePct
  };
}

export function compareAllPlatforms(inputs, filterIds = null) {
  const list = filterIds
    ? filterIds.map((id) => PLATFORM_MAP[id]).filter(Boolean)
    : PLATFORMS;

  const results = list.map((p) => calculatePlatformResult(p, inputs));
  results.sort((a, b) => b.netMonthly - a.netMonthly);

  const winner = results[0];
  const worst = results[results.length - 1];

  return {
    inputs,
    results,
    winner,
    worst,
    maxAnnualSpread: winner && worst ? Math.max(0, winner.netAnnual - worst.netAnnual) : 0
  };
}

/**
 * Finds approximate monthly gross revenue breakeven where Platform A beats Platform B (or vice versa)
 * when one platform has a higher monthly fee but lower % rate (e.g. beehiiv vs Substack, Polar Pro vs Starter).
 */
export function findHeadToHeadBreakeven(platformA, platformB, baseInputs) {
  const steps = [100, 250, 400, 500, 600, 750, 1000, 1400, 2000, 3000, 5000, 10000, 25000, 50000];
  let prevDiff = null;
  let crossoverApprox = null;

  for (let rev = 100; rev <= 30000; rev += 50) {
    const resA = calculatePlatformResult(platformA, { ...baseInputs, grossMonthly: rev });
    const resB = calculatePlatformResult(platformB, { ...baseInputs, grossMonthly: rev });
    const diff = resA.netMonthly - resB.netMonthly;
    if (prevDiff !== null && ((prevDiff < 0 && diff >= 0) || (prevDiff > 0 && diff <= 0))) {
      crossoverApprox = rev;
      break;
    }
    prevDiff = diff;
  }

  const tierSnapshots = [500, 1500, 5000, 10000, 25000, 50000].map((rev) => {
    const a = calculatePlatformResult(platformA, { ...baseInputs, grossMonthly: rev });
    const b = calculatePlatformResult(platformB, { ...baseInputs, grossMonthly: rev });
    return {
      grossMonthly: rev,
      aNet: a.netMonthly,
      aFees: a.totalFees,
      aRate: a.effectiveRatePct,
      aTier: a.activeTierName,
      bNet: b.netMonthly,
      bFees: b.totalFees,
      bRate: b.effectiveRatePct,
      bTier: b.activeTierName,
      winnerName: a.netMonthly >= b.netMonthly ? platformA.shortName : platformB.shortName,
      annualSavings: Math.abs(a.netAnnual - b.netAnnual)
    };
  });

  return {
    crossoverMonthlyUsd: crossoverApprox,
    tierSnapshots
  };
}
