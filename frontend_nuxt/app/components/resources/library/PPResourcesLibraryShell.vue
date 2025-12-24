<!--
  PPResourcesLibraryShell.vue — DS CELL (V1.R2)
  
  Shell composant racine pour la page /ressources (mode LIBRARY).
  Orchestre les sous-composants : Filters, Toolbar, Grid, Pagination.
  
  @usage
  <PPResourcesLibraryShell />
-->
<template>
  <div class="pp-reslib">
    <!-- Error State — DS:PPErrorState -->
    <PPErrorState
      v-if="hasError"
      :description="errorMessage || undefined"
      @retry="clearAll"
    />

    <!-- Main Content -->
    <div v-else class="pp-reslib__layout">
      <!-- Sidebar Filters -->
      <PPResourcesLibraryFilters
        :search-query="searchQuery"
        :filters="filters"
        :filter-options="filterOptions"
        :has-active-filters="hasActiveFilters"
        @search="handleSearch"
        @toggle-kind="toggleKind"
        @toggle-tag="toggleTag"
        @toggle-effort="toggleEffort"
        @toggle-impact="toggleImpact"
        @clear-all="clearAll"
      />

      <!-- Main Content Area -->
      <div class="pp-reslib__main">
        <!-- Toolbar -->
        <PPResourcesLibraryToolbar
          :total-results="totalResults"
          :sort-by="sortBy"
          @sort-change="setSortBy"
        />

        <!-- Loading State — DS:PPLoadingState -->
        <PPLoadingState
          v-if="isLoading"
          label="Chargement des ressources…"
          variant="skeleton"
          :count="6"
        />

        <!-- Empty Catalogue State — DS:PPEmptyState -->
        <PPEmptyState
          v-else-if="totalResults === 0 && !hasActiveFilters"
          icon="folder"
          title="Aucune ressource disponible"
          description="Aucune ressource disponible pour le moment. Découvrez nos parcours pour des recommandations personnalisées."
          action-label="Découvrir le parcours P1"
          action-to="/parcours/p1"
        />

        <!-- No Results State — DS:PPEmptyState -->
        <PPEmptyState
          v-else-if="totalResults === 0 && hasActiveFilters"
          icon="search"
          title="Aucun résultat"
          description="Aucune ressource ne correspond à vos critères. Essayez d'élargir vos filtres ou de rechercher un autre terme."
          action-label="Effacer les filtres"
          @action="clearAll"
        />

        <!-- Resources Grid -->
        <PPResourcesLibraryGrid
          v-else
          :resources="paginatedResults"
        />

        <!-- Pagination -->
        <PPResourcesLibraryPagination
          v-if="totalPages > 1 && totalResults > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev="prevPage"
          @next="nextPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourcesLibrary, type SortOption } from '@/composables/useResourcesLibrary';
import type { ResourceKind, EffortLevel, ImpactLevel } from '@/data/resourcesData';

// -----------------------------------------------------------------------------
// COMPOSABLE
// -----------------------------------------------------------------------------

const {
  searchQuery,
  filters,
  sortBy,
  currentPage,
  paginatedResults,
  totalResults,
  totalPages,
  filterOptions,
  setSearchQuery,
  toggleKind,
  toggleTag,
  toggleEffort,
  toggleImpact,
  setSortBy,
  nextPage,
  prevPage,
  clearAll,
  hasActiveFilters,
  isLoading,
  hasError,
  errorMessage,
} = useResourcesLibrary();

// -----------------------------------------------------------------------------
// EVENT HANDLERS
// -----------------------------------------------------------------------------

function handleSearch(query: string): void {
  setSearchQuery(query);
}
</script>

<style scoped>
@reference "@/assets/css/main.css";
</style>
