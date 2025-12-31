export type P5PanoramaAxisId = 'clarity' | 'capacity';

export const P5_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p5PanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p5PanoramaQuestions = [
  { id: 'p5_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p5_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' }
];
