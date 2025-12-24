<template>
  <!--
    PPDsCatalogSection — Wrapper pour les sections du catalogue DS
    - Titre, description, slot pour les démos
  -->
  <section class="pp-ds-section" v-bind="$attrs">
    <PPSectionHeader :as="as" :title="title" :lead="description" density="comfort" />

    <div class="pp-ds-section__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * PPDsCatalogSection — Section wrapper réutilisable pour le catalogue DS
 */

type HeadingLevel = 'h2' | 'h3' | 'h4'

withDefaults(
  defineProps<{
    title: string
    description?: string
    as?: HeadingLevel
  }>(),
  {
    description: '',
    as: 'h2'
  }
)
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-ds-section {
  @apply space-y-6;
}

.pp-ds-section__content {
  @apply space-y-8;
}
</style>
