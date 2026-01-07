export const RESOURCE_REGISTRY_V0 = [
  {
    id: 'res_v0_016',
    slug: 'reunion-30min-sans-noyade',
    title: 'Reunion 30 min sans noyade',
    summary: "Un format court pour decider sans s'epuiser : ordre du jour minimal, tours de parole cadres, decisions tracees, sorties claires.",
    outcome: 'Une reunion tenue en 30 min avec 1 a 3 decisions claires et des actions attribuees.',
    category: 'gouvernance',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1', 'p2'],
    relatedResourceSlugs: [
      'decision-log-minimal',
      'compte-rendu-utile-1page',
      'matrice-responsabilites-raci-lite',
    ],
    contentBlocks: [
      {
        title: 'Le piege classique',
        kind: 'guide',
        bullets: [
          'Quand tout le monde parle de tout, personne ne decide.',
          'Une reunion utile produit des decisions, pas un debat infini.',
          '30 min obligent a prioriser, clarifier, trancher.'
        ]
      },
      {
        title: 'Script minute par minute',
        kind: 'action',
        bullets: [
          '00:00-03:00 : objectif unique de la reunion (en une phrase).',
          "03:00-08:00 : tour meteo en 1 mot chacun, pas d'explication.",
          '08:00-10:00 : liste des sujets, vote rapide, garder les 2 premiers.',
          '10:00-25:00 : sujet 1 puis 2, meme regle : definir la decision attendue.',
          'A chaque sujet : 2 options max, puis choix, puis action + responsable + date.',
          '25:00-28:00 : lire a voix haute decisions + actions (validation collective).',
          "28:00-30:00 : point blocage et prochaine etape, fin a l'heure quoi qu'il arrive."
        ]
      }
    ]
  },
  {
    id: 'res_v0_017',
    slug: 'rituel-hebdo-15min',
    title: 'Rituel hebdo 15 min',
    summary: 'Un rituel court pour eviter le mode pompier : 3 questions, 3 signaux, 1 ajustement concret par semaine.',
    outcome: 'Un pilotage hebdomadaire simple qui reduit les urgences et clarifie les priorites.',
    category: 'gouvernance',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1', 'p2'],
    relatedResourceSlugs: [
      'tableau-bord-3-signaux',
      'decision-log-minimal',
    ],
    contentBlocks: [
      {
        title: 'Pourquoi ca marche',
        kind: 'context',
        bullets: [
          'Les structures qui tiennent ont un rythme, pas juste des reunions.',
          '15 min suffisent si on ne discute pas de tout, seulement du cap et des frictions.'
        ]
      },
      {
        title: 'Rituel en 3 questions',
        kind: 'action',
        bullets: [
          "1) Qu'est-ce qui a avance depuis la semaine derniere (faits, pas opinions) ?",
          "2) Qu'est-ce qui bloque vraiment (un blocage par personne max) ?",
          "3) Qu'est-ce qu'on change cette semaine (un ajustement concret) ?",
          'Regle : tout ce qui depasse 2 minutes devient un sujet separe, planifie.',
          'Finir par 1 phrase : priorite de la semaine + responsable du suivi.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_018',
    slug: 'inventaire-acces-30min',
    title: 'Inventaire acces 30 min',
    summary: 'Un inventaire express des acces et comptes critiques pour reduire les risques : qui a acces a quoi, par quel canal, et comment on retire vite.',
    outcome: 'Une liste claire des acces critiques et un plan simple de retrait en cas de depart ou incident.',
    category: 'securite',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1', 'p3', 'p4'],
    relatedResourceSlugs: [
      'mfa-partout-en-20min',
      'backups-test-15min',
    ],
    contentBlocks: [
      {
        title: 'Ce que les incidents exploitent',
        kind: 'warning',
        bullets: [
          "Un compte oublie, partage, ou non retire est une porte d'entree.",
          'Sans inventaire, tu ne sais pas quoi couper quand ca chauffe.'
        ]
      },
      {
        title: 'Inventaire minimal (30 min)',
        kind: 'action',
        bullets: [
          'Lister 10 acces critiques : messagerie, stockage, banque, hebergement, outils metier.',
          'Pour chaque acces : proprietaire, canal de connexion, droits, 2e facteur oui/non.',
          'Noter les comptes partages et decider un responsable de migration vers comptes nominatifs.',
          "Definir un geste d'urgence : comment retirer un acces en moins de 5 minutes.",
          'Decider une regle : tout depart declenche retrait le jour meme, puis revue a 7 jours.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_019',
    slug: 'decision-log-minimal',
    title: 'Decision log minimal',
    summary: 'Un journal de decisions ultra simple : ce qui a ete decide, par qui, pourquoi, et comment on revoit si ca ne marche pas.',
    outcome: 'Des decisions tracables qui reduisent les non-dits et evitent les debats qui reviennent.',
    category: 'gouvernance',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1', 'p3'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Le symptome',
        kind: 'guide',
        bullets: [
          "Quand une decision revient 3 fois, c'est qu'elle n'a jamais ete vraiment posee.",
          'Sans trace, la memoire devient politique.'
        ]
      },
      {
        title: 'Format de decision (copier-coller)',
        kind: 'action',
        bullets: [
          'Decision : phrase courte, testable.',
          'Contexte : 2 lignes max, faits.',
          'Pourquoi maintenant : risque si on ne decide pas.',
          'Qui decide : nom du role ou du groupe.',
          'Portee : ce que ca change et ce que ca ne change pas.',
          "Revue : date de relecture, criteres de succes, option d'arret."
        ]
      }
    ]
  },
  {
    id: 'res_v0_020',
    slug: 'compte-rendu-utile-1page',
    title: 'Compte-rendu utile en 1 page',
    summary: 'Un compte-rendu qui sert : decisions, actions, points a trancher, et risques. Zero roman, zero flou.',
    outcome: "Un compte-rendu lisible en 2 minutes qui permet d'agir sans rediscuter.",
    category: 'outillage',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1', 'p4'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: "L'erreur",
        kind: 'context',
        bullets: [
          "Un compte-rendu long cache souvent l'absence de decisions.",
          "Le but est l'execution, pas l'archivage."
        ]
      },
      {
        title: 'Structure 1 page',
        kind: 'action',
        bullets: [
          'Decisions (max 5) : une ligne par decision.',
          'Actions : quoi, qui, pour quand (max 10).',
          'Points a trancher : liste courte, avec proprietaire.',
          'Risques : 3 maximum, avec une mesure de reduction.',
          'Prochain rendez-vous : objectif unique + duree.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_021',
    slug: 'matrice-responsabilites-raci-lite',
    title: 'RACI lite en 45 min',
    summary: 'Une matrice simple pour arreter les zones grises : qui fait, qui valide, qui conseille, qui doit etre informe.',
    outcome: 'Des responsabilites clarifiees sur 5 activites cles, sans usine a gaz.',
    category: 'gouvernance',
    level: 'intermediate',
    effort: 'medium',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Pourquoi les tensions explosent',
        kind: 'guide',
        bullets: [
          'Les conflits humains cachent souvent une ambiguite de role.',
          "Quand personne n'est responsable, tout le monde se critique."
        ]
      },
      {
        title: 'RACI lite (pas plus de 5 lignes)',
        kind: 'action',
        bullets: [
          'Choisir 5 activites qui creent le plus de friction.',
          'Pour chaque activite : 1 responsable (fait), 1 valideur (tranche).',
          'Ajouter au besoin : 1 consulte, 1 informe, pas plus.',
          "Regle : si 2 valideurs, c'est flou, reduire a 1.",
          'Tester une semaine, puis ajuster selon les incidents reels.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_022',
    slug: 'charte-canaux-3-couleurs',
    title: 'Charte canaux en 3 couleurs',
    summary: 'Une charte simple pour reduire le bruit et les malentendus : canal decision, canal coordination, canal social.',
    outcome: 'Moins de messages inutiles, plus de clarte sur ou se dit quoi et quand.',
    category: 'outillage',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Le probleme',
        kind: 'guide',
        bullets: [
          "Quand tout passe partout, l'info critique se perd et les tensions montent.",
          'Les non-dits prosperent dans le flou des canaux.'
        ]
      },
      {
        title: 'Regles 3 couleurs',
        kind: 'action',
        bullets: [
          'Rouge = decisions : uniquement decisions + liens internes de reference, pas de debat.',
          "Orange = coordination : questions courtes, points bloquants, demandes d'aide.",
          "Vert = social : soutien, vie d'equipe, celebrations.",
          'Regle : un sujet debattu passe en reunion ou en document, pas en fil sans fin.',
          'Regle : toute decision en rouge doit pointer vers une trace (decision log).'
        ]
      }
    ]
  },
  {
    id: 'res_v0_023',
    slug: 'tableau-bord-3-signaux',
    title: 'Tableau de bord 3 signaux',
    summary: 'Un mini tableau de bord pour piloter sans se mentir : capacite, cash, et risques operationnels.',
    outcome: 'Trois signaux suivis chaque semaine pour detecter la derive avant la crise.',
    category: 'gouvernance',
    level: 'intermediate',
    effort: 'medium',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Pourquoi 3 seulement',
        kind: 'context',
        bullets: [
          "Trop d'indicateurs tue l'action.",
          'Trois signaux bien choisis evitent le pilotage au ressenti.'
        ]
      },
      {
        title: 'Les 3 signaux (a tenir 8 semaines)',
        kind: 'action',
        bullets: [
          "Capacite : energie reelle (0-5) + charge (0-5) mesurees par l'equipe, moyenne hebdo.",
          'Cash : semaines de visibilite + point de dependance majeur identifie.',
          'Risques : 1 risque operationnel principal + mesure de reduction en cours.',
          'Rituel : 10 min par semaine pour lire, decider un ajustement, et tracer.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_024',
    slug: 'mfa-partout-en-20min',
    title: '2e facteur partout en 20 min',
    summary: 'Activer un deuxieme facteur sur les comptes critiques en priorite : messagerie, stockage, finance, outils centraux.',
    outcome: 'Reduction immediate du risque de compromission de compte sur les acces prioritaires.',
    category: 'securite',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: "Pourquoi c'est urgent",
        kind: 'warning',
        bullets: [
          'Le vol de mot de passe arrive plus vite que l\'attaque sophistiquee.',
          'Le deuxieme facteur coupe une grande partie des intrusions opportunistes.'
        ]
      },
      {
        title: 'Plan 20 min',
        kind: 'action',
        bullets: [
          'Lister 5 comptes prioritaires a proteger en premier.',
          'Activer le deuxieme facteur sur chaque compte, un par un.',
          'Stocker les codes de recuperation dans un endroit separe et controle.',
          'Interdire les comptes partages sur les acces critiques, planifier la migration.',
          'Faire un test : deconnexion + reconnexion avec le deuxieme facteur.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_025',
    slug: 'backups-test-15min',
    title: 'Backups test en 15 min',
    summary: 'Un backup non teste est une croyance. Ce protocole verifie en 15 min que tu sais restaurer au moins un element critique.',
    outcome: 'Un test de restauration realise et une preuve que le backup est exploitable.',
    category: 'securite',
    level: 'intermediate',
    effort: 'low',
    status: 'published',
    updatedAt: '2026-01-01',
    relatedJourneys: ['p1'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Le risque reel',
        kind: 'warning',
        bullets: [
          "Beaucoup decouvrent que leurs sauvegardes sont inutilisables le jour de l'incident.",
          'Tester petit evite de tomber de haut.'
        ]
      },
      {
        title: 'Test minimal',
        kind: 'action',
        bullets: [
          'Choisir 1 element critique : un fichier, un export, une base, un dossier.',
          'Recuperer une version datee et la restaurer dans un endroit de test.',
          "Verifier l'integrite : ouverture, coherence, presence des elements attendus.",
          'Noter : ou est le backup, qui sait restaurer, combien de temps ca prend.',
          'Decider un rythme : un test rapide par mois, toujours le meme protocole.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_001',
    slug: 'scan-structurel-express',
    title: 'Scan structurel express',
    summary: 'Un diagnostic rapide pour clarifier les points de fragilite et les tensions dominantes.',
    outcome: 'Clarifier les points de tension prioritaires et les zones a stabiliser.',
    category: 'diagnostic',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Prep express',
        bullets: [
          'Definis la mission en une phrase courte.',
          'Liste trois points qui bloquent ou ralentissent.',
          'Note ce qui revient chaque semaine.'
        ]
      },
      {
        title: 'Questions cle',
        bullets: [
          'Ou la charge explose t elle en premier.',
          'Qui prend les decisions en dernier ressort.',
          'Quel signal annonce un incident.'
        ]
      },
      {
        title: 'Action immediate',
        kind: 'action',
        bullets: [
          'Choisis un blocage a traiter cette semaine.',
          'Definis un responsable et un point de suivi.',
          'Fixe une verification simple a J plus 7.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_002',
    slug: 'tableau-signaux-faibles',
    title: 'Tableau des signaux faibles',
    summary: 'Un canevas pour identifier les alertes precoces et prioriser les zones a surveiller.',
    outcome: 'Rendre visibles les signaux faibles et decider d un premier niveau d alerte.',
    category: 'diagnostic',
    level: 'intermediate',
    effort: 'medium',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Collecte',
        bullets: [
          'Note les faits sans interpretation.',
          'Indique la frequence et le lieu.',
          'Ajoute le niveau d impact percu.'
        ]
      },
      {
        title: 'Priorisation',
        bullets: [
          'Classe par recurrence puis gravite.',
          'Repere les signaux qui se cumulent.',
          'Identifie un seul signal a traiter.'
        ]
      },
      {
        title: 'Action 15 minutes',
        kind: 'action',
        bullets: [
          'Choisis un signal et un indicateur simple.',
          'Planifie un point d alerte court.',
          'Partage le tableau avec l equipe.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_003',
    slug: 'checklist-securite-psychologique',
    title: 'Checklist securite psychologique',
    summary: 'Une liste courte pour securiser les reunions et reduire la peur de parler.',
    outcome: 'Rendre les reunions plus ouvertes et limiter l autocensure.',
    category: 'securite',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Avant la reunion',
        bullets: [
          'Annonce clairement l objectif.',
          'Invite les critiques utiles.',
          'Partage l ordre du jour.'
        ]
      },
      {
        title: 'Pendant',
        bullets: [
          'Distribue la parole de facon equilibree.',
          'Reformule sans jugement.',
          'Valide les points de desaccord.'
        ]
      },
      {
        title: 'Action 7 jours',
        kind: 'action',
        bullets: [
          'Demande un retour anonyme simple.',
          'Choisis un ajustement a tester.',
          'Revient sur ce test au prochain point.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_004',
    slug: 'protocole-alerte-epuisement',
    title: 'Protocole alerte epuisement',
    summary: 'Un protocole simple pour detecter la surcharge et enclencher des protections.',
    outcome: 'Declencher rapidement une protection quand la surcharge apparait.',
    category: 'securite',
    level: 'intermediate',
    effort: 'medium',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Indices precoces',
        bullets: [
          'Baisse de qualite sur des taches simples.',
          'Retards repetes sur les meme sujets.',
          'Irritabilite ou retrait inhabituel.'
        ]
      },
      {
        title: 'Declencheurs',
        bullets: [
          'Deux signaux en une semaine.',
          'Une absence de recuperation apres repos.',
          'Un conflit qui s installe.'
        ]
      },
      {
        title: 'Action 48 heures',
        kind: 'action',
        bullets: [
          'Reduis la charge sur deux jours.',
          'Clarifie la priorite numero un.',
          'Planifie un point court de suivi.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_005',
    slug: 'atelier-clarte-decisions',
    title: 'Atelier clarte des decisions',
    summary: 'Un format d atelier pour rendre les decisions visibles et prevenir les malentendus.',
    outcome: 'Clarifier qui decide quoi et a quel moment.',
    category: 'ux',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Cadrage',
        bullets: [
          'Explique l objectif de l atelier.',
          'Liste les decisions recemment floues.',
          'Fixe une duree courte.'
        ]
      },
      {
        title: 'Deroulement',
        bullets: [
          'Chaque decision obtient un responsable.',
          'Indique un delai et un canal de validation.',
          'Note ce qui reste ouvert.'
        ]
      },
      {
        title: 'Action sortie',
        kind: 'action',
        bullets: [
          'Partage la synthese le jour meme.',
          'Valide un rituel de revue mensuel.',
          'Archive les decisions prises.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_006',
    slug: 'canevas-rituel-feedback',
    title: 'Canevas rituel feedback',
    summary: 'Un support pour installer un rituel court de feedback, sans charge cognitive.',
    outcome: 'Installer un feedback regulier sans surcharge.',
    category: 'ux',
    level: 'intermediate',
    effort: 'medium',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Preparation',
        bullets: [
          'Fixe un rythme stable.',
          'Limite a trois questions.',
          'Choisis un facilitateur.'
        ]
      },
      {
        title: 'Rituel',
        bullets: [
          'Commence par un fait positif.',
          'Partage un point a ameliorer.',
          'Conclue avec un engagement.'
        ]
      },
      {
        title: 'Action semaine',
        kind: 'action',
        bullets: [
          'Note un seul changement a tester.',
          'Valide un retour au prochain point.',
          'Archive les apprentissages.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_007',
    slug: 'guide-roles-explicites',
    title: 'Guide roles explicites',
    summary: 'Un guide pour clarifier les roles et limiter les zones grises.',
    outcome: 'Clarifier les roles pour eviter les doublons et les oublis.',
    category: 'gouvernance',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Cartographie',
        bullets: [
          'Liste les activites recurrentes.',
          'Attribue un role principal par activite.',
          'Note les points de passage obliges.'
        ]
      },
      {
        title: 'Zones grises',
        bullets: [
          'Repere les zones sans proprietaire.',
          'Decide qui tranche en dernier.',
          'Clarifie les dependances.'
        ]
      },
      {
        title: 'Action 30 minutes',
        kind: 'action',
        bullets: [
          'Choisis deux roles a clarifier.',
          'Valide les attentes avec l equipe.',
          'Publie une fiche simple.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_008',
    slug: 'cadre-arbitrage-mission',
    title: 'Cadre arbitrage mission',
    summary: 'Un cadre pour arbitrer entre mission, capacite et contraintes sans se disperser.',
    outcome: 'Decider plus vite entre priorites concurrentes.',
    category: 'gouvernance',
    level: 'advanced',
    effort: 'high',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Tensions courantes',
        bullets: [
          'Mission ambitieuse mais capacite limitee.',
          'Demandes urgentes qui cassent le rythme.',
          'Manque de criteres partages.'
        ]
      },
      {
        title: 'Regles d arbitrage',
        bullets: [
          'Priorite a l impact sur la mission.',
          'Refus clair si la capacite est depassee.',
          'Revue mensuelle des compromis.'
        ]
      },
      {
        title: 'Action alignement',
        kind: 'action',
        bullets: [
          'Definis trois criteres stables.',
          'Teste les criteres sur un cas reel.',
          'Documente la decision en une page.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_009',
    slug: 'kit-outils-coordination',
    title: 'Kit outils de coordination',
    summary: 'Une selection d outils minimaux pour suivre les engagements et les dependances.',
    outcome: 'Mettre en place un suivi simple des engagements.',
    category: 'outillage',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Tableau minimal',
        bullets: [
          'Une ligne par engagement.',
          'Un responsable et une date.',
          'Un etat simple a trois niveaux.'
        ]
      },
      {
        title: 'Cadence',
        bullets: [
          'Revue rapide chaque semaine.',
          'Mise a jour en fin de journee.',
          'Archive mensuelle.'
        ]
      },
      {
        title: 'Action rapide',
        kind: 'action',
        bullets: [
          'Cree le tableau en 10 minutes.',
          'Ajoute les cinq engagements critiques.',
          'Planifie le premier point de suivi.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_010',
    slug: 'modele-journal-bord',
    title: 'Modele journal de bord',
    summary: 'Un modele pour consigner decisions, tensions et apprentissages au fil des semaines.',
    outcome: 'Capitaliser les decisions et les apprentissages sans effort.',
    category: 'outillage',
    level: 'intermediate',
    effort: 'medium',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Structure',
        bullets: [
          'Decision prise et contexte bref.',
          'Tension observee et cause possible.',
          'Apprentissage a retenir.'
        ]
      },
      {
        title: 'Rythme',
        bullets: [
          'Mise a jour hebdomadaire.',
          'Lecture rapide au point d equipe.',
          'Archivage trimestriel.'
        ]
      },
      {
        title: 'Action demarrage',
        kind: 'action',
        bullets: [
          'Cree une premiere entree aujourd hui.',
          'Choisis un format unique pour l equipe.',
          'Planifie un rappel recurrent.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_011',
    slug: 'audit-communication-flux',
    title: 'Audit communication & flux',
    summary: 'Un diagnostic rapide pour repérer les ruptures de communication et les goulets de coordination.',
    outcome: 'Identifier les ruptures de communication et choisir un premier correctif.',
    category: 'diagnostic',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Ce que tu observes',
        bullets: [
          'Liste les moments ou une decision a ete mal comprise.',
          'Note les canaux utilises (reunion, chat, mail) pour chaque info critique.',
          'Repere les messages qui ont du etre repetes plusieurs fois.'
        ]
      },
      {
        title: 'Signaux de rupture',
        bullets: [
          'Informations importantes non partagees a temps.',
          'Deux personnes font la meme action en double.',
          'Les urgences arrivent toujours par la meme personne.'
        ]
      },
      {
        title: 'Premiers ajustements',
        kind: 'action',
        bullets: [
          'Decide un canal unique pour chaque type d info.',
          'Clarifie qui confirme la reception.',
          'Ajoute un recap simple en fin de semaine.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_012',
    slug: 'checklist-securite-baseline',
    title: 'Checklist securite baseline',
    summary: 'Les gestes essentiels pour petits collectifs : mots de passe, 2FA, phishing, sauvegardes.',
    outcome: 'Mettre en place les protections numeriques essentielles sans surcharge.',
    category: 'securite',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Comptes et acces',
        bullets: [
          'Active la double authentification partout ou c est possible.',
          'Supprime les comptes qui ne sont plus utilises.',
          'Utilise un gestionnaire de mots de passe pour l equipe.'
        ]
      },
      {
        title: 'Protection phishing',
        bullets: [
          'Ne clique pas sur une piece jointe si l email est ambigu.',
          'Verifie l adresse exacte de l expediteur.',
          'Partage un exemple d arnaque recent au collectif.'
        ]
      },
      {
        title: 'Sauvegardes minimales',
        kind: 'action',
        bullets: [
          'Identifie les trois dossiers critiques a sauvegarder.',
          'Teste une restauration simple une fois par trimestre.',
          'Range les sauvegardes hors du poste principal.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_013',
    slug: 'landing-structure-claire',
    title: 'Landing structure claire',
    summary: 'Un plan simple pour structurer une page d accueil ou une landing sans dispersion.',
    outcome: 'Clarifier l offre et augmenter la comprehension en 10 secondes.',
    category: 'ux',
    level: 'intro',
    effort: 'medium',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Message principal',
        bullets: [
          'Ecris une phrase qui dit qui tu aides et avec quoi.',
          'Ajoute une promesse concrete en une phrase.',
          'Supprime tout ce qui ne sert pas cette phrase.'
        ]
      },
      {
        title: 'Structure minimale',
        bullets: [
          'Un hero clair avec un appel a action.',
          'Trois preuves ou exemples concrets.',
          'Une section reponse aux questions frequentes.'
        ]
      },
      {
        title: 'Verification rapide',
        kind: 'action',
        bullets: [
          'Demande a quelqu un de reformuler en 10 secondes.',
          'Verifie la lisibilite sur mobile.',
          'Supprime une section si elle n est pas comprise.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_014',
    slug: 'mini-plan-seo-local',
    title: 'Mini plan SEO local',
    summary: 'Un plan d action court pour rendre le site trouvable sans dependance a la pub.',
    outcome: 'Ameliorer la visibilite locale avec un plan d action court.',
    category: 'outillage',
    level: 'intermediate',
    effort: 'medium',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'Priorites immediates',
        bullets: [
          'Choisis trois mots cles naturels lies a ton activite.',
          'Utilise ces mots dans les titres de page.',
          'Verifie que chaque page a un titre unique.'
        ]
      },
      {
        title: 'Contenus utiles',
        bullets: [
          'Publie une page par question frequente.',
          'Ajoute un exemple concret par page.',
          'Mets a jour les infos obsoletes.'
        ]
      },
      {
        title: 'Signal local',
        kind: 'action',
        bullets: [
          'Indique clairement la zone geographique servie.',
          'Ajoute un contact simple et stable.',
          'Demande un retour client pour affiner le vocabulaire.'
        ]
      }
    ]
  },
  {
    id: 'res_v0_015',
    slug: 'rgpd-accessibilite-starter',
    title: 'RGPD + accessibilite starter',
    summary: 'Les bases pour etre propre et lisible : mentions, consentement sobre, contrastes, titres.',
    outcome: 'Assurer un socle legal et une lecture confortable.',
    category: 'gouvernance',
    level: 'intro',
    effort: 'low',
    status: 'draft',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: [],
    contentBlocks: [
      {
        title: 'RGPD minimum viable',
        bullets: [
          'Liste les donnees collectees et pourquoi.',
          'Limite la collecte au strict necessaire.',
          'Ajoute un point de contact pour suppression.'
        ]
      },
      {
        title: 'Accessibilite simple',
        bullets: [
          'Verifie le contraste texte et fond.',
          'Utilise des titres clairs et ordonnes.',
          'Evite les textes trop petits sur mobile.'
        ]
      },
      {
        title: 'Verification express',
        kind: 'action',
        bullets: [
          'Fais relire par une personne externe.',
          'Teste la navigation au clavier.',
          'Note les blocages et corrige en priorite.'
        ]
      }
    ]
  }
];
