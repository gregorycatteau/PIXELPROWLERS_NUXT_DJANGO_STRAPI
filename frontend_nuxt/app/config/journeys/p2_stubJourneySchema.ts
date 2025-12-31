import type { JourneySchema } from './p1JourneySchema';

export const p2_stubJourneySchema: JourneySchema = {
  id: 'p2_stub',
  slug: 'parcours-p2-stub',
  label: 'Parcours P2 (stub)',
  entrypoint: 'E0_intro',
  modules: { panorama: true, bilan: true, resources: true, exit: true },
  copyPack: 'app/config/journeys/p2_stubCopyV1_0',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'StepIntroE0', next: 'E_panorama' },
    { stepId: 'E_panorama', type: 'questionnaire', componentName: 'StepPanoramaE1', prev: 'E0_intro', next: 'E_bilan' },
    { stepId: 'E_bilan', type: 'bilan', componentName: 'StepBilanE2', prev: 'E_panorama', next: 'E_resources' },
    { stepId: 'E_resources', type: 'resources', componentName: 'StepResourcesE3', prev: 'E_bilan', next: 'E_exit' },
    { stepId: 'E_exit', type: 'carrefour', componentName: 'StepExitE4', prev: 'E_resources', isTerminal: true }
  ],
  gatingRules: []
};
