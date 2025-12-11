export type JourneyStepType = 'intro' | 'questionnaire' | 'bilan' | 'resources' | 'carrefour';

export interface JourneyStepMeta {
  stepId: string;
  type: JourneyStepType;
  componentName: string; // ex: P1IntroE0
  isTerminal?: boolean;
  next?: string;
  prev?: string;
}

export interface JourneySchema {
  id: string; // 'p1'
  slug: string; // 'ma-structure-dysfonctionne'
  steps: JourneyStepMeta[];
}

export const p1JourneySchema: JourneySchema = {
  id: 'p1',
  slug: 'ma-structure-dysfonctionne',
  steps: [
    { stepId: 'E0_intro', type: 'intro', componentName: 'P1IntroE0', next: 'E1_panorama' },
    { stepId: 'E1_panorama', type: 'questionnaire', componentName: 'P1PanoramaE1', prev: 'E0_intro', next: 'E2_panorama_bilan' },
    { stepId: 'E2_panorama_bilan', type: 'bilan', componentName: 'P1PanoramaBilanE2', prev: 'E1_panorama' },
    { stepId: 'B1_questions', type: 'questionnaire', componentName: 'P1Block1Questionnaire', prev: 'E2_panorama_bilan', next: 'B1_bilan' },
    { stepId: 'B1_bilan', type: 'bilan', componentName: 'P1Block1Bilan', prev: 'B1_questions', next: 'E2_panorama_bilan' },
    { stepId: 'B2_questions', type: 'questionnaire', componentName: 'P1Block2Questionnaire', prev: 'E2_panorama_bilan', next: 'B2_bilan' },
    { stepId: 'B2_bilan', type: 'bilan', componentName: 'P1Block2Bilan', prev: 'B2_questions', next: 'E2_panorama_bilan' },
    { stepId: 'B3_questions', type: 'questionnaire', componentName: 'P1Block3Questionnaire', prev: 'E2_panorama_bilan', next: 'B3_bilan' },
    { stepId: 'B3_bilan', type: 'bilan', componentName: 'P1Block3Bilan', prev: 'B3_questions', next: 'E2_panorama_bilan' },
    { stepId: 'B4_questions', type: 'questionnaire', componentName: 'P1Block4Questionnaire', prev: 'E2_panorama_bilan', next: 'B4_bilan' },
    { stepId: 'B4_bilan', type: 'bilan', componentName: 'P1Block4Bilan', prev: 'B4_questions', next: 'E2_panorama_bilan' },
    { stepId: 'E_global_bilan', type: 'bilan', componentName: 'P1GlobalBilan', prev: 'E2_panorama_bilan', isTerminal: true }
  ]
};
