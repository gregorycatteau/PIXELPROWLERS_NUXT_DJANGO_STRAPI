#!/usr/bin/env node
/**
 * Guard HYP-ATTER-R2 — Hypothèses → Atterrissage DS pattern (STRICT)
 * 
 * Vérifie :
 * 1. Les DS cells PPHypothesesPicker et PPAtterrissagePlan existent
 * 2. Les fichiers cibles utilisent les DS cells
 * 3. Pas de patterns/classes legacy (BLOQUANT)
 * 
 * Usage: node scripts/guards/no-legacy-hyp-atter-r1.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

// DS cells required
const DS_CELLS = [
  'app/components/PPHypothesesPicker.vue',
  'app/components/PPAtterrissagePlan.vue',
];

// Files that MUST use DS cells
const HYPOTHESES_FILES = [
  'app/components/journey/bilan/BilanHypothesesSection.vue',
  'app/components/journey/p1/P1HypothesesSection.vue',
];

const LANDING_FILES = [
  'app/components/journey/bilan/BilanLandingPanel.vue',
];

// Legacy patterns to ban (STRICT MODE - all are errors)
const LEGACY_PATTERNS = [
  {
    regex: /class="[^"]*pp-globalbilan-hypothesis-card[^"]*"/g,
    message: 'Legacy class .pp-globalbilan-hypothesis-card → use <PPHypothesesPicker>',
  },
  {
    regex: /class="[^"]*pp-globalbilan-hypothesis-grid[^"]*"/g,
    message: 'Legacy class .pp-globalbilan-hypothesis-grid → use <PPHypothesesPicker>',
  },
  {
    regex: /class="[^"]*pp-globalbilan-theme-card[^"]*"/g,
    message: 'Legacy class .pp-globalbilan-theme-card → use <PPHypothesesPicker>',
  },
];

let errors = [];
let successes = [];

console.log('🔍 HYP-ATTER-R2 Guard — Strict Mode (Bloquant)\n');

// Phase 1: Verify DS cells exist
console.log('📦 Phase 1: DS cells existence...');
for (const cell of DS_CELLS) {
  const filePath = join(ROOT, cell);
  if (!existsSync(filePath)) {
    errors.push(`❌ Missing DS cell: ${cell}`);
  } else {
    successes.push(`✓ ${cell}`);
    console.log(`  ✓ ${cell}`);
  }
}

// Phase 2: Check hypotheses files use PPHypothesesPicker
console.log('\n🎯 Phase 2: PPHypothesesPicker in hypotheses files...');
for (const file of HYPOTHESES_FILES) {
  const filePath = join(ROOT, file);
  if (!existsSync(filePath)) {
    errors.push(`❌ File not found: ${file}`);
    continue;
  }
  
  const content = readFileSync(filePath, 'utf-8');
  
  // Must have PPHypothesesPicker
  if (!content.includes('<PPHypothesesPicker')) {
    errors.push(`❌ ${file}: Missing <PPHypothesesPicker> — required DS cell`);
  } else {
    console.log(`  ✓ ${file} — PPHypothesesPicker present`);
  }
  
  // Must NOT have legacy patterns
  for (const pattern of LEGACY_PATTERNS) {
    const matches = content.match(pattern.regex);
    if (matches) {
      errors.push(`❌ ${file}: ${pattern.message} (${matches.length} occurrence(s))`);
    }
  }
}

// Phase 3: Check landing files use PPAtterrissagePlan
console.log('\n🎯 Phase 3: PPAtterrissagePlan in landing files...');
for (const file of LANDING_FILES) {
  const filePath = join(ROOT, file);
  if (!existsSync(filePath)) {
    errors.push(`❌ File not found: ${file}`);
    continue;
  }
  
  const content = readFileSync(filePath, 'utf-8');
  
  // Must have PPAtterrissagePlan
  if (!content.includes('<PPAtterrissagePlan')) {
    errors.push(`❌ ${file}: Missing <PPAtterrissagePlan> — required DS cell`);
  } else {
    console.log(`  ✓ ${file} — PPAtterrissagePlan present`);
  }
}

// Results
console.log('\n' + '='.repeat(60));

if (errors.length) {
  console.log('\n❌ BLOCKING ERRORS:');
  errors.forEach(e => console.log(`  ${e}`));
  console.log('\n🛑 Guard HYP-ATTER-R2 FAILED — Fix legacy patterns');
  process.exit(1);
} else {
  console.log('\n✅ Guard HYP-ATTER-R2 PASSED — DS cells migrated, no legacy patterns');
  process.exit(0);
}
