export const ENGAGEMENT_ROUTE_ALLOWLIST = ['/parcours', '/contact', '/ressources'] as const;

export const isAllowlistedEngagementRoute = (routePath: string): boolean => {
  return ENGAGEMENT_ROUTE_ALLOWLIST.some((prefix) => routePath.startsWith(prefix));
};
