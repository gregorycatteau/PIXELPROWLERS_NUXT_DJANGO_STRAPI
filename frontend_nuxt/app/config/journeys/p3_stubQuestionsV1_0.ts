export type P3_STUBPanoramaAxisId = 'clarity' | 'capacity';

export const P3_STUB_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p3_stubPanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p3_stubPanoramaQuestions = [
  { id: 'p3_stub_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p3_stub_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' }
];
