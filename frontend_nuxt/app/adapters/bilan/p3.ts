import type { JourneyBilanAdapter } from './types';
import { createEmptyUniversalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import type { ResourcesActionsItemVM } from '@/types/bilan';
import { listResources } from '@/config/resources/registryV0';
import { useCoreJourneyStorage } from '@/composables/useCoreJourneyStorage';
import { P3_PANORAMA_AXIS_ORDER, p3PanoramaAxesMeta } from '@/config/journeys/p3QuestionsV1_0';

const P3_ACTION_SLUGS = [
  'reunion-30min-sans-noyade',
  'decision-log-minimal',
  'rituel-hebdo-15min',
  'matrice-responsabilites-raci-lite'
];

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const scoreToPercent = (score: number) => clampScore((score / 5) * 100);

const buildActionCards = (): ResourcesActionsItemVM[] => {
  const resources = listResources();
  const bySlug = new Map(resources.map((resource) => [resource.slug, resource]));

  return P3_ACTION_SLUGS.flatMap((slug) => {
    const resource = bySlug.get(slug);
    if (!resource) return [];
    if (!resource.relatedJourneys?.includes('p3')) return [];
    const outcome = resource.outcome ? `Outcome: ${resource.outcome}` : 'Outcome: a clarifier.';
    const effort = `Effort: ${resource.effort}`;
    return [{
      id: `p3_action_${slug}`,
      kind: 'action',
      title: resource.title,
      description: `${resource.summary} ${outcome} ${effort}`,
      tags: [resource.category, 'priorites'],
      format: resource.level,
      cta: {
        type: 'route',
        label: 'Voir',
        target: `/ressources/${resource.slug}`
      },
      reason: 'Action immediate et locale.'
    }];
  });
};

export const p3BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p3',
  buildViewModel() {
    const storage = useCoreJourneyStorage({ journeyId: 'p3' });
    storage.loadFromStorage();
    const panorama = storage.scores.value?.panorama ?? null;

    const axes = P3_PANORAMA_AXIS_ORDER.map((axisId) => {
      const axisMeta = p3PanoramaAxesMeta[axisId];
      const storedAxis = panorama?.byAxis?.[axisId];
      const score = scoreToPercent(storedAxis?.score ?? 0);
      return {
        id: axisId,
        label: axisMeta.label,
        score
      };
    });

    const priorities = axes
      .slice()
      .sort((a, b) => (b.score - a.score) || a.label.localeCompare(b.label))
      .slice(0, 2);
    const globalScore = clampScore(
      axes.reduce((acc, axis) => acc + axis.score, 0) / Math.max(axes.length, 1)
    );

    const actionCards = buildActionCards();
    const actionTags = Array.from(new Set(actionCards.flatMap((item) => item.tags ?? [])));
    const priorityLabels = priorities.map((axis) => axis.label).join(', ');

    const vm = createEmptyUniversalBilanViewModel({
      copy: { title: 'Bilan P3', subtitle: 'Synthese locale.' },
      axisSummaryLabel: 'Scores panorama (0-100)',
      completedBlocksLabel: 'Aucun bloc',
      panoramaAnsweredLabel: 'Reponses panorama',
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama' },
        { id: 'gb_export', label: 'Export' }
      ],
      panorama: {
        answeredCount: panorama?.answeredCount ?? 0,
        skippedCount: panorama?.skippedCount ?? 0,
        completenessLabel: `Score global: ${globalScore}/100`,
        axes,
        blocks: [],
        completedLabel: 'Panorama'
      },
      sections: {
        reperes: {
          id: 'reperes',
          title: 'Reperes',
          summary: `Score global: ${globalScore}/100.`,
          state: 'full',
          itemsCount: axes.length
        },
        risques: {
          id: 'risques',
          title: 'Priorites',
          summary: priorityLabels ? `Priorites: ${priorityLabels}.` : 'Priorites disponibles.',
          state: 'full',
          itemsCount: priorities.length
        },
        recommandations: {
          id: 'recommandations',
          title: 'Actions immediates',
          summary: 'Actions concretes pour stabiliser le quotidien.',
          state: 'full',
          itemsCount: actionCards.length
        },
        actions: {
          id: 'actions',
          title: 'Cartes action',
          summary: 'Cartes prêtes a activer en autonomie.',
          state: 'full',
          itemsCount: actionCards.length
        }
      },
      modules: {
        resourcesActions: {
          recommended: actionCards,
          library: [],
          tags: actionTags
        }
      },
      meta: { isEmpty: false, partial: false, maturity: 'core' }
    });
    assertNoRawAnswers(vm);
    return vm;
  }
};
