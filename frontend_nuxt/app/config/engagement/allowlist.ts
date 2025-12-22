const ROUTE_CHARS = /^[a-zA-Z0-9/_\\-\\?&=#%\\.]*$/;

export const ENGAGEMENT_ROUTE_ALLOWLIST = ['/parcours', '/contact', '/ressources'] as const;

export const validateRoutePath = (routePath: string) => {
  if (!routePath.startsWith('/')) throw new Error('Invalid routePath.');
  if (routePath.includes('..') || routePath.includes('//') || routePath.includes('\\')) {
    throw new Error('Invalid routePath.');
  }
  if (!ROUTE_CHARS.test(routePath)) throw new Error('Invalid routePath.');
  if (routePath.length > 200) throw new Error('Invalid routePath.');
};

export const isAllowlistedEngagementRoute = (routePath: string): boolean => {
  try {
    validateRoutePath(routePath);
  } catch {
    return false;
  }
  return ENGAGEMENT_ROUTE_ALLOWLIST.some((prefix) => routePath.startsWith(prefix));
};
