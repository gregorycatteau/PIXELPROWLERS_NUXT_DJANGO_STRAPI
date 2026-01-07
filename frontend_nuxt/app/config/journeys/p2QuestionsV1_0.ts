export type P2PanoramaAxisId = 'clarity' | 'capacity';

export const P2_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p2PanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p2PanoramaQuestions = [
  { id: 'p2_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p2_panorama_clarity_q2', axisId: 'clarity', label: 'La demande la plus urgente est claire.' },
  { id: 'p2_panorama_clarity_q3', axisId: 'clarity', label: 'Je sais ce qui compte dans les deux prochaines semaines.' },
  { id: 'p2_panorama_clarity_q4', axisId: 'clarity', label: 'Les attentes sont formulees sans ambiguite.' },
  { id: 'p2_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' },
  { id: 'p2_panorama_capacity_q2', axisId: 'capacity', label: 'La charge de travail est soutenable.' },
  { id: 'p2_panorama_capacity_q3', axisId: 'capacity', label: 'Les moyens disponibles correspondent aux attentes.' },
  { id: 'p2_panorama_capacity_q4', axisId: 'capacity', label: 'Je peux prendre du recul quand la pression monte.' }
];
