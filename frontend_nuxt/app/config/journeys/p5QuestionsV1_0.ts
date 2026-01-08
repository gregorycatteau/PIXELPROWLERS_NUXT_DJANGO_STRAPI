export type P5PanoramaAxisId = 'symptomes' | 'rythmes' | 'alignement';

export const P5_PANORAMA_AXIS_ORDER = ['symptomes', 'rythmes', 'alignement'] as const;

export const p5PanoramaAxesMeta = {
  symptomes: { label: 'Symptomes', shortLabel: 'Symptomes' },
  rythmes: { label: 'Rythmes', shortLabel: 'Rythmes' },
  alignement: { label: 'Alignement', shortLabel: 'Alignement' }
};

export const p5PanoramaQuestions = [
  {
    id: 'p5_panorama_symptomes_q1',
    axisId: 'symptomes',
    label: 'Les signaux de tension (retards, erreurs, irritations) sont visibles.'
  },
  {
    id: 'p5_panorama_symptomes_q2',
    axisId: 'symptomes',
    label: 'Les incidents critiques sont partages et documentes sans sur-interpretation.'
  },
  {
    id: 'p5_panorama_rythmes_q1',
    axisId: 'rythmes',
    label: 'Les points de verification de la semaine ont un rythme court et stable.'
  },
  {
    id: 'p5_panorama_rythmes_q2',
    axisId: 'rythmes',
    label: 'Les decisions et livrables suivent un tempo connu de tous.'
  },
  {
    id: 'p5_panorama_alignement_q1',
    axisId: 'alignement',
    label: 'Les priorites de la semaine sont clairement comprises par l equipe.'
  },
  {
    id: 'p5_panorama_alignement_q2',
    axisId: 'alignement',
    label: 'Les arbitrages sont partages et acceptes, meme quand ils frustrent.'
  }
];
