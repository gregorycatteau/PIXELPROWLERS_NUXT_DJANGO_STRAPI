<template>
  <div class="JourneyProgressBar" role="progressbar" :aria-valuenow="clampedCurrent" :aria-valuemin="0" :aria-valuemax="total">
    <div class="JourneyProgressHeader">
      <p class="JourneyProgressLabel">{{ label || 'Progression' }}</p>
      <p class="JourneyProgressValue">{{ clampedCurrent }} / {{ total }}</p>
    </div>
    <div class="JourneyProgressTrack">
      <div class="JourneyProgressFill" :style="{ width: `${percentage}%` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  current: number;
  total: number;
  label?: string;
}>();

const clampedCurrent = computed(() => Math.min(props.current, props.total));
const percentage = computed(() => {
  if (!props.total) return 0;
  return Math.min(100, Math.round((clampedCurrent.value / props.total) * 100));
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.JourneyProgressBar {
  @apply space-y-2;
}

.JourneyProgressHeader {
  @apply flex items-center justify-between text-xs text-[color:var(--color-text-muted)];
}

.JourneyProgressLabel {
  @apply font-semibold uppercase tracking-wide;
}

.JourneyProgressValue {
  @apply font-medium text-[color:var(--color-text-primary)];
}

.JourneyProgressTrack {
  @apply h-2 w-full rounded-full bg-slate-800/70 overflow-hidden;
}

.JourneyProgressFill {
  @apply h-full rounded-full bg-[color:var(--color-accent-strong)] transition-all duration-200 ease-out;
}
</style>
