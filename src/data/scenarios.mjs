export const AI_MODELS_2026 = [
  {
    id: 'frontier-fast',
    name: 'Gemini Flash / GPT-4o-mini Tier',
    inputPer1M: 0.15,
    outputPer1M: 0.60,
    note: 'Best for high-volume chat, summarization & extraction wrappers'
  },
  {
    id: 'frontier-pro',
    name: 'Claude Sonnet / GPT-4.1 / Gemini Pro Tier',
    inputPer1M: 2.50,
    outputPer1M: 10.00,
    note: 'Standard coding, agentic workflows & complex reasoning SaaS'
  },
  {
    id: 'frontier-heavy',
    name: 'Heavy Reasoning / Multi-Agent Swarm Tier',
    inputPer1M: 10.00,
    outputPer1M: 35.00,
    note: 'Deep research, legal/financial analysis & heavy codegen'
  },
  {
    id: 'open-weights',
    name: 'DeepSeek / Hosted Open-Weights Tier',
    inputPer1M: 0.28,
    outputPer1M: 1.10,
    note: 'High-margin open-weights inference via serverless GPU providers'
  }
];

export const SCENARIOS = [
  {
    slug: 'ai-saas-wrapper-margin-calculator',
    isAiCalculator: true,
    title: 'AI SaaS Token Cost & Net Margin Calculator (2026)',
    h1: 'AI SaaS Wrapper Gross Margin & MoR Fee Calculator',
    subtitle: 'Calculate exact profit per user after LLM API token usage, hosting overhead, and Merchant of Record checkout fees.',
    metaDescription: 'Free 2026 AI SaaS margin calculator. Model LLM token costs (Gemini, Claude, OpenAI, DeepSeek) + Polar, Creem, Stripe or Lemon Squeezy fees to avoid underwater pricing.',
    defaults: {
      grossMonthly: 5800,
      avgOrderValue: 29,
      billingType: 'recurring',
      intlSharePct: 50,
      fxSharePct: 30,
      paypalSharePct: 10,
      requireGlobalTax: true
    },
    aiDefaults: {
      activeUsers: 200,
      planPriceUsd: 29,
      promptsPerUserPerMonth: 180,
      avgInputTokens: 1800,
      avgOutputTokens: 900,
      modelId: 'frontier-pro',
      infraPerUserUsd: 0.75
    },
    insight: 'Most AI SaaS founders price at $19–$29/mo assuming 85% SaaS margins—until power users burn $14/mo in reasoning tokens plus ~$1.85 in MoR checkout fees. Always cap token budgets so top-decile usage stays below 35% of net post-fee revenue.'
  },
  {
    slug: 'saas-1k-mrr-fee-calculator',
    title: 'Micro-SaaS at $1,000 MRR Fee & Take-Home Calculator (2026)',
    h1: 'Micro-SaaS at $1,000 MRR: Which Billing Platform Leaves You the Most?',
    subtitle: 'Pre-configured for early-stage indie SaaS (~35 customers at $29/mo) with global tax compliance.',
    metaDescription: 'See your exact net take-home at $1,000 MRR across Polar.sh, Creem, Lemon Squeezy, Paddle, Dodo Payments, and Stripe in 2026.',
    defaults: { grossMonthly: 1000, avgOrderValue: 29, billingType: 'recurring', intlSharePct: 40, fxSharePct: 20, paypalSharePct: 10, requireGlobalTax: true },
    insight: 'Below $1,380/mo, fixed monthly SaaS fees hurt more than percentage cuts. $0/mo MoRs like Creem (3.9% + 40¢) and Polar Starter (5% + 50¢) protect runway while handling global VAT from day one.'
  },
  {
    slug: 'saas-5k-mrr-fee-calculator',
    title: 'SaaS at $5,000 MRR Merchant of Record Fee Calculator (2026)',
    h1: 'SaaS at $5,000 MRR: Merchant of Record vs Stripe True Cost',
    subtitle: 'Compare net annual profit at $60k ARR once international cards, VAT, and fee-buydown tiers kick in.',
    metaDescription: 'Compare Polar Pro, Creem, Paddle, Lemon Squeezy, and Stripe Tax fees for a $5,000 MRR SaaS business with international customers.',
    defaults: { grossMonthly: 5000, avgOrderValue: 29, billingType: 'recurring', intlSharePct: 45, fxSharePct: 25, paypalSharePct: 15, requireGlobalTax: true },
    insight: 'At $5,000 MRR ($60k ARR), upgrading Polar from Starter to Pro ($20/mo) automatically drops your rate from 5% + 50¢ to 3.8% + 40¢, saving over $680/year compared to flat-rate MoRs.'
  },
  {
    slug: 'saas-10k-mrr-fee-calculator',
    title: 'SaaS at $10,000 MRR Billing & Tax Fee Calculator (2026)',
    h1: '$10,000 MRR ($120k ARR) SaaS Payment Fee & Tax Comparison',
    subtitle: 'At $120k ARR, a 2.5% hidden fee spread equals $3,000/year out of founder pocket.',
    metaDescription: 'Calculate exact payment processing, international FX, and Merchant of Record costs for a $10,000 MRR SaaS in 2026.',
    defaults: { grossMonthly: 10000, avgOrderValue: 49, billingType: 'recurring', intlSharePct: 50, fxSharePct: 30, paypalSharePct: 15, requireGlobalTax: true },
    insight: 'At $10k MRR with 50% international buyers, Lemon Squeezy\'s stacked +1.5% international, +0.5% subscription, and +1.5% PayPal surcharges make it significantly costlier than Polar Growth, Creem, or Paddle.'
  },
  {
    slug: 'saas-25k-mrr-fee-calculator',
    title: 'Scaling SaaS at $25,000 MRR Fee Optimization Calculator (2026)',
    h1: '$25,000 MRR ($300k ARR) Fee Buydown & Gateway Audit',
    subtitle: 'Benchmark Polar Growth/Scale, Paddle custom tiers, Creem, and Stripe + CPA filing costs.',
    metaDescription: 'Audit payment fees on $25,000 MRR ($300k ARR). See how much you save switching from legacy storefronts to tiered MoRs or direct gateways.',
    defaults: { grossMonthly: 25000, avgOrderValue: 59, billingType: 'recurring', intlSharePct: 45, fxSharePct: 25, paypalSharePct: 10, requireGlobalTax: true },
    insight: 'At $300k ARR, you cross multiple US state economic nexus thresholds and mandatory EU/UK VAT obligations—meaning Stripe\'s lower card rate must be weighed against $3,000–$6,000/yr in external sales-tax filing software.'
  },
  {
    slug: 'substack-to-beehiiv-savings-calculator',
    title: 'Substack to beehiiv Switcher & Break-Even Calculator (2026)',
    h1: 'Substack vs beehiiv Break-Even Calculator: When Does Switching Pay Off?',
    subtitle: 'Find the exact paid-subscriber count where Substack\'s 10% cut costs more than beehiiv\'s flat plan.',
    metaDescription: 'Interactive 2026 Substack vs beehiiv calculator. Enter your paid subscribers and monthly price to see exact annual savings when switching.',
    defaults: { grossMonthly: 1800, avgOrderValue: 10, billingType: 'recurring', intlSharePct: 20, fxSharePct: 10, paypalSharePct: 0, requireGlobalTax: false },
    filterPlatforms: ['beehiiv', 'substack', 'patreon', 'whop', 'polar'],
    insight: 'Because Substack takes 10% forever on top of Stripe\'s 2.9% + 30¢ + 0.7% recurring billing fee, beehiiv Lite ($49/mo, 0% platform cut) breaks even right around ~$490/mo in gross paid subscriptions (~50 subscribers at $10/mo).'
  },
  {
    slug: 'paid-newsletter-100-subscribers-calculator',
    title: 'Paid Newsletter Revenue Calculator (100 to 5,000 Subscribers)',
    h1: 'Paid Newsletter Net Revenue & Fee Calculator',
    subtitle: 'Model what you actually keep from $5, $8, $10, or $15/mo newsletter subscriptions after card & platform fees.',
    metaDescription: 'Calculate net newsletter income after Substack, beehiiv, Patreon, Ghost/Stripe, or Polar fees in 2026.',
    defaults: { grossMonthly: 1000, avgOrderValue: 8, billingType: 'recurring', intlSharePct: 25, fxSharePct: 10, paypalSharePct: 0, requireGlobalTax: false },
    filterPlatforms: ['beehiiv', 'substack', 'stripe', 'patreon', 'whop'],
    insight: 'At $8/mo, the 30¢ fixed Stripe card fee alone eats 3.75% of every monthly charge! Offering an $80/year annual plan cuts fixed transaction fees by 12x overnight.'
  },
  {
    slug: 'notion-template-store-fee-calculator',
    title: 'Notion Template & Digital Product Fee Calculator (2026)',
    h1: 'Notion Template, Ebook & UI Kit Storefront Fee Calculator',
    subtitle: 'Selling $19–$49 digital downloads? Compare Gumroad vs Lemon Squeezy vs Polar vs Creem vs Whop.',
    metaDescription: 'Stop losing 15%+ on digital downloads. Compare Gumroad, Lemon Squeezy, Creem, Polar, and Shopify fees for Notion templates and ebooks.',
    defaults: { grossMonthly: 3000, avgOrderValue: 25, billingType: 'onetime', intlSharePct: 45, fxSharePct: 25, paypalSharePct: 25, requireGlobalTax: true },
    insight: 'On $3,000/mo of $25 templates, Gumroad direct sales deduct ~$495/mo (~$5,940/yr) in combined platform + card fees, whereas Creem or Polar keeps ~$300+/mo extra in your bank account.'
  },
  {
    slug: 'indie-desktop-app-license-fee-calculator',
    title: 'Indie Mac, Windows & Desktop App License Fee Calculator (2026)',
    h1: 'Desktop Software & Plugin One-Time License Calculator ($49 AOV)',
    subtitle: 'Compare software license-key Merchants of Record vs Mac App Store / Steam cuts.',
    metaDescription: 'Compare Polar.sh, Lemon Squeezy, Paddle, Creem, and Gumroad fees for selling $49–$99 desktop apps, CLI tools, and plugins.',
    defaults: { grossMonthly: 6000, avgOrderValue: 49, billingType: 'onetime', intlSharePct: 55, fxSharePct: 30, paypalSharePct: 20, requireGlobalTax: true },
    insight: 'One-time $49–$99 software licenses minimize fixed per-transaction drag (40¢–50¢ is <1%) while bypassing the 15%–30% App Store commission entirely.'
  },
  {
    slug: 'high-ticket-course-checkout-calculator',
    title: 'Online Course & Cohort Checkout Fee Calculator ($299 AOV)',
    h1: 'Course Creator & Cohort Checkout Fee Calculator ($299 Price Point)',
    subtitle: 'High-ticket courses magnify percentage fees: a 10% platform cut on a $299 course costs $30 per student.',
    metaDescription: 'Calculate net take-home on $199–$999 courses across Whop, Stripe, Shopify, Polar, Lemon Squeezy, and Gumroad.',
    defaults: { grossMonthly: 9000, avgOrderValue: 299, billingType: 'onetime', intlSharePct: 35, fxSharePct: 20, paypalSharePct: 15, requireGlobalTax: true },
    insight: 'On high-AOV products ($299+), percentage take-rates dominate fixed cents. Moving a $9k/mo course from Gumroad (10%+) to Whop, Stripe, or Polar Pro saves $6,000–$9,500 per year.'
  },
  {
    slug: 'paid-discord-community-fee-calculator',
    title: 'Paid Discord, Telegram & Community Membership Fee Calculator',
    h1: 'Paid Discord & Membership Community Take-Home Calculator',
    subtitle: 'Compare Whop, Patreon, Polar, Stripe, and Substack for recurring community access.',
    metaDescription: 'Running a paid Discord, trading group, or AI community? Compare Whop vs Patreon vs Polar vs Stripe net payouts in 2026.',
    defaults: { grossMonthly: 5000, avgOrderValue: 39, billingType: 'recurring', intlSharePct: 30, fxSharePct: 15, paypalSharePct: 10, requireGlobalTax: true },
    filterPlatforms: ['whop', 'polar', 'creem', 'stripe', 'patreon', 'substack'],
    insight: 'Whop\'s 2.7% + 30¢ base rate makes it much cheaper than Patreon\'s 10% + processing for domestic communities, though global communities enabling Whop\'s +2% tax add-on should benchmark Polar Pro and Creem.'
  },
  {
    slug: 'micro-transaction-5-dollar-fee-calculator',
    title: '$5 Micro-Subscription & Low-AOV Fee Trap Calculator (2026)',
    h1: 'The $5 Micro-Subscription Trap: Why Fixed 50¢ Fees Eat Your Margin',
    subtitle: 'See exactly how much of a $5 charge disappears to 30¢–80¢ per-transaction minimums.',
    metaDescription: 'Selling a $5/mo tool, add-on, or fan tier? Calculate how 30¢–50¢ fixed fees turn a 5% headline rate into a 15%+ effective fee.',
    defaults: { grossMonthly: 2000, avgOrderValue: 5, billingType: 'recurring', intlSharePct: 35, fxSharePct: 20, paypalSharePct: 10, requireGlobalTax: true },
    insight: 'On a $5 charge, a 50¢ fixed fee equals 10% all by itself—making a "5% + 50¢" platform actually cost 15%+! Switching $5/mo plans to $15/quarter or $49/year instantly rescues ~8%–10% of gross revenue.'
  },
  {
    slug: 'global-eu-vat-saas-mor-calculator',
    title: 'Global SaaS (70% International / EU VAT) Merchant of Record Calculator',
    h1: 'High-International SaaS (70% Non-US Buyers) Fee & FX Calculator',
    subtitle: 'When most buyers are in Europe, UK, APAC, or LATAM, +1.5% cross-border card fees change the leaderboard.',
    metaDescription: 'Compare Paddle, Creem, Polar, Lemon Squeezy, Dodo Payments, and Stripe when 70%+ of your SaaS customers pay with international cards.',
    defaults: { grossMonthly: 7500, avgOrderValue: 35, billingType: 'recurring', intlSharePct: 70, fxSharePct: 55, paypalSharePct: 25, requireGlobalTax: true },
    insight: 'Platforms without extra international card surcharges (like Creem and Paddle) surge up the rankings when >60% of customers pay outside the US, often beating lower-headline gateways hammered by +1.5% cross-border and +1% FX fees.'
  },
  {
    slug: 'lifetime-deal-ltd-margin-calculator',
    title: 'SaaS Lifetime Deal (LTD) Net Revenue & Fee Calculator (2026)',
    h1: 'SaaS Lifetime Deal ($99 LTD) Checkout Fee & Runway Calculator',
    subtitle: 'Keep 95%+ of your launch cash instead of surrendering 60%–70% to external deal marketplaces.',
    metaDescription: 'Running a self-hosted $99 Lifetime Deal launch? Compare net cash retained across Polar, Creem, Stripe, Whop, Lemon Squeezy, and Gumroad.',
    defaults: { grossMonthly: 15000, avgOrderValue: 99, billingType: 'onetime', intlSharePct: 50, fxSharePct: 30, paypalSharePct: 20, requireGlobalTax: true },
    insight: 'Self-hosting a $15,000 LTD launch on a 3.6%–4% MoR nets ~$14,350+ with global VAT handled—nearly 3x what founders keep on 70%-commission deal marketplaces.'
  },
  {
    slug: 'patreon-creator-take-home-calculator',
    title: 'Patreon Creator Net Take-Home & Cheaper Alternatives Calculator (2026)',
    h1: 'Patreon Fee Calculator: How Much Do You Actually Keep in 2026?',
    subtitle: 'Model Patreon\'s 10% standard fee + payment processing against Whop, beehiiv, Polar, and Stripe.',
    metaDescription: 'Calculate exact 2026 Patreon fees and net payout after the 10% platform cut and processing fees, plus see how much alternatives save.',
    defaults: { grossMonthly: 3000, avgOrderValue: 12, billingType: 'recurring', intlSharePct: 30, fxSharePct: 15, paypalSharePct: 20, requireGlobalTax: true },
    insight: 'New Patreon creators on the 10% plan lose ~$430–$480/mo on $3,000 gross pledges. Moving established superfans to Whop, Polar, or beehiiv typically recovers $3,000+ per year.'
  },
  {
    slug: 'gumroad-discover-30-percent-fee-calculator',
    title: 'Gumroad Fee Calculator (2026): Direct Link vs Alternatives',
    h1: 'Gumroad True Cost Calculator: 10% + 50¢ + Processing vs Modern MoRs',
    subtitle: 'See what Gumroad really deducts once card processing is stacked on top of its 10% + 50¢ fee.',
    metaDescription: '2026 Gumroad fee calculator including the 10% + 50¢ fee AND card processing. Compare your exact take-home against Lemon Squeezy, Polar, and Creem.',
    defaults: { grossMonthly: 2500, avgOrderValue: 29, billingType: 'onetime', intlSharePct: 40, fxSharePct: 20, paypalSharePct: 20, requireGlobalTax: true },
    insight: 'Many creators still assume Gumroad is "10% all-in," forgetting that ~2.9% + 30¢ payment processing is charged separately—pushing real deductions near ~14%–16% even before any 30% Discover sales.'
  },
  {
    slug: 'polar-pro-tier-breakeven-calculator',
    title: 'Polar.sh Tier Breakeven Calculator: Starter vs Pro ($20) vs Growth ($100)',
    h1: 'Polar.sh Fee Ladder Calculator: Exact Monthly Volume to Upgrade Tiers',
    subtitle: 'Calculate the exact MRR where Polar Pro ($20/mo) and Polar Growth ($100/mo) put extra cash in your pocket.',
    metaDescription: 'Interactive Polar.sh pricing calculator for 2026. Find the exact breakeven revenue between Polar Starter (5%), Pro (3.8%), Growth (3.6%), and Scale (3.4%).',
    defaults: { grossMonthly: 2200, avgOrderValue: 29, billingType: 'recurring', intlSharePct: 40, fxSharePct: 20, paypalSharePct: 0, requireGlobalTax: true },
    insight: 'At $29 AOV, Polar Pro ($20/mo, 3.8% + 40¢) beats Starter ($0/mo, 5% + 50¢) right around ~$1,300–$1,400/mo gross volume, and Growth ($100/mo, 3.6% + 35¢) overtakes Pro around ~$21,500/mo.'
  },
  {
    slug: 'stripe-tax-vs-merchant-of-record-calculator',
    title: 'Stripe (+ Stripe Tax & Billing) vs Merchant of Record Calculator (2026)',
    h1: 'Stripe + Tax + Billing vs Merchant of Record: Is Stripe Really Cheaper?',
    subtitle: 'Compare stacked Stripe SaaS add-ons (+0.5% Billing, +0.5% Tax, +1.5% Intl, +1% FX) against turnkey MoRs.',
    metaDescription: 'Once you add Stripe Billing (0.5%), Stripe Tax (0.5%), cross-border (1.5%), and FX (1%), how much cheaper is Stripe than Polar, Creem, or Paddle?',
    defaults: { grossMonthly: 6000, avgOrderValue: 39, billingType: 'recurring', intlSharePct: 50, fxSharePct: 35, paypalSharePct: 10, requireGlobalTax: true },
    insight: 'On domestic one-time charges Stripe wins handily (2.9% + 30¢). On global SaaS subscriptions with Stripe Billing + Tax + FX, Stripe\'s effective rate climbs past ~5%—virtually matching Polar Pro or Creem while still leaving tax remittance on your shoulders!'
  }
];
