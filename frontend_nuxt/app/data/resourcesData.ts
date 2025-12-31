/**
 * resourcesData.ts — Types + helpers for resources library (Registry V0)
 *
 * Doctrine:
 * - No remote assets in the UI
 * - No HTML injection
 * - Safe, allowlisted filters only
 */

// =============================================================================
// TYPES
// =============================================================================

import type {
  ResourceCategory,
  ResourceLevel,
  ResourceEffort,
  ResourceV0,
} from '@/config/resources/registryV0';

export type { ResourceCategory, ResourceLevel, ResourceEffort, ResourceV0 };

export type ResourceItem = ResourceV0;

export interface FilterOptions {
  categories: ResourceCategory[];
}

// =============================================================================
// LABELS
// =============================================================================

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  diagnostic: 'Diagnostic',
  securite: 'Securite',
  ux: 'UX',
  gouvernance: 'Gouvernance',
  outillage: 'Outillage',
};

export const RESOURCE_LEVEL_LABELS: Record<ResourceLevel, string> = {
  intro: 'Intro',
  intermediate: 'Intermediaire',
  advanced: 'Avance',
};

export const RESOURCE_EFFORT_LABELS: Record<ResourceEffort, string> = {
  low: 'Effort faible',
  medium: 'Effort moyen',
  high: 'Effort eleve',
};

// =============================================================================
// HELPERS
// =============================================================================

export function buildFilterOptions(resources: ResourceItem[]): FilterOptions {
  const categories = new Set<ResourceCategory>();

  for (const resource of resources) {
    categories.add(resource.category);
  }

  return {
    categories: Array.from(categories),
  };
}
