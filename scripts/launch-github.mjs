import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const repoName = process.argv[2] || 'marginpilot';

console.log(`Preparing automated $0 GitHub Pages launch for repo "${repoName}"...`);

if (!fs.existsSync(path.join(ROOT, '.git'))) {
  execSync('git init -b main', { cwd: ROOT, stdio: 'inherit' });
}

const gitignore = `node_modules/
dist/
dist-product/
.DS_Store
`;
if (!fs.existsSync(path.join(ROOT, '.gitignore'))) {
  fs.writeFileSync(path.join(ROOT, '.gitignore'), gitignore, 'utf8');
}

execSync('git add .', { cwd: ROOT, stdio: 'inherit' });
try {
  execSync('git commit -m "Initial launch: MarginPilot 2026 programmatic fee calculator network"', {
    cwd: ROOT,
    stdio: 'inherit'
  });
} catch (_) {
  // Already committed
}

const ghUser = execSync('gh api user -q .login', { cwd: ROOT, encoding: 'utf8' }).trim();
console.log(`Authenticated GitHub user: ${ghUser}`);

execSync(`gh repo create ${repoName} --public --source=. --remote=origin --push`, {
  cwd: ROOT,
  stdio: 'inherit'
});

try {
  execSync(
    `gh api -X POST repos/${ghUser}/${repoName}/pages -f build_type=workflow`,
    { cwd: ROOT, stdio: 'pipe' }
  );
} catch (_) {
  // Pages may already be enabled
}

execSync('gh workflow run deploy-and-index.yml', { cwd: ROOT, stdio: 'inherit' });

console.log(`\nLIVE DEPLOYMENT TRIGGERED!`);
console.log(`Your zero-cost automated site will be live in ~60 seconds at: https://${ghUser}.github.io/${repoName}/`);
