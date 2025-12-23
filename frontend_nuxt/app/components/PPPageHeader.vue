<template>
  <header :class="rootClass">
    <div v-if="$slots.eyebrow" class="pp-page-header__eyebrow">
      <slot name="eyebrow" />
    </div>

    <!-- IMPORTANT: on force h1/h2 uniquement -->
    <component :is="as" :id="titleId" class="pp-page-header__title">
      <slot name="title" />
    </component>

    <div v-if="$slots.lead" class="pp-page-header__lead">
      <slot name="lead" />
    </div>

    <div v-if="$slots.meta" class="pp-page-header__meta">
      <slot name="meta" />
    </div>

    <div v-if="$slots.actions" class="pp-page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * PPPageHeader (DS atom) — header de page (h1/h2)
 * - Conçu pour les pages / heroes / top-of-page.
 * - Ne remplace pas PPSectionHeader (qui reste pour h2/h3/h4 en sections).
 * - Slots only (pas de v-html), pour éviter toute injection HTML.
 */

type PageHeaderAs = 'h1' | 'h2'
type PageHeaderDensity = 'compact' | 'comfort'
type PageHeaderAlign = 'left' | 'center'

const props = withDefaults(
  defineProps<{
    /**
     * Niveau de titre (page-level) — par défaut h1.
     * Interdits: h3/h4 (réservés aux headers de section).
     */
    as?: PageHeaderAs

    /**
     * Densité verticale.
     */
    density?: PageHeaderDensity

    /**
     * Alignement.
     */
    align?: PageHeaderAlign

    /**
     * ID optionnel à poser sur le titre (ancres, accessibilité, navigation).
     */
    titleId?: string
  }>(),
  {
    as: 'h1',
    density: 'comfort',
    align: 'left',
    titleId: undefined,
  }
)

const rootClass = computed(() => {
  return [
    'pp-page-header',
    props.density === 'compact' ? 'pp-page-header--compact' : '',
    props.align === 'center' ? 'pp-page-header--center' : '',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
