export type P3PanoramaAxisId = 'clarity' | 'alignment' | 'momentum';

export type P3PanoramaQuestion = {
  id: string;
  axisId: P3PanoramaAxisId;
  label: string;
  order?: number;
};

export const P3_PANORAMA_AXIS_ORDER: P3PanoramaAxisId[] = ['clarity', 'alignment', 'momentum'];

export const p3PanoramaAxesMeta: Record<P3PanoramaAxisId, { label: string; shortLabel: string }> = {
  clarity: { label: 'Clarte de la transition', shortLabel: 'Clarte' },
  alignment: { label: 'Alignement perso/structure', shortLabel: 'Alignement' },
  momentum: { label: 'Energie et mouvement', shortLabel: 'Mouvement' }
};

export const p3PanoramaQuestions: P3PanoramaQuestion[] = [
  {
    id: 'p3_panorama_clarity_q1',
    axisId: 'clarity',
    order: 1,
    label: 'Je sais ce que je veux laisser derriere dans cette transition.'
  },
  {
    id: 'p3_panorama_clarity_q2',
    axisId: 'clarity',
    order: 2,
    label: 'Je peux expliquer clairement ce que je cherche pour la suite.'
  },
  {
    id: 'p3_panorama_clarity_q3',
    axisId: 'clarity',
    order: 3,
    label: 'Je dispose de criteres simples pour choisir mes prochains pas.'
  },
  {
    id: 'p3_panorama_alignment_q1',
    axisId: 'alignment',
    order: 4,
    label: 'Ce qui compte pour moi est coherent avec ce que je vis actuellement.'
  },
  {
    id: 'p3_panorama_alignment_q2',
    axisId: 'alignment',
    order: 5,
    label: 'Je me sens aligne avec la direction prise par mon environnement.'
  },
  {
    id: 'p3_panorama_alignment_q3',
    axisId: 'alignment',
    order: 6,
    label: 'J ai une marge de manoeuvre pour ajuster ce qui ne convient pas.'
  },
  {
    id: 'p3_panorama_momentum_q1',
    axisId: 'momentum',
    order: 7,
    label: 'J ai une dynamique suffisante pour avancer pas a pas.'
  },
  {
    id: 'p3_panorama_momentum_q2',
    axisId: 'momentum',
    order: 8,
    label: 'Je dispose d appuis concrets pour progresser.'
  }
];
