export type P4_STUBPanoramaAxisId = 'clarity' | 'capacity';

export const P4_STUB_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p4_stubPanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p4_stubPanoramaQuestions = [
  { id: 'p4_stub_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p4_stub_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' }
];
