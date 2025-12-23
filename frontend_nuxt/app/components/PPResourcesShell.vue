<template>
  <section :id="sectionId" :class="rootClasses">
    <PPSectionHeader
      as="h2"
      :density="density"
      :title="title"
      :lead="description"
    />
    <div class="pp-resources-shell__content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="pp-resources-shell__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface PPResourcesShellProps {
  /** Section title */
  title?: string;
  /** Section description/lead */
  description?: string;
  /** Density variant for PPSectionHeader */
  density?: 'compact' | 'comfort';
  /** Section HTML id */
  sectionId?: string;
}

const props = withDefaults(defineProps<PPResourcesShellProps>(), {
  title: 'Ressources utiles maintenant',
  description: undefined,
  density: 'comfort',
  sectionId: 'pp-resources-section',
});

const rootClasses = computed(() => [
  'pp-resources-shell',
  `pp-resources-shell--${props.density}`,
]);
</script>

<style scoped>
.pp-resources-shell {
  display: flex;
  flex-direction: column;
  gap: var(--pp-resources-shell-gap, var(--pp-spacing-4, 1rem));
}

.pp-resources-shell__content {
  display: grid;
  gap: var(--pp-resources-card-gap, var(--pp-spacing-3, 0.75rem));
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
}

.pp-resources-shell--compact .pp-resources-shell__content {
  gap: var(--pp-spacing-2, 0.5rem);
}

.pp-resources-shell--comfort .pp-resources-shell__content {
  gap: var(--pp-spacing-4, 1rem);
}

.pp-resources-shell__footer {
  margin-top: var(--pp-spacing-2, 0.5rem);
}
</style>
