<!--
  PPResourcesLibraryToolbar.vue — DS CELL (V1.R2)
  
  Toolbar avec compteur de résultats.
  
  @props
  - totalResults: number — nombre total de résultats
-->
<template>
  <div class="pp-reslib__toolbar">
    <p class="pp-reslib__results-count" aria-live="polite">
      {{ totalResults }} ressource{{ totalResults !== 1 ? 's' : '' }}
    </p>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

defineProps<{
  totalResults: number;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
