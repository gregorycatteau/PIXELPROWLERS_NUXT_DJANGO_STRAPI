const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const SCHEME_PATTERNS = [
  /\bjavascript\s*:/i,
  /\bdata\s*:/i,
  /\bmailto\s*:/i,
  /\btel\s*:/i,
  /\bblob\s*:/i,
  /\bfile\s*:/i,
  /\bws\s*:/i,
  /\bwss\s*:/i,
  /\bhttp\s*:/i,
  /\bhttps\s*:/i
];

export const assertNoControlChars = (value: string) => {
  if (CONTROL_CHARS.test(value)) {
    throw new Error('Unsafe data-only string.');
  }
};

export const assertNoSchemes = (value: string) => {
  const lower = value.toLowerCase();
  if (lower.includes('//')) {
    throw new Error('Unsafe data-only string.');
  }
  if (SCHEME_PATTERNS.some((pattern) => pattern.test(lower))) {
    throw new Error('Unsafe data-only string.');
  }
};

export const assertNoHtmlLike = (value: string) => {
  if (value.includes('<')) {
    throw new Error('Unsafe data-only string.');
  }
};

export const assertSafeDataOnlyString = (value: string) => {
  assertNoControlChars(value);
  assertNoSchemes(value);
  assertNoHtmlLike(value);
};
