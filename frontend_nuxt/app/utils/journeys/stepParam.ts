const BLOCKED_STEP_IDS = new Set(['__proto__', 'constructor', 'prototype']);

export const parseStepParam = (raw: unknown): string | null => {
  if (typeof raw !== 'string') {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed.length < 1 || trimmed.length > 60) {
    return null;
  }
  if (BLOCKED_STEP_IDS.has(trimmed)) {
    return null;
  }
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed.charCodeAt(i) > 127) {
      return null;
    }
  }
  if (!/^E[0-9]*_[a-z0-9_]+$/.test(trimmed)) {
    return null;
  }
  return trimmed;
};
