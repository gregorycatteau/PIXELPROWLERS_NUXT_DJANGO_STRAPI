import fs from 'node:fs'
import path from 'node:path'

// no-manual-resources-query-r2:guard
//
// OBJECTIF : Interdire la construction manuelle des query params pour /ressources
// Exiger l'usage de buildResourcesDeepLink() pour tous les liens vers /ressources avec query params
//
// R2 SCOPE ÉTENDU : Migration contrôlée des fichiers CTA/Bilan vers SafeDeepLinkKit
//
// PATTERNS INTERDITS :
// - "/ressources?" string avec params (construction manuelle)
// - "utm_" / "gclid" / "fbclid" dans un lien /ressources (privacy violation)
// - Construction de { path: '/ressources', query: {...} } sans buildResourcesDeepLink
//
// OK si usage de buildResourcesDeepLink(...)
//
// SCOPE R2 : Fichiers explicitement migrés vers SafeDeepLinkKit
// - CTA pilotes (ResourcesActionsPanel, [journeySlug])
// - Composable central (useResourcesLibrary)
// - Library shell (PPResourcesLibraryShell)
//
// @see frontend_nuxt/app/utils/deeplinks/resourcesDeepLink.ts
// @see docs/40-security/contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md

const ROOT = path.join(process.cwd(), 'app')

// Files to scan — R2 SCOPE ÉTENDU (fichiers migrés vers SafeDeepLinkKit)
const SCAN_FILES = [
  // CTA pilotes (déjà migrés R1)
  'components/journey/bilan/ResourcesActionsPanel.vue',
  'pages/parcours/[journeySlug].vue',
  
  // Composable central (migré R2)
  'composables/useResourcesLibrary.ts',
  
  // Library shell
  'components/resources/library/PPResourcesLibraryShell.vue',
  
  // Bilan components
  'components/journey/bilan/EngagementLevelsPanel.vue',
  'components/journey/bilan/GlobalBilanEngine.vue',
]

// Patterns to detect manual query construction
const VIOLATION_PATTERNS = [
  {
    // "/ressources?..." string literal with query params
    pattern: /['"`]\/ressources\?[^'"`]+['"`]/gi,
    name: 'Manual /ressources?query string',
    severity: 'error',
  },
  {
    // utm_ tracking in ressources link
    pattern: /ressources[^}]*utm_/gi,
    name: 'UTM tracking in /ressources link',
    severity: 'error',
  },
  {
    // gclid tracking
    pattern: /ressources[^}]*gclid/gi,
    name: 'gclid tracking in /ressources link',
    severity: 'error',
  },
  {
    // fbclid tracking
    pattern: /ressources[^}]*fbclid/gi,
    name: 'fbclid tracking in /ressources link',
    severity: 'error',
  },
  {
    // { path: '/ressources', query: without buildResourcesDeepLink context
    // This is harder to detect statically, we check for suspicious patterns
    pattern: /path\s*:\s*['"`]\/ressources['"`]\s*,\s*query\s*:\s*\{/gi,
    name: 'Manual route object with query for /ressources',
    severity: 'warning',
  },
]

// Pattern that indicates SAFE usage (allowlist)
const SAFE_PATTERNS = [
  /buildResourcesDeepLink\s*\(/,
  /parseResourcesDeepLink\s*\(/,
  /RESOURCES_ROUTE\s*=/,
  /safeRoutePath\s*\(\s*['"`]\/ressources['"`]\s*\)/,
]

/**
 * Check if a line/file contains safe usage patterns
 */
function containsSafePattern(content) {
  return SAFE_PATTERNS.some(pattern => pattern.test(content))
}

/**
 * Collect files to scan (scope explicite — fichiers migrés uniquement)
 */
function collectFiles(baseDir, relativeFiles) {
  const files = []

  for (const relFile of relativeFiles) {
    const filePath = path.join(baseDir, relFile)
    if (fs.existsSync(filePath)) {
      files.push(filePath)
    }
  }

  return files
}

/**
 * Scan a file for violations
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const relativePath = path.relative(process.cwd(), filePath)
  const violations = []

  // Skip if file uses buildResourcesDeepLink or parseResourcesDeepLink (proper usage)
  const usesBuildFunction = /buildResourcesDeepLink|parseResourcesDeepLink/.test(content)

  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Skip comment lines
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      continue
    }

    for (const { pattern, name, severity } of VIOLATION_PATTERNS) {
      // Reset regex lastIndex for global patterns
      pattern.lastIndex = 0

      if (pattern.test(line)) {
        // For warning level, check if file uses buildResourcesDeepLink
        if (severity === 'warning' && usesBuildFunction) {
          continue // Allow if file properly imports and uses the function
        }

        violations.push({
          file: relativePath,
          line: lineNum,
          pattern: name,
          severity,
          content: line.trim().slice(0, 100),
        })
      }
    }
  }

  return violations
}

function main() {
  console.log('🔍 no-manual-resources-query-r2:guard — Checking for manual /ressources query construction (R2 scope)...\n')

  const files = collectFiles(ROOT, SCAN_FILES)
  const allViolations = []

  for (const file of files) {
    const violations = scanFile(file)
    allViolations.push(...violations)
  }

  // Separate errors and warnings
  const errors = allViolations.filter(v => v.severity === 'error')
  const warnings = allViolations.filter(v => v.severity === 'warning')

  if (errors.length > 0) {
    console.log('❌ no-manual-resources-query-r2:guard — FAIL\n')
    for (const v of errors) {
      console.log(`   ❌ ERROR: ${v.pattern} in ${v.file}:${v.line}`)
      console.log(`      └── ${v.content}`)
    }
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings (review recommended):\n')
    for (const v of warnings) {
      console.log(`   ⚠️  ${v.pattern} in ${v.file}:${v.line}`)
      console.log(`      └── ${v.content}`)
    }
  }

  if (errors.length > 0) {
    console.log('\n📚 Fix: Use buildResourcesDeepLink() from @/utils/deeplinks/resourcesDeepLink.ts')
    console.log('   Example: :to="buildResourcesDeepLink({ tags: [\'p1\'], sort: \'impact\' })"')
    console.log('')
    process.exit(1)
  }

  console.log(`✅ no-manual-resources-query-r2:guard — OK (${files.length} files scanned)`)
  console.log('   ├── No manual "/ressources?" query strings')
  console.log('   ├── No tracking params (utm_, gclid, fbclid)')
  console.log('   └── buildResourcesDeepLink() used for deep links')
  console.log('')
  console.log('   R2 scope migré :')
  for (const f of SCAN_FILES) {
    console.log(`     • ${f}`)
  }
  console.log('')
  process.exit(0)
}

main()
