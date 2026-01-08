export const P4_PANORAMA_AXIS_ORDER = ['symptomes', 'rythmes', 'coordination'] as const;
export type P4PanoramaAxisId = (typeof P4_PANORAMA_AXIS_ORDER)[number];

export const p4PanoramaAxesMeta = {
  symptomes: { label: 'Signaux', shortLabel: 'Signaux' },
  rythmes: { label: 'Rythmes', shortLabel: 'Rythmes' },
  coordination: { label: 'Coordination', shortLabel: 'Coordination' }
};

export const p4PanoramaQuestions = [
  { id: 'p4_panorama_symptomes_q1', axisId: 'symptomes', label: 'Les urgences interrompent souvent le travail en cours.' },
  { id: 'p4_panorama_symptomes_q2', axisId: 'symptomes', label: 'On perd du temps a corriger des details deja vus.' },
  { id: 'p4_panorama_rythmes_q1', axisId: 'rythmes', label: 'Le rythme de la semaine est previsible.' },
  { id: 'p4_panorama_rythmes_q2', axisId: 'rythmes', label: 'Les temps de recul sont preserves.' },
  { id: 'p4_panorama_coordination_q1', axisId: 'coordination', label: 'Les demandes passent par un point de contact clair.' },
  { id: 'p4_panorama_coordination_q2', axisId: 'coordination', label: 'Les relais entre personnes sont fluides.' }
];
