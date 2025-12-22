import { ref, type Ref } from 'vue';
import { getManifestById } from '~/config/journeys/manifests/registry';

export type CorePanoramaAxisCounts = {
  answeredCount: number;
  skippedCount: number;
  missingCount: number;
  totalCount: number;
  score: number;
};

export type CorePanoramaScores = {
  answeredCount: number;
  skippedCount: number;
  byAxis: Record<string, CorePanoramaAxisCounts>;
};

export type CoreScoresStorage = {
  schemaVersion: string;
  panorama?: CorePanoramaScores;
};

export type CoreMetaStorage = {
  schemaVersion: string;
  lastStepId?: string | null;
  panoramaCompleted?: boolean;
};

export interface UseCoreJourneyStorageOptions {
  journeyId: string;
}

export interface UseCoreJourneyStorageResult {
  scores: Ref<CoreScoresStorage | null>;
  meta: Ref<CoreMetaStorage | null>;
  saveScores: (scores: Partial<CoreScoresStorage>) => void;
  saveMeta: (meta: Partial<CoreMetaStorage>) => void;
  loadFromStorage: () => void;
  clearAll: () => void;
}

type StoredPayload = {
  data: unknown;
  updatedAt: number;
};

const TTL_MS = 1000 * 60 * 60 * 24 * 30;

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

const isFresh = (payload?: StoredPayload | null) => {
  if (!payload?.updatedAt) return false;
  return Date.now() - payload.updatedAt <= TTL_MS;
};

export const useCoreJourneyStorage = (options: UseCoreJourneyStorageOptions): UseCoreJourneyStorageResult => {
  const scores = ref<CoreScoresStorage | null>(null);
  const meta = ref<CoreMetaStorage | null>(null);
  const manifest = getManifestById(options.journeyId);
  const scoresKey = manifest?.storage.scoresKey ?? `pp_journey_${options.journeyId}_scores_v1_0`;
  const metaKey = manifest?.storage.metaKey ?? `pp_journey_${options.journeyId}_meta_v1_0`;
  const schemaVersion = manifest?.storage.schemaVersion ?? `${options.journeyId}_v1.0`;

  const loadFromStorage = () => {
    const storedScores = parseJson<StoredPayload>(readJson(scoresKey));
    const storedMeta = parseJson<StoredPayload>(readJson(metaKey));

    if (storedScores && isFresh(storedScores)) {
      const payload = storedScores.data as CoreScoresStorage | null;
      scores.value = payload?.schemaVersion === schemaVersion ? payload : null;
    } else {
      scores.value = null;
    }

    if (storedMeta && isFresh(storedMeta)) {
      const payload = storedMeta.data as CoreMetaStorage | null;
      meta.value = payload?.schemaVersion === schemaVersion ? payload : null;
    } else {
      meta.value = null;
    }
  };

  const saveScores = (payload: Partial<CoreScoresStorage>) => {
    const next: CoreScoresStorage = {
      schemaVersion,
      ...(scores.value ?? {}),
      ...payload
    };
    scores.value = next;
    saveJson(scoresKey, { data: next, updatedAt: Date.now() });
  };

  const saveMeta = (payload: Partial<CoreMetaStorage>) => {
    const next: CoreMetaStorage = {
      schemaVersion,
      ...(meta.value ?? {}),
      ...payload
    };
    meta.value = next;
    saveJson(metaKey, { data: next, updatedAt: Date.now() });
  };

  const clearAll = () => {
    scores.value = null;
    meta.value = null;
    removeKey(scoresKey);
    removeKey(metaKey);
  };

  return {
    scores,
    meta,
    saveScores,
    saveMeta,
    loadFromStorage,
    clearAll
  };
};
