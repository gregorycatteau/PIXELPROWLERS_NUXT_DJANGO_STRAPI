// Front-only canonical mapping for P1 sous-thèmes.
// Permet de faire converger les anciennes clés (copy/questionnaires) vers des IDs canoniques.
export const P1_THEME_ID_ALIASES: Record<string, string> = {
  securite_psy: 'securite_psy',
  securite_psychologique: 'securite_psy',
  'Sécurité psychologique': 'securite_psy',
  non_dits: 'non_dits',
  'Non-dits': 'non_dits',
  conflits: 'conflits',
  gestion_conflits: 'conflits',
  'Gestion des conflits': 'conflits',
  charge_fatigue: 'charge_fatigue',
  'Charge et fatigue': 'charge_fatigue',
  sens_alignement: 'sens_alignement',
  'Sens et alignement': 'sens_alignement',
  justice: 'justice',
  justice_equite: 'justice',
  'Justice / équité': 'justice',
  reconnaissance: 'reconnaissance',
  Reconnaissance: 'reconnaissance',
  isolement: 'isolement',
  Isolement: 'isolement',
  previsibilite_quotidien: 'previsibilite_quotidien',
  previsibilite: 'previsibilite_quotidien',
  'Prévisibilité du quotidien': 'previsibilite_quotidien',
  ambiance_globale: 'ambiance_globale',
  'Ambiance globale': 'ambiance_globale',
  // B3
  coulisses: 'coulisses',
  'Décisions en coulisses': 'coulisses',
  opacite: 'coulisses',
  coulisses_opacite: 'coulisses',
  'Opacité décisionnelle': 'coulisses',
  entorses_regles: 'entorses_regles',
  entorses: 'entorses_regles',
  'Entorses aux règles': 'entorses_regles',
  recours: 'recours',
  recours_arbitrage: 'recours',
  roles_decisionnels: 'roles_decisionnels',
  'Rôles décisionnels': 'roles_decisionnels',
  regles_ecrites: 'regles_ecrites',
  'Règles écrites': 'regles_ecrites',
  equite_regles: 'equite_regles',
  'Equité des règles': 'equite_regles',
  participation: 'participation',
  Participation: 'participation',
  desaccord: 'desaccord',
  'Désaccord et contestation': 'desaccord',
  suivi_decisions: 'suivi_decisions',
  'Suivi des décisions': 'suivi_decisions',
  changements_regles: 'changements_regles',
  'Changements de règles': 'changements_regles',
  responsabilite: 'responsabilite',
  'Responsabilité politique': 'responsabilite'
};

export const toCanonicalThemeId = (id: string | null | undefined): string | undefined => {
  if (!id) return undefined;
  return P1_THEME_ID_ALIASES[id] ?? id;
};

// AUDIT OK — canoniques B3 : coulisses (opacité), entorses_regles, recours, roles_decisionnels,
// regles_ecrites, equite_regles, participation, desaccord, suivi_decisions,
// changements_regles, responsabilite.
