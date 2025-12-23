#!/usr/bin/env node
/**
 * Guard RES-R1 — Resources DS pattern (STRICT)
 * 
 * Vérifie :
 * 1. Les DS cells PPResourcesShell et PPResourceCard existent
 * 2. Les fichiers cibles utilisent les DS cells
 * 3. Pas de patterns/classes legacy (BLOQUANT)
 * 
 * Usage: node scripts/guards/no-legacy-resources-r1.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

// DS cells required
const DS_CELLS = [
  'app/components/PPResourcesShell.vue',
  'app/components/PPResourceCard.vue',
];

// Files that MUST use DS cells (at least one of PPResourcesShell or PPResourceCard)
const RESOURCES_FILES = [
  'app/components/journey/bilan/ResourcesActionsPanel.vue',
];

// Legacy patterns to ban (STRICT MODE - all are errors)
const LEGACY_PATTERNS = [
  {
    regex: /class="[^"]*pp-journey-card-soft[^"]*"/g,
    message: 'Legacy class .pp-journey-card-soft → use <PPResourceCard> or <PPCard>',
  },
  {
    regex: /class="[^"]*resources-panel[^"]*"/g,
    message: 'Legacy class .resources-panel → use <PPResourcesShell>',
  },
  {
    regex: /class="[^"]*pp-resources-legacy[^"]*"/g,
    message: 'Legacy class .pp-resources-legacy → use DS cells',
  },
  {
    // Detect article with manual resource card styling (not using PPResourceCard)
    regex: /<article[^>]*class="[^"]*space-y-2[^"]*"[^>]*>[\s\S]{0,500}kind === 'resource'/g,
    message: 'Inline resource article pattern → use <PPResourceCard>',
  },
];

let errors = [];
let successes = [];

console.log('🔍 RES-R1 Guard — Strict Mode (Bloquant)\n');

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

// Phase 2: Check resources files use DS cells
console.log('\n🎯 Phase 2: DS cells usage in resources files...');
for (const file of RESOURCES_FILES) {
  const filePath = join(ROOT, file);
  if (!existsSync(filePath)) {
    errors.push(`❌ File not found: ${file}`);
    continue;
  }
  
  const content = readFileSync(filePath, 'utf-8');
  
  // Must have at least PPResourcesShell OR PPResourceCard
  const hasShell = content.includes('<PPResourcesShell');
  const hasCard = content.includes('<PPResourceCard');
  
  if (!hasShell && !hasCard) {
    errors.push(`❌ ${file}: Missing DS cells — need <PPResourcesShell> and/or <PPResourceCard>`);
  } else {
    const found = [];
    if (hasShell) found.push('PPResourcesShell');
    if (hasCard) found.push('PPResourceCard');
    console.log(`  ✓ ${file.split('/').pop()} — ${found.join(', ')} present`);
  }
  
  // Must NOT have legacy patterns
  for (const pattern of LEGACY_PATTERNS) {
    const matches = content.match(pattern.regex);
    if (matches) {
      errors.push(`❌ ${file}: ${pattern.message} (${matches.length} occurrence(s))`);
    }
  }
}

// Phase 3: Security check — verify PPResourceCard has safe link handling
console.log('\n🔒 Phase 3: Security check (PPResourceCard)...');
const cardPath = join(ROOT, 'app/components/PPResourceCard.vue');
if (existsSync(cardPath)) {
  const cardContent = readFileSync(cardPath, 'utf-8');
  
  // Must have rel="noopener noreferrer" for external links
  if (!cardContent.includes('rel="noopener noreferrer"')) {
    errors.push(`❌ PPResourceCard: Missing rel="noopener noreferrer" for external links`);
  } else {
    console.log('  ✓ rel="noopener noreferrer" present');
  }
  
  // Must have protocol allowlist (http/https)
  if (!cardContent.includes('http://') || !cardContent.includes('https://')) {
    errors.push(`❌ PPResourceCard: Missing protocol allowlist (http/https only)`);
  } else {
    console.log('  ✓ Protocol allowlist (http/https) present');
  }
  
  // Must have UTM stripping
  if (!cardContent.includes('utm_')) {
    errors.push(`❌ PPResourceCard: Missing UTM parameter sanitization`);
  } else {
    console.log('  ✓ UTM parameter sanitization present');
  }
}

// Results
console.log('\n' + '='.repeat(60));

if (errors.length) {
  console.log('\n❌ BLOCKING ERRORS:');
  errors.forEach(e => console.log(`  ${e}`));
  console.log('\n🛑 Guard RES-R1 FAILED — Fix legacy patterns or security issues');
  process.exit(1);
} else {
  console.log('\n✅ Guard RES-R1 PASSED — DS cells migrated, secure, no legacy patterns');
  process.exit(0);
}
