#!/usr/bin/env tsx
/**
 * Guard RES-DL-CLAMP-R1 — Resources DeepLink clamp/validation
 */

import {
  buildResourcesDeepLink,
  parseResourcesDeepLink,
  DEFAULT_FILTERS,
} from '../../app/utils/deeplinks/resourcesDeepLink';
import type { RouteLocationRaw } from '#vue-router';
import type { ResourceCategory } from '../../app/data/resourcesData';

const errors: string[] = [];

const toQuery = (route: RouteLocationRaw): Record<string, string> => {
  if (!route || typeof route !== 'object') return {};
  const query = (route as { query?: Record<string, unknown> }).query;
  if (!query || typeof query !== 'object') return {};
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      if (value[0] != null) result[key] = String(value[0]);
    } else if (value != null) {
      result[key] = String(value);
    }
  }
  return result;
};

const assert = (condition: boolean, message: string) => {
  if (!condition) errors.push(`❌ ${message}`);
};

const longQuery = 'a'.repeat(500);

const clampRoute = buildResourcesDeepLink({
  limit: 999999,
  offset: 999999999,
  q: longQuery,
});
const clampQuery = toQuery(clampRoute);
assert(Number(clampQuery.limit) <= 50, 'limit should clamp to <= 50 (build)');
assert(Number(clampQuery.offset) <= 5000, 'offset should clamp to <= 5000 (build)');
assert((clampQuery.q ?? '').length <= 120, 'q should clamp to <= 120 chars (build)');

const invalidCategoryRoute = buildResourcesDeepLink({
  category: 'lolnope' as ResourceCategory,
});
const invalidCategoryQuery = toQuery(invalidCategoryRoute);
assert(!('category' in invalidCategoryQuery), 'invalid category should be ignored (build)');

const defaultsParsed = parseResourcesDeepLink({});
assert(defaultsParsed.limit === DEFAULT_FILTERS.limit, 'default limit should be preserved');
assert(defaultsParsed.offset === DEFAULT_FILTERS.offset, 'default offset should be preserved');
assert(defaultsParsed.q === undefined, 'default q should be undefined');
assert(defaultsParsed.category === undefined, 'default category should be undefined');

const parsed = parseResourcesDeepLink({
  limit: '999999',
  offset: '999999999',
  q: longQuery,
  category: 'lolnope',
});
assert(parsed.limit <= 50, 'limit should clamp to <= 50 (parse)');
assert(parsed.offset <= 5000, 'offset should clamp to <= 5000 (parse)');
assert((parsed.q ?? '').length <= 120, 'q should clamp to <= 120 chars (parse)');
assert(parsed.category === undefined, 'invalid category should be undefined (parse)');

console.log('🔍 RES-DL-CLAMP-R1 Guard — Resources DeepLink clamp\n');
if (errors.length) {
  errors.forEach((err) => console.log(err));
  console.log('\n🛑 Guard RES-DL-CLAMP-R1 FAILED');
  process.exit(1);
}

console.log('✅ Guard RES-DL-CLAMP-R1 PASSED');
process.exit(0);
