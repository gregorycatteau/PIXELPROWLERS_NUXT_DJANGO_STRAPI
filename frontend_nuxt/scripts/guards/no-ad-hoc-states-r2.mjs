/**
 * no-ad-hoc-states-r2.mjs
 * 
 * Guard CI STATES-R2 — Enforce DS state cells on extended scope
 * 
 * Scope R2:
 * - ContactSection.vue (PPErrorState)
 * - P1HypothesesSection.vue (PPEmptyState)
 * 
 * Checks:
 * 1. Required: at least one DS state cell (<PPEmptyState> or <PPErrorState> or <PPLoadingState>)
 * 2. Forbidden: legacy ad-hoc state patterns (pp-status-error, etc.)
 * 
 * @version V1.STATES-R2
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// -----------------------------------------------------------------------------
// SCOPE R2: Explicit file list
// -----------------------------------------------------------------------------
const SCOPE_FILES = [
  {
    path: 'app/components/home/ContactSection.vue',
    expectedState: 'PPErrorState',
  },
  {
    path: 'app/components/journey/p1/P1HypothesesSection.vue',
    expectedState: 'PPEmptyState',
  },
];

// -----------------------------------------------------------------------------
// FORBIDDEN PATTERNS — Legacy inline states
// -----------------------------------------------------------------------------
const FORBIDDEN_PATTERNS = [
  { regex: /class="[^"]*pp-status-error[^"]*"/gi, label: 'class="pp-status-error" (use <PPErrorState>)' },
  { regex: /class="[^"]*pp-status-success[^"]*"/gi, label: 'class="pp-status-success" (consider <PPEmptyState tone="success">)' },
  { regex: /class="[^"]*FormStatusError[^"]*"/gi, label: 'class="FormStatusError" (use <PPErrorState>)' },
];

// -----------------------------------------------------------------------------
// REQUIRED PATTERNS — DS state cells
// -----------------------------------------------------------------------------
const DS_STATE_CELLS = [
  /<PPEmptyState/,
  /<PPErrorState/,
  /<PPLoadingState/,
];

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------
function main() {
  console.log('\n🔍 Guard: no-ad-hoc-states-r2');
  console.log(`   Checking ${SCOPE_FILES.length} R2 file(s) for DS state cells...\n`);

  let hasViolations = false;
  const violations = [];

  for (const { path: relPath, expectedState } of SCOPE_FILES) {
    const absPath = resolve(ROOT, relPath);
    const fileName = basename(relPath);
    
    if (!existsSync(absPath)) {
      console.log(`⚠️  ${fileName} — FILE NOT FOUND (skipped)`);
      continue;
    }

    const content = readFileSync(absPath, 'utf-8');
    const fileViolations = [];

    // Check for required DS state cell
    const hasExpectedState = new RegExp(`<${expectedState}`).test(content);
    if (!hasExpectedState) {
      fileViolations.push(`Missing <${expectedState}> (expected for this file)`);
    }

    // Check for forbidden legacy patterns
    for (const { regex, label } of FORBIDDEN_PATTERNS) {
      regex.lastIndex = 0;
      if (regex.test(content)) {
        fileViolations.push(`Legacy pattern: ${label}`);
      }
    }

    // Report per file
    if (fileViolations.length === 0) {
      console.log(`✓ ${fileName} — uses ${expectedState} ✓`);
    } else {
      hasViolations = true;
      console.log(`✗ ${fileName} — ${fileViolations.length} violation(s):`);
      for (const v of fileViolations) {
        console.log(`   └── ${v}`);
      }
      violations.push({ file: relPath, issues: fileViolations });
    }
  }

  // -----------------------------------------------------------------------------
  // RESULT
  // -----------------------------------------------------------------------------
  console.log('');

  if (hasViolations) {
    console.log('❌ Guard FAILED — no-ad-hoc-states-r2');
    console.log(`   ${violations.length} file(s) with violations`);
    console.log('   Fix: Use DS state cells instead of inline patterns');
    console.log('   See: PPEmptyState.vue, PPErrorState.vue, PPLoadingState.vue\n');
    process.exit(1);
  }

  console.log('✅ Guard PASSED — no-ad-hoc-states-r2');
  console.log(`   ├── ${SCOPE_FILES.length} R2 file(s) scanned`);
  console.log(`   ├── All files use DS state cells`);
  console.log('   └── No legacy inline states detected\n');
  process.exit(0);
}

main();
