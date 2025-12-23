<template>
  <fieldset
    class="pp-scale5"
    :class="{
      'pp-scale5--sm': size === 'sm',
      'pp-scale5--md': size === 'md',
      'pp-scale5--disabled': disabled,
      'pp-scale5--endpoints': showEndpoints,
    }"
    :disabled="disabled"
  >
    <legend class="sr-only">
      {{ legendText }}
    </legend>

    <div
      class="pp-scale5__track"
      role="radiogroup"
      :aria-label="labelledBySafe ? undefined : ariaLabelSafe"
      :aria-labelledby="labelledBySafe || undefined"
      :aria-describedby="describedBySafe || undefined"
    >
      <div
        v-for="(step, idx) in stepsSafe"
        :key="`pp-scale5-${nameSafe}-${step}-${idx}`"
        class="pp-scale5__step"
      >
        <input
          :id="optionId(step)"
          class="pp-scale5__input sr-only"
          type="radio"
          :name="nameSafe"
          :value="step"
          :checked="modelValue === step"
          :disabled="disabled"
          @change="onSelect(step)"
        />

        <label class="pp-scale5__label" :for="optionId(step)">
          <span class="pp-scale5__pill">
            {{ displayNumbers ? String(step) : '•' }}
          </span>

          <span v-if="stepLabelsSafe[idx]" class="pp-scale5__step-label">
            {{ stepLabelsSafe[idx] }}
          </span>
        </label>
      </div>
    </div>

    <div v-if="showEndpoints" class="pp-scale5__endpoints">
      <span class="pp-scale5__endpoint pp-scale5__endpoint--min">{{ minLabel }}</span>
      <span class="pp-scale5__endpoint pp-scale5__endpoint--max">{{ maxLabel }}</span>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type PPScale5Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    /**
     * Valeur sélectionnée (par défaut : 1–5).
     * ⚠️ Cet atome ne persiste rien et ne fait aucune requête.
     */
    modelValue: number | null

    /**
     * Nom du groupe radio (obligatoire côté HTML).
     * Si non fourni, un nom stable est généré.
     */
    name?: string

    /**
     * Identifiant question (optionnel) utilisé pour stabiliser les ids.
     */
    questionId?: string

    /**
     * Désactive l’échelle.
     */
    disabled?: boolean

    /**
     * Libellés d’extrémités (optionnels). Utilisés uniquement si showEndpoints=true.
     */
    minLabel?: string
    maxLabel?: string
    showEndpoints?: boolean

    /**
     * Labels par step (optionnel, longueur <= 5). Si fourni, affiché sous le step.
     */
    stepLabels?: string[]

    /**
     * Steps personnalisés (doit contenir 5 valeurs).
     * Default : [1,2,3,4,5]
     */
    steps?: number[]

    /**
     * Accessibilité.
     */
    ariaLabel?: string
    prompt?: string
    context?: string | null
    describedBy?: string | null

    /**
     * Affichage des nombres (sinon points).
     */
    displayNumbers?: boolean

    /**
     * Densité.
     */
    size?: PPScale5Size
  }>(),
  {
    name: undefined,
    disabled: false,
    minLabel: 'Pas du tout',
    maxLabel: 'Très',
    showEndpoints: false,
    stepLabels: () => [],
    steps: () => [1, 2, 3, 4, 5],
    ariaLabel: 'Échelle de réponse (1 à 5)',
    prompt: undefined,
    context: null,
    describedBy: null,
    displayNumbers: true,
    size: 'md',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

/**
 * Génère un nom stable de groupe radio.
 * But : éviter les collisions si le parent ne passe pas de name explicite.
 */
const nameSafe = computed(() => normalizeBase(props.name || props.questionId))

const safeBase = computed(() => normalizeBase(props.questionId || props.name))

const describedBySafe = computed(() => props.context ?? props.describedBy ?? null)

const promptRaw = computed(() => (props.prompt ?? '').trim())

const labelledBySafe = computed(() => {
  const candidate = promptRaw.value
  if (!candidate) return null
  const looksLikeId = /^[A-Za-z][A-Za-z0-9_:.\\-]*$/.test(candidate)
  return looksLikeId ? candidate : null
})

const ariaLabelSafe = computed(() => {
  if (labelledBySafe.value) return (props.ariaLabel || 'Échelle de réponse (1 à 5)').trim()
  const base = (props.prompt ?? props.ariaLabel ?? 'Échelle de réponse (1 à 5)').trim()
  return base || 'Échelle de réponse (1 à 5)'
})

const legendText = computed(() => {
  if (labelledBySafe.value) {
    const fallback = (props.ariaLabel || 'Échelle de réponse (1 à 5)').trim()
    return fallback || 'Échelle de réponse (1 à 5)'
  }
  return ariaLabelSafe.value
})

/**
 * Sécurise les steps : on force exactement 5 valeurs numériques.
 * Si invalide, on retombe sur [1..5].
 */
const stepsSafe = computed<number[]>(() => {
  const s = props.steps ?? [1, 2, 3, 4, 5]
  if (!Array.isArray(s) || s.length !== 5) return [1, 2, 3, 4, 5]
  const cleaned = s.map((v) => Number(v)).filter((v) => Number.isFinite(v))
  if (cleaned.length !== 5) return [1, 2, 3, 4, 5]
  return cleaned
})

/**
 * Sécurise les labels (max 5).
 */
const stepLabelsSafe = computed<string[]>(() => {
  const labels = Array.isArray(props.stepLabels) ? props.stepLabels : []
  return labels.slice(0, 5).map((s) => String(s))
})

/**
 * Id option stable par step.
 */
const optionId = (step: number) => `${safeBase.value}-v-${step}`

/**
 * Sélection robuste : refuse les valeurs hors steps.
 */
function onSelect(step: number): void {
  if (props.disabled) return
  const allowed = new Set(stepsSafe.value)
  if (!allowed.has(step)) return
  emit('update:modelValue', step)
}

/**
 * Normalisation défensive (NFKC + remove zero-width + allowlist).
 */
function normalizeBase(input?: string | null): string {
  const prefix = 'pp-q-'
  const maxBaseLen = Math.max(1, 80 - prefix.length)
  const raw = (input ?? '')
    .normalize('NFKC')
    .replace(/[\\u200B-\\u200D\\uFEFF]/g, '')
    .toLowerCase()
  let cleaned = raw.replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  if (!cleaned) cleaned = 'unknown'
  if (cleaned.length > maxBaseLen) cleaned = cleaned.slice(0, maxBaseLen)
  return `${prefix}${cleaned}`
}
</script>
