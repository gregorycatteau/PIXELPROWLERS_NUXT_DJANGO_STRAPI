/**
 * Narratives centrées sur le fonctionnement et non sur la valeur des personnes.
 * Ces textes restent côté front : ne pas les envoyer au backend ni les logger avec des données utilisateur.
 */
export type P1TensionBand = 'low' | 'medium' | 'high' | 'very_high';

export interface P1BlockNarrativeBand {
  summary: string;
  interpretation: string;
}

export const P1_BLOCK_B1_TENSION_NARRATIVES: Record<P1TensionBand, P1BlockNarrativeBand> = {
  low: {
    summary:
      'Sur le climat et le ressenti, ce que tu décris ressemble plutôt à un environnement où l’on peut parler du travail sans trop de peur ni de non-dits.',
    interpretation:
      'Ça ne veut pas dire qu’il n’y a jamais de tensions, mais le fonctionnement actuel semble offrir un minimum de sécurité pour exprimer ce qui ne va pas et traiter les sujets sensibles sans tout casser.'
  },
  medium: {
    summary:
      'Sur le climat, tu décris une situation contrastée : certains aspects semblent soutenants, d’autres rendent l’expression plus coûteuse ou plus risquée.',
    interpretation:
      'La structure tient, mais certaines dynamiques (non-dits, injustices, charge qui s’accumule…) peuvent alourdir progressivement l’ambiance. Ce sont des zones à éclairer avec soin, sans te mettre en danger, pour éviter que ça ne se cristallise.'
  },
  high: {
    summary:
      'Sur le climat, ce que tu as posé montre plusieurs zones où il est difficile de dire les choses ou d’être entendu, sans crainte de conséquences.',
    interpretation:
      'Dans ce type de contexte, les tensions ont tendance à s’accumuler “sous le tapis”, jusqu’à produire des crises plus fortes ou des départs silencieux. L’enjeu est de créer des espaces, même petits, où la parole peut circuler avec un minimum de sécurité (personnes ressources, temps dédiés, règles claires).'
  },
  very_high: {
    summary:
      'Sur le climat, tu décris un environnement où parler des problèmes peut sembler risqué, inutile ou franchement dangereux pour toi.',
    interpretation:
      'Ce type de configuration est très coûteux humainement. Le but n’est pas de tout changer d’un coup, ni de te mettre en première ligne, mais de repérer d’abord comment protéger ta propre position (alliés, limites, marges de manœuvre), avant d’envisager des actions plus visibles sur la structure.'
  }
};

export const P1_BLOCK_B1_SKIP_MICROCOPY = {
  fewSkips:
    'Sur le climat et le ressenti, tu as répondu à la plupart des questions et choisi d’en laisser quelques-unes de côté. C’est une manière normale d’ajuster l’atelier à ce qui est possible pour toi maintenant.',
  manySkips:
    'Sur le climat et le ressenti, tu as choisi de ne pas répondre à plusieurs questions. C’est un signal important : le sujet est peut-être sensible, flou, ou simplement trop lourd à traiter pour l’instant. Le bilan le reconnaît comme une zone à préserver et à éventuellement explorer plus tard, à ton rythme, dans un contexte plus sécurisé.'
};

// Bloc B3 — règles & décisions : mêmes précautions, textes centrés sur le fonctionnement et à garder côté front.
export const P1_BLOCK_B3_TENSION_NARRATIVES: Record<P1TensionBand, P1BlockNarrativeBand> = {
  low: {
    summary:
      'Sur les règles et les décisions, ce que tu décris ressemble plutôt à un fonctionnement lisible : on voit qui décide, comment, et les règles sont globalement claires.',
    interpretation:
      'Il peut y avoir des zones grises, mais la structure paraît disposer d’un cadre décisionnel suffisamment stable pour que chacun comprenne ce qui se joue et sur quelle base les choix sont faits.'
  },
  medium: {
    summary:
      'Sur les règles et les décisions, tu décris un mélange de clarté et de zones plus opaques ou inégales.',
    interpretation:
      'Certaines décisions semblent bien cadrées, d’autres beaucoup moins transparentes ou moins suivies dans le temps. Cela crée des frottements, sans forcément bloquer tout le système, mais avec un risque de lassitude ou de contournements individuels.'
  },
  high: {
    summary:
      'Sur les règles et les décisions, ce que tu as posé montre plusieurs signes de flou, de coulisses ou d’application inégale.',
    interpretation:
      'Dans ce type de configuration, les décisions peuvent être perçues comme arbitraires ou changeantes, ce qui fragilise la confiance et la capacité des personnes à se projeter. L’enjeu est de rendre visibles quelques repères simples : qui décide de quoi, selon quelles règles, et comment les décisions sont suivies dans le temps.'
  },
  very_high: {
    summary:
      'Sur les règles et les décisions, tu décris un environnement où le cadre peut sembler largement arbitraire ou instrumentalisé.',
    interpretation:
      'Quand les règles servent surtout de levier de pouvoir, ou que les décisions importantes échappent durablement au regard collectif, le coût humain et politique est très élevé. L’objectif n’est pas de tout “remettre d’équerre” tout de suite, mais d’identifier des points d’appui concrets : ce qui mérite d’être documenté, les alliances possibles, les espaces où il est encore réaliste de remettre un peu de clarté.'
  }
};

export const P1_BLOCK_B3_SKIP_MICROCOPY = {
  fewSkips:
    'Sur les règles et les décisions, tu as répondu à la plupart des questions et choisi d’en laisser quelques-unes de côté. C’est une manière normale d’ajuster l’atelier à ce qui est possible pour toi, surtout sur des sujets parfois très politiques.',
  manySkips:
    'Sur les règles et les décisions, tu as choisi de ne pas répondre à plusieurs questions. C’est un signal important : le sujet est peut-être trop sensible, trop conflictuel ou trop exposant pour l’instant. Le bilan le reconnaît comme une zone à protéger, pas comme un angle mort à combler à tout prix.'
};
