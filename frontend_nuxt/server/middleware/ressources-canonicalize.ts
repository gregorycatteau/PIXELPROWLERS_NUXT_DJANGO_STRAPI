import { defineEventHandler, getQuery, getRequestURL, sendRedirect, setHeader, setResponseStatus } from 'h3';
import { parseResourcesDeepLinkWithMeta } from '@/utils/deeplinks/resourcesDeepLink';

const MAX_QUERYSTRING_LENGTH = 1024;

const isFlagEnabled = () =>
  process.env.NUXT_PUBLIC_RESOURCES_SSR_CANON === '1' ||
  process.env.NUXT_RESOURCES_SSR_CANON === '1';

const buildPathWithQuery = (path: string, query: Record<string, string>): string => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string' && value.length > 0) {
      params.append(key, value);
    }
  }
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};

const ensureRessourcesLocation = (location: string): string =>
  location.startsWith('/ressources') ? location : '/ressources';

export default defineEventHandler((event) => {
  if (!isFlagEnabled()) return;

  const url = getRequestURL(event);
  const path = url.pathname;
  if (!path.startsWith('/ressources')) return;

  if (url.search.length > MAX_QUERYSTRING_LENGTH) {
    setHeader(event, 'Cache-Control', 'no-store');
    setResponseStatus(event, 404);
    return 'Not Found';
  }

  if (path === '/ressources' || path === '/ressources/') {
    const canonical = parseResourcesDeepLinkWithMeta(getQuery(event), `${path}${url.search}`);
    if (!canonical.shouldReplace) return;
    if (canonical.reasonCodes.includes('too_long')) {
      setHeader(event, 'Cache-Control', 'no-store');
      setResponseStatus(event, 404);
      return 'Not Found';
    }
    const canonicalQuery = typeof canonical.canonicalRoute === 'string'
      ? {}
      : (canonical.canonicalRoute.query ?? {});
    const location = buildPathWithQuery('/ressources', canonicalQuery as Record<string, string>);
    const safeLocation = ensureRessourcesLocation(location);
    if (safeLocation === `${path}${url.search}`) return;
    setHeader(event, 'Cache-Control', 'no-store');
    return sendRedirect(event, safeLocation, 307);
  }

  if (url.search.length > 0) {
    const safeLocation = ensureRessourcesLocation(path);
    setHeader(event, 'Cache-Control', 'no-store');
    return sendRedirect(event, safeLocation, 307);
  }
});
