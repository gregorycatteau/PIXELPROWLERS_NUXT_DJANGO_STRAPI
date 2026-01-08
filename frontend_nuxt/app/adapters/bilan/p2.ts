import { computed } from 'vue';
import type { JourneyBilanAdapter } from './types';
import type { GlobalBilanViewModel, ResourcesActionsItemVM } from '@/types/bilan';
import { createEmptyUniversalBilanViewModel } from '@/types/bilan';
import { createEmptySections } from '@/adapters/bilan/universalBilanViewModel';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { p2Copy } from '~/config/journeys/p2CopyV1_0';
import { p2PanoramaAxesMeta, P2_PANORAMA_AXIS_ORDER, type P2PanoramaAxisId } from '~/config/journeys/p2QuestionsV1_0';
import { BILAN_SKIP_SIGNAL_COPY } from '~/config/bilan/bilanSkipSignalCopy';

const SCORE_LABEL = 'Axes prioritaires';

const ACTION_CARDS: ResourcesActionsItemVM[] = [
  {
    id: 'p2_card_1',
    kind: 'action',
    title: 'Réunions éclair et sans noyade',
    description:
      'Une méthode pour des réunions de 30 minutes maximum, centrées sur l essentiel. Outils pour préparer l ordre du jour, limiter les digressions et sortir avec des décisions claires.',
    cta: {
      type: 'route',
      label: 'Je structure mes réunions',
      target: '/ressources/reunion-30min-sans-noyade'
    }
  },
  {
    id: 'p2_card_2',
    kind: 'action',
    title: 'Journal de décisions minimal',
    description:
      'Un modèle simple pour consigner qui décide quoi, quand et pourquoi. Idéal pour clarifier les responsabilités et éviter les zones grises.',
    cta: {
      type: 'route',
      label: 'Je consigne mes décisions',
      target: '/ressources/decision-log-minimal'
    }
  },
  {
    id: 'p2_card_3',
    kind: 'action',
    title: 'Charte des canaux en 3 couleurs',
    description:
      'Un guide pour définir des canaux de communication selon l urgence et la nature des demandes. Trois niveaux (critique, important, informatif) pour réduire les interruptions et fluidifier la coordination.',
    cta: {
      type: 'route',
      label: 'Je clarifie mes canaux',
      target: '/ressources/charte-canaux-3-couleurs'
    }
  }
];

const axisLabelFor = (axisId: P2PanoramaAxisId) => p2PanoramaAxesMeta[axisId]?.label ?? axisId;
const axisShortLabelFor = (axisId: P2PanoramaAxisId) =>
  p2PanoramaAxesMeta[axisId]?.shortLabel ?? axisLabelFor(axisId);
const filledSegments = (score: number) => Math.max(0, Math.min(5, Math.round(score)));
const priorityLabel = (score: number) => {
  if (score >= 4) return 'Prioritaire';
  if (score >= 2) return 'À surveiller';
  return 'Secondaire';
};
const toSectionState = (count: number, partial = false) => {
  if (!count) return 'empty';
  return partial ? 'partial' : 'full';
};

export const p2BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p2',
  buildViewModel() {
    const storage = useCoreJourneyStorage({ journeyId: 'p2' });
    const panoramaScores = computed(() => storage.scores.value?.panorama ?? null);
    const answeredCount = computed(() => panoramaScores.value?.answeredCount ?? 0);
    const skippedCount = computed(() => panoramaScores.value?.skippedCount ?? 0);
    const totalCount = computed(() => answeredCount.value + skippedCount.value);
    const hasPanorama = computed(() => totalCount.value > 0);

    const axisScores = computed(() =>
      (P2_PANORAMA_AXIS_ORDER as P2PanoramaAxisId[])
        .map((axisId, order) => ({
          id: axisId,
          order,
          score: panoramaScores.value?.byAxis?.[axisId]?.score ?? 0
        }))
        .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.order - b.order))
    );
    const maxScore = computed(() => axisScores.value.reduce((acc, axis) => Math.max(acc, axis.score), 0));
    const priorityAxisIds = computed(() =>
      axisScores.value
        .filter((axis) => axis.score === maxScore.value && maxScore.value >= 4)
        .map((axis) => axis.id)
    );

    const panoramaAxesForCard = computed(() =>
      axisScores.value.map((axis) => ({
        id: axis.id,
        label: axisLabelFor(axis.id),
        emoji: '',
        score: axis.score,
        isPriority: priorityAxisIds.value.includes(axis.id),
        priorityLabel: priorityLabel(axis.score),
        filledSegments: filledSegments(axis.score)
      }))
    );

    const panoramaCompletenessLabel = computed(() => {
      const answered = answeredCount.value;
      const skipped = skippedCount.value;
      const total = totalCount.value;
      if (!total) return 'Panorama partiel (0/0)';
      if (skipped === 0) return `Panorama complet (${answered}/${total})`;
      return `Panorama partiel (${answered}/${total})`;
    });

    const axisSummaryLabel = computed(() => {
      const summary = axisScores.value
        .map((axis) => `${axisShortLabelFor(axis.id)}:${axis.score}`)
        .join(' · ');
      return summary ? `${SCORE_LABEL} · ${summary}` : SCORE_LABEL;
    });

    const panoramaAnsweredLabel = computed(() => `R ${answeredCount.value} / NR ${skippedCount.value}`);
    const completedBlocksLabel = computed(() => 'aucun');

    const skipSignal = computed(() => {
      const axisSignals = (P2_PANORAMA_AXIS_ORDER as P2PanoramaAxisId[]).map((axisId) => {
        const stats = panoramaScores.value?.byAxis?.[axisId];
        const skipped = stats?.skippedCount ?? 0;
        const total =
          stats?.totalCount ??
          (stats?.answeredCount ?? 0) + (stats?.skippedCount ?? 0) + (stats?.missingCount ?? 0);
        const ratio = total > 0 ? skipped / total : 0;
        return {
          axisId,
          skippedCount: skipped,
          totalCount: total,
          show: skipped >= 2 || ratio >= 0.2
        };
      });
      return {
        globalSkippedCount: skippedCount.value,
        byAxis: axisSignals,
        copy: BILAN_SKIP_SIGNAL_COPY
      };
    });

    const summaryNav = [
      { id: 'gb_reperes', label: 'Repères' },
      { id: 'gb_panorama', label: p2Copy.global.panoramaHeading ?? 'Panorama' },
      { id: 'gb_export', label: 'Export' }
    ];

    const repereCount = computed(() => (hasPanorama.value ? panoramaAxesForCard.value.length : 0));
    const sections = createEmptySections({
      reperes: {
        title: 'Repères',
        summary: 'Synthèse des axes et repères clés.',
        state: toSectionState(repereCount.value, skippedCount.value > 0),
        itemsCount: repereCount.value
      },
      risques: {
        title: 'Risques',
        summary: 'Aucun signal prioritaire détecté.',
        state: 'empty',
        itemsCount: 0
      },
      recommandations: {
        title: 'Recommandations',
        summary: 'Pistes et ressources à explorer.',
        state: 'empty',
        itemsCount: 0
      },
      actions: {
        title: 'Actions',
        summary: 'Actions concrètes pour avancer.',
        state: 'empty',
        itemsCount: 0
      }
    });

    const vm: GlobalBilanViewModel = {
      copy: {
        title: p2Copy.global.title,
        subtitle: p2Copy.global.subtitle,
        exportHeading: p2Copy.global.exportHeading,
        exportNotice: p2Copy.global.exportNotice,
        sovereigntyNote: p2Copy.global.sovereigntyNote,
        copyCta: p2Copy.global.copyCta,
        printCta: p2Copy.global.printCta,
        backToHub: p2Copy.global.backToHub
      },
      axisSummaryLabel: axisSummaryLabel.value,
      completedBlocksLabel: completedBlocksLabel.value,
      panoramaAnsweredLabel: panoramaAnsweredLabel.value,
      summaryNav,
      blocksSummaryHeading: p2Copy.global.blocksHeading ?? 'Blocs exploratoires',
      completedBlocks: completedBlocksLabel.value,
      panorama: {
        answeredCount: answeredCount.value,
        skippedCount: skippedCount.value,
        completenessLabel: panoramaCompletenessLabel.value,
        axes: panoramaAxesForCard.value,
        blocks: [],
        completedLabel: completedBlocksLabel.value
      },
      sections,
      modules: {
        resourcesActions: {
          recommended: ACTION_CARDS,
          library: [],
          tags: []
        },
        skipSignal: skipSignal.value
      },
      meta: {
        isEmpty: !hasPanorama.value,
        partial: !hasPanorama.value,
        maturity: 'stub'
      }
    };

    const filledVm = createEmptyUniversalBilanViewModel(vm);
    assertNoRawAnswers(filledVm);
    return filledVm;
  }
};
