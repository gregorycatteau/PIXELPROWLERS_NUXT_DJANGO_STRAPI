import type { P1MetaStorage, P1ScoresStorage } from '~/composables/useDiagnosticStorage';

const hasAnsweredBlock = (scores: P1ScoresStorage | null | undefined, blockId: 'b1' | 'b3') => {
  const block = scores?.blocks?.[blockId];
  if (!block) return false;
  return Object.values(block.themes ?? {}).some((theme) => (theme?.count ?? 0) > 0);
};

export const hasP1GlobalBilanAccess = (
  meta: P1MetaStorage | null | undefined,
  scores: P1ScoresStorage | null | undefined
) => {
  const panoramaDone = Boolean(meta?.panoramaCompleted || scores?.panorama);
  const hasCoreBlock = hasAnsweredBlock(scores, 'b1') || hasAnsweredBlock(scores, 'b3');
  return panoramaDone && hasCoreBlock;
};
