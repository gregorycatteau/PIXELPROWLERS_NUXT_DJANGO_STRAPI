import type { RecommendationAxisSignal, RecommendationItem, RecommendationSignals } from './types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const MAX_REASON_LENGTH = 300;
const intensityLabels = {
  strong: 'Priorite a traiter',
  moderate: 'A envisager en priorite',
  gentle: 'Priorite douce'
};

const completionPhrases = [
  'Ce bilan reflete ce que tu as pu poser aujourd hui.',
  'Les suggestions tiennent compte de ce qui est renseigne et de ce qui est reste en blanc.'
];

const withNumber = (value: number | undefined, fallback = 0) => (typeof value === 'number' ? value : fallback);

const axisNeedScore = (axis: RecommendationAxisSignal): number => {
  const base = clamp(5 - withNumber(axis.score, 0), 0, 5);
  const skippedCount = withNumber(axis.skippedCount);
  const missingCount = withNumber(axis.missingCount);
  const totalCount = withNumber(axis.totalCount);
  const ratio = totalCount > 0 ? skippedCount / totalCount : 0;
  const skipPenalty = skippedCount >= 2 || ratio >= 0.2 ? 0.25 : 0;
  const missingPenalty = missingCount > 0 ? 0.1 : 0;
  return base + skipPenalty + missingPenalty;
};

const pickDominantAxes = (signals: RecommendationSignals) => {
  const scored = signals.axes
    .map((axis) => ({ axis, score: axisNeedScore(axis) }))
    .sort((a, b) => b.score - a.score);
  const top = scored[0];
  if (!top) {
    return { dominant: [], topScore: 0 };
  }
  const dominant: Array<{ axis: RecommendationAxisSignal; score: number }> = [top];
  const second = scored[1];
  if (second && top.score - second.score < 0.75) {
    dominant.push(second);
  }
  return { dominant, topScore: top.score };
};

const resolveIntensity = (topScore: number): 'gentle' | 'moderate' | 'strong' => {
  if (topScore >= 2.5) return 'strong';
  if (topScore >= 1.5) return 'moderate';
  return 'gentle';
};

const hasTag = (item: RecommendationItem, tag: string) => Array.isArray(item.tags) && item.tags.includes(tag);

const parseHorizonTag = (tags: string[]) => {
  const value = tags.find((tag) => tag.startsWith('horizon:'));
  return value ? value.split(':')[1] : null;
};

const isHorizonCompatible = (intensity: 'gentle' | 'moderate' | 'strong', item: RecommendationItem): boolean => {
  const horizon = item.horizon ?? (item.tags ? parseHorizonTag(item.tags) : null);
  if (!horizon) return false;
  if (intensity === 'strong') return horizon === 'now' || horizon === 'soon';
  if (intensity === 'moderate') return horizon === 'soon';
  return horizon === 'later' || horizon === 'now';
};

const scoreItem = (item: RecommendationItem, dominantAxisIds: string[], intensity: 'gentle' | 'moderate' | 'strong') => {
  let score = 0;
  if (dominantAxisIds.some((axisId) => hasTag(item, `axis:${axisId}`))) {
    score += 2;
  }
  if (isHorizonCompatible(intensity, item)) {
    score += 1;
  }
  if (hasTag(item, 'format:template') || hasTag(item, 'format:checklist')) {
    score += 0.5;
  }
  if (intensity === 'gentle' && hasTag(item, 'scope:advanced')) {
    score -= 0.5;
  }
  return score;
};

const pickCompletionPhrase = (itemId: string) => {
  const total = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return completionPhrases[total % completionPhrases.length];
};

const enforceReasonLength = (reason: string) => {
  if (reason.length <= MAX_REASON_LENGTH) return reason;
  if (process.env.NODE_ENV === 'production') {
    return `${reason.slice(0, MAX_REASON_LENGTH - 3).trimEnd()}...`;
  }
  throw new Error('Recommendation reason exceeds max length.');
};

export const buildRecommendationsV2 = (signals: RecommendationSignals, items: RecommendationItem[]) => {
  const { dominant, topScore } = pickDominantAxes(signals);
  const intensity = resolveIntensity(topScore);
  const dominantAxisIds = dominant.map(({ axis }) => axis.axisId);
  const dominantAxisLabels = dominant.map(({ axis, score }) => ({
    id: axis.axisId,
    label: axis.label,
    score
  }));

  const candidateByAxis = items.filter((item) =>
    dominantAxisIds.some((axisId) => hasTag(item, `axis:${axisId}`))
  );
  const candidateByGeneral = items.filter((item) => hasTag(item, 'axis:general'));
  const candidates = candidateByAxis.length
    ? candidateByAxis
    : candidateByGeneral.length
      ? candidateByGeneral
      : items;

  const ranked = candidates
    .map((item) => ({ item, score: scoreItem(item, dominantAxisIds, intensity) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.id.localeCompare(b.item.id);
    })
    .map(({ item }) => item);

  const reasonPrefix = intensityLabels[intensity];
  const recommended = ranked.map((item, index) => {
    const axisLabel = dominantAxisLabels.length
      ? dominantAxisLabels[index % dominantAxisLabels.length]?.label
      : undefined;
    const base = axisLabel ? `${reasonPrefix} pour renforcer l axe ${axisLabel}.` : `${reasonPrefix}.`;
    const reason = enforceReasonLength(`${base} ${pickCompletionPhrase(item.id)}`);
    return { ...item, reason };
  });

  return {
    recommended,
    meta: {
      axesDominants: dominantAxisLabels,
      intensity
    }
  };
};
