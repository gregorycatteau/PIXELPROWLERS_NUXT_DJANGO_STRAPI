import { listEngagementPacks } from '../app/config/engagement/registry';
import { isAllowlistedEngagementRoute } from '../app/config/engagement/allowlist';
import type { CtaTarget } from '../app/config/engagement/types';

const CTA_TARGETS: CtaTarget[] = ['none', 'contact', 'resources', 'export', 'route'];

const isSafeRoute = (routePath?: string): boolean => {
  if (!routePath) return false;
  if (/^https?:\/\//i.test(routePath)) return false;
  return isAllowlistedEngagementRoute(routePath);
};

const assertValidPack = (journeyId: string) => {
  const pack = listEngagementPacks().find((entry) => entry.journeyId === journeyId)?.pack;
  if (!pack) {
    throw new Error('Engagement guard failed.');
  }
  const levels = pack.levels;
  for (const level of Object.values(levels)) {
    if (!CTA_TARGETS.includes(level.ctaTarget)) {
      throw new Error('Engagement guard failed.');
    }
    if (level.ctaTarget === 'route' && !isSafeRoute(level.routePath)) {
      throw new Error('Engagement guard failed.');
    }
  }
};

const main = () => {
  try {
    const entries = listEngagementPacks();
    entries.forEach((entry) => assertValidPack(entry.journeyId));
    console.log('Engagement guard OK');
  } catch {
    console.error('Engagement guard failed.');
    process.exit(1);
  }
};

main();
