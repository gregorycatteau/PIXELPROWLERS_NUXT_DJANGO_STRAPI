<template>
  <nav
    class="pp-question-nav"
    :class="[
      densityClass,
      alignClass,
      wrap ? 'pp-question-nav--wrap' : 'pp-question-nav--nowrap'
    ]"
    :aria-label="ariaLabelComputed"
  >
    <div class="pp-question-nav__left">
      <PPButton
        v-if="showPrev"
        as="button"
        :variant="prevVariant"
        :disabled="prevDisabled"
        type="button"
        @click="onPrev"
      >
        <span class="pp-question-nav__btn-label">{{ prevLabelComputed }}</span>
      </PPButton>
    </div>

    <div class="pp-question-nav__center" v-if="$slots.center">
      <slot name="center" />
    </div>

    <div class="pp-question-nav__right">
      <PPButton
        v-if="showNext"
        as="button"
        :variant="nextVariant"
        :disabled="nextDisabled"
        type="button"
        @click="onNext"
      >
        <span class="pp-question-nav__btn-label">{{ nextLabelComputed }}</span>
      </PPButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * PPQuestionNav (DS atom)
 * Navigation standardisée pour questionnaires : Prev / Next
 * - Zéro logique métier : on émet seulement prev/next.
 * - A11y : <nav> + aria-label.
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type Density = 'compact' | 'default' | 'comfort'
type Align = 'between' | 'end'

const props = withDefaults(
  defineProps<{
    prevLabel?: string
    nextLabel?: string
    prevDisabled?: boolean
    nextDisabled?: boolean
    showPrev?: boolean
    showNext?: boolean
    prevVariant?: ButtonVariant
    nextVariant?: ButtonVariant
    density?: Density
    align?: Align
    wrap?: boolean
    ariaLabel?: string
  }>(),
  {
    prevLabel: 'Précédent',
    nextLabel: 'Continuer',
    prevDisabled: false,
    nextDisabled: false,
    showPrev: true,
    showNext: true,
    prevVariant: 'secondary',
    nextVariant: 'primary',
    density: 'default',
    align: 'between',
    wrap: true,
    ariaLabel: 'Navigation du questionnaire'
  }
)

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()

/** Libellés (défense contre undefined) */
const prevLabelComputed = computed(() => props.prevLabel ?? 'Précédent')
const nextLabelComputed = computed(() => props.nextLabel ?? 'Continuer')
const ariaLabelComputed = computed(() => props.ariaLabel ?? 'Navigation du questionnaire')

/** Classes DS */
const densityClass = computed(() => {
  if (props.density === 'compact') return 'pp-question-nav--compact'
  if (props.density === 'comfort') return 'pp-question-nav--comfort'
  return 'pp-question-nav--default'
})

const alignClass = computed(() => {
  if (props.align === 'end') return 'pp-question-nav--end'
  return 'pp-question-nav--between'
})

/** Actions */
function onPrev(): void {
  if (props.prevDisabled) return
  emit('prev')
}

function onNext(): void {
  if (props.nextDisabled) return
  emit('next')
}
</script>

<style scoped>
@reference "@/assets/css/main.css";
/* DS atom : styles globaux dans pp.components.css */
</style>
