<template>
  <div class="ResourcesList">
    <p class="ResourcesTitle">{{ title }}</p>
    <div class="grid gap-3 md:grid-cols-2">
      <ResourceCard
        v-for="(resource, index) in resources"
        :key="resource.id"
        v-bind="resource"
        class="pp-journey-reveal"
        :style="{ '--pp-stagger-delay': `${index * 80}ms` }"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ResourceCard from './ResourceCard.vue';
import type { PropType } from 'vue';

export interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  href: string;
}

defineProps({
  title: {
    type: String,
    required: true
  },
  resources: {
    type: Array as PropType<ResourceCardProps[]>,
    required: true
  }
});

defineEmits<{
  (e: 'select', payload: { id: string; level: 'debutant' | 'intermediaire' | 'avance' }): void;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";

.ResourcesList {
  @apply space-y-3;
}

.ResourcesTitle {
  @apply text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-strong)];
}
</style>
