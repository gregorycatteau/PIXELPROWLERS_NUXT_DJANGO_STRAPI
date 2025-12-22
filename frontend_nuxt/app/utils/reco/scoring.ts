import type { RecommendationAxisSignal, RecommendationItem, RecommendationSignals } from './types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const scoreAxis = (axis: RecommendationAxisSignal, skipPenalty: number): number => {
  const base = clamp(5 - axis.score, 0, 5);
  const skipWeight = clamp(skipPenalty, 0, 2);
  return base + skipWeight;
};

const pickPrimaryAxis = (signals: RecommendationSignals): RecommendationAxisSignal | null => {
  if (!signals.axes.length) return null;
  const skipByAxis = new Map<string, number>();
  signals.skipSignal?.byAxis?.forEach((axis) => {
    const ratio = axis.totalCount > 0 ? axis.skippedCount / axis.totalCount : 0;
    const penalty = axis.skippedCount >= 2 || ratio >= 0.2 ? 1 : 0;
    skipByAxis.set(axis.axisId, penalty);
  });

  const sorted = signals.axes
    .map((axis) => ({
      axis,
      score: scoreAxis(axis, skipByAxis.get(axis.axisId) ?? 0)
    }))
    .sort((a, b) => b.score - a.score);

  return sorted[0]?.axis ?? null;
};

export const attachReasons = (signals: RecommendationSignals, items: RecommendationItem[]): RecommendationItem[] => {
  const primaryAxis = pickPrimaryAxis(signals);
  if (!primaryAxis) return items;
  const reason = `A explorer pour renforcer l axe ${primaryAxis.label}.`;
  return items.map((item) => ({ ...item, reason }));
};
