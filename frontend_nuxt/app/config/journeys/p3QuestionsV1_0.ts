export type P3PanoramaAxisId = 'charge' | 'clarity' | 'support';

export const P3_PANORAMA_AXIS_ORDER: P3PanoramaAxisId[] = ['charge', 'clarity', 'support'];

export const p3PanoramaAxesMeta = {
  charge: { label: 'Charge & rythme', shortLabel: 'Charge' },
  clarity: { label: 'Clarte & limites', shortLabel: 'Clarte' },
  support: { label: 'Soutien & relais', shortLabel: 'Soutien' }
};

export const p3PanoramaQuestions = [
  {
    id: 'p3_panorama_charge_q1',
    axisId: 'charge',
    label: 'En ce moment, mon rythme est soutenable sur les deux prochaines semaines.',
    help: 'Soutenable = je peux continuer sans me cramer davantage.',
    example: 'Je peux tenir sans "serrer les dents" tous les jours.',
    order: 1
  },
  {
    id: 'p3_panorama_clarity_q2',
    axisId: 'clarity',
    label: 'Je sais clairement ce qui est prioritaire, et ce qui peut attendre.',
    help: 'Quand tout est prioritaire, la pression explose.',
    example: 'Je peux dire : "cette semaine, c est ca le coeur".',
    order: 2
  },
  {
    id: 'p3_panorama_clarity_q3',
    axisId: 'clarity',
    label: 'Je peux poser des limites (dire non, reporter, reduire) sans que tout s effondre.',
    help: 'Une limite utile n a pas besoin d etre parfaite - elle doit juste exister.',
    example: 'Je peux refuser une demande sans me retrouver seul a tout porter ensuite.',
    order: 3
  },
  {
    id: 'p3_panorama_support_q4',
    axisId: 'support',
    label: 'Quand une urgence arrive, il existe une regle ou un canal clair (et ce n est pas "a moi d absorber").',
    help: 'L objectif : eviter que tout devienne interruption permanente.',
    example: 'On sait quoi faire d abord, et quoi laisser pour plus tard.',
    order: 4
  },
  {
    id: 'p3_panorama_support_q5',
    axisId: 'support',
    label: 'Je ne porte pas tout seul : il existe au moins un relais concret (personne ou role).',
    help: 'Un relais concret = quelqu un peut vraiment prendre une part, meme petite.',
    example: 'Si je m arrete 48h, quelqu un peut gerer l essentiel.',
    order: 5
  },
  {
    id: 'p3_panorama_support_q6',
    axisId: 'support',
    label: 'J ai au moins un endroit sur pour dire que la charge est trop haute, sans etre juge.',
    help: 'Ce n est pas "se plaindre" : c est eviter la rupture.',
    example: 'Une conversation cadree, une reunion courte, un binome, un point hebdo.',
    order: 6
  }
];
