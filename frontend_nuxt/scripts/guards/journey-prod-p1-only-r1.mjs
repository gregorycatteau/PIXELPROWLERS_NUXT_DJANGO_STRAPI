import fs from 'node:fs';
import path from 'node:path';

// journey-prod-p1-only-r1:guard
//
// OBJECTIF : En prod, seuls les journeys "visibility: prod" sont visibles.
// Les journeys "dev" doivent rester 404 en prod.

const ROOT = process.cwd();
const VISIBILITY_FILE = 'app/config/journeys/visibility.ts';
const MIDDLEWARE_FILE = 'server/middleware/journey-slug-guard.ts';
const PAGE_FILE = 'app/pages/parcours/[journeySlug].vue';

const MANIFEST_DIR = 'app/config/journeys/manifests';
const MANIFEST_EXT = '.manifest.ts';

const readFile = (absPath) => {
  const relPath = path.relative(ROOT, absPath);
  if (!fs.existsSync(absPath)) return { path: relPath, content: null };
  return { path: relPath, content: fs.readFileSync(absPath, 'utf8') };
};

const getManifestFiles = () => {
  const dir = path.join(ROOT, MANIFEST_DIR);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(MANIFEST_EXT))
    .filter((file) => !file.endsWith('_template.manifest.ts'))
    .filter((file) => !file.includes('_stub.manifest.ts'))
    .map((file) => path.join(dir, file));
};

const extractField = (content, fieldName) => {
  const match = content.match(new RegExp(`${fieldName}:\\s*['"]([^'"]+)['"]`));
  return match?.[1] ?? null;
};

const hasAllPatterns = (content, patterns) =>
  patterns.every((pattern) => pattern.test(content));

function main() {
  console.log('🔍 journey-prod-p1-only-r1:guard — Checking visibility-driven prod gate...\n');

  const visibility = readFile(path.join(ROOT, VISIBILITY_FILE));
  const middleware = readFile(path.join(ROOT, MIDDLEWARE_FILE));
  const page = readFile(path.join(ROOT, PAGE_FILE));

  const errors = [];
  const manifestFiles = getManifestFiles();

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
    if (!/if\s*\(!context\.isDev\)\s*return\s*false/.test(visibility.content)) {
      errors.push(`Visibility helper must block dev journeys in prod: ${VISIBILITY_FILE}`);
    }
  }

  if (!middleware.content || !/isJourneyAllowedInCurrentEnv/.test(middleware.content)) {
    errors.push(`Missing visibility gating in middleware: ${MIDDLEWARE_FILE}`);
  }

  if (!page.content || !/isJourneyAllowedInCurrentEnv/.test(page.content)) {
    errors.push(`Missing visibility gating in page: ${PAGE_FILE}`);
  }

  if (manifestFiles.length === 0) {
    errors.push(`No manifest files found in ${MANIFEST_DIR}`);
  }

  let prodCount = 0;
  manifestFiles.forEach((absPath) => {
    const file = readFile(absPath);
    if (!file.content) {
      errors.push(`Missing manifest: ${file.path}`);
      return;
    }
    const slug = extractField(file.content, 'slug') ?? 'unknown';
    const visibilityValue = extractField(file.content, 'visibility');
    if (!visibilityValue) {
      errors.push(`Missing visibility in manifest: ${file.path} (slug: ${slug})`);
      return;
    }
    if (!['prod', 'dev'].includes(visibilityValue)) {
      errors.push(
        `Invalid visibility in manifest: ${file.path} (slug: ${slug}, visibility: ${visibilityValue})`
      );
      return;
    }
    if (visibilityValue === 'prod') {
      prodCount += 1;
    }
  });

  if (prodCount < 1) {
    errors.push('At least one manifest must be visibility: "prod"');
  }

  if (errors.length) {
    console.log('❌ journey-prod-p1-only-r1:guard — FAIL\n');
    errors.forEach((err) => console.log(`   ❌ ${err}`));
    process.exit(1);
  }

  console.log('✅ journey-prod-p1-only-r1:guard — OK');
  console.log('   └── Prod access follows manifest visibility');
  console.log('');
}

main();
