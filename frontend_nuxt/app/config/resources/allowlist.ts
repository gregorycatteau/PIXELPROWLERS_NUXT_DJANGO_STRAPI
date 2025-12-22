export const RESOURCE_FILEPATH_ALLOWLIST = ['/resources/'] as const;

export const isAllowlistedResourcePath = (filePath: string): boolean => {
  return RESOURCE_FILEPATH_ALLOWLIST.some((prefix) => filePath.startsWith(prefix));
};
