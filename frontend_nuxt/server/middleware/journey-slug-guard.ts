import { createError, defineEventHandler } from 'h3';
import { getManifestBySlug } from '~/config/journeys/manifests/registry';
import { isJourneyAllowedInCurrentEnv } from '~/config/journeys/visibility';

const PATH_PREFIX = '/parcours/';

const getVisibilityContext = () => ({
  isDev: process.env.NODE_ENV !== 'production',
  devAllowlist: process.env.NUXT_PUBLIC_JOURNEYS_DEV_ALLOWLIST
});

const isValidJourneySlug = (slug: string) => {
  if (slug.length < 1 || slug.length > 80) {
    return false;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

export default defineEventHandler((event) => {
  const rawUrl = event.node.req.url ?? '';
  if (!rawUrl.startsWith(PATH_PREFIX)) {
    return;
  }

  const slugRaw = rawUrl.slice(PATH_PREFIX.length).split(/[?#]/, 1)[0];
  if (!slugRaw) {
    return;
  }
  if (/[\\/.%]/.test(slugRaw)) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  let slug = '';
  try {
    slug = decodeURIComponent(slugRaw).trim();
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const manifest = getManifestBySlug(slug);
  if (!isValidJourneySlug(slug) || !isJourneyAllowedInCurrentEnv(manifest, getVisibilityContext())) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
});
