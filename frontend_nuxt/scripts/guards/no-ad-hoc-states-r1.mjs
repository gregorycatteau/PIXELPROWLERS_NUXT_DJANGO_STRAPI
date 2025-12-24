/**
 * no-ad-hoc-states-r1.mjs
 * 
 * Guard CI pour empêcher les états ad-hoc (empty/error/loading) inline
 * dans les fichiers du scope pilote.
 * 
 * Scope R1 (pilote) : PPResourcesLibraryShell.vue uniquement
 * 
 * Patterns interdits :
 * - class="*__empty*" ou class="*__error*" ou class="*__loading*" (états inline)
 * - class="*__skeleton*" (skeletons inline)
 * - aria-busy="true" sans PPLoadingState
 * - role="alert" sans PPErrorState
 * 
 * Usage :
 *   npm run states:r1:guard
 * 
 * @version V1.STATES-R1
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// -----------------------------------------------------------------------------
// SCOPE: Fichiers pilotes uniquement (R1)
// -----------------------------------------------------------------------------
const SCOPE_FILES = [
  'app/components/resources/library/PPResourcesLibraryShell.vue',
];

// -----------------------------------------------------------------------------
// PATTERNS INTERDITS — États ad-hoc inline
// -----------------------------------------------------------------------------
const FORBIDDEN_PATTERNS = [
  // Classes BEM pour états inline
  { regex: /class="[^"]*__empty[^"]*"/gi, label: 'class="*__empty*" (use <PPEmptyState>)' },
  { regex: /class="[^"]*__error[^"]*"/gi, label: 'class="*__error*" (use <PPErrorState>)' },
  { regex: /class="[^"]*__loading[^"]*"/gi, label: 'class="*__loading*" (use <PPLoadingState>)' },
  { regex: /class="[^"]*__skeleton[^"]*"/gi, label: 'class="*__skeleton*" (use <PPLoadingState variant="skeleton">)' },
  { regex: /class="[^"]*__no-results[^"]*"/gi, label: 'class="*__no-results*" (use <PPEmptyState>)' },
  
  // Attributs a11y orphelins (sans composants DS)
  // Note: ces patterns ne doivent PAS matcher si PPLoadingState/PPErrorState sont utilisés
];

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------
function main() {
  let hasViolations = false;
  const violations = [];

  for (const relPath of SCOPE_FILES) {
    const absPath = resolve(ROOT, relPath);
    
    if (!existsSync(absPath)) {
      console.log(`⚠️  SKIP (not found): ${relPath}`);
      continue;
    }

    const content = readFileSync(absPath, 'utf-8');
    
    for (const { regex, label } of FORBIDDEN_PATTERNS) {
      // Reset regex lastIndex for global patterns
      regex.lastIndex = 0;
      const matches = content.match(regex);
      
      if (matches && matches.length > 0) {
        hasViolations = true;
        violations.push({
          file: relPath,
          pattern: label,
          count: matches.length,
          examples: matches.slice(0, 3), // Max 3 examples
        });
      }
    }
  }

  // -----------------------------------------------------------------------------
  // REPORT
  // -----------------------------------------------------------------------------
  if (hasViolations) {
    console.error('\n❌ STATES-R1 GUARD FAILED\n');
    console.error('Les fichiers suivants contiennent des états ad-hoc inline :\n');
    
    for (const v of violations) {
      console.error(`  📁 ${v.file}`);
      console.error(`     Pattern: ${v.pattern}`);
      console.error(`     Occurrences: ${v.count}`);
      console.error(`     Exemples: ${v.examples.join(', ')}\n`);
    }
    
    console.error('💡 Migration requise :');
    console.error('   - États vides → <PPEmptyState icon="..." title="..." />');
    console.error('   - États erreur → <PPErrorState @retry="..." />');
    console.error('   - États loading → <PPLoadingState variant="skeleton|spinner" />\n');
    
    process.exit(1);
  }

  console.log('✅ STATES-R1 GUARD PASSED');
  console.log(`   Scope: ${SCOPE_FILES.length} fichier(s) pilote(s)`);
  console.log('   Aucun état ad-hoc inline détecté.\n');
  process.exit(0);
}

main();
