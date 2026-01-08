export type P5PanoramaAxisId = 'symptomes' | 'rythmes' | 'alignement';

export const P5_PANORAMA_AXIS_ORDER = ['symptomes', 'rythmes', 'alignement'] as const;

export const p5PanoramaAxesMeta = {
  symptomes: { label: 'Symptomes', shortLabel: 'Symptomes' },
  rythmes: { label: 'Rythmes', shortLabel: 'Rythmes' },
  alignement: { label: 'Alignement', shortLabel: 'Alignement' }
};

export const p5PanoramaQuestions = [
  { id: 'p5_panorama_symptomes_q1', axisId: 'symptomes', label: 'Les signaux de tension sont visibles (retards, erreurs, irritations).' },
  { id: 'p5_panorama_symptomes_q2', axisId: 'symptomes', label: 'La charge ressentie reste soutenable semaine apres semaine.' },
  { id: 'p5_panorama_rythmes_q1', axisId: 'rythmes', label: 'Le rythme des points d avance est court et regulier.' },
  { id: 'p5_panorama_rythmes_q2', axisId: 'rythmes', label: 'Les decisions se prennent a un rythme clair.' },
  { id: 'p5_panorama_alignement_q1', axisId: 'alignement', label: 'Les priorites de la semaine sont comprises par tous.' },
  { id: 'p5_panorama_alignement_q2', axisId: 'alignement', label: 'Les arbitrages sont compris meme quand ils frustrent.' }
];
