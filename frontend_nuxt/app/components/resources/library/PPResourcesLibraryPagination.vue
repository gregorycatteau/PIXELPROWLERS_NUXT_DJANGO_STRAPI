<!--
  PPResourcesLibraryPagination.vue — DS CELL (V1.R2)
  
  Contrôles de pagination pour la bibliothèque de ressources.
  
  @props
  - currentPage: number — page actuelle
  - totalPages: number — nombre total de pages
  
  @emits
  - prev() — aller à la page précédente
  - next() — aller à la page suivante
-->
<template>
  <nav
    class="pp-reslib__pagination"
    aria-label="Pagination des ressources"
  >
    <button
      type="button"
      class="pp-reslib__pagination-btn"
      :disabled="currentPage <= 1"
      :aria-disabled="currentPage <= 1"
      @click="$emit('prev')"
    >
      <span aria-hidden="true">←</span>
      Précédent
    </button>

    <span class="pp-reslib__pagination-info">
      Page {{ currentPage }} sur {{ totalPages }}
    </span>

    <button
      type="button"
      class="pp-reslib__pagination-btn"
      :disabled="currentPage >= totalPages"
      :aria-disabled="currentPage >= totalPages"
      @click="$emit('next')"
    >
      Suivant
      <span aria-hidden="true">→</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// PROPS & EMITS
// -----------------------------------------------------------------------------

defineProps<{
  currentPage: number;
  totalPages: number;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
