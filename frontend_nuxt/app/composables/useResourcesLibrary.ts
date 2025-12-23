/**
 * useResourcesLibrary.ts — Composable pour la page /ressources (mode LIBRARY)
 *
 * Fonctionnalités :
 * - Recherche (title/description) avec debounce ~300ms
 * - Filtres : kind, tags, effort, impact, language
 * - Tri : default(position), updatedAt desc, effort asc, impact desc
 * - Pagination : 12/page (index + total pages)
 * - Deep linking via SafeDeepLinkKit (secure query params)
 * - Canonicalisation soft : auto-cleanup des URL sales/hostiles
 *
 * SECURITY (R2 + R2.1):
 * - Tous les query params sont parsés via parseResourcesDeepLink (allowlist stricte)
 * - Tous les query params sont reconstruits via buildResourcesDeepLink
 * - URL canonicalisation : params hostiles/inconnus → router.replace silencieux
 *
 * @see docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_LIBRARY_SPEC.md
 * @see frontend_nuxt/app/utils/deeplinks/resourcesDeepLink.ts
 */

import { computed, ref, watch, onMounted, onUnmounted, type Ref } from 'vue';
import { useRoute, useRouter } from '#imports';
import {
  RESOURCES,
  getFilterOptions,
  validateResourcesData,
  type ResourceItem,
  type ResourceKind,
  type EffortLevel,
  type ImpactLevel,
  type ResourceLanguage,
} from '@/data/resourcesData';
import {
  parseResourcesDeepLink,
  buildResourcesDeepLink,
  DEFAULT_FILTERS,
  type SortOption as DeepLinkSortOption,
  type FiltersNormalized,
} from '@/utils/deeplinks/resourcesDeepLink';

// =============================================================================
// CONSTANTS
// =============================================================================

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;

/**
 * Forbidden query param prefixes (privacy/tracking)
 * @see docs/40-security/contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md
 */
const FORBIDDEN_PARAM_PREFIXES = ['utm_', 'gclid', 'fbclid', 'ref', 'source', 'campaign', 'debug'];

/**
 * Max query string length before fallback (anti-DoS)
 */
const MAX_QUERY_STRING_LENGTH = 800;

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
  
  // Flag to prevent canonicalization loop
  let hasCanonicalizedOnce = false;

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

      // R2.1: Canonicalize URL if dirty (BEFORE reading params)
      canonicalizeUrlIfNeeded();

      // R2: Read query params via SafeDeepLinkKit
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
  // R2.1: URL CANONICALIZATION (soft)
  // ---------------------------------------------------------------------------

  /**
   * Check if current URL needs canonicalization.
   * Returns true if URL is "dirty" (has forbidden/unknown params, too long, etc.)
   */
  function isDirtyUrl(): boolean {
    try {
      const query = route.query;
      
      // Check query string length (anti-DoS)
      const fullPath = route.fullPath;
      const queryStart = fullPath.indexOf('?');
      if (queryStart !== -1) {
        const queryString = fullPath.slice(queryStart);
        if (queryString.length > MAX_QUERY_STRING_LENGTH) {
          if (import.meta.dev) {
            console.debug('[useResourcesLibrary] URL dirty: query string too long');
          }
          return true;
        }
      }
      
      // Check for forbidden params (utm_, gclid, etc.)
      const queryKeys = Object.keys(query);
      for (const key of queryKeys) {
        const keyLower = key.toLowerCase();
        for (const prefix of FORBIDDEN_PARAM_PREFIXES) {
          if (keyLower.startsWith(prefix)) {
            if (import.meta.dev) {
              console.debug(`[useResourcesLibrary] URL dirty: forbidden param "${key}"`);
            }
            return true;
          }
        }
      }
      
      // Parse with SafeDeepLinkKit and check if any param was dropped/modified
      const parsed = parseResourcesDeepLink(query);
      const rebuilt = buildResourcesDeepLink({
        q: parsed.q,
        kinds: parsed.kinds,
        tags: parsed.tags,
        efforts: parsed.efforts,
        impacts: parsed.impacts,
        languages: parsed.languages,
        sort: parsed.sort,
        page: parsed.page,
      });
      
      // Compare rebuilt query with current query
      const rebuiltQuery = typeof rebuilt === 'string' 
        ? {} 
        : (rebuilt.query ?? {});
      
      // Check if any param exists in original that's not in rebuilt (unknown params)
      for (const key of queryKeys) {
        if (!(key in rebuiltQuery)) {
          if (import.meta.dev) {
            console.debug(`[useResourcesLibrary] URL dirty: unknown param "${key}"`);
          }
          return true;
        }
      }
      
      return false;
    } catch {
      // If any error, consider URL dirty
      return true;
    }
  }

  /**
   * Canonicalize URL if dirty.
   * Uses router.replace for silent navigation (no history entry, no scroll reset).
   */
  function canonicalizeUrlIfNeeded(): void {
    // Prevent canonicalization loop
    if (hasCanonicalizedOnce) return;
    
    if (!isDirtyUrl()) return;
    
    hasCanonicalizedOnce = true;
    
    try {
      // Parse current params with SafeDeepLinkKit (sanitizes automatically)
      const parsed = parseResourcesDeepLink(route.query);
      
      // Rebuild canonical URL
      const canonicalRoute = buildResourcesDeepLink({
        q: parsed.q,
        kinds: parsed.kinds,
        tags: parsed.tags,
        efforts: parsed.efforts,
        impacts: parsed.impacts,
        languages: parsed.languages,
        sort: parsed.sort,
        page: parsed.page,
      });
      
      // Silent replace (no toast, no animation, no scroll reset)
      router.replace(canonicalRoute);
      
      if (import.meta.dev) {
        console.debug('[useResourcesLibrary] URL canonicalized');
      }
    } catch {
      // Silent failure — don't block user
      if (import.meta.dev) {
        console.debug('[useResourcesLibrary] URL canonicalization failed');
      }
    }
  }

  // ---------------------------------------------------------------------------
  // R2: QUERY PARAMS HANDLING via SafeDeepLinkKit
  // ---------------------------------------------------------------------------

  /**
   * Read query params using SafeDeepLinkKit (secure parsing with allowlist)
   */
  function readQueryParams(): void {
    // Use SafeDeepLinkKit for secure parsing
    const parsed = parseResourcesDeepLink(route.query);
    
    // Apply parsed values to state
    searchQuery.value = parsed.q;
    debouncedSearchQuery.value = parsed.q;
    
    // Filter by available options (belt-and-suspenders validation)
    filters.value.kinds = parsed.kinds.filter((k) =>
      filterOptions.kinds.includes(k)
    );
    filters.value.tags = parsed.tags.filter((t) =>
      filterOptions.tags.includes(t)
    );
    filters.value.efforts = parsed.efforts.filter((e) =>
      filterOptions.efforts.includes(e)
    );
    filters.value.impacts = parsed.impacts.filter((i) =>
      filterOptions.impacts.includes(i)
    );
    filters.value.languages = parsed.languages.filter((l) =>
      filterOptions.languages.includes(l)
    );
    
    sortBy.value = parsed.sort;
    currentPage.value = parsed.page;
  }

  /**
   * Sync state to query params using SafeDeepLinkKit (secure building)
   */
  function syncQueryParams(): void {
    // Use SafeDeepLinkKit to build canonical URL
    const canonicalRoute = buildResourcesDeepLink({
      q: debouncedSearchQuery.value,
      kinds: filters.value.kinds,
      tags: filters.value.tags,
      efforts: filters.value.efforts,
      impacts: filters.value.impacts,
      languages: filters.value.languages,
      sort: sortBy.value,
      page: currentPage.value,
    });
    
    // Use replace to avoid polluting history on every filter change
    router.replace(canonicalRoute);
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
