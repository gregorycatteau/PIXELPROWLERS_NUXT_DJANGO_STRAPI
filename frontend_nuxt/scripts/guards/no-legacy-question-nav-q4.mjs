import fs from 'node:fs'
import path from 'node:path'

/**
 * questionnav:guard (Lot Q4)
 * Strict++ : on exige l’usage de <PPQuestionNav> dans les templates des questionnaires ciblés.
 * IMPORTANT : scan template-only (entre <template> et </template>).
 */
const ROOT = process.cwd()

const FILES = [
  'app/components/journey/steps/StepPanoramaE1.vue',
  'app/components/journey/p1/P1PanoramaE1.vue',
  'app/components/journey/p1/P1Questionnaire1E1.vue',
  'app/components/journey/p1/P1Questionnaire2E3.vue',
  'app/components/journey/p1/P1Block1Questionnaire.vue',
  'app/components/journey/p1/P1Block2Questionnaire.vue',
  'app/components/journey/p1/P1Block3Questionnaire.vue',
  'app/components/journey/p1/P1Block4Questionnaire.vue'
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

  if (!tpl.includes('<PPQuestionNav')) {
    failed = true
    errors.push(`Missing <PPQuestionNav> in template: ${rel}`)
  }
}

if (failed) {
  console.error('❌ questionnav:guard — FAIL')
  for (const e of errors) console.error(` - ${e}`)
  process.exit(1)
}

console.log('✅ questionnav:guard — OK (PPQuestionNav enforced in Q4 templates).')
