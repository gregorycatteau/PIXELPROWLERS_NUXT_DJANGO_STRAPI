import type { JourneySchema } from './p1JourneySchema';

export const p4JourneySchema: JourneySchema = {
  id: 'p4',
  slug: 'parcours-60-minutes',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'StepIntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'StepPanoramaE1', prev: 'E0_intro', next: 'E2_panorama_bilan' },
    { stepId: 'E2_panorama_bilan', type: 'bilan', componentName: 'StepPanoramaBilanE2', prev: 'E1_panorama' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'GlobalBilanEngine', prev: 'E2_panorama_bilan', isTerminal: true }
  ]
};
