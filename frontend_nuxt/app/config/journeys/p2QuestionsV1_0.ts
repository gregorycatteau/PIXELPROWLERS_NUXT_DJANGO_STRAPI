export type P2PanoramaAxisId = 'clarity' | 'capacity' | 'security';

export const P2_PANORAMA_AXIS_ORDER = ['clarity', 'capacity', 'security'];

export const p2PanoramaAxesMeta = {
  clarity: { label: 'Clarté & message', shortLabel: 'Clarté' },
  capacity: { label: 'Parcours & confiance', shortLabel: 'Parcours' },
  security: { label: 'Fiabilité & maîtrise', shortLabel: 'Fiabilité' }
};

export const p2PanoramaQuestions = [
  {
    id: 'p2_panorama_clarity_q1',
    axisId: 'clarity',
    label: 'Quand quelqu’un arrive sur notre page d’accueil, il comprend vite ce que nous faisons et pour qui.',
    help: 'Pense à une personne qui ne vous connaît pas. En ~20 secondes, ça passe ?',
    example: '“On aide X à faire Y, dans tel contexte.”',
    order: 1
  },
  {
    id: 'p2_panorama_clarity_q2',
    axisId: 'clarity',
    label: 'Il est simple de faire l’action principale (nous contacter, s’inscrire, demander un devis, faire un don…).',
    help: 'Une action claire, sans détour.',
    example: 'Un bouton visible et compréhensible (“Nous contacter”, “S’inscrire”…).',
    order: 2
  },
  {
    id: 'p2_panorama_capacity_q1',
    axisId: 'capacity',
    label: 'Les infos essentielles sont à jour et faciles à trouver (contact, horaires, tarifs, accès, agenda…).',
    help: 'Les infos “qui évitent un aller-retour” sont-elles là, tout de suite ?',
    example: 'L’email/téléphone est correct, le lieu et les horaires ne sont pas ambigus.',
    order: 3
  },
  {
    id: 'p2_panorama_capacity_q2',
    axisId: 'capacity',
    label: 'Sur mobile, le site reste lisible et utilisable (menu, texte, boutons, formulaire).',
    help: 'Sur téléphone, est-ce qu’on peut vraiment faire l’action principale ?',
    example: 'Le menu s’ouvre, les boutons ne sont pas minuscules, le formulaire se remplit.',
    order: 4
  },
  {
    id: 'p2_panorama_security_q1',
    axisId: 'security',
    label: 'Nous savons qui peut modifier le site et où se trouvent les accès clés (nom de domaine, hébergement, comptes).',
    help: 'Le jour où ça casse, est-ce que “quelqu’un sait” sans fouiller partout ?',
    example: 'Une liste simple des accès (même incomplète) existe et est tenue.',
    order: 5
  },
  {
    id: 'p2_panorama_security_q2',
    axisId: 'security',
    label: 'Quand quelque chose casse, nous pouvons comprendre quoi faire (ou qui appeler) sans panique ni dépendance à une seule personne.',
    help: 'L’objectif n’est pas d’être expert — c’est d’éviter l’impasse.',
    example: 'On sait à qui demander, et ce qui est “prioritaire” vs “secondaire”.',
    order: 6
  }
];
