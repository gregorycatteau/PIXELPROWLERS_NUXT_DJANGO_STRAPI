import type { JourneySchema } from './p1JourneySchema';

export const p2_stubJourneySchema: JourneySchema = {
  id: 'p2_stub',
  slug: 'parcours-p2-stub',
  label: 'Parcours P2 (stub)',
  entrypoint: 'E0_intro',
  modules: { panorama: true, bilan: true, resources: true, exit: true },
  copyPack: 'app/config/journeys/p2_stubCopyV1_0',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'StepIntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'StepPanoramaE1', prev: 'E0_intro', next: 'E_global_bilan' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'GlobalBilanEngine', prev: 'E1_panorama', next: 'E_resources' },
    { stepId: 'E_resources', type: 'resources', componentName: 'StepResourcesE3', prev: 'E_global_bilan', next: 'E_exit' },
    { stepId: 'E_exit', type: 'carrefour', componentName: 'StepExitE4', prev: 'E_resources', isTerminal: true }
  ],
  gatingRules: []
};
