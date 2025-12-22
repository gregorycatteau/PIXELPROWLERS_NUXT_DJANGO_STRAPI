import type { P1Question } from '@/types/journeys/p1';

type BaseQuestion = {
  id: string;
  axis: 'human' | 'governance' | 'organization' | 'resources';
  assertion: string;
  subAxis?: string | null;
  order?: number;
};

const VERSION = '1.3.0';

const P1_QUESTIONS_B1_V1_3: P1Question[] = [
  {
    id: 'p1_b1_q01',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'securite_psy',
    assertion:
      'Dans ma structure, je peux signaler qu’un fonctionnement pose problème sans craindre de “représailles”.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 1,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q02',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'non_dits',
    assertion:
      'Les tensions finissent souvent “sous le tapis” plutôt que d’être mises à plat et travaillées.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'neutral',
    order: 2,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q03',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'conflits',
    assertion: 'Quand il y a un conflit, il existe un cadre clair pour en parler et chercher des solutions.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'neutral',
    order: 3,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q04',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'charge_fatigue',
    assertion:
      'La fatigue, la surcharge ou le fait d’être “au bout” sont devenus normaux et rarement questionnés.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 2,
    critical: true,
    uiHint: 'sensitive',
    order: 4,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q05',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'sens_alignement',
    assertion: 'Je vois en quoi mon travail, même le plus “ingrat”, sert le projet global de la structure.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'neutral',
    order: 5,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q06',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'justice',
    assertion:
      'Dans ma structure, certaines personnes semblent “intouchables”, même lorsque leur comportement pose problème.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 6,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q07',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'reconnaissance',
    assertion: 'Le travail utile est reconnu, même quand il est discret ou peu visible.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'neutral',
    order: 7,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q08',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'isolement',
    assertion: 'Il m’arrive de me sentir assez seul·le face aux problèmes que je vois dans la structure.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'sensitive',
    order: 8,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q09',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'previsibilite_quotidien',
    assertion:
      'Au quotidien, je sais à peu près à quoi m’attendre : il y a des imprévus, mais pas que des surprises de dernière minute.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 1,
    critical: false,
    uiHint: 'neutral',
    order: 9,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q10',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'injustice_decisions',
    assertion: 'Certaines décisions créent un sentiment d’injustice ou de favoritisme qui dure dans le temps.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 10,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q11',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'droit_au_stop',
    assertion:
      'Dire que je suis à bout ou que j’ai besoin de lever le pied est entendu comme un signal sérieux, pas comme une faiblesse.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 2,
    critical: true,
    uiHint: 'sensitive',
    order: 11,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b1_q12',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B1',
    axis: 'climat',
    subAxis: 'ambiance_globale',
    assertion: 'Globalement, l’ambiance de travail est lourde ou tendue.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'neutral',
    order: 12,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  }
];

const P1_QUESTIONS_B3_V1_3: P1Question[] = [
  {
    id: 'p1_b3_q01',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'roles_decisionnels',
    assertion: 'Globalement, je sais qui décide de quoi dans la structure.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'neutral',
    order: 1,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q02',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'coulisses',
    assertion:
      'Beaucoup de décisions importantes semblent prises “en coulisses”, sans explication claire pour le reste de la structure.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 2,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q03',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'regles_ecrites',
    assertion: 'Les règles importantes (fonctions, droits, devoirs) sont écrites quelque part et accessibles quand on en a besoin.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'neutral',
    order: 3,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q04',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'equite_regles',
    assertion: 'Dans les faits, les règles ne s’appliquent pas vraiment de la même manière à tout le monde.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 4,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q05',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'participation',
    assertion:
      'Quand une décision va avoir un impact direct sur mon travail, il y a au minimum un espace pour donner un avis ou poser des questions.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'neutral',
    order: 5,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q06',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'desaccord',
    assertion: 'Exprimer un désaccord sur une décision n’est pas automatiquement vécu comme un manque de loyauté.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 6,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q07',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'suivi_decisions',
    assertion: 'Il arrive souvent que des décisions annoncées soient ensuite oubliées ou jamais vraiment mises en œuvre.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 2,
    critical: true,
    uiHint: 'neutral',
    order: 7,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q08',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'changements_regles',
    assertion: 'Les règles ou les façons de décider changent parfois sans que ce soit expliqué clairement.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'neutral',
    order: 8,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q09',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'responsabilite',
    assertion:
      'Quand une décision produit des effets difficiles, on sait qui en porte la responsabilité politique dans la structure.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 2,
    critical: true,
    uiHint: 'sensitive',
    order: 9,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q10',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'recours',
    assertion:
      'Lorsqu’une décision paraît injuste ou incohérente, il existe un recours ou un espace identifié pour la contester.',
    assertionAlt: null,
    polarity: 'positive',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 10,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q11',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'entorses_regles',
    assertion: 'Les “petites entorses” aux règles se multiplient au point de devenir la norme.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 2,
    critical: false,
    uiHint: 'neutral',
    order: 11,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  },
  {
    id: 'p1_b3_q12',
    version: VERSION,
    journeyId: 'P1',
    blockId: 'B3',
    axis: 'regles_decisions',
    subAxis: 'opacite',
    assertion:
      'Il arrive souvent que l’on avance sans vraiment savoir qui a tranché, ni sur quelle base la décision a été prise.',
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 3,
    critical: true,
    uiHint: 'sensitive',
    order: 12,
    stepId: 'E3',
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  }
];

const PANORAMA_ITEMS: BaseQuestion[] = [
  {
    id: 'p1_panorama_q01',
    axis: 'organization',
    assertion: 'J’ai souvent l’impression de ne pas bien comprendre comment les choses sont censées fonctionner (qui fait quoi, comment, par quels circuits).'
  },
  {
    id: 'p1_panorama_q02',
    axis: 'human',
    assertion: 'Le climat humain (relations, confiance, tensions, non-dits) pèse régulièrement sur ma motivation ou mon envie de m’impliquer.'
  },
  {
    id: 'p1_panorama_q03',
    axis: 'organization',
    assertion: 'Les priorités changent souvent brutalement, sans explication claire, au point de rendre l’organisation difficile.'
  },
  {
    id: 'p1_panorama_q04',
    axis: 'organization',
    assertion: 'Nous faisons beaucoup de choses, mais il est rarement clair ce qui produit vraiment des résultats.'
  },
  {
    id: 'p1_panorama_q05',
    axis: 'governance',
    assertion: 'Sur des sujets importants, je ne sais pas clairement qui décide ni où ces décisions sont réellement prises.'
  },
  {
    id: 'p1_panorama_q06',
    axis: 'governance',
    assertion: 'Prendre une décision importante semble risqué (conflits, critiques, mise à l’écart…), et ça freine les initiatives.'
  },
  {
    id: 'p1_panorama_q07',
    axis: 'resources',
    assertion: 'Si une ou deux personnes clés s’arrêtaient, une part importante du fonctionnement serait très difficile à maintenir.'
  },
  {
    id: 'p1_panorama_q08',
    axis: 'resources',
    assertion: 'Nous sommes très dépendants de quelques outils ou services, sans plan clair pour faire sans.'
  },
  {
    id: 'p1_panorama_q09',
    axis: 'resources',
    assertion: 'Je sens que nous sommes souvent en mode “pompier” (urgence, surcharge, report des sujets de fond) sans stabiliser les choses.'
  },
  {
    id: 'p1_panorama_q10',
    axis: 'human',
    assertion: 'Je perçois un décalage important entre le projet affiché (valeurs, mission, discours) et ce que je vis au quotidien dans la structure.'
  }
];

const BLOCK_ITEMS: Record<'B1' | 'B2' | 'B3' | 'B4', BaseQuestion[]> = {
  B1: [
    { id: 'p1_b1_q01', axis: 'human', assertion: 'Je cherche encore mes repères dans cette structure.' },
    { id: 'p1_b1_q02', axis: 'organization', assertion: 'J’ai connu plusieurs façons de faire depuis que je suis là.' },
    { id: 'p1_b1_q03', axis: 'governance', assertion: 'J’ai (ou j’ai eu) un rôle de responsabilité identifié.' },
    { id: 'p1_b1_q04', axis: 'organization', assertion: 'On me sollicite souvent comme référent·e sur certains sujets.' },
    {
      id: 'p1_b1_q05',
      axis: 'human',
      assertion: 'Je me sens souvent à la périphérie : informé·e tard, peu associé·e aux décisions importantes.'
    },
    {
      id: 'p1_b1_q06',
      axis: 'human',
      assertion: 'J’ai au contraire le sentiment d’être au centre de tout, avec beaucoup de personnes qui dépendent de moi.'
    },
    { id: 'p1_b1_q07', axis: 'organization', assertion: 'Il existe un noyau central de personnes qui semblent tout savoir.' },
    {
      id: 'p1_b1_q08',
      axis: 'organization',
      assertion: 'Ancien·nes et nouvelles personnes n’ont pas la même lecture du “mode d’emploi” de la structure.'
    },
    {
      id: 'p1_b1_q09',
      axis: 'governance',
      assertion: 'Il y a un écart entre ceux qui tiennent la structure au quotidien et ceux qui apparaissent lors des décisions visibles.'
    },
    {
      id: 'p1_b1_q10',
      axis: 'organization',
      assertion: 'Je ne sais pas toujours comment les choses sont censées se passer (process, circuits, priorités).'
    },
    { id: 'p1_b1_q11', axis: 'organization', assertion: 'Je dois souvent deviner ce qu’il faut faire faute de règles claires.' },
    {
      id: 'p1_b1_q12',
      axis: 'organization',
      assertion: 'Il m’arrive de faire “comme d’habitude” et de découvrir que quelqu’un attendait autre chose.'
    },
    {
      id: 'p1_b1_q13',
      axis: 'governance',
      assertion: 'Quand je demande comment faire, je reçois des réponses différentes selon les personnes.'
    },
    {
      id: 'p1_b1_q14',
      axis: 'organization',
      assertion: 'Il existe des règles écrites qui ne correspondent pas à ce qui se passe en réalité.'
    },
    { id: 'p1_b1_q15', axis: 'governance', assertion: 'Des changements importants sont parfois introduits sans explication claire.' },
    {
      id: 'p1_b1_q16',
      axis: 'human',
      assertion: 'Je me sens à l’aise pour exprimer un désaccord sans craindre de représailles.'
    },
    { id: 'p1_b1_q17', axis: 'human', assertion: 'Je me censure parfois par crainte de la réaction de certaines personnes.' },
    {
      id: 'p1_b1_q18',
      axis: 'human',
      assertion: 'J’ai déjà eu le sentiment que ce que je disais pouvait être utilisé contre moi plus tard.'
    },
    { id: 'p1_b1_q19', axis: 'human', assertion: 'Il existe des sujets tabous dont on parle rarement en collectif.' },
    {
      id: 'p1_b1_q20',
      axis: 'organization',
      assertion: 'Les tensions sont souvent évitées plutôt que traitées de manière structurée.'
    },
    { id: 'p1_b1_q21', axis: 'human', assertion: 'Il existe des clans ou sous-groupes qui influencent fortement le climat.' },
    { id: 'p1_b1_q22', axis: 'human', assertion: 'Je comprends pourquoi la structure existe et ce qu’elle cherche à faire.' },
    { id: 'p1_b1_q23', axis: 'human', assertion: 'Je vois clairement comment mon rôle contribue au projet global.' },
    { id: 'p1_b1_q24', axis: 'human', assertion: 'Je me demande parfois si je suis vraiment à ma place ici.' },
    { id: 'p1_b1_q25', axis: 'human', assertion: 'Il m’arrive de sentir un décalage entre mes valeurs et certaines décisions.' },
    { id: 'p1_b1_q26', axis: 'governance', assertion: 'Les décisions importantes semblent alignées (ou non) avec le projet annoncé.' },
    { id: 'p1_b1_q27', axis: 'resources', assertion: 'Je ressens souvent de la fatigue rien qu’en pensant aux sujets à traiter ici.' },
    { id: 'p1_b1_q28', axis: 'resources', assertion: 'Je suis surtout en réaction, avec peu de temps pour réfléchir à froid.' },
    { id: 'p1_b1_q29', axis: 'resources', assertion: 'La structure repose beaucoup sur un petit nombre de personnes très sollicitées.' },
    {
      id: 'p1_b1_q30',
      axis: 'organization',
      assertion: 'Les urgences et imprévus remplacent souvent la planification, y compris sur des sujets importants.'
    }
  ],
  B2: [
    {
      id: 'p1_b2_q01',
      axis: 'organization',
      assertion: 'Je dois régulièrement changer de priorité en urgence parce qu’une nouvelle demande arrive “par au-dessus”.'
    },
    {
      id: 'p1_b2_q02',
      axis: 'resources',
      assertion: 'J’abandonne parfois une tâche importante parce qu’autre chose devient soudain prioritaire.'
    },
    {
      id: 'p1_b2_q03',
      axis: 'organization',
      assertion: 'Ce qu’on me demande aujourd’hui contredit parfois ce qui était demandé la semaine dernière.'
    },
    {
      id: 'p1_b2_q04',
      axis: 'governance',
      assertion: 'Je ne suis pas toujours sûr·e de ce qui est vraiment prioritaire.'
    },
    { id: 'p1_b2_q05', axis: 'governance', assertion: 'Les priorités affichées changent souvent sans explication claire.' },
    {
      id: 'p1_b2_q06',
      axis: 'governance',
      assertion: 'Différentes personnes portent des priorités concurrentes sans arbitrage explicite.'
    },
    {
      id: 'p1_b2_q07',
      axis: 'organization',
      assertion: 'Je découvre parfois des changements importants au moment où ils s’appliquent déjà.'
    },
    {
      id: 'p1_b2_q08',
      axis: 'human',
      assertion: 'Je me sens souvent en position de subir des changements décidés ailleurs.'
    },
    {
      id: 'p1_b2_q09',
      axis: 'organization',
      assertion: 'On me demande d’appliquer immédiatement des changements sans temps pour les comprendre.'
    },
    {
      id: 'p1_b2_q10',
      axis: 'organization',
      assertion: 'Il n’y a pas toujours de personne ou d’espace identifié pour remonter un problème lié à un changement.'
    },
    {
      id: 'p1_b2_q11',
      axis: 'organization',
      assertion: 'La structure met en place des changements sans phase de test ni période d’essai.'
    },
    {
      id: 'p1_b2_q12',
      axis: 'organization',
      assertion: 'Des décisions et règles s’empilent sans nettoyer ce qui est devenu obsolète.'
    },
    {
      id: 'p1_b2_q13',
      axis: 'organization',
      assertion: 'Quand je décide ou j’agis, je ne sais pas toujours quels effets cela produira ailleurs.'
    },
    { id: 'p1_b2_q14', axis: 'organization', assertion: 'Je constate des conséquences inattendues sans comprendre leur origine.' },
    {
      id: 'p1_b2_q15',
      axis: 'organization',
      assertion: 'Je reviens rarement sur ce que j’ai fait pour analyser ce qui a fonctionné ou non.'
    },
    {
      id: 'p1_b2_q16',
      axis: 'organization',
      assertion: 'Je ne sais pas clairement quels signaux observer pour savoir si ce que je fais va dans le bon sens.'
    },
    {
      id: 'p1_b2_q17',
      axis: 'governance',
      assertion: 'Il est rare que la structure vérifie si une décision a produit les effets souhaités.'
    },
    {
      id: 'p1_b2_q18',
      axis: 'organization',
      assertion: 'Je participe à des projets où les objectifs ne sont pas toujours clairs dès le départ.'
    },
    {
      id: 'p1_b2_q19',
      axis: 'organization',
      assertion: 'Il m’arrive de travailler longtemps sans savoir comment cela s’inscrit dans un plan plus large.'
    },
    { id: 'p1_b2_q20', axis: 'governance', assertion: 'Je ne sais pas toujours quand un projet est vraiment terminé.' },
    {
      id: 'p1_b2_q21',
      axis: 'organization',
      assertion: 'Quand un projet s’arrête ou échoue, j’ai rarement accès à une analyse claire de ce qui s’est passé.'
    },
    {
      id: 'p1_b2_q22',
      axis: 'organization',
      assertion: 'La structure lance des projets sans définir précisément ce que l’on veut en apprendre.'
    },
    { id: 'p1_b2_q23', axis: 'resources', assertion: 'Nous manquons de temps ou de discipline pour faire des bilans après les projets.' },
    {
      id: 'p1_b2_q24',
      axis: 'resources',
      assertion: 'Je suis régulièrement surpris·e par des urgences qui bousculent mon organisation.'
    },
    {
      id: 'p1_b2_q25',
      axis: 'organization',
      assertion: 'Je découvre parfois trop tard des informations importantes pour préparer une situation.'
    },
    { id: 'p1_b2_q26', axis: 'resources', assertion: 'J’ai parfois l’impression d’être en gestion de crise permanente.' },
    { id: 'p1_b2_q27', axis: 'organization', assertion: 'La structure est souvent en réaction plutôt qu’en anticipation.' },
    { id: 'p1_b2_q28', axis: 'resources', assertion: 'Concilier court terme et long terme est difficile dans mon rôle.' },
    { id: 'p1_b2_q29', axis: 'resources', assertion: 'Tout semble urgent, ce qui rend la priorisation difficile.' },
    {
      id: 'p1_b2_q30',
      axis: 'organization',
      assertion: 'Je dépends d’autres personnes ou équipes pour avancer, sans toujours avoir de visibilité sur leurs délais.'
    }
  ],
  B3: [
    { id: 'p1_b3_q01', axis: 'governance', assertion: 'Il m’arrive de ne pas savoir qui est censé décider sur un sujet donné.' },
    {
      id: 'p1_b3_q02',
      axis: 'governance',
      assertion: 'Je demande parfois validation à plusieurs personnes faute de savoir qui a le dernier mot.'
    },
    { id: 'p1_b3_q03', axis: 'human', assertion: 'J’ai déjà renoncé à lancer un sujet faute de canal décisionnel clair.' },
    {
      id: 'p1_b3_q04',
      axis: 'human',
      assertion: 'Je ne sais pas toujours si je suis légitime pour décider ou si je dois demander la permission.'
    },
    { id: 'p1_b3_q05', axis: 'governance', assertion: 'Il existe des zones grises où personne ne sait vraiment qui doit trancher.' },
    { id: 'p1_b3_q06', axis: 'governance', assertion: 'Des personnes sans rôle formel influencent parfois fortement les décisions.' },
    { id: 'p1_b3_q07', axis: 'organization', assertion: 'Je ne sais pas toujours où et quand les décisions importantes sont prises.' },
    {
      id: 'p1_b3_q08',
      axis: 'human',
      assertion: 'J’apprends parfois après coup qu’une décision a été prise sur un sujet qui me concerne.'
    },
    {
      id: 'p1_b3_q09',
      axis: 'governance',
      assertion: 'Certaines décisions se prennent de manière informelle puis sont entérinées après coup.'
    },
    {
      id: 'p1_b3_q10',
      axis: 'organization',
      assertion: 'Je ne sais pas où trouver l’information pour suivre l’avancement d’une décision.'
    },
    { id: 'p1_b3_q11', axis: 'organization', assertion: 'Il n’existe pas vraiment de processus standard pour les décisions importantes.' },
    {
      id: 'p1_b3_q12',
      axis: 'governance',
      assertion: 'Quand une décision se révèle mauvaise, je ne sais pas toujours qui en portait la responsabilité.'
    },
    {
      id: 'p1_b3_q13',
      axis: 'human',
      assertion: 'Je me sens parfois responsable de conséquences sans avoir vraiment participé à la décision.'
    },
    {
      id: 'p1_b3_q14',
      axis: 'governance',
      assertion: 'J’ai l’impression que certaines décisions ne sont assumées par personne quand elles posent problème.'
    },
    {
      id: 'p1_b3_q15',
      axis: 'governance',
      assertion: 'Quand je décide dans mon périmètre, je ne sais pas toujours jusqu’où va ma responsabilité.'
    },
    { id: 'p1_b3_q16', axis: 'governance', assertion: 'La responsabilité est souvent diluée : en cas de problème, c’est “la faute du système”.' },
    {
      id: 'p1_b3_q17',
      axis: 'human',
      assertion: 'J’ai déjà eu le sentiment que mon avis n’était pas pris en compte alors que j’étais concerné·e.'
    },
    {
      id: 'p1_b3_q18',
      axis: 'human',
      assertion: 'Il m’arrive de ne pas intervenir en me disant que “de toute façon, ça ne changera rien”.'
    },
    { id: 'p1_b3_q19', axis: 'human', assertion: 'Je suis parfois invité·e pour la forme sans pouvoir vraiment peser sur la décision.' },
    { id: 'p1_b3_q20', axis: 'organization', assertion: 'Je ne sais pas toujours dans quels espaces je suis censé·e donner mon avis.' },
    {
      id: 'p1_b3_q21',
      axis: 'governance',
      assertion: 'Certaines décisions sont prises par très peu de personnes alors qu’elles ont un impact large.'
    },
    {
      id: 'p1_b3_q22',
      axis: 'governance',
      assertion: 'Il existe des personnes ou groupes dont on ne cherche presque jamais l’avis, même en première ligne.'
    },
    { id: 'p1_b3_q23', axis: 'human', assertion: 'Il m’arrive de ne pas savoir où exprimer un désaccord avec une décision.' },
    { id: 'p1_b3_q24', axis: 'human', assertion: 'Contester une décision peut sembler risqué pour ma place dans la structure.' },
    {
      id: 'p1_b3_q25',
      axis: 'human',
      assertion: 'J’ai déjà laissé passer une décision injuste faute d’espace sûr pour en parler.'
    },
    {
      id: 'p1_b3_q26',
      axis: 'organization',
      assertion: 'Le désaccord est souvent perçu comme un problème plutôt qu’un signal utile.'
    },
    {
      id: 'p1_b3_q27',
      axis: 'organization',
      assertion: 'Il est rare que la structure revienne sur une décision pour vérifier sa mise en œuvre concrète.'
    },
    { id: 'p1_b3_q28', axis: 'organization', assertion: 'Des décisions annoncées avec force ne sont parfois jamais vraiment appliquées.' },
    {
      id: 'p1_b3_q29',
      axis: 'governance',
      assertion: 'Plusieurs décisions contradictoires peuvent coexister sans clarification officielle.'
    },
    {
      id: 'p1_b3_q30',
      axis: 'organization',
      assertion: 'L’écart entre ce qui est décidé en réunion et ce qui se passe sur le terrain est souvent important.'
    }
  ],
  B4: [
    {
      id: 'p1_b4_q01',
      axis: 'resources',
      assertion: 'Si je m’arrête, une partie significative de ce que je porte serait difficile à reprendre.'
    },
    { id: 'p1_b4_q02', axis: 'human', assertion: 'On me sollicite très souvent parce que “toi, tu sais”.' },
    {
      id: 'p1_b4_q03',
      axis: 'organization',
      assertion: 'Je garde parfois des infos ou des accès “dans ma tête” faute de temps pour les transmettre.'
    },
    {
      id: 'p1_b4_q04',
      axis: 'resources',
      assertion: 'Je ressens une pression à tenir coûte que coûte parce que personne n’est vraiment prêt à reprendre.'
    },
    {
      id: 'p1_b4_q05',
      axis: 'resources',
      assertion: 'Il existe quelques personnes dont tout le monde dit : “Si iel part, on est morts.”'
    },
    {
      id: 'p1_b4_q06',
      axis: 'organization',
      assertion: 'Certains rôles n’ont aucun remplaçant identifié en cas d’absence.'
    },
    {
      id: 'p1_b4_q07',
      axis: 'resources',
      assertion: 'Je ne saurais pas quoi faire si l’outil principal que j’utilise devenait indisponible.'
    },
    {
      id: 'p1_b4_q08',
      axis: 'organization',
      assertion: 'Je ne sais pas exactement où sont stockées les données importantes sur lesquelles je travaille.'
    },
    {
      id: 'p1_b4_q09',
      axis: 'resources',
      assertion: 'Je dépends fortement de certains outils ou services externes sans plan alternatif clair.'
    },
    {
      id: 'p1_b4_q10',
      axis: 'organization',
      assertion: 'Les accès que j’utilise aujourd’hui ne sont pas facilement transférables à d’autres.'
    },
    {
      id: 'p1_b4_q11',
      axis: 'resources',
      assertion: 'Le fonctionnement repose sur un ou deux outils centraux sans vraie solution de repli.'
    },
    {
      id: 'p1_b4_q12',
      axis: 'governance',
      assertion: 'La structure ne maîtrise pas complètement qui a les droits d’administrateur sur quels outils.'
    },
    { id: 'p1_b4_q13', axis: 'organization', assertion: 'Une partie importante de ce que je fais n’est écrit nulle part.' },
    { id: 'p1_b4_q14', axis: 'resources', assertion: 'Je reporte souvent la rédaction de modes d’emploi faute de temps.' },
    { id: 'p1_b4_q15', axis: 'organization', assertion: 'Quand je reviens sur une tâche, je dois souvent tout redeviner.' },
    {
      id: 'p1_b4_q16',
      axis: 'organization',
      assertion: 'Les façons de faire importantes sont peu documentées ou de manière dispersée.'
    },
    {
      id: 'p1_b4_q17',
      axis: 'organization',
      assertion: 'Quand quelqu’un part, il n’y a pas toujours de temps formalisé pour transmettre ce qu’iel sait.'
    },
    {
      id: 'p1_b4_q18',
      axis: 'organization',
      assertion: 'Je ne comprends pas toujours l’organigramme réel ni à qui m’adresser pour un sujet précis.'
    },
    {
      id: 'p1_b4_q19',
      axis: 'organization',
      assertion: 'La structure est devenue complexe au point que peu de personnes ont une vue globale.'
    },
    { id: 'p1_b4_q20', axis: 'organization', assertion: 'Je me perds facilement dans les instances, groupes ou cercles qui existent.' },
    {
      id: 'p1_b4_q21',
      axis: 'organization',
      assertion: 'Beaucoup de personnes ont plusieurs casquettes sans que ce soit clairement explicité.'
    },
    {
      id: 'p1_b4_q22',
      axis: 'resources',
      assertion: 'Je sens que j’ai très peu de marge pour ralentir, dire non ou revoir ma charge.'
    },
    {
      id: 'p1_b4_q23',
      axis: 'human',
      assertion: 'Je fais parfois des choix juste pour “tenir”, en sachant que ce n’est pas optimal à long terme.'
    },
    {
      id: 'p1_b4_q24',
      axis: 'resources',
      assertion: 'La structure fonctionne souvent à flux tendu avec très peu de réserves.'
    },
    { id: 'p1_b4_q25', axis: 'governance', assertion: 'Il existe peu de plans B explicites en cas de pépin sérieux.' },
    { id: 'p1_b4_q26', axis: 'organization', assertion: 'On ouvre de nouveaux chantiers sans fermer ou alléger les anciens.' },
    {
      id: 'p1_b4_q27',
      axis: 'resources',
      assertion: 'La structure dépend fortement de quelques financeurs, partenaires ou contrats clés.'
    },
    {
      id: 'p1_b4_q28',
      axis: 'resources',
      assertion: 'L’arrêt d’un acteur externe important pourrait mettre en danger une partie majeure de l’activité.'
    },
    {
      id: 'p1_b4_q29',
      axis: 'governance',
      assertion: 'Les risques connus (réglementaires, réputation, climat…) sont peu travaillés en scénarios.'
    },
    {
      id: 'p1_b4_q30',
      axis: 'human',
      assertion: 'Il m’est déjà arrivé de donner un accès ou une info sensible “pour aller plus vite”.'
    }
  ]
};

const withDefaults = (items: BaseQuestion[], blockId: P1Question['blockId'], stepId: P1Question['stepId']) =>
  items.map<P1Question>((item, index) => ({
    id: item.id,
    version: VERSION,
    journeyId: 'P1',
    blockId,
    axis: item.axis,
    subAxis: item.subAxis ?? null,
    assertion: item.assertion,
    assertionAlt: null,
    polarity: 'negative',
    scale: 'likert_1_5',
    weight: 1,
    critical: false,
    uiHint: 'slider',
    order: item.order ?? index + 1,
    stepId,
    patternSignals: undefined,
    tags: undefined,
    notesProduct: undefined,
    notesSafety: undefined
  }));

export const P1_QUESTIONS_V1_3: P1Question[] = [
  ...withDefaults(PANORAMA_ITEMS, 'GLOBAL', 'E1'),
  ...P1_QUESTIONS_B1_V1_3,
  ...withDefaults(BLOCK_ITEMS.B2, 'B2', 'E3'),
  ...P1_QUESTIONS_B3_V1_3,
  ...withDefaults(BLOCK_ITEMS.B4, 'B4', 'E3')
];
