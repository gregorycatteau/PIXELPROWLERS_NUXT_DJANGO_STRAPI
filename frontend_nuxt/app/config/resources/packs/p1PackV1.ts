export const P1_PACK_V1_SLUGS = [
  'reunion-30min-sans-noyade',
  'rituel-hebdo-15min',
  'inventaire-acces-30min',
  'decision-log-minimal',
  'compte-rendu-utile-1page',
  'matrice-responsabilites-raci-lite',
  'charte-canaux-3-couleurs',
  'tableau-bord-3-signaux',
  'mfa-partout-en-20min',
  'backups-test-15min',
] as const;

export type P1PackV1Slug = (typeof P1_PACK_V1_SLUGS)[number];
