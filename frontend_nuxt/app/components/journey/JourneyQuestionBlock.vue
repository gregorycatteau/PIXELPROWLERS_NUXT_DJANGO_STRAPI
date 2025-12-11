<template>
<section
    class="JourneyQuestionBlock pp-card pp-journey-soft-scale"
    role="group"
    :aria-labelledby="labelId"
    :aria-describedby="description ? descriptionId : undefined"
  >
    <header class="JourneyQuestionHeader">
      <p :id="labelId" class="JourneyQuestionLabel">{{ title }}</p>
      <p v-if="description" :id="descriptionId" class="JourneyQuestionDescription">
        {{ description }}
      </p>
    </header>
    <div class="JourneyQuestionContent">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps<{
  title: string;
  description?: string;
  questionId?: string;
}>();

const { title, description, questionId } = toRefs(props);

const labelId = computed(() => `${questionId?.value || title.value}-label`);
const descriptionId = computed(() => `${questionId?.value || title.value}-desc`);
</script>

<style scoped>
@reference "@/assets/css/main.css";

.JourneyQuestionBlock {
  @apply w-full space-y-3 border border-[color:var(--color-stroke)]/70 bg-[color:var(--color-bg-card)]/90 p-4 sm:p-6;
}

.JourneyQuestionBlock:hover {
  @apply border-[color:var(--color-accent-border)] bg-[color:var(--color-bg-card)] shadow-[var(--shadow-soft)];
}

.JourneyQuestionBlock:focus-visible {
  @apply outline-none border-[color:var(--color-accent-border)] shadow-[0_0_0_4px_rgba(249,115,22,0.12)];
}

.JourneyQuestionHeader {
  @apply space-y-1;
}

.JourneyQuestionLabel {
  @apply text-lg font-semibold;
}

.JourneyQuestionDescription {
  @apply text-sm text-[color:var(--color-text-muted)];
}

.JourneyQuestionContent {
  @apply space-y-3;
}
</style>
