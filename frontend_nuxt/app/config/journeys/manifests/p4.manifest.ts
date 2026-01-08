import type { JourneyManifestV1 } from './types';

export const p4Manifest: JourneyManifestV1 = {
  id: 'p4',
  slug: 'parcours-p4',
  engine: 'universal',
  visibility: 'prod',
  maturity: 'stub',
  axes: [
    { axisId: 'symptomes', label: 'Signaux' },
    { axisId: 'rythmes', label: 'Rythmes' },
    { axisId: 'coordination', label: 'Coordination' }
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
    questions: 'app/config/journeys/p4QuestionsV1_0',
    copy: 'app/config/journeys/p4CopyV1_0'
  },
  adapters: {
    globalBilanAdapterId: 'p4'
  },
  storage: {
    schemaVersion: 'p4_v1.0',
    scoresKey: 'pp_journey_p4_scores_v1_0',
    metaKey: 'pp_journey_p4_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
