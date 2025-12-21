/**
 * TODO Audit P1 Panorama V1.3 — 16 assertions (E1)
 * - Axes actuellement utilisés dans le code : human/governance/organization/resources (héritage V1.3).
 * - Axes souhaités pour Panorama V1.3.1 : human/movement/decisions/structure.
 * - p1PanoramaQuestions est consommé par :
 *   - P1PanoramaE1 (liste des questions + panoramaAxisMap pour le scoring),
 *   - P1PanoramaBilanE2 (bilan, badges et cartes),
 *   - useJourneyDiagnostics (computePanoramaScores via panoramaAxisMap),
 *   - p1PanoramaStorage (lecture des scores stockés),
 *   - useP1PanoramaNarrative (narration par axe).
 * - Passage 12 → 16 questions : pas de pagination codée en dur, rendu basé sur la liste.
 * - Stratégie retenue : Option B — introduire un type d’axe Panorama dédié
 *   (human/movement/decisions/structure), remplacer p1PanoramaQuestions par 16 assertions,
 *   aligner le scoring et les métadonnées Panorama sur ces axes. P1 est encore en dev,
 *   donc pas de migration de storage legacy : on lit les nouvelles clés directement.
 */
import { P1_QUESTIONS_V1_3 } from './p1QuestionsV1_3';
import type { P1Question } from '@/types/journeys/p1';

export type P1AxisId = 'human' | 'governance' | 'organization' | 'resources';
export type P1BlockId = 'b1' | 'b2' | 'b3' | 'b4';
export type P1PanoramaAxisId = 'human' | 'movement' | 'decisions' | 'structure';
export type P1PanoramaBlockId = 'B1' | 'B2' | 'B3' | 'B4';
export type P1PanoramaPolarity = 'positive' | 'negative';

export interface P1PanoramaQuestion {
  id: string;
  axisId: P1PanoramaAxisId;
  blockId: P1PanoramaBlockId;
  weight: 1 | 2 | 3;
  polarity: P1PanoramaPolarity;
  critical?: boolean;
  label: string;
  order?: number;
}

export interface P1QuestionConfig {
  id: string;
  axisId: P1AxisId;
  blockId: P1BlockId | 'panorama';
  label: string;
  description?: string;
  exportLabel?: string;
}

export interface P1BlockContent {
  title: string;
  subtitle?: string;
  questionnaireTitle: string;
  questionnaireSubtitle?: string;
  bilanTitle: string;
  bilanSubtitle?: string;
  dignityNote?: string;
}

export const P1_BLOCK_IDS: P1BlockId[] = ['b1', 'b2', 'b3', 'b4'];

export const p1AxesMeta: Record<P1AxisId, { label: string; shortLabel: string }> = {
  human: { label: 'Humain / coopération', shortLabel: 'Humain' },
  governance: { label: 'Gouvernance / décision', shortLabel: 'Gouvernance' },
  organization: { label: 'Organisation / process', shortLabel: 'Organisation' },
  resources: { label: 'Ressources / soutenabilité', shortLabel: 'Ressources' }
};

export const p1PanoramaAxesMeta: Record<P1PanoramaAxisId, { label: string; shortLabel: string }> = {
  human: { label: 'Humain / coopération', shortLabel: 'Humain' },
  movement: { label: 'Mouvement / dynamique', shortLabel: 'Mouvement' },
  decisions: { label: 'Décisions / clarté', shortLabel: 'Décisions' },
  structure: { label: 'Structure / robustesse', shortLabel: 'Structure' }
};

export const p1BlockContent: Record<P1BlockId, P1BlockContent> = {
  b1: {
    title: 'Bloc 1 — Climat & ressenti',
    subtitle: 'Vécu humain, tensions, règles implicites.',
    questionnaireTitle: 'Bloc 1 — Climat & ressenti',
    questionnaireSubtitle: 'Double focale toi / organisation, tu peux sauter des questions.',
    bilanTitle: 'Bilan bloc 1 — Climat & ressenti',
    bilanSubtitle: 'Lecture rapide des tensions et des zones moins explorées.',
    dignityNote: 'Ce bilan décrit des tensions sans parler de valeur personnelle. Tu peux t’arrêter ici ou revenir plus tard.'
  },
  b2: {
    title: 'Bloc 2 — Mouvement & prévisibilité',
    subtitle: 'Cadence, priorités, soutenabilité au quotidien.',
    questionnaireTitle: 'Bloc 2 — Mouvement & prévisibilité',
    questionnaireSubtitle: 'Rythme, charge et visibilité. Tu avances à ton rythme.',
    bilanTitle: 'Bilan bloc 2 — Mouvement & prévisibilité',
    bilanSubtitle: 'Constats sur le rythme et la soutenabilité, blancs inclus.',
    dignityNote: 'Ce n’est pas un verdict, juste une carte pour décider où remettre du souffle.'
  },
  b3: {
    title: 'Bloc 3 — Règles & décisions',
    subtitle: 'Rôles, décisions, cohérence des règles.',
    questionnaireTitle: 'Bloc 3 — Règles & décisions',
    questionnaireSubtitle: 'Qui décide, comment, et avec quelles règles applicables.',
    bilanTitle: 'Bilan bloc 3 — Règles & décisions',
    bilanSubtitle: 'Ce que racontent les décisions et les règles appliquées.',
    dignityNote: 'Les zones non répondues restent des infos utiles, à explorer en douceur.'
  },
  b4: {
    title: 'Bloc 4 — Structure & robustesse',
    subtitle: 'Process, outils, transmission et continuité.',
    questionnaireTitle: 'Bloc 4 — Structure & robustesse',
    questionnaireSubtitle: 'Process et outillage critique. Pas de forcing, réponds si tu veux.',
    bilanTitle: 'Bilan bloc 4 — Structure & robustesse',
    bilanSubtitle: 'Robustesse des processus et dépendances clés.',
    dignityNote: 'Le but est de repérer où consolider, pas de juger.'
  }
};

const mapBlockIdFromV1_3 = (blockId: P1Question['blockId']): P1QuestionConfig['blockId'] => {
  switch (blockId) {
    case 'B1':
      return 'b1';
    case 'B2':
      return 'b2';
    case 'B3':
      return 'b3';
    case 'B4':
      return 'b4';
    case 'GLOBAL':
    default:
      return 'panorama';
  }
};

const mapQuestionToConfig = (question: P1Question): P1QuestionConfig => ({
  id: question.id,
  axisId: question.axis as P1AxisId,
  blockId: mapBlockIdFromV1_3(question.blockId),
  label: question.assertion
});

const p1BlocksQuestionsV1_3: Record<P1BlockId, P1QuestionConfig[]> = {
  b1: P1_QUESTIONS_V1_3.filter((q) => q.blockId === 'B1').sort((a, b) => a.order - b.order).map(mapQuestionToConfig),
  b2: P1_QUESTIONS_V1_3.filter((q) => q.blockId === 'B2').sort((a, b) => a.order - b.order).map(mapQuestionToConfig),
  b3: P1_QUESTIONS_V1_3.filter((q) => q.blockId === 'B3').sort((a, b) => a.order - b.order).map(mapQuestionToConfig),
  b4: P1_QUESTIONS_V1_3.filter((q) => q.blockId === 'B4').sort((a, b) => a.order - b.order).map(mapQuestionToConfig)
};

const p1BlockBilanSections: Record<
  P1BlockId,
  { summaryTitle: string; interpretationTitle: string; detailsTitle: string }
> = {
  b1: {
    summaryTitle: 'Ce que tu viens de poser dans ce bloc',
    interpretationTitle: 'Comment on peut lire ce que tu as posé',
    detailsTitle: 'Détail des réponses chiffrées'
  },
  b2: {
    summaryTitle: 'Ce que tu viens de poser dans ce bloc',
    interpretationTitle: 'Comment on peut lire ce que tu as posé',
    detailsTitle: 'Détail des réponses chiffrées'
  },
  b3: {
    summaryTitle: 'Ce que tu viens de poser dans ce bloc',
    interpretationTitle: 'Comment on peut lire ce que tu as posé',
    detailsTitle: 'Détail des réponses chiffrées'
  },
  b4: {
    summaryTitle: 'Ce que tu viens de poser dans ce bloc',
    interpretationTitle: 'Comment on peut lire ce que tu as posé',
    detailsTitle: 'Détail des réponses chiffrées'
  }
};

export const p1Copy = {
  intro: {
    title: 'Ma structure dysfonctionne — atelier modulaire',
    subtitle: 'Panorama express, blocs d’exploration, bilans clairs. Tu avances à ton rythme.',
    meta: 'Tu peux t’arrêter à tout moment, ce qui est répondu reste utile.',
    cta: 'Commencer avec le panorama',
    whatToExpectTitle: 'Ce que tu vas trouver ici',
    whatToExpectBody: [
      'Un panorama express pour repérer les tensions, puis des blocs thématiques à explorer dans l’ordre que tu veux.',
      'Chaque bloc donne un petit bilan. Tu peux en faire un seul ou plusieurs avant de passer à la suite.'
    ],
    recognitionTitle: 'Tu te reconnais ici ?',
    recognitionList: [
      'Réunions qui tournent en rond, décisions floues.',
      'Tensions humaines qui prennent le pas sur le fond.',
      'Process peu clairs, outils qui fatiguent.'
    ]
  },
  panorama: {
    title: 'Panorama express',
    subtitle: 'Mini parcours transverse pour repérer où ça coince.',
    meta: '≈ 3–4 minutes · Tu peux sauter des questions, les réponses restent sur cet appareil.',
    validate: 'Voir le bilan panorama',
    back: 'Retour à l’intro',
    bilan: {
      summaryTitle: '',
      summarySubtitle: '',
      interpretationTitle: 'Ce qu’on peut en comprendre',
      interpretationSubtitle: 'Quelques pistes de lecture pour situer ta structure, sans verdict ni jugement.',
      nextStepsTitle: 'Ce que tu peux explorer maintenant',
      nextStepsSubtitle: 'Des blocs d’atelier proposés en priorité, que tu es libre de suivre… ou pas.',
      sovereigntyReminder:
        'Ce bilan est calculé sur cet appareil et n’est pas envoyé au serveur. Tu peux continuer, faire une pause ou tout effacer : c’est toi qui choisis.'
    }
  },
  hub: {
    title: 'Bilan panoramique initial',
    subtitle: 'Un aperçu rapide des tensions que tu as signalées, axe par axe, avec accès aux blocs détaillés.',
    panoramaHeading: 'Synthèse panorama',
    blocksHeading: 'Blocs d’exploration',
    backToPanorama: 'Retour au panorama',
    exploreCta: 'Explorer ce bloc',
    blockBilanCta: 'Voir le bilan',
    globalLocked: 'Le bilan global s’active après le panorama et au moins un bloc 1 ou 3 renseigné.',
    globalCta: 'Voir le bilan global P1 et des pistes d’action'
  },
  blockQuestionnaire: {
    backToHub: 'Retour au hub',
    progressAnsweredLabel: 'Répondu',
    progressSkippedLabel: 'Non répondu'
  },
  blockBilan: {
    statsLabel: 'Scores agrégés (pas de réponses brutes) :',
    themesLabel: 'Sous-thèmes',
    ctaHub: 'Retour au hub des blocs',
    ctaAnother: 'Explorer un autre bloc',
    ctaGlobal: 'Voir le bilan global P1 et des pistes d’action',
    ctaClear: 'Effacer mes réponses de cet appareil',
    globalLocked: 'Le bilan global sera accessible après le panorama et au moins un bloc 1 ou 3 renseigné.'
  },
  blockNarrative: {
    b1: p1BlockBilanSections.b1,
    b2: p1BlockBilanSections.b2,
    b3: p1BlockBilanSections.b3,
    b4: p1BlockBilanSections.b4
  },
  blocks: {
    b1: {
      bilan: p1BlockBilanSections.b1
    },
    b2: {
      bilan: p1BlockBilanSections.b2
    },
    b3: {
      bilan: p1BlockBilanSections.b3
    },
    b4: {
      bilan: p1BlockBilanSections.b4
    }
  },
  global: {
    title: 'Bilan global P1',
    subtitle: 'Panorama + blocs explorés. Export 100% côté client.',
    panoramaHeading: 'Panorama',
    blocksHeading: 'Blocs explorés',
    exportHeading: 'Export (client-side)',
    exportNotice: 'Le texte ci-dessus est généré côté client, aucune donnée n’est envoyée au serveur.',
    copyCta: 'Copier le bilan',
    printCta: 'Imprimer',
    clearCta: 'Effacer mes réponses de cet appareil',
    backToHub: 'Retour au hub des blocs',
    sovereigntyNote: 'Ce bilan reste sur cet appareil. Pas d’envoi serveur, pas d’identification.'
  },
  export: {
    title: '=== Bilan P1 (panorama + blocs) ===',
    panoramaHeading: '--- Panorama express ---',
    blocksHeading: '--- Blocs explorés ---',
    globalHeading: '--- Bilan global (agrégé) ---',
    metaHeading: '--- Métadonnées ---',
    closingLine: "Ce bilan est généré côté client et n'est pas envoyé au serveur."
  }
};

// Panorama express (10 questions)
export const p1PanoramaQuestions: P1PanoramaQuestion[] = [
  // Humain
  {
    id: 'p1_panorama_humain_b1',
    axisId: 'human',
    blockId: 'B1',
    weight: 1,
    polarity: 'positive',
    critical: false,
    label: 'Dans notre structure, les échanges restent globalement respectueux, même quand il y a des désaccords.'
  },
  {
    id: 'p1_panorama_humain_b2',
    axisId: 'human',
    blockId: 'B2',
    weight: 2,
    polarity: 'negative',
    critical: true,
    label:
      'Quand la pression monte, il devient difficile de parler franchement sans craindre que cela se retourne contre quelqu’un.'
  },
  {
    id: 'p1_panorama_humain_b3',
    axisId: 'human',
    blockId: 'B3',
    weight: 3,
    polarity: 'negative',
    critical: true,
    label:
      'Certaines personnes ou certains groupes semblent régulièrement mis de côté dans les discussions importantes ou les moments conviviaux.'
  },
  {
    id: 'p1_panorama_humain_b4',
    axisId: 'human',
    blockId: 'B4',
    weight: 3,
    polarity: 'negative',
    critical: true,
    label:
      'Il m’arrive de me sentir en insécurité (émotionnelle ou symbolique) quand certains sujets sont abordés dans notre structure.'
  },

  // Mouvement
  {
    id: 'p1_panorama_mouvement_b1',
    axisId: 'movement',
    blockId: 'B1',
    weight: 1,
    polarity: 'positive',
    critical: false,
    label: 'Globalement, j’ai le sentiment que notre structure avance, même si tout n’est pas parfait.'
  },
  {
    id: 'p1_panorama_mouvement_b2',
    axisId: 'movement',
    blockId: 'B2',
    weight: 2,
    polarity: 'negative',
    critical: false,
    label: 'Nous passons beaucoup de temps à gérer des urgences, au point d’avoir du mal à stabiliser ce qui devrait être routinier.'
  },
  {
    id: 'p1_panorama_mouvement_b3',
    axisId: 'movement',
    blockId: 'B3',
    weight: 2,
    polarity: 'negative',
    critical: true,
    label:
      'Des projets ou chantiers importants restent en suspens pendant des mois, sans décision claire pour les relancer ou les arrêter.'
  },
  {
    id: 'p1_panorama_mouvement_b4',
    axisId: 'movement',
    blockId: 'B4',
    weight: 3,
    polarity: 'negative',
    critical: true,
    label:
      'On a souvent l’impression de s’épuiser à éteindre des incendies, sans que la situation globale s’améliore vraiment.'
  },

  // Décisions
  {
    id: 'p1_panorama_decisions_b1',
    axisId: 'decisions',
    blockId: 'B1',
    weight: 1,
    polarity: 'positive',
    critical: false,
    label:
      'Les décisions importantes sont annoncées de manière suffisamment claire pour que je comprenne ce qui change pour moi.'
  },
  {
    id: 'p1_panorama_decisions_b2',
    axisId: 'decisions',
    blockId: 'B2',
    weight: 2,
    polarity: 'negative',
    critical: false,
    label: 'Il n’est pas toujours évident de savoir qui décide quoi, ni sur quelle base les décisions sont prises.'
  },
  {
    id: 'p1_panorama_decisions_b3',
    axisId: 'decisions',
    blockId: 'B3',
    weight: 3,
    polarity: 'negative',
    critical: true,
    label:
      'Il arrive que des décisions importantes soient prises ou modifiées sans que les personnes concernées aient pu donner leur point de vue.'
  },
  {
    id: 'p1_panorama_decisions_b4',
    axisId: 'decisions',
    blockId: 'B4',
    weight: 3,
    polarity: 'negative',
    critical: true,
    label:
      'Certaines décisions semblent prises dans un cercle très restreint, et il est délicat, voire impossible, de les questionner ouvertement.'
  },

  // Structure
  {
    id: 'p1_panorama_structure_b1',
    axisId: 'structure',
    blockId: 'B1',
    weight: 1,
    polarity: 'positive',
    critical: false,
    label: 'Les grandes lignes de l’organisation (qui fait quoi, à quel endroit) sont suffisamment claires pour moi.'
  },
  {
    id: 'p1_panorama_structure_b2',
    axisId: 'structure',
    blockId: 'B2',
    weight: 2,
    polarity: 'negative',
    critical: false,
    label:
      'Dans la pratique, les frontières entre les rôles sont parfois floues, ce qui crée des zones grises de responsabilité.'
  },
  {
    id: 'p1_panorama_structure_b3',
    axisId: 'structure',
    blockId: 'B3',
    weight: 2,
    polarity: 'negative',
    critical: true,
    label:
      'Certaines personnes se retrouvent régulièrement à compenser des manques structurels (rôles non tenus, absences, outils inadaptés).'
  },
  {
    id: 'p1_panorama_structure_b4',
    axisId: 'structure',
    blockId: 'B4',
    weight: 3,
    polarity: 'negative',
    critical: true,
    label:
      'Si une ou deux personnes clés s’absentent, une partie importante de l’activité de la structure est fortement ralentie ou à l’arrêt.'
  }
];

// Narration panorama (clés éditoriales, pas de texte final)
export const p1PanoramaNarratives = {
  human: {
    low: {
      summaryKey: 'p1.panorama.human.low.summary',
      interpretationKey: 'p1.panorama.human.low.interpretation'
    },
    medium: {
      summaryKey: 'p1.panorama.human.medium.summary',
      interpretationKey: 'p1.panorama.human.medium.interpretation'
    },
    high: {
      summaryKey: 'p1.panorama.human.high.summary',
      interpretationKey: 'p1.panorama.human.high.interpretation'
    }
  },
  movement: {
    low: {
      summaryKey: 'p1.panorama.organization.low.summary',
      interpretationKey: 'p1.panorama.organization.low.interpretation'
    },
    medium: {
      summaryKey: 'p1.panorama.organization.medium.summary',
      interpretationKey: 'p1.panorama.organization.medium.interpretation'
    },
    high: {
      summaryKey: 'p1.panorama.organization.high.summary',
      interpretationKey: 'p1.panorama.organization.high.interpretation'
    }
  },
  decisions: {
    low: {
      summaryKey: 'p1.panorama.governance.low.summary',
      interpretationKey: 'p1.panorama.governance.low.interpretation'
    },
    medium: {
      summaryKey: 'p1.panorama.governance.medium.summary',
      interpretationKey: 'p1.panorama.governance.medium.interpretation'
    },
    high: {
      summaryKey: 'p1.panorama.governance.high.summary',
      interpretationKey: 'p1.panorama.governance.high.interpretation'
    }
  },
  structure: {
    low: {
      summaryKey: 'p1.panorama.resources.low.summary',
      interpretationKey: 'p1.panorama.resources.low.interpretation'
    },
    medium: {
      summaryKey: 'p1.panorama.resources.medium.summary',
      interpretationKey: 'p1.panorama.resources.medium.interpretation'
    },
    high: {
      summaryKey: 'p1.panorama.resources.high.summary',
      interpretationKey: 'p1.panorama.resources.high.interpretation'
    }
  }
} as const;

// Suggestions de blocs en fonction des tensions panorama (clés éditoriales)
export const p1PanoramaSuggestions = {
  human: {
    mainBlockId: 'b1',
    reasonKeyByIntensity: {
      medium: 'p1.panorama.suggest.b1.human.medium',
      high: 'p1.panorama.suggest.b1.human.high'
    }
  },
  decisions: {
    mainBlockId: 'b3',
    reasonKeyByIntensity: {
      medium: 'p1.panorama.suggest.b3.governance.medium',
      high: 'p1.panorama.suggest.b3.governance.high'
    }
  },
  movement: {
    mainBlockId: 'b2',
    reasonKeyByIntensity: {
      medium: 'p1.panorama.suggest.b2.organization.medium',
      high: 'p1.panorama.suggest.b2.organization.high'
    }
  },
  structure: {
    mainBlockId: 'b4',
    reasonKeyByIntensity: {
      medium: 'p1.panorama.suggest.b4.resources.medium',
      high: 'p1.panorama.suggest.b4.resources.high'
    }
  }
} as const;

// Texte finalisé panorama (clés -> FR Talia)
export const p1PanoramaText: Record<string, string> = {
  // Synthèse
  'p1.panorama.human.low.summary':
    'Sur l’axe humain, tu décris plutôt un climat soutenant, avec des tensions limitées ou ponctuelles. Les relations ne semblent pas être le principal point de friction aujourd’hui.',
  'p1.panorama.human.medium.summary':
    'Sur l’axe humain, tu signales des tensions récurrentes mais pas écrasantes. Le climat relationnel pèse par moments, sans prendre toute la place.',
  'p1.panorama.human.high.summary':
    'Sur l’axe humain, tu décris un climat lourd où les relations, la confiance et les non-dits pèsent fortement. Le vécu relationnel semble être au cœur de ce qui coince pour toi.',
  'p1.panorama.governance.low.summary':
    'Côté gouvernance, tu sembles avoir une lecture globalement claire de qui décide et comment les choses se tranchent. Les zones floues existent sans paraître centrales pour l’instant.',
  'p1.panorama.governance.medium.summary':
    'Côté gouvernance, tu pointes des zones de flou ou d’incohérence qui reviennent régulièrement. Les règles et les décisions ne sont ni catastrophiques ni pleinement confortables.',
  'p1.panorama.governance.high.summary':
    'Côté gouvernance, tu décris un fort sentiment de flou sur les règles et les décisions. Qui décide quoi, où et comment semble être une source majeure de tension.',
  'p1.panorama.organization.low.summary':
    'Sur l’organisation du quotidien, tu sembles percevoir un fonctionnement globalement lisible. Les imprévus existent mais sans donner l’impression de chaos permanent.',
  'p1.panorama.organization.medium.summary':
    'Sur l’organisation du quotidien, tu signales des couacs réguliers : priorités qui bougent, informations qui circulent mal, imprévus qui bousculent. Ce n’est pas “ingérable”, mais ça consomme de l’énergie.',
  'p1.panorama.organization.high.summary':
    'Sur l’organisation du quotidien, tu décris un fonctionnement très instable : priorités qui changent, manque de visibilité, surprises fréquentes. Le ressenti est proche du mode “impro permanente”.',
  'p1.panorama.resources.low.summary':
    'Côté ressources (temps, énergie, moyens, outils), tu ne signales pas de surcharge massive. La structure semble tenir son rythme sans t’épuiser en continu.',
  'p1.panorama.resources.medium.summary':
    'Côté ressources, tu décris une tension diffuse : charge parfois lourde, fatigue qui revient, dépendances à certains outils ou personnes. Ça tient, mais au prix d’efforts notables.',
  'p1.panorama.resources.high.summary':
    'Côté ressources, tu pointes une forte saturation : charge élevée, mode pompier, dépendance à quelques personnes ou outils clés. La soutenabilité du système semble clairement en question.',

  // Interprétation
  'p1.panorama.human.low.interpretation':
    'Quand l’axe humain apparaît plutôt apaisé, cela peut vouloir dire que les relations tiennent malgré les contraintes. Les tensions éventuelles se gèrent sans prendre toute la scène. Cela laisse de la place pour travailler d’abord sur d’autres dimensions du système.',
  'p1.panorama.human.medium.interpretation':
    'Un niveau intermédiaire sur l’axe humain signale souvent des collectifs qui “tiennent” mais s’usent : on coopère, mais avec des frottements récurrents. Il peut y avoir des non-dits ou des malentendus qui s’installent dans la durée. C’est un bon moment pour revisiter les espaces de parole et les règles de jeu.',
  'p1.panorama.human.high.interpretation':
    'Quand le score humain est élevé, c’est souvent le signe que les tensions relationnelles prennent le pas sur le reste : conflits, méfiance, fatigue émotionnelle. Ce n’est pas un échec individuel, c’est le système qui met beaucoup de pression sur les personnes. Travailler sur les règles du jeu et la redistribution de la charge peut aider à remettre du souffle.',
  'p1.panorama.governance.low.interpretation':
    'Un axe gouvernance peu tendu laisse entendre que les circuits de décision sont suffisamment lisibles pour toi. Il peut bien sûr rester des zones grises, mais elles ne semblent pas structurer ton malaise. Tu peux utiliser cette relative clarté comme appui pour traiter d’autres blocages.',
  'p1.panorama.governance.medium.interpretation':
    'Un niveau intermédiaire en gouvernance décrit souvent des structures où “ça fonctionne à peu près”, mais où les décisions sont parfois ressenties comme floues ou inégales. On navigue avec des règles partielles, mêlant formel et informel. Clarifier quelques rôles et circuits clés peut déjà changer beaucoup de choses.',
  'p1.panorama.governance.high.interpretation':
    'Un score élevé en gouvernance indique que le “qui décide quoi, où et comment” est vécu comme très confus ou injuste. Dans beaucoup de collectifs, cela se traduit par des contournements, des frustrations et une perte de confiance. Mettre à plat les rôles décisionnels et les règles appliquées en vrai devient alors un chantier central.',
  'p1.panorama.organization.low.interpretation':
    'Quand l’organisation du quotidien est peu en tension, cela signifie souvent que les routines tiennent et que les imprévus restent gérables. Le système n’est pas parfait, mais il ne t’empêche pas de te projeter. Tu peux t’appuyer sur cette stabilité relative pour travailler d’autres axes.',
  'p1.panorama.organization.medium.interpretation':
    'Un niveau intermédiaire sur l’organisation décrit souvent des collectifs pris entre bonne volonté et manque de structuration : on avance, mais avec des accrocs réguliers. Les priorités, la circulation d’information ou la planification peuvent être sources de friction. Mettre un peu de cadre sans rigidifier peut déjà alléger beaucoup de monde.',
  'p1.panorama.organization.high.interpretation':
    'Un score élevé sur l’organisation signale un quotidien très chahuté : urgences, replanifications, décisions qui arrivent tard, manque de visibilité. Ce n’est pas forcément un défaut de personnes, mais souvent le signe d’un système qui n’a jamais été pensé pour durer. Clarifier les rythmes, les repères et les points de passage devient un enjeu majeur.',
  'p1.panorama.resources.low.interpretation':
    'Quand l’axe ressources est peu tendu, cela peut indiquer que la charge, les moyens et les outils sont à peu près proportionnés aux ambitions actuelles. Il reste toujours des tensions, mais elles ne mettent pas tout le monde au bord de la rupture. Tu peux en profiter pour travailler la qualité du fonctionnement plutôt que la survie.',
  'p1.panorama.resources.medium.interpretation':
    'Un niveau intermédiaire en ressources renvoie souvent à un équilibre fragile : ça passe, mais sans beaucoup de marge. Les personnes clés, le temps, les financements ou les outils sont sollicités au maximum. Se poser la question de ce qu’on maintient absolument, et de ce qu’on peut alléger, devient un levier important.',
  'p1.panorama.resources.high.interpretation':
    'Un score élevé en ressources indique une structure en mode survie : surcharge, dépendances fortes, sentiment de ne jamais rattraper le flux. C’est fréquent dans les projets à impact qui veulent “tout tenir”. Nommer ces limites permet souvent de remettre du réalisme dans les ambitions et de sécuriser ce qui compte le plus.',

  // Suggestions
  'p1.panorama.suggest.b1.human.medium':
    'Comme l’axe humain ressort déjà assez présent, le bloc 1 peut t’aider à mettre des mots plus précis sur le climat, les places de chacun·e et les non-dits. Si tu le souhaites, tu peux commencer par là pour mieux voir comment tu te situes dans la structure.',
  'p1.panorama.suggest.b1.human.high':
    'L’axe humain est particulièrement en tension dans tes réponses. Explorer le bloc 1 en premier peut t’aider à clarifier ce qui se joue dans les relations, la confiance et le sentiment de légitimité, sans désigner de coupables.',
  'p1.panorama.suggest.b3.governance.medium':
    'Tu pointes déjà des flous sur les règles et les décisions, sans que tout soit bloqué. Le bloc 3 peut t’aider à voir plus finement où ça coince : qui décide, comment, et ce que ça produit au quotidien. À toi de voir si tu veux y passer maintenant ou plus tard.',
  'p1.panorama.suggest.b3.governance.high':
    'La gouvernance ressort comme un axe très sensible dans ton panorama. Le bloc 3 te propose de décortiquer les circuits de décision et la gestion du désaccord, pour transformer du “flou frustrant” en cartes plus lisibles. Tu peux choisir d’y aller en priorité si ça résonne.',
  'p1.panorama.suggest.b2.organization.medium':
    'Tu décris un quotidien parfois chahuté mais pas complètement hors de contrôle. Le bloc 2 “Mouvement & prévisibilité” peut t’aider à voir comment les priorités, les changements et les projets s’imbriquent. Si tu veux mieux comprendre le tempo de ta structure, c’est un bon point de passage.',
  'p1.panorama.suggest.b2.organization.high':
    'L’organisation du quotidien semble très instable dans tes réponses. Le bloc 2 peut t’aider à cartographier le rythme, les urgences et la manière dont les décisions bousculent le terrain. Tu peux choisir d’y aller en premier pour sortir du ressenti de chaos.',
  'p1.panorama.suggest.b4.organization.medium':
    'Au-delà du rythme, certaines réponses laissent penser que la structure elle-même manque peut-être de lisibilité. Le bloc 4 “Structure & robustesse” t’aidera à explorer l’organigramme réel, les dépendances et les plans B possibles.',
  'p1.panorama.suggest.b4.organization.high':
    'Tes réponses suggèrent que la structure telle qu’elle est conçue aujourd’hui pèse fortement sur le fonctionnement. Le bloc 4 peut t’aider à repérer où la maison tient sur quelques piliers fragiles, et où il serait utile de consolider. Tu peux le choisir en priorité si c’est là que tu veux mettre le focus.',
  'p1.panorama.suggest.b2.resources.medium':
    'La question des ressources apparaît sous tension, sans être encore au bord de la rupture. Le bloc 2 peut t’aider à voir comment le rythme des projets et des urgences consomme l’énergie disponible, et ce qui pourrait être ajusté.',
  'p1.panorama.suggest.b2.resources.high':
    'Tu décris une forte saturation côté ressources, avec un ressenti proche du mode pompier. Le bloc 2 peut t’aider à comprendre comment le tempo et la façon de gérer les crises alimentent cette fatigue, et où se situent les leviers de régulation possibles.',
  'p1.panorama.suggest.b4.resources.medium':
    'Tes réponses montrent aussi des dépendances à certaines personnes ou outils, sans que tout repose sur un seul point de rupture. Le bloc 4 t’aidera à cartographier ces dépendances et à imaginer des plans de continuité raisonnables.',
  'p1.panorama.suggest.b4.resources.high':
    'Quand les ressources sont très tendues, la question de la robustesse du système devient centrale. Le bloc 4 peut t’aider à repérer où la structure est trop dépendante de quelques personnes, outils ou financeurs, et ce qui mériterait d’être sécurisé en priorité.',

  // Narration blocs (B1 à B4)
  "p1.b1.global.low.summary":
    "Sur ce bloc, tu ne décris que peu de tensions dans le climat humain et ton ressenti au quotidien.",
  "p1.b1.global.medium.summary":
    "Tu décris un climat où il y a à la fois des appuis et des zones de tension qui reviennent régulièrement.",
  "p1.b1.global.high.summary":
    "Tu décris un niveau de tension élevé dans le climat humain, la confiance et ton ressenti dans la structure.",
  "p1.b1.global.low.interpretation":
    "Cela suggère que, même si tout n’est pas parfait, le climat relationnel et ton ressenti restent globalement soutenables. C’est une base précieuse pour travailler sur d’autres dimensions sans être en mode survie émotionnelle.",
  "p1.b1.global.medium.interpretation":
    "Ce profil intermédiaire indique souvent un collectif où l’on tient bon, mais avec des signaux de fatigue, de malentendus ou de désalignement qui s’installent. Il y a de la matière à clarifier pour éviter que ces tensions ne deviennent la norme.",
  "p1.b1.global.high.interpretation":
    "Quand ce bloc ressort fort, c’est souvent le signe que le climat humain, le sentiment de place et l’alignement de valeurs sont fortement mis à l’épreuve. Le système te demande beaucoup, et poser ces éléments à plat peut devenir une question de protection, pas juste d’optimisation.",
  "p1.b1.theme.position_place.high.summary":
    "Les questions liées à ta place dans la structure et à la répartition des rôles ressortent fortement.",
  "p1.b1.theme.position_place.high.interpretation":
    "Cela peut indiquer que les frontières entre centre et périphérie, responsabilités officielles et réelles, ne sont pas claires. Ce flou nourrit souvent un sentiment d’injustice ou de décalage, même quand tout le monde “fait de son mieux”.",
  "p1.b1.theme.regles_implicites.high.summary":
    "Tu pointes fortement le manque de lisibilité des règles, des circuits et du “mode d’emploi” de la structure.",
  "p1.b1.theme.regles_implicites.high.interpretation":
    "Quand ce thème est haut, cela raconte souvent une organisation où l’on fonctionne beaucoup à l’implicite et à l’habitude. Cela crée du doute permanent : “est-ce que je fais comme il faut ?”, même sans mauvaise intention de la part des personnes.",
  "p1.b1.theme.climat_relationnel.high.summary":
    "Le climat relationnel (confiance, non-dits, conflits, alliances) semble peser fortement dans ton expérience.",
  "p1.b1.theme.climat_relationnel.high.interpretation":
    "Un climat chargé peut rendre chaque échange plus coûteux que nécessaire. Ce n’est pas un signe que “les personnes sont mauvaises”, mais plutôt que le système offre peu d’espaces sûrs pour exprimer les tensions et les traiter vraiment.",
  "p1.b1.theme.sens_alignement.high.summary":
    "Tu signales un décalage important entre le projet affiché et ce que tu vis, ou entre tes valeurs et le fonctionnement réel.",
  "p1.b1.theme.sens_alignement.high.interpretation":
    "Quand le sens et l’alignement ressortent fort, ce n’est pas un caprice individuel : c’est souvent que la structure a glissé vers la survie ou la gestion de façade. Cela peut créer un conflit intérieur profond chez les personnes les plus engagées.",
  "p1.b1.theme.charge_fatigue.high.summary":
    "Tu décris une charge importante, une fatigue récurrente et une impression de porter beaucoup, parfois trop.",
  "p1.b1.theme.charge_fatigue.high.interpretation":
    "Ce thème élevé indique que le système repose sur des personnes très exposées, sans marges suffisantes. On n’est pas sur un “manque de volonté”, mais sur une soutenabilité qui devient critique si rien n’est ajusté.",
  "p1.b1.theme.previsibilite.high.summary":
    "Ton quotidien apparaît comme peu prévisible, avec des changements ou des urgences qui bousculent souvent ton organisation.",
  "p1.b1.theme.previsibilite.high.interpretation":
    "Quand la prévisibilité est faible, la structure fonctionne en mode “urgence par défaut”. Cela rend plus difficile de se projeter, de prendre soin du collectif et de tenir dans la durée, même avec beaucoup de bonne volonté.",
  "p1.b1.theme.justice_equite.high.summary":
    "Tu soulèves fortement des questions d’équité, de traitement différent ou de passes-droits ressentis.",
  "p1.b1.theme.justice_equite.high.interpretation":
    "Un score élevé ici montre souvent que les règles ne sont pas perçues comme appliquées pour tout le monde de la même façon. Cela fragilise la confiance dans le système, même si, individuellement, chacun pense agir pour le mieux.",

  "p1.b2.global.low.summary":
    "Sur ce bloc, tu décris un mouvement plutôt maîtrisé : le rythme et les changements restent globalement gérables.",
  "p1.b2.global.medium.summary":
    "Tu décris une dynamique où le rythme, les changements et la lisibilité des effets sont parfois stabilisés, parfois chaotiques.",
  "p1.b2.global.high.summary":
    "Tu décris un fonctionnement très chahuté : priorités changeantes, crises, imprévus et manque de visibilité sur les effets des décisions.",
  "p1.b2.global.low.interpretation":
    "Ce profil suggère que, même si tout n’est pas parfaitement planifié, la structure garde une capacité minimale à anticiper et à absorber les variations. Cela offre un terrain plus serein pour travailler sur d’autres points.",
  "p1.b2.global.medium.interpretation":
    "Un niveau intermédiaire indique souvent un collectif qui alterne entre des phases organisées et des moments de “mode pompier”. Il y a de la marge pour rendre le mouvement plus lisible avant que la fatigue ne s’installe durablement.",
  "p1.b2.global.high.interpretation":
    "Quand ce bloc ressort fort, c’est que le système est surtout en réaction : les urgences, les changements subis et le manque de boucles d’apprentissage rendent la trajectoire difficile à tenir. Sans remettre en cause les personnes, il devient nécessaire de sécuriser le tempo et les priorités.",
  "p1.b2.theme.stabilite_priorites.high.summary":
    "Tu montres que les priorités bougent souvent, parfois brutalement, sans cadre clair.",
  "p1.b2.theme.stabilite_priorites.high.interpretation":
    "Un score élevé ici signale une difficulté à tenir le cap dans la durée. Cela met les équipes en tension permanente et empêche de voir ce qui a vraiment le temps de mûrir ou d’aboutir.",
  "p1.b2.theme.changement_subi.high.summary":
    "Tu décris des changements fréquents que tu découvres plutôt en les subissant qu’en les préparant.",
  "p1.b2.theme.changement_subi.high.interpretation":
    "Quand le changement est surtout vécu comme subi, la structure se prive de la capacité des personnes à anticiper et ajuster. Cela ne veut pas dire qu’il ne faut plus changer, mais qu’il manque un vrai “mode test” et des temps d’appropriation.",
  "p1.b2.theme.cause_effet.high.summary":
    "Tu pointes une forte difficulté à relier les actions menées et les effets observés dans la structure.",
  "p1.b2.theme.cause_effet.high.interpretation":
    "Ce thème élevé montre souvent que les décisions s’empilent sans outils simples de suivi. On agit beaucoup, mais on apprend peu de ce qui fonctionne ou non, ce qui alimente la fatigue et le sentiment d’inefficacité.",
  "p1.b2.theme.projets_apprentissage.high.summary":
    "Tu décris des projets ou expérimentations qui manquent d’objectifs clairs et de vrais bilans.",
  "p1.b2.theme.projets_apprentissage.high.interpretation":
    "Quand ce thème ressort fort, la structure lance des choses sans vraiment formaliser ce qu’elle veut en apprendre. Cela crée une impression de dispersion et empêche de capitaliser sur les efforts déjà fournis.",
  "p1.b2.theme.crises_surprises.high.summary":
    "Les surprises, urgences et crises reviennent souvent et bousculent ton organisation.",
  "p1.b2.theme.crises_surprises.high.interpretation":
    "Un niveau élevé ici indique que la structure gère plus souvent l’incendie que la prévention. Les mêmes types de situations peuvent se répéter, faute de temps ou de cadre pour en tirer des scénarios plus robustes.",
  "p1.b2.theme.temporalite_horizon.high.summary":
    "Tu signales une difficulté à articuler le court terme et le long terme, avec un sentiment de “tout est urgent”.",
  "p1.b2.theme.temporalite_horizon.high.interpretation":
    "Ce thème fort montre que la structure a du mal à se donner de vrais temps pour penser l’avenir autrement qu’en mode institutionnel. Cela rend les décisions stratégiques moins concrètes pour celles et ceux qui les vivent au quotidien.",
  "p1.b2.theme.coordination.high.summary":
    "Tu ressens une coordination difficile entre personnes, équipes ou cercles, avec des dépendances peu visibles.",
  "p1.b2.theme.coordination.high.interpretation":
    "Un score élevé ici traduit souvent des flux d’information fragmentés : chacun avance dans son coin, avec des effets de surprise et de doublons. Ce n’est pas un manque de bonne volonté, mais un manque d’outillage et de rituels de coordination.",

  "p1.b3.global.low.summary":
    "Sur ce bloc, tu décris des règles et décisions globalement lisibles, même si tout n’est pas parfait.",
  "p1.b3.global.medium.summary":
    "Tu décris un paysage de décisions où certaines règles sont claires, d’autres floues ou appliquées de manière variable.",
  "p1.b3.global.high.summary":
    "Tu décris une forte difficulté à comprendre qui décide quoi, comment les règles s’appliquent et comment les décisions sont suivies.",
  "p1.b3.global.low.interpretation":
    "Ce profil laisse penser que, malgré des zones grises, les circuits décisionnels offrent un minimum de repères. On peut construire à partir de là sans tout remettre en cause.",
  "p1.b3.global.medium.interpretation":
    "Un niveau intermédiaire signale souvent une structure où les décisions sont parfois bien cadrées, parfois très informelles. Sans clarification, ce mélange entretient le doute et les interprétations, même chez les personnes de bonne foi.",
  "p1.b3.global.high.interpretation":
    "Quand ce bloc ressort fort, ce n’est pas un simple problème de “procédure manquante” : c’est que les circuits de décision, de responsabilité et de suivi sont fragiles. Cela pèse sur la confiance dans le système, même si chacun travaille dur à son niveau.",
  "p1.b3.theme.roles_decisionnels.high.summary":
    "Tu soulignes fortement le flou autour de qui est légitime pour décider sur quels sujets.",
  "p1.b3.theme.roles_decisionnels.high.interpretation":
    "Ce thème élevé montre que les rôles décisionnels ne sont pas assez explicites. Cela oblige à chercher en permanence “qui a le dernier mot”, ce qui ralentit le système et augmente les risques d’incompréhension.",
  "p1.b3.theme.processus_decision.high.summary":
    "Tu décris des décisions importantes prises dans des espaces peu visibles ou difficiles à suivre.",
  "p1.b3.theme.processus_decision.high.interpretation":
    "Quand ce thème ressort fort, la structure décide beaucoup “entre deux portes” ou dans des espaces peu formalisés. Cela ne veut pas dire qu’il n’y a pas d’intention, mais que la trace et le cadre manquent pour que tout le monde s’y retrouve.",
  "p1.b3.theme.responsabilite.high.summary":
    "Tu pointes une forte confusion autour de qui porte quelles décisions et leurs conséquences.",
  "p1.b3.theme.responsabilite.high.interpretation":
    "Un score élevé ici indique que, quand une décision pose problème, il est difficile de savoir qui peut agir pour ajuster. La responsabilité se dilue dans “le système”, ce qui freine l’apprentissage collectif.",
  "p1.b3.theme.participation_legitimite.high.summary":
    "Tu exprimes un sentiment de participation limitée ou peu prise en compte dans des décisions qui t’affectent.",
  "p1.b3.theme.participation_legitimite.high.interpretation":
    "Ce thème élevé raconte souvent un décalage entre qui vit les conséquences des décisions et qui est invité à en discuter. Cela fragilise la légitimité ressentie des choix, même si l’intention de départ est collective.",
  "p1.b3.theme.desaccord_tensions.high.summary":
    "Tu indiques que le désaccord autour des décisions est difficile à exprimer ou à traiter sereinement.",
  "p1.b3.theme.desaccord_tensions.high.interpretation":
    "Quand ce thème ressort fort, la structure manque d’espaces clairs pour revenir sur une décision, l’ajuster ou dire “là, ça coince pour nous”. Le désaccord devient alors un risque social plutôt qu’une ressource pour améliorer le système.",
  "p1.b3.theme.suivi_decisions.high.summary":
    "Tu pointes une difficulté à voir si les décisions sont réellement appliquées et maintenues dans le temps.",
  "p1.b3.theme.suivi_decisions.high.interpretation":
    "Un niveau élevé ici montre que le lien entre “ce qui est décidé” et “ce qui se passe vraiment” est fragile. Sans suivi, les décisions restent théoriques, ce qui finit par user la confiance dans la parole collective.",

  "p1.b4.global.low.summary":
    "Sur ce bloc, tu décris une structure globalement robuste, avec des fragilités mais aussi des appuis clairs.",
  "p1.b4.global.medium.summary":
    "Tu décris une structure qui tient, mais avec des dépendances et des zones non sécurisées qui commencent à peser.",
  "p1.b4.global.high.summary":
    "Tu décris une forte vulnérabilité structurelle : dépendance à quelques personnes, outils ou ressources, et peu de plans B explicites.",
  "p1.b4.global.low.interpretation":
    "Ce profil suggère que, même si certains points restent à consolider, la structure possède déjà des bases minimales de continuité et de transmission. Cela permet de travailler sans être en permanence sous la menace d’un “effondrement au moindre choc”.",
  "p1.b4.global.medium.interpretation":
    "Un niveau intermédiaire indique souvent une organisation qui s’est construite en avançant, avec de bons réflexes mais peu de consolidation. Les risques existent, sans être encore critiques, ce qui en fait un bon moment pour renforcer la robustesse.",
  "p1.b4.global.high.interpretation":
    "Quand ce bloc ressort fort, le système tient beaucoup par l’engagement de quelques personnes et par des briques techniques peu remplaçables. Ce n’est pas une fatalité, mais un signal important pour éviter qu’un incident humain, technique ou externe ne mette tout en difficulté.",
  "p1.b4.theme.dependance_personnes.high.summary":
    "Tu montres une forte dépendance à quelques personnes clés pour que la structure continue de fonctionner.",
  "p1.b4.theme.dependance_personnes.high.interpretation":
    "Un score élevé ici signifie que beaucoup de choses reposent sur la mémoire, la disponibilité et la santé de quelques individus. Cela fragilise la structure, même si ces personnes sont compétentes et engagées.",
  "p1.b4.theme.dependance_outils.high.summary":
    "Tu signales une dépendance importante à certains outils, plateformes ou canaux, sans vrais équivalents prêts.",
  "p1.b4.theme.dependance_outils.high.interpretation":
    "Ce thème élevé montre que la structure est exposée à des risques techniques ou de fournisseur : un changement de règle ou une panne peut avoir des effets disproportionnés. Renforcer la souveraineté numérique devient alors un enjeu stratégique.",
  "p1.b4.theme.documentation_transmission.high.summary":
    "Tu décris un fonctionnement où beaucoup de choses sont peu ou pas documentées, ou dispersées.",
  "p1.b4.theme.documentation_transmission.high.interpretation":
    "Quand ce thème ressort fort, la continuité dépend surtout de ce que chacun garde “dans sa tête” ou dans ses outils personnels. Cela ralentit l’intégration des nouvelles personnes et met en danger la mémoire collective du projet.",
  "p1.b4.theme.complexite_structure.high.summary":
    "Tu exprimes une forte sensation de complexité : organigramme flou, instances nombreuses, casquettes multiples.",
  "p1.b4.theme.complexite_structure.high.interpretation":
    "Ce thème élevé indique que la structure a accumulé des couches sans toujours les simplifier ou les relier. Cela n’enlève rien à la valeur du projet, mais rend le fonctionnement difficile à lire et à piloter pour les personnes impliquées.",
  "p1.b4.theme.marges_manoeuvre.high.summary":
    "Tu montres que les marges de manœuvre (temps, énergie, ressources) sont très réduites, voire inexistantes.",
  "p1.b4.theme.marges_manoeuvre.high.interpretation":
    "Un score fort ici signale un système à flux tendu, où tout repose sur le fait que “rien ne déraille”. Cela rend difficile de dire non, de ralentir ou de réorienter, même quand ce serait nécessaire pour la santé du collectif.",
  "p1.b4.theme.exposition_chocs_externes.high.summary":
    "Tu perçois une forte exposition de la structure à des acteurs ou contraintes externes (financeurs, autorités, fournisseurs, contexte local…).",
  "p1.b4.theme.exposition_chocs_externes.high.interpretation":
    "Quand ce thème ressort fort, la structure dépend beaucoup de décisions ou d’événements qu’elle ne maîtrise pas. Cela invite à travailler la diversification et les scénarios de crise pour ne pas subir entièrement les chocs.",
  "p1.b4.theme.securite_abus_confiance.high.summary":
    "Tu pointes des zones sensibles où des accès, des décisions ou des informations circulent de manière peu sécurisée “pour aller plus vite”.",
  "p1.b4.theme.securite_abus_confiance.high.interpretation":
    "Un niveau élevé ici montre que la structure s’appuie sur la confiance personnelle plus que sur des garde-fous clairs. Cela crée des vulnérabilités (accès, signatures, données) qui peuvent être exploitées, même sans mauvaise intention au départ."
};

// Narration blocs (clés éditoriales, textes à renseigner plus tard)
export const p1BlockNarratives = {
  b1: {
    global: {
      low: {
        summaryKey: 'p1.b1.global.low.summary',
        interpretationKey: 'p1.b1.global.low.interpretation'
      },
      medium: {
        summaryKey: 'p1.b1.global.medium.summary',
        interpretationKey: 'p1.b1.global.medium.interpretation'
      },
      high: {
        summaryKey: 'p1.b1.global.high.summary',
        interpretationKey: 'p1.b1.global.high.interpretation'
      }
    },
    themes: {
      'Position et place': {
        high: {
          summaryKey: 'p1.b1.theme.position_place.high.summary',
          interpretationKey: 'p1.b1.theme.position_place.high.interpretation'
        }
      },
      'Règles et mode d’emploi': {
        high: {
          summaryKey: 'p1.b1.theme.regles_implicites.high.summary',
          interpretationKey: 'p1.b1.theme.regles_implicites.high.interpretation'
        }
      },
      'Climat relationnel': {
        high: {
          summaryKey: 'p1.b1.theme.climat_relationnel.high.summary',
          interpretationKey: 'p1.b1.theme.climat_relationnel.high.interpretation'
        }
      },
      'Sens et alignement': {
        high: {
          summaryKey: 'p1.b1.theme.sens_alignement.high.summary',
          interpretationKey: 'p1.b1.theme.sens_alignement.high.interpretation'
        }
      },
      'Charge et fatigue': {
        high: {
          summaryKey: 'p1.b1.theme.charge_fatigue.high.summary',
          interpretationKey: 'p1.b1.theme.charge_fatigue.high.interpretation'
        }
      },
      'Prévisibilité et quotidien': {
        high: {
          summaryKey: 'p1.b1.theme.previsibilite.high.summary',
          interpretationKey: 'p1.b1.theme.previsibilite.high.interpretation'
        }
      },
      'Justice / équité': {
        high: {
          summaryKey: 'p1.b1.theme.justice_equite.high.summary',
          interpretationKey: 'p1.b1.theme.justice_equite.high.interpretation'
        }
      }
    }
  },
  b2: {
    global: {
      low: {
        summaryKey: 'p1.b2.global.low.summary',
        interpretationKey: 'p1.b2.global.low.interpretation'
      },
      medium: {
        summaryKey: 'p1.b2.global.medium.summary',
        interpretationKey: 'p1.b2.global.medium.interpretation'
      },
      high: {
        summaryKey: 'p1.b2.global.high.summary',
        interpretationKey: 'p1.b2.global.high.interpretation'
      }
    },
    themes: {
      'Stabilité des priorités': {
        high: {
          summaryKey: 'p1.b2.theme.stabilite_priorites.high.summary',
          interpretationKey: 'p1.b2.theme.stabilite_priorites.high.interpretation'
        }
      },
      'Changement subi': {
        high: {
          summaryKey: 'p1.b2.theme.changement_subi.high.summary',
          interpretationKey: 'p1.b2.theme.changement_subi.high.interpretation'
        }
      },
      'Cause et effet': {
        high: {
          summaryKey: 'p1.b2.theme.cause_effet.high.summary',
          interpretationKey: 'p1.b2.theme.cause_effet.high.interpretation'
        }
      },
      'Projets et apprentissage': {
        high: {
          summaryKey: 'p1.b2.theme.projets_apprentissage.high.summary',
          interpretationKey: 'p1.b2.theme.projets_apprentissage.high.interpretation'
        }
      },
      'Crises et surprises': {
        high: {
          summaryKey: 'p1.b2.theme.crises_surprises.high.summary',
          interpretationKey: 'p1.b2.theme.crises_surprises.high.interpretation'
        }
      },
      'Temporalité et horizon': {
        high: {
          summaryKey: 'p1.b2.theme.temporalite_horizon.high.summary',
          interpretationKey: 'p1.b2.theme.temporalite_horizon.high.interpretation'
        }
      },
      Coordination: {
        high: {
          summaryKey: 'p1.b2.theme.coordination.high.summary',
          interpretationKey: 'p1.b2.theme.coordination.high.interpretation'
        }
      }
    }
  },
  b3: {
    global: {
      low: {
        summaryKey: 'p1.b3.global.low.summary',
        interpretationKey: 'p1.b3.global.low.interpretation'
      },
      medium: {
        summaryKey: 'p1.b3.global.medium.summary',
        interpretationKey: 'p1.b3.global.medium.interpretation'
      },
      high: {
        summaryKey: 'p1.b3.global.high.summary',
        interpretationKey: 'p1.b3.global.high.interpretation'
      }
    },
    themes: {
      'Rôles décisionnels': {
        high: {
          summaryKey: 'p1.b3.theme.roles_decisionnels.high.summary',
          interpretationKey: 'p1.b3.theme.roles_decisionnels.high.interpretation'
        }
      },
      'Processus de décision': {
        high: {
          summaryKey: 'p1.b3.theme.processus_decision.high.summary',
          interpretationKey: 'p1.b3.theme.processus_decision.high.interpretation'
        }
      },
      Responsabilité: {
        high: {
          summaryKey: 'p1.b3.theme.responsabilite.high.summary',
          interpretationKey: 'p1.b3.theme.responsabilite.high.interpretation'
        }
      },
      'Participation et légitimité': {
        high: {
          summaryKey: 'p1.b3.theme.participation_legitimite.high.summary',
          interpretationKey: 'p1.b3.theme.participation_legitimite.high.interpretation'
        }
      },
      'Désaccord et tensions': {
        high: {
          summaryKey: 'p1.b3.theme.desaccord_tensions.high.summary',
          interpretationKey: 'p1.b3.theme.desaccord_tensions.high.interpretation'
        }
      },
      'Suivi des décisions': {
        high: {
          summaryKey: 'p1.b3.theme.suivi_decisions.high.summary',
          interpretationKey: 'p1.b3.theme.suivi_decisions.high.interpretation'
        }
      }
    }
  },
  b4: {
    global: {
      low: {
        summaryKey: 'p1.b4.global.low.summary',
        interpretationKey: 'p1.b4.global.low.interpretation'
      },
      medium: {
        summaryKey: 'p1.b4.global.medium.summary',
        interpretationKey: 'p1.b4.global.medium.interpretation'
      },
      high: {
        summaryKey: 'p1.b4.global.high.summary',
        interpretationKey: 'p1.b4.global.high.interpretation'
      }
    },
    themes: {
      'Dépendance aux personnes': {
        high: {
          summaryKey: 'p1.b4.theme.dependance_personnes.high.summary',
          interpretationKey: 'p1.b4.theme.dependance_personnes.high.interpretation'
        }
      },
      'Dépendance aux outils': {
        high: {
          summaryKey: 'p1.b4.theme.dependance_outils.high.summary',
          interpretationKey: 'p1.b4.theme.dependance_outils.high.interpretation'
        }
      },
      'Documentation et transmission': {
        high: {
          summaryKey: 'p1.b4.theme.documentation_transmission.high.summary',
          interpretationKey: 'p1.b4.theme.documentation_transmission.high.interpretation'
        }
      },
      'Complexité de la structure': {
        high: {
          summaryKey: 'p1.b4.theme.complexite_structure.high.summary',
          interpretationKey: 'p1.b4.theme.complexite_structure.high.interpretation'
        }
      },
      'Marges de manœuvre': {
        high: {
          summaryKey: 'p1.b4.theme.marges_manoeuvre.high.summary',
          interpretationKey: 'p1.b4.theme.marges_manoeuvre.high.interpretation'
        }
      },
      'Exposition aux chocs externes': {
        high: {
          summaryKey: 'p1.b4.theme.exposition_chocs_externes.high.summary',
          interpretationKey: 'p1.b4.theme.exposition_chocs_externes.high.interpretation'
        }
      },
      'Sécurité et abus de confiance': {
        high: {
          summaryKey: 'p1.b4.theme.securite_abus_confiance.high.summary',
          interpretationKey: 'p1.b4.theme.securite_abus_confiance.high.interpretation'
        }
      }
    }
  }
};

// Blocs thématiques (30 items chacun)
export const p1BlocksQuestions: Record<P1BlockId, P1QuestionConfig[]> = p1BlocksQuestionsV1_3;

// Sous-thèmes par bloc (utilisés pour les bilans)
export const p1BlockThemes: Record<P1BlockId, Record<string, string>> = {
  b1: {
    p1_b1_q01: 'Sécurité psychologique',
    p1_b1_q02: 'Non-dits',
    p1_b1_q03: 'Gestion des conflits',
    p1_b1_q04: 'Charge et fatigue',
    p1_b1_q05: 'Sens et alignement',
    p1_b1_q06: 'Justice / équité',
    p1_b1_q07: 'Reconnaissance',
    p1_b1_q08: 'Isolement',
    p1_b1_q09: 'Prévisibilité du quotidien',
    p1_b1_q10: 'Justice / équité',
    p1_b1_q11: 'Charge et fatigue',
    p1_b1_q12: 'Ambiance globale'
  },
  b2: {
    p1_b2_q01: 'Stabilité des priorités',
    p1_b2_q02: 'Stabilité des priorités',
    p1_b2_q03: 'Stabilité des priorités',
    p1_b2_q04: 'Stabilité des priorités',
    p1_b2_q05: 'Stabilité des priorités',
    p1_b2_q06: 'Stabilité des priorités',
    p1_b2_q07: 'Changement subi',
    p1_b2_q08: 'Changement subi',
    p1_b2_q09: 'Changement subi',
    p1_b2_q10: 'Changement subi',
    p1_b2_q11: 'Changement subi',
    p1_b2_q12: 'Changement subi',
    p1_b2_q13: 'Cause et effet',
    p1_b2_q14: 'Cause et effet',
    p1_b2_q15: 'Cause et effet',
    p1_b2_q16: 'Cause et effet',
    p1_b2_q17: 'Cause et effet',
    p1_b2_q18: 'Projets et apprentissage',
    p1_b2_q19: 'Projets et apprentissage',
    p1_b2_q20: 'Projets et apprentissage',
    p1_b2_q21: 'Projets et apprentissage',
    p1_b2_q22: 'Projets et apprentissage',
    p1_b2_q23: 'Projets et apprentissage',
    p1_b2_q24: 'Crises et surprises',
    p1_b2_q25: 'Crises et surprises',
    p1_b2_q26: 'Crises et surprises',
    p1_b2_q27: 'Crises et surprises',
    p1_b2_q28: 'Temporalité et horizon',
    p1_b2_q29: 'Temporalité et horizon',
    p1_b2_q30: 'Coordination'
  },
  b3: {
    p1_b3_q01: 'Rôles décisionnels',
    p1_b3_q02: 'Décisions en coulisses',
    p1_b3_q03: 'Règles écrites',
    p1_b3_q04: 'Equité des règles',
    p1_b3_q05: 'Participation',
    p1_b3_q06: 'Désaccord et contestation',
    p1_b3_q07: 'Suivi des décisions',
    p1_b3_q08: 'Changements de règles',
    p1_b3_q09: 'Responsabilité politique',
    p1_b3_q10: 'Recours',
    p1_b3_q11: 'Entorses aux règles',
    p1_b3_q12: 'Opacité décisionnelle'
  },
  b4: {
    p1_b4_q01: 'Dépendance aux personnes',
    p1_b4_q02: 'Dépendance aux personnes',
    p1_b4_q03: 'Dépendance aux personnes',
    p1_b4_q04: 'Dépendance aux personnes',
    p1_b4_q05: 'Dépendance aux personnes',
    p1_b4_q06: 'Dépendance aux personnes',
    p1_b4_q07: 'Dépendance aux outils',
    p1_b4_q08: 'Dépendance aux outils',
    p1_b4_q09: 'Dépendance aux outils',
    p1_b4_q10: 'Dépendance aux outils',
    p1_b4_q11: 'Dépendance aux outils',
    p1_b4_q12: 'Dépendance aux outils',
    p1_b4_q13: 'Documentation et transmission',
    p1_b4_q14: 'Documentation et transmission',
    p1_b4_q15: 'Documentation et transmission',
    p1_b4_q16: 'Documentation et transmission',
    p1_b4_q17: 'Documentation et transmission',
    p1_b4_q18: 'Complexité de la structure',
    p1_b4_q19: 'Complexité de la structure',
    p1_b4_q20: 'Complexité de la structure',
    p1_b4_q21: 'Complexité de la structure',
    p1_b4_q22: 'Marges de manœuvre',
    p1_b4_q23: 'Marges de manœuvre',
    p1_b4_q24: 'Marges de manœuvre',
    p1_b4_q25: 'Marges de manœuvre',
    p1_b4_q26: 'Marges de manœuvre',
    p1_b4_q27: 'Exposition aux chocs externes',
    p1_b4_q28: 'Exposition aux chocs externes',
    p1_b4_q29: 'Exposition aux chocs externes',
    p1_b4_q30: 'Sécurité et abus de confiance'
  }
};
