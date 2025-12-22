import type { JourneyManifestV1 } from './types';

export const p2Manifest: JourneyManifestV1 = {
  id: 'p2',
  slug: 'nos-outils-numeriques-nous-epuisent',
  maturity: 'core',
  modules: {
    panorama: true,
    blocks: true,
    export: true
  },
  pointers: {},
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
