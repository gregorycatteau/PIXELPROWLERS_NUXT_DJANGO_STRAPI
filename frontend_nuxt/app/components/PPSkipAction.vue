<template>
  <button
    class="pp-skip-action"
    :class="densityClass"
    type="button"
    :disabled="disabled"
    :aria-label="ariaLabelComputed"
    :title="titleComputed"
    @click="onSkip"
  >
    <span v-if="icon" class="pp-skip-action__icon" aria-hidden="true">{{ icon }}</span>
    <span class="pp-skip-action__label">{{ labelComputed }}</span>
  </button>
</template>

<script setup lang="ts">
/**
 * PPSkipAction (DS atom)
 * Action standardisée "Ignorer / Passer" dans les questionnaires.
 * - Sécurité : type="button" (pas de submit accidentel)
 * - A11y : aria-label cohérent
 * - Zéro HTML riche : texte pur uniquement
 */

type Density = 'compact' | 'default' | 'comfort'

const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    ariaLabel?: string
    title?: string
    icon?: string
    density?: Density
  }>(),
  {
    label: 'Ignorer',
    disabled: false,
    ariaLabel: 'Ignorer cette question',
    title: '',
    icon: '⏭',
    density: 'default'
  }
)

const emit = defineEmits<{
  (e: 'skip'): void
}>()

const labelComputed = computed(() => props.label ?? 'Ignorer')
const ariaLabelComputed = computed(() => props.ariaLabel ?? 'Ignorer cette question')
const titleComputed = computed(() => props.title ?? '')

const densityClass = computed(() => {
  if (props.density === 'compact') return 'pp-skip-action--compact'
  if (props.density === 'comfort') return 'pp-skip-action--comfort'
  return 'pp-skip-action--default'
})

function onSkip(): void {
  if (props.disabled) return
  emit('skip')
}
</script>

<style scoped>
@reference "@/assets/css/main.css";
/* DS atom : styles globaux dans pp.components.css */
</style>
