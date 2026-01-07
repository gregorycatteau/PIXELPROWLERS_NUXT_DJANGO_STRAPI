import fs from 'node:fs';
import path from 'node:path';

// journey-prod-p1-only-r1:guard
//
// OBJECTIF : En prod, seul P1 est visible. Les autres journeys exigent un flag dev explicite.

const ROOT = process.cwd();
const VISIBILITY_FILE = 'app/config/journeys/visibility.ts';
const MIDDLEWARE_FILE = 'server/middleware/journey-slug-guard.ts';
const PAGE_FILE = 'app/pages/parcours/[journeySlug].vue';

const MANIFEST_FILES = [
  'app/config/journeys/manifests/p1.manifest.ts',
  'app/config/journeys/manifests/p2.manifest.ts',
  'app/config/journeys/manifests/p3.manifest.ts',
  'app/config/journeys/manifests/p4.manifest.ts',
  'app/config/journeys/manifests/p5.manifest.ts',
  'app/config/journeys/manifests/p2_stub.manifest.ts',
  'app/config/journeys/manifests/p3_stub.manifest.ts',
  'app/config/journeys/manifests/p4_stub.manifest.ts'
];

const readFile = (relPath) => {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return { path: relPath, content: null };
  return { path: relPath, content: fs.readFileSync(abs, 'utf8') };
};

const hasAllPatterns = (content, patterns) =>
  patterns.every((pattern) => pattern.test(content));

function main() {
  console.log('🔍 journey-prod-p1-only-r1:guard — Checking prod-only visibility...\n');

  const visibility = readFile(VISIBILITY_FILE);
  const middleware = readFile(MIDDLEWARE_FILE);
  const page = readFile(PAGE_FILE);

  const errors = [];

  if (!visibility.content) {
    errors.push(`Missing visibility helper: ${VISIBILITY_FILE}`);
  } else {
    const required = [
      /manifest\.visibility\s*===\s*['"]prod['"]/, 
      /context\.isDev/, 
      /devAllowlist/, 
      /allowlist\.has/ 
    ];
    if (!hasAllPatterns(visibility.content, required)) {
      errors.push(`Visibility helper missing required gating logic: ${VISIBILITY_FILE}`);
    }
  }

  if (!middleware.content || !/isJourneyAllowedInCurrentEnv/.test(middleware.content)) {
    errors.push(`Missing visibility gating in middleware: ${MIDDLEWARE_FILE}`);
  }

  if (!page.content || !/isJourneyAllowedInCurrentEnv/.test(page.content)) {
    errors.push(`Missing visibility gating in page: ${PAGE_FILE}`);
  }

  const p1Manifest = readFile('app/config/journeys/manifests/p1.manifest.ts');
  if (!p1Manifest.content || !/visibility:\s*['"]prod['"]/.test(p1Manifest.content)) {
    errors.push('P1 manifest must be visibility: "prod"');
  }

  MANIFEST_FILES.forEach((filePath) => {
    if (filePath.endsWith('p1.manifest.ts')) return;
    const file = readFile(filePath);
    if (!file.content) {
      errors.push(`Missing manifest: ${filePath}`);
      return;
    }
    if (!/visibility:\s*['"]dev['"]/.test(file.content)) {
      errors.push(`Non-prod manifest must be visibility: "dev" (${filePath})`);
    }
    if (/visibility:\s*['"]prod['"]/.test(file.content)) {
      errors.push(`Non-prod manifest cannot be visibility: "prod" (${filePath})`);
    }
  });

  if (errors.length) {
    console.log('❌ journey-prod-p1-only-r1:guard — FAIL\n');
    errors.forEach((err) => console.log(`   ❌ ${err}`));
    process.exit(1);
  }

  console.log('✅ journey-prod-p1-only-r1:guard — OK');
  console.log('   └── P1 is prod-only, others require dev allowlist');
  console.log('');
}

main();
