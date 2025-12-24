#!/usr/bin/env node
/**
 * Guard: no-legacy-step-shell-r1
 * 
 * STEP-SHELL-R1 — Enforce PPJourneyStepShell usage on pilot scope
 * 
 * Scans pilot files for:
 * 1. Required: <PPJourneyStepShell
 * 2. Forbidden legacy wrappers: pp-journey-panel, pp-journey-intro-shell
 * 
 * Pilot scope (R1): P1CarrefourE6.vue
 * Future phases will expand scope.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const APP_ROOT = path.resolve(__dirname, '../../app');

// Pilot scope (R1) — explicit list of migrated files
const PILOT_FILES = [
  'components/journey/p1/P1CarrefourE6.vue',
  // Future: 'components/journey/p1/P1IntroE0.vue',
];

// Required pattern (must be present)
const REQUIRED_PATTERN = /<PPJourneyStepShell/;

// Forbidden legacy patterns (must NOT be present)
const LEGACY_PATTERNS = [
  { pattern: /class="pp-journey-panel/, name: 'pp-journey-panel' },
  { pattern: /class="pp-journey-intro-shell/, name: 'pp-journey-intro-shell' },
  { pattern: /class="pp-journey-card/, name: 'pp-journey-card' },
  { pattern: /class="pp-journey-card-soft/, name: 'pp-journey-card-soft' },
];

// ─────────────────────────────────────────────────────────────
// Guard logic
// ─────────────────────────────────────────────────────────────

console.log(`\n🔍 Guard: no-legacy-step-shell-r1`);
console.log(`   Checking ${PILOT_FILES.length} pilot file(s) for PPJourneyStepShell usage...\n`);

let violations = 0;

for (const relPath of PILOT_FILES) {
  const filePath = path.join(APP_ROOT, relPath);
  const fileName = path.basename(relPath);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${fileName} — FILE NOT FOUND (skipped)`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fileViolations = [];

  // Check required pattern
  if (!REQUIRED_PATTERN.test(content)) {
    fileViolations.push('Missing <PPJourneyStepShell');
  }

  // Check forbidden legacy patterns
  for (const legacy of LEGACY_PATTERNS) {
    if (legacy.pattern.test(content)) {
      fileViolations.push(`Legacy wrapper found: ${legacy.name}`);
    }
  }

  // Report
  if (fileViolations.length === 0) {
    console.log(`✓ ${fileName} — uses PPJourneyStepShell ✓`);
  } else {
    console.log(`✗ ${fileName} — ${fileViolations.length} violation(s):`);
    for (const v of fileViolations) {
      console.log(`   └── ${v}`);
    }
    violations += fileViolations.length;
  }
}

// ─────────────────────────────────────────────────────────────
// Result
// ─────────────────────────────────────────────────────────────

console.log('');

if (violations > 0) {
  console.log(`❌ Guard FAILED — ${violations} violation(s) in pilot files`);
  console.log(`   Fix: Use <PPJourneyStepShell> instead of legacy wrappers`);
  console.log(`   See: frontend_nuxt/app/components/journey/PPJourneyStepShell.vue\n`);
  process.exit(1);
} else {
  console.log(`✅ Guard PASSED — no-legacy-step-shell-r1`);
  console.log(`   ├── ${PILOT_FILES.length} pilot file(s) scanned`);
  console.log(`   ├── All files use PPJourneyStepShell`);
  console.log(`   └── No legacy wrappers detected\n`);
  process.exit(0);
}
