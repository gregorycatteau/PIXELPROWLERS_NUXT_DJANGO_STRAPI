import { defineEventHandler, getQuery, getRequestURL, sendRedirect, setResponseStatus } from 'h3';
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

export default defineEventHandler((event) => {
  if (!isFlagEnabled()) return;

  const url = getRequestURL(event);
  const path = url.pathname;
  if (!path.startsWith('/ressources')) return;

  if (url.search.length > MAX_QUERYSTRING_LENGTH) {
    setResponseStatus(event, 404);
    return 'Not Found';
  }

  if (path === '/ressources' || path === '/ressources/') {
    const canonical = parseResourcesDeepLinkWithMeta(getQuery(event), `${path}${url.search}`);
    if (!canonical.shouldReplace) return;
    if (canonical.reasonCodes.includes('too_long')) {
      setResponseStatus(event, 404);
      return 'Not Found';
    }
    const canonicalQuery = typeof canonical.canonicalRoute === 'string'
      ? {}
      : (canonical.canonicalRoute.query ?? {});
    const location = buildPathWithQuery('/ressources', canonicalQuery as Record<string, string>);
    if (location === `${path}${url.search}`) return;
    return sendRedirect(event, location, 307);
  }

  if (url.search.length > 0) {
    return sendRedirect(event, path, 307);
  }
});
