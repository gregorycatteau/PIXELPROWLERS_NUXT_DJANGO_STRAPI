import type { JourneyManifestV1 } from './types';

export const p3Manifest: JourneyManifestV1 = {
  id: 'p3',
  slug: 'je-suis-en-transition',
  maturity: 'core',
  modules: {
    panorama: true,
    blocks: true,
    export: true
  },
  pointers: {},
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
