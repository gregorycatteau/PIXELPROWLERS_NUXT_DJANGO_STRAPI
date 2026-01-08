export const p2Copy = {
  intro: {
    title: 'Mon site / mes outils ne suivent pas — mini-diagnostic',
    subtitle: '6 questions. Un bilan clair. Des premières actions sans jargon.',
    outcome: 'Identifier 2–3 priorités concrètes, sans t’exposer : tu peux t’arrêter à tout moment, et rien n’est publié.',
    cta: 'Commencer le panorama',
    sections: {
      purpose: {
        title: 'Ce que ce parcours fait (et ne fait pas)',
        items: [
          'Ce que ça fait : t’aider à repérer où ça coince (clarté, parcours, fiabilité) et à choisir une première action utile.',
          'Ce que ça ne fait pas : ce n’est pas un audit technique complet, ni une “refonte magique”. C’est un point de départ pour reprendre la main.'
        ]
      },
      beforeStart: {
        title: 'Avant de commencer',
        items: [
          'Pas besoin de vocabulaire technique : réponds selon ce que tu observes et ce que tu vis au quotidien.',
          'Si tu hésites entre deux réponses, prends la plus prudente.',
          'Tu peux t’arrêter quand tu veux : ce qui est déjà répondu reste utile.'
        ]
      }
    }
  },
  panorama: {
    title: 'Panorama P2',
    subtitle: 'Questions de base pour poser le contexte.',
    meta: 'Identifier 2–3 priorités concrètes, sans t’exposer : tu peux t’arrêter à tout moment, et rien n’est publié.',
    validate: 'Voir le bilan',
    back: 'Retour'
  },
  panoramaBilan: {
    title: 'Bilan P2',
    subtitle: 'Synthese par axe.',
    summaryTitle: 'Ce que tu viens de poser',
    summarySubtitle: 'Panorama rapide, base sur tes reponses.',
    nextStepsTitle: 'Prochaine etape',
    nextStepsSubtitle: 'Explorer le bilan global pour un export.',
    backToPanorama: 'Retour au panorama',
    globalCta: 'Voir le bilan global',
    globalLocked: 'Le bilan global est accessible apres le panorama.'
  },
  resources: {
    intro: 'Ces ressources sont là pour t’aider à passer du constat à une action simple. Prends-en une seule, applique-la, puis reviens si besoin.',
    cta: 'Ouvrir une ressource'
  },
  bilan: {
    scoreLabel: 'Niveau de friction',
    prioritiesLabel: 'Priorités immédiates',
    actionCards: [
      {
        title: 'Clarifier la promesse en une phrase',
        description:
          'Avant de refaire quoi que ce soit, assure-toi que le message est limpide : qui tu aides, ce que tu proposes, et la prochaine étape. Souvent, c’est le levier le plus rapide.',
        cta: 'Écrire la phrase'
      },
      {
        title: 'Sécuriser et simplifier les accès',
        description:
          'Fais l’inventaire des comptes et des clés (domaine, hébergement, boîte mail, outils). Retire les accès inutiles. Objectif : éviter l’effet “personne ne sait”.',
        cta: 'Faire l’inventaire'
      },
      {
        title: 'Tester le parcours principal sur mobile',
        description:
          'Ouvre le site sur un téléphone et fais le parcours principal comme un visiteur : arriver, comprendre, agir. Note 3 blocages max, puis corrige dans cet ordre.',
        cta: 'Faire le test'
      }
    ]
  },
  global: {
    title: 'Bilan global P2',
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
    title: '=== Bilan P2 (panorama) ===',
    panoramaHeading: '--- Panorama ---',
    blocksHeading: '--- Bloc exploratoire ---',
    globalHeading: '--- Bilan global (agrege) ---',
    metaHeading: '--- Metadonnees ---',
    closingLine: 'Bilan genere cote client.'
  }
};
