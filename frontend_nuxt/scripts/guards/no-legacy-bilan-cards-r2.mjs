/**
 * Guard: no-legacy-bilan-cards-r2.mjs
 * 
 * BILAN-R2 — Enforce PPCard usage in Bilan templates (template-only checks)
 * 
 * Checks:
 * 1. TARGET_FILES MUST use <PPCard (at least 1 occurrence)
 * 2. FORBIDS legacy card wrappers in templates:
 *    - pp-globalbilan-card
 *    - pp-globalbilan-theme-card
 *    - pp-globalbilan-aside-card
 *    - pp-journey-card-soft
 *    - pp-bilan-card-soft
 * 
 * Run: npm run --prefix frontend_nuxt bilancard:guard
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

// Target files for BILAN-R2 migration
const TARGET_FILES = [
  'app/components/journey/bilan/GlobalBilanEngine.vue',
  'app/components/journey/bilan/BilanPanoramaCard.vue',
  'app/components/journey/p1/P1GlobalBilanAside.vue',
  'app/components/journey/p1/P1BlocksHub.vue',
];

// Required DS component (MUST be present in each file)
const REQUIRED_COMPONENT = {
  pattern: /<PPCard/g,
  name: 'PPCard',
  minCount: 1,
};

// Legacy patterns to FORBID (template-only: card wrappers)
const FORBIDDEN_PATTERNS = [
  { pattern: /class="[^"]*pp-globalbilan-card[^"]*"/g, name: 'pp-globalbilan-card' },
  { pattern: /class="[^"]*pp-globalbilan-theme-card[^"]*"/g, name: 'pp-globalbilan-theme-card' },
  { pattern: /class="[^"]*pp-globalbilan-aside-card[^"]*"/g, name: 'pp-globalbilan-aside-card' },
  { pattern: /class="[^"]*pp-journey-card-soft[^"]*"/g, name: 'pp-journey-card-soft' },
  { pattern: /class="[^"]*pp-bilan-card-soft[^"]*"/g, name: 'pp-bilan-card-soft' },
  { pattern: /class="[^"]*pp-globalbilan-axe-card[^"]*"/g, name: 'pp-globalbilan-axe-card' },
];

/**
 * Extract template content from Vue SFC
 * @param {string} content - Full Vue file content
 * @returns {string} - Template section only
 */
function extractTemplate(content) {
  // Use greedy match to capture content between first <template> and last </template>
  const match = content.match(/<template[\s\S]*<\/template>/);
  return match ? match[0] : '';
}

let errors = 0;
let successes = 0;

console.log('\n🛡️  BILAN-R2 Guard: Checking PPCard migration in Bilan templates...\n');

for (const relPath of TARGET_FILES) {
  const fullPath = path.join(ROOT, relPath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${relPath}`);
    errors++;
    continue;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const templateContent = extractTemplate(content);
  
  if (!templateContent) {
    console.error(`❌ No template found in: ${relPath}`);
    errors++;
    continue;
  }
  
  console.log(`📄 Checking: ${relPath}`);
  let fileHasError = false;
  
  // Check REQUIRED component
  const matches = templateContent.match(REQUIRED_COMPONENT.pattern) || [];
  if (matches.length < REQUIRED_COMPONENT.minCount) {
    console.error(`   ❌ MISSING: <${REQUIRED_COMPONENT.name}> — found ${matches.length}, need at least ${REQUIRED_COMPONENT.minCount}`);
    errors++;
    fileHasError = true;
  } else {
    console.log(`   ✅ ${REQUIRED_COMPONENT.name}: found ${matches.length}`);
  }
  
  // Check FORBIDDEN patterns
  for (const { pattern, name } of FORBIDDEN_PATTERNS) {
    const forbiddenMatches = templateContent.match(pattern) || [];
    if (forbiddenMatches.length > 0) {
      console.error(`   ❌ FORBIDDEN: ${name} — found ${forbiddenMatches.length} occurrences`);
      errors++;
      fileHasError = true;
    }
  }
  
  if (!fileHasError) {
    successes++;
  }
  
  console.log('');
}

// Summary
console.log('─'.repeat(60));
if (errors === 0) {
  console.log(`\n✅ BILAN-R2 Guard PASSED — ${successes}/${TARGET_FILES.length} files compliant\n`);
  process.exit(0);
} else {
  console.error(`\n❌ BILAN-R2 Guard FAILED — ${errors} error(s)\n`);
  console.error('Migration required: Use <PPCard> instead of legacy card wrappers\n');
  console.error('Forbidden classes:');
  console.error('  - pp-globalbilan-card → PPCard variant="default" or "accent"');
  console.error('  - pp-globalbilan-theme-card → PPCard variant="default"');
  console.error('  - pp-globalbilan-aside-card → PPCard variant="indicator"');
  console.error('  - pp-journey-card-soft → PPCard variant="soft"');
  console.error('  - pp-bilan-card-soft → PPCard variant="soft"');
  console.error('  - pp-globalbilan-axe-card → PPCard variant="soft"\n');
  process.exit(1);
}
