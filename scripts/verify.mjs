import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { PLATFORM_MAP } from '../src/data/platforms.mjs';
import { calculatePlatformResult, findHeadToHeadBreakeven } from '../src/engine/calculator-core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ZIP_PATH = path.join(ROOT, 'dist-product', 'Founder-Margin-CFO-Kit-2026.zip');

let checks = 0;

// 1. Unit test core financial math & tier ladders
{
  const polarLow = calculatePlatformResult(PLATFORM_MAP.polar, {
    grossMonthly: 800,
    avgOrderValue: 29,
    billingType: 'recurring',
    intlSharePct: 0,
    fxSharePct: 0,
    paypalSharePct: 0
  });
  assert.ok(polarLow.activeTierName.includes('Starter'), 'Polar should pick Starter at $800/mo');
  checks++;

  const polarMid = calculatePlatformResult(PLATFORM_MAP.polar, {
    grossMonthly: 5000,
    avgOrderValue: 29,
    billingType: 'recurring',
    intlSharePct: 0,
    fxSharePct: 0,
    paypalSharePct: 0
  });
  assert.ok(polarMid.activeTierName.includes('Pro'), 'Polar should auto-upgrade to Pro at $5,000/mo');
  assert.ok(polarMid.starterComparisonSavings > 50, 'Polar Pro should save >$50/mo vs Starter at $5k MRR');
  checks++;

  const subVsBee = findHeadToHeadBreakeven(PLATFORM_MAP.beehiiv, PLATFORM_MAP.substack, {
    avgOrderValue: 10,
    billingType: 'recurring',
    intlSharePct: 20,
    fxSharePct: 10,
    paypalSharePct: 0
  });
  assert.ok(
    subVsBee.crossoverMonthlyUsd >= 400 && subVsBee.crossoverMonthlyUsd <= 600,
    `beehiiv vs Substack crossover should be ~$490/mo, got ${subVsBee.crossoverMonthlyUsd}`
  );
  checks++;
}

// 2. Crawl all generated HTML files in dist/
function collectHtmlFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

assert.ok(fs.existsSync(DIST), 'dist/ directory must exist');
const htmlFiles = collectHtmlFiles(DIST);
assert.ok(htmlFiles.length >= 95, `Expected >= 95 HTML pages, found ${htmlFiles.length}`);
checks++;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(html.includes('<title>'), `Missing <title> in ${file}`);
  assert.ok(html.includes('rel="canonical"'), `Missing canonical tag in ${file}`);
  assert.ok(html.includes('application/ld+json'), `Missing JSON-LD schema in ${file}`);
  assert.ok(!html.includes('NaN'), `Found NaN in ${file}`);
  assert.ok(!html.includes('>undefined<'), `Found rendered undefined in ${file}`);

  // Verify every internal root-relative href resolves to a real file in dist/
  const hrefRegex = /href="(\/[^"#?]*)"/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const targetHref = match[1];
    const relTarget = targetHref.replace(/^\/+/, '');
    const candidateA = path.join(DIST, relTarget);
    const candidateB = path.join(DIST, relTarget, 'index.html');
    const exists =
      (fs.existsSync(candidateA) && fs.statSync(candidateA).isFile()) ||
      (fs.existsSync(candidateB) && fs.statSync(candidateB).isFile());
    assert.ok(exists, `Broken internal link "${targetHref}" inside ${path.relative(DIST, file)}`);
  }
  checks++;
}

// 3. Verify sitemap, llms.txt & ready-to-sell ZIP bundle
assert.ok(fs.existsSync(path.join(DIST, 'sitemap.xml')), 'Missing sitemap.xml');
assert.ok(fs.existsSync(path.join(DIST, 'llms.txt')), 'Missing llms.txt');
assert.ok(fs.existsSync(ZIP_PATH), 'Missing Founder-Margin-CFO-Kit-2026.zip');
assert.ok(fs.statSync(ZIP_PATH).size > 4000, 'Digital product ZIP appears too small');
checks += 4;

console.log(`ALL ${checks} VERIFICATION CHECKS PASSED! (${htmlFiles.length} HTML pages audited, 0 broken links, math & schema verified, product ZIP ready).`);
