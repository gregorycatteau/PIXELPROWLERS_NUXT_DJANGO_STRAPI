import { computed } from 'vue';
import type { JourneyBilanAdapter } from './types';
import type { GlobalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import { useCoreJourneyStorage } from '~/composables/useCoreJourneyStorage';
import { p4Copy } from '~/config/journeys/p4CopyV1_0';
import { p4PanoramaAxesMeta, P4_PANORAMA_AXIS_ORDER, type P4PanoramaAxisId } from '~/config/journeys/p4QuestionsV1_0';
import { BILAN_SKIP_SIGNAL_COPY } from '@/config/bilan/bilanSkipSignalCopy';
import { getEngagementPack } from '@/config/engagement/registry';
import type { EngagementLevelId } from '@/config/engagement/types';
import { createEmptySections } from '@/adapters/bilan/universalBilanViewModel';

export const p4BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p4',
  buildViewModel(): GlobalBilanViewModel {
    const storage = useCoreJourneyStorage({ journeyId: 'p4' });
    try {
      storage.loadFromStorage();
    } catch {
      // ignore storage read errors
    }
    const panoramaScores = computed(() => storage.scores.value?.panorama ?? null);
    const axisOrder = P4_PANORAMA_AXIS_ORDER;
    const panoramaAxes = computed(() =>
      axisOrder.map((axisId: P4PanoramaAxisId) => {
        const stats = panoramaScores.value?.byAxis?.[axisId];
        const score = stats?.score ?? 0;
        const filled = Math.max(0, Math.min(5, Math.round(score)));
        return {
          id: axisId,
          label: p4PanoramaAxesMeta[axisId].label,
          emoji: '🧭',
          score,
          isPriority: false,
          filledSegments: filled
        };
      })
    );
    const panoramaAnsweredCount = computed(() => panoramaScores.value?.answeredCount ?? 0);
    const panoramaSkippedCount = computed(() => panoramaScores.value?.skippedCount ?? 0);
    const panoramaTotalCount = computed(() => panoramaAnsweredCount.value + panoramaSkippedCount.value);
    const panoramaCompletenessLabel = computed(() => {
      const answered = panoramaAnsweredCount.value;
      const skipped = panoramaSkippedCount.value;
      const total = panoramaTotalCount.value;
      if (!total) return 'Panorama partiel (0/0)';
      if (skipped === 0) return `Panorama complet (${answered}/${total})`;
      return `Panorama partiel (${answered}/${total})`;
    });
    const axisSummaryLabel = computed(() => panoramaAxes.value.map((a) => `${a.label}:${a.score}`).join(' · '));
    const completedBlocksLabel = computed(() => (panoramaAnsweredCount.value > 0 ? 'Bloc exploratoire' : 'aucun'));
    const blocks = computed(() => [
      {
        id: 'B1',
        title: 'Bloc exploratoire',
        answeredCount: panoramaAnsweredCount.value,
        skippedCount: panoramaSkippedCount.value,
        unseenCount: 0,
        completion: panoramaTotalCount.value ? Math.round((panoramaAnsweredCount.value / panoramaTotalCount.value) * 100) : 0,
        isComplete: panoramaTotalCount.value > 0 && panoramaSkippedCount.value === 0,
        detailsOpen: false,
        themes: []
      }
    ]);
    const skipSignal = computed(() => {
      const axisSignals = axisOrder.map((axisId) => {
        const stats = panoramaScores.value?.byAxis?.[axisId];
        const skippedCount = stats?.skippedCount ?? 0;
        const totalCount = stats?.totalCount ?? 0;
        const ratio = totalCount > 0 ? skippedCount / totalCount : 0;
        return {
          axisId,
          skippedCount,
          totalCount,
          show: skippedCount >= 2 || ratio >= 0.2
        };
      });
      return {
        globalSkippedCount: panoramaSkippedCount.value,
        byAxis: axisSignals,
        copy: BILAN_SKIP_SIGNAL_COPY
      };
    });
    const engagementPack = getEngagementPack('p4');
    const engagementModule = engagementPack
      ? {
          intro: engagementPack.intro,
          levels: (Object.entries(engagementPack.levels) as Array<
            [EngagementLevelId, (typeof engagementPack.levels)[EngagementLevelId]]
          >).map(([id, level]) => ({
            id,
            title: level.title,
            body: level.body,
            ctaLabel: level.ctaLabel,
            ctaTarget: level.ctaTarget,
            routePath: level.routePath,
            tags: level.tags
          }))
        }
      : undefined;
    const repereCount = panoramaAxes.value.length;
    const sections = createEmptySections({
      reperes: {
        title: 'Repères',
        summary: 'Vue d’ensemble des axes.',
        state: repereCount > 0 && panoramaSkippedCount.value === 0 ? 'full' : repereCount > 0 ? 'partial' : 'empty',
        itemsCount: repereCount
      },
      risques: {
        title: 'Risques',
        summary: 'Signaux à surveiller.',
        state: 'empty',
        itemsCount: 0
      },
      recommandations: {
        title: 'Recommandations',
        summary: 'Pistes à explorer.',
        state: 'empty',
        itemsCount: 0
      },
      actions: {
        title: 'Actions',
        summary: 'Actions à court terme.',
        state: 'empty',
        itemsCount: 0
      }
    });

    const vm: GlobalBilanViewModel = {
      copy: p4Copy.global,
      axisSummaryLabel: axisSummaryLabel.value,
      completedBlocksLabel: completedBlocksLabel.value,
      panoramaAnsweredLabel: `R ${panoramaAnsweredCount.value} / NR ${panoramaSkippedCount.value}`,
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama & bloc' },
        { id: 'gb_export', label: 'Export' }
      ],
      blocksSummaryHeading: 'Bloc exploratoire',
      completedBlocks: completedBlocksLabel.value,
      panorama: {
        answeredCount: panoramaAnsweredCount.value,
        skippedCount: panoramaSkippedCount.value,
        completenessLabel: panoramaCompletenessLabel.value,
        axes: panoramaAxes.value,
        blocks: blocks.value,
        completedLabel: completedBlocksLabel.value
      },
      sections,
      modules: {
        skipSignal: skipSignal.value,
        engagement: engagementModule
      },
      exportPanel: {
        exportText: `${p4Copy.export.title}\n${p4Copy.export.panoramaHeading}\nScore: ${axisSummaryLabel.value}\n${p4Copy.export.blocksHeading}\nBloc exploratoire\n${p4Copy.export.closingLine}`,
        clearMessage: '',
        copied: false,
        missingInfo: {},
        eraseCopyLabel: '',
        focusDetails: false,
        hasGlobalMissing: false,
        globalSkipText: '',
        globalMissing: 0
      },
      meta: {
        isEmpty: panoramaTotalCount.value === 0,
        partial: true,
        maturity: 'core'
      }
    };
    assertNoRawAnswers(vm);
    return vm;
  }
};
