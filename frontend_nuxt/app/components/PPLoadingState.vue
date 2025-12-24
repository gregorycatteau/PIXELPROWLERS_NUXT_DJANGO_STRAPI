<!--
  PPLoadingState.vue — DS ATOM (V1.STATES-R1)
  
  État de chargement accessible. Skeleton ou spinner.
  
  @props
    label   - Label accessible (défaut: "Chargement…")
    variant - 'skeleton' | 'spinner' (défaut: skeleton)
    count   - Nombre de skeleton items (défaut: 3, pour variant skeleton)
  
  @usage
  <PPLoadingState />
  <PPLoadingState variant="spinner" label="Chargement des ressources…" />
  <PPLoadingState variant="skeleton" :count="6" />
-->
<template>
  <div
    class="pp-state pp-state--loading"
    role="status"
    aria-busy="true"
    :aria-label="label"
  >
    <!-- Spinner Variant -->
    <div v-if="variant === 'spinner'" class="pp-state__spinner-container">
      <div class="pp-state__spinner" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <span class="pp-state__label">{{ label }}</span>
    </div>

    <!-- Skeleton Variant -->
    <div v-else class="pp-state__skeleton-grid">
      <div
        v-for="i in count"
        :key="i"
        class="pp-state__skeleton-card"
        aria-hidden="true"
      >
        <div class="pp-state__skeleton-bar pp-state__skeleton-bar--title" />
        <div class="pp-state__skeleton-bar pp-state__skeleton-bar--text" />
        <div class="pp-state__skeleton-bar pp-state__skeleton-bar--text pp-state__skeleton-bar--short" />
      </div>
    </div>

    <!-- Screen reader only label -->
    <span class="sr-only">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
export interface PPLoadingStateProps {
  label?: string;
  variant?: 'skeleton' | 'spinner';
  count?: number;
}

withDefaults(defineProps<PPLoadingStateProps>(), {
  label: 'Chargement…',
  variant: 'skeleton',
  count: 3,
});
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
