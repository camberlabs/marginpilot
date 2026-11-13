import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PLATFORMS } from '../src/data/platforms.mjs';
import { MATCHUPS } from '../src/data/matchups.mjs';
import { SCENARIOS } from '../src/data/scenarios.mjs';
import { buildHomePage, buildDirectoryPage, buildProKitPage } from '../src/templates/pages-home.mjs';
import { buildVersusPage } from '../src/templates/pages-versus.mjs';
import { buildPlatformPage } from '../src/templates/pages-platform.mjs';
import { buildScenarioPage } from '../src/templates/pages-scenario.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const config = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'config', 'monetization.json'), 'utf8')
);

// Optional subpath support (e.g., SITE_BASE_PATH="/marginpilot" for GitHub Pages project URLs)
const rawBase = (process.env.SITE_BASE_PATH || '').trim();
const basePath = rawBase && rawBase !== '/' ? '/' + rawBase.replace(/^\/+|\/+$/g, '') : '';
if (process.env.SITE_ORIGIN) {
  config.brand.siteUrl = process.env.SITE_ORIGIN.replace(/\/$/, '');
}

if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

// Copy static assets
fs.copyFileSync(
  path.join(ROOT, 'src', 'templates', 'styles.css'),
  path.join(DIST, 'assets', 'styles.css')
);
fs.copyFileSync(
  path.join(ROOT, 'src', 'templates', 'client-app.js'),
  path.join(DIST, 'assets', 'client-app.js')
);

const generatedRoutes = [];

function writeRoute(routePath, html) {
  const cleanRel = routePath.replace(/^\/+/, '');
  const outFile =
    cleanRel === ''
      ? path.join(DIST, 'index.html')
      : path.join(DIST, cleanRel, 'index.html');

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');
  generatedRoutes.push(routePath.endsWith('/') ? routePath : routePath + '/');
}

// 1. Core pages
writeRoute('/', buildHomePage(config, basePath));
writeRoute('/directory/', buildDirectoryPage(config, basePath));
writeRoute('/pro-kit/', buildProKitPage(config, basePath));

// 2. Platform deep-dive calculators (12)
for (const p of PLATFORMS) {
  writeRoute(
    `/calculators/${p.slug}-fee-calculator/`,
    buildPlatformPage(p, config, basePath)
  );
}

// 3. Head-to-head versus pages (66)
for (const m of MATCHUPS) {
  writeRoute(`/vs/${m.slug}/`, buildVersusPage(m, config, basePath));
}

// 4. Scenario & AI SaaS margin pages (18)
for (const s of SCENARIOS) {
  writeRoute(`/scenarios/${s.slug}/`, buildScenarioPage(s, config, basePath));
}

// 5. Custom 404 page
fs.writeFileSync(
  path.join(DIST, '404.html'),
  buildDirectoryPage(config, basePath),
  'utf8'
);

// 6. XML Sitemap
const siteOrigin = config.brand.siteUrl.replace(/\/$/, '');
const lastmod = config.brand.lastVerifiedDate || new Date().toISOString().slice(0, 10);
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedRoutes
  .map(
    (r) => `  <url>
    <loc>${siteOrigin}${basePath}${r}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r === '/' ? '1.0' : r.startsWith('/calculators/') || r.startsWith('/scenarios/') ? '0.85' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemapXml, 'utf8');

// 7. robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteOrigin}${basePath}/sitemap.xml
`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robotsTxt, 'utf8');

// 8. IndexNow verification key file + URL manifest for zero-signup Bing / DuckDuckGo / Copilot indexing
if (config.brand.indexNowKey) {
  fs.writeFileSync(
    path.join(DIST, `${config.brand.indexNowKey}.txt`),
    config.brand.indexNowKey,
    'utf8'
  );
}
fs.writeFileSync(
  path.join(DIST, 'url-manifest.json'),
  JSON.stringify(
    {
      siteOrigin: `${siteOrigin}${basePath}`,
      indexNowKey: config.brand.indexNowKey,
      count: generatedRoutes.length,
      urls: generatedRoutes.map((r) => `${siteOrigin}${basePath}${r}`)
    },
    null,
    2
  ),
  'utf8'
);

// 9. llms.txt for AI Search Engines (ChatGPT Search, Perplexity, Claude, Gemini)
const llmsTxt = `# ${config.brand.name} — ${config.brand.tagline}

> Deterministic 2026 fee, FX surcharge, and net take-home calculators for SaaS founders, AI app builders, and digital creators.

## Verified 2026 Baseline Rates
${PLATFORMS.map(
  (p) =>
    `- **${p.name}** (${p.isMoR ? 'Merchant of Record' : 'Direct Gateway'}): ${p.monthlyFeeUsd > 0 ? '$' + p.monthlyFeeUsd + '/mo + ' : ''}${p.baseRatePct}% + $${p.fixedFeeUsd.toFixed(2)} base | +${p.intlCardSurchargePct}% intl | +${p.subscriptionSurchargePct}% recurring | Calculator: ${siteOrigin}${basePath}/calculators/${p.slug}-fee-calculator/`
).join('\n')}

## High-Intent Founder Scenarios
${SCENARIOS.map(
  (s) => `- [${s.title}](${siteOrigin}${basePath}/scenarios/${s.slug}/): ${s.insight}`
).join('\n')}

## Full Directory
- [All ${generatedRoutes.length} Calculators](${siteOrigin}${basePath}/directory/)
`;
fs.writeFileSync(path.join(DIST, 'llms.txt'), llmsTxt, 'utf8');

// 10. .nojekyll so GitHub Pages serves all folders cleanly
fs.writeFileSync(path.join(DIST, '.nojekyll'), '', 'utf8');

console.log(
  `Successfully generated ${generatedRoutes.length} interactive pages + sitemap.xml + llms.txt + IndexNow key into dist/`
);
