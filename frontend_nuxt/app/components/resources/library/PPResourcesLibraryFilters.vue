<!--
  PPResourcesLibraryFilters.vue — DS CELL (V1.R2)
  
  Sidebar filtres pour la bibliothèque de ressources.
  Inclut : recherche (avec sanitization), filtres par type/effort/impact/tags.
  
  @props
  - searchQuery: string — valeur actuelle de la recherche
  - filters: ResourceFilters — filtres actifs
  - filterOptions: FilterOptions — options disponibles
  - hasActiveFilters: boolean — si des filtres sont actifs
  
  @emits
  - search(query: string) — quand l'utilisateur tape
  - toggle-kind(kind: ResourceKind) — toggle filtre type
  - toggle-tag(tag: string) — toggle filtre tag
  - toggle-effort(effort: EffortLevel) — toggle filtre effort
  - toggle-impact(impact: ImpactLevel) — toggle filtre impact
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

    <!-- Type Filter -->
    <fieldset class="pp-reslib__filter-group">
      <legend class="pp-reslib__filter-label">Type</legend>
      <div class="pp-reslib__filter-chips">
        <PPChip
          v-for="kind in filterOptions.kinds"
          :key="kind"
          variant="action"
          size="sm"
          :aria-pressed="filters.kinds.includes(kind)"
          @click="$emit('toggle-kind', kind)"
        >
          {{ RESOURCE_KIND_LABELS[kind] }}
        </PPChip>
      </div>
    </fieldset>

    <!-- Effort Filter -->
    <fieldset class="pp-reslib__filter-group">
      <legend class="pp-reslib__filter-label">Effort</legend>
      <div class="pp-reslib__filter-chips">
        <PPChip
          v-for="effort in filterOptions.efforts"
          :key="effort"
          variant="action"
          size="sm"
          :aria-pressed="filters.efforts.includes(effort)"
          @click="$emit('toggle-effort', effort)"
        >
          {{ EFFORT_LABELS[effort] }}
        </PPChip>
      </div>
    </fieldset>

    <!-- Impact Filter -->
    <fieldset class="pp-reslib__filter-group">
      <legend class="pp-reslib__filter-label">Impact</legend>
      <div class="pp-reslib__filter-chips">
        <PPChip
          v-for="impact in filterOptions.impacts"
          :key="impact"
          variant="action"
          size="sm"
          :aria-pressed="filters.impacts.includes(impact)"
          @click="$emit('toggle-impact', impact)"
        >
          {{ IMPACT_LABELS[impact] }}
        </PPChip>
      </div>
    </fieldset>

    <!-- Tags Filter -->
    <fieldset class="pp-reslib__filter-group">
      <legend class="pp-reslib__filter-label">Tags</legend>
      <div class="pp-reslib__filter-chips pp-reslib__filter-chips--wrap">
        <PPChip
          v-for="tag in displayedTags"
          :key="tag"
          variant="action"
          size="sm"
          :aria-pressed="filters.tags.includes(tag)"
          @click="$emit('toggle-tag', tag)"
        >
          {{ tag }}
        </PPChip>
        <button
          v-if="filterOptions.tags.length > MAX_VISIBLE_TAGS && !showAllTags"
          type="button"
          class="pp-reslib__show-more"
          @click="showAllTags = true"
        >
          +{{ filterOptions.tags.length - MAX_VISIBLE_TAGS }} tags
        </button>
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
import { ref, computed } from 'vue';
import {
  RESOURCE_KIND_LABELS,
  EFFORT_LABELS,
  IMPACT_LABELS,
  type ResourceKind,
  type EffortLevel,
  type ImpactLevel,
  type FilterOptions,
} from '@/data/resourcesData';
import type { ResourceFilters } from '@/composables/useResourcesLibrary';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

/** Max search query length (hardening) */
const MAX_SEARCH_LENGTH = 120;

/** Max visible tags before "show more" */
const MAX_VISIBLE_TAGS = 8;

// -----------------------------------------------------------------------------
// PROPS & EMITS
// -----------------------------------------------------------------------------

const props = defineProps<{
  searchQuery: string;
  filters: ResourceFilters;
  filterOptions: FilterOptions;
  hasActiveFilters: boolean;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'toggle-kind', kind: ResourceKind): void;
  (e: 'toggle-tag', tag: string): void;
  (e: 'toggle-effort', effort: EffortLevel): void;
  (e: 'toggle-impact', impact: ImpactLevel): void;
  (e: 'clear-all'): void;
}>();

// -----------------------------------------------------------------------------
// LOCAL STATE
// -----------------------------------------------------------------------------

const showAllTags = ref(false);

const displayedTags = computed(() =>
  showAllTags.value
    ? props.filterOptions.tags
    : props.filterOptions.tags.slice(0, MAX_VISIBLE_TAGS)
);

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
