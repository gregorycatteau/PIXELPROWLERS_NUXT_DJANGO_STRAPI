import type { JourneySchema } from './p1JourneySchema';

export const p5JourneySchema: JourneySchema = {
  id: 'p5',
  slug: 'parcours-p5',
  label: 'Parcours P5',
  entrypoint: 'E0_intro',
  modules: { panorama: true, bilan: true, resources: true, exit: true },
  copyPack: 'app/config/journeys/p5CopyV1_0',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'StepIntroE0', next: 'E_panorama' },
    { stepId: 'E_panorama', type: 'questionnaire', componentName: 'StepPanoramaE1', prev: 'E0_intro', next: 'E_global_bilan' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'GlobalBilanEngine', prev: 'E_panorama', next: 'E_resources' },
    { stepId: 'E_resources', type: 'resources', componentName: 'StepResourcesE3', prev: 'E_global_bilan', next: 'E_exit' },
    { stepId: 'E_exit', type: 'carrefour', componentName: 'StepExitE4', prev: 'E_resources', isTerminal: true }
  ],
  gatingRules: []
};
