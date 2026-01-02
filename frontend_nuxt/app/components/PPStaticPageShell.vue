<template>
  <main class="pp-static-page" :aria-labelledby="headerId">
    <slot />
  </main>
</template>

<script setup lang="ts">
defineProps<{
  headerId: string;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";

.pp-static-page {
  @apply w-full max-w-6xl mx-auto px-6 pb-16 space-y-12;
}

:deep(.pp-static-page__header-card) {
  @apply space-y-4;
}

:deep(.pp-static-page__stack) {
  @apply space-y-8;
}

:deep(.pp-static-page__grid) {
  @apply grid gap-4;
}

:deep(.pp-static-page__grid--pillars) {
  @apply md:grid-cols-3;
}

:deep(.pp-static-page__card) {
  @apply space-y-4;
}

:deep(.pp-static-page__section-body) {
  @apply space-y-3;
}

:deep(.pp-static-page__text) {
  @apply text-sm sm:text-base leading-relaxed text-[color:var(--pp-color-text-muted)];
}

:deep(.pp-static-page__list) {
  @apply list-disc pl-5 space-y-2 text-sm sm:text-base text-[color:var(--pp-color-text-muted)];
}

:deep(.pp-static-page__list--ordered) {
  @apply list-decimal;
}

:deep(.pp-static-page__list-label) {
  @apply font-semibold text-[color:var(--pp-color-text-primary)];
}

:deep(.pp-static-page__cta-row) {
  @apply flex flex-col gap-3 sm:flex-row sm:items-center;
}

:deep(.pp-static-page__cta) {
  @apply w-full sm:w-auto;
}
</style>
