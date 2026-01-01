export const normalizeResourceSlug = (input: unknown): string | null => {
  if (typeof input !== 'string') return null;
  const normalized = input.normalize('NFKC').trim().toLowerCase();
  if (normalized.length === 0 || normalized.length > 80) return null;
  if (!/^[a-z0-9-]+$/.test(normalized)) return null;
  return normalized;
};
