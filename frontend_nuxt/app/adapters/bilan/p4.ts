import type { JourneyBilanAdapter } from './types';
import { createEmptyUniversalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import type { ResourcesActionsItemVM, UniversalBilanSectionsVM } from '@/types/bilan';
import { listResources } from '@/config/resources/registryV0';
import { useCoreJourneyStorage } from '@/composables/useCoreJourneyStorage';
import { p4Copy } from '@/config/journeys/p4CopyV1_0';
import { P4_PANORAMA_AXIS_ORDER, p4PanoramaAxesMeta } from '@/config/journeys/p4QuestionsV1_0';

const P4_ACTION_SLUGS = [
  'rituel-hebdo-15min',
  'tableau-bord-3-signaux',
  'reunion-30min-sans-noyade'
] as const;

const clampAxisScore = (value: number) => Math.max(0, Math.min(5, Number.isFinite(value) ? value : 0));
const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const buildActionCards = (): ResourcesActionsItemVM[] => {
  const resources = listResources();
  const bySlug = new Map(resources.map((resource) => [resource.slug, resource]));

  return P4_ACTION_SLUGS.flatMap((slug) => {
    const resource = bySlug.get(slug);
    if (!resource) return [];
    if (!resource.relatedJourneys?.includes('p4')) return [];

    const descriptionParts = [
      resource.summary,
      resource.outcome ? `Outcome: ${resource.outcome}` : null,
      `Effort: ${resource.effort}`
    ].filter(Boolean);

    return [
      {
        id: `p4_action_${slug}`,
        kind: 'action',
        title: resource.title,
        description: descriptionParts.join(' '),
        tags: [resource.category, 'priorites'],
        format: resource.level,
        cta: {
          type: 'route',
          label: p4Copy.resources?.cta ?? 'Voir',
          target: `/ressources/${resource.slug}`
        },
        reason: 'Action immediate et locale.'
      }
    ];
  });
};

export const p4BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p4',
  buildViewModel() {
    const storage = useCoreJourneyStorage({ journeyId: 'p4' });
    storage.loadFromStorage();
    const panorama = storage.scores.value?.panorama ?? null;
    const totalQuestions = P4_PANORAMA_AXIS_ORDER.length * 2;

    const axes = P4_PANORAMA_AXIS_ORDER.map((axisId) => {
      const axisMeta = p4PanoramaAxesMeta[axisId];
      const storedAxis = panorama?.byAxis?.[axisId];
      const score = clampAxisScore(storedAxis?.score ?? 0);
      const filledSegments = Math.max(0, Math.min(5, Math.round(score)));
      return {
        id: axisId,
        label: axisMeta.label,
        score,
        filledSegments
      };
    });

    const actionCards = buildActionCards();
    const priorityAxes = axes
      .slice()
      .sort((a, b) => (b.score - a.score) || a.label.localeCompare(b.label))
      .slice(0, 2);
    const priorityLabels = priorityAxes.map((axis) => axis.label).join(', ');

    const axisAverage = axes.reduce((acc, axis) => acc + axis.score, 0) / Math.max(axes.length, 1);
    const globalScore = clampPercent((axisAverage / 5) * 100);

    const actionTags = Array.from(new Set(actionCards.flatMap((item) => item.tags ?? [])));

    const sections: UniversalBilanSectionsVM = {
      reperes: {
        id: 'reperes',
        title: p4Copy.bilan?.scoreLabel ?? 'Score global (0-5)',
        summary: `Score global: ${globalScore}/100.`,
        state: 'full',
        itemsCount: axes.length
      },
      risques: {
        id: 'risques',
        title: p4Copy.bilan?.prioritiesLabel ?? 'Priorites immediates',
        summary: priorityLabels ? `Priorites : ${priorityLabels}.` : 'Priorites disponibles.',
        state: 'full',
        itemsCount: priorityAxes.length
      },
      recommandations: {
        id: 'recommandations',
        title: p4Copy.bilan?.actionCardsIntro ?? 'Actions immediates',
        summary: actionCards.length
          ? `${actionCards.length} actions concretes pour reprendre le tempo.`
          : 'Actions a definir.',
        state: actionCards.length ? 'full' : 'empty',
        itemsCount: actionCards.length
      },
      actions: {
        id: 'actions',
        title: 'Ressources',
        summary: p4Copy.resources?.intro ?? 'Ressources locales disponibles.',
        state: actionCards.length ? 'full' : 'empty',
        itemsCount: actionCards.length
      }
    };

    const vm = createEmptyUniversalBilanViewModel({
      copy: {
        title: p4Copy.global.title,
        subtitle: p4Copy.global.subtitle,
        exportHeading: p4Copy.global.exportHeading ?? 'Export (client-side)',
        exportNotice: p4Copy.global.exportNotice ?? 'Le texte ci-dessus est genere cote client.',
        copyCta: p4Copy.global.copyCta ?? 'Copier le bilan',
        printCta: p4Copy.global.printCta ?? 'Imprimer',
        clearCta: p4Copy.global.clearCta ?? 'Effacer mes reponses de cet appareil',
        backToHub: p4Copy.global.backToHub ?? 'Retour au panorama',
        sovereigntyNote: p4Copy.global.sovereigntyNote ?? 'Ce bilan reste sur cet appareil.'
      },
      axisSummaryLabel: p4Copy.bilan?.scoreLabel ?? 'Score global (0-5)',
      completedBlocksLabel: 'Aucun bloc',
      blocksSummaryHeading: 'Blocs exploratoires',
      panoramaAnsweredLabel: `${panorama?.answeredCount ?? 0}/${totalQuestions}`,
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
    assertNoRawAnswers(vm);
    return vm;
  }
};
