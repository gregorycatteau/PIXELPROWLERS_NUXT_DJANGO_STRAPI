export const P1_PACK_V1_SLUGS = [
  'scan-structurel-express',
  'tableau-signaux-faibles',
  'checklist-securite-psychologique',
  'protocole-alerte-epuisement',
  'atelier-clarte-decisions',
  'canevas-rituel-feedback',
  'guide-roles-explicites',
  'cadre-arbitrage-mission',
  'kit-outils-coordination',
  'modele-journal-bord',
] as const;

export type P1PackV1Slug = (typeof P1_PACK_V1_SLUGS)[number];
