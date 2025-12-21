// app/config/journeys/p1EngagementCopy.ts
// "Voix officielle" P1 V1.3 — niveaux d'engagement N1→N4.
// Contenu uniquement : ne touche ni scoring, ni storage.

export interface P1IntroCopy {
  title: string;
  main: string;
  secondary: string;
}

export interface P1PanoramaAxisCopy {
  title: string;
  body: string;
}

export interface P1PanoramaCopy {
  intro: string;
  axis: {
    human: P1PanoramaAxisCopy;
    movement: P1PanoramaAxisCopy;
    decisions: P1PanoramaAxisCopy;
    structure: P1PanoramaAxisCopy;
  };
  n1Block: string;
  n2Block: string;
}

export interface P1GlobalBilanCopy {
  intro: string;
  synthesis: string;
  levelN1: string;
  levelN2: string;
  levelN3: string;
  levelN4: string;
}

export interface P1CarrefourBlockCopy {
  ctaLabel: string;
  description: string;
}

export interface P1CarrefourCopy {
  intro: string;
  n1: P1CarrefourBlockCopy;
  n2: P1CarrefourBlockCopy;
  n3: P1CarrefourBlockCopy;
  n4: P1CarrefourBlockCopy;
}

export interface P1EngagementCopy {
  introE0: P1IntroCopy;
  panoramaE2: P1PanoramaCopy;
  globalBilan: P1GlobalBilanCopy;
  carrefour: P1CarrefourCopy;
}

export const p1EngagementCopy: P1EngagementCopy = {
  introE0: {
    title: 'Prendre un temps pour regarder comment ta structure fonctionne',
    main: [
      'Cet atelier te propose une série de phrases sur le fonctionnement de ta structure.',
      'Tu indiques simplement à quel point tu es d’accord, de “pas du tout d’accord” à “tout à fait d’accord”.',
      '',
      'Tu peux avancer à ton rythme, t’arrêter en cours de route, reprendre plus tard, ou effacer complètement tes réponses de cet appareil.',
      'Même si tu ne vas pas au bout, ce que tu auras posé restera utile pour toi.'
    ].join('\n\n'),
    secondary: [
      'Tu peux utiliser P1 uniquement en mode solo, pour mieux comprendre ce qui se passe dans ta structure, sans en parler à personne.',
      'Si un jour tu souhaites un regard extérieur ou un appui plus structuré, d’autres options existent (miroir, atelier, accompagnement), mais ce n’est pas une condition pour que cet atelier ait du sens.'
    ].join('\n\n')
  },
  panoramaE2: {
    intro: [
      'Tu viens de poser un premier panorama de ta structure, à partir de ton propre ressenti.',
      'Ce bilan met en évidence les zones plutôt stables et celles où les tensions se concentrent, ainsi que les parties que tu as choisi de laisser de côté pour l’instant.',
      'C’est un miroir de fonctionnement, pas un verdict sur ta valeur, ni sur celle des personnes autour de toi.'
    ].join('\n\n'),
    axis: {
      human: {
        title: 'Axe Humain',
        body: [
          'Sur l’axe Humain, tu as décrit la manière dont se vivent les relations, les désaccords et la sécurité psychologique dans ta structure.',
          'On regarde ici si les échanges restent globalement respectueux, si certaines personnes semblent mises de côté, et à quel point il est possible de parler franchement sans se mettre en danger.',
          'Ce que ça suggère, ce n’est pas « il y a des bons et des mauvais », mais plutôt :',
          '- est-ce que l’espace de discussion est assez sûr pour aborder les vrais sujets,',
          '- ou est-ce que certains thèmes ou certaines configurations deviennent rapidement sensibles, tendus, voire évités ?'
        ].join('\n\n')
      },
      movement: {
        title: 'Axe Mouvement',
        body: [
          'Sur l’axe Mouvement, tu as parlé de la dynamique globale : avancer, piétiner, s’épuiser.',
          'On regarde à quel point vous réussissez à stabiliser le quotidien, à sortir de l’urgence permanente et à faire progresser les projets qui comptent vraiment.',
          'Ce que ça montre, ce n’est pas « vous n’êtes pas efficaces », mais :',
          '- est-ce que l’énergie est principalement utilisée pour construire,',
          '- ou est-ce qu’elle part beaucoup en gestion de crises, reports, relances sans fin ?'
        ].join('\n\n')
      },
      decisions: {
        title: 'Axe Décisions',
        body: [
          'Sur l’axe Décisions, tu as décrit la lisibilité de « qui décide quoi », quand, et comment.',
          'On regarde si les décisions importantes sont expliquées de manière compréhensible, si les personnes concernées peuvent donner leur point de vue, et s’il est possible de questionner une décision sans prendre de risque.',
          'Ce que ça éclaire, c’est moins « les décideurs » que :',
          '- la qualité du cadre de décision,',
          '- le niveau de confiance dans la manière dont les décisions sont prises et partagées.'
        ].join('\n\n')
      },
      structure: {
        title: 'Axe Structure',
        body: [
          'Sur l’axe Structure, tu as parlé de rôles, de continuité et de robustesse.',
          'On regarde si les grands repères d’organisation sont clairs, si les responsabilités sont bien réparties, et à quel point la structure dépend de quelques personnes clés ou de bricolages permanents.',
          'Ce que ça interroge, ce n’est pas « les gens ne font pas leur travail », mais plutôt :',
          '- est-ce que la structure tient debout d’elle-même,',
          '- ou est-ce qu’elle repose trop souvent sur la bonne volonté et la sur-implication de quelques-uns ?'
        ].join('\n\n')
      }
    },
    n1Block: [
      'Tu peux choisir de rester en mode solo avec ce panorama : le relire tranquillement, le confronter à ton ressenti, le partager éventuellement avec une ou deux personnes de confiance de ton choix.',
      'Rien que ce premier travail de mise à plat est déjà une forme d’auto-défense : tu vois mieux où ton énergie part, et où tu as envie (ou pas) de la mettre.'
    ].join('\n\n'),
    n2Block: [
      'Si tu sens que ce panorama résonne fort mais que tu as du mal à le regarder seul·e, tu pourras, plus tard, demander un miroir sécurisé : un temps cadré avec PixelProwlers ou un tiers de confiance pour relire ce diagnostic sans jugement.',
      'Cela ne t’engage pas à « lancer un gros projet » : c’est simplement l’option d’un regard externe, pour clarifier ce que tu vois déjà.'
    ].join('\n\n')
  },
  globalBilan: {
    intro: [
      'Tu viens de faire un vrai travail de diagnostic, que beaucoup de structures ne prennent jamais le temps de faire.',
      'Tu as posé des réponses, ignoré certaines questions, peut-être hésité sur d’autres : tout cela raconte déjà quelque chose de ta situation et de tes priorités du moment.',
      'Ce bilan global ne te dit pas « ce que tu dois faire », il t’aide à voir où ça se joue, et sur quels terrains tu as envie, ou non, de bouger.'
    ].join('\n\n'),
    synthesis: [
      'En croisant ce qui ressort des différents blocs (climat, mouvement, décisions, structure), on voit se dessiner quelques grands enjeux possibles :',
      '- des zones où le fonctionnement semble plutôt tenir,',
      '- des zones où la tension est diffuse mais gérable,',
      '- des zones où la fatigue, la confusion ou le sentiment d’injustice peuvent devenir lourds au quotidien.',
      '',
      'Ce n’est pas un diagnostic médical, ni un audit officiel : c’est une carte de la situation vue depuis ta place.',
      'Tu peux t’en servir pour choisir où mettre ton énergie, ce que tu laisses de côté pour l’instant, et ce pour quoi tu auras peut-être besoin d’appui.'
    ].join('\n\n'),
    levelN1: [
      'Tu peux décider de rester dans une logique 100 % solo.',
      'Concrètement, cela peut vouloir dire : relire ton bilan, le compléter plus tard, t’en servir comme repère personnel, télécharger ou utiliser les outils proposés (fiches, checklists, canevas) sans en parler à personne.',
      'Ton diagnostic t’appartient, tu n’as de comptes à rendre à personne à partir de ce que tu as posé ici.'
    ].join('\n\n'),
    levelN2: [
      'Si tu as besoin d’un regard extérieur, tu peux envisager un miroir sécurisé : un temps court, cadré, pour relire ensemble ce que tu as posé, remettre de l’ordre dans ce que tu ressens, et nommer les priorités sans que personne ne prenne le contrôle à ta place.',
      'Cela n’implique pas automatiquement un contrat, un chantier long ou une exposition de ta structure : c’est un espace pour mieux voir, pas pour décider à ta place.'
    ].join('\n\n'),
    levelN3: [
      'Si tu sais déjà sur quel terrain tu veux agir (par exemple : réunions qui dérapent, décisions floues, informations qui circulent mal, etc.), tu peux envisager un atelier tactique.',
      'L’idée : travailler sur un point ciblé, sur un temps court, avec quelques personnes concernées, pour tester des ajustements concrets (nouveau format de réunion, règles de décision plus claires, outils mieux posés) et en observer les effets.'
    ].join('\n\n'),
    levelN4: [
      'Si ce qui ressort du diagnostic, c’est que les difficultés sont surtout structurelles (rôles, gouvernance, répartition des responsabilités, continuité), tu peux envisager, à un autre moment, une re-architecture accompagnée.',
      'C’est un engagement plus lourd : il se discute, se prépare, et ne se décide pas sur un coup de tête. Le rôle de PixelProwlers, dans ce cas, est d’aider à concevoir et sécuriser ces transformations, pas de prendre la main sur ta structure.'
    ].join('\n\n')
  },
  carrefour: {
    intro: [
      'À partir de ce que tu as vu et ressenti dans cet atelier, tu peux choisir comment tu veux poursuivre la suite de ta démarche.',
      'Il n’y a pas de « bon » ou de « mauvais » choix : seulement ce qui est réaliste et soutenable pour toi et ta structure, maintenant.'
    ].join('\n\n'),
    n1: {
      ctaLabel: 'Garder ce diagnostic pour moi',
      description:
        'Tu peux t’arrêter ici, relire tranquillement ton bilan et utiliser les ressources proposées en autonomie. C’est déjà un vrai pas de protection et de clarification.'
    },
    n2: {
      ctaLabel: 'Demander un miroir externe',
      description:
        'Si tu en ressens le besoin, tu peux demander un temps court de relecture avec un regard extérieur, pour mettre des mots plus clairs sur ce que tu as posé, sans obligation de lancer un projet derrière.'
    },
    n3: {
      ctaLabel: 'Explorer un atelier tactique',
      description:
        'Si un terrain ressort nettement (réunions, décisions, communication…), tu peux envisager un petit atelier ciblé pour tester des ajustements concrets avec les personnes concernées.'
    },
    n4: {
      ctaLabel: 'Discuter d’une re-architecture',
      description:
        'Si tu identifies un besoin de changement plus structurel, tu peux ouvrir une discussion sur un accompagnement plus long, à ton rythme, sans engagement automatique.'
    }
  }
};
