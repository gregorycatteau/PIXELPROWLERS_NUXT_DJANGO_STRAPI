import type { JourneyManifestV1 } from './manifests/types';

export type JourneyVisibilityContext = {
  isDev: boolean;
  devAllowlist?: string | null;
};

const normalizeAllowlist = (value?: string | null): Set<string> => {
  const raw = (value ?? '').trim();
  if (!raw) return new Set();
  if (raw === '*' || raw.toLowerCase() === 'all') {
    return new Set(['*']);
  }
  return new Set(raw.split(',').map((entry) => entry.trim()).filter(Boolean));
};

export const isJourneyAllowedInCurrentEnv = (
  manifest: JourneyManifestV1 | null | undefined,
  context: JourneyVisibilityContext
): boolean => {
  if (!manifest) return false;
  if (manifest.visibility === 'prod') return true;
  if (!context.isDev) return false;
  const allowlist = normalizeAllowlist(context.devAllowlist);
  if (allowlist.has('*')) return true;
  return allowlist.has(manifest.id) || allowlist.has(manifest.slug);
};
