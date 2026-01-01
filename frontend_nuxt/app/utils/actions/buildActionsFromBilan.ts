import type { GlobalBilanViewModel } from '@/types/bilan';
import type { JourneyManifestV1 } from '@/config/journeys/manifests/types';
import type { RecommendationResult } from '@/utils/reco/types';
import type { ActionItem } from '@/types/actions';
import { buildResourcesDeepLink } from '@/utils/deeplinks/resourcesDeepLink';
import type { ResourceCategory } from '@/data/resourcesData';

const MAX_LIMIT = 50;
const MAX_OFFSET = 1000;
const DEFAULT_LIMIT = 12;

const VALID_CATEGORIES = new Set<ResourceCategory>([
  'diagnostic',
  'securite',
  'ux',
  'gouvernance',
  'outillage',
]);

const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\u2060\uFEFF]/g;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

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

  const { recommendations } = input;
  const recommended = recommendations?.recommended ?? [];
  const library = recommendations?.library ?? [];

  const recommendedCount = recommended.length;
  const libraryCount = library.length;

  if (recommendedCount > 0) {
    actions.push({
      id: 'actions-reco',
      title: 'Explorer les recommandations',
      summary: `Acces direct a ${recommendedCount} ressources/action(s) prioritaires.`,
      kind: 'resource_filters',
      ctaLabel: 'Explorer',
      to: buildResourcesDeepLink({
        page: 1,
      }),
    });
  }

  if (libraryCount > 0 || actions.length === 0) {
    actions.push({
      id: 'actions-library',
      title: 'Explorer la bibliotheque',
      summary:
        libraryCount > 0
          ? `Acces a ${libraryCount} ressources/action(s) disponibles.`
          : 'Acces a la bibliotheque complete de ressources.',
      kind: 'resource_filters',
      ctaLabel: 'Voir tout',
      to: buildResourcesDeepLink({
        page: 1,
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

function allowlistCategory(value: unknown): ResourceCategory | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = sanitizeString(value, 50).toLowerCase();
  return VALID_CATEGORIES.has(normalized as ResourceCategory)
    ? (normalized as ResourceCategory)
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
  clampLimit,
  clampOffset,
};
