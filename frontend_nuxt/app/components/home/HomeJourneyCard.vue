<template>
  <PPCard
    as="article"
    variant="journey"
    hoverable
    class="home-journey-card"
    :class="[
      isDisabled ? 'home-journey-card-disabled' : '',
      isEmphasized ? 'home-journey-card-active' : ''
    ]"
  >
    <div class="home-journey-card-header">
      <p class="home-journey-id">{{ badgeDisplay }}</p>
      <PPBadge v-if="!isAvailable" variant="warning" size="sm">Bientôt</PPBadge>
    </div>
    <h3 class="home-journey-title pp-journey-card-title">
      <PPBadge variant="neutral" size="sm">
        {{ title }}
      </PPBadge>
    </h3>

    <section class="home-journey-card-section home-journey-card-problem">
      <p class="home-journey-card-label home-journey-card-label-problem">
        Problème
      </p>
      <p class="home-journey-card-body home-journey-card-problem-body">
        {{ problemText }}
      </p>
    </section>

    <section class="home-journey-card-mainflow">
      <div class="home-journey-card-section home-journey-card-solution">
        <p class="home-journey-card-label home-journey-card-label-solution">
          Ce que le parcours permet
        </p>
        <p class="home-journey-card-body home-journey-card-solution-body">
          {{ solutionText }}
        </p>
      </div>

      <div class="home-journey-card-cta">
        <button
          type="button"
          class="home-journey-card-button"
          :disabled="isDisabled"
          @click="handleClick"
        >
          {{ ctaLabel }}
        </button>
      </div>
    </section>
  </PPCard>
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
  problemTitle?: string;
  problemBody?: string[];
  solutionBody?: string[];
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const isDisabled = computed(() => props.isAvailable === false);
const badgeDisplay = computed(() => props.badgeLabel ?? props.id.toUpperCase());
const problemText = computed(() => {
  if (props.problemBody?.length) return props.problemBody.join(' ');
  return props.situation;
});
const solutionText = computed(() => {
  if (props.solutionBody?.length) return props.solutionBody.join(' ');
  return props.outcome;
});

const handleClick = () => {
  if (isDisabled.value) return;
  emit('select', props.id);
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-journey-card {
  @apply relative flex h-full flex-col justify-start rounded-3xl bg-slate-950/70 border border-white px-6 py-6 md:px-7 md:py-7 shadow-lg shadow-black/40 transition-transform duration-150 ease-out;
}

.pp-journey-card:hover,
.pp-journey-card:focus-within {
  @apply -translate-y-0.5 border-slate-700 shadow-black/70;
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

.home-journey-title {
  @apply text-base md:text-lg font-semibold leading-snug text-slate-50 mb-4;
}

.pp-journey-card-title {
  @apply mt-1 mb-3 text-center;
}

.home-journey-card-section {
  @apply space-y-2;
}

.home-journey-card-problem {
  @apply mt-3 rounded-2xl border border-slate-900/70 bg-slate-950/30 px-4 py-3;
}

.home-journey-card-mainflow {
  @apply mt-4 rounded-2xl border border-orange-400/45 bg-slate-900/95 px-5 pt-4 pb-4 flex flex-col gap-4 relative shadow-[0_0_38px_rgba(248,153,72,0.22)];
}

.home-journey-card-mainflow::before {
  content: "";
  @apply absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-px bg-gradient-to-b from-orange-400/90 via-orange-400/50 to-transparent;
}

.home-journey-card-solution {
  @apply space-y-2 transition-colors duration-150 text-orange-500;
}

.pp-journey-card:hover .home-journey-card-mainflow,
.pp-journey-card:focus-within .home-journey-card-mainflow {
  @apply border-orange-300/70 bg-slate-900;
}

.home-journey-card-label {
  @apply text-[11px] uppercase tracking-[0.14em] font-semibold text-orange-500;
}

.home-journey-card-label-problem {
  @apply text-slate-500 mb-1;
}

.home-journey-card-label-solution {
  @apply text-slate-200 mb-1 text-orange-500;
}

.home-journey-card-problem-body {
  @apply text-sm text-slate-300 leading-relaxed tracking-[0.01em];
  max-width: 34rem;
}

.home-journey-card-body,
.home-journey-card-solution-body {
  @apply text-sm md:text-[15px] text-slate-100 leading-relaxed tracking-[0.01em];
}

.home-journey-card-solution-body {
  max-width: 34rem;
}

.home-journey-card-cta {
  @apply pt-1 flex justify-center ;
}

.home-journey-card-button {
  @apply inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-orange-500 text-slate-950 hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors duration-150;
}
</style>
