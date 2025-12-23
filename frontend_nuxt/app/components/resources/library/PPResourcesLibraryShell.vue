<!--
  PPResourcesLibraryShell.vue — DS CELL (V1.R2)
  
  Shell composant racine pour la page /ressources (mode LIBRARY).
  Orchestre les sous-composants : Filters, Toolbar, Grid, Pagination.
  
  @usage
  <PPResourcesLibraryShell />
-->
<template>
  <div class="pp-reslib">
    <!-- Error State -->
    <div
      v-if="hasError"
      class="pp-reslib__error"
      role="alert"
      aria-live="polite"
    >
      <p class="pp-reslib__error-message">
        {{ errorMessage || 'Une erreur est survenue lors du chargement.' }}
      </p>
      <button
        type="button"
        class="pp-cta-secondary"
        @click="clearAll"
      >
        Réessayer
      </button>
    </div>

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

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="pp-reslib__loading"
          aria-label="Chargement des ressources"
        >
          <div class="pp-reslib__skeleton-grid">
            <div
              v-for="i in 6"
              :key="i"
              class="pp-reslib__skeleton-card"
              aria-hidden="true"
            />
          </div>
        </div>

        <!-- Empty Catalogue State -->
        <div
          v-else-if="totalResults === 0 && !hasActiveFilters"
          class="pp-reslib__empty"
          role="status"
        >
          <p class="pp-reslib__empty-title">
            Aucune ressource disponible
          </p>
          <p class="pp-reslib__empty-message">
            Aucune ressource disponible pour le moment. Découvrez nos parcours
            pour des recommandations personnalisées.
          </p>
          <NuxtLink to="/parcours/p1" class="pp-cta-primary">
            Découvrir le parcours P1
          </NuxtLink>
        </div>

        <!-- No Results State -->
        <div
          v-else-if="totalResults === 0 && hasActiveFilters"
          class="pp-reslib__no-results"
          role="status"
        >
          <p class="pp-reslib__no-results-title">
            Aucun résultat
          </p>
          <p class="pp-reslib__no-results-message">
            Aucune ressource ne correspond à vos critères. Essayez d'élargir vos
            filtres ou de rechercher un autre terme.
          </p>
          <button
            type="button"
            class="pp-cta-secondary"
            @click="clearAll"
          >
            Effacer les filtres
          </button>
        </div>

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
@reference "@/assets/css/pp.components.css";
</style>
