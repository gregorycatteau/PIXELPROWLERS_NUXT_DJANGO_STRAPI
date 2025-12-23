/**
 * resourcesDeepLink.ts — Safe Deep Link Kit pour /ressources
 *
 * API canonique pour construire et parser les deep links vers /ressources.
 * Garanties sécurité P0 :
 * - Allowlist stricte des clés/valeurs query params
 * - Sanitization NFKC + strip zero-width + trim + clamp
 * - Zéro throw : payload hostile => fallback neutre
 * - Pas de logs sur query brutes
 *
 * @see docs/40-security/contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md
 */

import type { RouteLocationRaw } from '#vue-router';
import {
  type ResourceKind,
  type EffortLevel,
  type ImpactLevel,
  type ResourceLanguage,
} from '@/data/resourcesData';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Max length for search query */
const MAX_QUERY_LENGTH = 120;

/** Max tags allowed */
const MAX_TAGS = 5;

/** Max page number (anti-phantom pages) */
const MAX_PAGE = 50;

/** Allowlist for query param keys */
const ALLOWED_KEYS = new Set([
  'q',
  'kind',
  'tags',
  'effort',
  'impact',
  'language',
  'sort',
  'page',
]);

/** Valid sort options */
const VALID_SORT_OPTIONS = new Set(['default', 'updatedAt', 'effort', 'impact']);

/** Valid kind options */
const VALID_KINDS = new Set<string>(['tool', 'read', 'watch', 'template']);

/** Valid effort options */
const VALID_EFFORTS = new Set<string>(['low', 'medium', 'high']);

/** Valid impact options */
const VALID_IMPACTS = new Set<string>(['low', 'medium', 'high']);

/** Valid language options */
const VALID_LANGUAGES = new Set<string>(['fr', 'en']);

/** Zero-width characters to strip */
const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\u2060\uFEFF]/g;

/** Tag validation pattern (kebab-case lowercase) */
const TAG_PATTERN = /^[a-z0-9-]+$/;

// =============================================================================
// TYPES
// =============================================================================

export type SortOption = 'default' | 'updatedAt' | 'effort' | 'impact';

/**
 * Normalized filters for /ressources page.
 * All arrays are non-null, strings are sanitized.
 */
export interface FiltersNormalized {
  q: string;
  kinds: ResourceKind[];
  tags: string[];
  efforts: EffortLevel[];
  impacts: ImpactLevel[];
  languages: ResourceLanguage[];
  sort: SortOption;
  page: number;
}

/**
 * Partial input for building a deep link.
 */
export interface DeepLinkInput {
  q?: string;
  kind?: ResourceKind | ResourceKind[];
  kinds?: ResourceKind[];
  tags?: string | string[];
  effort?: EffortLevel | EffortLevel[];
  efforts?: EffortLevel[];
  impact?: ImpactLevel | ImpactLevel[];
  impacts?: ImpactLevel[];
  language?: ResourceLanguage | ResourceLanguage[];
  languages?: ResourceLanguage[];
  sort?: SortOption;
  page?: number;
}

// =============================================================================
// SANITIZATION HELPERS
// =============================================================================

/**
 * Sanitize a string for safe use in query params.
 * - NFKC normalization
 * - Strip zero-width characters (silent, no throw)
 * - Trim whitespace
 * - Clamp to maxLength
 *
 * @returns sanitized string, or empty string if invalid
 */
function sanitizeString(value: unknown, maxLength: number = MAX_QUERY_LENGTH): string {
  if (typeof value !== 'string') return '';
  
  try {
    // NFKC normalization
    let result = value.normalize('NFKC');
    
    // Strip zero-width characters (silent)
    result = result.replace(ZERO_WIDTH_CHARS, '');
    
    // Trim whitespace
    result = result.trim();
    
    // Clamp length
    if (result.length > maxLength) {
      result = result.slice(0, maxLength);
    }
    
    return result;
  } catch {
    // Any error => return empty
    return '';
  }
}

/**
 * Normalize a tag string.
 * - Sanitize + lowercase
 * - Validate kebab-case pattern
 *
 * @returns normalized tag, or null if invalid
 */
function normalizeTag(value: unknown): string | null {
  const sanitized = sanitizeString(value, 50).toLowerCase();
  if (!sanitized || !TAG_PATTERN.test(sanitized)) {
    return null;
  }
  return sanitized;
}

/**
 * Parse an array-like query param (can be string or string[]).
 * Returns an array of sanitized, validated values.
 */
function parseArrayParam<T extends string>(
  value: unknown,
  validSet: Set<string>,
  maxItems: number = 10
): T[] {
  const result: T[] = [];
  
  try {
    // Handle string (single value or comma-separated)
    if (typeof value === 'string') {
      const items = value.includes(',') ? value.split(',') : [value];
      for (const item of items) {
        const sanitized = sanitizeString(item, 50).toLowerCase();
        if (sanitized && validSet.has(sanitized)) {
          result.push(sanitized as T);
        }
        if (result.length >= maxItems) break;
      }
      return result;
    }
    
    // Handle array
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          const sanitized = sanitizeString(item, 50).toLowerCase();
          if (sanitized && validSet.has(sanitized)) {
            result.push(sanitized as T);
          }
        }
        if (result.length >= maxItems) break;
      }
      return result;
    }
  } catch {
    // Silent failure
  }
  
  return result;
}

/**
 * Parse tags from query param.
 * Tags can be comma-separated string or array.
 * Validates kebab-case pattern.
 */
function parseTags(value: unknown): string[] {
  const result: string[] = [];
  
  try {
    // Handle string (comma-separated)
    if (typeof value === 'string') {
      const items = value.split(',');
      for (const item of items) {
        const tag = normalizeTag(item);
        if (tag && !result.includes(tag)) {
          result.push(tag);
        }
        if (result.length >= MAX_TAGS) break;
      }
      return result;
    }
    
    // Handle array
    if (Array.isArray(value)) {
      for (const item of value) {
        const tag = normalizeTag(item);
        if (tag && !result.includes(tag)) {
          result.push(tag);
        }
        if (result.length >= MAX_TAGS) break;
      }
      return result;
    }
  } catch {
    // Silent failure
  }
  
  return result;
}

/**
 * Parse page number from query param.
 * Returns clamped value between 1 and MAX_PAGE.
 */
function parsePage(value: unknown): number {
  try {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        return Math.max(1, Math.min(parsed, MAX_PAGE));
      }
    }
    if (typeof value === 'number') {
      return Math.max(1, Math.min(Math.floor(value), MAX_PAGE));
    }
  } catch {
    // Silent failure
  }
  return 1;
}

/**
 * Parse sort option from query param.
 * Returns 'default' if invalid.
 */
function parseSort(value: unknown): SortOption {
  try {
    if (typeof value === 'string') {
      const sanitized = sanitizeString(value, 20).toLowerCase();
      if (VALID_SORT_OPTIONS.has(sanitized)) {
        return sanitized as SortOption;
      }
    }
  } catch {
    // Silent failure
  }
  return 'default';
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Default/empty filters.
 */
export const DEFAULT_FILTERS: FiltersNormalized = {
  q: '',
  kinds: [],
  tags: [],
  efforts: [],
  impacts: [],
  languages: [],
  sort: 'default',
  page: 1,
};

/**
 * Parse query params from route into normalized filters.
 * Zéro throw : any invalid input => fallback to defaults.
 * 
 * SECURITY: Direct key access only (no Object.keys iteration)
 * to prevent prototype pollution attacks.
 *
 * @param query - route.query (Record<string, unknown>)
 * @returns FiltersNormalized with safe, validated values
 */
export function parseResourcesDeepLink(
  query: Record<string, unknown> | undefined | null
): FiltersNormalized {
  // Start with defaults
  const result: FiltersNormalized = { ...DEFAULT_FILTERS };
  
  if (!query || typeof query !== 'object') {
    return result;
  }
  
  try {
    // SECURITY: Direct key access only — no Object.keys() iteration
    // This prevents prototype pollution from hostile query objects
    
    // q (search query)
    if ('q' in query) {
      result.q = sanitizeString(query['q'], MAX_QUERY_LENGTH);
    }
    
    // kind (resource type filter)
    if ('kind' in query) {
      result.kinds = parseArrayParam<ResourceKind>(query['kind'], VALID_KINDS, 4);
    }
    
    // tags (comma-separated or array)
    if ('tags' in query) {
      result.tags = parseTags(query['tags']);
    }
    
    // effort (effort level filter)
    if ('effort' in query) {
      result.efforts = parseArrayParam<EffortLevel>(query['effort'], VALID_EFFORTS, 3);
    }
    
    // impact (impact level filter)
    if ('impact' in query) {
      result.impacts = parseArrayParam<ImpactLevel>(query['impact'], VALID_IMPACTS, 3);
    }
    
    // language (language filter)
    if ('language' in query) {
      result.languages = parseArrayParam<ResourceLanguage>(query['language'], VALID_LANGUAGES, 2);
    }
    
    // sort (sort option)
    if ('sort' in query) {
      result.sort = parseSort(query['sort']);
    }
    
    // page (pagination)
    if ('page' in query) {
      result.page = parsePage(query['page']);
    }
  } catch {
    // Any error => return current result (partial parse is OK)
    // Dev feedback (no query exposure in prod)
    if (import.meta.dev) {
      console.debug('[resourcesDeepLink] dropped invalid query param');
    }
  }
  
  return result;
}

/**
 * Build a RouteLocationRaw for /ressources with given filters.
 * Only includes non-default values in query params.
 * Sanitizes all values before including in URL.
 *
 * @param input - partial filters to apply
 * @returns RouteLocationRaw safe to use with NuxtLink or router.push
 */
export function buildResourcesDeepLink(
  input: DeepLinkInput | undefined | null
): RouteLocationRaw {
  const query: Record<string, string | string[]> = {};
  
  if (!input || typeof input !== 'object') {
    return { path: '/ressources' };
  }
  
  try {
    // Search query
    const q = sanitizeString(input.q, MAX_QUERY_LENGTH);
    if (q) {
      query.q = q;
    }
    
    // Kinds (accept both 'kind' and 'kinds')
    const kinds = normalizeArrayInput<ResourceKind>(
      input.kinds ?? input.kind,
      VALID_KINDS as Set<string>,
      4
    );
    if (kinds.length > 0) {
      query.kind = kinds;
    }
    
    // Tags
    const tags = normalizeTagsInput(input.tags);
    if (tags.length > 0) {
      query.tags = tags.join(',');
    }
    
    // Efforts (accept both 'effort' and 'efforts')
    const efforts = normalizeArrayInput<EffortLevel>(
      input.efforts ?? input.effort,
      VALID_EFFORTS as Set<string>,
      3
    );
    if (efforts.length > 0) {
      query.effort = efforts;
    }
    
    // Impacts (accept both 'impact' and 'impacts')
    const impacts = normalizeArrayInput<ImpactLevel>(
      input.impacts ?? input.impact,
      VALID_IMPACTS as Set<string>,
      3
    );
    if (impacts.length > 0) {
      query.impact = impacts;
    }
    
    // Languages (accept both 'language' and 'languages')
    const languages = normalizeArrayInput<ResourceLanguage>(
      input.languages ?? input.language,
      VALID_LANGUAGES as Set<string>,
      2
    );
    if (languages.length > 0) {
      query.language = languages;
    }
    
    // Sort (only if not default)
    if (input.sort && VALID_SORT_OPTIONS.has(input.sort) && input.sort !== 'default') {
      query.sort = input.sort;
    }
    
    // Page (only if > 1)
    if (input.page && typeof input.page === 'number') {
      const page = Math.max(1, Math.min(Math.floor(input.page), MAX_PAGE));
      if (page > 1) {
        query.page = String(page);
      }
    }
  } catch {
    // Any error => return base route without query
    return { path: '/ressources' };
  }
  
  return {
    path: '/ressources',
    query: Object.keys(query).length > 0 ? query : undefined,
  };
}

/**
 * Helper to normalize array input for building deep links.
 */
function normalizeArrayInput<T extends string>(
  value: T | T[] | undefined,
  validSet: Set<string>,
  maxItems: number
): T[] {
  if (!value) return [];
  
  const items = Array.isArray(value) ? value : [value];
  const result: T[] = [];
  
  for (const item of items) {
    if (typeof item === 'string') {
      const sanitized = sanitizeString(item, 50).toLowerCase();
      if (sanitized && validSet.has(sanitized)) {
        result.push(sanitized as T);
      }
    }
    if (result.length >= maxItems) break;
  }
  
  return result;
}

/**
 * Helper to normalize tags input for building deep links.
 */
function normalizeTagsInput(value: string | string[] | undefined): string[] {
  if (!value) return [];
  
  const items = Array.isArray(value) ? value : [value];
  const result: string[] = [];
  
  for (const item of items) {
    const tag = normalizeTag(item);
    if (tag && !result.includes(tag)) {
      result.push(tag);
    }
    if (result.length >= MAX_TAGS) break;
  }
  
  return result;
}
