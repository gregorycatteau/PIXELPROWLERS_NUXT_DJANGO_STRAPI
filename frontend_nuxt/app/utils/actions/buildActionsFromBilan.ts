import type { GlobalBilanViewModel } from '@/types/bilan';
import type { JourneyManifestV1 } from '@/config/journeys/manifests/types';
import type { RecommendationItem, RecommendationResult } from '@/utils/reco/types';
import type { ActionItem } from '@/types/actions';
import { buildResourcesDeepLink } from '@/utils/deeplinks/resourcesDeepLink';
import type {
  ResourceCategory,
  ResourceJourney,
  ResourceLevel,
  ResourceType,
} from '@/data/resourcesData';

const MAX_TAGS = 5;
const MAX_LIMIT = 50;
const MAX_OFFSET = 1000;
const DEFAULT_LIMIT = 12;

const VALID_TYPES = new Set<ResourceType>(['tool', 'read', 'checklist']);
const VALID_CATEGORIES = new Set<ResourceCategory>(['tool', 'guide', 'checklist']);
const VALID_LEVELS = new Set<ResourceLevel>(['intro', 'intermediate']);
const VALID_JOURNEYS = new Set<ResourceJourney>(['p1']);

const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\u2060\uFEFF]/g;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const TAG_PATTERN = /^[a-z0-9-]+$/;

export type BuildActionsFromBilanInput = {
  vm: GlobalBilanViewModel;
  recommendations: RecommendationResult;
  manifest: JourneyManifestV1 | null;
};

export function buildActionsFromBilan(
  input: BuildActionsFromBilanInput
): ActionItem[] {
  const actions: ActionItem[] = [];
  if (!input) return actions;

  const { recommendations, manifest } = input;
  const recommended = recommendations?.recommended ?? [];
  const library = recommendations?.library ?? [];

  const journey = allowlistJourney(manifest?.id);
  const recommendedTags = pickTags(recommended);
  const libraryTags = pickTags(library);

  const recommendedCount = recommended.length;
  const libraryCount = library.length;

  if (recommendedCount > 0 && recommendedTags.length > 0) {
    actions.push({
      id: `actions-reco-${journey ?? 'all'}`,
      title: 'Explorer les recommandations',
      summary: `Acces direct a ${recommendedCount} ressources/action(s) prioritaires.`,
      kind: 'resource_filters',
      ctaLabel: 'Explorer',
      to: buildResourcesDeepLink({
        tags: recommendedTags,
        journey: journey ?? undefined,
        limit: clampLimit(DEFAULT_LIMIT),
        offset: clampOffset(0),
      }),
    });
  }

  if (libraryCount > 0 || actions.length === 0) {
    actions.push({
      id: `actions-library-${journey ?? 'all'}`,
      title: 'Explorer la bibliotheque',
      summary:
        libraryCount > 0
          ? `Acces a ${libraryCount} ressources/action(s) disponibles.`
          : 'Acces a la bibliotheque complete de ressources.',
      kind: 'resource_filters',
      ctaLabel: 'Voir tout',
      to: buildResourcesDeepLink({
        tags: libraryTags,
        journey: journey ?? undefined,
        limit: clampLimit(DEFAULT_LIMIT),
        offset: clampOffset(0),
      }),
    });
  }

  return actions;
}

function sanitizeString(value: unknown, maxLength = 120): string {
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

function normalizeTag(value: unknown): string | null {
  const sanitized = sanitizeString(value, 50).toLowerCase();
  if (!sanitized || !TAG_PATTERN.test(sanitized)) {
    return null;
  }
  return sanitized;
}

function pickTags(items: RecommendationItem[]): string[] {
  const tags: string[] = [];
  items.forEach((item) => {
    (item.tags ?? []).forEach((tag) => {
      const normalized = normalizeTag(tag);
      if (normalized && !tags.includes(normalized)) {
        tags.push(normalized);
      }
    });
  });
  return tags.slice(0, MAX_TAGS);
}

function allowlistCategory(value: unknown): ResourceCategory | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = sanitizeString(value, 50).toLowerCase();
  return VALID_CATEGORIES.has(normalized as ResourceCategory)
    ? (normalized as ResourceCategory)
    : undefined;
}

function allowlistLevel(value: unknown): ResourceLevel | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = sanitizeString(value, 50).toLowerCase();
  return VALID_LEVELS.has(normalized as ResourceLevel)
    ? (normalized as ResourceLevel)
    : undefined;
}

function allowlistJourney(value: unknown): ResourceJourney | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = sanitizeString(value, 50).toLowerCase();
  return VALID_JOURNEYS.has(normalized as ResourceJourney)
    ? (normalized as ResourceJourney)
    : undefined;
}

function allowlistType(value: unknown): ResourceType | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = sanitizeString(value, 50).toLowerCase();
  return VALID_TYPES.has(normalized as ResourceType)
    ? (normalized as ResourceType)
    : undefined;
}

function clampLimit(value: number): number {
  return Math.max(1, Math.min(Math.floor(value), MAX_LIMIT));
}

function clampOffset(value: number): number {
  return Math.max(0, Math.min(Math.floor(value), MAX_OFFSET));
}

// Exported for future callers that may compose deeper filters safely.
export const actionsFiltersAllowlist = {
  allowlistCategory,
  allowlistLevel,
  allowlistJourney,
  allowlistType,
  clampLimit,
  clampOffset,
};
