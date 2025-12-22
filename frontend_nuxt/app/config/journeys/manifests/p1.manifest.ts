import type { JourneyManifestV1 } from './types';

export const p1Manifest: JourneyManifestV1 = {
  id: 'p1',
  slug: 'ma-structure-dysfonctionne',
  maturity: 'prod',
  axes: [
    { axisId: 'human', label: 'Humain' },
    { axisId: 'movement', label: 'Mouvement' },
    { axisId: 'decisions', label: 'Decisions' },
    { axisId: 'structure', label: 'Structure' }
  ],
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
  resourceIds: [
    'kit_p1_demarrage',
    'kit_mission_cash',
    'kit_gouvernance_veto',
    'kit_dependance_mortelle',
    'kit_capacite_reelle',
    'kit_pilotage_reporting',
    'kit_controles_internes'
  ],
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
