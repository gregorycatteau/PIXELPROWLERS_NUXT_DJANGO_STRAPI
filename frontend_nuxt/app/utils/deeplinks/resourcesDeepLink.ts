/**
 * resourcesDeepLink.ts — Safe Deep Link Kit pour /ressources
 *
 * API canonique pour construire et parser les deep links vers /ressources.
 * Garanties securite P0 :
 * - Allowlist stricte des cles/valeurs query params
 * - Sanitization NFKC + strip zero-width + trim + clamp
 * - Zero throw : payload hostile => fallback neutre
 * - Pas de logs sur query brutes
 */

import type { RouteLocationRaw } from '#vue-router';
import type { ResourceCategory } from '@/data/resourcesData';

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_QUERY_LENGTH = 120;
const MAX_LIMIT = 50;
const MAX_OFFSET = 5000;
const MAX_QUERYSTRING_LENGTH = 800;

const VALID_CATEGORIES = new Set<string>([
  'diagnostic',
  'securite',
  'ux',
  'gouvernance',
  'outillage',
]);

const ALLOWLIST_KEYS = new Set(['q', 'category', 'limit', 'offset']);
const FORBIDDEN_PARAM_PREFIXES = ['utm_'];
const FORBIDDEN_PARAM_KEYS = [
  'gclid',
  'fbclid',
  'ref',
  'source',
  'campaign',
  'debug',
];

const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\u2060\uFEFF]/g;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

// =============================================================================
// TYPES
// =============================================================================

export interface FiltersNormalized {
  q?: string;
  category?: ResourceCategory;
  limit: number;
  offset: number;
}

export interface DeepLinkInput {
  q?: string;
  category?: ResourceCategory;
  limit?: number;
  offset?: number;
}

export type DeepLinkCanonicalizationReason =
  | 'array_param'
  | 'forbidden_param'
  | 'mismatch'
  | 'too_long'
  | 'unknown_param';

export interface DeepLinkCanonicalizationResult {
  filters: FiltersNormalized;
  canonicalRoute: RouteLocationRaw;
  shouldReplace: boolean;
  reasonCodes: DeepLinkCanonicalizationReason[];
}

// =============================================================================
// SANITIZATION HELPERS
// =============================================================================

function sanitizeString(value: unknown, maxLength: number = MAX_QUERY_LENGTH): string {
  if (typeof value !== 'string') return '';

  try {
    let result = value.normalize('NFKC');
    result = result.replace(CONTROL_CHARS, '');
    result = result.replace(ZERO_WIDTH_CHARS, '');
    result = result.trim();
    if (result.length > maxLength) {
      result = result.slice(0, maxLength);
    }
    return result;
  } catch {
    return '';
  }
}

function normalizeQuery(value: unknown): string | undefined {
  const sanitized = sanitizeString(value, MAX_QUERY_LENGTH);
  return sanitized.length > 0 ? sanitized : undefined;
}

function normalizeCategory(value: unknown): ResourceCategory | undefined {
  if (typeof value !== 'string') return undefined;
  const sanitized = sanitizeString(value, 50).toLowerCase();
  return VALID_CATEGORIES.has(sanitized)
    ? (sanitized as ResourceCategory)
    : undefined;
}

function normalizeLimit(value: unknown, fallback: number): number {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      return Math.max(1, Math.min(parsed, MAX_LIMIT));
    }
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(1, Math.min(Math.floor(value), MAX_LIMIT));
  }
  return fallback;
}

function normalizeOffset(value: unknown): number {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      return Math.max(0, Math.min(parsed, MAX_OFFSET));
    }
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(Math.floor(value), MAX_OFFSET));
  }
  return 0;
}

function normalizeQueryValue(value: unknown): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'string') {
    return value[0];
  }
  return null;
}

function extractQueryStringLength(fullPath?: string): number {
  if (!fullPath) return 0;
  const queryStart = fullPath.indexOf('?');
  if (queryStart === -1) return 0;
  return fullPath.slice(queryStart).length;
}

function shallowEqualQuery(
  left: Record<string, string>,
  right: Record<string, string>
): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    if (left[key] !== right[key]) return false;
  }
  return true;
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const DEFAULT_FILTERS: FiltersNormalized = {
  q: undefined,
  category: undefined,
  limit: 12,
  offset: 0,
};

export function parseResourcesDeepLink(
  query: Record<string, unknown> | undefined | null
): FiltersNormalized {
  const result: FiltersNormalized = { ...DEFAULT_FILTERS };

  if (!query || typeof query !== 'object') {
    return result;
  }

  try {
    result.q = 'q' in query ? normalizeQuery(query['q']) : result.q;
    result.category = 'category' in query
      ? normalizeCategory(query['category'])
      : result.category;
    result.limit = 'limit' in query
      ? normalizeLimit(query['limit'], result.limit)
      : result.limit;
    result.offset = 'offset' in query
      ? normalizeOffset(query['offset'])
      : result.offset;
  } catch {
    if (import.meta.dev) {
      console.debug('[resourcesDeepLink] dropped invalid query param');
    }
  }

  return result;
}

export function buildResourcesDeepLink(
  input: DeepLinkInput | undefined | null
): RouteLocationRaw {
  const query: Record<string, string> = {};

  if (!input || typeof input !== 'object') {
    return { path: '/ressources' };
  }

  try {
    const q = normalizeQuery(input.q);
    if (q) {
      query.q = q;
    }

    const category = normalizeCategory(input.category);
    if (category) {
      query.category = category;
    }

    if ('limit' in input) {
      const limit = normalizeLimit(input.limit, DEFAULT_FILTERS.limit);
      if (limit !== DEFAULT_FILTERS.limit) {
        query.limit = String(limit);
      }
    }

    if ('offset' in input) {
      const offset = normalizeOffset(input.offset);
      if (offset > 0) {
        query.offset = String(offset);
      }
    }
  } catch {
    return { path: '/ressources' };
  }

  return {
    path: '/ressources',
    query: Object.keys(query).length > 0 ? query : undefined,
  };
}

export function parseResourcesDeepLinkWithMeta(
  query: Record<string, unknown> | undefined | null,
  fullPath?: string
): DeepLinkCanonicalizationResult {
  const filters = parseResourcesDeepLink(query);
  const canonicalRoute = buildResourcesDeepLink({
    q: filters.q,
    category: filters.category || undefined,
    limit: filters.limit,
    offset: filters.offset,
  });
  const canonicalQuery = typeof canonicalRoute === 'string'
    ? {}
    : (canonicalRoute.query ?? {});

  const reasonSet = new Set<DeepLinkCanonicalizationReason>();

  if (extractQueryStringLength(fullPath) > MAX_QUERYSTRING_LENGTH) {
    reasonSet.add('too_long');
  }

  if (query && typeof query === 'object') {
    const keys = Object.keys(query);
    for (const key of keys) {
      const keyLower = key.toLowerCase();
      for (const prefix of FORBIDDEN_PARAM_PREFIXES) {
        if (keyLower.startsWith(prefix)) {
          reasonSet.add('forbidden_param');
        }
      }
      if (FORBIDDEN_PARAM_KEYS.includes(keyLower)) {
        reasonSet.add('forbidden_param');
      }
      if (!ALLOWLIST_KEYS.has(key)) {
        reasonSet.add('unknown_param');
      }
      if (Array.isArray(query[key])) {
        reasonSet.add('array_param');
      }
    }
  }

  const normalizedCurrentQuery: Record<string, string> = {};
  if (query && typeof query === 'object') {
    for (const key of Object.keys(query)) {
      if (!ALLOWLIST_KEYS.has(key)) continue;
      const normalizedValue = normalizeQueryValue(query[key]);
      if (normalizedValue !== null) {
        normalizedCurrentQuery[key] = normalizedValue;
      }
    }
  }

  const normalizedCanonicalQuery: Record<string, string> = {};
  for (const key of Object.keys(canonicalQuery)) {
    const value = canonicalQuery[key];
    if (typeof value === 'string') {
      normalizedCanonicalQuery[key] = value;
    }
  }

  if (!shallowEqualQuery(normalizedCurrentQuery, normalizedCanonicalQuery)) {
    reasonSet.add('mismatch');
  }

  const reasonCodes = Array.from(reasonSet);

  return {
    filters,
    canonicalRoute,
    shouldReplace: reasonCodes.length > 0,
    reasonCodes,
  };
}
