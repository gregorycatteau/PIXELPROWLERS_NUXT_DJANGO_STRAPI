import type { JourneyBilanAdapter } from './types';
import {
  createEmptyUniversalBilanViewModel,
  type ResourcesActionsItemVM,
  type UniversalBilanSectionsVM
} from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import { listResources } from '@/config/resources/registryV0';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { p5Copy } from '~/config/journeys/p5CopyV1_0';
import { P5_PANORAMA_AXIS_ORDER, p5PanoramaAxesMeta, type P5PanoramaAxisId } from '~/config/journeys/p5QuestionsV1_0';
import { recommendResourcesFromBilan } from '@/utils/resources/recommendResourcesFromBilan';

const P5_ACTION_SLUGS = [
  'tableau-bord-3-signaux',
  'rituel-hebdo-15min',
  'decision-log-minimal',
  'compte-rendu-utile-1page'
] as const;

const DEFAULT_AXIS_SCORES: Record<P5PanoramaAxisId, number> = {
  symptomes: 3,
  rythmes: 3,
  alignement: 2.5
};

const PRIORITY_LABELS: Record<P5PanoramaAxisId, string> = {
  symptomes: 'Reduire les signaux de tension',
  rythmes: 'Stabiliser le rythme de pilotage',
  alignement: 'Clarifier les arbitrages et priorites'
};

const clampAxisScore = (value: number) => Math.max(0, Math.min(5, Number.isFinite(value) ? value : 0));
const scoreToPercent = (score: number) => Math.max(0, Math.min(100, Math.round((score / 5) * 100)));

const buildActionCards = (): ResourcesActionsItemVM[] => {
  const resources = listResources();
  const bySlug = new Map(resources.map((resource) => [resource.slug, resource]));

  return P5_ACTION_SLUGS.flatMap((slug) => {
    const resource = bySlug.get(slug);
    if (!resource) return [];
    if (!resource.relatedJourneys?.includes('p5')) return [];

    const descriptionParts = [
      resource.summary,
      resource.outcome ? `Outcome: ${resource.outcome}` : null,
      `Effort: ${resource.effort}`
    ].filter(Boolean);

    return [
      {
        id: `p5_action_${slug}`,
        kind: 'action',
        title: resource.title,
        description: descriptionParts.join(' '),
        tags: [resource.category, 'priorites'],
        effort: resource.effort === 'low' ? 1 : resource.effort === 'medium' ? 2 : 3,
        format: resource.level,
        cta: {
          type: 'route',
          label: p5Copy.resources?.cta ?? 'Voir',
          target: `/ressources/${resource.slug}`
        },
        reason: 'Action immediate et locale.'
      }
    ];
  });
};

export const p5BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p5',
  buildViewModel() {
    const storage = useCoreJourneyStorage({ journeyId: 'p5' });
    storage.loadFromStorage();
    const panoramaScores = storage.scores.value?.panorama ?? null;
    const answeredCount = panoramaScores?.answeredCount ?? 0;
    const skippedCount = panoramaScores?.skippedCount ?? 0;

    const axes = P5_PANORAMA_AXIS_ORDER.map((axisId) => {
      const storedAxis = panoramaScores?.byAxis?.[axisId];
      const score = clampAxisScore(storedAxis?.score ?? DEFAULT_AXIS_SCORES[axisId]);
      const filledSegments = Math.max(0, Math.min(5, Math.round(score)));
      return {
        id: axisId,
        label: p5PanoramaAxesMeta[axisId]?.label ?? axisId,
        score,
        filledSegments
      };
    });

    const axisAverage = axes.reduce((total, axis) => total + axis.score, 0) / Math.max(axes.length, 1);
    const globalScore = scoreToPercent(axisAverage);
    const priorityAxes = axes
      .slice()
      .sort((a, b) => (b.score - a.score) || a.label.localeCompare(b.label))
      .slice(0, 2);
    const priorityLabels = priorityAxes.map((axis) => PRIORITY_LABELS[axis.id as P5PanoramaAxisId]).join(' · ');

    const actionCards = buildActionCards();
    const actionTags = Array.from(new Set(actionCards.flatMap((item) => item.tags ?? [])));

    const sections: UniversalBilanSectionsVM = {
      reperes: {
        id: 'reperes',
        title: p5Copy.bilan?.scoreLabel ?? 'Score mixte (0-100)',
        summary: `Score global: ${globalScore}/100.`,
        state: 'full',
        itemsCount: axes.length
      },
      risques: {
        id: 'risques',
        title: p5Copy.bilan?.prioritiesLabel ?? 'Priorites identifiees',
        summary: priorityLabels || 'Priorites en cours d identification.',
        state: 'full',
        itemsCount: priorityAxes.length
      },
      recommandations: {
        id: 'recommandations',
        title: p5Copy.bilan?.actionCardsIntro ?? 'Actions locales',
        summary: 'Ressources ciblees sur tes priorites.',
        state: actionCards.length ? 'full' : 'partial',
        itemsCount: actionCards.length
      },
      actions: {
        id: 'actions',
        title: 'Actions immediates',
        summary: actionCards.length
          ? `${actionCards.length} actions proposees.`
          : 'Actions a definir.',
        state: actionCards.length ? 'full' : 'empty',
        itemsCount: actionCards.length
      }
    };

    const vm = createEmptyUniversalBilanViewModel({
      copy: {
        title: p5Copy.global.title ?? 'Bilan P5',
        subtitle: p5Copy.global.subtitle ?? 'Synthese locale et neutre.',
        exportHeading: p5Copy.global.exportHeading ?? 'Export (client-side)',
        exportNotice: p5Copy.global.exportNotice ?? 'Le texte ci-dessus est genere cote client.',
        copyCta: p5Copy.global.copyCta ?? 'Copier le bilan',
        printCta: p5Copy.global.printCta ?? 'Imprimer',
        clearCta: p5Copy.global.clearCta ?? 'Effacer mes reponses de cet appareil',
        backToHub: p5Copy.global.backToHub ?? 'Retour au panorama',
        sovereigntyNote: p5Copy.global.sovereigntyNote ?? 'Ce bilan reste sur cet appareil.'
      },
      axisSummaryLabel: p5Copy.bilan?.scoreLabel ?? 'Score mixte (0-100)',
      completedBlocksLabel: 'Aucun bloc',
      blocksSummaryHeading: 'Blocs exploratoires',
      panoramaAnsweredLabel: `${answeredCount}/${P5_PANORAMA_AXIS_ORDER.length * 2}`,
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama' },
        { id: 'gb_export', label: 'Export' }
      ],
      panorama: {
        answeredCount,
        skippedCount,
        completenessLabel: `Score global: ${globalScore}/100`,
        axes,
        blocks: [],
        completedLabel: answeredCount > 0 ? 'Panorama renseigne' : 'Panorama par defaut'
      },
      sections,
      modules: {
        resourcesActions: {
          recommended: actionCards,
          library: [],
          tags: actionTags
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
