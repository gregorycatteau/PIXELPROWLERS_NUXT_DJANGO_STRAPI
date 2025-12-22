import type { RecommendationItem } from '~/utils/reco/types';

export type BilanAxisVM = {
  id: string;
  label: string;
  emoji?: string;
  score: number;
  isPriority?: boolean;
  priorityLabel?: string;
  filledSegments?: number;
};

export type BilanBlockVM = {
  id: string;
  title: string;
  answeredCount: number;
  skippedCount: number;
  unseenCount: number;
  completion: number;
  isComplete: boolean;
  detailsOpen?: boolean;
  themes?: { name: string; average: number; count: number }[];
};

export type BilanIssueBullet = { lead: string; detail?: string };

export type BilanIssueVM = {
  id: string;
  label: string;
  icon?: string;
  summary: string;
  summaryShort: string;
  interpretation?: string;
  impactScore: number;
  effects: BilanIssueBullet[];
  signals: BilanIssueBullet[];
  expanded: boolean;
};

export type BilanHypothesisVM = {
  id: string;
  index: number;
  title: string;
  summary: string;
  signals: BilanIssueBullet[];
  costs: BilanIssueBullet[];
  tests: BilanIssueBullet[];
  rationaleLines?: string[];
  firstCheck?: string;
  body?: string;
  whyItMatters?: string;
  detailsOpen: boolean;
  selected: boolean;
  disabled: boolean;
};

export type BilanLandingPlanVM = {
  id: string;
  title: string;
  timeEstimate: string;
  steps: string[];
  expectedOutcome: string;
  done: boolean;
};

export type BilanResourcesPreviewVM = {
  heading: string;
  resources: any[];
};

export type BilanActionGroupVM = {
  hasAnyAction: boolean;
  filteredActionsByHorizon: Record<string, any[]>;
  copy: any;
};

export type BilanActionVM = {
  id: string;
  label: string;
  description: string;
  safetyNote?: string;
};

export type BilanSkipSignalAxisVM = {
  axisId: string;
  skippedCount: number;
  totalCount: number;
  show: boolean;
};

export type BilanSkipSignalVM = {
  globalSkippedCount: number;
  byAxis: BilanSkipSignalAxisVM[];
  copy?: {
    globalNotice: string;
    optionalDetail: string;
  };
};

export type GlobalBilanViewModel = {
  copy: any;
  axisSummaryLabel: string;
  completedBlocksLabel: string;
  panoramaAnsweredLabel: string;
  summaryNav: { id: string; label: string }[];
  panorama: {
    answeredCount: number;
    skippedCount: number;
    completenessLabel: string;
    axes: BilanAxisVM[];
    blocks: BilanBlockVM[];
    completedLabel: string;
  };
  blocksSummaryHeading: string;
  completedBlocks: string;
  meta?: {
    isEmpty?: boolean;
    partial?: boolean;
    maturity?: 'stub' | 'core' | 'full' | 'prod';
    [key: string]: any;
  };
  modules?: {
    issues?: {
      list: BilanIssueVM[];
      watchlist: BilanIssueVM[];
      focusDetails: boolean;
      title: string;
      intro: string;
      emptyText: string;
    };
    supports?: {
      main: { id: string; label: string; summary: string; interpretation?: string }[];
      copy: any;
    };
    hypotheses?: {
      list: BilanHypothesisVM[];
      secondary: { id: string; title: string }[];
      selectionCount: string;
      verificationPlans: { id: string; title: string; steps: string[] }[];
    };
    landing?: {
      plans: BilanLandingPlanVM[];
      highlightTarget: string | null;
    };
    resources?: any[];
    actions?: BilanActionGroupVM;
    recommendations?: {
      recommended: RecommendationItem[];
      library: RecommendationItem[];
    };
    engagement?: {
      intro: string[];
      synthesis: string[];
      levelN1: string[];
      levelN2: string[];
      levelN3: string[];
      levelN4: string[];
    };
    skipSignal?: BilanSkipSignalVM;
  };
  exportPanel: {
    exportText: string;
    clearMessage: string;
    copied: boolean;
    missingInfo: any;
    eraseCopyLabel: string;
    focusDetails: boolean;
    hasGlobalMissing: boolean;
    globalSkipText: string;
    globalMissing: number;
  };
};
