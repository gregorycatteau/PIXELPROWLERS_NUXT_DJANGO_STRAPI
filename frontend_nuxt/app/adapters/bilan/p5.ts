import type { JourneyBilanAdapter } from './types';
import { createEmptyUniversalBilanViewModel, type ResourcesActionsItemVM } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { P5_PANORAMA_AXIS_ORDER, p5PanoramaAxesMeta } from '~/config/journeys/p5QuestionsV1_0';
import { recommendResourcesFromBilan } from '@/utils/resources/recommendResourcesFromBilan';

type AxisId = (typeof P5_PANORAMA_AXIS_ORDER)[number];

const DEFAULT_AXIS_SCORES: Record<AxisId, number> = {
  symptomes: 55,
  rythmes: 50,
  alignement: 45
};

const PRIORITY_LABELS: Record<AxisId, string> = {
  symptomes: 'Reduire les signaux de tension',
  rythmes: 'Stabiliser le rythme de pilotage',
  alignement: 'Clarifier les arbitrages et priorites'
};

const ACTION_CARDS: ResourcesActionsItemVM[] = [
  {
    id: 'p5_action_signaux',
    kind: 'resource',
    title: 'Installer 3 signaux de charge',
    description: 'Outcome: une lecture hebdo des tensions. Effort: 45 min.',
    effort: 2,
    cta: { type: 'route', label: 'Voir la ressource', target: '/ressources/tableau-bord-3-signaux' }
  },
  {
    id: 'p5_action_rituel',
    kind: 'resource',
    title: 'Rituel hebdo 15 min',
    description: 'Outcome: un rythme clair pour ajuster. Effort: 15 min.',
    effort: 1,
    cta: { type: 'route', label: 'Voir la ressource', target: '/ressources/rituel-hebdo-15min' }
  },
  {
    id: 'p5_action_decisions',
    kind: 'resource',
    title: 'Decision log minimal',
    description: 'Outcome: arbitrages visibles sans friction. Effort: 30 min.',
    effort: 1,
    cta: { type: 'route', label: 'Voir la ressource', target: '/ressources/decision-log-minimal' }
  },
  {
    id: 'p5_action_compte_rendu',
    kind: 'resource',
    title: 'Compte-rendu utile en 1 page',
    description: 'Outcome: decisions et actions lisibles. Effort: 20 min.',
    effort: 1,
    cta: { type: 'route', label: 'Voir la ressource', target: '/ressources/compte-rendu-utile-1page' }
  }
];

const normalizeAxisScore = (raw?: number | null, fallback?: number): number => {
  if (typeof raw === 'number' && raw > 0) {
    return Math.round((Math.min(5, Math.max(0, raw)) / 5) * 100);
  }
  return fallback ?? 0;
};

export const p5BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p5',
  buildViewModel() {
    const storage = useCoreJourneyStorage({ journeyId: 'p5' });
    try {
      storage.loadFromStorage();
    } catch {
      // ignore
    }

    const panoramaScores = storage.scores.value?.panorama;
    const answeredCount = panoramaScores?.answeredCount ?? 0;
    const skippedCount = panoramaScores?.skippedCount ?? 0;

    const axes = P5_PANORAMA_AXIS_ORDER.map((axisId) => {
      const rawScore = panoramaScores?.byAxis?.[axisId]?.score ?? 0;
      const score = normalizeAxisScore(rawScore, DEFAULT_AXIS_SCORES[axisId]);
      return {
        id: axisId,
        label: p5PanoramaAxesMeta[axisId]?.label ?? axisId,
        score
      };
    });

    const globalScore = Math.round(axes.reduce((sum, axis) => sum + axis.score, 0) / axes.length);
    const priorities = axes
      .slice()
      .sort((a, b) => (a.score - b.score) || a.id.localeCompare(b.id))
      .slice(0, 2)
      .map((axis) => PRIORITY_LABELS[axis.id as AxisId]);

    const resourcesActions = ACTION_CARDS.map((action) => ({
      ...action,
      description: action.description ?? '',
      cta: { ...action.cta }
    }));

    const vm = createEmptyUniversalBilanViewModel({
      copy: { title: 'Bilan P5', subtitle: 'Synthese locale, basee sur le panorama.' },
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama' },
        { id: 'gb_export', label: 'Export' }
      ],
      panorama: {
        answeredCount,
        skippedCount,
        completenessLabel: `Score global ${globalScore}/100`,
        axes: axes.map((axis) => ({
          ...axis,
          isPriority: priorities.includes(PRIORITY_LABELS[axis.id as AxisId]),
          priorityLabel: PRIORITY_LABELS[axis.id as AxisId]
        })),
        blocks: [],
        completedLabel: answeredCount > 0 ? 'Panorama renseigne' : 'Panorama par defaut'
      },
      sections: {
        reperes: {
          id: 'reperes',
          title: 'Priorites',
          summary: priorities.join(' · '),
          state: 'full',
          itemsCount: priorities.length
        },
        risques: {
          id: 'risques',
          title: 'Risques visibles',
          summary: 'Charge, malentendus, decisions floues.',
          state: 'partial',
          itemsCount: 3
        },
        recommandations: {
          id: 'recommandations',
          title: 'Recommandations',
          summary: 'Ressources ciblees sur les priorites.',
          state: 'partial',
          itemsCount: 3
        },
        actions: {
          id: 'actions',
          title: 'Actions immediates',
          summary: `${resourcesActions.length} actions proposees.`,
          state: 'full',
          itemsCount: resourcesActions.length
        }
      },
      modules: {
        resourcesActions: {
          recommended: resourcesActions,
          library: [],
          tags: ['p5']
        }
      },
      meta: { isEmpty: false, partial: false, maturity: 'core' }
    });

    const recommendations = recommendResourcesFromBilan({
      panorama: vm.panorama,
      sections: vm.sections,
      modules: vm.modules,
      journeyId: 'p5'
    });

    vm.sections.recommandations = {
      ...vm.sections.recommandations,
      itemsCount: recommendations.length,
      state: recommendations.length ? 'full' : 'partial',
      summary: recommendations.length
        ? `${recommendations.length} ressource(s) recommandees.`
        : 'Ressources en preparation.'
    };

    assertNoRawAnswers(vm);
    return vm;
  }
};
