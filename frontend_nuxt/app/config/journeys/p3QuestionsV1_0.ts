export type P3PanoramaAxisId = 'clarity' | 'capacity';

export const P3_PANORAMA_AXIS_ORDER = ['clarity', 'capacity'];

export const p3PanoramaAxesMeta = {
  clarity: { label: 'Clarte', shortLabel: 'Clarte' },
  capacity: { label: 'Capacite', shortLabel: 'Capacite' }
};

export const p3PanoramaQuestions = [
  { id: 'p3_panorama_clarity_q1', axisId: 'clarity', label: 'Je peux exprimer la priorite principale.' },
  { id: 'p3_panorama_clarity_q2', axisId: 'clarity', label: 'Les priorites sont stables dans la semaine.' },
  { id: 'p3_panorama_clarity_q3', axisId: 'clarity', label: 'Je sais ce que signifie une reussite ici.' },
  { id: 'p3_panorama_clarity_q4', axisId: 'clarity', label: 'Les attentes sont formulees clairement.' },
  { id: 'p3_panorama_capacity_q1', axisId: 'capacity', label: 'La capacite actuelle est lisible.' },
  { id: 'p3_panorama_capacity_q2', axisId: 'capacity', label: 'La charge est soutenable dans le temps.' },
  { id: 'p3_panorama_capacity_q3', axisId: 'capacity', label: 'Nous avons les moyens pour tenir les engagements.' },
  { id: 'p3_panorama_capacity_q4', axisId: 'capacity', label: 'Je peux lever une alerte quand ca deborde.' }
];
