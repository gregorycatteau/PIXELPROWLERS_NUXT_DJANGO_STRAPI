<template>
  <div class="pp-progress" :class="rootClass">
    <!-- Label + ratio (optionnel) -->
    <div v-if="showHeader" class="pp-progress__header">
      <span v-if="label" class="pp-progress__label">{{ label }}</span>
      <span v-if="showRatio" class="pp-progress__ratio" :aria-label="ariaLabel">{{ ratioText }}</span>
    </div>

    <!-- Ratio-only -->
    <div v-else-if="mode === 'ratio'" class="pp-progress__ratioOnly" :aria-label="ariaLabel">
      <span class="pp-progress__ratio">{{ ratioText }}</span>
    </div>

    <!-- Bar (ou bar+ratio) -->
    <div
      v-if="showBar"
      class="pp-progress__bar"
      role="progressbar"
      :aria-label="ariaLabel"
      :aria-valuemin="0"
      :aria-valuemax="safeTotal"
      :aria-valuenow="safeCurrent"
    >
      <div class="pp-progress__track" aria-hidden="true">
        <div class="pp-progress__fill" aria-hidden="true" :style="{ width: percent + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type PPProgressMode = 'bar' | 'ratio' | 'both'

const props = withDefaults(
  defineProps<{
    /**
     * Nombre courant (ex: question 3, ou 12 réponses)
     */
    current: number
    /**
     * Total (ex: 20 questions)
     */
    total: number
    /**
     * Libellé optionnel (ex: "Avancement")
     */
    label?: string
    /**
     * - bar   : barre seule
     * - ratio : "X / N" seul
     * - both  : barre + header ratio
     */
    mode?: PPProgressMode
    /**
     * Afficher le header (label/ratio) quand mode=both
     * (pour éviter les blocs trop denses si on ne veut que la barre)
     */
    showHeader?: boolean
  }>(),
  {
    mode: 'bar',
    showHeader: true,
  },
)

const toFiniteInt = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.trunc(n)
}

const safeTotal = computed(() => {
  const t = toFiniteInt(props.total)
  return t < 0 ? 0 : t
})

const safeCurrent = computed(() => {
  const c = toFiniteInt(props.current)
  if (c < 0) return 0
  if (safeTotal.value > 0 && c > safeTotal.value) return safeTotal.value
  return c
})

const percent = computed(() => {
  const t = safeTotal.value
  if (t <= 0) return 0
  return Math.round((safeCurrent.value / t) * 100)
})

const ratioText = computed(() => `${safeCurrent.value} / ${safeTotal.value}`)

const ariaLabel = computed(() => {
  const base = props.label ? props.label : 'Progression'
  return `${base} — ${ratioText.value}`
})

const showRatio = computed(() => props.mode === 'ratio' || props.mode === 'both')
const showBar = computed(() => props.mode === 'bar' || props.mode === 'both')
const showHeader = computed(() => props.mode === 'both' && props.showHeader)

const rootClass = computed(() => {
  return {
    'pp-progress--bar': props.mode === 'bar',
    'pp-progress--ratio': props.mode === 'ratio',
    'pp-progress--both': props.mode === 'both',
  }
})
</script>
