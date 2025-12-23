/**
 * Guard: no-legacy-bilan-shell-r1.mjs
 * 
 * BILAN-R1 — Enforce PPBilanShell + PPBilanSection usage in GlobalBilanEngine.vue
 * 
 * Checks:
 * 1. GlobalBilanEngine.vue MUST use <PPBilanShell
 * 2. GlobalBilanEngine.vue MUST use <PPBilanSection (at least 3 sections)
 * 3. FORBIDS legacy layout wrappers: pp-globalbilan-layout, pp-globalbilan-grid, etc.
 * 
 * Run: npm run --prefix frontend_nuxt bilanshell:guard
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

// Target files for BILAN-R1 migration
const TARGET_FILES = [
  'app/components/journey/bilan/GlobalBilanEngine.vue',
];

// Required DS components (MUST be present)
const REQUIRED_COMPONENTS = [
  { pattern: /<PPBilanShell/g, name: 'PPBilanShell', minCount: 1 },
  { pattern: /<PPBilanSection/g, name: 'PPBilanSection', minCount: 3 },
];

// Legacy patterns to FORBID (template-only: layout wrappers)
const FORBIDDEN_PATTERNS = [
  // Legacy layout classes
  { pattern: /class="[^"]*pp-globalbilan-layout[^"]*"/g, name: 'pp-globalbilan-layout' },
  { pattern: /class="[^"]*pp-globalbilan-grid[^"]*"/g, name: 'pp-globalbilan-grid' },
  { pattern: /class="[^"]*pp-globalbilan-main[^"]*"/g, name: 'pp-globalbilan-main' },
  // NOTE: pp-globalbilan-aside (exact) is forbidden, but pp-globalbilan-aside--mobile is allowed (mobile variant)
  { pattern: /class="pp-globalbilan-aside"/g, name: 'pp-globalbilan-aside (exact)' },
  // Tailwind grid overrides on root layout (heuristic: lg:grid-cols in root context)
  { pattern: /class="[^"]*lg:grid-cols-\[minmax\(0,1fr\)_320px\][^"]*"/g, name: 'legacy grid-cols override' },
];

// Warning patterns (not blocking, but should be migrated in R2/R3)
const WARNING_PATTERNS = [
  { pattern: /class="[^"]*pp-globalbilan-card[^"]*"/g, name: 'pp-globalbilan-card (migrate in R2)' },
  { pattern: /class="[^"]*pp-globalbilan-section[^"]*"/g, name: 'pp-globalbilan-section (use PPBilanSection instead)' },
];

let errors = 0;
let warnings = 0;

console.log('\n🛡️  BILAN-R1 Guard: Checking PPBilanShell + PPBilanSection migration...\n');

for (const relPath of TARGET_FILES) {
  const fullPath = path.join(ROOT, relPath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${relPath}`);
    errors++;
    continue;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  // Use greedy match to capture the LAST </template> (handles nested content)
  const templateMatch = content.match(/<template[\s\S]*<\/template>/);
  const templateContent = templateMatch ? templateMatch[0] : '';
  
  console.log(`📄 Checking: ${relPath}`);
  
  // Check REQUIRED components
  for (const { pattern, name, minCount } of REQUIRED_COMPONENTS) {
    const matches = templateContent.match(pattern) || [];
    if (matches.length < minCount) {
      console.error(`   ❌ MISSING: <${name}> — found ${matches.length}, need at least ${minCount}`);
      errors++;
    } else {
      console.log(`   ✅ ${name}: found ${matches.length} (required: ${minCount})`);
    }
  }
  
  // Check FORBIDDEN patterns
  for (const { pattern, name } of FORBIDDEN_PATTERNS) {
    const matches = templateContent.match(pattern) || [];
    if (matches.length > 0) {
      console.error(`   ❌ FORBIDDEN: ${name} — found ${matches.length} occurrences`);
      errors++;
    }
  }
  
  // Check WARNING patterns (non-blocking)
  for (const { pattern, name } of WARNING_PATTERNS) {
    const matches = templateContent.match(pattern) || [];
    if (matches.length > 0) {
      console.warn(`   ⚠️  WARNING: ${name} — found ${matches.length} occurrences`);
      warnings++;
    }
  }
  
  console.log('');
}

// Summary
console.log('─'.repeat(60));
if (errors === 0) {
  console.log(`\n✅ BILAN-R1 Guard PASSED — ${warnings} warning(s)\n`);
  process.exit(0);
} else {
  console.error(`\n❌ BILAN-R1 Guard FAILED — ${errors} error(s), ${warnings} warning(s)\n`);
  console.error('Migration required: Use <PPBilanShell> and <PPBilanSection> in GlobalBilanEngine.vue\n');
  process.exit(1);
}
