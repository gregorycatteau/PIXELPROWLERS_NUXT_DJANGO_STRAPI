export const RESOURCE_REGISTRY_V0 = [
  {
    id: 'res_v0_001',
    slug: 'scan-structurel-express',
    title: 'Scan structurel express',
    summary: 'Un diagnostic rapide pour clarifier les points de fragilite et les tensions dominantes.',
    outcome: 'Clarifier les points de tension prioritaires et les zones a stabiliser.',
    category: 'diagnostic',
    level: 'intro',
    effort: 'low',
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['tableau-signaux-faibles', 'checklist-securite-psychologique'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['protocole-alerte-epuisement'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['protocole-alerte-epuisement'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['atelier-clarte-decisions'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['canevas-rituel-feedback'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['guide-roles-explicites'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['cadre-arbitrage-mission'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['kit-outils-coordination'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['modele-journal-bord'],
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
    status: 'published',
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['atelier-clarte-decisions'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['protocole-alerte-epuisement'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['atelier-clarte-decisions'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['landing-structure-claire'],
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
    status: 'published',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['guide-roles-explicites'],
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
