/**
 * useResourcesLibrary.ts — Composable pour la page /ressources (mode LIBRARY)
 *
 * Fonctionnalités :
 * - Recherche (title/description) avec debounce ~300ms
 * - Filtres : kind, tags, effort, impact, language
 * - Tri : default(position), updatedAt desc, effort asc, impact desc
 * - Pagination : 12/page (index + total pages)
 * - Deep linking via query params
 * - Sanitation des query params (allowlist clés/valeurs)
 *
 * @see docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md
 */

import { computed, ref, watch, onMounted, onUnmounted, type Ref } from 'vue';
import { useRoute, useRouter } from '#imports';
import {
  RESOURCES,
  getFilterOptions,
  validateResourcesData,
  EFFORT_LABELS,
  IMPACT_LABELS,
  type ResourceItem,
  type ResourceKind,
  type EffortLevel,
  type ImpactLevel,
  type ResourceLanguage,
} from '@/data/resourcesData';

// =============================================================================
// CONSTANTS
// =============================================================================

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;

/** Allowlist for query param keys */
const ALLOWED_QUERY_KEYS = [
  'q',
  'kind',
  'tags',
  'effort',
  'impact',
  'language',
  'sort',
  'page',
] as const;

/** Sort options */
export type SortOption = 'default' | 'updatedAt' | 'effort' | 'impact';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Recommandé' },
  { value: 'updatedAt', label: 'Plus récent' },
  { value: 'effort', label: 'Effort croissant' },
  { value: 'impact', label: 'Impact décroissant' },
];

/** Effort order for sorting */
const EFFORT_ORDER: Record<EffortLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/** Impact order for sorting (reversed for desc) */
const IMPACT_ORDER: Record<ImpactLevel, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

// =============================================================================
// FILTER INTERFACES
// =============================================================================

export interface ResourceFilters {
  kinds: ResourceKind[];
  tags: string[];
  efforts: EffortLevel[];
  impacts: ImpactLevel[];
  languages: ResourceLanguage[];
}

export interface UseResourcesLibraryReturn {
  // State
  searchQuery: Ref<string>;
  filters: Ref<ResourceFilters>;
  sortBy: Ref<SortOption>;
  currentPage: Ref<number>;

  // Computed
  filteredResults: Ref<ResourceItem[]>;
  paginatedResults: Ref<ResourceItem[]>;
  totalResults: Ref<number>;
  totalPages: Ref<number>;

  // Filter options (available values)
  filterOptions: ReturnType<typeof getFilterOptions>;

  // Actions
  setSearchQuery: (query: string) => void;
  toggleKind: (kind: ResourceKind) => void;
  toggleTag: (tag: string) => void;
  toggleEffort: (effort: EffortLevel) => void;
  toggleImpact: (impact: ImpactLevel) => void;
  toggleLanguage: (lang: ResourceLanguage) => void;
  setSortBy: (sort: SortOption) => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  clearFilters: () => void;
  clearAll: () => void;

  // State checks
  hasActiveFilters: Ref<boolean>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  errorMessage: Ref<string | null>;
}

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useResourcesLibrary(): UseResourcesLibraryReturn {
  const route = useRoute();
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const searchQuery = ref('');
  const debouncedSearchQuery = ref('');
  const sortBy = ref<SortOption>('default');
  const currentPage = ref(1);
  const isLoading = ref(true);
  const hasError = ref(false);
  const errorMessage = ref<string | null>(null);

  const filters = ref<ResourceFilters>({
    kinds: [],
    tags: [],
    efforts: [],
    impacts: [],
    languages: [],
  });

  // Debounce timer
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // ---------------------------------------------------------------------------
  // FILTER OPTIONS (available values from catalogue)
  // ---------------------------------------------------------------------------

  const filterOptions = getFilterOptions();

  // ---------------------------------------------------------------------------
  // VALIDATION ON MOUNT (dev only)
  // ---------------------------------------------------------------------------

  onMounted(() => {
    try {
      // Validate data in dev mode
      if (import.meta.dev) {
        validateResourcesData();
      }

      // Read query params
      readQueryParams();

      isLoading.value = false;
    } catch (err) {
      hasError.value = true;
      errorMessage.value =
        err instanceof Error ? err.message : 'Erreur de chargement des ressources';
      isLoading.value = false;
    }
  });

  onUnmounted(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
  });

  // ---------------------------------------------------------------------------
  // QUERY PARAMS HANDLING
  // ---------------------------------------------------------------------------

  /**
   * Sanitize and parse query params with allowlist
   */
  function readQueryParams(): void {
    const query = route.query;

    // Search query
    if (typeof query.q === 'string' && query.q.length <= 100) {
      searchQuery.value = query.q.trim();
      debouncedSearchQuery.value = query.q.trim();
    }

    // Kind filter
    if (query.kind) {
      const kinds = (Array.isArray(query.kind) ? query.kind : [query.kind])
        .filter((k): k is ResourceKind =>
          filterOptions.kinds.includes(k as ResourceKind)
        );
      filters.value.kinds = kinds;
    }

    // Tags filter
    if (query.tags) {
      const tagsParam = typeof query.tags === 'string' ? query.tags : '';
      const tags = tagsParam
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => filterOptions.tags.includes(t));
      filters.value.tags = tags;
    }

    // Effort filter
    if (query.effort) {
      const efforts = (Array.isArray(query.effort) ? query.effort : [query.effort])
        .filter((e): e is EffortLevel =>
          filterOptions.efforts.includes(e as EffortLevel)
        );
      filters.value.efforts = efforts;
    }

    // Impact filter
    if (query.impact) {
      const impacts = (Array.isArray(query.impact) ? query.impact : [query.impact])
        .filter((i): i is ImpactLevel =>
          filterOptions.impacts.includes(i as ImpactLevel)
        );
      filters.value.impacts = impacts;
    }

    // Language filter
    if (query.language) {
      const languages = (
        Array.isArray(query.language) ? query.language : [query.language]
      ).filter((l): l is ResourceLanguage =>
        filterOptions.languages.includes(l as ResourceLanguage)
      );
      filters.value.languages = languages;
    }

    // Sort
    if (
      typeof query.sort === 'string' &&
      SORT_OPTIONS.some((o) => o.value === query.sort)
    ) {
      sortBy.value = query.sort as SortOption;
    }

    // Page
    if (typeof query.page === 'string') {
      const page = parseInt(query.page, 10);
      if (!isNaN(page) && page >= 1) {
        currentPage.value = page;
      }
    }
  }

  /**
   * Sync state to query params (without breaking back/forward navigation)
   */
  function syncQueryParams(): void {
    const query: Record<string, string | string[] | undefined> = {};

    // Only include non-empty values
    if (debouncedSearchQuery.value) {
      query.q = debouncedSearchQuery.value;
    }
    if (filters.value.kinds.length > 0) {
      query.kind = filters.value.kinds;
    }
    if (filters.value.tags.length > 0) {
      query.tags = filters.value.tags.join(',');
    }
    if (filters.value.efforts.length > 0) {
      query.effort = filters.value.efforts;
    }
    if (filters.value.impacts.length > 0) {
      query.impact = filters.value.impacts;
    }
    if (filters.value.languages.length > 0) {
      query.language = filters.value.languages;
    }
    if (sortBy.value !== 'default') {
      query.sort = sortBy.value;
    }
    if (currentPage.value > 1) {
      query.page = String(currentPage.value);
    }

    // Use replace to avoid polluting history on every filter change
    router.replace({ query });
  }

  // Watch for state changes and sync to URL
  watch(
    [debouncedSearchQuery, filters, sortBy, currentPage],
    () => {
      syncQueryParams();
    },
    { deep: true }
  );

  // ---------------------------------------------------------------------------
  // FILTERING LOGIC
  // ---------------------------------------------------------------------------

  const filteredResults = computed<ResourceItem[]>(() => {
    let results = [...RESOURCES];

    // Search filter (title + description)
    if (debouncedSearchQuery.value) {
      const query = debouncedSearchQuery.value.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      );
    }

    // Kind filter
    if (filters.value.kinds.length > 0) {
      results = results.filter((r) => filters.value.kinds.includes(r.kind));
    }

    // Tags filter (match any)
    if (filters.value.tags.length > 0) {
      results = results.filter((r) =>
        r.tags.some((t) => filters.value.tags.includes(t))
      );
    }

    // Effort filter
    if (filters.value.efforts.length > 0) {
      results = results.filter((r) => filters.value.efforts.includes(r.effort));
    }

    // Impact filter
    if (filters.value.impacts.length > 0) {
      results = results.filter((r) => filters.value.impacts.includes(r.impact));
    }

    // Language filter
    if (filters.value.languages.length > 0) {
      results = results.filter((r) =>
        filters.value.languages.includes(r.language)
      );
    }

    // Sorting
    switch (sortBy.value) {
      case 'updatedAt':
        results.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case 'effort':
        results.sort(
          (a, b) => EFFORT_ORDER[a.effort] - EFFORT_ORDER[b.effort]
        );
        break;
      case 'impact':
        results.sort(
          (a, b) => IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact]
        );
        break;
      case 'default':
      default:
        results.sort((a, b) => a.position - b.position);
        break;
    }

    return results;
  });

  // ---------------------------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------------------------

  const totalResults = computed(() => filteredResults.value.length);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalResults.value / ITEMS_PER_PAGE))
  );

  const paginatedResults = computed<ResourceItem[]>(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredResults.value.slice(start, end);
  });

  // Reset page to 1 when filters change
  watch(
    [debouncedSearchQuery, filters, sortBy],
    () => {
      currentPage.value = 1;
    },
    { deep: true }
  );

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  function setSearchQuery(query: string): void {
    searchQuery.value = query;

    // Debounce the actual search
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = setTimeout(() => {
      debouncedSearchQuery.value = query.trim();
    }, SEARCH_DEBOUNCE_MS);
  }

  function toggleArrayItem<T>(array: T[], item: T): T[] {
    const index = array.indexOf(item);
    if (index === -1) {
      return [...array, item];
    } else {
      return array.filter((_, i) => i !== index);
    }
  }

  function toggleKind(kind: ResourceKind): void {
    filters.value.kinds = toggleArrayItem(filters.value.kinds, kind);
  }

  function toggleTag(tag: string): void {
    filters.value.tags = toggleArrayItem(filters.value.tags, tag);
  }

  function toggleEffort(effort: EffortLevel): void {
    filters.value.efforts = toggleArrayItem(filters.value.efforts, effort);
  }

  function toggleImpact(impact: ImpactLevel): void {
    filters.value.impacts = toggleArrayItem(filters.value.impacts, impact);
  }

  function toggleLanguage(lang: ResourceLanguage): void {
    filters.value.languages = toggleArrayItem(filters.value.languages, lang);
  }

  function setSortBy(sort: SortOption): void {
    sortBy.value = sort;
  }

  function setPage(page: number): void {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function nextPage(): void {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }

  function prevPage(): void {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }

  function clearFilters(): void {
    filters.value = {
      kinds: [],
      tags: [],
      efforts: [],
      impacts: [],
      languages: [],
    };
  }

  function clearAll(): void {
    searchQuery.value = '';
    debouncedSearchQuery.value = '';
    clearFilters();
    sortBy.value = 'default';
    currentPage.value = 1;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED HELPERS
  // ---------------------------------------------------------------------------

  const hasActiveFilters = computed(
    () =>
      filters.value.kinds.length > 0 ||
      filters.value.tags.length > 0 ||
      filters.value.efforts.length > 0 ||
      filters.value.impacts.length > 0 ||
      filters.value.languages.length > 0 ||
      debouncedSearchQuery.value !== ''
  );

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // State
    searchQuery,
    filters,
    sortBy,
    currentPage,

    // Computed
    filteredResults,
    paginatedResults,
    totalResults,
    totalPages,

    // Filter options
    filterOptions,

    // Actions
    setSearchQuery,
    toggleKind,
    toggleTag,
    toggleEffort,
    toggleImpact,
    toggleLanguage,
    setSortBy,
    setPage,
    nextPage,
    prevPage,
    clearFilters,
    clearAll,

    // State checks
    hasActiveFilters,
    isLoading,
    hasError,
    errorMessage,
  };
}
