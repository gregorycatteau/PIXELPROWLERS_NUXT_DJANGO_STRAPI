export type P4PanoramaAxisId = 'clarity' | 'capacity' | 'support';

export type P4PanoramaQuestion = {
  id: string;
  axisId: P4PanoramaAxisId;
  label: string;
  order?: number;
};

export const P4_PANORAMA_AXIS_ORDER: P4PanoramaAxisId[] = ['clarity', 'capacity', 'support'];

export const p4PanoramaAxesMeta: Record<P4PanoramaAxisId, { label: string; shortLabel: string }> = {
  clarity: { label: 'Clarte de la direction', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite a executer', shortLabel: 'Capacite' },
  support: { label: 'Appuis et ressources', shortLabel: 'Appuis' }
};

export const p4PanoramaQuestions: P4PanoramaQuestion[] = [
  {
    id: 'p4_panorama_clarity_q1',
    axisId: 'clarity',
    order: 1,
    label: 'Je peux expliquer en une phrase ce que je veux obtenir.'
  },
  {
    id: 'p4_panorama_clarity_q2',
    axisId: 'clarity',
    order: 2,
    label: 'Je sais ce qui est prioritaire pour les 4 prochaines semaines.'
  },
  {
    id: 'p4_panorama_clarity_q3',
    axisId: 'clarity',
    order: 3,
    label: 'Je peux dire ce que je ne ferai pas ce mois-ci.'
  },
  {
    id: 'p4_panorama_capacity_q1',
    axisId: 'capacity',
    order: 4,
    label: 'Je dispose du temps necessaire pour avancer sur ce qui compte.'
  },
  {
    id: 'p4_panorama_capacity_q2',
    axisId: 'capacity',
    order: 5,
    label: 'Je sais sur quoi deleguer ou demander de l aide.'
  },
  {
    id: 'p4_panorama_capacity_q3',
    axisId: 'capacity',
    order: 6,
    label: 'Je garde une energie suffisante pour avancer sans me cramer.'
  },
  {
    id: 'p4_panorama_support_q1',
    axisId: 'support',
    order: 7,
    label: 'J ai au moins une personne de confiance pour relire ce plan.'
  },
  {
    id: 'p4_panorama_support_q2',
    axisId: 'support',
    order: 8,
    label: 'J ai acces aux ressources ou infos necessaires pour avancer.'
  },
  {
    id: 'p4_panorama_support_q3',
    axisId: 'support',
    order: 9,
    label: 'Je sais ou trouver un appui externe si besoin.'
  }
];
