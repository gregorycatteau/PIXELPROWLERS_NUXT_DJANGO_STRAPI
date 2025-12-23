import fs from 'node:fs'
import path from 'node:path'

// no-innerhtml:guard (P0-sécu)
//
// OBJECTIF : Détecter les DOM injections dangereuses dans le code applicatif
//
// PATTERNS INTERDITS :
// - .innerHTML =
// - .outerHTML =
// - .insertAdjacentHTML(
//
// SCOPE :
// - frontend_nuxt/app/**/*.ts
// - <script> sections des .vue sous frontend_nuxt/app/**
//
// ALLOWLIST : commentaire "// pp-allow:dangerous-dom" sur la même ligne ou ligne précédente
//
// @see docs/40-security/ARCHITECTURE_SECURITE.md

const ROOT = path.join(process.cwd(), 'app')

// Patterns dangereux (regex précises)
const DANGEROUS_PATTERNS = [
  { pattern: /\.innerHTML\s*=/, name: '.innerHTML =' },
  { pattern: /\.outerHTML\s*=/, name: '.outerHTML =' },
  { pattern: /\.insertAdjacentHTML\s*\(/, name: '.insertAdjacentHTML(' },
]

// Commentaire d'exception
const ALLOW_COMMENT = 'pp-allow:dangerous-dom'

/**
 * Extrait la section <script> d'un fichier .vue
 * Retourne null si pas de script
 */
function extractScript(source) {
  // Match <script> ou <script setup> ou <script lang="ts"> etc.
  const scriptMatch = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)
  if (!scriptMatch) return null

  // Concatène tous les blocs script (peut y en avoir plusieurs)
  let scriptContent = ''
  let offset = 0

  for (const match of scriptMatch) {
    const startIdx = source.indexOf(match, offset)
    const tagEnd = match.indexOf('>') + 1
    const contentStart = startIdx + tagEnd
    const contentEnd = startIdx + match.length - '</script>'.length
    
    // Calculer le numéro de ligne de départ pour ce bloc
    const linesBefore = source.slice(0, contentStart).split('\n').length - 1
    
    // Ajouter le contenu avec un marqueur de ligne
    const content = source.slice(contentStart, contentEnd)
    scriptContent += `__LINE_OFFSET_${linesBefore}__\n` + content + '\n'
    
    offset = startIdx + match.length
  }

  return scriptContent
}

/**
 * Vérifie si une ligne est autorisée via pp-allow:dangerous-dom
 */
function isAllowed(lines, lineIndex) {
  const currentLine = lines[lineIndex] || ''
  const previousLine = lines[lineIndex - 1] || ''
  
  return currentLine.includes(ALLOW_COMMENT) || previousLine.includes(ALLOW_COMMENT)
}

/**
 * Scan un contenu pour les patterns dangereux
 * Retourne les violations avec file:line
 */
function scanContent(content, filePath, lineOffset = 0) {
  const violations = []
  const lines = content.split('\n')
  
  let currentOffset = lineOffset
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Gérer les marqueurs d'offset pour les fichiers .vue
    const offsetMatch = line.match(/__LINE_OFFSET_(\d+)__/)
    if (offsetMatch) {
      currentOffset = parseInt(offsetMatch[1], 10)
      continue
    }
    
    // Ignorer les lignes vides ou commentaires purs
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      continue
    }
    
    // Vérifier chaque pattern
    for (const { pattern, name } of DANGEROUS_PATTERNS) {
      if (pattern.test(line)) {
        // Vérifier si autorisé
        if (!isAllowed(lines, i)) {
          const actualLine = currentOffset + i - (lineOffset > 0 ? 1 : 0) + 1
          violations.push({
            file: filePath,
            line: actualLine,
            pattern: name,
            content: line.trim().slice(0, 80),
          })
        }
      }
    }
  }
  
  return violations
}

/**
 * Récupère tous les fichiers à scanner
 */
function collectFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    // Skip .nuxt, node_modules, etc.
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue
    }

    if (entry.isDirectory()) {
      collectFiles(fullPath, files)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name)
      if (ext === '.ts' || ext === '.vue') {
        files.push(fullPath)
      }
    }
  }

  return files
}

/**
 * Scan un fichier
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const ext = path.extname(filePath)
  const relativePath = path.relative(process.cwd(), filePath)

  if (ext === '.ts') {
    // Scanner tout le fichier .ts
    return scanContent(content, relativePath, 0)
  }

  if (ext === '.vue') {
    // Scanner uniquement la section <script>
    const scriptContent = extractScript(content)
    if (!scriptContent) return []
    return scanContent(scriptContent, relativePath, 0)
  }

  return []
}

function main() {
  console.log('🔍 no-innerhtml:guard — Checking for dangerous DOM manipulation...\n')

  const files = collectFiles(ROOT)
  const allViolations = []

  for (const file of files) {
    const violations = scanFile(file)
    allViolations.push(...violations)
  }

  if (allViolations.length > 0) {
    console.log('❌ no-innerhtml:guard — FAIL\n')
    for (const v of allViolations) {
      console.log(`   ❌ FOUND: ${v.pattern} in ${v.file}:${v.line}`)
      console.log(`      └── ${v.content}`)
    }
    console.log('\n📚 Fix options:')
    console.log('   1. Use safe alternatives (textContent, createElement, etc.)')
    console.log('   2. If ABSOLUTELY necessary, add "// pp-allow:dangerous-dom" comment')
    console.log('      on the same line or the line above (requires audit)')
    console.log('')
    process.exit(1)
  }

  console.log(`✅ no-innerhtml:guard — OK (${files.length} files scanned)`)
  console.log('   ├── No .innerHTML = found')
  console.log('   ├── No .outerHTML = found')
  console.log('   └── No .insertAdjacentHTML( found')
  console.log('')
  process.exit(0)
}

main()
