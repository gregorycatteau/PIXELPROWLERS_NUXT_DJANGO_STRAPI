import type { JourneyManifestV1 } from './types';

export const p4Manifest: JourneyManifestV1 = {
  id: 'p4',
  slug: 'parcours-60-minutes',
  engine: 'universal',
  maturity: 'core',
  axes: [
    { axisId: 'clarity', label: 'Clarte de la direction' },
    { axisId: 'capacity', label: 'Capacite a executer' },
    { axisId: 'support', label: 'Appuis et ressources' }
  ],
  modules: {
    panorama: true,
    blocks: true,
    export: true,
    engagement: true
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
