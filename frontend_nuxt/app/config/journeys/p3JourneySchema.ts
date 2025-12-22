import type { JourneySchema } from './p1JourneySchema';

export const p3JourneySchema: JourneySchema = {
  id: 'p3',
  slug: 'je-suis-en-transition',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'P3IntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'P3PanoramaE1', prev: 'E0_intro', next: 'E2_panorama_bilan' },
    { stepId: 'E2_panorama_bilan', type: 'bilan', componentName: 'P3PanoramaBilanE2', prev: 'E1_panorama' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'P3GlobalBilan', prev: 'E2_panorama_bilan', isTerminal: true }
  ]
};
