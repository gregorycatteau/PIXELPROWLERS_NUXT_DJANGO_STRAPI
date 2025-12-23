<!--
  PPResourcesLibraryToolbar.vue — DS CELL (V1.R2)
  
  Toolbar avec compteur de résultats et sélecteur de tri.
  
  @props
  - totalResults: number — nombre total de résultats
  - sortBy: SortOption — option de tri actuelle
  
  @emits
  - sort-change(sort: SortOption) — quand le tri change
-->
<template>
  <div class="pp-reslib__toolbar">
    <p class="pp-reslib__results-count" aria-live="polite">
      {{ totalResults }} ressource{{ totalResults !== 1 ? 's' : '' }}
    </p>

    <div class="pp-reslib__sort">
      <label for="sort-select" class="sr-only">Trier par</label>
      <select
        id="sort-select"
        :value="sortBy"
        class="pp-reslib__sort-select"
        @change="handleSortChange"
      >
        <option
          v-for="option in SORT_OPTIONS"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SORT_OPTIONS, type SortOption } from '@/composables/useResourcesLibrary';

// -----------------------------------------------------------------------------
// PROPS & EMITS
// -----------------------------------------------------------------------------

defineProps<{
  totalResults: number;
  sortBy: SortOption;
}>();

const emit = defineEmits<{
  (e: 'sort-change', sort: SortOption): void;
}>();

// -----------------------------------------------------------------------------
// HANDLERS
// -----------------------------------------------------------------------------

function handleSortChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  emit('sort-change', target.value as SortOption);
}
</script>

<style scoped>
@reference "@/assets/css/pp.components.css";

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
