export const RESOURCE_REGISTRY_V0 = [
  {
    id: 'res_v0_001',
    slug: 'scan-structurel-express',
    title: 'Scan structurel express',
    summary: 'Un diagnostic rapide pour clarifier les points de fragilite et les tensions dominantes.',
    category: 'diagnostic',
    level: 'intro',
    effort: 'low',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['tableau-signaux-faibles']
  },
  {
    id: 'res_v0_002',
    slug: 'tableau-signaux-faibles',
    title: 'Tableau des signaux faibles',
    summary: 'Un canevas pour identifier les alertes precoces et prioriser les zones a surveiller.',
    category: 'diagnostic',
    level: 'intermediate',
    effort: 'medium',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['scan-structurel-express']
  },
  {
    id: 'res_v0_003',
    slug: 'checklist-securite-psychologique',
    title: 'Checklist securite psychologique',
    summary: 'Une liste courte pour securiser les reunions et reduire la peur de parler.',
    category: 'securite',
    level: 'intro',
    effort: 'low',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['protocole-alerte-epuisement']
  },
  {
    id: 'res_v0_004',
    slug: 'protocole-alerte-epuisement',
    title: 'Protocole alerte epuisement',
    summary: 'Un protocole simple pour detecter la surcharge et enclencher des protections.',
    category: 'securite',
    level: 'intermediate',
    effort: 'medium',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['checklist-securite-psychologique']
  },
  {
    id: 'res_v0_005',
    slug: 'atelier-clarte-decisions',
    title: 'Atelier clarte des decisions',
    summary: 'Un format d atelier pour rendre les decisions visibles et prevenir les malentendus.',
    category: 'ux',
    level: 'intro',
    effort: 'low',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['canevas-rituel-feedback']
  },
  {
    id: 'res_v0_006',
    slug: 'canevas-rituel-feedback',
    title: 'Canevas rituel feedback',
    summary: 'Un support pour installer un rituel court de feedback, sans charge cognitive.',
    category: 'ux',
    level: 'intermediate',
    effort: 'medium',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['atelier-clarte-decisions']
  },
  {
    id: 'res_v0_007',
    slug: 'guide-roles-explicites',
    title: 'Guide roles explicites',
    summary: 'Un guide pour clarifier les roles et limiter les zones grises.',
    category: 'gouvernance',
    level: 'intro',
    effort: 'low',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['cadre-arbitrage-mission']
  },
  {
    id: 'res_v0_008',
    slug: 'cadre-arbitrage-mission',
    title: 'Cadre arbitrage mission',
    summary: 'Un cadre pour arbitrer entre mission, capacite et contraintes sans se disperser.',
    category: 'gouvernance',
    level: 'advanced',
    effort: 'high',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p1', 'p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['guide-roles-explicites']
  },
  {
    id: 'res_v0_009',
    slug: 'kit-outils-coordination',
    title: 'Kit outils de coordination',
    summary: 'Une selection d outils minimaux pour suivre les engagements et les dependances.',
    category: 'outillage',
    level: 'intro',
    effort: 'low',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['modele-journal-bord']
  },
  {
    id: 'res_v0_010',
    slug: 'modele-journal-bord',
    title: 'Modele journal de bord',
    summary: 'Un modele pour consigner decisions, tensions et apprentissages au fil des semaines.',
    category: 'outillage',
    level: 'intermediate',
    effort: 'medium',
    updatedAt: '2025-12-31',
    relatedJourneys: ['p2', 'p3', 'p4', 'p5'],
    relatedResourceSlugs: ['kit-outils-coordination']
  },
  {
    id: 'res_v0_011',
    slug: 'audit-communication-flux',
    title: 'Audit communication & flux',
    summary: 'Un diagnostic rapide pour repérer les ruptures de communication et les goulets de coordination.',
    category: 'diagnostic',
    level: 'intro',
    effort: 'low',
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
    category: 'securite',
    level: 'intro',
    effort: 'low',
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
    category: 'ux',
    level: 'intro',
    effort: 'medium',
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
    category: 'outillage',
    level: 'intermediate',
    effort: 'medium',
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
    category: 'gouvernance',
    level: 'intro',
    effort: 'low',
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
        bullets: [
          'Fais relire par une personne externe.',
          'Teste la navigation au clavier.',
          'Note les blocages et corrige en priorite.'
        ]
      }
    ]
  }
];
