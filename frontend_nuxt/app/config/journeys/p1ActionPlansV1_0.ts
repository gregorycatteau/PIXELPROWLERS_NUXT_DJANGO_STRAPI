// P1 – Plans d’action V1.0.
// Dérivés des bands de tension B1/B3 (front-only).
// Ne contiennent aucune donnée personnelle ni réponse utilisateur.

import type { P1ActionItem } from '@/types/journeys/p1';

// B1 – HIGH
export const P1_ACTIONS_B1_HIGH: P1ActionItem[] = [
  {
    id: 'p1_b1_high_now_01',
    blockId: 'B1',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Nommer pour toi les situations qui pèsent le plus',
    description:
      'Prends 10–15 minutes pour noter, pour toi uniquement, 2 ou 3 situations récentes où le climat t’a particulièrement pesé (non-dits, injustices, peur de parler...). L’objectif n’est pas de “faire un dossier”, mais de clarifier ce qui te touche réellement, sans t’auto-juger.',
    safetyNote:
      'Garde ces notes dans un espace que tu considères vraiment privé (carnet, document chiffré, etc.).'
  },
  {
    id: 'p1_b1_high_now_02',
    blockId: 'B1',
    horizon: 'now',
    mode: 'duo_confiance',
    effort: 2,
    label: 'Identifier une personne ressource de confiance',
    description:
      'Repère dans ton environnement une personne avec qui tu te sens suffisamment en sécurité pour parler du climat (pas forcément un “officiel” : ça peut être un pair, un ancien, un allié discret). L’objectif est simplement de valider que tu n’es pas seul·e à percevoir certaines choses.',
    safetyNote:
      'Choisis quelqu’un qui a déjà montré qu’il savait garder une parole confidentielle et ne pas s’en servir contre les autres.'
  },
  {
    id: 'p1_b1_high_soon_01',
    blockId: 'B1',
    horizon: 'soon',
    mode: 'petit_groupe',
    effort: 2,
    label: 'Repérer un espace de parole possible, même minimal',
    description:
      'Regarde s’il existe déjà un temps ou un espace où le climat peut être abordé sans que ce soit vécu comme une attaque (réunion de suivi, temps informel, cercle spécifique). L’idée n’est pas de tout déballer d’un coup, mais de voir où une première discussion “sur le fonctionnement” est réaliste.',
    safetyNote:
      'Évite de lancer le sujet dans un espace déjà sous tension extrême ou où les personnes les plus problématiques contrôlent tout.'
  },
  {
    id: 'p1_b1_high_soon_02',
    blockId: 'B1',
    horizon: 'soon',
    mode: 'solo_reflexion',
    effort: 2,
    label: 'Formuler une ou deux questions structurantes',
    description:
      'À partir de ce que tu as noté, transforme 1 ou 2 constats en questions sur le fonctionnement (“comment fait-on pour que les désaccords soient traités ailleurs que dans les couloirs ?”, “de quoi aurait-on besoin pour que la fatigue soit entendue ?”). Ces questions pourront servir de point d’entrée plus neutre dans une future discussion.'
  },
  {
    id: 'p1_b1_high_later_01',
    blockId: 'B1',
    horizon: 'later',
    mode: 'instance_formelle',
    effort: 3,
    label: 'Proposer un temps dédié au climat, cadré et limité',
    description:
      'Si tu le juges possible et que tu n’es pas seul·e, tu peux envisager, plus tard, de proposer un temps spécifique pour parler du climat de travail (par exemple : 30 minutes en début ou fin de réunion, avec un cadre clair : pas de règlements de comptes, focus sur “comment on fonctionne”).',
    safetyNote:
      'Ne fais ce pas que si tu estimes que le contexte le permet et que tu as au moins un allié identifié. Il est légitime de décider que ce n’est pas le bon moment.'
  }
];

// B1 – VERY_HIGH
export const P1_ACTIONS_B1_VERY_HIGH: P1ActionItem[] = [
  {
    id: 'p1_b1_vhigh_now_01',
    blockId: 'B1',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Préciser ce qui est dangereux pour toi',
    description:
      'Note pour toi ce qui te fait dire que parler est dangereux (perte de poste, réputation, isolement, pression...). L’idée est de distinguer ce qui relève d’un ressenti diffus et ce qui correspond à des signaux concrets, pour ajuster ta vigilance.',
    safetyNote:
      'Ne partage ces éléments qu’avec des personnes dont tu es sûr·e qu’elles ne les utiliseront pas contre toi.'
  },
  {
    id: 'p1_b1_vhigh_now_02',
    blockId: 'B1',
    horizon: 'now',
    mode: 'duo_confiance',
    effort: 2,
    label: 'Vérifier que tu n’es pas seul·e à percevoir le risque',
    description:
      'Si tu peux le faire en sécurité, partage une partie de ton ressenti avec une personne de confiance pour vérifier si d’autres perçoivent aussi cette dangerosité. Cela peut t’aider à ne pas te croire “fou/folle” dans un système qui banalise certaines violences.'
  },
  {
    id: 'p1_b1_vhigh_soon_01',
    blockId: 'B1',
    horizon: 'soon',
    mode: 'solo_reflexion',
    effort: 2,
    label: 'Identifier tes marges de retrait possibles',
    description:
      'Réfléchis à ce que tu peux, concrètement, mettre à distance sans te mettre en difficulté immédiate : quels espaces éviter, quelles informations ne pas livrer, quelles limites poser (même silencieusement) pour te protéger un minimum.',
    safetyNote:
      'Il ne s’agit pas de tout abandonner, mais de retrouver un minimum de maîtrise sur ce qui t’expose.'
  },
  {
    id: 'p1_b1_vhigh_later_01',
    blockId: 'B1',
    horizon: 'later',
    mode: 'duo_confiance',
    effort: 3,
    label: 'Explorer des appuis externes si nécessaire',
    description:
      'Si le climat reste dangereux et que tu le peux, envisage d’identifier des appuis extérieurs (réseau métier, syndicat, accompagnement juridique ou psychologique, etc.). L’objectif est de ne pas rester enfermé·e seul·e dans une situation qui dépasse ce que la structure actuelle est capable d’affronter.',
    safetyNote:
      'Ce type de démarche se fait à ton rythme, et seulement si tu le juges pertinent. Ne te mets pas en danger pour “sauver” la structure.'
  }
];

// B1 – MEDIUM
export const P1_ACTIONS_B1_MEDIUM: P1ActionItem[] = [
  {
    id: 'p1_b1_medium_now_01',
    blockId: 'B1',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Distinguer ce qui te porte et ce qui te pèse',
    description:
      'Prends quelques minutes pour noter, pour toi, 3 éléments qui rendent le climat supportable ou agréable, et 3 éléments qui viennent régulièrement le plomber. L’objectif est de faire ressortir les appuis autant que les irritants.'
  },
  {
    id: 'p1_b1_medium_now_02',
    blockId: 'B1',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Observer où les tensions apparaissent le plus souvent',
    description:
      'Repère dans quel type de contexte les tensions reviennent le plus (réunions, couloirs, mails, moments d’urgence...). Cela t’aidera à voir si le problème vient surtout des situations, des rythmes ou de certaines habitudes.'
  },
  {
    id: 'p1_b1_medium_soon_01',
    blockId: 'B1',
    horizon: 'soon',
    mode: 'duo_confiance',
    effort: 2,
    label: 'Vérifier à deux si vos ressentis se recoupent',
    description:
      'Choisis une personne de confiance et comparez vos ressentis sur le climat : ce qui va bien, ce qui accroche. L’idée n’est pas de chercher des coupables, mais de voir si certains signaux sont partagés.',
    safetyNote:
      'Restez centrés sur le fonctionnement (“comment on fait les choses”) plutôt que sur les personnes.'
  },
  {
    id: 'p1_b1_medium_soon_02',
    blockId: 'B1',
    horizon: 'soon',
    mode: 'petit_groupe',
    effort: 2,
    label: 'Expérimenter un mini-rituel positif sur le climat',
    description:
      'Si tu le sens possible, propose dans un petit groupe opérationnel un rituel léger : par exemple un tour de table “une chose qui nous aide à travailler ensemble / une chose à ajuster” en début ou fin de réunion.',
    safetyNote:
      'Ne force pas ce rituel dans un espace déjà très tendu ou très hiérarchisé.'
  },
  {
    id: 'p1_b1_medium_later_01',
    blockId: 'B1',
    horizon: 'later',
    mode: 'instance_formelle',
    effort: 3,
    label: 'Faire exister le sujet du climat dans un espace officiel',
    description:
      'À moyen terme, tu peux envisager de suggérer que le climat et les conditions de travail soient un point récurrent dans une instance formelle (CA, cercle, comité). Le but n’est pas de dramatiser, mais de reconnaître que cela fait partie du fonctionnement de la structure.',
    safetyNote:
      'Prépare cette proposition avec au moins une autre personne, et garde la possibilité de la conserver “en réserve” si le moment ne te semble pas adapté.'
  }
];

// B3 – HIGH
export const P1_ACTIONS_B3_HIGH: P1ActionItem[] = [
  {
    id: 'p1_b3_high_now_01',
    blockId: 'B3',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Cartographier pour toi quelques décisions clés récentes',
    description:
      'Note 3 à 5 décisions importantes prises récemment (ou annoncées) et ce que tu en sais : qui a décidé, comment ça a été annoncé, ce qui a été appliqué ou non. L’objectif est d’y voir plus clair sur le “film” réel des décisions.'
  },
  {
    id: 'p1_b3_high_now_02',
    blockId: 'B3',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Repérer les endroits où les règles existent déjà',
    description:
      'Liste les espaces où des règles sont déjà écrites (statuts, règlement intérieur, charte, procédures...). Cela te donne une base sur laquelle t’appuyer, même si tout n’est pas respecté.'
  },
  {
    id: 'p1_b3_high_soon_01',
    blockId: 'B3',
    horizon: 'soon',
    mode: 'duo_confiance',
    effort: 2,
    label: 'Tester une question simple sur le fonctionnement des décisions',
    description:
      'Avec une personne de confiance, prépare une ou deux questions “fonctionnement” que vous pourriez poser dans un espace adapté (réunion, instance) : par exemple “comment fait-on pour suivre les décisions dans le temps ?”, ou “où est-ce qu’on écrit ce qui est décidé ?”.',
    safetyNote:
      'Formuler la question sur le système (“comment on fait”) plutôt que sur une personne (“pourquoi X ne fait jamais…”).'
  },
  {
    id: 'p1_b3_high_soon_02',
    blockId: 'B3',
    horizon: 'soon',
    mode: 'petit_groupe',
    effort: 2,
    label: 'Proposer un mini-rituel de suivi des décisions',
    description:
      'Si le contexte le permet, suggère l’idée d’un point systématique en début de réunion : 10 minutes pour relire les décisions prises la dernière fois et vérifier ce qui a avancé. C’est une manière simple de rendre le cadre plus lisible sans tout révolutionner.'
  },
  {
    id: 'p1_b3_high_later_01',
    blockId: 'B3',
    horizon: 'later',
    mode: 'instance_formelle',
    effort: 3,
    label: 'Demander une clarification officielle sur un point clé',
    description:
      'À moyen terme, tu peux envisager de demander une clarification plus formelle sur un point où les règles sont floues ou appliquées de manière inégale (par exemple via une question écrite à un conseil, une AG, ou un espace de gouvernance existant).',
    safetyNote:
      'Prépare cette demande avec au moins une autre personne si possible, et garde la possibilité de renoncer si le rapport de forces ne le permet pas.'
  }
];

// B3 – VERY_HIGH
export const P1_ACTIONS_B3_VERY_HIGH: P1ActionItem[] = [
  {
    id: 'p1_b3_vhigh_now_01',
    blockId: 'B3',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Clarifier pour toi où le cadre te semble arbitraire',
    description:
      'Note, pour toi seul·e, quelques exemples concrets où tu as eu le sentiment que les règles ou décisions étaient utilisées de manière arbitraire (règle appliquée à certains et pas à d’autres, décision annoncée sans base claire, recours impossibles...). L’objectif est de te donner un repère sur ce qui déclenche ce sentiment, sans rien publier.',
    safetyNote:
      'Garde ces éléments dans un espace vraiment privé et protégé (carnet, support chiffré, pas sur un outil partagé).'
  },
  {
    id: 'p1_b3_vhigh_now_02',
    blockId: 'B3',
    horizon: 'now',
    mode: 'solo_reflexion',
    effort: 1,
    label: 'Identifier les décisions qui t’impactent le plus directement',
    description:
      'Parmi les situations que tu as notées, repère celles qui ont le plus de conséquences pour toi (charge, sécurité de l’emploi, réputation, capacité à travailler correctement). Cela t’aidera à prioriser ce qui mérite vraiment de l’attention.'
  },
  {
    id: 'p1_b3_vhigh_now_03',
    blockId: 'B3',
    horizon: 'now',
    mode: 'duo_confiance',
    effort: 2,
    label: 'Tester ton ressenti auprès d’une personne sûre',
    description:
      'Si tu le juges possible, partage une partie de ton ressenti avec une personne de confiance (en interne ou en dehors) pour vérifier si ce que tu perçois comme arbitraire est aussi visible pour d’autres. L’objectif est de ne pas rester seul·e avec ce doute.',
    safetyNote:
      'Choisis quelqu’un qui ne dépend pas directement des personnes ou instances que tu juges problématiques.'
  },
  {
    id: 'p1_b3_vhigh_soon_01',
    blockId: 'B3',
    horizon: 'soon',
    mode: 'solo_reflexion',
    effort: 2,
    label: 'Repérer tes marges de manœuvre et tes lignes rouges',
    description:
      'Réfléchis à ce que tu peux accepter ou non dans ce cadre : quelles règles tu peux contourner ou compenser sans te mettre trop en danger, et quelles situations constituent pour toi des lignes rouges (non négociables). Mieux connaître tes propres limites aide à décider quand et comment agir.',
    safetyNote:
      'Ce travail est d’abord pour toi : il n’implique pas forcément d’actions visibles immédiatement.'
  },
  {
    id: 'p1_b3_vhigh_soon_02',
    blockId: 'B3',
    horizon: 'soon',
    mode: 'duo_confiance',
    effort: 2,
    label: 'Explorer des appuis extérieurs potentiels',
    description:
      'Selon le contexte, il peut être utile d’identifier des appuis extérieurs possibles (structure d’accompagnement, réseau pro, syndicat, conseil juridique, médiation…). L’objectif n’est pas de passer à l’action tout de suite, mais de savoir quelles ressources existent si tu en avais besoin.',
    safetyNote:
      'Tu peux collecter des informations sans rien engager officiellement tant que tu n’es pas prêt·e.'
  },
  {
    id: 'p1_b3_vhigh_later_01',
    blockId: 'B3',
    horizon: 'later',
    mode: 'instance_formelle',
    effort: 3,
    label: 'Décider si tu souhaites porter quelque chose dans une instance',
    description:
      'À terme, si tu estimes que c’est envisageable et suffisamment sécurisé pour toi, tu pourras décider si tu souhaites porter une demande de clarification ou de révision de certaines règles dans une instance formelle (AG, conseil, cercle...). Ce n’est pas une obligation : c’est une option parmi d’autres.',
    safetyNote:
      'Cette étape n’a de sens que si tu as des appuis, un minimum de préparation et la conviction que les risques pour toi sont acceptables. Renoncer à cette option peut être un choix pleinement légitime.'
  }
];
