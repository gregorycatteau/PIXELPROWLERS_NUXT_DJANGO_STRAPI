export const P3_PANORAMA_AXIS_ORDER = ['symptomes', 'organisation', 'decisions'] as const;
export type P3PanoramaAxisId = (typeof P3_PANORAMA_AXIS_ORDER)[number];

export const p3PanoramaAxesMeta = {
  symptomes: { label: 'Signaux', shortLabel: 'Signaux' },
  organisation: { label: 'Organisation', shortLabel: 'Organisation' },
  decisions: { label: 'Decisions', shortLabel: 'Decisions' }
};

export const p3PanoramaQuestions = [
  { id: 'p3_panorama_symptomes_q1', axisId: 'symptomes', label: 'Les blocages reviennent d une semaine a l autre.' },
  { id: 'p3_panorama_symptomes_q2', axisId: 'symptomes', label: 'On reexplique souvent les memes points.' },
  { id: 'p3_panorama_organisation_q1', axisId: 'organisation', label: 'Les roles sont clairs quand il faut avancer.' },
  { id: 'p3_panorama_organisation_q2', axisId: 'organisation', label: 'Les priorites sont partagees sans negocier chaque jour.' },
  { id: 'p3_panorama_decisions_q1', axisId: 'decisions', label: 'Les decisions importantes sont prises au bon moment.' },
  { id: 'p3_panorama_decisions_q2', axisId: 'decisions', label: 'On sait quoi faire quand un choix reste en suspens.' }
];
