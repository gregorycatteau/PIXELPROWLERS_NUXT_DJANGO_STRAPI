/**
 * useResourcesLibrary.ts — Composable pour la page /ressources (API-backed)
 *
 * Fonctionnalites :
 * - Recherche (title/summary) avec debounce
 * - Filtres : type, tags, category, level, journey
 * - Pagination : limit/offset
 * - Deep linking via SafeDeepLinkKit (secure query params)
 * - Canonicalisation soft : auto-cleanup des URL sales/hostiles
 *
 * SECURITY:
 * - Tous les query params sont parses via parseResourcesDeepLink (allowlist stricte)
 * - Tous les query params sont reconstruits via buildResourcesDeepLink
 */

import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter, useRuntimeConfig } from '#imports';
import {
  buildFilterOptions,
  type FilterOptions,
  type ResourceCategory,
  type ResourceItem,
  type ResourceJourney,
  type ResourceLevel,
  type ResourceType,
  type ResourcesResponse,
} from '@/data/resourcesData';
import {
  buildResourcesDeepLink,
  parseResourcesDeepLink,
} from '@/utils/deeplinks/resourcesDeepLink';

// =============================================================================
// CONSTANTS
// =============================================================================

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;
const MAX_QUERY_STRING_LENGTH = 800;
const MAX_TAGS = 5;
const MAX_FILTER_OPTIONS_FETCH = 200;

const FORBIDDEN_PARAM_PREFIXES = [
  'utm_',
  'gclid',
  'fbclid',
  'ref',
  'source',
  'campaign',
  'debug',
];

const TAG_PATTERN = /^[a-z0-9-]+$/;
const ZERO_WIDTH_CHARS = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g;

// =============================================================================
// FILTER INTERFACES
// =============================================================================

export interface ResourceFilters {
  tags: string[];
  category: ResourceCategory | '';
  level: ResourceLevel | '';
  journey: ResourceJourney | '';
  type: ResourceType | '';
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
  toggleTag: (tag: string) => void;
  toggleCategory: (category: ResourceCategory) => void;
  toggleLevel: (level: ResourceLevel) => void;
  toggleJourney: (journey: ResourceJourney) => void;
  toggleType: (rtype: ResourceType) => void;
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
  const config = useRuntimeConfig();

  const searchQuery = ref('');
  const debouncedSearchQuery = ref('');
  const currentPage = ref(1);
  const isLoading = ref(true);
  const hasError = ref(false);
  const errorMessage = ref<string | null>(null);

  const resources = ref<ResourceItem[]>([]);
  const totalResults = ref(0);
  const filterOptions = ref<FilterOptions>({
    tags: [],
    categories: [],
    levels: [],
    journeys: [],
    types: [],
  });

  const filters = ref<ResourceFilters>({
    tags: [],
    category: '',
    level: '',
    journey: '',
    type: '',
  });

  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let hasCanonicalizedOnce = false;
  let activeRequestId = 0;

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalResults.value / ITEMS_PER_PAGE))
  );

  const offset = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);

  const hasActiveFilters = computed(
    () =>
      filters.value.tags.length > 0 ||
      !!filters.value.category ||
      !!filters.value.level ||
      !!filters.value.journey ||
      !!filters.value.type ||
      debouncedSearchQuery.value !== ''
  );

  onMounted(() => {
    try {
      canonicalizeUrlIfNeeded();
      readQueryParams();
      void fetchFilterOptions();
      void fetchResources();
    } catch (err) {
      hasError.value = true;
      errorMessage.value = 'Impossible de charger les ressources.';
      isLoading.value = false;
    }
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
        tags: parsed.tags,
        category: parsed.category || undefined,
        level: parsed.level || undefined,
        journey: parsed.journey || undefined,
        type: parsed.type || undefined,
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
        tags: parsed.tags,
        category: parsed.category || undefined,
        level: parsed.level || undefined,
        journey: parsed.journey || undefined,
        type: parsed.type || undefined,
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

    searchQuery.value = parsed.q;
    debouncedSearchQuery.value = parsed.q;
    filters.value.tags = parsed.tags;
    filters.value.category = parsed.category;
    filters.value.level = parsed.level;
    filters.value.journey = parsed.journey;
    filters.value.type = parsed.type;

    currentPage.value = Math.floor(parsed.offset / parsed.limit) + 1;
  }

  function syncQueryParams(): void {
    const canonicalRoute = buildResourcesDeepLink({
      q: debouncedSearchQuery.value,
      tags: filters.value.tags,
      category: filters.value.category || undefined,
      level: filters.value.level || undefined,
      journey: filters.value.journey || undefined,
      type: filters.value.type || undefined,
      limit: ITEMS_PER_PAGE,
      offset: offset.value,
    });

    router.replace(canonicalRoute);
  }

  watch(
    [debouncedSearchQuery, filters, currentPage],
    () => {
      syncQueryParams();
      void fetchResources();
    },
    { deep: true }
  );

  // ---------------------------------------------------------------------------
  // FETCHING
  // ---------------------------------------------------------------------------

  async function fetchResources(): Promise<void> {
    const requestId = ++activeRequestId;
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = null;

    try {
      const query: Record<string, string | number> = {
        limit: ITEMS_PER_PAGE,
        offset: offset.value,
      };

      const q = sanitizeQuery(debouncedSearchQuery.value);
      if (q) query.q = q;

      if (filters.value.tags.length > 0) {
        query.tags = filters.value.tags.slice(0, MAX_TAGS).join(',');
      }
      if (filters.value.category) query.category = filters.value.category;
      if (filters.value.level) query.level = filters.value.level;
      if (filters.value.journey) query.journey = filters.value.journey;
      if (filters.value.type) query.type = filters.value.type;

      const response = await $fetch<ResourcesResponse>(
        `${config.public.apiBase}/api/v1/resources/`,
        { query }
      );

      if (requestId !== activeRequestId) return;

      resources.value = response.resources;
      totalResults.value = response.total;
    } catch (err) {
      if (requestId !== activeRequestId) return;
      hasError.value = true;
      errorMessage.value = 'Impossible de charger les ressources.';
    } finally {
      if (requestId === activeRequestId) {
        isLoading.value = false;
      }
    }
  }

  async function fetchFilterOptions(): Promise<void> {
    try {
      const allResources: ResourceItem[] = [];
      let offsetValue = 0;
      let total = 0;
      const limit = 50;

      do {
        const response = await $fetch<ResourcesResponse>(
          `${config.public.apiBase}/api/v1/resources/`,
          { query: { limit, offset: offsetValue } }
        );

        allResources.push(...response.resources);
        total = response.total;
        offsetValue += limit;
      } while (offsetValue < total && allResources.length < MAX_FILTER_OPTIONS_FETCH);

      filterOptions.value = buildFilterOptions(allResources);
    } catch {
      filterOptions.value = buildFilterOptions(resources.value);
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

  function toggleTag(tag: string): void {
    const normalized = normalizeTag(tag);
    if (!normalized) return;

    if (filters.value.tags.includes(normalized)) {
      filters.value.tags = filters.value.tags.filter((t) => t !== normalized);
    } else {
      filters.value.tags = [...filters.value.tags, normalized].slice(0, MAX_TAGS);
    }
  }

  function toggleCategory(category: ResourceCategory): void {
    filters.value.category =
      filters.value.category === category ? '' : category;
  }

  function toggleLevel(level: ResourceLevel): void {
    filters.value.level = filters.value.level === level ? '' : level;
  }

  function toggleJourney(journey: ResourceJourney): void {
    filters.value.journey = filters.value.journey === journey ? '' : journey;
  }

  function toggleType(rtype: ResourceType): void {
    filters.value.type = filters.value.type === rtype ? '' : rtype;
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
      tags: [],
      category: '',
      level: '',
      journey: '',
      type: '',
    };
    currentPage.value = 1;
  }

  // ---------------------------------------------------------------------------
  // SANITIZATION
  // ---------------------------------------------------------------------------

  function normalizeTag(value: string): string | null {
    const sanitized = sanitizeQuery(value).toLowerCase();
    if (!sanitized || !TAG_PATTERN.test(sanitized)) {
      return null;
    }
    return sanitized;
  }

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
    toggleTag,
    toggleCategory,
    toggleLevel,
    toggleJourney,
    toggleType,
    nextPage,
    prevPage,
    clearAll,

    hasActiveFilters,
    isLoading,
    hasError,
    errorMessage,
  };
}
