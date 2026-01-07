import type { JourneyManifestV1 } from './types';

export const p2Manifest: JourneyManifestV1 = {
  id: 'p2',
  slug: 'parcours-p2',
  engine: 'universal',
  visibility: 'dev',
  maturity: 'stub',
  axes: [
    { axisId: 'clarity', label: 'Clarte' },
    { axisId: 'capacity', label: 'Capacite' }
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
    questions: 'app/config/journeys/p2QuestionsV1_0',
    copy: 'app/config/journeys/p2CopyV1_0'
  },
  adapters: {
    globalBilanAdapterId: 'p2'
  },
  storage: {
    schemaVersion: 'p2_v1.0',
    scoresKey: 'pp_journey_p2_scores_v1_0',
    metaKey: 'pp_journey_p2_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
