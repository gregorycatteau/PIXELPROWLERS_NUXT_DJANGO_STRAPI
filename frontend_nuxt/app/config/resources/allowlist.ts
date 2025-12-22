const PATH_CHARS = /^[a-zA-Z0-9/_\\-\\?&=#%\\.]*$/;

export const RESOURCE_FILEPATH_ALLOWLIST = ['/resources/'] as const;

export const validateFilePath = (filePath: string) => {
  if (!filePath.startsWith('/resources/')) throw new Error('Invalid filePath.');
  if (filePath.includes('..') || filePath.includes('//') || filePath.includes('\\')) {
    throw new Error('Invalid filePath.');
  }
  if (!PATH_CHARS.test(filePath)) throw new Error('Invalid filePath.');
  if (filePath.length > 200) throw new Error('Invalid filePath.');
};

export const isAllowlistedResourcePath = (filePath: string): boolean => {
  try {
    validateFilePath(filePath);
  } catch {
    return false;
  }
  return RESOURCE_FILEPATH_ALLOWLIST.some((prefix) => filePath.startsWith(prefix));
};
