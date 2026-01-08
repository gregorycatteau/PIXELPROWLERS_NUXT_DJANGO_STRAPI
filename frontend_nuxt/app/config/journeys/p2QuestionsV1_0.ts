export type P2PanoramaAxisId = 'clarity' | 'capacity' | 'security';

export const P2_PANORAMA_AXIS_ORDER = ['clarity', 'capacity', 'security'];

export const p2PanoramaAxesMeta = {
  clarity: { label: 'Gouvernance et priorités', shortLabel: 'Gouvernance' },
  capacity: { label: 'Coordination et suivi', shortLabel: 'Coordination' },
  security: { label: 'Sécurité et risques', shortLabel: 'Sécurité' }
};

export const p2PanoramaQuestions = [
  {
    id: 'p2_panorama_clarity_q1',
    axisId: 'clarity',
    label: 'Les priorités de la semaine sont explicites',
    order: 1
  },
  {
    id: 'p2_panorama_clarity_q2',
    axisId: 'clarity',
    label: 'On sait qui tranche quand ça bloque',
    order: 2
  },
  {
    id: 'p2_panorama_capacity_q1',
    axisId: 'capacity',
    label: 'Les demandes urgentes passent par un canal clair',
    order: 3
  },
  {
    id: 'p2_panorama_capacity_q2',
    axisId: 'capacity',
    label: 'Les actions décidées sont suivies sans relance lourde',
    order: 4
  },
  {
    id: 'p2_panorama_security_q1',
    axisId: 'security',
    label: 'Les accès critiques sont connus et rassurés',
    order: 5
  },
  {
    id: 'p2_panorama_security_q2',
    axisId: 'security',
    label: 'Un risque majeur est surveillé et partagé',
    order: 6
  }
];
