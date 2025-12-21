import { ref, type Ref } from 'vue';
import { P1_QUESTIONS_V1_3 } from '@/config/journeys/p1QuestionsV1_3';
import type { P1FollowupsMeta } from '@/types/p1Meta';
import type {
  P1Axis,
  P1BlockScores,
  P1GlobalScores,
  P1PanoramaScores,
  P1PanoramaAxis,
  SymptomScores,
  VucaProfile
} from '~/composables/useJourneyDiagnostics';

export interface P1ScoresStorage {
  panorama?: P1PanoramaScores;
  blocks?: Record<string, P1BlockScores>;
  global?: P1GlobalScores;
  legacy?: {
    symptomScores?: SymptomScores;
    vucaProfile?: VucaProfile;
  };
}

export interface P1MetaStorage {
  lastCompletedAt?: string | null;
  lastStepId?: string | null;
  panoramaCompleted?: boolean;
  completedBlocks?: string[];
  schemaVersion?: string;
  q1Completed?: boolean; // legacy
  q2Completed?: boolean; // legacy
  followups?: P1FollowupsMeta;
}

export interface UseDiagnosticStorageOptions {
  journeyId: string; // 'p1'
}

export interface UseDiagnosticStorageResult {
  scores: Ref<P1ScoresStorage | null>;
  meta: Ref<P1MetaStorage | null>;

  saveScores: (scores: Partial<P1ScoresStorage>) => void;
  saveMeta: (meta: Partial<P1MetaStorage>) => void;

  loadFromStorage: () => void;
  clearAll: () => void;
}

type P1AxisScoresV1_3 = {
  axisId: string;
  averageTension?: number;
  answeredCount: number;
  skippedIntentionalCount: number;
  missingCount: number;
};

type P1BlockScoresV1_3 = {
  blockId: string;
  averageTension?: number;
  answeredCount: number;
  skippedIntentionalCount: number;
  missingCount: number;
  // Optionnel : agrégats par thèmes (agrégats seulement, jamais de réponses brutes)
  themes?: Record<string, { average: number; count: number }>;
};

// Stockage P1 V1.3 : agrégats uniquement, aucune valeur brute ni mapping questionId -> réponse.
type P1ScoresStoredV1_3 = {
  schemaVersion: string; // P1_SCHEMA_VERSION
  axes: P1AxisScoresV1_3[];
  blocks: P1BlockScoresV1_3[];
  patternTags?: string[];
  // Compat UI : agrégats legacy conservés en mémoire pour ne pas casser l’UI existante.
  runtime?: P1ScoresStorage;
};

// Meta P1 V1.3 : uniquement des marqueurs de progression, jamais de réponses détaillées.
type P1MetaStoredV1_3 = {
  schemaVersion: string; // P1_SCHEMA_VERSION
  lastCompletedAt?: string; // ISO
  lastStepId?: string;
  panoramaCompleted?: boolean;
  completedBlocks?: string[];
  followups?: P1FollowupsMeta;
};

type StoredScoresPayload = {
  data: unknown;
  updatedAt: number;
};

type StoredMetaPayload = {
  data: unknown;
  updatedAt: number;
};

const LEGACY_SCORES_KEY = 'pp_diag_v1_scores';
const LEGACY_META_KEY = 'pp_diag_v1_meta';
const P1_SCHEMA_VERSION = 'p1_v1.3';
const P1_SCORES_KEY_V1_3 = 'pp_journey_p1_scores_v1_3';
const P1_META_KEY_V1_3 = 'pp_journey_p1_meta_v1_3';
const P1_SCORES_KEY_V1_2 = 'pp_journey_p1_scores_v1';
const P1_META_KEY_V1_2 = 'pp_journey_p1_meta_v1';
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // ~30 jours
const PANORAMA_AXES: P1PanoramaAxis[] = ['human', 'movement', 'decisions', 'structure'];

const STORAGE_KEYS: Record<
  string,
  {
    scores: string;
    meta: string;
  }
> = {};

const parseJson = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const readJson = (key: string) => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
};

const saveJson = (key: string, data: unknown) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const removeKey = (key: string) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(key);
};

const defaultMeta = (): P1MetaStorage => ({
  lastCompletedAt: null,
  panoramaCompleted: false,
  completedBlocks: [],
  schemaVersion: P1_SCHEMA_VERSION,
  lastStepId: null
});

const p1AxisQuestionCount: Record<string, number> = P1_QUESTIONS_V1_3.reduce((acc, q) => {
  acc[q.axis] = (acc[q.axis] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

const p1PanoramaAxisQuestionCount: Record<string, number> = P1_QUESTIONS_V1_3.filter(
  (q) => q.blockId === 'GLOBAL' && q.stepId === 'E1'
).reduce((acc, q) => {
  acc[q.axis] = (acc[q.axis] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

const p1BlockQuestionCount: Record<string, number> = P1_QUESTIONS_V1_3.reduce((acc, q) => {
  acc[q.blockId] = (acc[q.blockId] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

const computeBlockAverage = (block: P1BlockScores | undefined) => {
  if (!block) return undefined;
  const totals = Object.values(block.themes ?? {}).reduce(
    (acc, curr) => {
      acc.total += curr.average * curr.count;
      acc.count += curr.count;
      return acc;
    },
    { total: 0, count: 0 }
  );
  if (!totals.count) return undefined;
  return Number((totals.total / totals.count).toFixed(2));
};

const buildP1StoredScores = (runtime: P1ScoresStorage | null): P1ScoresStoredV1_3 | null => {
  if (!runtime) return null;
  const axisIds = Object.keys(p1AxisQuestionCount);
  const axisDetails = (runtime.panorama?.byAxis ?? {}) as Record<
    string,
    {
      answeredCount?: number;
      skippedCount?: number;
      missingCount?: number;
      totalCount?: number;
    }
  >;
  const getAxisCounts = (axisId: string) => {
    const stats = axisDetails[axisId];
    const totalQuestions =
      stats?.totalCount ?? p1PanoramaAxisQuestionCount[axisId] ?? p1AxisQuestionCount[axisId] ?? 0;
    const answeredCount = stats?.answeredCount ?? 0;
    const skippedIntentionalCount = stats?.skippedCount ?? 0;
    const missingCount =
      stats?.missingCount ?? Math.max(totalQuestions - answeredCount - skippedIntentionalCount, 0);
    return { answeredCount, skippedIntentionalCount, missingCount };
  };
  const axes: P1AxisScoresV1_3[] = axisIds.map((axisId) => ({
    axisId,
    averageTension: (runtime.panorama as any)?.[axisId],
    ...getAxisCounts(axisId)
  }));

  const blocks: P1BlockScoresV1_3[] = Object.entries(runtime.blocks ?? {}).map(([blockId, blockScores]) => {
    const totalQuestions = p1BlockQuestionCount[blockId.toUpperCase()] ?? blockScores.answeredCount + blockScores.skippedCount + blockScores.unseenCount;
    const missingCount = Math.max(totalQuestions - blockScores.answeredCount - blockScores.skippedCount, blockScores.unseenCount);
    return {
      blockId,
      averageTension: computeBlockAverage(blockScores),
      answeredCount: blockScores.answeredCount ?? 0,
      skippedIntentionalCount: blockScores.skippedCount ?? 0,
      missingCount,
      themes: blockScores.themes
    };
  });

  return {
    schemaVersion: P1_SCHEMA_VERSION,
    axes,
    blocks,
    runtime
  };
};

const buildPanoramaFromAxes = (axes?: P1AxisScoresV1_3[] | null): P1PanoramaScores | null => {
  if (!Array.isArray(axes)) return null;
  const panorama: P1PanoramaScores = {
    human: 0,
    movement: 0,
    decisions: 0,
    structure: 0,
    answeredCount: 0,
    skippedCount: 0
  };
  let hasAxis = false;
  PANORAMA_AXES.forEach((axisId) => {
    const entry = axes.find((axis) => axis.axisId === axisId);
    if (!entry) return;
    if (typeof entry.averageTension === 'number') {
      (panorama as any)[axisId] = Number(entry.averageTension);
      hasAxis = true;
    }
    panorama.answeredCount += entry.answeredCount ?? 0;
    panorama.skippedCount += entry.skippedIntentionalCount ?? 0;
  });
  if (!hasAxis && panorama.answeredCount === 0 && panorama.skippedCount === 0) return null;
  return panorama;
};

const hydrateP1RuntimeFromStored = (stored: P1ScoresStoredV1_3 | null): P1ScoresStorage | null => {
  if (!stored) return null;
  if (stored.runtime) return stored.runtime;
  const panorama = buildPanoramaFromAxes(stored.axes);
  if (panorama) return { panorama };
  return null;
};

const isExpired = (lastCompletedAt?: string | null, updatedAt?: number | null) => {
  const refDate = lastCompletedAt ? Date.parse(lastCompletedAt) : updatedAt;
  if (!refDate) return true;
  return Date.now() - refDate > TTL_MS;
};

const resolveKeys = (journeyId: string) => {
  if (journeyId === 'p1') {
    return {
      scores: P1_SCORES_KEY_V1_3,
      meta: P1_META_KEY_V1_3
    };
  }
  const keys = STORAGE_KEYS[journeyId];
  if (!keys) {
    throw new Error(`Storage keys not defined for journey ${journeyId}`);
  }
  return keys;
};

const purgeLegacyKeys = () => {
  removeKey(LEGACY_SCORES_KEY);
  removeKey(LEGACY_META_KEY);
};

const purgeP1OldKeys = () => {
  removeKey(P1_SCORES_KEY_V1_2);
  removeKey(P1_META_KEY_V1_2);
};

const storeCache: Record<
  string,
  {
    scores: Ref<P1ScoresStorage | null>;
    meta: Ref<P1MetaStorage | null>;
    initialized: boolean;
  }
> = {};

export function useDiagnosticStorage(options: UseDiagnosticStorageOptions): UseDiagnosticStorageResult {
  const { journeyId } = options;
  const { scores: scoresKey, meta: metaKey } = resolveKeys(journeyId);

  if (!storeCache[journeyId]) {
    storeCache[journeyId] = {
      scores: ref<P1ScoresStorage | null>(null),
      meta: ref<P1MetaStorage | null>(null),
      initialized: false
    };
  }

  const cache = storeCache[journeyId]!;
  const scores = cache.scores;
  const meta = cache.meta;

  const loadFromStorage = () => {
    purgeLegacyKeys();
    if (journeyId === 'p1') {
      purgeP1OldKeys(); // Migration P1 V1.2 → V1.3 : reset complet des anciennes données pour éviter tout mélange de schémas.
      const storedScores = parseJson<StoredScoresPayload>(readJson(scoresKey)) as StoredScoresPayload | null;
      const storedMeta = parseJson<StoredMetaPayload>(readJson(metaKey)) as StoredMetaPayload | null;
      const typedMeta = storedMeta?.data as P1MetaStoredV1_3 | undefined;
      const updatedAt = (storedScores?.updatedAt ?? storedMeta?.updatedAt) ?? null;
      const expired = isExpired(typedMeta?.lastCompletedAt, updatedAt);
      if (expired) {
        clearAll();
        return;
      }
      const typedScores = storedScores?.data as P1ScoresStoredV1_3 | undefined;
      const scoresSchemaOk = typedScores?.schemaVersion === P1_SCHEMA_VERSION;
      const metaSchemaOk = typedMeta?.schemaVersion === P1_SCHEMA_VERSION;

      if (!scoresSchemaOk) {
        // Pas de scores valides pour P1 → purge
        clearAll();
        return;
      }

      // Hydrate les scores runtime depuis le stockage P1 V1.3
      scores.value = hydrateP1RuntimeFromStored(typedScores ?? null);

      // Métadonnées: si absentes ou schéma différent, on ne bloque pas l'affichage du bilan
      // On reconstruit un minimum de meta pour éviter de vider des scores valides.
      if (metaSchemaOk) {
        meta.value = (typedMeta as P1MetaStorage) ?? null;
      } else {
        const scoresUpdatedAt = storedScores?.updatedAt ?? null;
        meta.value = {
          ...defaultMeta(),
          lastCompletedAt: typedMeta?.lastCompletedAt ?? (scoresUpdatedAt ? new Date(scoresUpdatedAt).toISOString() : null),
          schemaVersion: P1_SCHEMA_VERSION,
          panoramaCompleted: Boolean((scores.value as any)?.panorama)
        };
      }

      cache.initialized = true;
      return;
    }

    const storedScores = parseJson<StoredScoresPayload>(readJson(scoresKey));
    const storedMeta = parseJson<StoredMetaPayload>(readJson(metaKey));

    const expired = isExpired(
      (storedMeta?.data as P1MetaStorage | undefined)?.lastCompletedAt,
      (storedScores?.updatedAt ?? storedMeta?.updatedAt) ?? null
    );
    if (expired) {
      clearAll();
      return;
    }

    scores.value = (storedScores?.data as P1ScoresStorage) ?? null;
    meta.value = (storedMeta?.data as P1MetaStorage) ?? null;
    cache.initialized = true;
  };

  const ensureLoaded = () => {
    if (!cache.initialized) {
      loadFromStorage();
    }
  };

  const saveMeta = (metaPatch: Partial<P1MetaStorage>) => {
    ensureLoaded();
    const nextMeta: P1MetaStorage = {
      ...defaultMeta(),
      ...(meta.value ?? {}),
      ...metaPatch
    };

    if (journeyId === 'p1') {
      const storedMeta: P1MetaStoredV1_3 = {
        schemaVersion: P1_SCHEMA_VERSION,
        lastCompletedAt: nextMeta.lastCompletedAt ?? undefined,
        lastStepId: nextMeta.lastStepId ?? undefined,
        panoramaCompleted: nextMeta.panoramaCompleted ?? undefined,
        completedBlocks: nextMeta.completedBlocks ?? []
      };
      const payload: StoredMetaPayload = {
        data: storedMeta,
        updatedAt: Date.now()
      };
      saveJson(metaKey, payload);
      meta.value = nextMeta;
      return;
    }

    const payload: StoredMetaPayload = {
      data: nextMeta,
      updatedAt: Date.now()
    };
    saveJson(metaKey, payload);
    meta.value = nextMeta;
  };

  const saveScores = (payloadScores: Partial<P1ScoresStorage>) => {
    ensureLoaded();
    const nextScores: P1ScoresStorage = {
      ...(scores.value ?? {}),
      ...payloadScores
    };

    if (journeyId === 'p1') {
      const stored = buildP1StoredScores(nextScores);
      const payload: StoredScoresPayload = {
        data: stored,
        updatedAt: Date.now()
      };
      saveJson(scoresKey, payload);
      scores.value = nextScores;
      saveMeta({ lastCompletedAt: new Date().toISOString(), schemaVersion: P1_SCHEMA_VERSION });
      return;
    }

    const payload: StoredScoresPayload = {
      data: nextScores,
      updatedAt: Date.now()
    };
    saveJson(scoresKey, payload);
    scores.value = nextScores;
    saveMeta({ lastCompletedAt: new Date().toISOString() });
  };

  const clearAll = () => {
    removeKey(scoresKey);
    removeKey(metaKey);
    if (journeyId === 'p1') {
      purgeP1OldKeys(); // Ce reset doit effacer toutes les données locales P1, toutes versions confondues (V1.2 + V1.3).
    }
    scores.value = null;
    meta.value = null;
    cache.initialized = false;
  };

  return {
    scores,
    meta,
    saveScores,
    saveMeta,
    loadFromStorage,
    clearAll
  };
}
