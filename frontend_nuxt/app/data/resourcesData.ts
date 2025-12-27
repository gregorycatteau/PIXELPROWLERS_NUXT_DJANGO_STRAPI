/**
 * resourcesData.ts — Types + helpers for resources library (API-backed)
 *
 * Doctrine:
 * - No remote assets in the UI
 * - No HTML injection
 * - Safe, allowlisted filters only
 */

// =============================================================================
// TYPES
// =============================================================================

export type ResourceType = 'tool' | 'read' | 'checklist';
export type ResourceCategory = 'tool' | 'guide' | 'checklist';
export type ResourceLevel = 'intro' | 'intermediate';
export type ResourceJourney = 'p1';

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  category: ResourceCategory;
  level: ResourceLevel;
  journey: ResourceJourney;
  type: ResourceType;
  path: string;
}

export interface ResourcesResponse {
  resources: ResourceItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface FilterOptions {
  tags: string[];
  categories: ResourceCategory[];
  levels: ResourceLevel[];
  journeys: ResourceJourney[];
  types: ResourceType[];
}

// =============================================================================
// LABELS
// =============================================================================

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  tool: 'Outil',
  read: 'Lecture',
  checklist: 'Checklist',
};

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  tool: 'Outil',
  guide: 'Guide',
  checklist: 'Checklist',
};

export const RESOURCE_LEVEL_LABELS: Record<ResourceLevel, string> = {
  intro: 'Intro',
  intermediate: 'Intermediaire',
};

export const RESOURCE_JOURNEY_LABELS: Record<ResourceJourney, string> = {
  p1: 'P1',
};

// =============================================================================
// HELPERS
// =============================================================================

export function buildFilterOptions(resources: ResourceItem[]): FilterOptions {
  const tags = new Set<string>();
  const categories = new Set<ResourceCategory>();
  const levels = new Set<ResourceLevel>();
  const journeys = new Set<ResourceJourney>();
  const types = new Set<ResourceType>();

  for (const resource of resources) {
    resource.tags.forEach((tag) => tags.add(tag));
    categories.add(resource.category);
    levels.add(resource.level);
    journeys.add(resource.journey);
    types.add(resource.type);
  }

  return {
    tags: Array.from(tags).sort(),
    categories: Array.from(categories),
    levels: Array.from(levels),
    journeys: Array.from(journeys),
    types: Array.from(types),
  };
}
