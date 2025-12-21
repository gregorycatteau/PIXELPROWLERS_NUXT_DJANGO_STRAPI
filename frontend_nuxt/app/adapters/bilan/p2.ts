import type { JourneyBilanAdapter } from './types';
import type { GlobalBilanViewModel } from '@/types/bilan';

const emptyVm: GlobalBilanViewModel = {
  copy: {
    title: 'Bilan (indisponible)',
    subtitle: ''
  },
  axisSummaryLabel: '',
  completedBlocksLabel: '',
  panoramaAnsweredLabel: '',
  summaryNav: [],
  blocksSummaryHeading: '',
  completedBlocks: '',
  panorama: {
    answeredCount: 0,
    skippedCount: 0,
    completenessLabel: '',
    axes: [],
    blocks: [],
    completedLabel: ''
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
    exportText: '',
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
    isEmpty: true
  }
};

export const p2BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p2',
  buildViewModel(): GlobalBilanViewModel {
    return emptyVm;
  }
};
