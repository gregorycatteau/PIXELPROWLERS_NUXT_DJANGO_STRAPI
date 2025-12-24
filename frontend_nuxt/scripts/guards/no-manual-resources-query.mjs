#!/usr/bin/env node
/**
 * GUARD CANONIQUE: no-manual-resources-query.mjs
 * 
 * Interdit la manipulation manuelle de route.query pour les resources deeplinks.
 * Toute lecture/écriture de query params doit passer par SafeDeepLinkKit.
 * 
 * Usage:
 *   RESOURCESDEEPLINK_SCOPE=r3 node scripts/guards/no-manual-resources-query.mjs
 * 
 * Scopes disponibles (définis dans scopes/resourcesdeeplink.scopes.json):
 *   - pilot: 2 fichiers (page + composable)
 *   - r2: 6 fichiers (+ library components)
 *   - r3: 12 fichiers (+ bilan components) [DEFAULT]
 * 
 * @see docs/40-security/contracts/PX_V1_3_SECURITY_GUARDS_REGISTRY.md
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================================================================
// CONFIGURATION
// =============================================================================

const SCOPES_FILE = join(__dirname, 'scopes', 'resourcesdeeplink.scopes.json');
const DEFAULT_SCOPE = 'r3';

// Get scope from environment variable
const scope = process.env.RESOURCESDEEPLINK_SCOPE || DEFAULT_SCOPE;

// Load scopes configuration
let scopesConfig;
try {
  scopesConfig = JSON.parse(readFileSync(SCOPES_FILE, 'utf8'));
} catch (err) {
  console.error(`❌ Failed to load scopes file: ${SCOPES_FILE}`);
  console.error(err.message);
  process.exit(1);
}

// Validate scope
if (!scopesConfig[scope]) {
  console.error(`❌ Unknown scope: "${scope}"`);
  console.error(`Available scopes: ${Object.keys(scopesConfig).join(', ')}`);
  process.exit(1);
}

const FILES_TO_SCAN = scopesConfig[scope];

// =============================================================================
// FORBIDDEN PATTERNS
// =============================================================================

/**
 * Patterns that indicate direct route.query manipulation
 * These should be replaced with SafeDeepLinkKit functions
 */
const FORBIDDEN_PATTERNS = [
  // Direct query access patterns
  {
    regex: /route\.query\s*\[/g,
    message: 'Direct route.query[key] access forbidden. Use parseResourcesDeepLink(route.query)',
    context: 'script',
  },
  {
    regex: /route\.query\.\w+(?!\s*\))/g,
    message: 'Direct route.query.property access forbidden. Use parseResourcesDeepLink(route.query)',
    context: 'script',
    // Allow route.query as parameter to functions
    exclude: /parseResourcesDeepLink\s*\(\s*route\.query/,
  },
  // Direct query mutation patterns
  {
    regex: /router\.push\s*\(\s*\{[^}]*query\s*:/g,
    message: 'Direct router.push with query forbidden. Use buildResourcesDeepLink()',
    context: 'script',
  },
  {
    regex: /router\.replace\s*\(\s*\{[^}]*query\s*:/g,
    message: 'Direct router.replace with query forbidden. Use buildResourcesDeepLink()',
    context: 'script',
  },
  // URLSearchParams manipulation
  {
    regex: /new\s+URLSearchParams\s*\(/g,
    message: 'URLSearchParams forbidden for resources. Use SafeDeepLinkKit',
    context: 'script',
  },
  // location.search access
  {
    regex: /location\.search/g,
    message: 'location.search forbidden. Use parseResourcesDeepLink(route.query)',
    context: 'script',
  },
  // window.location.href with query
  {
    regex: /window\.location\.href\s*[+=]/g,
    message: 'window.location.href manipulation forbidden. Use router navigation',
    context: 'script',
  },
];

/**
 * Allowed patterns (whitelisted)
 * These are legitimate uses that should NOT trigger violations
 */
const ALLOWED_PATTERNS = [
  // SafeDeepLinkKit function calls
  /parseResourcesDeepLink\s*\(/,
  /buildResourcesDeepLink\s*\(/,
  // Import statements
  /import\s*\{[^}]*parseResourcesDeepLink/,
  /import\s*\{[^}]*buildResourcesDeepLink/,
  // Type declarations
  /:\s*LocationQuery/,
  /:\s*RouteLocationNormalized/,
  // Comments
  /\/\/.*route\.query/,
  /\/\*[\s\S]*?route\.query[\s\S]*?\*\//,
];

// =============================================================================
// SCANNING LOGIC
// =============================================================================

function extractScriptContent(content, filePath) {
  if (filePath.endsWith('.vue')) {
    // Extract <script> or <script setup> content
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatch) {
      return scriptMatch.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n');
    }
    return '';
  }
  // For .ts files, return entire content
  return content;
}

function isAllowedLine(line) {
  return ALLOWED_PATTERNS.some(pattern => pattern.test(line));
}

function scanFile(filePath) {
  const fullPath = join(process.cwd(), filePath);
  
  if (!existsSync(fullPath)) {
    // File doesn't exist yet - skip silently (may be future file)
    return [];
  }
  
  const content = readFileSync(fullPath, 'utf8');
  const scriptContent = extractScriptContent(content, filePath);
  const lines = scriptContent.split('\n');
  const violations = [];
  
  lines.forEach((line, index) => {
    // Skip allowed patterns
    if (isAllowedLine(line)) {
      return;
    }
    
    // Check forbidden patterns
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.context === 'script') {
        const matches = line.match(pattern.regex);
        if (matches) {
          // Check for exclude pattern
          if (pattern.exclude && pattern.exclude.test(line)) {
            continue;
          }
          
          violations.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            message: pattern.message,
          });
        }
      }
    }
  });
  
  return violations;
}

// =============================================================================
// MAIN
// =============================================================================

console.log(`🔍 Resources DeepLink Guard (scope: ${scope})`);
console.log(`   Scanning ${FILES_TO_SCAN.length} files...\n`);

let allViolations = [];

for (const file of FILES_TO_SCAN) {
  const violations = scanFile(file);
  if (violations.length > 0) {
    allViolations = allViolations.concat(violations);
  }
}

if (allViolations.length === 0) {
  console.log(`✅ Resources DeepLink guard OK (scope: ${scope})`);
  console.log(`   ${FILES_TO_SCAN.length} files scanned, 0 violations`);
  process.exit(0);
} else {
  console.error(`❌ Resources DeepLink guard FAILED (scope: ${scope})\n`);
  
  allViolations.forEach(v => {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    ${v.message}`);
    console.error(`    > ${v.content}\n`);
  });
  
  console.error(`\n❌ ${allViolations.length} violation(s) found`);
  console.error(`\nFix: Use SafeDeepLinkKit functions instead:`);
  console.error(`  - parseResourcesDeepLink(route.query) — to read query params`);
  console.error(`  - buildResourcesDeepLink({...}) — to build navigation route`);
  
  process.exit(1);
}
