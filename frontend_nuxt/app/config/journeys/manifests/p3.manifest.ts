import type { JourneyManifestV1 } from './types';

export const p3Manifest: JourneyManifestV1 = {
  id: 'p3',
  slug: 'parcours-p3',
  engine: 'universal',
  visibility: 'prod',
  maturity: 'core',
  axes: [
    { axisId: 'charge', label: 'Charge & rythme' },
    { axisId: 'clarity', label: 'Clarte & limites' },
    { axisId: 'support', label: 'Soutien & relais' }
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
    questions: 'app/config/journeys/p3QuestionsV1_0',
    copy: 'app/config/journeys/p3CopyV1_0'
  },
  adapters: {
    globalBilanAdapterId: 'p3'
  },
  storage: {
    schemaVersion: 'p3_v1.0',
    scoresKey: 'pp_journey_p3_scores_v1_0',
    metaKey: 'pp_journey_p3_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
