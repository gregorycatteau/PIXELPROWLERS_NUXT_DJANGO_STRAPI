const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\u2060\uFEFF]/;

const formatCodePoint = (value: string) => {
  const code = value.codePointAt(0);
  if (!code) return 'U+0000';
  return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
};

export const normalizeForSecurityScan = (value: string): string => {
  const normalized = value.normalize('NFKC');
  const match = normalized.match(ZERO_WIDTH_CHARS);
  if (match) {
    throw new Error(`Zero-width/invisible characters detected (${formatCodePoint(match[0])}).`);
  }
  return normalized;
};
