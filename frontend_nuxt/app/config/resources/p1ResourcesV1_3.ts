// P1 V1.3 — Registry front-only des ressources téléchargeables.
// Ne jamais logger ni enrichir ces données avec des infos utilisateur.

export type P1ResourceId =
  | 'kit_p1_demarrage'
  | 'kit_mission_cash'
  | 'kit_gouvernance_veto'
  | 'kit_dependance_mortelle'
  | 'kit_capacite_reelle'
  | 'kit_pilotage_reporting'
  | 'kit_controles_internes';

export type P1Resource = {
  id: P1ResourceId;
  title: string;
  summary: string;
  filePath: string;
  tags: string[];
  relatedCards?: (
    | 'mission_cash'
    | 'gouvernance_decision'
    | 'dependance_mortelle'
    | 'capacite_reelle'
    | 'pilotage_reporting'
    | 'controles_internes'
  )[];
  timeToUse?: string;
  format?: string;
};

export const P1_RESOURCES_V1_3: P1Resource[] = [
  {
    id: 'kit_p1_demarrage',
    title: 'Kit P1 — Démarrage rapide',
    summary: 'Poser un cadrage express, choisir une première vérif et documenter en 30 min.',
    filePath: '/resources/p1/kit_p1_demarrage.md',
    tags: ['p1', 'démarrage', 'priorisation', 'flash'],
    timeToUse: '30 min',
    format: 'Markdown'
  },
  {
    id: 'kit_mission_cash',
    title: 'Kit — Mission ↔ cash',
    summary: 'Règle d’arbitrage mission/financement et contrôle de son application.',
    filePath: '/resources/p1/kit_mission_cash.md',
    tags: ['p1', 'gouvernance', 'mission', 'budget'],
    relatedCards: ['mission_cash'],
    timeToUse: '45 min',
    format: 'Markdown'
  },
  {
    id: 'kit_gouvernance_veto',
    title: 'Kit — Gouvernance & veto',
    summary: 'Clarifier qui tranche, qui peut dire non et où chaque décision est consignée.',
    filePath: '/resources/p1/kit_gouvernance_veto.md',
    tags: ['p1', 'gouvernance', 'décision', 'traçabilité'],
    relatedCards: ['gouvernance_decision', 'mission_cash'],
    timeToUse: '45 min',
    format: 'Markdown'
  },
  {
    id: 'kit_dependance_mortelle',
    title: 'Kit — Dépendance mortelle',
    summary: 'Identifier la dépendance critique et préparer un plan B activable.',
    filePath: '/resources/p1/kit_dependance_mortelle.md',
    tags: ['p1', 'risque', 'plan B', 'résilience'],
    relatedCards: ['dependance_mortelle'],
    timeToUse: '45 min',
    format: 'Markdown'
  },
  {
    id: 'kit_capacite_reelle',
    title: 'Kit — Capacité réelle',
    summary: 'Mesurer la capacité tenable et décider quoi couper quand ça dépasse.',
    filePath: '/resources/p1/kit_capacite_reelle.md',
    tags: ['p1', 'charge', 'priorisation', 'soutenable'],
    relatedCards: ['capacite_reelle'],
    timeToUse: '40 min',
    format: 'Markdown'
  },
  {
    id: 'kit_pilotage_reporting',
    title: 'Kit — Pilotage & reporting',
    summary: 'Choisir 3 métriques qui déclenchent une décision, pas un reporting décoratif.',
    filePath: '/resources/p1/kit_pilotage_reporting.md',
    tags: ['p1', 'pilotage', 'reporting', 'gouvernance'],
    relatedCards: ['pilotage_reporting'],
    timeToUse: '40 min',
    format: 'Markdown'
  },
  {
    id: 'kit_controles_internes',
    title: 'Kit — Contrôles & sécurité',
    summary: 'Repérer la faille la plus contournable et sécuriser le parcours de validation.',
    filePath: '/resources/p1/kit_controles_internes.md',
    tags: ['p1', 'contrôles', 'sécurité', 'process'],
    relatedCards: ['controles_internes'],
    timeToUse: '40 min',
    format: 'Markdown'
  }
] as const;
