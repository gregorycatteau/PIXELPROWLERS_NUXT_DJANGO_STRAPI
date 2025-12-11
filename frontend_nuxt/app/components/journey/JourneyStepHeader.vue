<template>
  <header class="JourneyStepHeader">
    <p v-if="estImportant" class="JourneyStepBadge">Important</p>
    <h2
      :id="headingIdComputed"
      class="JourneyStepTitle"
      tabindex="-1"
    >
      {{ title }}
    </h2>
    <p v-if="subtitle" class="JourneyStepSubtitle">
      {{ subtitle }}
    </p>
  </header>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps<{
  title: string;
  subtitle?: string;
  estImportant?: boolean;
  headingId?: string;
}>();

const { title, subtitle, estImportant, headingId } = toRefs(props);

const headingIdComputed = computed(() => headingId?.value || `journey-step-heading-${title.value.toLowerCase().replace(/\\s+/g, '-')}`);
</script>

<style scoped>
@reference "@/assets/css/main.css";

.JourneyStepHeader {
  @apply space-y-2;
}

.JourneyStepBadge {
  @apply inline-flex items-center rounded-full bg-[color:var(--color-accent-quiet)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent-strong)];
}

.JourneyStepTitle {
  @apply text-2xl font-semibold font-display leading-tight;
}

.JourneyStepSubtitle {
  @apply text-base text-[color:var(--color-text-muted)];
}
</style>
