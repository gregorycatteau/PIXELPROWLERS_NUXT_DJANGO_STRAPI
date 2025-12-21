// front-only, ne jamais inclure de données brutes.
export const P1_EXPORT_COPY = {
  title: 'Exporter',
  helper: 'Deux niveaux : minimal (partage plus sûr) ou complet (analyse + vérifs).',
  warningMinimal: 'Minimal : résumé sans éléments interprétatifs détaillés.',
  warningFull: 'Complet : inclut des hypothèses et des vérifs. À partager seulement si le contexte est sûr.',
  modes: {
    minimal: 'Export minimal',
    full: 'Export complet'
  },
  copied: 'Copié dans le presse-papiers.',
  failed: 'Impossible de copier. Sélectionne le texte manuellement.'
} as const;
