import type { JourneyManifestV1 } from './types';

export const p2_stubManifest: JourneyManifestV1 = {
  id: 'p2_stub',
  slug: 'parcours-p2-stub',
  engine: 'universal',
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
    questions: 'app/config/journeys/p2_stubQuestionsV1_0',
    copy: 'app/config/journeys/p2_stubCopyV1_0'
  },
  adapters: {
    globalBilanAdapterId: 'p2_stub'
  },
  storage: {
    schemaVersion: 'p2_stub_v1.0',
    scoresKey: 'pp_journey_p2_stub_scores_v1_0',
    metaKey: 'pp_journey_p2_stub_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
