// Front-only. Ne jamais logger ces textes avec données utilisateur. Ne jamais envoyer au backend.
export type HypothesisDef = {
  id: string;
  title: string;
  mirror: string;
  whyItMatters: string;
  triggers: Array<{
    themeIds: string[];
    bands?: Array<'very_high' | 'high' | 'medium'>;
    minPriority?: number;
    confidence?: Array<'confirmed' | 'clarified' | 'protected' | 'unclear'>;
  }>;
  questions: string[];
  angles: string[];
};

export const P1_HYPOTHESES_V1_3: HypothesisDef[] = [
  {
    id: 'h1_decisions_zone_grise',
    title: 'Décisions en zone grise',
    mirror:
      'Les décisions importantes semblent se prendre dans des espaces flous ou variables, avec peu de lisibilité sur qui décide vraiment et selon quelles règles.',
    whyItMatters:
      'Sans cadre clair, les personnes naviguent à vue, ce qui nourrit les contournements, la défiance et la fatigue politique.',
    triggers: [
      { themeIds: ['opacite', 'coulisses', 'roles_decisionnels'], bands: ['very_high', 'high'] },
      { themeIds: ['regles_ecrites', 'equite_regles', 'suivi_decisions'], bands: ['high', 'medium'] }
    ],
    questions: [
      'Qui peut bloquer ou débloquer une décision sensible aujourd’hui ?',
      'Quelles décisions récentes ont été annoncées sans que le processus soit lisible ?',
      'Qu’est-ce qui rend risqué de demander “qui décide ici ?” ?'
    ],
    angles: [
      'Rendre visibles 2-3 décisions sensibles avec leurs pilotes et règles minimales.',
      'Réduire les coulisses sur un périmètre test en documentant le “qui décide quoi” simple.'
    ]
  },
  {
    id: 'h2_equite_fragile',
    title: 'Équité perçue instable',
    mirror:
      'Les règles ou arbitrages paraissent changer selon les personnes ou les moments, avec un risque de traitement inégal.',
    whyItMatters:
      'Quand la justice interne vacille, la confiance et l’engagement décrochent : chacun protège sa zone plutôt que d’aligner ses efforts.',
    triggers: [
      { themeIds: ['justice', 'equite_regles', 'entorses_regles'], bands: ['very_high', 'high'] },
      { themeIds: ['justice', 'equite_regles'], bands: ['medium'], confidence: ['confirmed'] }
    ],
    questions: [
      'Quelles décisions récentes ont paru inéquitables, et pour qui ?',
      'Quels critères implicites semblent primer sur les règles affichées ?',
      'Qui peut contester une décision sans risque aujourd’hui ?'
    ],
    angles: [
      'Mettre à plat 2-3 cas récents vécus comme injustes pour en extraire des critères explicites.',
      'Limiter les entorses “pour arranger” en définissant ce qui est non négociable à court terme.'
    ]
  },
  {
    id: 'h3_sens_vs_cash_implicite',
    title: 'Mission vs cash implicite',
    mirror:
      'Les arbitrages entre mission, ressources et soutenabilité semblent implicites ou absents, ce qui brouille la priorisation.',
    whyItMatters:
      'Sans arbitrage clair, la charge augmente et la mission se dilue ; chacun choisit sa propre boussole, générant conflit ou inertie.',
    triggers: [
      { themeIds: ['sens_alignement', 'charge_fatigue'], bands: ['high', 'medium'] },
      { themeIds: ['charge_fatigue'], bands: ['very_high'] }
    ],
    questions: [
      'Comment se décide ce qui passe avant le reste quand tout urge ?',
      'Qu’est-ce qui fait que certaines tâches “mission” passent après des urgences court terme ?',
      'Qui a le droit de dire “stop, ce n’est pas soutenable” ?'
    ],
    angles: [
      'Instaurer un arbitrage explicite mission/ressources sur 1-2 projets critiques.',
      'Visibiliser la charge réelle et renégocier un périmètre prioritaire court terme.'
    ]
  },
  {
    id: 'h4_dette_humaine',
    title: 'Dette humaine en montée',
    mirror:
      'La charge et la fatigue apparaissent élevées ou récurrentes, avec peu de dispositifs pour absorber ou prévenir l’usure.',
    whyItMatters:
      'La dette humaine explose tôt ou tard : départs, erreurs, conflit larvé. Elle mine la capacité réelle et la qualité des décisions.',
    triggers: [{ themeIds: ['charge_fatigue'], bands: ['very_high', 'high'] }],
    questions: [
      'Qu’est-ce qui fait que la charge reste haute malgré les alertes ?',
      'Où sont les marges de manœuvre concrètes pour réduire le débit ?'
    ],
    angles: [
      'Geler ou alléger un flux non vital pour redonner du souffle immédiatement.',
      'Mettre en place un signal d’alerte partagé pour suspendre ou renégocier un engagement en surcharge.'
    ]
  },
  {
    id: 'h5_dependance_critique',
    title: 'Dépendance mortelle',
    mirror:
      'Une personne, un financeur ou un outil semble trop central, sans alternative ou sans sauvegarde claire.',
    whyItMatters:
      'La résilience est faible : une absence ou une coupure peut bloquer une partie du système et générer conflit ou perte.',
    triggers: [
      { themeIds: ['suivi_decisions', 'responsabilite', 'previsibilite_quotidien'], bands: ['high', 'medium'] },
      { themeIds: ['isolement', 'reconnaissance'], bands: ['high'] }
    ],
    questions: [
      'Qu’est-ce qui s’arrête si cette personne/ressource disparaît une semaine ?',
      'Qui sait réellement reproduire ou reprendre ce qui est tenu aujourd’hui ?'
    ],
    angles: [
      'Identifier 1 dépendance critique et définir un plan B minimal (documentation, doublon, relais).',
      'Limiter les “single points of failure” en répartissant un rôle ou un accès clé.'
    ]
  },
  {
    id: 'h6_regles_non_tenues',
    title: 'Règles non tenues',
    mirror:
      'Les entorses ou la variabilité d’application des règles semblent fréquentes, ce qui fragilise la confiance dans le cadre.',
    whyItMatters:
      'Quand la règle devient optionnelle, la gouvernance se personnalise et la confiance se délite ; chacun négocie pour soi.',
    triggers: [
      { themeIds: ['entorses_regles', 'equite_regles', 'regles_ecrites'], bands: ['very_high', 'high'] },
      { themeIds: ['entorses_regles'], bands: ['medium'], confidence: ['confirmed'] }
    ],
    questions: [
      'Quelles règles sont le plus souvent contournées, et par qui ?',
      'Qu’est-ce qui rend acceptable de ne pas appliquer ces règles ?'
    ],
    angles: [
      'Définir un petit noyau de règles réellement tenues et contrôlées, quitte à en suspendre d’autres.',
      'Rendre visible chaque entorse “acceptée” et son motif pour éviter l’arbitraire.'
    ]
  },
  {
    id: 'h7_conflit_non_traitable',
    title: 'Conflit non traitable',
    mirror:
      'Les conflits semblent difficiles à poser et à travailler sans risque : ils s’évitent, explosent ou restent sous forme de non-dits.',
    whyItMatters:
      'Le conflit se déplace en sous-main, alimente la défiance et bloque les décisions. La charge émotionnelle augmente pour tous.',
    triggers: [
      { themeIds: ['conflits', 'non_dits'], bands: ['very_high', 'high'] },
      { themeIds: ['conflits'], bands: ['medium'], confidence: ['confirmed'] }
    ],
    questions: [
      'Quel désaccord récent n’a pas trouvé d’espace sécurisé pour être travaillé ?',
      'Qu’est-ce qui rend risqué d’ouvrir ce conflit aujourd’hui ?'
    ],
    angles: [
      'Créer un espace tiers ou un “sas” pour traiter un conflit prioritaire avec règles minimales de sécurité.',
      'Identifier une personne ressource neutre pour soutenir l’expression et la médiation sur un cas test.'
    ]
  },
  {
    id: 'h8_controles_faibles',
    title: 'Contrôles internes faibles',
    mirror:
      'Les contrôles ou boucles de feedback semblent insuffisants : décisions peu suivies, règles peu vérifiées, incidents peu appris.',
    whyItMatters:
      'Sans contrôle, les erreurs ou dérives se répètent et la confiance s’érode. Les tensions montent sans correction durable.',
    triggers: [
      { themeIds: ['suivi_decisions', 'recours', 'opacite'], bands: ['high', 'medium'] },
      { themeIds: ['suivi_decisions'], bands: ['very_high'] }
    ],
    questions: [
      'Quelles décisions ont été annoncées sans être réellement suivies ?',
      'Qui peut remonter un incident ou une dérive, et qu’est-ce qui se passe ensuite ?'
    ],
    angles: [
      'Mettre en place un suivi minimal sur une décision critique (responsable, échéance, vérification).',
      'Instaurer un canal simple pour signaler une dérive avec engagement de réponse.'
    ]
  }
];
