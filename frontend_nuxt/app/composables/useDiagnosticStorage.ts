import { ref } from 'vue';

type ScoresPayload = {
  axes: Record<string, number>;
  updatedAt: number;
};

type MetaPayload = {
  lastDiagnosticAt: number;
  q1Completed: boolean;
  q2Completed: boolean;
  updatedAt: number;
};

const SCORES_KEY = 'pp_diag_v1_scores';
const META_KEY = 'pp_diag_v1_meta';
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // ~30 jours

const isExpired = (timestamp?: number) => {
  if (!timestamp) return true;
  return Date.now() - timestamp > TTL_MS;
};

const parseJson = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const saveJson = (key: string, data: unknown) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const readJson = (key: string) => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
};

export function useDiagnosticStorage() {
  const persistedScores = ref<ScoresPayload | null>(null);
  const persistedMeta = ref<MetaPayload | null>(null);

  const loadScores = () => {
    const raw = parseJson<ScoresPayload>(readJson(SCORES_KEY));
    if (!raw) {
      persistedScores.value = null;
      return null;
    }
    if (isExpired(raw.updatedAt)) {
      clearScores();
      return null;
    }
    persistedScores.value = raw;
    return raw;
  };

  const saveScores = (axes: Record<string, number>) => {
    const payload: ScoresPayload = { axes, updatedAt: Date.now() };
    saveJson(SCORES_KEY, payload);
    persistedScores.value = payload;
  };

  const clearScores = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SCORES_KEY);
    }
    persistedScores.value = null;
  };

  const loadMeta = () => {
    const raw = parseJson<MetaPayload>(readJson(META_KEY));
    if (!raw) {
      persistedMeta.value = null;
      return null;
    }
    if (isExpired(raw.updatedAt)) {
      clearMeta();
      return null;
    }
    persistedMeta.value = raw;
    return raw;
  };

  const saveMeta = (meta: Omit<MetaPayload, 'updatedAt'>) => {
    const payload: MetaPayload = { ...meta, updatedAt: Date.now() };
    saveJson(META_KEY, payload);
    persistedMeta.value = payload;
  };

  const clearMeta = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(META_KEY);
    }
    persistedMeta.value = null;
  };

  const clearAll = () => {
    clearScores();
    clearMeta();
  };

  return {
    ttlMs: TTL_MS,
    persistedScores,
    persistedMeta,
    loadScores,
    saveScores,
    clearScores,
    loadMeta,
    saveMeta,
    clearMeta,
    clearAll
  };
}
