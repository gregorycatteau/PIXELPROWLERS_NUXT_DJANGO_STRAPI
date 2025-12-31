export type P4PanoramaAxisId = 'clarity' | 'capacity';

export const P4_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p4PanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p4PanoramaQuestions = [
  { id: 'p4_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p4_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' }
];
