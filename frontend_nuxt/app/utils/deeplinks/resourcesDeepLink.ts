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
const MAX_OFFSET = 1000;

const VALID_CATEGORIES = new Set<string>([
  'diagnostic',
  'securite',
  'ux',
  'gouvernance',
  'outillage',
]);

const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\u2060\uFEFF]/g;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

// =============================================================================
// TYPES
// =============================================================================

export interface FiltersNormalized {
  q: string;
  category: ResourceCategory | '';
  limit: number;
  offset: number;
}

export interface DeepLinkInput {
  q?: string;
  category?: ResourceCategory;
  limit?: number;
  offset?: number;
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

function parseAllowlistValue<T extends string>(
  value: unknown,
  validSet: Set<string>
): T | '' {
  if (typeof value !== 'string') return '';
  const sanitized = sanitizeString(value, 50).toLowerCase();
  if (sanitized && validSet.has(sanitized)) {
    return sanitized as T;
  }
  return '';
}

function parseLimit(value: unknown, fallback: number): number {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      return Math.max(1, Math.min(parsed, MAX_LIMIT));
    }
  }
  if (typeof value === 'number') {
    return Math.max(1, Math.min(Math.floor(value), MAX_LIMIT));
  }
  return fallback;
}

function parseOffset(value: unknown): number {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      return Math.max(0, Math.min(parsed, MAX_OFFSET));
    }
  }
  if (typeof value === 'number') {
    return Math.max(0, Math.min(Math.floor(value), MAX_OFFSET));
  }
  return 0;
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const DEFAULT_FILTERS: FiltersNormalized = {
  q: '',
  category: '',
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
    if ('q' in query) {
      result.q = sanitizeString(query['q'], MAX_QUERY_LENGTH);
    }
    if ('category' in query) {
      result.category = parseAllowlistValue<ResourceCategory>(
        query['category'],
        VALID_CATEGORIES
      );
    }
    if ('limit' in query) {
      result.limit = parseLimit(query['limit'], result.limit);
    }
    if ('offset' in query) {
      result.offset = parseOffset(query['offset']);
    }
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
    const q = sanitizeString(input.q, MAX_QUERY_LENGTH);
    if (q) {
      query.q = q;
    }

    if (input.category && VALID_CATEGORIES.has(input.category)) {
      query.category = input.category;
    }

    if (typeof input.limit === 'number') {
      const limit = Math.max(1, Math.min(Math.floor(input.limit), MAX_LIMIT));
      if (limit !== DEFAULT_FILTERS.limit) {
        query.limit = String(limit);
      }
    }

    if (typeof input.offset === 'number') {
      const offset = Math.max(0, Math.min(Math.floor(input.offset), MAX_OFFSET));
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
