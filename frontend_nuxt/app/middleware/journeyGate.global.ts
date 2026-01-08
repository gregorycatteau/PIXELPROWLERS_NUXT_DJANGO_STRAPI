import { createError } from 'h3';
import { getManifestBySlug } from '~/config/journeys/manifests/registry';
import { isJourneyIdDisabled } from '~/utils/journeys/isJourneyDisabled';

const normalizeSlug = (raw: unknown) => (typeof raw === 'string' ? raw.trim() : '');
const isParcoursRoute = (path: string) => path.startsWith('/parcours/');

export default defineNuxtRouteMiddleware((to) => {
  if (!isParcoursRoute(to.path)) return;
  const slug = normalizeSlug(to.params.journeySlug);
  if (!slug) return;
  const manifest = getManifestBySlug(slug);
  if (!manifest) return;

  const config = useRuntimeConfig().public.ppJourneysDisabled;
  if (isJourneyIdDisabled(manifest.id, config)) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
});
