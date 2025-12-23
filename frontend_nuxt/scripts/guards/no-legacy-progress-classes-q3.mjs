import fs from 'node:fs'
import path from 'node:path'

/**
 * Guard Q3 — Progress (strict)
 * - Scanne UNIQUEMENT les blocs <template> des .vue
 * - Interdit :
 *   - toute occurrence des classes/strings legacy "JourneyProgress"
 *   - tout usage du composant <JourneyProgressBar ...> en template
 *
 * But : empêcher le retour des patterns ad-hoc / legacy.
 */

const ROOT = process.cwd()
const TARGET_DIR = path.join(ROOT, 'app')

const isVue = (p) => p.endsWith('.vue')

const walk = (dir) => {
  const out = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.isFile() && isVue(p)) out.push(p)
  }
  return out
}

const extractTemplate = (src) => {
  const m = src.match(/<template[^>]*>([\s\S]*?)<\/template>/i)
  return m ? m[1] : ''
}

const forbidden = [
  {
    name: 'JourneyProgress legacy string/classes',
    test: (tpl) => tpl.includes('JourneyProgress'),
  },
  {
    name: '<JourneyProgressBar usage',
    test: (tpl) => /<\s*JourneyProgressBar\b/i.test(tpl),
  },
]

const files = walk(TARGET_DIR)
const violations = []

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8')
  const tpl = extractTemplate(raw)
  if (!tpl) continue

  for (const rule of forbidden) {
    if (rule.test(tpl)) {
      violations.push({ file, rule: rule.name })
      break
    }
  }
}

if (violations.length) {
  console.error('❌ progress:guard — FAIL (legacy progress detected in <template>)')
  for (const v of violations) {
    console.error(`- ${v.file} :: ${v.rule}`)
  }
  process.exit(1)
}

console.log('✅ progress:guard — OK (no legacy progress patterns found in templates).')
