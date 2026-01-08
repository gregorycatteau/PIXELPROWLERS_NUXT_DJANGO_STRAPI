import type { JourneyManifestV1 } from './types';

export const p4_stubManifest: JourneyManifestV1 = {
  id: 'p4_stub',
  slug: 'parcours-p4-stub',
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
    questions: 'app/config/journeys/p4_stubQuestionsV1_0',
    copy: 'app/config/journeys/p4_stubCopyV1_0'
  },
  adapters: {
    globalBilanAdapterId: 'p4_stub'
  },
  storage: {
    schemaVersion: 'p4_stub_v1.0',
    scoresKey: 'pp_journey_p4_stub_scores_v1_0',
    metaKey: 'pp_journey_p4_stub_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
