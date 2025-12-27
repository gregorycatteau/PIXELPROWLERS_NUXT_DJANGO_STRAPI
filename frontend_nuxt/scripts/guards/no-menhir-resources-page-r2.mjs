#!/usr/bin/env node
/**
 * no-menhir-resources-page-r2.mjs
 * 
 * Guard anti-MENHIR pour la page /ressources.
 * Vérifie que ressources/index.vue est "thin" (montage + SEO uniquement).
 * 
 * Règles :
 * - ressources/index.vue doit contenir PPResourcesLibraryShell
 * - ressources/index.vue doit contenir useHead (SEO)
 * - ressources/index.vue NE doit PAS contenir de classes "pp-resources-library__*" (MENHIR pattern)
 * - ressources/index.vue NE doit PAS contenir de logique lourde (useResourcesLibrary directement)
 * 
 * Exit codes:
 * - 0 = PASS
 * - 1 = FAIL
 * 
 * Usage: node scripts/guards/no-menhir-resources-page-r2.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Files to check
const PAGE_PATH = resolve(ROOT, 'app/pages/ressources/index.vue');
const SHELL_PATH = resolve(ROOT, 'app/components/resources/library/PPResourcesLibraryShell.vue');
const FILTERS_PATH = resolve(ROOT, 'app/components/resources/library/PPResourcesLibraryFilters.vue');
const TOOLBAR_PATH = resolve(ROOT, 'app/components/resources/library/PPResourcesLibraryToolbar.vue');
const GRID_PATH = resolve(ROOT, 'app/components/resources/library/PPResourcesLibraryGrid.vue');
const PAGINATION_PATH = resolve(ROOT, 'app/components/resources/library/PPResourcesLibraryPagination.vue');

// Patterns
const MENHIR_CLASS_PATTERN = /pp-resources-library__/g;
const LEGACY_IMPORT_PATTERN = /import.*useResourcesLibrary.*from/;
const SHELL_USAGE_PATTERN = /<PPResourcesLibraryShell/;
const SEO_PATTERN = /useHead\s*\(/;
const V_HTML_PATTERN = /v-html/;

console.log('🔍 Guard: no-menhir-resources-page-r2');
console.log('   Checking that ressources/index.vue is thin (NO MENHIR)...\n');

const errors = [];
const warnings = [];

// -----------------------------------------------------------------------------
// 1) Check ressources.vue exists
// -----------------------------------------------------------------------------

if (!existsSync(PAGE_PATH)) {
  errors.push('❌ app/pages/ressources/index.vue does not exist');
} else {
  const pageContent = readFileSync(PAGE_PATH, 'utf-8');
  
  // Check for PPResourcesLibraryShell usage
  if (!SHELL_USAGE_PATTERN.test(pageContent)) {
    errors.push('❌ ressources/index.vue must use <PPResourcesLibraryShell />');
  }
  
  // Check for useHead (SEO)
  if (!SEO_PATTERN.test(pageContent)) {
    errors.push('❌ ressources/index.vue must use useHead() for SEO');
  }
  
  // Check for MENHIR pattern (pp-resources-library__* classes in page)
  const menhirMatches = pageContent.match(MENHIR_CLASS_PATTERN);
  if (menhirMatches && menhirMatches.length > 0) {
    errors.push(`❌ MENHIR detected: ressources/index.vue contains ${menhirMatches.length} "pp-resources-library__*" classes`);
    errors.push('   → Move these styles to DS cells or pp.components.css');
  }
  
  // Check for direct useResourcesLibrary import (should be in Shell, not page)
  if (LEGACY_IMPORT_PATTERN.test(pageContent)) {
    errors.push('❌ ressources/index.vue should NOT import useResourcesLibrary directly');
    errors.push('   → Logic should live in PPResourcesLibraryShell');
  }
  
  // Check for v-html (forbidden)
  if (V_HTML_PATTERN.test(pageContent)) {
    errors.push('❌ ressources/index.vue must NOT use v-html');
  }
  
  // Check page is small (thin page check)
  const lines = pageContent.split('\n').length;
  if (lines > 80) {
    warnings.push(`⚠️  ressources/index.vue has ${lines} lines (thin page should be < 80 lines)`);
  }
}

// -----------------------------------------------------------------------------
// 2) Check CELLS exist
// -----------------------------------------------------------------------------

const cellsToCheck = [
  { path: SHELL_PATH, name: 'PPResourcesLibraryShell' },
  { path: FILTERS_PATH, name: 'PPResourcesLibraryFilters' },
  { path: TOOLBAR_PATH, name: 'PPResourcesLibraryToolbar' },
  { path: GRID_PATH, name: 'PPResourcesLibraryGrid' },
  { path: PAGINATION_PATH, name: 'PPResourcesLibraryPagination' },
];

for (const cell of cellsToCheck) {
  if (!existsSync(cell.path)) {
    errors.push(`❌ Missing CELL: ${cell.name}.vue`);
  }
}

// -----------------------------------------------------------------------------
// 3) Check Shell imports composable
// -----------------------------------------------------------------------------

if (existsSync(SHELL_PATH)) {
  const shellContent = readFileSync(SHELL_PATH, 'utf-8');
  
  // Shell should import useResourcesLibrary
  if (!shellContent.includes('useResourcesLibrary')) {
    warnings.push('⚠️  PPResourcesLibraryShell should use useResourcesLibrary composable');
  }
  
  // Shell should NOT have v-html
  if (V_HTML_PATTERN.test(shellContent)) {
    errors.push('❌ PPResourcesLibraryShell must NOT use v-html');
  }
}

// -----------------------------------------------------------------------------
// Output
// -----------------------------------------------------------------------------

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(w => console.log(`   ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Guard FAILED — MENHIR detected or missing components\n');
  errors.forEach(e => console.log(`   ${e}`));
  console.log('');
  process.exit(1);
}

console.log('✅ Guard PASSED — Resources Page is thin (NO MENHIR)');
console.log('   ├── pages/ressources/index.vue uses PPResourcesLibraryShell + useHead');
console.log('   ├── No "pp-resources-library__*" classes in page');
console.log('   ├── All 5 CELLS exist');
console.log('   └── No v-html detected');
console.log('');

process.exit(0);
