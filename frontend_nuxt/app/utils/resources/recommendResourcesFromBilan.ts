import type { GlobalBilanViewModel } from '~/types/bilan';
import { listResources } from '~/config/resources/registryV0';

export type ResourceRecommendation = { slug: string; reason: string };

export type RecoInput = Pick<GlobalBilanViewModel, 'panorama' | 'sections' | 'modules'>;

const RESOURCE_SLUGS = new Set(listResources().map((resource) => resource.slug));

const BASELINE_RECO: ResourceRecommendation[] = [
  {
    slug: 'checklist-securite-baseline',
    reason: 'Une base pour proteger les comptes et limiter les incidents courants.'
  },
  {
    slug: 'audit-communication-flux',
    reason: 'Utile pour clarifier les flux et eviter les incomprehensions.'
  }
];

const KEYWORDS = {
  communication: ['communication', 'coordination', 'decision', 'decisions', 'flux'],
  risk: ['risque', 'fragil', 'incident', 'securite'],
  clarity: ['clarte', 'position', 'message', 'mission'],
  visibility: ['visibilite', 'audience', 'seo', 'trafic', 'acquisition'],
  compliance: ['conformite', 'rgpd', 'accessibilite', 'juridique', 'confiance']
};

const normalizeText = (value: string): string =>
  value.normalize('NFKC').toLowerCase();

const matchesKeywords = (value: string, keywords: string[]): boolean =>
  keywords.some((keyword) => value.includes(keyword));

const addRecommendation = (
  items: ResourceRecommendation[],
  candidate: ResourceRecommendation
): void => {
  if (!RESOURCE_SLUGS.has(candidate.slug)) return;
  if (items.some((item) => item.slug === candidate.slug)) return;
  items.push(candidate);
};

export const recommendResourcesFromBilan = (
  input?: RecoInput | null
): ResourceRecommendation[] => {
  const recommendations: ResourceRecommendation[] = [];

  const axes = input?.panorama?.axes ?? [];
  const axesSorted = axes.slice().sort((a, b) => b.score - a.score);

  const risquesCount = input?.sections?.risques?.itemsCount ?? 0;
  const issuesCount = input?.modules?.issues?.list?.length ?? 0;
  const watchCount = input?.modules?.issues?.watchlist?.length ?? 0;

  if (risquesCount + issuesCount + watchCount > 0) {
    addRecommendation(recommendations, {
      slug: 'checklist-securite-baseline',
      reason: 'Des signaux de risque apparaissent, une base securite aide a stabiliser.'
    });
  }

  axesSorted.forEach((axis) => {
    if (axis.score < 4) return;
    const axisText = normalizeText(`${axis.id} ${axis.label}`);

    if (matchesKeywords(axisText, KEYWORDS.communication)) {
      addRecommendation(recommendations, {
        slug: 'audit-communication-flux',
        reason: 'Le bilan indique des frictions de coordination a clarifier.'
      });
    }

    if (matchesKeywords(axisText, KEYWORDS.risk)) {
      addRecommendation(recommendations, {
        slug: 'checklist-securite-baseline',
        reason: 'Le bilan met en avant des zones sensibles a securiser.'
      });
    }

    if (matchesKeywords(axisText, KEYWORDS.clarity)) {
      addRecommendation(recommendations, {
        slug: 'landing-structure-claire',
        reason: 'Clarifier le message aide a aligner l action et les priorites.'
      });
    }

    if (matchesKeywords(axisText, KEYWORDS.visibility)) {
      addRecommendation(recommendations, {
        slug: 'mini-plan-seo-local',
        reason: 'Un plan simple pour rendre l offre plus visible.'
      });
    }

    if (matchesKeywords(axisText, KEYWORDS.compliance)) {
      addRecommendation(recommendations, {
        slug: 'rgpd-accessibilite-starter',
        reason: 'Un socle conformite et accessibilite renforce la confiance.'
      });
    }
  });

  if (recommendations.length < 2) {
    BASELINE_RECO.forEach((item) => addRecommendation(recommendations, item));
  }

  return recommendations.slice(0, 3);
};
