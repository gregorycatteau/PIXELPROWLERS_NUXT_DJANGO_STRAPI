import type { GlobalBilanViewModel } from '~/types/bilan';
import { listResources } from '~/config/resources/registryV0';
import { P1_PACK_V1_SLUGS } from '~/config/resources/packs/p1PackV1';

export type ResourceRecommendation = { slug: string; reason: string };

export type RecoInput = Pick<GlobalBilanViewModel, 'panorama' | 'sections' | 'modules'> & {
  journeyId?: string;
};

const ALL_RESOURCES = listResources();
const RESOURCE_SLUGS = new Set(ALL_RESOURCES.map((resource) => resource.slug));
const PACK_SLUGS = new Set<string>(P1_PACK_V1_SLUGS);

const KEYWORDS = {
  governance: ['gouvernance', 'pilotage', 'decision', 'decisions', 'priorite', 'cap'],
  communication: ['communication', 'coordination', 'flux', 'canal', 'message'],
  security: ['securite', 'risque', 'incident', 'acces', 'backup', 'sauvegarde']
};

const normalizeText = (value: string): string =>
  value.normalize('NFKC').toLowerCase();

const matchesKeywords = (value: string, keywords: string[]): boolean =>
  keywords.some((keyword) => value.includes(keyword));

const normalizeScore = (score: number): number =>
  score > 5 ? score / 20 : score;

const addRecommendation = (
  items: ResourceRecommendation[],
  candidate: ResourceRecommendation,
  allowedSlugs: Set<string>
): void => {
  if (!allowedSlugs.has(candidate.slug)) return;
  if (!PACK_SLUGS.has(candidate.slug)) return;
  if (items.some((item) => item.slug === candidate.slug)) return;
  if (items.length >= 3) return;
  items.push(candidate);
};

const resolveAllowedSlugs = (journeyId?: string): Set<string> => {
  if (!journeyId) return RESOURCE_SLUGS;
  const matched = ALL_RESOURCES.filter((resource) => resource.relatedJourneys?.includes(journeyId));
  return new Set(matched.map((resource) => resource.slug));
};

export const recommendResourcesFromBilan = (
  input?: RecoInput | null
): ResourceRecommendation[] => {
  const recommendations: ResourceRecommendation[] = [];
  const allowedSlugs = resolveAllowedSlugs(input?.journeyId);

  const axes = input?.panorama?.axes ?? [];
  const axesSorted = axes
    .slice()
    .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id));

  axesSorted.forEach((axis) => {
    const score = normalizeScore(axis.score ?? 0);
    if (score < 4) return;
    const axisText = normalizeText(`${axis.id} ${axis.label}`);

    if (matchesKeywords(axisText, KEYWORDS.governance)) {
      const slug = axisText.includes('decision') || axisText.includes('decisions')
        ? 'decision-log-minimal'
        : 'reunion-30min-sans-noyade';
      addRecommendation(recommendations, {
        slug,
        reason: 'Besoin de gouvernance simple et de decisions tracees.'
      }, allowedSlugs);
    }

    if (matchesKeywords(axisText, KEYWORDS.communication)) {
      addRecommendation(recommendations, {
        slug: 'rituel-hebdo-15min',
        reason: 'Le bilan indique des frictions de coordination a traiter.'
      }, allowedSlugs);
    }

    if (matchesKeywords(axisText, KEYWORDS.security)) {
      addRecommendation(recommendations, {
        slug: 'inventaire-acces-30min',
        reason: 'Le bilan met en avant des sujets de securite a stabiliser.'
      }, allowedSlugs);
    }
  });

  if (recommendations.length === 0 && input?.journeyId === 'p2') {
    addRecommendation(recommendations, {
      slug: 'reunion-30min-sans-noyade',
      reason: 'Une action courte pour fixer des priorites claires.'
    }, allowedSlugs);
    addRecommendation(recommendations, {
      slug: 'decision-log-minimal',
      reason: 'Clarifier les decisions pour reduire les retours en arriere.'
    }, allowedSlugs);
    addRecommendation(recommendations, {
      slug: 'charte-canaux-3-couleurs',
      reason: 'Stabiliser la coordination et le flux des demandes.'
    }, allowedSlugs);
  }

  return recommendations;
};
