// P1 V1.3.1 — Atterrissage systémique (front-only)
// Ne jamais logger ces textes avec des données utilisateur, ne jamais les envoyer au backend.

export type P1SystemicTriggerTheme = {
  blockId: 'B1' | 'B3';
  themeId: string;
  minBand: 'medium' | 'high' | 'very_high';
};

export type P1SystemicCard = {
  id: string;
  title: string;
  body: string;
  firstChecks: string[];
  triggers: {
    anyThemes?: P1SystemicTriggerTheme[];
    anyHypotheses?: string[];
  };
};

export const P1_SYSTEMIC_CARDS: P1SystemicCard[] = [
  {
    id: 'mission_cash',
    title: 'Arbitrage mission ↔ cash : est-ce écrit ?',
    body:
      'Quand mission et financement se contredisent, si l’arbitrage n’est pas formalisé, la structure se déchire… et ça ressort en tensions humaines.',
    firstChecks: [
      'Où est écrit l’arbitrage officiel quand mission et cash se contredisent ?',
      'Qui a le pouvoir explicite de dire non à un projet finançable mais incohérent ?',
      'Avez-vous 1 règle simple qui protège la mission quand ça fait mal ?'
    ],
    triggers: {
      anyThemes: [
        { blockId: 'B3', themeId: 'roles_decisionnels', minBand: 'high' },
        { blockId: 'B3', themeId: 'regles_ecrites', minBand: 'high' }
      ],
      anyHypotheses: ['mission_cash_arbitrage']
    }
  },
  {
    id: 'gouvernance_decision',
    title: 'Qui décide quoi : est-ce incontestable ?',
    body: 'Quand les règles de décision sont grises, les conflits deviennent personnels, et les coulisses prennent le pouvoir.',
    firstChecks: [
      'Une décision importante peut-elle être retracée (qui / quand / sur quelle règle) ?',
      'Qui tranche en cas de désaccord, et comment on déclenche l’arbitrage ?',
      'Qu’est-ce qui est non négociable, et où est-ce écrit ?'
    ],
    triggers: {
      anyThemes: [
        { blockId: 'B3', themeId: 'coulisses', minBand: 'high' },
        { blockId: 'B3', themeId: 'desaccord', minBand: 'high' }
      ]
    }
  },
  {
    id: 'dependance_mortelle',
    title: 'Point de dépendance mortel : est-ce identifié ?',
    body:
      'Une dépendance forte (financeur, personne clé, presta, outil) transforme chaque imprévu en crise. Le système devient fragile.',
    firstChecks: [
      'Votre structure dépend-elle d’1–2 financeurs au point de dériver ?',
      'Si une personne clé s’arrête 4 semaines, qu’est-ce qui casse ?',
      'Quel outil / presta unique est un goulot d’étranglement ?'
    ],
    triggers: {
      anyThemes: [
        { blockId: 'B1', themeId: 'charge_fatigue', minBand: 'high' },
        { blockId: 'B3', themeId: 'responsabilite', minBand: 'high' }
      ]
    }
  },
  {
    id: 'capacite_reelle',
    title: 'Capacité réelle : est-ce mesuré ou fantasmé ?',
    body:
      'Sans indicateur simple de capacité (énergie, charge, turnover, disponibilité), la structure se met en mode pompier et s’épuise.',
    firstChecks: [
      'Avez-vous un indicateur minimal : charge / énergie / récupération ?',
      'Qu’est-ce qui est “tenu” uniquement par héroïsme (et donc instable) ?',
      'Qu’est-ce qui devrait s’arrêter pour que ça redevienne tenable ?'
    ],
    triggers: {
      anyThemes: [{ blockId: 'B1', themeId: 'charge_fatigue', minBand: 'high' }]
    }
  },
  {
    id: 'pilotage_reporting',
    title: 'Pilotage : absence ou toxicité ?',
    body:
      'Quand il n’y a pas de pilotage lisible, ou un reporting vécu comme contrôle, la réalité remonte mal… et les erreurs explosent.',
    firstChecks: [
      'Qu’est-ce qui est suivi (peu mais vital) ?',
      'Les problèmes remontent-ils tôt, ou trop tard ?',
      "Un 'mauvais chiffre' déclenche-t-il une chasse aux coupables ?"
    ],
    triggers: {
      anyThemes: [
        { blockId: 'B3', themeId: 'suivi_decisions', minBand: 'high' },
        { blockId: 'B3', themeId: 'changements_regles', minBand: 'high' }
      ]
    }
  },
  {
    id: 'controles_internes',
    title: 'Contrôles internes : quelle faille évidente ?',
    body:
      'Quand les contrôles sont faibles, la structure devient vulnérable : erreurs, incidents, fraudes, cybersécurité bancale. Ça finit toujours en crise humaine.',
    firstChecks: [
      'Si une validation est contournable, laquelle est la plus facile à contourner ?',
      'Qui peut engager / payer / signer, et avec quel contre-pouvoir ?',
      'Votre gestion des accès (outils / comptes) est-elle claire et revue ?'
    ],
    triggers: {
      anyThemes: [
        { blockId: 'B3', themeId: 'entorses_regles', minBand: 'high' },
        { blockId: 'B3', themeId: 'recours', minBand: 'high' }
      ]
    }
  }
];
