import type { JourneyBilanAdapter } from './types';
import { createEmptyUniversalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import type { ResourcesActionsItemVM } from '@/types/bilan';
import { listResources } from '@/config/resources/registryV0';
import { useCoreJourneyStorage } from '@/composables/useCoreJourneyStorage';
import { P2_PANORAMA_AXIS_ORDER, p2PanoramaAxesMeta } from '@/config/journeys/p2QuestionsV1_0';

const P2_ACTION_SLUGS = [
  'reunion-30min-sans-noyade',
  'decision-log-minimal',
  'charte-canaux-3-couleurs'
];

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const scoreToPercent = (score: number) => clampScore((score / 5) * 100);

const buildResourcesActions = (): ResourcesActionsItemVM[] => {
  const resources = listResources();
  const bySlug = new Map(resources.map((resource) => [resource.slug, resource]));

  return P2_ACTION_SLUGS.flatMap((slug) => {
    const resource = bySlug.get(slug);
    if (!resource) return [];
    return [{
      id: `p2_action_${slug}`,
      kind: 'action',
      title: resource.title,
      description: resource.summary,
      tags: [resource.category, 'priorites'],
      format: resource.level,
      cta: {
        type: 'route',
        label: 'Voir',
        target: `/ressources/${resource.slug}`
      },
      reason: 'Action immediatement activable.'
    }];
  });
};

export const p2BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p2',
  buildViewModel() {
    const storage = useCoreJourneyStorage({ journeyId: 'p2' });
    storage.loadFromStorage();
    const panorama = storage.scores.value?.panorama ?? null;

    const axes = P2_PANORAMA_AXIS_ORDER.map((axisId) => {
      const axisMeta = p2PanoramaAxesMeta[axisId];
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
      .slice(0, 3);

    const resourcesActions = buildResourcesActions();
    const resourcesTags = Array.from(new Set(resourcesActions.flatMap((item) => item.tags ?? [])));

    const priorityLabels = priorities.map((axis) => axis.label).join(', ');
    const vm = createEmptyUniversalBilanViewModel({
      copy: { title: 'Bilan P2', subtitle: 'Synthese locale.' },
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
        completenessLabel: 'Panorama synthese',
        axes,
        blocks: [],
        completedLabel: 'Panorama'
      },
      sections: {
        reperes: {
          id: 'reperes',
          title: 'Reperes',
          summary: 'Trois axes mesures pour cadrer la situation.',
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
          summary: 'Trois actions concretes a lancer sans attendre.',
          state: 'full',
          itemsCount: resourcesActions.length
        },
        actions: {
          id: 'actions',
          title: 'Ressources utiles',
          summary: 'Ressources coherentes avec les actions proposees.',
          state: 'full',
          itemsCount: resourcesActions.length
        }
      },
      modules: {
        resourcesActions: {
          recommended: resourcesActions,
          library: [],
          tags: resourcesTags
        }
      },
      meta: { isEmpty: false, partial: false, maturity: 'core' }
    });
    assertNoRawAnswers(vm);
    return vm;
  }
};
