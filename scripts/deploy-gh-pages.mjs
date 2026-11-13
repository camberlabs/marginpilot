import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const ghUser = process.env.GH_OWNER || 'esmalldev';
const repoName = process.env.GH_REPO || 'marginpilot';
const origin = `https://${ghUser}.github.io`;
const basePath = `/${repoName}`;
const remoteUrl = `https://github.com/${ghUser}/${repoName}.git`;

console.log(`Building site for ${origin}${basePath}/ ...`);
execSync('node scripts/build.mjs', {
  cwd: ROOT,
  stdio: 'inherit',
  env: {
    ...process.env,
    SITE_ORIGIN: origin,
    SITE_BASE_PATH: basePath
  }
});

console.log('Pushing static build to gh-pages branch...');
if (fs.existsSync(path.join(DIST, '.git'))) {
  fs.rmSync(path.join(DIST, '.git'), { recursive: true, force: true });
}

execSync('git init -b gh-pages', { cwd: DIST, stdio: 'inherit' });
execSync(`git config user.name "${ghUser}"`, { cwd: DIST, stdio: 'inherit' });
execSync(`git config user.email "${ghUser}@users.noreply.github.com"`, { cwd: DIST, stdio: 'inherit' });
execSync('git add -A', { cwd: DIST, stdio: 'inherit' });
execSync('git commit -m "Deploy MarginPilot static build"', { cwd: DIST, stdio: 'inherit' });
execSync(`git push -f ${remoteUrl} gh-pages:gh-pages`, { cwd: DIST, stdio: 'inherit' });

fs.rmSync(path.join(DIST, '.git'), { recursive: true, force: true });

console.log('Enabling GitHub Pages on gh-pages branch...');
try {
  execSync(
    `gh api -X POST repos/${ghUser}/${repoName}/pages -f "source[branch]=gh-pages" -f "source[path]=/"`,
    { cwd: ROOT, stdio: 'pipe' }
  );
  console.log('GitHub Pages enabled!');
} catch (_) {
  try {
    execSync(
      `gh api -X PUT repos/${ghUser}/${repoName}/pages -f "source[branch]=gh-pages" -f "source[path]=/"`,
      { cwd: ROOT, stdio: 'pipe' }
    );
    console.log('GitHub Pages configuration updated!');
  } catch (e2) {
    console.log('Pages status check:', e2.message);
  }
}

console.log(`\nDeployment pushed! Live URL: ${origin}${basePath}/`);
