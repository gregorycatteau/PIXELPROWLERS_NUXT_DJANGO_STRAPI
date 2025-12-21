import type { P1PanoramaAxis, P1PanoramaScores } from '~/composables/useJourneyDiagnostics';
import type { P1ScoresStorage } from '~/composables/useDiagnosticStorage';

type P1StoredScoresLike = P1ScoresStorage & {
  runtime?: P1ScoresStorage | null;
  axes?: Array<{
    axisId?: string;
    averageTension?: number | null;
    answeredCount?: number;
    skippedIntentionalCount?: number;
  }>;
};

const PANORAMA_AXES: P1PanoramaAxis[] = ['human', 'movement', 'decisions', 'structure'];

export const getP1PanoramaScoresFromStored = (stored: P1StoredScoresLike | null | undefined): P1PanoramaScores | null => {
  if (!stored) return null;

  const runtimePanorama = (stored as P1ScoresStorage).panorama ?? (stored as any)?.runtime?.panorama;
  if (runtimePanorama) {
    return {
      human: runtimePanorama.human ?? 0,
      movement: runtimePanorama.movement ?? 0,
      decisions: runtimePanorama.decisions ?? 0,
      structure: runtimePanorama.structure ?? 0,
      answeredCount: runtimePanorama.answeredCount ?? 0,
      skippedCount: runtimePanorama.skippedCount ?? 0,
      byAxis: runtimePanorama.byAxis
    };
  }

  const axes = (stored as any)?.axes;
  if (!Array.isArray(axes)) return null;

  const scores: P1PanoramaScores = {
    human: 0,
    movement: 0,
    decisions: 0,
    structure: 0,
    answeredCount: 0,
    skippedCount: 0
  };

  let hasAxisValue = false;

  PANORAMA_AXES.forEach((axisId) => {
    const entry = axes.find((axis: any) => axis?.axisId === axisId);
    if (!entry) return;
    if (typeof entry.averageTension === 'number') {
      (scores as any)[axisId] = Number(entry.averageTension);
      hasAxisValue = true;
    }
    scores.answeredCount += entry.answeredCount ?? 0;
    scores.skippedCount += entry.skippedIntentionalCount ?? 0;
  });

  if (!hasAxisValue && scores.answeredCount === 0 && scores.skippedCount === 0) {
    return null;
  }

  return scores;
};
