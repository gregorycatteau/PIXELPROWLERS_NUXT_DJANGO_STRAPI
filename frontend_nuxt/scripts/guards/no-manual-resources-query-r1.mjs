import fs from 'node:fs'
import path from 'node:path'

// no-manual-resources-query-r1:guard
//
// OBJECTIF : Interdire la construction manuelle des query params pour /ressources
// Exiger l'usage de buildResourcesDeepLink() pour tous les liens vers /ressources avec query params
//
// PATTERNS INTERDITS :
// - "/ressources?" string avec params (construction manuelle)
// - "utm_" dans un lien /ressources (privacy violation)
// - Construction de { path: '/ressources', query: {...} } sans buildResourcesDeepLink
//
// OK si usage de buildResourcesDeepLink(...)
//
// SCOPE : Scope minimal — uniquement les fichiers CTA pilotes
// où buildResourcesDeepLink() a été intégré explicitement.
// Évite les faux positifs sur les autres fichiers.
//
// @see frontend_nuxt/app/utils/deeplinks/resourcesDeepLink.ts

const ROOT = path.join(process.cwd(), 'app')

// Files to scan — SCOPE MINIMAL (fichiers CTA pilotes uniquement)
const SCAN_FILES = [
  'components/journey/bilan/ResourcesActionsPanel.vue',
  'pages/parcours/[journeySlug].vue',
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
 * Collect files to scan (scope minimal — fichiers explicites uniquement)
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

  // Skip if file uses buildResourcesDeepLink (proper usage)
  const usesBuildFunction = /buildResourcesDeepLink/.test(content)

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
  console.log('🔍 no-manual-resources-query-r1:guard — Checking for manual /ressources query construction...\n')

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
    console.log('❌ no-manual-resources-query-r1:guard — FAIL\n')
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
    console.log('   Example: :to="buildResourcesDeepLink({ q: \'test\', category: \'diagnostic\', page: 2 })"')
    console.log('')
    process.exit(1)
  }

  console.log(`✅ no-manual-resources-query-r1:guard — OK (${files.length} files scanned)`)
  console.log('   ├── No manual "/ressources?" query strings')
  console.log('   ├── No UTM tracking in /ressources links')
  console.log('   └── Use buildResourcesDeepLink() for deep links')
  console.log('')
  process.exit(0)
}

main()
