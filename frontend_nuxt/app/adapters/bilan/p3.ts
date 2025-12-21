import type { JourneyBilanAdapter } from './types';
import type { GlobalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';

const panoramaAxes = [
  { id: 'alignment', label: 'Alignement', emoji: '🎯', score: 3, isPriority: true, filledSegments: 3 },
  { id: 'delivery', label: 'Delivery', emoji: '🚚', score: 2, isPriority: false, filledSegments: 2 },
  { id: 'team', label: 'Équipe', emoji: '🤝', score: 4, isPriority: true, filledSegments: 4 },
  { id: 'governance', label: 'Gouvernance', emoji: '🏛️', score: 1, isPriority: false, filledSegments: 1 }
];

const blocks = [
  {
    id: 'P3-B1',
    title: 'Bloc de base P3',
    answeredCount: 3,
    skippedCount: 1,
    unseenCount: 0,
    completion: 75,
    isComplete: false,
    detailsOpen: false,
    themes: []
  }
];

export const p3BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p3',
  buildViewModel(): GlobalBilanViewModel {
    const vm: GlobalBilanViewModel = {
      copy: {
        title: 'Bilan P3',
        subtitle: 'Panorama et blocs'
      },
      axisSummaryLabel: panoramaAxes.map((a) => `${a.label}:${a.score}`).join(' · '),
      completedBlocksLabel: 'Bloc de base P3',
      panoramaAnsweredLabel: 'R 3 / NR 1',
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama & blocs' },
        { id: 'gb_export', label: 'Export' }
      ],
      blocksSummaryHeading: 'Blocs P3',
      completedBlocks: 'Bloc de base P3',
      panorama: {
        answeredCount: 3,
        skippedCount: 1,
        completenessLabel: 'Panorama partiel (3/4)',
        axes: panoramaAxes,
        blocks,
        completedLabel: 'Bloc de base P3'
      },
      modules: {},
      exportPanel: {
        exportText: 'Bilan P3 (panorama + blocs)',
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
        isEmpty: false,
        partial: true,
        maturity: 'core'
      }
    };
    assertNoRawAnswers(vm);
    return vm;
  }
};
