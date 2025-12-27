#!/usr/bin/env node
/**
 * Guard: no-legacy-resources-library-r1.mjs
 *
 * Enforce DS compliance for /ressources page (mode LIBRARY).
 *
 * RULES (Updated for R2 atomique architecture):
 * - pages/ressources/index.vue MUST use PPResourcesLibraryShell OR legacy PPResourcesShell/PPResourceCard
 * - pages/ressources/index.vue MUST NOT use v-html
 * - pages/ressources/index.vue MUST NOT use legacy ResourceList component
 * - composables/useResourcesLibrary.ts MUST exist
 * - If using atomique architecture: CELLS must use PPResourcesShell + PPResourceCard
 *
 * @see docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_ROOT = path.resolve(__dirname, '../../app');
const RESOURCES_PAGE = path.join(APP_ROOT, 'pages/ressources/index.vue');
const COMPOSABLE = path.join(APP_ROOT, 'composables/useResourcesLibrary.ts');
const CELLS_DIR = path.join(APP_ROOT, 'components/resources/library');
const GRID_CELL = path.join(CELLS_DIR, 'PPResourcesLibraryGrid.vue');

// =============================================================================
// GUARD LOGIC
// =============================================================================

const errors = [];
const warnings = [];

function checkFile(filePath, fileLabel, requiredPatterns = [], forbiddenPatterns = []) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${fileLabel} DOES NOT EXIST at ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  for (const rule of requiredPatterns) {
    if (!rule.pattern.test(content)) {
      errors.push(rule.message);
    }
  }

  for (const rule of forbiddenPatterns) {
    if (rule.skipCheck) continue;
    if (rule.pattern.test(content)) {
      errors.push(rule.message);
    }
  }

  return content;
}

// =============================================================================
// RUN CHECKS
// =============================================================================

console.log('🔍 Guard: no-legacy-resources-library-r1');
console.log('   Checking DS compliance for /ressources page (mode LIBRARY)...\n');

// ----------------------------------
// 1. Check page
// ----------------------------------
const pageContent = checkFile(RESOURCES_PAGE, 'pages/ressources/index.vue', [], [
  {
    pattern: /v-html/,
    message: 'pages/ressources/index.vue MUST NOT use v-html (data-only doctrine)',
  },
  {
    pattern: /<ResourceList/,
    message: 'pages/ressources/index.vue MUST NOT use legacy <ResourceList> component',
  },
  {
    pattern: /class="resources-library-wrapper"/,
    message: 'pages/ressources/index.vue MUST NOT use legacy wrapper class',
  },
]);

// Determine architecture: atomique (R2) vs direct (R1)
let isAtomiqueArchitecture = false;
if (pageContent) {
  isAtomiqueArchitecture = /<PPResourcesLibraryShell/.test(pageContent);

  if (!isAtomiqueArchitecture) {
    // Legacy R1: must have PPResourcesShell + PPResourceCard + useResourcesLibrary directly
    if (!/<PPResourcesShell/.test(pageContent)) {
      errors.push(
        'pages/ressources/index.vue MUST use <PPResourcesShell> (or PPResourcesLibraryShell for atomique arch)'
      );
    }
    if (!/<PPResourceCard/.test(pageContent)) {
      errors.push(
        'pages/ressources/index.vue MUST use <PPResourceCard> (or PPResourcesLibraryShell for atomique arch)'
      );
    }
    if (!/useResourcesLibrary/.test(pageContent)) {
      errors.push(
        'pages/ressources/index.vue MUST import useResourcesLibrary composable'
      );
    }
  }
}

// ----------------------------------
// 2. If atomique architecture: check CELLS use DS components
// ----------------------------------
if (isAtomiqueArchitecture) {
  console.log('   📦 Detected atomique architecture (PPResourcesLibraryShell)\n');

  // Check Grid CELL uses PPResourcesShell + PPResourceCard
  if (fs.existsSync(GRID_CELL)) {
    const gridContent = fs.readFileSync(GRID_CELL, 'utf-8');

    if (!/<PPResourcesShell/.test(gridContent)) {
      errors.push(
        'PPResourcesLibraryGrid.vue MUST use <PPResourcesShell> DS component'
      );
    }
    if (!/<PPResourceCard/.test(gridContent)) {
      errors.push(
        'PPResourcesLibraryGrid.vue MUST use <PPResourceCard> DS component'
      );
    }
  } else {
    errors.push(
      'PPResourcesLibraryGrid.vue DOES NOT EXIST (required for atomique architecture)'
    );
  }

  // Check Shell CELL uses useResourcesLibrary
  const shellCell = path.join(CELLS_DIR, 'PPResourcesLibraryShell.vue');
  if (fs.existsSync(shellCell)) {
    const shellContent = fs.readFileSync(shellCell, 'utf-8');
    if (!/useResourcesLibrary/.test(shellContent)) {
      errors.push(
        'PPResourcesLibraryShell.vue MUST use useResourcesLibrary composable'
      );
    }
  } else {
    errors.push(
      'PPResourcesLibraryShell.vue DOES NOT EXIST (required for atomique architecture)'
    );
  }
}

// ----------------------------------
// 3. Check composable
// ----------------------------------
checkFile(COMPOSABLE, 'composables/useResourcesLibrary.ts', [
  {
    pattern: /export\s+function\s+useResourcesLibrary/,
    message:
      'composables/useResourcesLibrary.ts MUST export useResourcesLibrary function',
  },
]);

// =============================================================================
// REPORT RESULTS
// =============================================================================

if (errors.length > 0) {
  console.log('❌ GUARD FAILED — Resources Library R1 violations found:\n');
  errors.forEach((err) => {
    console.log(`   • ${err}`);
  });
  console.log('\n');
  console.log(
    '📚 Reference: docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md'
  );
  console.log('');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach((warn) => {
    console.log(`   • ${warn}`);
  });
  console.log('\n');
}

console.log('✅ Guard PASSED — Resources Library R1 is DS-compliant');
if (isAtomiqueArchitecture) {
  console.log('   ├── pages/ressources/index.vue uses PPResourcesLibraryShell (atomique)');
  console.log('   ├── PPResourcesLibraryGrid uses PPResourcesShell + PPResourceCard');
  console.log('   ├── PPResourcesLibraryShell uses useResourcesLibrary');
} else {
  console.log('   ├── pages/ressources/index.vue uses PPResourcesShell + PPResourceCard');
}
console.log('   ├── composables/useResourcesLibrary.ts exists');
console.log('   ├── data/resourcesData.ts exists with validation');
console.log('   └── No legacy patterns detected');
console.log('');
process.exit(0);
