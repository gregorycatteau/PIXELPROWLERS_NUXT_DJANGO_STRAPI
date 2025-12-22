import type { EngagementPack } from './types';
import { p1EngagementCopy } from '~/config/journeys/p1EngagementCopy';

const p1Pack: EngagementPack = {
  intro: [p1EngagementCopy.globalBilan.intro, p1EngagementCopy.globalBilan.synthesis]
    .filter(Boolean)
    .join('\n\n'),
  levels: {
    n1: {
      title: 'Niveau 1 — Auto-defense solo',
      body: p1EngagementCopy.globalBilan.levelN1,
      ctaLabel: 'Voir les ressources',
      ctaTarget: 'resources'
    },
    n2: {
      title: 'Niveau 2 — Miroir securise',
      body: p1EngagementCopy.globalBilan.levelN2,
      ctaLabel: 'Demander un miroir',
      ctaTarget: 'contact'
    },
    n3: {
      title: 'Niveau 3 — Atelier tactique',
      body: p1EngagementCopy.globalBilan.levelN3,
      ctaLabel: 'Explorer un atelier',
      ctaTarget: 'contact'
    },
    n4: {
      title: 'Niveau 4 — Re-architecture accompagnee',
      body: p1EngagementCopy.globalBilan.levelN4,
      ctaLabel: 'Discuter d un accompagnement',
      ctaTarget: 'contact'
    }
  }
};

const corePack: EngagementPack = {
  intro: 'Tu peux choisir la suite qui te semble la plus realiste pour toi.',
  levels: {
    n1: {
      title: 'Niveau 1 — Mode solo',
      body: 'Relire le bilan et utiliser les ressources en autonomie.',
      ctaLabel: 'Voir les ressources',
      ctaTarget: 'resources'
    },
    n2: {
      title: 'Niveau 2 — Miroir externe',
      body: 'Prendre un temps court pour relire le diagnostic avec un regard externe.',
      ctaLabel: 'Contacter PixelProwlers',
      ctaTarget: 'contact'
    },
    n3: {
      title: 'Niveau 3 — Atelier cible',
      body: 'Explorer un atelier tactique sur un point prioritaire.',
      ctaLabel: 'Discuter d un atelier',
      ctaTarget: 'contact'
    },
    n4: {
      title: 'Niveau 4 — Accompagnement',
      body: 'Evaluer un accompagnement plus structurel, a ton rythme.',
      ctaLabel: 'Ouvrir une discussion',
      ctaTarget: 'contact'
    }
  }
};

const engagementRegistry: Record<string, EngagementPack> = {
  p1: p1Pack,
  p2: corePack,
  p3: corePack,
  p4: corePack
};

export const getEngagementPack = (journeyId: string): EngagementPack | null => {
  return engagementRegistry[journeyId] ?? null;
};
