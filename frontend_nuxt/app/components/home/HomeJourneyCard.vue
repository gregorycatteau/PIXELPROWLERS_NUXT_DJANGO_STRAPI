<template>
  <article
    class="home-journey-card"
    :class="[
      isDisabled ? 'home-journey-card-disabled' : '',
      isEmphasized ? 'home-journey-card-active' : ''
    ]"
  >
    <div class="home-journey-card-header">
      <p class="home-journey-id">{{ badgeDisplay }}</p>
      <span v-if="!isAvailable" class="home-journey-badge">Bientôt</span>
    </div>
    <h3 class="home-journey-title">{{ title }}</h3>
    <p class="home-journey-situation">{{ situation }}</p>
    <p class="home-journey-outcome">{{ outcome }}</p>
    <button
      type="button"
      class="home-journey-cta"
      :disabled="isDisabled"
      @click="handleClick"
    >
      {{ ctaLabel }}
    </button>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  id: string;
  title: string;
  situation: string;
  outcome: string;
  ctaLabel: string;
  isAvailable?: boolean;
  isEmphasized?: boolean;
  badgeLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const isDisabled = computed(() => props.isAvailable === false);
const badgeDisplay = computed(() => props.badgeLabel ?? props.id.toUpperCase());

const handleClick = () => {
  if (isDisabled.value) return;
  emit('select', props.id);
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.home-journey-card {
  @apply rounded-[var(--radius-xl)] border border-[color:var(--color-stroke)] bg-[color:var(--color-bg-card)]/90 shadow-[var(--shadow-soft)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] border-l-4 border-[color:var(--color-accent-border)] p-5 space-y-2 h-full flex flex-col;
}

.home-journey-card-active {
  @apply border-orange-400/80 shadow-[var(--shadow-accent)] bg-slate-900/90;
}

.home-journey-card-disabled {
  @apply opacity-70 cursor-not-allowed;
}

.home-journey-card-header {
  @apply flex items-center justify-between mb-2;
}

.home-journey-id {
  @apply text-xs font-semibold uppercase tracking-[0.16em] text-orange-200/90;
}

.home-journey-badge {
  @apply inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100 border border-slate-700;
}

.home-journey-title {
  @apply text-xl font-semibold leading-snug text-slate-50;
}

.home-journey-situation {
  @apply mt-2 text-sm leading-relaxed text-[color:var(--color-text-muted)];
}

.home-journey-outcome {
  @apply mt-2 text-sm leading-relaxed text-slate-200;
}

.home-journey-cta {
  @apply mt-4 w-full inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 py-3 text-sm font-medium border border-[color:var(--color-border-soft)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-bg-section)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60;
}
</style>
