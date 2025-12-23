import fs from 'node:fs'
import path from 'node:path'

/**
 * questionnaireshell:guard (Lot Q5)
 * Strict++ : on exige l’usage de <PPQuestionnaireShell> comme wrapper racine standard
 * dans les 8 templates questionnaires ciblés.
 *
 * IMPORTANT : scan template-only (entre <template> et </template>)
 * pour éviter les faux positifs (script/setup, styles, comments JS, etc.).
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

function fail(errors) {
  console.error('❌ questionnaireshell:guard — FAIL')
  for (const e of errors) console.error(` - ${e}`)
  process.exit(1)
}

let failed = false
const errors = []

// Patterns legacy interdits (template-only)
// NOTE: on reste volontairement *minimal* pour éviter les faux positifs :
// les écrans contiennent encore des classes utilitaires type pp-journey-global-notice,
// pp-journey-section, etc. Ce guard vise uniquement les wrappers "card-like".
const forbidden = [
  'pp-journey-panel',
  'pp-journey-card-soft',
  'pp-journey-card'
]

for (const rel of FILES) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) continue

  const src = fs.readFileSync(abs, 'utf8')
  const tpl = extractTemplate(src)

  if (!tpl.includes('<PPQuestionnaireShell')) {
    failed = true
    errors.push(`Missing <PPQuestionnaireShell> in template: ${rel}`)
  }

  for (const needle of forbidden) {
    if (tpl.includes(needle)) {
      failed = true
      errors.push(`Forbidden legacy wrapper pattern "${needle}" in template: ${rel}`)
    }
  }
}

if (failed) fail(errors)

console.log('✅ questionnaireshell:guard — OK (PPQuestionnaireShell enforced, legacy wrappers forbidden in Q5 templates).')
