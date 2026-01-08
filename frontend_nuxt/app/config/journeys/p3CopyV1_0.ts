export const p3Copy = {
  intro: {
    title: 'Je suis a bout - mini-diagnostic',
    subtitle: '6 questions. Un bilan clair. Une premiere protection concrete, sans pression.',
    outcome:
      'Reperer 2-3 leviers de soulagement realistes, sans te juger : tu peux t\'arreter a tout moment, et rien n\'est publie.',
    cta: 'Commencer le panorama',
    sections: {
      purpose: {
        title: 'Ce que ce parcours fait (et ne fait pas)',
        items: [
          'Ce que ca fait : t\'aider a reperer ce qui met la pression (rythme, limites, relais, clarte) et a choisir une premiere action de protection, simple et faisable.',
          'Ce que ca ne fait pas : ce n\'est pas un jugement sur toi, ni un accompagnement medical/psychologique. C\'est un point de depart pour reprendre de l\'air et decider du prochain pas.'
        ]
      },
      beforeStart: {
        title: 'Avant de commencer',
        items: [
          'Pas besoin de "bien repondre" : reponds selon ce que tu vis, au quotidien.',
          'Si tu hesites entre deux reponses, prends la plus prudente.',
          'Tu peux t\'arreter quand tu veux : ce qui est deja repondu reste utile.',
          'Si tu te sens en danger immediat, fais passer ta securite d\'abord : contacte les urgences (112 en Europe) ou une personne de confiance.'
        ]
      }
    }
  },
  panorama: {
    title: 'Panorama P3',
    subtitle: '3 axes-cles pour poser la pression sans la juger.',
    meta: 'Charge, limites et soutien : une lecture lucide.',
    validate: 'Voir le bilan',
    back: 'Retour'
  },
  panoramaBilan: {
    title: 'Bilan P3',
    subtitle: 'Synthese factuelle par axe.',
    summaryTitle: 'Ce que tu viens de poser',
    summarySubtitle: 'Un point de situation neutre.',
    nextStepsTitle: 'Prochaine etape',
    nextStepsSubtitle: 'Revenir au panorama ou ouvrir une ressource utile.',
    backToPanorama: 'Retour au panorama',
    globalCta: 'Voir le bilan global',
    globalLocked: 'Le bilan global est accessible apres le panorama.'
  },
  bilan: {
    scoreLabel: 'Niveau de pression',
    prioritiesLabel: 'Ce qui protege d abord',
    actionCards: [
      {
        title: 'Choisir deux choses a arreter cette semaine',
        description:
          'Note tout ce qui te pese, puis choisis 2 elements a arreter, reduire ou reporter. Ce n est pas "abandonner" : c est proteger la suite.',
        cta: 'Choisir mes 2 stops'
      },
      {
        title: 'Rendre visible la charge en 10 minutes',
        description:
          'Fais un inventaire simple : taches recurrentes, urgences, decisions en attente. Le but n est pas d etre exhaustif - juste de rendre la charge partageable.',
        cta: 'Faire l inventaire'
      },
      {
        title: 'Demander un relais cadre',
        description:
          'Identifie une personne ou un role, et formule une demande simple : "peux-tu prendre X pendant Y jours ?". Un relais partiel vaut mieux qu aucun relais.',
        cta: 'Formuler la demande'
      }
    ]
  },
  resources: {
    intro: 'Ces ressources sont la pour t aider a reprendre un peu d air et a poser une premiere protection concrete. Prends-en une seule, applique-la, puis reviens si besoin.',
    cta: 'Ouvrir une ressource'
  },
  global: {
    title: 'Bilan global P3',
    subtitle: 'Synthese publique, basee sur des agregats.',
    panoramaHeading: 'Panorama',
    blocksHeading: 'Blocs exploratoires',
    exportHeading: 'Export (client-side)',
    exportNotice: 'Le texte ci-dessus est genere cote client.',
    copyCta: 'Copier le bilan',
    printCta: 'Imprimer',
    clearCta: 'Effacer mes reponses de cet appareil',
    backToHub: 'Retour au panorama',
    sovereigntyNote: 'Ce bilan reste sur cet appareil.'
  },
  export: {
    title: '=== Bilan P3 (panorama) ===',
    panoramaHeading: '--- Panorama ---',
    blocksHeading: '--- Bloc exploratoire ---',
    globalHeading: '--- Bilan global (agrege) ---',
    metaHeading: '--- Metadonnees ---',
    closingLine: 'Bilan genere cote client.'
  }
};
