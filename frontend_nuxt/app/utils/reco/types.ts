import type { Horizon, ResourceFormat } from '~/config/resources/types';

export type RecommendationKind = 'resource' | 'action';

export type RecommendationItem = {
  id: string;
  kind: RecommendationKind;
  title: string;
  summary?: string;
  tags: string[];
  horizon?: Horizon;
  format?: ResourceFormat;
  filePath?: string;
  reason?: string;
};

export type RecommendationAxisSignal = {
  axisId: string;
  label: string;
  score: number;
  answeredCount: number;
  skippedCount: number;
  missingCount: number;
  totalCount: number;
};

export type RecommendationBlockSignal = {
  id: string;
  title: string;
  answeredCount: number;
  skippedCount: number;
  unseenCount: number;
  completion: number;
};

export type RecommendationSignals = {
  journeyId: string;
  axes: RecommendationAxisSignal[];
  blocks: RecommendationBlockSignal[];
  skipSignal?: {
    globalSkippedCount: number;
    byAxis: { axisId: string; skippedCount: number; totalCount: number }[];
  };
};

export type RecommendationResult = {
  recommended: RecommendationItem[];
  library: RecommendationItem[];
};
