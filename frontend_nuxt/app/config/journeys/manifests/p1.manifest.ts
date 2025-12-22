import type { JourneyManifestV1 } from './types';

export const p1Manifest: JourneyManifestV1 = {
  id: 'p1',
  slug: 'ma-structure-dysfonctionne',
  maturity: 'prod',
  modules: {
    panorama: true,
    blocks: true,
    issues: true,
    hypotheses: true,
    landing: true,
    actions: true,
    resources: true,
    engagement: true,
    export: true
  },
  pointers: {
    questions: 'app/config/journeys/p1QuestionsV1_3',
    copy: 'app/config/journeys/p1CopyV1_3',
    resources: 'app/config/resources/p1ResourcesV1_3',
    actions: 'app/config/journeys/p1ActionPlansV1_0'
  },
  adapters: {
    globalBilanAdapterId: 'p1'
  },
  storage: {
    schemaVersion: 'p1_v1.3',
    scoresKey: 'pp_journey_p1_scores_v1_3',
    metaKey: 'pp_journey_p1_meta_v1_3',
    ttlPolicy: 'unchanged'
  }
};
