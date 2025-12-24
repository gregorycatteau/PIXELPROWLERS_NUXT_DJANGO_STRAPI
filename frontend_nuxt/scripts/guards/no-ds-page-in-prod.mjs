/**
 * Guard: no-ds-page-in-prod
 * 
 * Vérifie que la page /ds (DS Catalog) :
 * 1) Contient la clause DEV-only (import.meta.dev + createError 404)
 * 2) Pas de fetch/network calls dans les composants ds/catalog/*
 * 
 * Exit(1) si violation détectée.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const DS_PAGE_PATH = path.join(rootDir, 'app/pages/ds.vue');
const DS_CATALOG_DIR = path.join(rootDir, 'app/components/ds/catalog');

// ─────────────────────────────────────────────────────────────────────────────
// Colors for output
// ─────────────────────────────────────────────────────────────────────────────
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

// ─────────────────────────────────────────────────────────────────────────────
// Check 1: DEV-only clause in ds.vue
// ─────────────────────────────────────────────────────────────────────────────
function checkDevOnlyClause() {
  console.log('\n🔍 Guard: no-ds-page-in-prod');
  console.log('   Checking that /ds page has DEV-only guard...\n');

  if (!fs.existsSync(DS_PAGE_PATH)) {
    console.log(`${YELLOW}⚠️  pages/ds.vue not found — skipping guard${RESET}`);
    return { ok: true, skipped: true };
  }

  const content = fs.readFileSync(DS_PAGE_PATH, 'utf-8');

  // Must contain both import.meta.dev check AND createError with 404
  const hasImportMetaDev = /if\s*\(\s*!import\.meta\.dev\s*\)/.test(content);
  const hasCreateError404 = /createError\s*\(\s*\{\s*statusCode:\s*404/.test(content);

  if (!hasImportMetaDev || !hasCreateError404) {
    console.log(`${RED}❌ VIOLATION: pages/ds.vue missing DEV-only guard${RESET}`);
    console.log('   Required pattern:');
    console.log(`   ${YELLOW}if (!import.meta.dev) {${RESET}`);
    console.log(`   ${YELLOW}  throw createError({ statusCode: 404, statusMessage: 'Not Found' })${RESET}`);
    console.log(`   ${YELLOW}}${RESET}`);
    console.log(`\n   Found import.meta.dev check: ${hasImportMetaDev ? '✓' : '✗'}`);
    console.log(`   Found createError 404: ${hasCreateError404 ? '✓' : '✗'}`);
    return { ok: false };
  }

  console.log(`${GREEN}✓ pages/ds.vue has DEV-only guard (import.meta.dev + createError 404)${RESET}`);
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Check 2: No fetch/network calls in ds catalog components
// ─────────────────────────────────────────────────────────────────────────────
function checkNoNetworkCalls() {
  console.log('\n   Checking for forbidden network calls in ds/catalog components...\n');

  if (!fs.existsSync(DS_CATALOG_DIR)) {
    console.log(`${YELLOW}⚠️  components/ds/catalog/ not found — skipping network check${RESET}`);
    return { ok: true, skipped: true };
  }

  const files = fs.readdirSync(DS_CATALOG_DIR)
    .filter(f => f.endsWith('.vue') || f.endsWith('.ts'))
    .map(f => path.join(DS_CATALOG_DIR, f));

  const violations = [];

  // Patterns interdits
  const forbiddenPatterns = [
    { regex: /\bfetch\s*\(/, name: 'fetch(' },
    { regex: /\$fetch\s*\(/, name: '$fetch(' },
    { regex: /useFetch\s*\(/, name: 'useFetch(' },
    { regex: /useAsyncData\s*\(/, name: 'useAsyncData(' },
    { regex: /useLazyFetch\s*\(/, name: 'useLazyFetch(' },
    { regex: /useLazyAsyncData\s*\(/, name: 'useLazyAsyncData(' },
  ];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    for (const { regex, name } of forbiddenPatterns) {
      if (regex.test(content)) {
        violations.push({ file: fileName, pattern: name });
      }
    }
  }

  if (violations.length > 0) {
    console.log(`${RED}❌ VIOLATIONS: Network calls found in ds/catalog components${RESET}`);
    for (const v of violations) {
      console.log(`   - ${v.file}: ${YELLOW}${v.pattern}${RESET}`);
    }
    console.log(`\n   DS Catalog must be static (no data fetching).`);
    return { ok: false, violations };
  }

  console.log(`${GREEN}✓ No network calls in ds/catalog components (${files.length} files scanned)${RESET}`);
  return { ok: true, filesScanned: files.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  const check1 = checkDevOnlyClause();
  const check2 = checkNoNetworkCalls();

  console.log('');

  if (!check1.ok || !check2.ok) {
    console.log(`${RED}❌ Guard FAILED — no-ds-page-in-prod${RESET}\n`);
    process.exit(1);
  }

  console.log(`${GREEN}✅ Guard PASSED — no-ds-page-in-prod${RESET}`);
  console.log(`   ├── pages/ds.vue has DEV-only guard`);
  console.log(`   └── No network calls in ds/catalog components\n`);
  process.exit(0);
}

main();
