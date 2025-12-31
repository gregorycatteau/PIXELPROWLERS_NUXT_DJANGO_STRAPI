/**
 * useResourcesLibrary.ts — Composable pour la page /ressources (Registry V0)
 *
 * Fonctionnalites :
 * - Recherche (title/summary) avec debounce
 * - Filtres : category
 * - Pagination : limit/offset
 * - Deep linking via SafeDeepLinkKit (secure query params)
 * - Canonicalisation soft : auto-cleanup des URL sales/hostiles
 *
 * SECURITY:
 * - Tous les query params sont parses via parseResourcesDeepLink (allowlist stricte)
 * - Tous les query params sont reconstruits via buildResourcesDeepLink
 */

import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from '#imports';
import {
  buildFilterOptions,
  type FilterOptions,
  type ResourceCategory,
  type ResourceItem,
} from '@/data/resourcesData';
import {
  buildResourcesDeepLink,
  parseResourcesDeepLink,
} from '@/utils/deeplinks/resourcesDeepLink';
import { listResources } from '@/config/resources/registryV0';

// =============================================================================
// CONSTANTS
// =============================================================================

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;
const MAX_QUERY_STRING_LENGTH = 800;

const FORBIDDEN_PARAM_PREFIXES = [
  'utm_',
  'gclid',
  'fbclid',
  'ref',
  'source',
  'campaign',
  'debug',
];

const ZERO_WIDTH_CHARS = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g;

// =============================================================================
// FILTER INTERFACES
// =============================================================================

export interface ResourceFilters {
  category: ResourceCategory | '';
}

export interface UseResourcesLibraryReturn {
  searchQuery: Ref<string>;
  filters: Ref<ResourceFilters>;
  currentPage: Ref<number>;

  resources: Ref<ResourceItem[]>;
  totalResults: Ref<number>;
  totalPages: Ref<number>;
  filterOptions: Ref<FilterOptions>;

  setSearchQuery: (query: string) => void;
  toggleCategory: (category: ResourceCategory) => void;
  nextPage: () => void;
  prevPage: () => void;
  clearAll: () => void;

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
  const allResources = listResources();

  const searchQuery = ref('');
  const debouncedSearchQuery = ref('');
  const currentPage = ref(1);
  const isLoading = ref(true);
  const hasError = ref(false);
  const errorMessage = ref<string | null>(null);

  const resources = ref<ResourceItem[]>([]);
  const totalResults = ref(0);
  const filterOptions = ref<FilterOptions>({
    categories: [],
  });

  const filters = ref<ResourceFilters>({
    category: '',
  });

  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let hasCanonicalizedOnce = false;

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalResults.value / ITEMS_PER_PAGE))
  );

  const offset = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);

  const hasActiveFilters = computed(
    () =>
      !!filters.value.category ||
      debouncedSearchQuery.value !== ''
  );

  filterOptions.value = buildFilterOptions(allResources);
  readQueryParams();
  applyFilters();

  onMounted(() => {
    canonicalizeUrlIfNeeded();
  });

  onUnmounted(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
  });

  // ---------------------------------------------------------------------------
  // URL CANONICALIZATION (soft)
  // ---------------------------------------------------------------------------

  function isDirtyUrl(): boolean {
    try {
      const query = route.query;
      const fullPath = route.fullPath;
      const queryStart = fullPath.indexOf('?');
      if (queryStart !== -1) {
        const queryString = fullPath.slice(queryStart);
        if (queryString.length > MAX_QUERY_STRING_LENGTH) {
          return true;
        }
      }

      const queryKeys = Object.keys(query);
      for (const key of queryKeys) {
        const keyLower = key.toLowerCase();
        for (const prefix of FORBIDDEN_PARAM_PREFIXES) {
          if (keyLower.startsWith(prefix)) {
            return true;
          }
        }
      }

      const parsed = parseResourcesDeepLink(query);
      const rebuilt = buildResourcesDeepLink({
        q: parsed.q,
        category: parsed.category || undefined,
        limit: parsed.limit,
        offset: parsed.offset,
      });

      const rebuiltQuery = typeof rebuilt === 'string'
        ? {}
        : (rebuilt.query ?? {});

      for (const key of queryKeys) {
        if (!(key in rebuiltQuery)) {
          return true;
        }
      }

      return false;
    } catch {
      return true;
    }
  }

  function canonicalizeUrlIfNeeded(): void {
    if (hasCanonicalizedOnce) return;
    if (!isDirtyUrl()) return;

    hasCanonicalizedOnce = true;

    try {
      const parsed = parseResourcesDeepLink(route.query);
      const canonicalRoute = buildResourcesDeepLink({
        q: parsed.q,
        category: parsed.category || undefined,
        limit: parsed.limit,
        offset: parsed.offset,
      });
      router.replace(canonicalRoute);
    } catch {
      // Silent failure
    }
  }

  // ---------------------------------------------------------------------------
  // QUERY PARAMS HANDLING
  // ---------------------------------------------------------------------------

  function readQueryParams(): void {
    const parsed = parseResourcesDeepLink(route.query);

    searchQuery.value = parsed.q ?? '';
    debouncedSearchQuery.value = parsed.q ?? '';
    filters.value.category = parsed.category ?? '';

    currentPage.value = Math.floor(parsed.offset / parsed.limit) + 1;
  }

  function syncQueryParams(): void {
    const canonicalRoute = buildResourcesDeepLink({
      q: debouncedSearchQuery.value,
      category: filters.value.category || undefined,
      limit: ITEMS_PER_PAGE,
      offset: offset.value,
    });

    router.replace(canonicalRoute);
  }

  watch(
    [debouncedSearchQuery, filters, currentPage],
    () => {
      syncQueryParams();
      applyFilters();
    },
    { deep: true }
  );

  // ---------------------------------------------------------------------------
  // FILTERING
  // ---------------------------------------------------------------------------

  function applyFilters(): void {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = null;

    try {
      const q = sanitizeQuery(debouncedSearchQuery.value);
      const filtered = allResources.filter((resource) => {
        const matchesCategory =
          !filters.value.category || resource.category === filters.value.category;
        const matchesQuery = !q
          ? true
          : `${resource.title} ${resource.summary}`.toLowerCase().includes(q.toLowerCase());
        return matchesCategory && matchesQuery;
      });

      totalResults.value = filtered.length;
      const totalPagesSafe = Math.max(1, Math.ceil(totalResults.value / ITEMS_PER_PAGE));
      if (currentPage.value > totalPagesSafe) {
        currentPage.value = totalPagesSafe;
      }
      const pageStart = (currentPage.value - 1) * ITEMS_PER_PAGE;
      const pageEnd = pageStart + ITEMS_PER_PAGE;
      resources.value = filtered.slice(pageStart, pageEnd);
    } catch {
      hasError.value = true;
      errorMessage.value = 'Impossible de charger les ressources.';
    } finally {
      isLoading.value = false;
    }
  }

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  function setSearchQuery(query: string): void {
    searchQuery.value = query;

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = setTimeout(() => {
      debouncedSearchQuery.value = sanitizeQuery(query);
    }, SEARCH_DEBOUNCE_MS);
  }

  function toggleCategory(category: ResourceCategory): void {
    filters.value.category =
      filters.value.category === category ? '' : category;
  }

  function nextPage(): void {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
    }
  }

  function prevPage(): void {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  }

  function clearAll(): void {
    searchQuery.value = '';
    debouncedSearchQuery.value = '';
    filters.value = {
      category: '',
    };
    currentPage.value = 1;
  }

  // ---------------------------------------------------------------------------
  // SANITIZATION
  // ---------------------------------------------------------------------------

  function sanitizeQuery(raw: string): string {
    let value = raw.slice(0, 120);
    value = value.normalize('NFKC');
    value = value.replace(ZERO_WIDTH_CHARS, '');
    return value.trim();
  }

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    searchQuery,
    filters,
    currentPage,

    resources,
    totalResults,
    totalPages,
    filterOptions,

    setSearchQuery,
    toggleCategory,
    nextPage,
    prevPage,
    clearAll,

    hasActiveFilters,
    isLoading,
    hasError,
    errorMessage,
  };
}
