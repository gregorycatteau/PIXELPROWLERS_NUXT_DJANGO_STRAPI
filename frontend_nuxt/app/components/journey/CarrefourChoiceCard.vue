<template>
<article class="CarrefourChoiceCard pp-card pp-journey-card-interactive">
    <header class="space-y-1">
      <p class="CarrefourChoiceLabel">{{ id.toUpperCase() }}</p>
      <p class="CarrefourChoiceTitle">{{ title }}</p>
    </header>
    <p class="CarrefourChoiceDescription">{{ description }}</p>
    <button type="button" class="pp-journey-cta-primary" @click="$emit('select', id)">
      {{ ctaLabel }}
    </button>
  </article>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  id: 'n1' | 'n2' | 'n3' | 'n4';
  title: string;
  description: string;
  ctaLabel: string;
  to: string;
}>();

defineEmits<{
  (e: 'select', id: 'n1' | 'n2' | 'n3' | 'n4'): void;
}>();

const { id, title, description, ctaLabel } = toRefs(props);
</script>

<style scoped>
@reference "@/assets/css/main.css";

.CarrefourChoiceCard {
  @apply space-y-3 p-5 border border-[color:var(--color-stroke)] bg-[color:var(--color-panel)]/90;
}

.CarrefourChoiceLabel {
  @apply text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent-strong)];
}

.CarrefourChoiceTitle {
  @apply text-xl font-semibold;
}

.CarrefourChoiceDescription {
  @apply text-sm text-[color:var(--color-text-muted)];
}
</style>
