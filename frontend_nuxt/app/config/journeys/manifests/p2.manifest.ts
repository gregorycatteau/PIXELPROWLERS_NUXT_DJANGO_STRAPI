import type { JourneyManifestV1 } from './types';

export const p2Manifest: JourneyManifestV1 = {
  id: 'p2',
  slug: 'nos-outils-numeriques-nous-epuisent',
  engine: 'universal',
  maturity: 'core',
  axes: [
    { axisId: 'overload', label: 'Charge numerique' },
    { axisId: 'fragmentation', label: 'Fragmentation des outils' },
    { axisId: 'sovereignty', label: 'Souverainete et maitrise' }
  ],
  modules: {
    panorama: true,
    blocks: true,
    export: true,
    engagement: true
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
