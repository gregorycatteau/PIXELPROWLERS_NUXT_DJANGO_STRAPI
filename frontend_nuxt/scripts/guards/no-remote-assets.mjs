import fs from 'node:fs'
import path from 'node:path'

/**
 * no-remote-assets:guard (OPS-R1)
 * 
 * OBJECTIF : Garantir qu'aucun asset distant (fonts, images, scripts, etc.) ne soit référencé
 * dans le frontend, pour des raisons de :
 * - Privacy : pas de fuite vers des CDN tiers
 * - Supply-chain security : pas de dépendance à des ressources externes
 * - Offline-first : rendu stable sans connexion
 * 
 * RÈGLES :
 * 1) CSS : FAIL si présence de http://, https://, fonts.googleapis.com, fonts.gstatic.com
 * 2) Vue templates : FAIL si src="http ou href="http (template-only)
 */

const ROOT = process.cwd()

function extractTemplate(source) {
  const start = source.search(/<template\b[^>]*>/i)
  if (start === -1) return ''

  const startEnd = source.indexOf('>', start)
  if (startEnd === -1) return ''

  const end = source.lastIndexOf('</template>')
  if (end === -1 || end <= startEnd) return ''

  return source.slice(startEnd + 1, end)
}

function fail(errors) {
  console.error('❌ no-remote-assets:guard — FAIL')
  for (const e of errors) console.error(` - ${e}`)
  process.exit(1)
}

function findFiles(dir, pattern) {
  const results = []
  
  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)
      
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.nuxt' && entry.name !== '.git') {
          walk(fullPath)
        }
      } else if (entry.isFile() && entry.name.endsWith(pattern)) {
        results.push(path.relative(ROOT, fullPath))
      }
    }
  }
  
  walk(dir)
  return results
}

let failed = false
const errors = []

// ============================================
// 1) SCAN CSS FILES
// ============================================
const cssFiles = findFiles(path.join(ROOT, 'app/assets/css'), '.css')

const forbiddenCssPatterns = [
  /https?:\/\//i,
  /fonts\.googleapis\.com/i,
  /fonts\.gstatic\.com/i
]

for (const rel of cssFiles) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) continue

  const content = fs.readFileSync(abs, 'utf8')

  for (const pattern of forbiddenCssPatterns) {
    if (pattern.test(content)) {
      failed = true
      errors.push(`Forbidden remote asset pattern in CSS: ${rel} (pattern: ${pattern})`)
    }
  }
}

// ============================================
// 2) SCAN VUE TEMPLATES
// ============================================
const vueFiles = findFiles(path.join(ROOT, 'app'), '.vue')

const forbiddenVuePatterns = [
  /src\s*=\s*["']https?:\/\//i,
  /href\s*=\s*["']https?:\/\//i
]

for (const rel of vueFiles) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) continue

  const src = fs.readFileSync(abs, 'utf8')
  const tpl = extractTemplate(src)

  for (const pattern of forbiddenVuePatterns) {
    if (pattern.test(tpl)) {
      failed = true
      errors.push(`Forbidden remote asset in template: ${rel} (pattern: ${pattern})`)
    }
  }
}

if (failed) fail(errors)

console.log('✅ no-remote-assets:guard — OK (no remote assets found in CSS or Vue templates).')
