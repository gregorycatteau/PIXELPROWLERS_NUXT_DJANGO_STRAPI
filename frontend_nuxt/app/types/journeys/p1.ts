export type P1AnswerStatus = 'answered' | 'skipped_intentional' | 'missing';

export type P1Answer = {
  questionId: string;
  status: P1AnswerStatus;
  value?: 1 | 2 | 3 | 4 | 5;
};

export type P1Question = {
  id: string;
  version: string;
  journeyId: 'P1';
  blockId: 'B1' | 'B2' | 'B3' | 'B4' | 'GLOBAL';
  axis: string;
  subAxis?: string | null;

  assertion: string;
  assertionAlt?: string | null;

  polarity: 'positive' | 'negative';
  scale: 'likert_1_5';

  weight: 1 | 2 | 3;
  critical: boolean;

  uiHint: 'slider' | 'radio' | 'other' | 'sensitive' | 'neutral';

  order: number;
  stepId: 'E1' | 'E3' | 'OTHER';

  patternSignals?: string[];
  tags?: string[];

  notesProduct?: string;
  notesSafety?: string;
};

export type P1PatternInput = {
  question: P1Question;
  answer: P1Answer;
  tensionScore?: number;
};

// Plan d’action P1 – front-only, dérivé des bands de tension.
// Ne doit manipuler que des agrégats (jamais de réponses brutes).
export type P1ActionHorizon = 'now' | 'soon' | 'later';

export type P1ActionMode =
  | 'solo_reflexion'
  | 'duo_confiance'
  | 'petit_groupe'
  | 'instance_formelle';

export interface P1ActionItem {
  id: string;
  blockId: 'B1' | 'B3';
  horizon: P1ActionHorizon;
  label: string;
  description: string;
  mode: P1ActionMode;
  effort: 1 | 2 | 3;
  safetyNote?: string;
}

export interface P1ActionPlan {
  version: '1.0';
  generatedAt: string;
  bands: {
    B1?: 'low' | 'medium' | 'high' | 'very_high';
    B3?: 'low' | 'medium' | 'high' | 'very_high';
  };
  items: P1ActionItem[];
}
