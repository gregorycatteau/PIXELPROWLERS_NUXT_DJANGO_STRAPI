import { RESOURCE_REGISTRY_V0 } from './registryV0.data.mjs';

export type ResourceCategory =
  | 'diagnostic'
  | 'securite'
  | 'ux'
  | 'gouvernance'
  | 'outillage';

export type ResourceLevel = 'intro' | 'intermediate' | 'advanced';

export type ResourceEffort = 'low' | 'medium' | 'high';

export type ResourceStatus = 'draft' | 'published';

export type ResourceV0 = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  outcome?: string;
  category: ResourceCategory;
  level: ResourceLevel;
  effort: ResourceEffort;
  status: ResourceStatus;
  updatedAt: string;
  relatedJourneys: string[];
  relatedResourceSlugs: string[];
  contentBlocks?: Array<{
    title: string;
    bullets: string[];
    kind?: 'action' | 'guide' | 'checklist' | 'context' | 'warning';
  }>;
};

const RESOURCES_V0: ResourceV0[] = RESOURCE_REGISTRY_V0 as ResourceV0[];

export const listResources = (): ResourceV0[] => RESOURCES_V0.slice();

export const getResourceBySlug = (slug: string): ResourceV0 | null =>
  RESOURCES_V0.find((resource) => resource.slug === slug) ?? null;
