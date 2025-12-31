export type P3PanoramaAxisId = 'clarity' | 'capacity';

export const P3_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p3PanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p3PanoramaQuestions = [
  { id: 'p3_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p3_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' }
];
