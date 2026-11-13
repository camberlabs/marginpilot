import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, '..', 'dist', 'url-manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('dist/url-manifest.json not found. Run `npm run build` first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const parsedOrigin = new URL(manifest.siteOrigin.endsWith('/') ? manifest.siteOrigin : manifest.siteOrigin + '/');

const payload = {
  host: parsedOrigin.host,
  key: manifest.indexNowKey,
  keyLocation: `${manifest.siteOrigin.replace(/\/$/, '')}/${manifest.indexNowKey}.txt`,
  urlList: manifest.urls
};

console.log(`Submitting ${manifest.urls.length} URLs to IndexNow for host ${parsedOrigin.host}...`);

try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });
  console.log(`IndexNow response status: ${res.status} ${res.statusText}`);
} catch (err) {
  console.warn('IndexNow ping skipped or offline:', err.message);
}
