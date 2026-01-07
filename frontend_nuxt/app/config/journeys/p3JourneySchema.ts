import type { JourneySchema } from './p1JourneySchema';

export const p3JourneySchema: JourneySchema = {
  id: 'p3',
  slug: 'parcours-p3',
  label: 'Parcours P3',
  entrypoint: 'E0_intro',
  modules: { panorama: true, bilan: true, resources: true, exit: true },
  copyPack: 'app/config/journeys/p3CopyV1_0',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'StepIntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'StepPanoramaE1', prev: 'E0_intro', next: 'E2_bilan' },
    { stepId: 'E2_bilan', type: 'bilan', componentName: 'StepBilanE2', prev: 'E1_panorama', next: 'E3_resources' },
    { stepId: 'E3_resources', type: 'resources', componentName: 'StepResourcesE3', prev: 'E2_bilan', next: 'E4_exit' },
    { stepId: 'E4_exit', type: 'carrefour', componentName: 'StepExitE4', prev: 'E3_resources', isTerminal: true }
  ],
  gatingRules: []
};
