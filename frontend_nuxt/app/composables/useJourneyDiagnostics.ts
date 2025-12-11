import { ref, type Ref } from 'vue';
import type { P1Answer, P1AnswerStatus, P1PatternInput, P1Question } from '@/types/journeys/p1';
import { P1_QUESTIONS_V1_3 } from '@/config/journeys/p1QuestionsV1_3';

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface SymptomAnswer {
  questionId: string;
  value: LikertValue;
}

export interface VucaAnswer {
  questionId: string;
  value: LikertValue;
}

export interface SymptomScores {
  human: number;
  governance: number;
  organization: number;
  resources: number;
}

export interface VucaProfile {
  vucaIndex: number;
  valuesProfile: 'A' | 'B' | 'C' | 'D' | null;
}

export interface UseJourneyDiagnosticsOptions {
  journeyId: string; // 'p1'
  symptomAxisMap?: Record<string, keyof SymptomScores>;
  vucaAxisMap?: Record<string, 'vuca' | 'values'>;
  panoramaAxisMap?: Record<string, P1Axis>;
  blockThemeMap?: Record<string, Record<string, string>>; // blockId -> questionId -> themeId
}

export interface UseJourneyDiagnosticsResult {
  // Legacy VUCA/values (conservé pour compat)
  symptomAnswers: Ref<SymptomAnswer[]>;
  vucaAnswers: Ref<VucaAnswer[]>;
  setSymptomAnswer: (questionId: string, value: LikertValue) => void;
  setVucaAnswer: (questionId: string, value: LikertValue) => void;
  computeSymptomScores: () => SymptomScores;
  computeVucaProfile: () => VucaProfile;

  // P1 modulaire – panorama + blocs (réponses en mémoire uniquement)
  panoramaAnswers: Ref<Record<string, LikertValue | null>>;
  blockAnswers: Ref<Record<string, Record<string, LikertValue | null>>>;
  setPanoramaAnswer: (questionId: string, value: LikertValue | null) => void;
  setBlockAnswer: (blockId: string, questionId: string, value: LikertValue | null) => void;
  computePanoramaScores: () => P1PanoramaScores;
  computeBlockScores: (blockId: string) => P1BlockScores;
  computeGlobalScores: () => P1GlobalScores;
  clearAllAnswers: () => void; // legacy alias (deprecated) - prefer resetAll
  resetAll: () => void;
  getP1PatternInputs: () => P1PatternInput[];
  getP1BlockBands: () => P1BlockBands;
  getPanoramaScoresOrNull: () => P1PanoramaScores | null;
  hasPanoramaScores: () => boolean;
}

// P1 panorama / blocs types
export type P1Axis = 'human' | 'governance' | 'organization' | 'resources';

export interface P1PanoramaScores {
  human: number;
  governance: number;
  organization: number;
  resources: number;
  answeredCount: number;
  skippedCount: number;
  byAxis?: Record<
    P1Axis,
    {
      answeredCount: number;
      skippedCount: number;
      missingCount: number;
      totalCount: number;
    }
  >;
}

export interface P1BlockScores {
  answeredCount: number;
  skippedCount: number;
  unseenCount: number;
  themes: Record<string, { average: number; count: number }>;
}

export interface P1GlobalScores {
  panorama?: P1PanoramaScores;
  blocks: Record<string, P1BlockScores>;
}

export type P1TensionBand = 'low' | 'medium' | 'high' | 'very_high';

export interface P1BlockBands {
  B1?: P1TensionBand;
  B3?: P1TensionBand;
}

// Invariants P1 : les réponses complètes (P1Answer) restent en mémoire locale uniquement.
// Ne jamais les persister ni les envoyer au backend. Ne pas logger les réponses en production.

const emptySymptomScores: SymptomScores = {
  human: 0,
  governance: 0,
  organization: 0,
  resources: 0
};

export function useJourneyDiagnostics(options: UseJourneyDiagnosticsOptions): UseJourneyDiagnosticsResult {
  const { symptomAxisMap = {}, vucaAxisMap = {}, panoramaAxisMap = {}, blockThemeMap = {} } = options;
  const symptomAnswers = ref<SymptomAnswer[]>([]);
  const vucaAnswers = ref<VucaAnswer[]>([]);
  const panoramaAnswers = ref<Record<string, LikertValue | null>>({});
  const blockAnswers = ref<Record<string, Record<string, LikertValue | null>>>({});
  const p1Answers = ref<Record<string, P1Answer>>({});

  const p1QuestionMap: Record<string, P1Question> = P1_QUESTIONS_V1_3.reduce((acc, q) => {
    acc[q.id] = q;
    return acc;
  }, {} as Record<string, P1Question>);

  const getAnswerForQuestion = (questionId: string): P1Answer => {
    return (
      p1Answers.value[questionId] ?? {
        questionId,
        status: 'missing'
      }
    );
  };

  const computeTensionScore = (value: LikertValue, polarity: 'positive' | 'negative') => {
    const max = 5;
    if (polarity === 'positive') {
      return max - value;
    }
    return value - 1;
  };

  const upsertAnswer = <T extends SymptomAnswer | VucaAnswer>(answersRef: Ref<T[]>, next: T) => {
    const idx = answersRef.value.findIndex((entry) => entry.questionId === next.questionId);
    if (idx !== -1) {
      answersRef.value.splice(idx, 1, next);
    } else {
      answersRef.value.push(next);
    }
  };

  const setSymptomAnswer = (questionId: string, value: LikertValue) => {
    upsertAnswer(symptomAnswers, { questionId, value });
  };

  const setVucaAnswer = (questionId: string, value: LikertValue) => {
    upsertAnswer(vucaAnswers, { questionId, value });
  };

  const clearAllAnswers = () => {
    symptomAnswers.value = [];
    vucaAnswers.value = [];
    panoramaAnswers.value = {};
    blockAnswers.value = {};
    p1Answers.value = {};
  };

  const computeSymptomScores = (): SymptomScores => {
    const totals: Record<keyof SymptomScores, { total: number; count: number }> = {
      human: { total: 0, count: 0 },
      governance: { total: 0, count: 0 },
      organization: { total: 0, count: 0 },
      resources: { total: 0, count: 0 }
    };

    symptomAnswers.value.forEach((answer) => {
      const axis = symptomAxisMap[answer.questionId];
      if (!axis) return;
      totals[axis].total += answer.value;
      totals[axis].count += 1;
    });

    return {
      human: totals.human.count ? Number((totals.human.total / totals.human.count).toFixed(2)) : 0,
      governance: totals.governance.count ? Number((totals.governance.total / totals.governance.count).toFixed(2)) : 0,
      organization: totals.organization.count ? Number((totals.organization.total / totals.organization.count).toFixed(2)) : 0,
      resources: totals.resources.count ? Number((totals.resources.total / totals.resources.count).toFixed(2)) : 0
    };
  };

  const computeVucaProfile = (): VucaProfile => {
    if (!vucaAnswers.value.length) {
      return { vucaIndex: 0, valuesProfile: null };
    }
    let vucaTotal = 0;
    let vucaCount = 0;
    const valuesScores: number[] = [];

    vucaAnswers.value.forEach((answer) => {
      const axis = vucaAxisMap[answer.questionId];
      if (axis === 'vuca') {
        vucaTotal += answer.value;
        vucaCount += 1;
      } else if (axis === 'values') {
        valuesScores.push(answer.value);
      }
    });

    const vucaIndex = vucaCount ? Number((vucaTotal / vucaCount).toFixed(2)) : 0;

    /**
     * Profil valeurs simple (placeholder documenté) :
     * - moyenne >= 4.2 => A (alignement global)
     * - moyenne >= 3.2 => B (toi aligné, structure en contradiction ressentie)
     * - moyenne >= 2.4 => C (flou partagé)
     * - sinon => D (structure cohérente perçue, toi en décalage)
     */
    let valuesProfile: VucaProfile['valuesProfile'] = null;
    if (valuesScores.length) {
      const avg = valuesScores.reduce((acc, val) => acc + val, 0) / valuesScores.length;
      if (avg >= 4.2) valuesProfile = 'A';
      else if (avg >= 3.2) valuesProfile = 'B';
      else if (avg >= 2.4) valuesProfile = 'C';
      else valuesProfile = 'D';
    }

    return { vucaIndex, valuesProfile };
  };

  const resolveAxis = (questionId: string): P1Axis | undefined => {
    const q = p1QuestionMap[questionId];
    const axis = q?.axis as P1Axis | undefined;
    if (axis && ['human', 'governance', 'organization', 'resources'].includes(axis)) {
      return axis;
    }
    return panoramaAxisMap[questionId];
  };

  const toSchemaBlockId = (blockId: string): P1Question['blockId'] | null => {
    const upper = blockId.toUpperCase();
    if (upper === 'B1' || upper === 'B2' || upper === 'B3' || upper === 'B4') return upper;
    return null;
  };

  const getPanoramaQuestions = () => P1_QUESTIONS_V1_3.filter((q) => q.stepId === 'E1' && q.blockId === 'GLOBAL');

  const getBlockQuestions = (blockId: string) => {
    const schemaId = toSchemaBlockId(blockId);
    if (!schemaId) return [] as P1Question[];
    return P1_QUESTIONS_V1_3.filter((q) => q.blockId === schemaId);
  };

  const legacyBlockIds: string[] = ['b1', 'b2', 'b3', 'b4'];

  const setP1Answer = (questionId: string, status: P1AnswerStatus, value?: LikertValue | null) => {
    if (status === 'answered' && (value === null || value === undefined)) {
      // si pas de valeur, on ne touche pas à l’état
      return;
    }
    const next: P1Answer =
      status === 'answered'
        ? { questionId, status, value: value as LikertValue }
        : { questionId, status };
    p1Answers.value = {
      ...p1Answers.value,
      [questionId]: next
    };
  };

  const setPanoramaAnswer = (questionId: string, value: LikertValue | null) => {
    const status: P1AnswerStatus = value === null || value === undefined ? 'skipped_intentional' : 'answered';
    setP1Answer(questionId, status, value ?? undefined);
    panoramaAnswers.value = {
      ...panoramaAnswers.value,
      [questionId]: value
    };
  };

  const setBlockAnswer = (blockId: string, questionId: string, value: LikertValue | null) => {
    const status: P1AnswerStatus = value === null || value === undefined ? 'skipped_intentional' : 'answered';
    setP1Answer(questionId, status, value ?? undefined);
    const currentBlock = blockAnswers.value[blockId] ?? {};
    blockAnswers.value = {
      ...blockAnswers.value,
      [blockId]: {
        ...currentBlock,
        [questionId]: value
      }
    };
  };

  const computePanoramaScores = (): P1PanoramaScores => {
    const totals: Record<P1Axis, { total: number; answered: number; skipped: number; totalQuestions: number }> = {
      human: { total: 0, answered: 0, skipped: 0, totalQuestions: 0 },
      governance: { total: 0, answered: 0, skipped: 0, totalQuestions: 0 },
      organization: { total: 0, answered: 0, skipped: 0, totalQuestions: 0 },
      resources: { total: 0, answered: 0, skipped: 0, totalQuestions: 0 }
    };
    let skippedCount = 0;
    let answeredCount = 0;

    getPanoramaQuestions().forEach((question) => {
      const axis = resolveAxis(question.id);
      if (!axis) return;
      totals[axis].totalQuestions += 1;
      const answer = getAnswerForQuestion(question.id);
      if (answer.status === 'answered' && typeof answer.value === 'number') {
        answeredCount += 1;
        totals[axis].total += answer.value;
        totals[axis].answered += 1;
      } else if (answer.status === 'skipped_intentional') {
        skippedCount += 1;
        totals[axis].skipped += 1;
      }
    });

    const byAxis: NonNullable<P1PanoramaScores['byAxis']> = {
      human: {
        answeredCount: totals.human.answered,
        skippedCount: totals.human.skipped,
        missingCount: Math.max(totals.human.totalQuestions - totals.human.answered - totals.human.skipped, 0),
        totalCount: totals.human.totalQuestions
      },
      governance: {
        answeredCount: totals.governance.answered,
        skippedCount: totals.governance.skipped,
        missingCount: Math.max(
          totals.governance.totalQuestions - totals.governance.answered - totals.governance.skipped,
          0
        ),
        totalCount: totals.governance.totalQuestions
      },
      organization: {
        answeredCount: totals.organization.answered,
        skippedCount: totals.organization.skipped,
        missingCount: Math.max(
          totals.organization.totalQuestions - totals.organization.answered - totals.organization.skipped,
          0
        ),
        totalCount: totals.organization.totalQuestions
      },
      resources: {
        answeredCount: totals.resources.answered,
        skippedCount: totals.resources.skipped,
        missingCount: Math.max(totals.resources.totalQuestions - totals.resources.answered - totals.resources.skipped, 0),
        totalCount: totals.resources.totalQuestions
      }
    };

    const average = (axis: P1Axis) =>
      totals[axis].answered ? Number((totals[axis].total / totals[axis].answered).toFixed(2)) : 0;

    return {
      human: average('human'),
      governance: average('governance'),
      organization: average('organization'),
      resources: average('resources'),
      answeredCount,
      skippedCount,
      byAxis
    };
  };

  const computeBlockScores = (blockId: string): P1BlockScores => {
    const questions = getBlockQuestions(blockId);
    let answeredCount = 0;
    let skippedCount = 0;
    let unseenCount = 0;
    const themes: Record<string, { total: number; count: number }> = {};
    const map = blockThemeMap[blockId] ?? {};

    questions.forEach((question) => {
      const theme = map[question.id] ?? 'default';
      if (!themes[theme]) themes[theme] = { total: 0, count: 0 };
      const answer = getAnswerForQuestion(question.id);
      if (answer.status === 'answered' && typeof answer.value === 'number') {
        answeredCount += 1;
        themes[theme].total += answer.value;
        themes[theme].count += 1;
      } else if (answer.status === 'skipped_intentional') {
        skippedCount += 1;
      } else {
        unseenCount += 1;
      }
    });

    const themeAverages: Record<string, { average: number; count: number }> = {};
    Object.entries(themes).forEach(([theme, data]) => {
      themeAverages[theme] = {
        average: data.count ? Number((data.total / data.count).toFixed(2)) : 0,
        count: data.count
      };
    });

    return { answeredCount, skippedCount, unseenCount, themes: themeAverages };
  };

  const computeGlobalScores = (): P1GlobalScores => {
    const blocks: Record<string, P1BlockScores> = {};
    legacyBlockIds.forEach((blockId) => {
      blocks[blockId] = computeBlockScores(blockId);
    });
    return {
      panorama: computePanoramaScores(),
      blocks
    };
  };

  const mapTensionToBand = (avgTension: number): P1TensionBand => {
    if (avgTension <= 1) return 'low';
    if (avgTension === 2) return 'medium';
    if (avgTension === 3) return 'high';
    return 'very_high';
  };

  const getP1BlockBands = (): P1BlockBands => {
    const computeAverageValue = (block: P1BlockScores | null): number => {
      if (!block) return 0;
      const totals = Object.values(block.themes ?? {}).reduce(
        (acc, theme) => {
          acc.total += (theme.average ?? 0) * (theme.count ?? 0);
          acc.count += theme.count ?? 0;
          return acc;
        },
        { total: 0, count: 0 }
      );
      if (!totals.count) return 0;
      return totals.total / totals.count;
    };

    const blockB1 = computeBlockScores('b1');
    const blockB3 = computeBlockScores('b3');
    const avgB1 = Math.min(4, Math.max(0, computeAverageValue(blockB1) - 1));
    const avgB3 = Math.min(4, Math.max(0, computeAverageValue(blockB3) - 1));

    // Expose les bands de tension P1 par bloc (B1/B3) à partir des scores agrégés.
    // Ne lit jamais les réponses brutes ni le storage ; usage exclusif pour l’UI (plan d’action, etc.).
    return {
      B1: blockB1 ? mapTensionToBand(Math.round(avgB1)) : undefined,
      B3: blockB3 ? mapTensionToBand(Math.round(avgB3)) : undefined
    };
  };

  const getP1PatternInputs = (): P1PatternInput[] => {
    return P1_QUESTIONS_V1_3.map((question) => {
      const answer = getAnswerForQuestion(question.id);
      const tensionScore =
        answer.status === 'answered' && typeof answer.value === 'number'
          ? computeTensionScore(answer.value, question.polarity)
          : undefined;
      return {
        question,
        answer,
        tensionScore
      };
    });
  };

  const getPanoramaScoresOrNull = (): P1PanoramaScores | null => {
    const scores = computePanoramaScores();
    const treatedCount = (scores.answeredCount ?? 0) + (scores.skippedCount ?? 0);
    if (treatedCount <= 0) return null;
    return scores;
  };

  const hasPanoramaScores = () => Boolean(getPanoramaScoresOrNull());

  return {
    symptomAnswers,
    vucaAnswers,
    setSymptomAnswer,
    setVucaAnswer,
    clearAllAnswers,
    computeSymptomScores,
    computeVucaProfile,
    panoramaAnswers,
    blockAnswers,
    setPanoramaAnswer,
    setBlockAnswer,
    computePanoramaScores,
    computeBlockScores,
    computeGlobalScores,
    resetAll: clearAllAnswers,
    getP1PatternInputs,
    getP1BlockBands,
    getPanoramaScoresOrNull,
    hasPanoramaScores
  };
}
