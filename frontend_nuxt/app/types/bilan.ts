import type { EngagementLevelId, CtaTarget } from '~/config/engagement/types';
import type { RecommendationItem } from '~/utils/reco/types';

type ForbiddenVmKeys =
  | 'answersBy'
  | 'rawAnswers'
  | 'perQuestion'
  | `answersBy${string}`
  | `rawAnswers${string}`
  | `perQuestion${string}`
  | `p${number}_q${number}`
  | `q${number}_${string}`;

type NoForbiddenKeys<T> = T & { [K in ForbiddenVmKeys]?: never };

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

export type ResourcesActionsCtaType = 'contact' | 'resources' | 'route' | 'file' | 'export' | 'none';

export type ResourcesActionsItemVM = {
  id: string;
  kind: 'resource' | 'action';
  title: string;
  description?: string;
  tags?: string[];
  horizon?: string;
  effort?: number;
  format?: string;
  cta: {
    type: ResourcesActionsCtaType;
    label: string;
    target?: string;
  };
  reason?: string;
};

export type ResourcesActionsModuleVM = {
  recommended: ResourcesActionsItemVM[];
  library: ResourcesActionsItemVM[];
  tags: string[];
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

export type UniversalBilanSectionId = 'reperes' | 'risques' | 'recommandations' | 'actions';
export type UniversalBilanSectionState = 'empty' | 'partial' | 'full';

export type UniversalBilanSectionVM = {
  id: UniversalBilanSectionId;
  title: string;
  summary: string;
  state: UniversalBilanSectionState;
  itemsCount: number;
};

export type UniversalBilanSectionsVM = {
  reperes: UniversalBilanSectionVM;
  risques: UniversalBilanSectionVM;
  recommandations: UniversalBilanSectionVM;
  actions: UniversalBilanSectionVM;
};

type GlobalBilanViewModelBase = {
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
  sections: UniversalBilanSectionsVM;
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
    resourcesActions?: ResourcesActionsModuleVM;
    engagement?: {
      intro?: string;
      levels: Array<{
        id: EngagementLevelId;
        title: string;
        body: string;
        ctaLabel: string;
        ctaTarget: CtaTarget;
        routePath?: string;
        tags?: string[];
        isRecommended?: boolean;
      }>;
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

export type GlobalBilanViewModel = NoForbiddenKeys<GlobalBilanViewModelBase>;

export type UniversalBilanViewModel = GlobalBilanViewModel;

const EMPTY_PANORAMA: GlobalBilanViewModelBase['panorama'] = {
  answeredCount: 0,
  skippedCount: 0,
  completenessLabel: '',
  axes: [],
  blocks: [],
  completedLabel: ''
};

const EMPTY_EXPORT_PANEL: GlobalBilanViewModelBase['exportPanel'] = {
  exportText: '',
  clearMessage: '',
  copied: false,
  missingInfo: {},
  eraseCopyLabel: '',
  focusDetails: false,
  hasGlobalMissing: false,
  globalSkipText: '',
  globalMissing: 0
};
const EMPTY_SECTIONS: GlobalBilanViewModelBase['sections'] = {
  reperes: {
    id: 'reperes',
    title: '',
    summary: '',
    state: 'empty',
    itemsCount: 0
  },
  risques: {
    id: 'risques',
    title: '',
    summary: '',
    state: 'empty',
    itemsCount: 0
  },
  recommandations: {
    id: 'recommandations',
    title: '',
    summary: '',
    state: 'empty',
    itemsCount: 0
  },
  actions: {
    id: 'actions',
    title: '',
    summary: '',
    state: 'empty',
    itemsCount: 0
  }
};

export const createEmptyUniversalBilanViewModel = (
  overrides?: Partial<UniversalBilanViewModel>
): UniversalBilanViewModel => {
  const base: UniversalBilanViewModel = {
    copy: { title: '', subtitle: '' },
    axisSummaryLabel: '',
    completedBlocksLabel: '',
    panoramaAnsweredLabel: '',
    summaryNav: [],
    blocksSummaryHeading: '',
    completedBlocks: '',
    panorama: { ...EMPTY_PANORAMA },
    sections: { ...EMPTY_SECTIONS },
    exportPanel: { ...EMPTY_EXPORT_PANEL },
    meta: { isEmpty: true, partial: true }
  };

  const panorama = {
    ...EMPTY_PANORAMA,
    ...(overrides?.panorama ?? {})
  };
  const exportPanel = {
    ...EMPTY_EXPORT_PANEL,
    ...(overrides?.exportPanel ?? {})
  };
  const sections = {
    ...EMPTY_SECTIONS,
    ...(overrides?.sections ?? {})
  };
  const meta = {
    isEmpty: true,
    partial: true,
    ...(overrides?.meta ?? {})
  };

  return {
    ...base,
    ...overrides,
    panorama,
    sections,
    exportPanel,
    meta
  };
};

export const withUniversalBilanDefaults = (
  input?: Partial<UniversalBilanViewModel> | null
): UniversalBilanViewModel => {
  if (!input) return createEmptyUniversalBilanViewModel();
  return createEmptyUniversalBilanViewModel(input);
};
