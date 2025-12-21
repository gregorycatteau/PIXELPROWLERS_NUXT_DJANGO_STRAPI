import type { JourneyBilanAdapter } from './types';
import type { GlobalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';

const panoramaAxes = [
  { id: 'engagement', label: 'Engagement', emoji: '🔥', score: 3, isPriority: true, filledSegments: 3 },
  { id: 'process', label: 'Process', emoji: '🧭', score: 2, isPriority: false, filledSegments: 2 },
  { id: 'relation', label: 'Relation', emoji: '🤝', score: 4, isPriority: true, filledSegments: 4 },
  { id: 'structure', label: 'Structure', emoji: '🧱', score: 1, isPriority: false, filledSegments: 1 }
];

const blocks = [
  {
    id: 'B1',
    title: 'Bloc exploratoire',
    answeredCount: 4,
    skippedCount: 0,
    unseenCount: 0,
    completion: 100,
    isComplete: true,
    detailsOpen: false,
    themes: []
  }
];

export const p2BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p2',
  buildViewModel(): GlobalBilanViewModel {
    const vm: GlobalBilanViewModel = {
      copy: {
        title: 'Bilan P2',
        subtitle: 'Panorama rapide'
      },
      axisSummaryLabel: panoramaAxes.map((a) => `${a.label}:${a.score}`).join(' · '),
      completedBlocksLabel: 'Bloc exploratoire',
      panoramaAnsweredLabel: 'R 4 / NR 0',
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama & blocs' },
        { id: 'gb_export', label: 'Export' }
      ],
      blocksSummaryHeading: 'Blocs P2',
      completedBlocks: 'Bloc exploratoire',
      panorama: {
        answeredCount: 4,
        skippedCount: 0,
        completenessLabel: 'Panorama partiel (4/4)',
        axes: panoramaAxes,
        blocks,
        completedLabel: 'Bloc exploratoire'
      },
      issues: {
        list: [],
        watchlist: [],
        focusDetails: false,
        title: '',
        intro: '',
        emptyText: ''
      },
      supports: {
        main: [],
        copy: {}
      },
      hypotheses: {
        list: [],
        secondary: [],
        selectionCount: '0/2',
        verificationPlans: []
      },
      landing: {
        plans: [],
        highlightTarget: null
      },
      resources: [],
      exportPanel: {
        exportText: 'Bilan P2 (panorama + blocs)',
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
        isEmpty: false
      }
    };
    assertNoRawAnswers(vm);
    return vm;
  }
};
