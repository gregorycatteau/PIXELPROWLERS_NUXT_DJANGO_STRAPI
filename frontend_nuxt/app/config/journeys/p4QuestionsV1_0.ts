export const P4_PANORAMA_AXIS_ORDER = ['symptomes', 'rythmes', 'coordination'] as const;
export type P4PanoramaAxisId = (typeof P4_PANORAMA_AXIS_ORDER)[number];

export const p4PanoramaAxesMeta = {
  symptomes: { label: 'Signaux', shortLabel: 'Signaux' },
  rythmes: { label: 'Rythmes', shortLabel: 'Rythmes' },
  coordination: { label: 'Coordination', shortLabel: 'Coordination' }
};

export const p4PanoramaQuestions = [
  {
    id: 'p4_panorama_symptomes_q1',
    axisId: 'symptomes',
    label: 'Les urgences interrompent le travail en cours sans priorite partagee.'
  },
  {
    id: 'p4_panorama_symptomes_q2',
    axisId: 'symptomes',
    label: 'On doit regularly reallocer du temps pour corriger des incidents deja identifies.'
  },
  {
    id: 'p4_panorama_rythmes_q1',
    axisId: 'rythmes',
    label: 'La cadence hebdo est predictable et partagee par l equipe.'
  },
  {
    id: 'p4_panorama_rythmes_q2',
    axisId: 'rythmes',
    label: 'Chaque semaine a un rituel court qui permet d aligner la priorite.'
  },
  {
    id: 'p4_panorama_coordination_q1',
    axisId: 'coordination',
    label: 'Les relais sont clairs quand une personne est en retard ou absente.'
  },
  {
    id: 'p4_panorama_coordination_q2',
    axisId: 'coordination',
    label: 'Les demandes urgentes passent par un canal connu et respecte.'
  }
];
