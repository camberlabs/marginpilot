(function () {
  const bootEl = document.getElementById('mp-boot-data');
  if (!bootEl) return;

  let boot;
  try {
    boot = JSON.parse(bootEl.textContent);
  } catch (e) {
    console.error('Failed to parse calculator boot data', e);
    return;
  }

  const { platforms, affiliateLinks, defaults, filterIds, aiModels, isAiMode } = boot;
  const basePath = boot.basePath || '';

  const state = {
    grossMonthly: defaults.grossMonthly ?? 5000,
    avgOrderValue: defaults.avgOrderValue ?? 29,
    billingType: defaults.billingType ?? 'recurring',
    intlSharePct: defaults.intlSharePct ?? 40,
    fxSharePct: defaults.fxSharePct ?? 20,
    paypalSharePct: defaults.paypalSharePct ?? 15,
    requireGlobalTax: defaults.requireGlobalTax !== false,
    // AI Wrapper optional state
    aiUsers: boot.aiDefaults?.activeUsers ?? 200,
    aiPrompts: boot.aiDefaults?.promptsPerUserPerMonth ?? 180,
    aiInputTokens: boot.aiDefaults?.avgInputTokens ?? 1800,
    aiOutputTokens: boot.aiDefaults?.avgOutputTokens ?? 900,
    aiModelId: boot.aiDefaults?.modelId ?? 'frontier-pro',
    aiInfraPerUser: boot.aiDefaults?.infraPerUserUsd ?? 0.75
  };

  // Hydrate URL query parameters for shareable founder scenarios
  const params = new URLSearchParams(window.location.search);
  if (params.has('rev')) state.grossMonthly = Math.max(0, Number(params.get('rev')) || state.grossMonthly);
  if (params.has('aov')) state.avgOrderValue = Math.max(1, Number(params.get('aov')) || state.avgOrderValue);
  if (params.has('bill')) state.billingType = params.get('bill') === 'onetime' ? 'onetime' : 'recurring';
  if (params.has('intl')) state.intlSharePct = Math.min(100, Math.max(0, Number(params.get('intl'))));
  if (params.has('pp')) state.paypalSharePct = Math.min(100, Math.max(0, Number(params.get('pp'))));

  const fmtUsd = (n, decimals = 0) =>
    '$' +
    Number(n || 0).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

  function calcOne(platform, s) {
    const grossMonthly = Math.max(0, Number(s.grossMonthly) || 0);
    const avgOrderValue = Math.max(1, Number(s.avgOrderValue) || 29);
    const isRecurring = s.billingType !== 'onetime';
    const intlShare = Math.min(1, Math.max(0, Number(s.intlSharePct) / 100));
    const fxShare = Math.min(1, Math.max(0, Number(s.fxSharePct) / 100));
    const paypalShare = Math.min(1, Math.max(0, Number(s.paypalSharePct) / 100));
    const txCount = grossMonthly > 0 ? grossMonthly / avgOrderValue : 0;

    let activeTier = {
      name: 'Standard',
      monthlyUsd: platform.monthlyFeeUsd || 0,
      ratePct: platform.baseRatePct,
      fixedUsd: platform.fixedFeeUsd
    };
    let starterSavings = 0;

    if (Array.isArray(platform.tiers) && platform.tiers.length > 0) {
      let bestCost = Infinity;
      let starterCost = 0;
      platform.tiers.forEach((t, idx) => {
        const c = (grossMonthly > 0 ? t.monthlyUsd : 0) + grossMonthly * (t.ratePct / 100) + txCount * t.fixedUsd;
        if (idx === 0) starterCost = c;
        if (c < bestCost) {
          bestCost = c;
          activeTier = t;
        }
      });
      starterSavings = Math.max(0, starterCost - bestCost);
    }

    const monthlyPlatformFee = grossMonthly > 0 ? activeTier.monthlyUsd : (platform.monthlyFeeUsd || 0);
    const basePercentFee = grossMonthly * (activeTier.ratePct / 100);
    const fixedTransactionFees = txCount * activeTier.fixedUsd;
    const intlFee = grossMonthly * intlShare * ((platform.intlCardSurchargePct || 0) / 100);
    const fxFee = grossMonthly * fxShare * ((platform.fxSurchargePct || 0) / 100);
    const subscriptionFee = isRecurring ? grossMonthly * ((platform.subscriptionSurchargePct || 0) / 100) : 0;
    const paypalFee = grossMonthly * paypalShare * ((platform.paypalSurchargePct || 0) / 100);
    const taxAddonFee = s.requireGlobalTax ? grossMonthly * ((platform.taxAddonPct || 0) / 100) : 0;

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
      grossMonthly > 0 ? (platform.payoutMonthlyFixedUsd || 0) + prePayoutNet * ((platform.payoutPct || 0) / 100) : 0;

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
      platform,
      activeTierName: activeTier.name,
      starterSavings,
      txCount,
      monthlyPlatformFee,
      baseCore: monthlyPlatformFee + basePercentFee + fixedTransactionFees,
      surcharges: intlFee + fxFee + subscriptionFee + paypalFee + taxAddonFee + payoutFee,
      intlFee,
      fxFee,
      subscriptionFee,
      paypalFee,
      taxAddonFee,
      payoutFee,
      totalFees,
      netMonthly,
      netAnnual: netMonthly * 12,
      effectiveRatePct
    };
  }

  // Bind DOM elements
  const els = {
    revSlider: document.getElementById('inp-rev-slider'),
    revNum: document.getElementById('inp-rev-num'),
    revDisplay: document.getElementById('val-rev'),
    aovSlider: document.getElementById('inp-aov-slider'),
    aovNum: document.getElementById('inp-aov-num'),
    aovDisplay: document.getElementById('val-aov'),
    intlSlider: document.getElementById('inp-intl-slider'),
    intlDisplay: document.getElementById('val-intl'),
    ppSlider: document.getElementById('inp-pp-slider'),
    ppDisplay: document.getElementById('val-pp'),
    taxCheck: document.getElementById('inp-tax-check'),
    btnRecurring: document.getElementById('btn-bill-recurring'),
    btnOnetime: document.getElementById('btn-bill-onetime'),
    kpiWinnerNet: document.getElementById('kpi-winner-net'),
    kpiWinnerSub: document.getElementById('kpi-winner-sub'),
    kpiRate: document.getElementById('kpi-rate'),
    kpiRateSub: document.getElementById('kpi-rate-sub'),
    kpiSavings: document.getElementById('kpi-savings'),
    kpiSavingsSub: document.getElementById('kpi-savings-sub'),
    winnerHeadline: document.getElementById('winner-headline'),
    winnerDesc: document.getElementById('winner-desc'),
    winnerCta: document.getElementById('winner-cta'),
    resultsContainer: document.getElementById('calc-results-list'),
    btnCopyLink: document.getElementById('btn-copy-link'),
    btnExportCsv: document.getElementById('btn-export-csv'),
    proDynamicHook: document.getElementById('pro-kit-dynamic-hook'),
    proRoiPill: document.getElementById('pro-kit-roi-pill'),
    postExportUpsell: document.getElementById('post-export-upsell'),
    postExportText: document.getElementById('post-export-text'),
    // AI specific
    aiModelSelect: document.getElementById('ai-model-select'),
    aiPromptsInput: document.getElementById('ai-prompts-input'),
    aiUsersInput: document.getElementById('ai-users-input'),
    aiSummaryText: document.getElementById('ai-summary-text')
  };

  function syncInputsFromState() {
    if (els.revSlider) els.revSlider.value = Math.min(100000, state.grossMonthly);
    if (els.revNum) els.revNum.value = Math.round(state.grossMonthly);
    if (els.revDisplay) els.revDisplay.textContent = fmtUsd(state.grossMonthly) + '/mo';

    if (els.aovSlider) els.aovSlider.value = Math.min(500, state.avgOrderValue);
    if (els.aovNum) els.aovNum.value = state.avgOrderValue;
    if (els.aovDisplay) els.aovDisplay.textContent = fmtUsd(state.avgOrderValue);

    if (els.intlSlider) els.intlSlider.value = state.intlSharePct;
    if (els.intlDisplay) els.intlDisplay.textContent = state.intlSharePct + '%';

    if (els.ppSlider) els.ppSlider.value = state.paypalSharePct;
    if (els.ppDisplay) els.ppDisplay.textContent = state.paypalSharePct + '%';

    if (els.taxCheck) els.taxCheck.checked = state.requireGlobalTax;

    if (els.btnRecurring && els.btnOnetime) {
      els.btnRecurring.classList.toggle('active', state.billingType === 'recurring');
      els.btnOnetime.classList.toggle('active', state.billingType === 'onetime');
    }
  }

  let latestResults = [];

  function render() {
    let aiMonthlyCost = 0;
    if (isAiMode && Array.isArray(aiModels) && els.aiSummaryText) {
      const model = aiModels.find((m) => m.id === state.aiModelId) || aiModels[1];
      const users = Math.max(1, Number(state.aiUsers) || 200);
      const prompts = Math.max(1, Number(state.aiPrompts) || 180);
      state.grossMonthly = users * state.avgOrderValue;
      const inCostPerUser = ((prompts * state.aiInputTokens) / 1_000_000) * model.inputPer1M;
      const outCostPerUser = ((prompts * state.aiOutputTokens) / 1_000_000) * model.outputPer1M;
      const totalAiPerUser = inCostPerUser + outCostPerUser + state.aiInfraPerUser;
      aiMonthlyCost = totalAiPerUser * users;

      els.aiSummaryText.innerHTML =
        `<strong>LLM + Infra Burn:</strong> ${fmtUsd(totalAiPerUser, 2)}/user/mo (${fmtUsd(aiMonthlyCost)}/mo across ${users} users on <em>${model.name}</em>).`;
    }

    syncInputsFromState();

    const activePlatforms =
      Array.isArray(filterIds) && filterIds.length > 0
        ? platforms.filter((p) => filterIds.includes(p.id))
        : platforms;

    const computed = activePlatforms.map((p) => calcOne(p, state));
    computed.sort((a, b) => b.netMonthly - a.netMonthly);
    latestResults = computed;

    const top = computed[0];
    const bottom = computed[computed.length - 1];
    const second = computed[1] || bottom;
    if (!top) return;

    const postAiWinnerNet = Math.max(0, top.netMonthly - aiMonthlyCost);
    const annualSpread = Math.max(0, top.netAnnual - bottom.netAnnual);
    const vsSecondAnnual = Math.max(0, top.netAnnual - second.netAnnual);

    if (els.kpiWinnerNet) {
      els.kpiWinnerNet.textContent = fmtUsd(isAiMode ? postAiWinnerNet : top.netMonthly);
    }
    if (els.kpiWinnerSub) {
      els.kpiWinnerSub.textContent = isAiMode
        ? `After ${fmtUsd(top.totalFees)} fees & ${fmtUsd(aiMonthlyCost)} LLM burn`
        : `Best on ${top.platform.shortName} (${fmtUsd(top.netAnnual)}/yr)`;
    }
    if (els.kpiRate) {
      els.kpiRate.textContent = top.effectiveRatePct.toFixed(2) + '%';
    }
    if (els.kpiRateSub) {
      els.kpiRateSub.textContent = `${fmtUsd(top.totalFees, 0)}/mo total fees (~${Math.round(top.txCount)} sales)`;
    }
    if (els.kpiSavings) {
      els.kpiSavings.textContent = '+' + fmtUsd(computed.length === 2 ? vsSecondAnnual : annualSpread) + '/yr';
    }
    if (els.kpiSavingsSub) {
      els.kpiSavingsSub.textContent =
        computed.length === 2
          ? `${top.platform.shortName} vs ${second.platform.shortName} annual savings`
          : `Saved vs ${bottom.platform.shortName} (${bottom.effectiveRatePct.toFixed(1)}% fee)`;
    }

    const aff = affiliateLinks[top.platform.affiliateKey] || {
      url: '#',
      ctaLabel: 'Try ' + top.platform.shortName
    };

    if (els.winnerHeadline) {
      const tierNote =
        top.activeTierName && top.activeTierName !== 'Standard' ? ` [${top.activeTierName}]` : '';
      els.winnerHeadline.textContent = `#1 Highest Take-Home: ${top.platform.name}${tierNote}`;
    }
    if (els.winnerDesc) {
      const compareTarget = computed.length === 2 ? second : bottom;
      els.winnerDesc.textContent = `You keep ${fmtUsd(top.netMonthly)}/mo (${(100 - top.effectiveRatePct).toFixed(1)}% of gross) — saving ${fmtUsd(Math.abs(top.netAnnual - compareTarget.netAnnual))}/year over ${compareTarget.platform.shortName}.`;
    }
    if (els.winnerCta) {
      els.winnerCta.href = aff.url;
      els.winnerCta.textContent = aff.ctaLabel + ' →';
    }

    const annualFeeBurn = Math.round(top.totalFees * 12);
    const kitPriceUsd = 19;
    const roiMultiple = Math.max(5, Math.round(Math.max(annualFeeBurn, annualSpread) / kitPriceUsd));
    if (els.proRoiPill) {
      els.proRoiPill.textContent = `${roiMultiple}x Year-1 Fee Coverage`;
    }
    if (els.proDynamicHook) {
      els.proDynamicHook.textContent = `At ${fmtUsd(state.grossMonthly)}/mo gross, you still pay ${fmtUsd(annualFeeBurn)}/yr in processor fees (and up to ${fmtUsd(annualSpread)}/yr more on the wrong rail). Model your exact 24-month churn, CAC payback, VAT & bank runway offline in 60 seconds.`;
    }

    if (els.resultsContainer) {
      els.resultsContainer.innerHTML = computed
        .map((r, idx) => {
          const gross = Math.max(1, state.grossMonthly);
          const keepPct = Math.max(0, Math.min(100, (r.netMonthly / gross) * 100));
          const basePct = Math.max(0, Math.min(100 - keepPct, (r.baseCore / gross) * 100));
          const surPct = Math.max(0, 100 - keepPct - basePct);
          const linkObj = affiliateLinks[r.platform.affiliateKey] || {
            url: '#',
            ctaLabel: 'Visit ' + r.platform.shortName
          };
          const tierLabel =
            r.activeTierName && r.activeTierName !== 'Standard'
              ? `<span class="tag-badge">${r.activeTierName}</span>`
              : '';
          const morBadge = r.platform.isMoR
            ? `<span class="tag-badge tag-mor">MoR Tax Handled</span>`
            : `<span class="tag-badge tag-diy">DIY Tax</span>`;

          const diffFromTop = top.netMonthly - r.netMonthly;

          return `
          <div class="result-card ${idx === 0 ? 'rank-1' : ''}">
            <div class="result-top">
              <div class="result-name-wrap">
                <span class="rank-pill">#${idx + 1}</span>
                <a class="result-title" href="${basePath}/calculators/${r.platform.slug}-fee-calculator/">${r.platform.name}</a>
                ${morBadge}
                ${tierLabel}
              </div>
              <div class="result-numbers tabular">
                <div class="net-amount">${fmtUsd(r.netMonthly)}<span style="font-size:0.8rem;font-weight:600;color:#64748b;">/mo net</span></div>
                <div class="fee-meta">${fmtUsd(r.totalFees, 0)} fees (${r.effectiveRatePct.toFixed(2)}%)${
            idx > 0 ? ` · <span style="color:#dc2626;">-${fmtUsd(diffFromTop * 12)}/yr</span>` : ' · <span style="color:#059669;font-weight:700;">Best Net</span>'
          }</div>
              </div>
            </div>
            <div class="bar-track" title="Keep ${keepPct.toFixed(1)}% | Base Fee ${basePct.toFixed(1)}% | Hidden/FX Surcharges ${surPct.toFixed(1)}%">
              <div class="bar-keep" style="width:${keepPct.toFixed(2)}%"></div>
              <div class="bar-base" style="width:${basePct.toFixed(2)}%"></div>
              <div class="bar-surcharge" style="width:${surPct.toFixed(2)}%"></div>
            </div>
            <div class="breakdown-chips tabular">
              <div class="chip-list">
                <span>Base + Fixed: <strong>${fmtUsd(r.baseCore, 0)}</strong></span>
                <span>Intl/FX/Sub Add-ons: <strong>${fmtUsd(r.surcharges, 0)}</strong></span>
                ${
                  r.starterSavings > 1
                    ? `<span style="color:#059669;font-weight:700;">Tier Upgrade Saves +${fmtUsd(r.starterSavings, 0)}/mo</span>`
                    : ''
                }
              </div>
              <div class="result-actions">
                <a class="result-cta" href="${linkObj.url}" target="_blank" rel="noopener">${linkObj.ctaLabel} ↗</a>
              </div>
            </div>
          </div>`;
        })
        .join('');
    }
  }

  // Event listeners
  if (els.revSlider) {
    els.revSlider.addEventListener('input', (e) => {
      state.grossMonthly = Number(e.target.value);
      render();
    });
  }
  if (els.revNum) {
    els.revNum.addEventListener('input', (e) => {
      state.grossMonthly = Math.max(0, Number(e.target.value) || 0);
      render();
    });
  }
  if (els.aovSlider) {
    els.aovSlider.addEventListener('input', (e) => {
      state.avgOrderValue = Math.max(1, Number(e.target.value));
      render();
    });
  }
  if (els.aovNum) {
    els.aovNum.addEventListener('input', (e) => {
      state.avgOrderValue = Math.max(1, Number(e.target.value) || 1);
      render();
    });
  }
  if (els.intlSlider) {
    els.intlSlider.addEventListener('input', (e) => {
      state.intlSharePct = Number(e.target.value);
      state.fxSharePct = Math.round(state.intlSharePct * 0.6);
      render();
    });
  }
  if (els.ppSlider) {
    els.ppSlider.addEventListener('input', (e) => {
      state.paypalSharePct = Number(e.target.value);
      render();
    });
  }
  if (els.taxCheck) {
    els.taxCheck.addEventListener('change', (e) => {
      state.requireGlobalTax = e.target.checked;
      render();
    });
  }
  if (els.btnRecurring) {
    els.btnRecurring.addEventListener('click', () => {
      state.billingType = 'recurring';
      render();
    });
  }
  if (els.btnOnetime) {
    els.btnOnetime.addEventListener('click', () => {
      state.billingType = 'onetime';
      render();
    });
  }

  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      try {
        const p = JSON.parse(btn.getAttribute('data-preset'));
        Object.assign(state, p);
        document.querySelectorAll('[data-preset]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        render();
      } catch (_) {}
    });
  });

  if (els.aiModelSelect) {
    els.aiModelSelect.addEventListener('change', (e) => {
      state.aiModelId = e.target.value;
      render();
    });
  }
  if (els.aiPromptsInput) {
    els.aiPromptsInput.addEventListener('input', (e) => {
      state.aiPrompts = Math.max(1, Number(e.target.value) || 1);
      render();
    });
  }
  if (els.aiUsersInput) {
    els.aiUsersInput.addEventListener('input', (e) => {
      state.aiUsers = Math.max(1, Number(e.target.value) || 1);
      render();
    });
  }

  if (els.btnCopyLink) {
    els.btnCopyLink.addEventListener('click', () => {
      const u = new URL(window.location.href);
      u.searchParams.set('rev', Math.round(state.grossMonthly));
      u.searchParams.set('aov', Math.round(state.avgOrderValue));
      u.searchParams.set('bill', state.billingType);
      u.searchParams.set('intl', Math.round(state.intlSharePct));
      u.searchParams.set('pp', Math.round(state.paypalSharePct));
      navigator.clipboard?.writeText(u.toString());
      if (els.postExportUpsell) {
        els.postExportUpsell.hidden = false;
        if (els.postExportText) {
          els.postExportText.textContent = `Copied ${fmtUsd(state.grossMonthly)}/mo link! Want the offline 24-month cohort churn + GBP/USD/EUR runway simulator too?`;
        }
      }
      const orig = els.btnCopyLink.textContent;
      els.btnCopyLink.textContent = '✓ Link Copied!';
      setTimeout(() => {
        els.btnCopyLink.textContent = orig;
      }, 1800);
    });
  }

  if (els.btnExportCsv) {
    els.btnExportCsv.addEventListener('click', () => {
      const headers = ['Rank', 'Platform', 'Active Tier', 'MoR Tax Handled', 'Gross Monthly USD', 'Total Fees USD', 'Effective Fee %', 'Net Monthly USD', 'Net Annual USD'];
      const rows = latestResults.map((r, i) => [
        i + 1,
        `"${r.platform.name}"`,
        `"${r.activeTierName}"`,
        r.platform.isMoR ? 'Yes' : 'No',
        state.grossMonthly.toFixed(2),
        r.totalFees.toFixed(2),
        r.effectiveRatePct.toFixed(2) + '%',
        r.netMonthly.toFixed(2),
        r.netAnnual.toFixed(2)
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marginpilot-fee-comparison-${Math.round(state.grossMonthly)}mrr.csv`;
      a.click();
      URL.revokeObjectURL(url);
      if (els.postExportUpsell) {
        els.postExportUpsell.hidden = false;
        if (els.postExportText) {
          els.postExportText.textContent = `Exported ${fmtUsd(state.grossMonthly)}/mo snapshot! Want the offline 24-month cohort churn + GBP/USD/EUR runway simulator too?`;
        }
      }
    });
  }

  render();
})();
