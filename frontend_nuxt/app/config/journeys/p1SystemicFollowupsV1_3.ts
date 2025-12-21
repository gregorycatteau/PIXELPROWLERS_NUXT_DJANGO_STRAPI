// Followups P1 “Atterrissage systémique” V1.3 – front-only.
// Ne jamais logger ces réponses, ne jamais les envoyer au backend.
// Ne persister que des statuts agrégés (answered/skipped/missing).

export type P1SystemicFollowupStatus = 'answered' | 'skipped' | 'missing';

export type P1SystemicFollowupQuestion = {
  id: string;
  assertion: string;
  polarity: 'positive' | 'negative';
  weight: 1 | 2 | 3;
  critical: boolean;
  allowSkip: boolean;
  uiHint: 'neutral' | 'sensitive';
  order: number;
};

export type P1SystemicFollowupPack = {
  cardId:
    | 'mission_cash'
    | 'gouvernance_decision'
    | 'dependance_mortelle'
    | 'capacite_reelle'
    | 'pilotage_reporting'
    | 'controles_internes';
  questions: P1SystemicFollowupQuestion[]; // exactement 2
};

export const P1_SYSTEMIC_FOLLOWUPS: P1SystemicFollowupPack[] = [
  {
    cardId: 'mission_cash',
    questions: [
      {
        id: 'p1_sys_mission_cash_q1',
        order: 1,
        assertion:
          'Quand mission et financement se contredisent, une règle écrite permet de trancher sans conflit de personnes.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      },
      {
        id: 'p1_sys_mission_cash_q2',
        order: 2,
        assertion:
          'Il existe une personne/instance qui peut dire non à un projet finançable mais incohérent, et ce pouvoir est explicitement reconnu.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'sensitive'
      }
    ]
  },

  {
    cardId: 'gouvernance_decision',
    questions: [
      {
        id: 'p1_sys_gouv_decision_q1',
        order: 1,
        assertion:
          'Une décision importante peut être retracée simplement : qui a décidé, sur quelle règle, et comment l’arbitrage a été fait.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      },
      {
        id: 'p1_sys_gouv_decision_q2',
        order: 2,
        assertion:
          'En cas de désaccord, on sait comment déclencher un arbitrage officiel (et ce n’est pas “au feeling”).',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      }
    ]
  },

  {
    cardId: 'dependance_mortelle',
    questions: [
      {
        id: 'p1_sys_dependance_q1',
        order: 1,
        assertion:
          'Nos dépendances critiques (financeur, personne clé, presta, outil) sont identifiées et connues de façon partagée.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      },
      {
        id: 'p1_sys_dependance_q2',
        order: 2,
        assertion: 'Si une personne clé s’arrête 4 semaines, la structure a un plan réaliste pour continuer sans crise.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      }
    ]
  },

  {
    cardId: 'capacite_reelle',
    questions: [
      {
        id: 'p1_sys_capacite_q1',
        order: 1,
        assertion:
          'On a un repère simple de capacité (charge/énergie/récupération) qui évite de décider “au-dessus de nos moyens”.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      },
      {
        id: 'p1_sys_capacite_q2',
        order: 2,
        assertion:
          'On sait identifier ce qui est tenu uniquement par héroïsme (et donc instable) — et on ajuste en conséquence.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      }
    ]
  },

  {
    cardId: 'pilotage_reporting',
    questions: [
      {
        id: 'p1_sys_pilotage_q1',
        order: 1,
        assertion:
          'On suit peu d’indicateurs, mais ils sont vitaux et compris (pas un reporting pour contrôler).',
        polarity: 'positive',
        weight: 2,
        critical: false,
        allowSkip: true,
        uiHint: 'neutral'
      },
      {
        id: 'p1_sys_pilotage_q2',
        order: 2,
        assertion: 'Les problèmes remontent tôt, sans déclencher automatiquement une chasse aux coupables.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'sensitive'
      }
    ]
  },

  {
    cardId: 'controles_internes',
    questions: [
      {
        id: 'p1_sys_controles_q1',
        order: 1,
        assertion:
          'Les pouvoirs d’engager/payer/signature sont clairs, et il existe un contre-pouvoir simple (double validation, séparation des rôles).',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      },
      {
        id: 'p1_sys_controles_q2',
        order: 2,
        assertion: 'La gestion des accès (comptes/outils) est revue : on sait qui a accès à quoi et pourquoi.',
        polarity: 'positive',
        weight: 2,
        critical: true,
        allowSkip: true,
        uiHint: 'neutral'
      }
    ]
  }
];
