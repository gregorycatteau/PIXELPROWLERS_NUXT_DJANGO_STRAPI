import type { JourneySchema } from './p1JourneySchema';

export const p2JourneySchema: JourneySchema = {
  id: 'p2',
  slug: 'nos-outils-numeriques-nous-epuisent',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'P2IntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'P2PanoramaE1', prev: 'E0_intro', next: 'E2_panorama_bilan' },
    { stepId: 'E2_panorama_bilan', type: 'bilan', componentName: 'P2PanoramaBilanE2', prev: 'E1_panorama' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'P2GlobalBilan', prev: 'E2_panorama_bilan', isTerminal: true }
  ]
};
