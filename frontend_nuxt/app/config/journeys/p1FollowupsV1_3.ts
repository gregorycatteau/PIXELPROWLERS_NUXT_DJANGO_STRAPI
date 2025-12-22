// Front-only followups (P1 V1.3). Never log with user data. Never send to backend.
import type { P1Question } from '@/types/journeys/p1';

export type P1FollowupPack = {
  subAxisId: string;
  label: string;
  precision: P1Question[];
  deep: P1Question[];
};

const VERSION = '1.3.0';
const JOURNEY_ID = 'P1';
const BLOCK_ID = 'B1';
const BLOCK_ID_B3 = 'B3';

const baseQuestion = (id: string, subAxis: string, order: number): P1Question => ({
  id,
  version: VERSION,
  journeyId: JOURNEY_ID,
  blockId: BLOCK_ID,
  axis: 'climat',
  subAxis,
  assertion: '',
  assertionAlt: null,
  polarity: 'negative',
  scale: 'likert_1_5',
  weight: 1,
  critical: false,
  uiHint: 'sensitive',
  order,
  stepId: 'E3',
  patternSignals: undefined,
  tags: ['followup'],
  notesProduct: undefined,
  notesSafety: undefined
});

const baseQuestionB3 = (id: string, subAxis: string, order: number): P1Question => ({
  ...baseQuestion(id, subAxis, order),
  blockId: BLOCK_ID_B3,
  axis: 'regles_decisions',
  uiHint: 'sensitive'
});

export const P1_B1_FOLLOWUPS: Record<string, P1FollowupPack> = {
  securite_psy: {
    subAxisId: 'securite_psy',
    label: 'Sécurité psychologique',
    precision: [
      {
        ...baseQuestion('p1_b1_securite_psy_fup_p1', 'securite_psy', 11),
        assertion:
          'Quand quelqu’un exprime un désaccord, il y a souvent un coût (tensions, mise à l’écart, représailles implicites).',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_securite_psy_fup_p2', 'securite_psy', 12),
        assertion: 'Dans les moments difficiles, on évite de dire certaines choses pour ne pas déclencher une réaction négative.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_securite_psy_fup_d1', 'securite_psy', 21),
        assertion: 'Il est courant que des personnes se taisent en réunion et s’expriment seulement en dehors.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_securite_psy_fup_d2', 'securite_psy', 22),
        assertion: 'On s’autocensure sur des sujets importants, même quand ils devraient être traités collectivement.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_securite_psy_fup_d3', 'securite_psy', 23),
        assertion: 'Les erreurs sont rarement accueillies comme un apprentissage : elles sont plutôt utilisées contre quelqu’un.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_securite_psy_fup_d4', 'securite_psy', 24),
        assertion:
          'Certaines personnes pèsent leurs mots parce qu’elles craignent une sanction (même légère) ou une perte de place.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_securite_psy_fup_d5', 'securite_psy', 25),
        assertion: 'Il existe des sujets « interdits » ou intouchables, que l’on évite systématiquement.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  },
  non_dits: {
    subAxisId: 'non_dits',
    label: 'Non-dits',
    precision: [
      baseQuestion('p1_b1_non_dits_fup_p1', 'non_dits', 101),
      baseQuestion('p1_b1_non_dits_fup_p2', 'non_dits', 102)
    ].map((q, idx) => ({
      ...q,
      assertion:
        idx === 0
          ? 'Certains sujets importants restent volontairement évités, même quand ils impactent le quotidien.'
          : 'On sait qu’il y a des choses à dire, mais on ne trouve pas un cadre sûr pour les poser.'
    })),
    deep: [
      {
        ...baseQuestion('p1_b1_non_dits_fup_d1', 'non_dits', 201),
        assertion: 'On évite certains sujets par peur que ça déclenche des tensions ou des représailles.'
      },
      {
        ...baseQuestion('p1_b1_non_dits_fup_d2', 'non_dits', 202),
        assertion: "Des décisions ou des informations circulent 'en coulisses' plutôt qu’en discussion ouverte."
      },
      {
        ...baseQuestion('p1_b1_non_dits_fup_d3', 'non_dits', 203),
        assertion: 'Quand quelqu’un ose poser un sujet sensible, la discussion se ferme vite ou se déplace ailleurs.'
      },
      {
        ...baseQuestion('p1_b1_non_dits_fup_d4', 'non_dits', 204),
        assertion: 'Le non-dit s’accumule et ressort plus tard sous forme de conflits ou de décrochage.'
      },
      {
        ...baseQuestion('p1_b1_non_dits_fup_d5', 'non_dits', 205),
        assertion: 'Il manque un espace/rituel clair pour traiter les sujets délicats sans se blesser.'
      }
    ]
  },
  charge_fatigue: {
    subAxisId: 'charge_fatigue',
    label: 'Charge et fatigue',
    precision: [
      {
        ...baseQuestion('p1_b1_charge_fatigue_fup_p1', 'charge_fatigue', 131),
        assertion: 'Le quotidien de la structure ressemble souvent à du mode pompier (urgences qui remplacent le fond).',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_charge_fatigue_fup_p2', 'charge_fatigue', 132),
        assertion: 'La charge repose sur trop peu de personnes, de façon régulière.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_charge_fatigue_fup_d1', 'charge_fatigue', 231),
        assertion: 'On manque de récupérations : la pression retombe rarement vraiment.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_charge_fatigue_fup_d2', 'charge_fatigue', 232),
        assertion:
          'Certaines tâches sont assumées « par défaut » parce que personne d’autre ne peut / ne veut les prendre.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_charge_fatigue_fup_d3', 'charge_fatigue', 233),
        assertion: 'La fatigue affecte la qualité des échanges et des décisions (réactivité, irritabilité, évitement).',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_charge_fatigue_fup_d4', 'charge_fatigue', 234),
        assertion: 'Il est devenu normal de faire ‘plus que ce qui est tenable’ pour que la structure tienne.',
        weight: 3,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_charge_fatigue_fup_d5', 'charge_fatigue', 235),
        assertion: 'La charge est difficile à rendre visible : on a du mal à dire ‘stop’ sans culpabiliser.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ]
  },
  sens_alignement: {
    subAxisId: 'sens_alignement',
    label: 'Sens et alignement',
    precision: [
      {
        ...baseQuestion('p1_b1_sens_alignement_fup_p1', 'sens_alignement', 141),
        assertion: 'On a du mal à relier les décisions et les priorités au projet/aux objectifs réels.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_sens_alignement_fup_p2', 'sens_alignement', 142),
        assertion: 'Des choix importants se font sans que le ‘pourquoi’ soit suffisamment explicité.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_sens_alignement_fup_d1', 'sens_alignement', 241),
        assertion: 'Les priorités changent et le sens se brouille : on ne sait plus ce qui compte vraiment.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_sens_alignement_fup_d2', 'sens_alignement', 242),
        assertion:
          'Il existe un écart régulier entre le discours (valeurs, vision) et ce qui est réellement possible au quotidien.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_sens_alignement_fup_d3', 'sens_alignement', 243),
        assertion: 'Les personnes ne partagent pas la même définition de ‘réussir’ ou de ‘bien faire’ dans la structure.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_sens_alignement_fup_d4', 'sens_alignement', 244),
        assertion: 'On a tendance à faire ‘tourner’ la structure sans pouvoir améliorer le fond.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_sens_alignement_fup_d5', 'sens_alignement', 245),
        assertion: 'Quand le sens est questionné, ça retombe vite en tension ou en polémique.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  },
  reconnaissance: {
    subAxisId: 'reconnaissance',
    label: 'Reconnaissance',
    precision: [
      {
        ...baseQuestion('p1_b1_reconnaissance_fup_p1', 'reconnaissance', 151),
        assertion: 'Les efforts réels sont peu visibles : on remarque surtout ce qui manque ou ce qui ne va pas.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_reconnaissance_fup_p2', 'reconnaissance', 152),
        assertion: 'Les contributions sont rarement reconnues au bon moment et de façon concrète.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_reconnaissance_fup_d1', 'reconnaissance', 251),
        assertion: 'On a le sentiment que ‘quoi qu’on fasse’, ce n’est jamais vraiment suffisant.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_reconnaissance_fup_d2', 'reconnaissance', 252),
        assertion: 'La reconnaissance est perçue comme inégale (certaines personnes sont valorisées, d’autres non).',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_reconnaissance_fup_d3', 'reconnaissance', 253),
        assertion: 'On évite parfois de reconnaître quelqu’un de peur de créer des jalousies ou des tensions.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_reconnaissance_fup_d4', 'reconnaissance', 254),
        assertion: 'Le manque de reconnaissance pousse certaines personnes à se désengager ou à se protéger.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_reconnaissance_fup_d5', 'reconnaissance', 255),
        assertion: 'Dire ‘merci’ ou valoriser une contribution est devenu rare, même quand c’est mérité.',
        weight: 1,
        critical: false,
        uiHint: 'neutral'
      }
    ]
  },
  isolement: {
    subAxisId: 'isolement',
    label: 'Isolement',
    precision: [
      {
        ...baseQuestion('p1_b1_isolement_fup_p1', 'isolement', 161),
        assertion: 'Certaines personnes se retrouvent souvent seules à porter des sujets lourds ou sensibles.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_isolement_fup_p2', 'isolement', 162),
        assertion: 'On manque d’espaces sûrs pour demander de l’aide ou partager un doute sans se justifier.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_isolement_fup_d1', 'isolement', 261),
        assertion: 'On a l’impression qu’il vaut mieux ‘tenir’ en silence que demander du soutien.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_isolement_fup_d2', 'isolement', 262),
        assertion: 'Les responsabilités sont floues : on finit par porter des sujets parce que personne d’autre ne s’en saisit.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_isolement_fup_d3', 'isolement', 263),
        assertion: 'Il y a des moments où l’on se sent exposé·e : si on parle, on risque d’être la cible.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_isolement_fup_d4', 'isolement', 264),
        assertion: 'Les sujets difficiles ne trouvent pas de lieu naturel : ils restent sur les épaules de quelques-uns.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_isolement_fup_d5', 'isolement', 265),
        assertion: 'L’isolement finit par abîmer la motivation et la capacité à agir.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ]
  },
  previsibilite_quotidien: {
    subAxisId: 'previsibilite_quotidien',
    label: 'Prévisibilité du quotidien',
    precision: [
      {
        ...baseQuestion('p1_b1_previsibilite_fup_p1', 'previsibilite_quotidien', 171),
        assertion: 'Les décisions ou changements importants arrivent souvent tard, sans préparation.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_previsibilite_fup_p2', 'previsibilite_quotidien', 172),
        assertion: 'Il est difficile d’anticiper : on ne sait pas à quoi ressemblera le mois prochain.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_previsibilite_fup_d1', 'previsibilite_quotidien', 271),
        assertion: 'Les priorités changent avant que les actions en cours aient le temps de produire un résultat.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_previsibilite_fup_d2', 'previsibilite_quotidien', 272),
        assertion: 'On renonce à planifier, parce que ‘ça ne sert à rien, ça change toujours’.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_previsibilite_fup_d3', 'previsibilite_quotidien', 273),
        assertion: 'On apprend les changements par fragments : tout le monde n’a pas les mêmes informations.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_previsibilite_fup_d4', 'previsibilite_quotidien', 274),
        assertion: 'Les règles de fonctionnement changent sans être formalisées (et ça crée des malentendus).',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_previsibilite_fup_d5', 'previsibilite_quotidien', 275),
        assertion: 'Le manque de prévisibilité finit par créer de la méfiance (ou un repli).',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ]
  },
  ambiance_globale: {
    subAxisId: 'ambiance_globale',
    label: 'Ambiance globale',
    precision: [
      {
        ...baseQuestion('p1_b1_ambiance_fup_p1', 'ambiance_globale', 181),
        assertion: 'L’ambiance générale est tendue : on sent une pression de fond, même sans conflit ouvert.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_ambiance_fup_p2', 'ambiance_globale', 182),
        assertion: 'On manque de moments ‘respirables’ où la structure paraît simple et fluide.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_ambiance_fup_d1', 'ambiance_globale', 281),
        assertion: 'La tension est devenue ‘normale’ : on s’y habitue, mais elle use.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_ambiance_fup_d2', 'ambiance_globale', 282),
        assertion: 'La moindre friction prend vite beaucoup de place et pollue le reste.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_ambiance_fup_d3', 'ambiance_globale', 283),
        assertion: 'On se parle moins franchement qu’avant (ou pas au bon endroit).',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestion('p1_b1_ambiance_fup_d4', 'ambiance_globale', 284),
        assertion: 'Le collectif fonctionne, mais au prix d’un effort émotionnel élevé.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestion('p1_b1_ambiance_fup_d5', 'ambiance_globale', 285),
        assertion: 'L’ambiance rend difficile le fait de se projeter sereinement dans la suite.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ]
  },
  conflits: {
    subAxisId: 'conflits',
    label: 'Gestion des conflits',
    precision: [
      {
        ...baseQuestion('p1_b1_conflits_fup_p1', 'conflits', 111),
        assertion: 'Quand un désaccord apparaît, on a du mal à le traiter de façon posée et constructive.'
      },
      {
        ...baseQuestion('p1_b1_conflits_fup_p2', 'conflits', 112),
        assertion: 'Les tensions se règlent souvent par évitement, silence, ou explosion, plutôt que par un cadre clair.'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_conflits_fup_d1', 'conflits', 211),
        assertion: 'Les conflits reviennent sur les mêmes sujets, sans vraie résolution.'
      },
      {
        ...baseQuestion('p1_b1_conflits_fup_d2', 'conflits', 212),
        assertion: 'Certaines personnes n’osent plus dire ce qu’elles pensent pour éviter un conflit.'
      },
      {
        ...baseQuestion('p1_b1_conflits_fup_d3', 'conflits', 213),
        assertion: 'Quand ça chauffe, on mélange vite les faits, les intentions et les personnes.'
      },
      {
        ...baseQuestion('p1_b1_conflits_fup_d4', 'conflits', 214),
        assertion: 'Après un conflit, il reste souvent un malaise durable (distance, méfiance, fatigue).'
      },
      {
        ...baseQuestion('p1_b1_conflits_fup_d5', 'conflits', 215),
        assertion: 'On n’a pas (ou plus) de règles communes pour se parler quand ça devient difficile.'
      }
    ]
  },
  justice: {
    subAxisId: 'justice',
    label: 'Justice / équité',
    precision: [
      {
        ...baseQuestion('p1_b1_justice_fup_p1', 'justice', 121),
        assertion: 'Les règles (explicites ou implicites) ne s’appliquent pas toujours de la même manière selon les personnes.'
      },
      {
        ...baseQuestion('p1_b1_justice_fup_p2', 'justice', 122),
        assertion: 'Des efforts importants passent parfois inaperçus, tandis que d’autres gestes sont sur-valorisés.'
      }
    ],
    deep: [
      {
        ...baseQuestion('p1_b1_justice_fup_d1', 'justice', 221),
        assertion: 'Certaines personnes portent plus que leur part, sans que ce soit reconnu ou compensé.'
      },
      {
        ...baseQuestion('p1_b1_justice_fup_d2', 'justice', 222),
        assertion: 'Il y a un sentiment que certains ont plus de droits que d’autres (ou plus d’immunité).'
      },
      {
        ...baseQuestion('p1_b1_justice_fup_d3', 'justice', 223),
        assertion: 'Les arbitrages donnent parfois l’impression d’être faits “pour arranger”, pas pour être justes.'
      },
      {
        ...baseQuestion('p1_b1_justice_fup_d4', 'justice', 224),
        assertion: 'Quand quelqu’un signale une injustice, ça retombe sur lui/elle (isolement, tension, mise à l’écart).'
      },
      {
        ...baseQuestion('p1_b1_justice_fup_d5', 'justice', 225),
        assertion: 'Il manque un mécanisme clair pour traiter les ressentis d’injustice sans escalade.'
      }
    ]
  }
};

export const P1_B3_FOLLOWUPS: Record<string, P1FollowupPack> = {
  coulisses: {
    subAxisId: 'coulisses',
    label: 'Décisions en coulisses',
    precision: [
      {
        ...baseQuestionB3('p1_b3_coulisses_fup_p1', 'coulisses', 301),
        assertion: 'Des décisions importantes semblent se prendre hors des espaces prévus.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_coulisses_fup_p2', 'coulisses', 302),
        assertion: 'Il est difficile de savoir qui pèse réellement sur les décisions sensibles.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_coulisses_fup_d1', 'coulisses', 311),
        assertion: 'Les décisions arrivent “prêtes” sans discussion visible en amont.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_coulisses_fup_d2', 'coulisses', 312),
        assertion: 'Les circuits officiels semblent contournés pour certains sujets.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_coulisses_fup_d3', 'coulisses', 313),
        assertion: 'Tu découvres parfois des décisions en même temps que leur application.',
        weight: 2,
        critical: false,
        uiHint: 'sensitive'
      }
    ]
  },
  entorses_regles: {
    subAxisId: 'entorses_regles',
    label: 'Entorses aux règles',
    precision: [
      {
        ...baseQuestionB3('p1_b3_entorses_fup_p1', 'entorses_regles', 321),
        assertion: 'Certaines règles sont régulièrement contournées ou adaptées selon les personnes.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_entorses_fup_p2', 'entorses_regles', 322),
        assertion: 'Les entorses sont rarement explicitées ou assumées collectivement.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_entorses_fup_d1', 'entorses_regles', 331),
        assertion: 'Les exceptions paraissent devenir la norme sur certains sujets.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_entorses_fup_d2', 'entorses_regles', 332),
        assertion: 'On invoque ou on oublie les règles selon le contexte ou la personne.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_entorses_fup_d3', 'entorses_regles', 333),
        assertion: 'Il est difficile de savoir quelles règles comptent vraiment aujourd’hui.',
        weight: 2,
        critical: false,
        uiHint: 'sensitive'
      }
    ]
  },
  recours: {
    subAxisId: 'recours',
    label: 'Recours / arbitrage',
    precision: [
      {
        ...baseQuestionB3('p1_b3_recours_fup_p1', 'recours', 341),
        assertion: 'Il n’y a pas de voie claire pour contester une décision perçue comme injuste.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_recours_fup_p2', 'recours', 342),
        assertion: 'Contester une décision semble risqué (image, relations, conséquences).',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_recours_fup_d1', 'recours', 351),
        assertion: 'Les recours formels existent peu ou fonctionnent mal.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_recours_fup_d2', 'recours', 352),
        assertion: 'Les personnes qui contestent semblent parfois “payer” leur prise de parole.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_recours_fup_d3', 'recours', 353),
        assertion: 'Il est flou de savoir qui peut arbitrer un désaccord important.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  },
  roles_decisionnels: {
    subAxisId: 'roles_decisionnels',
    label: 'Rôles décisionnels',
    precision: [
      {
        ...baseQuestionB3('p1_b3_roles_decisionnels_fup_p1', 'roles_decisionnels', 401),
        assertion: 'On ne sait pas clairement qui a l’autorité de trancher quand il y a désaccord ou urgence.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_roles_decisionnels_fup_p2', 'roles_decisionnels', 402),
        assertion: 'Quand mission et contraintes financières se contredisent, l’arbitrage réel n’est pas écrit (ou pas connu).',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_roles_decisionnels_fup_d1', 'roles_decisionnels', 411),
        assertion: 'Il existe des zones où le pouvoir de décision est implicite : on le découvre en se faisant recadrer.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_roles_decisionnels_fup_d2', 'roles_decisionnels', 412),
        assertion: 'Des décisions structurantes sont prises sans que le “qui décide quoi” soit explicitement assumé.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_roles_decisionnels_fup_d3', 'roles_decisionnels', 413),
        assertion: 'Le “droit de dire non” (à un projet, une dépense, une demande) est flou ou inégal selon les personnes.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_roles_decisionnels_fup_d4', 'roles_decisionnels', 414),
        assertion: 'Si quelqu’un voulait contourner une validation, il trouverait facilement le maillon faible (procédure, personne, urgence).',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_roles_decisionnels_fup_d5', 'roles_decisionnels', 415),
        assertion: 'On confond souvent “porter” et “décider” : la responsabilité retombe sur les mêmes sans mandat clair.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  },
  regles_ecrites: {
    subAxisId: 'regles_ecrites',
    label: 'Règles écrites',
    precision: [
      {
        ...baseQuestionB3('p1_b3_regles_ecrites_fup_p1', 'regles_ecrites', 421),
        assertion: 'Les règles clés de fonctionnement ne sont pas assez écrites pour être réutilisables (arrivants, turnover, crise).',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_regles_ecrites_fup_p2', 'regles_ecrites', 422),
        assertion: 'On passe du temps à réexpliquer les mêmes règles, parce qu’elles ne sont pas formalisées au bon endroit.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_regles_ecrites_fup_d1', 'regles_ecrites', 431),
        assertion: 'Les règles existent, mais elles sont dispersées (docs, messages, habitudes) et difficiles à retrouver.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_regles_ecrites_fup_d2', 'regles_ecrites', 432),
        assertion: 'Quand une règle change, la nouvelle version n’est pas diffusée clairement à tout le monde.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_regles_ecrites_fup_d3', 'regles_ecrites', 433),
        assertion: 'Des exceptions deviennent la norme, sans être re-documentées (et ça crée des malentendus).',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_regles_ecrites_fup_d4', 'regles_ecrites', 434),
        assertion: 'On se rend compte trop tard qu’on ne parle pas des mêmes règles (chacun a sa version).',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_regles_ecrites_fup_d5', 'regles_ecrites', 435),
        assertion: 'La structure dépend de la mémoire de quelques personnes pour fonctionner “comme prévu”.',
        weight: 3,
        critical: true,
        uiHint: 'neutral'
      }
    ]
  },
  equite_regles: {
    subAxisId: 'equite_regles',
    label: 'Equité des règles',
    precision: [
      {
        ...baseQuestionB3('p1_b3_equite_regles_fup_p1', 'equite_regles', 441),
        assertion: 'Selon les personnes, la même règle n’a pas le même poids (exceptions, tolérance, sanctions).',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_equite_regles_fup_p2', 'equite_regles', 442),
        assertion: 'Le sentiment d’injustice (ou d’arbitraire) revient régulièrement dans les discussions.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_equite_regles_fup_d1', 'equite_regles', 451),
        assertion: 'Des passe-droits (petits ou grands) fragilisent la confiance dans la gouvernance.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_equite_regles_fup_d2', 'equite_regles', 452),
        assertion:
          'Les efforts/risques ne sont pas répartis équitablement (exposition, charge, décisions), et ce n’est pas assumé.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_equite_regles_fup_d3', 'equite_regles', 453),
        assertion: 'Quand quelqu’un pointe une injustice, la structure se défend plus qu’elle n’écoute.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_equite_regles_fup_d4', 'equite_regles', 454),
        assertion: 'L’équité dépend trop de relations ou de rapports de force plutôt que de règles explicites.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_equite_regles_fup_d5', 'equite_regles', 455),
        assertion: 'La perception d’arbitraire influence directement la capacité à coopérer (repli, cynisme, conflits).',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  },
  participation: {
    subAxisId: 'participation',
    label: 'Participation',
    precision: [
      {
        ...baseQuestionB3('p1_b3_participation_fup_p1', 'participation', 461),
        assertion: 'Les personnes concernées ne sont pas toujours incluses au bon moment dans les décisions qui les touchent.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_participation_fup_p2', 'participation', 462),
        assertion: 'On consulte parfois “pour la forme”, alors que l’arbitrage est déjà fait.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_participation_fup_d1', 'participation', 471),
        assertion: 'La participation réelle dépend plus du statut ou de l’ancienneté que d’un cadre clair.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_participation_fup_d2', 'participation', 472),
        assertion: 'Des personnes se taisent, non par accord, mais parce qu’elles pensent que ça ne changera rien.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_participation_fup_d3', 'participation', 473),
        assertion: 'On découvre après coup que des objections existaient, mais n’ont pas trouvé de place pour être entendues.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_participation_fup_d4', 'participation', 474),
        assertion: 'Les décisions créent des résistances parce que le processus n’a pas été perçu comme légitime.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_participation_fup_d5', 'participation', 475),
        assertion: 'La structure n’a pas de mécanisme simple pour remonter une alerte avant qu’une décision ne fasse dégâts.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  },
  desaccord: {
    subAxisId: 'desaccord',
    label: 'Désaccord et contestation',
    precision: [
      {
        ...baseQuestionB3('p1_b3_desaccord_fup_p1', 'desaccord', 481),
        assertion: 'Quand il y a désaccord, on sait mal comment le traiter sans basculer en tension ou en rapport de force.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_desaccord_fup_p2', 'desaccord', 482),
        assertion:
          'Les objections ou réserves sont parfois perçues comme de la “mauvaise volonté” plutôt que comme un signal utile.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_desaccord_fup_d1', 'desaccord', 491),
        assertion: 'On évite de poser certaines objections parce qu’on anticipe un coût (image, sanctions, isolement).',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_desaccord_fup_d2', 'desaccord', 492),
        assertion: 'Les décisions se font parfois au forcing : on passe à l’action sans accord suffisant.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_desaccord_fup_d3', 'desaccord', 493),
        assertion: 'Il manque un format clair pour poser un désaccord et obtenir une réponse traçable.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_desaccord_fup_d4', 'desaccord', 494),
        assertion: 'Le désaccord ressurgit plus tard sous forme de sabotage passif, retrait, ou conflit indirect.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_desaccord_fup_d5', 'desaccord', 495),
        assertion: 'On confond souvent “unifier le groupe” avec “faire taire les tensions”, et ça abîme la décision.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  },
  suivi_decisions: {
    subAxisId: 'suivi_decisions',
    label: 'Suivi des décisions',
    precision: [
      {
        ...baseQuestionB3('p1_b3_suivi_decisions_fup_p1', 'suivi_decisions', 501),
        assertion: 'On décide, mais on perd vite le fil : responsabilités et prochaines étapes ne sont pas toujours claires.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_suivi_decisions_fup_p2', 'suivi_decisions', 502),
        assertion: 'Des décisions importantes restent sans suivi réel, ce qui crée de la frustration et du flou.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_suivi_decisions_fup_d1', 'suivi_decisions', 511),
        assertion: 'On ne sait pas facilement quelles décisions sont “encore valides” et lesquelles ont changé.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_suivi_decisions_fup_d2', 'suivi_decisions', 512),
        assertion: 'Les mêmes sujets reviennent parce qu’on n’a pas de trace simple des arbitrages déjà faits.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_suivi_decisions_fup_d3', 'suivi_decisions', 513),
        assertion: 'Les responsabilités se diluent : on ne sait pas qui doit faire quoi après une décision.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_suivi_decisions_fup_d4', 'suivi_decisions', 514),
        assertion: 'Le suivi dépend de la ténacité de quelques personnes, pas d’un mécanisme collectif.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_suivi_decisions_fup_d5', 'suivi_decisions', 515),
        assertion: 'Le manque de suivi finit par dégrader la confiance dans le fait que “décider sert à quelque chose”.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      }
    ]
  },
  changements_regles: {
    subAxisId: 'changements_regles',
    label: 'Changements de règles',
    precision: [
      {
        ...baseQuestionB3('p1_b3_changements_regles_fup_p1', 'changements_regles', 521),
        assertion: 'Les règles ou priorités changent sans préparation, et l’équipe s’adapte en mode urgence.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_changements_regles_fup_p2', 'changements_regles', 522),
        assertion: 'On vit des changements qui ne sont pas suffisamment expliqués (le “pourquoi” manque).',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_changements_regles_fup_d1', 'changements_regles', 531),
        assertion: 'On apprend les changements trop tard pour s’organiser correctement.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_changements_regles_fup_d2', 'changements_regles', 532),
        assertion: 'Les changements créent de l’incompréhension parce que la décision n’est pas traçable.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_changements_regles_fup_d3', 'changements_regles', 533),
        assertion: 'Les personnes finissent par ne plus investir, parce que “ça changera de toute façon”.',
        weight: 2,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_changements_regles_fup_d4', 'changements_regles', 534),
        assertion: 'La structure change vite, mais sans cadre d’absorption (charge, priorités, capacités).',
        weight: 3,
        critical: true,
        uiHint: 'neutral'
      },
      {
        ...baseQuestionB3('p1_b3_changements_regles_fup_d5', 'changements_regles', 535),
        assertion: 'Le manque de stabilité rend les décisions fragiles et augmente les tensions.',
        weight: 2,
        critical: false,
        uiHint: 'neutral'
      }
    ]
  },
  responsabilite: {
    subAxisId: 'responsabilite',
    label: 'Responsabilité politique',
    precision: [
      {
        ...baseQuestionB3('p1_b3_responsabilite_fup_p1', 'responsabilite', 541),
        assertion: 'Quand ça se passe mal, il est difficile de savoir où se situe la responsabilité (mandat, décision, exécution).',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_responsabilite_fup_p2', 'responsabilite', 542),
        assertion: 'Des personnes portent des risques ou des décisions sans protection claire de la gouvernance.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ],
    deep: [
      {
        ...baseQuestionB3('p1_b3_responsabilite_fup_d1', 'responsabilite', 551),
        assertion: 'On “expose” des personnes (face aux financeurs, aux partenaires, au public) sans filet ni cadre clair.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_responsabilite_fup_d2', 'responsabilite', 552),
        assertion: 'Le système pousse à décider vite, mais laisse ensuite les personnes gérer seules les conséquences.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_responsabilite_fup_d3', 'responsabilite', 553),
        assertion: 'Les erreurs sont traitées comme une faute individuelle plutôt que comme un problème de cadre.',
        weight: 2,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_responsabilite_fup_d4', 'responsabilite', 554),
        assertion: 'La responsabilité sert parfois à désigner un coupable, au lieu d’améliorer le fonctionnement.',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      },
      {
        ...baseQuestionB3('p1_b3_responsabilite_fup_d5', 'responsabilite', 555),
        assertion: 'Les responsabilités réelles ne sont pas alignées avec les droits réels (décider, arbitrer, refuser).',
        weight: 3,
        critical: true,
        uiHint: 'sensitive'
      }
    ]
  }
};
