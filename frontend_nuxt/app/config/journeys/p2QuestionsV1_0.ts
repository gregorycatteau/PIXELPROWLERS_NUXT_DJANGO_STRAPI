export const P2_PANORAMA_AXIS_ORDER = ['gouvernance', 'coordination', 'securite'] as const;
export type P2PanoramaAxisId = (typeof P2_PANORAMA_AXIS_ORDER)[number];

export const p2PanoramaAxesMeta = {
  gouvernance: { label: 'Gouvernance', shortLabel: 'Gouvernance' },
  coordination: { label: 'Coordination', shortLabel: 'Coordination' },
  securite: { label: 'Securite', shortLabel: 'Securite' }
};

export const p2PanoramaQuestions = [
  { id: 'p2_panorama_gouvernance_q1', axisId: 'gouvernance', label: 'Les priorites de la semaine sont explicites.' },
  { id: 'p2_panorama_gouvernance_q2', axisId: 'gouvernance', label: 'On sait qui tranche quand ca bloque.' },
  { id: 'p2_panorama_coordination_q1', axisId: 'coordination', label: 'Les demandes urgentes passent par un canal clair.' },
  { id: 'p2_panorama_coordination_q2', axisId: 'coordination', label: 'Les actions decidees sont suivies sans relance lourde.' },
  { id: 'p2_panorama_securite_q1', axisId: 'securite', label: 'Les acces critiques sont connus et reassures.' },
  { id: 'p2_panorama_securite_q2', axisId: 'securite', label: 'Un risque majeur est surveille et partage.' }
];
