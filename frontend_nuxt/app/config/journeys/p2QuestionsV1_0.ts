export type P2PanoramaAxisId = 'overload' | 'fragmentation' | 'sovereignty';

export type P2PanoramaQuestion = {
  id: string;
  axisId: P2PanoramaAxisId;
  label: string;
  order?: number;
};

export const P2_PANORAMA_AXIS_ORDER: P2PanoramaAxisId[] = ['overload', 'fragmentation', 'sovereignty'];

export const p2PanoramaAxesMeta: Record<P2PanoramaAxisId, { label: string; shortLabel: string }> = {
  overload: { label: 'Charge numerique', shortLabel: 'Charge' },
  fragmentation: { label: 'Fragmentation des outils', shortLabel: 'Fragmentation' },
  sovereignty: { label: 'Souverainete et maitrise', shortLabel: 'Souverainete' }
};

export const p2PanoramaQuestions: P2PanoramaQuestion[] = [
  {
    id: 'p2_panorama_overload_q1',
    axisId: 'overload',
    order: 1,
    label: 'Je perds du temps a cause des notifications ou interruptions numeriques.'
  },
  {
    id: 'p2_panorama_overload_q2',
    axisId: 'overload',
    order: 2,
    label: 'Je termine mes taches en dehors des horaires normaux a cause des outils.'
  },
  {
    id: 'p2_panorama_overload_q3',
    axisId: 'overload',
    order: 3,
    label: 'Le volume de sollicitations numeriques rend difficile la priorisation.'
  },
  {
    id: 'p2_panorama_fragmentation_q1',
    axisId: 'fragmentation',
    order: 4,
    label: 'La meme information existe dans plusieurs outils ou formats.'
  },
  {
    id: 'p2_panorama_fragmentation_q2',
    axisId: 'fragmentation',
    order: 5,
    label: 'On duplique souvent des actions parce que les outils ne communiquent pas.'
  },
  {
    id: 'p2_panorama_fragmentation_q3',
    axisId: 'fragmentation',
    order: 6,
    label: 'Nous passons du temps a chercher ou reconstituer des infos deja produites.'
  },
  {
    id: 'p2_panorama_sovereignty_q1',
    axisId: 'sovereignty',
    order: 7,
    label: 'Nous savons ou sont nos donnees et qui peut y acceder.'
  },
  {
    id: 'p2_panorama_sovereignty_q2',
    axisId: 'sovereignty',
    order: 8,
    label: 'Nous pouvons changer d outil sans bloquer l activite.'
  }
];
