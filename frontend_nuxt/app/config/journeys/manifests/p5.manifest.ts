import type { JourneyManifestV1 } from './types';

export const p5Manifest: JourneyManifestV1 = {
  id: 'p5',
  slug: 'parcours-p5',
  engine: 'universal',
  visibility: 'prod',
  maturity: 'core',
  axes: [
    { axisId: 'symptomes', label: 'Symptomes' },
    { axisId: 'rythmes', label: 'Rythmes' },
    { axisId: 'alignement', label: 'Alignement' }
  ],
  modules: {
    panorama: true,
    blocks: false,
    issues: false,
    hypotheses: false,
    landing: false,
    actions: false,
    resources: true,
    engagement: false,
    export: true,
    recommendations: false
  },
  pointers: {
    questions: 'app/config/journeys/p5QuestionsV1_0',
    copy: 'app/config/journeys/p5CopyV1_0'
  },
  adapters: {
    globalBilanAdapterId: 'p5'
  },
  storage: {
    schemaVersion: 'p5_v1.0',
    scoresKey: 'pp_journey_p5_scores_v1_0',
    metaKey: 'pp_journey_p5_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
