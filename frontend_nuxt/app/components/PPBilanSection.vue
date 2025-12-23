<template>
  <section
    :id="sectionId"
    class="pp-bilan-section"
    :class="densityClass"
    :aria-labelledby="titleId"
  >
    <div v-if="$slots.header" class="pp-bilan-section__header">
      <slot name="header" :title-id="titleId" />
    </div>
    <div v-else-if="title" class="pp-bilan-section__header">
      <p v-if="label" class="pp-bilan-section__label">
        {{ label }}
      </p>
      <h2 :id="titleId" class="pp-bilan-section__title">
        {{ title }}
      </h2>
      <p v-if="description" class="pp-bilan-section__description">
        {{ description }}
      </p>
    </div>

    <div class="pp-bilan-section__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="pp-bilan-section__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Density = 'compact' | 'default' | 'comfort'

/**
 * PPBilanSection (DS pattern unique)
 * 
 * Section standardisée pour bilans (Repères / Panorama / Hypothèses / etc.).
 * - Structure : anchor + header + body + footer
 * - A11y : <section> + aria-labelledby (id du titre)
 * - Normalisation d'id : même stratégie que PPQuestionCard (sécurité)
 * - Slots : header (custom) OU props (label/title/description)
 */
const props = withDefaults(
  defineProps<{
    idBase: string
    label?: string | null
    title?: string | null
    description?: string | null
    density?: Density
  }>(),
  {
    label: null,
    title: null,
    description: null,
    density: 'default'
  }
)

/**
 * Normalise une base d'id pour éviter collisions DOM / focus hijack / ids bizarres.
 * NFKC si dispo + suppression zero-width + allowlist + prefix + maxlen.
 * Aligné avec PPQuestionCard pour cohérence.
 */
function normalizeIdBase(raw: string): string {
  let s = String(raw ?? '')
  
  try {
    if (typeof s.normalize === 'function') s = s.normalize('NFKC')
  } catch {
    // ignore
  }
  
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, '')
  s = s.replace(/[^a-zA-Z0-9_-]/g, '-')
  s = s.replace(/-+/g, '-').replace(/^[-_]+|[-_]+$/g, '')
  
  if (!s) s = 'section'
  if (s.length > 48) s = s.slice(0, 48)
  
  return `ppb_${s}`
}

const sectionId = computed(() => normalizeIdBase(props.idBase))
const titleId = computed(() => `${sectionId.value}__title`)

const densityClass = computed(() => {
  if (props.density === 'compact') return 'pp-bilan-section--compact'
  if (props.density === 'comfort') return 'pp-bilan-section--comfort'
  return 'pp-bilan-section--default'
})
</script>

<style scoped>
@reference "@/assets/css/main.css";
/* DS pattern : styles dans pp.components.css */
</style>
