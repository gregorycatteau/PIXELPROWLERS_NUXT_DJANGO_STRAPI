import fs from 'node:fs'
import path from 'node:path'

/**
 * skip:guard (Lot Q4)
 * Strict++ : on exige l’usage de <PPSkipAction> dans les templates ciblés.
 * IMPORTANT : scan template-only (entre <template> et </template>).
 */
const ROOT = process.cwd()

const FILES = [
  'app/components/journey/questionnaire/QuestionSkipControl.vue',
  'app/components/journey/LikertScale.vue',
  'app/components/journey/p1/P1Block1Questionnaire.vue',
  'app/components/journey/p1/P1Block3Questionnaire.vue'
]

function extractTemplate(source) {
  const start = source.search(/<template\b[^>]*>/i)
  if (start === -1) return ''

  const startEnd = source.indexOf('>', start)
  if (startEnd === -1) return ''

  const end = source.lastIndexOf('</template>')
  if (end === -1 || end <= startEnd) return ''

  return source.slice(startEnd + 1, end)
}

let failed = false
const errors = []

for (const rel of FILES) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) continue

  const src = fs.readFileSync(abs, 'utf8')
  const tpl = extractTemplate(src)

  if (!tpl.includes('<PPSkipAction')) {
    failed = true
    errors.push(`Missing <PPSkipAction> in template: ${rel}`)
  }
}

if (failed) {
  console.error('❌ skip:guard — FAIL')
  for (const e of errors) console.error(` - ${e}`)
  process.exit(1)
}

console.log('✅ skip:guard — OK (PPSkipAction enforced in Q4 templates).')
