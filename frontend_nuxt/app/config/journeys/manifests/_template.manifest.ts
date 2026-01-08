import type { JourneyManifestV1 } from './types';

export const journeyManifestTemplate: JourneyManifestV1 = {
  id: 'px',
  slug: 'mon-parcours',
  visibility: 'dev',
  maturity: 'stub',
  axes: [],
  modules: {
    panorama: false,
    blocks: false,
    issues: false,
    hypotheses: false,
    landing: false,
    actions: false,
    resources: false,
    engagement: false,
    export: false
  },
  pointers: {},
  adapters: {
    globalBilanAdapterId: ''
  },
  storage: {
    schemaVersion: 'px_v1.0',
    scoresKey: 'pp_journey_px_scores_v1_0',
    metaKey: 'pp_journey_px_meta_v1_0',
    ttlPolicy: 'unchanged'
  }
};
