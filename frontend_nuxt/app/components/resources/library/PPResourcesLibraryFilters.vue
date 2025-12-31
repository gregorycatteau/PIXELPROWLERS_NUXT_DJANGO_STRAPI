<!--
  PPResourcesLibraryFilters.vue — DS CELL (V1.R2)
  
  Sidebar filtres pour la bibliothèque de ressources.
  Inclut : recherche (avec sanitization), filtre par category.
  
  @props
  - searchQuery: string — valeur actuelle de la recherche
  - filters: ResourceFilters — filtres actifs
  - filterOptions: FilterOptions — options disponibles
  - hasActiveFilters: boolean — si des filtres sont actifs
  
  @emits
  - search(query: string) — quand l'utilisateur tape
  - toggle-category(category: ResourceCategory) — toggle filtre category
  - clear-all() — effacer tous les filtres
-->
<template>
  <aside class="pp-reslib__sidebar" aria-label="Filtres">
    <!-- Search -->
    <div class="pp-reslib__search">
      <label for="resource-search" class="sr-only">
        Rechercher une ressource
      </label>
      <input
        id="resource-search"
        type="search"
        :value="searchQuery"
        placeholder="Rechercher..."
        class="pp-reslib__search-input"
        :maxlength="MAX_SEARCH_LENGTH"
        @input="handleSearchInput"
      />
    </div>

    <!-- Category Filter -->
    <fieldset class="pp-reslib__filter-group">
      <legend class="pp-reslib__filter-label">Categorie</legend>
      <div class="pp-reslib__filter-chips">
        <PPChip
          v-for="category in filterOptions.categories"
          :key="category"
          variant="action"
          size="sm"
          :aria-pressed="filters.category === category"
          @click="$emit('toggle-category', category)"
        >
          {{ RESOURCE_CATEGORY_LABELS[category] }}
        </PPChip>
      </div>
    </fieldset>

    <!-- Clear Filters -->
    <button
      v-if="hasActiveFilters"
      type="button"
      class="pp-reslib__clear-filters"
      @click="$emit('clear-all')"
    >
      Effacer les filtres
    </button>
  </aside>
</template>

<script setup lang="ts">
import {
  RESOURCE_CATEGORY_LABELS,
  type FilterOptions,
  type ResourceCategory,
} from '@/data/resourcesData';
import type { ResourceFilters } from '@/composables/useResourcesLibrary';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

/** Max search query length (hardening) */
const MAX_SEARCH_LENGTH = 120;


// -----------------------------------------------------------------------------
// PROPS & EMITS
// -----------------------------------------------------------------------------

defineProps<{
  searchQuery: string;
  filters: ResourceFilters;
  filterOptions: FilterOptions;
  hasActiveFilters: boolean;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'toggle-category', category: ResourceCategory): void;
  (e: 'clear-all'): void;
}>();

// -----------------------------------------------------------------------------
// LOCAL STATE
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// INPUT SANITIZATION (hardening R2)
// -----------------------------------------------------------------------------

/**
 * Sanitize search input:
 * - Clamp to max length
 * - Trim whitespace
 * - Normalize NFKC
 * - Remove zero-width characters
 */
function sanitizeSearchInput(raw: string): string {
  // Clamp length
  let value = raw.slice(0, MAX_SEARCH_LENGTH);
  
  // Normalize unicode
  value = value.normalize('NFKC');
  
  // Remove zero-width characters
  // eslint-disable-next-line no-control-regex
  value = value.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');
  
  // Trim
  value = value.trim();
  
  return value;
}

function handleSearchInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const sanitized = sanitizeSearchInput(target.value);
  emit('search', sanitized);
}
</script>

<style scoped>
@reference "@/assets/css/main.css";

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
