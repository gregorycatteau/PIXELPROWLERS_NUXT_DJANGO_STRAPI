export type P2PanoramaAxisId = 'clarity' | 'capacity';

export const P2_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p2PanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p2PanoramaQuestions = [
  { id: 'p2_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p2_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' }
];
