/**
 * Narratives centrées sur le fonctionnement et non sur la valeur des personnes.
 * Ces textes restent côté front : ne pas les envoyer au backend ni les logger avec des données utilisateur.
 */
import type { P1TensionBand } from '@/types/p1Meta';

export interface P1BlockNarrativeBand {
  summary: string;
  interpretation: string;
}

export const P1_BLOCK_B1_TENSION_NARRATIVES: Record<P1TensionBand, P1BlockNarrativeBand> = {
  very_low: {
    summary:
      'Sur le climat, tu décris un environnement qui paraît plutôt serein et soutenant au quotidien.',
    interpretation:
      'Les repères relationnels semblent tenir, ce qui peut t’aider à aborder des sujets plus sensibles sans trop de coût immédiat.'
  },
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
  very_low: {
    summary:
      'Sur les règles et les décisions, tu décris un cadre qui paraît clair, lisible et plutôt fiable.',
    interpretation:
      'Ce niveau de lisibilité peut servir de point d’appui pour traiter d’autres sujets plus sensibles sans trop d’incertitude procédurale.'
  },
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

// Narratives par sous-thème pour B1 – Climat & ressenti
// Niveau agrégé uniquement : ne pas logger ni envoyer ces textes avec des données utilisateur.
export const P1_BLOCK_B1_THEME_NARRATIVES = {
  securite_psy: {
    very_low: {
      summary: 'Tu perçois un climat où prendre la parole semble globalement sûr et soutenant.',
      interpretation:
        'Les repères relationnels et la confiance paraissent solides : c’est un appui pour aborder des sujets sensibles si besoin.'
    },
    low: {
      summary: 'Tu indiques que l’expression est plutôt possible, avec quelques limites ponctuelles.',
      interpretation:
        'La parole peut circuler sans gros risque, même si tu sens parfois qu’il faut choisir les moments et les personnes.'
    },
    medium: {
      summary:
        'Tu indiques que parler franchement n’est pas toujours simple, mais que ce n’est pas systématiquement risqué non plus.',
      interpretation:
        'Une partie des sujets peut être abordée, mais avec des précautions : il faut choisir les bons moments, les bonnes personnes, et doser ce que tu dis. La parole n’est pas complètement verrouillée, mais elle reste suffisamment sensible pour que tu réfléchisses avant d’ouvrir certains dossiers.'
    },
    high: {
      summary:
        'Tu décris un climat où prendre la parole sur les vrais problèmes te met régulièrement mal à l’aise.',
      interpretation:
        'Parler de ce qui te semble important implique souvent un coût : être mal perçu·e, déclencher des tensions, ou passer pour “celui/celle qui dérange”. Du coup, tu dois en permanence arbitrer entre te protéger et dire ce que tu vois, ce qui est très énergivore.'
    },
    very_high: {
      summary:
        'Tu décris un environnement où exprimer ce que tu vois ou ressens peut réellement paraître dangereux pour toi.',
      interpretation:
        'Tu es amené·e à taire des choses essentielles par peur des conséquences : mise à l’écart, conflit frontal, rétorsions directes ou indirectes. Ton système de protection personnelle tourne en permanence à plein régime, ce qui laisse très peu de place à une parole authentique et sereine.'
    }
  },
  non_dits: {
    very_low: {
      summary: 'Tu vois peu de non-dits structurants pour le moment.',
      interpretation:
        'Les sujets importants semblent pouvoir être abordés sans trop d’évitement, ce qui maintient la clarté collective.'
    },
    low: {
      summary: 'Tu signales que les non-dits restent limités et ponctuels.',
      interpretation:
        'Il peut arriver que certains sujets soient mis de côté, mais ce n’est pas un mode de fonctionnement dominant.'
    },
    medium: {
      summary:
        'Tu signales que certains sujets ont tendance à être contournés ou repoussés, sans que ce soit permanent.',
      interpretation:
        'Il y a des domaines où “tout ne se dit pas”, mais cela reste encore ponctuel : on choisit parfois la facilité de l’évitement plutôt que la confrontation. Cela crée déjà des flous et des malentendus, sans que tout le climat en soit entièrement structuré.'
    },
    high: {
      summary:
        'Tu décris une structure où beaucoup de choses importantes ne sont pas vraiment mises sur la table.',
      interpretation:
        'Des questions clés restent en suspens, sont traitées dans les couloirs ou ne sont abordées qu’à moitié. Petit à petit, un écart se creuse entre ce qui se vit et ce qui se dit officiellement, et tu te retrouves à naviguer dans ce fossé.'
    },
    very_high: {
      summary:
        'Tu montres que les non-dits occupent une place centrale dans le fonctionnement de ta structure.',
      interpretation:
        'Une bonne partie de ce qui se joue passe par des conversations informelles, des alliances silencieuses, des tabous implicites. Le message réel n’est presque jamais dans les réunions ou les documents, mais dans ce qui reste justement tu. C’est extrêmement fatigant à décoder au quotidien.'
    }
  },
  conflits: {
    very_low: {
      summary: 'Tu perçois peu de conflits ouverts ou latents pour le moment.',
      interpretation:
        'Les désaccords semblent traités avec un minimum de cadre, ce qui garde l’ambiance respirable.'
    },
    low: {
      summary: 'Les conflits existent mais paraissent généralement gérables.',
      interpretation:
        'Il y a des tensions, mais elles peuvent souvent être travaillées sans débordement majeur.'
    },
    medium: {
      summary:
        'Tu indiques que les conflits existent, mais qu’ils sont encore parfois traités de manière à peu près correcte.',
      interpretation:
        'Certains désaccords trouvent une issue, mais d’autres restent en suspens ou se règlent mal. Tu dois composer avec des tensions récurrentes qui ne dégénèrent pas systématiquement, mais qui laissent des traces.'
    },
    high: {
      summary:
        'Tu décris une situation où les conflits sont fréquents ou mal gérés, et où cela pèse sur l’ambiance.',
      interpretation:
        'Les désaccords s’enveniment, traînent en longueur ou reviennent régulièrement sous d’autres formes. Tu peux avoir la sensation qu’aucun espace n’est vraiment prévu pour travailler ces conflits sans que quelqu’un y laisse des plumes.'
    },
    very_high: {
      summary:
        'Tu montres un climat où les conflits prennent une place majeure, ouverte ou larvée.',
      interpretation:
        'Les tensions sont soit explosives (éclats, affrontements), soit tellement étouffées qu’elles saturent l’atmosphère. Chaque interaction sensible devient potentiellement un champ de mines, ce qui rend très difficile le fait de construire quoi que ce soit dans la durée.'
    }
  },
  charge_fatigue: {
    very_low: {
      summary: 'Tu ne perçois pas de surcharge marquée en ce moment.',
      interpretation:
        'Le niveau de charge paraît soutenable, ce qui peut servir d’appui pour absorber des aléas sans t’épuiser.'
    },
    low: {
      summary: 'La charge semble plutôt tenable, avec quelques pics acceptables.',
      interpretation:
        'Tu peux avancer sans sensation de débordement constant, même si des périodes plus intenses existent.'
    },
    medium: {
      summary: 'Tu signales une charge importante, mais encore à peu près tenable.',
      interpretation:
        'Tu arrives globalement à tenir, au prix d’une énergie soutenue et de quelques renoncements personnels. La fatigue s’accumule, sans être encore au point de rupture, mais tu sens bien que ce rythme n’est pas durable indéfiniment.'
    },
    high: {
      summary: 'Tu décris une fatigue qui commence clairement à te dépasser.',
      interpretation:
        'Tu as le sentiment de courir après tout, de rarement pouvoir te poser, et de fonctionner en mode “pompière / pompier du quotidien”. Tu continues à assurer, mais au prix de ton propre équilibre, avec le risque de craquer ou de décrocher brutalement à un moment.'
    },
    very_high: {
      summary: 'Tu montres une fatigue proche du point de rupture.',
      interpretation:
        'Tu donnes beaucoup plus que ce que ton système peut encaisser à long terme : charge mentale, tensions, manque de récupération. On est moins sur un “coup de fatigue” ponctuel que sur une usure profonde, qui peut déboucher sur un arrêt, une démission ou une coupure nette si rien ne change.'
    }
  },
  sens_alignement: {
    very_low: {
      summary: 'Tu ressens une cohérence forte entre ce que tu fais et ce que tu voudrais porter.',
      interpretation:
        'Les choix du quotidien et tes valeurs semblent alignés, ce qui donne de la stabilité au sens que tu trouves.'
    },
    low: {
      summary: 'Tu perçois un sens globalement présent, avec quelques divergences mineures.',
      interpretation:
        'La trajectoire reste en grande partie cohérente avec ce à quoi tu tiens, même si certains sujets accrochent un peu.'
    },
    medium: {
      summary:
        'Tu indiques que le sens reste présent, mais parfois brouillé ou inégal selon les sujets.',
      interpretation:
        'Certains projets te parlent vraiment, d’autres beaucoup moins. Tu fais des compromis qui restent supportables, mais tu sens déjà des frottements entre ce que tu aimerais défendre et ce qui se passe réellement.'
    },
    high: {
      summary:
        'Tu décris un écart important entre ce en quoi tu crois et ce que la structure met réellement en œuvre.',
      interpretation:
        'Tu peux avoir l’impression de trahir certaines de tes valeurs, ou de participer à quelque chose qui ne correspond plus à ce que tu voulais au départ. Cet écart grignote progressivement ta motivation et ton envie de t’impliquer.'
    },
    very_high: {
      summary:
        'Tu montres un sentiment de désalignement profond avec la trajectoire actuelle de la structure.',
      interpretation:
        'Tu continues peut-être à tenir ta place, mais tu as de plus en plus de mal à te reconnaître dans ce qui est décidé, porté, valorisé. La question “Qu’est-ce que je fais encore là ?” n’est sans doute pas très loin, même si tu ne l’énonces pas encore ouvertement.'
    }
  },
  justice: {
    very_low: {
      summary: 'Tu perçois des décisions et règles globalement équitables.',
      interpretation:
        'La répartition des charges et des décisions paraît plutôt juste, ce qui soutient la confiance dans la structure.'
    },
    low: {
      summary: 'L’équité te semble plutôt présente, malgré quelques exceptions.',
      interpretation:
        'La plupart des situations paraissent traitées de façon juste, même si tu notes parfois des variations.'
    },
    medium: {
      summary: 'Tu signales des perceptions d’injustice, mais pas partout ni tout le temps.',
      interpretation:
        'Certains arbitrages te paraissent discutables, certaines personnes semblent mieux traitées que d’autres, sans que ce soit constant. Cela crée une légère défiance, mais il existe encore des situations vécues comme justes.'
    },
    high: {
      summary:
        'Tu décris une structure où la répartition des charges, des décisions ou de la reconnaissance te paraît souvent injuste.',
      interpretation:
        'Tu peux voir des personnes sur-sollicitées et d’autres largement épargnées, des efforts peu reconnus, des décisions qui tombent sans explication. À force, tu peux avoir le sentiment que “les règles ne sont pas les mêmes pour tout le monde”.'
    },
    very_high: {
      summary: 'Tu montres un sentiment d’injustice systémique.',
      interpretation:
        'Tu perçois une cohérence dans le fait que certains sont régulièrement protégés, entendus, valorisés, pendant que d’autres encaissent les décisions ou les surcharges. Ce ressenti abîme durablement la confiance et peut mener à du retrait, de la colère ou au désir de quitter la structure.'
    }
  },
  reconnaissance: {
    very_low: {
      summary: 'Tu te sens globalement reconnu·e pour ce que tu apportes.',
      interpretation:
        'La contribution paraît visible et nommée, ce qui nourrit la motivation et la confiance.'
    },
    low: {
      summary: 'La reconnaissance semble présente, avec quelques angles morts limités.',
      interpretation:
        'Tu reçois des signes de reconnaissance, même si certains efforts passent encore un peu sous le radar.'
    },
    medium: {
      summary:
        'Tu indiques que ta contribution est reconnue sur certains aspects, mais avec des angles morts.',
      interpretation:
        'Tu reçois parfois des signes de reconnaissance, mais une partie importante de ton travail ou de ton engagement passe inaperçue. Cela ne casse pas tout, mais ça laisse un arrière-goût de “je pourrais disparaître sur certains sujets, personne ne le verrait vraiment”.'
    },
    high: {
      summary: 'Tu décris une reconnaissance largement en décalage avec ce que tu donnes.',
      interpretation:
        'Tu as le sentiment de tenir des choses cruciales sans que ce soit vraiment vu ni nommé. À la longue, cela peut t’amener soit à faire le strict minimum, soit à continuer à t’épuiser en espérant une reconnaissance qui ne vient pas.'
    },
    very_high: {
      summary:
        'Tu montres une situation où tu te sens presque invisible malgré une forte implication.',
      interpretation:
        'La structure semble compter sur toi sans te reconnaître comme une personne qui a des limites, des besoins, des compétences à respecter. Ce niveau de décalage nourrit un profond découragement et peut déclencher, un jour, une rupture nette.'
    }
  },
  isolement: {
    very_low: {
      summary: 'Tu ne ressens pas ou peu de solitude sur tes sujets clés.',
      interpretation:
        'Tu peux t’appuyer sur d’autres personnes, ce qui réduit le risque d’isolement.'
    },
    low: {
      summary: 'Tu te sens plutôt accompagné·e, avec quelques moments de solitude ponctuels.',
      interpretation:
        'La plupart du temps, tu as des appuis pour avancer, même si certains sujets restent portés plus seul·e.'
    },
    medium: {
      summary: 'Tu signales que tu te sens parfois seul·e sur certains sujets, mais pas en permanence.',
      interpretation:
        'Il y a des moments où tu peux t’appuyer sur d’autres, et d’autres où tu as l’impression de porter un sujet ou une responsabilité presque en solo. Cela crée des phases de solitude qui restent supportables, mais qui peuvent déjà entamer ta confiance.'
    },
    high: {
      summary: 'Tu décris un sentiment fréquent d’isolement dans ce que tu vois ou portes.',
      interpretation:
        'Tu te retrouves souvent en première ligne, sans alliés clairs, ou avec la sensation que personne n’a vraiment la même lecture de la situation. Ce sentiment de solitude rend beaucoup plus lourd chaque choix et chaque prise de parole.'
    },
    very_high: {
      summary: 'Tu montres une solitude quasi constante sur des sujets importants.',
      interpretation:
        'Tu peux avoir l’impression d’être “la seule personne lucide” sur certains points, ou la seule à tenir des choses essentielles. Ce niveau d’isolement est un facteur fort de décrochage ou de départ, parce qu’il devient très difficile de continuer à se battre seul·e.'
    }
  },
  previsibilite_quotidien: {
    very_low: {
      summary: 'Le quotidien te semble largement prévisible et cadré.',
      interpretation:
        'Tu sais à quoi t’attendre la plupart du temps, ce qui réduit le stress et facilite l’organisation.'
    },
    low: {
      summary: 'Le quotidien paraît plutôt anticipable, avec quelques aléas gérables.',
      interpretation:
        'Il existe des imprévus, mais ils restent contenus et ne bousculent pas tout le fonctionnement.'
    },
    medium: {
      summary:
        'Tu indiques que le quotidien est parfois imprévisible, mais qu’il existe encore des repères.',
      interpretation:
        'Certaines journées ressemblent à ce qui était prévu, d’autres basculent en mode imprévu total. Tu composes avec des surprises régulières, sans que tout soit en permanence hors de contrôle.'
    },
    high: {
      summary: 'Tu décris un quotidien souvent difficile à anticiper.',
      interpretation:
        'Les changements de priorités, les urgences et les imprévus sont fréquents, ce qui complique l’organisation de ton temps et de ton énergie. Tu passes une bonne partie de ton temps à t’adapter, plutôt qu’à avancer sur ce que tu avais prévu.'
    },
    very_high: {
      summary:
        'Tu montres un fonctionnement où le quotidien est presque entièrement dicté par l’imprévu.',
      interpretation:
        'Tes plans sont régulièrement balayés, les urgences s’enchaînent, et il est très difficile pour toi de construire quelque chose dans la durée. Ce niveau d’instabilité est un facteur majeur de fatigue et de perte de sens.'
    }
  },
  ambiance_globale: {
    very_low: {
      summary: 'L’ambiance générale paraît sereine et soutenante.',
      interpretation:
        'Les relations semblent fluides, ce qui crée un climat propice pour aborder des sujets délicats au besoin.'
    },
    low: {
      summary: 'L’ambiance te semble plutôt bonne, avec des tensions ponctuelles.',
      interpretation:
        'Il peut y avoir quelques accrocs, mais le climat global reste plutôt léger et constructif.'
    },
    medium: {
      summary:
        'Tu indiques une ambiance globalement contrastée : ni catastrophique, ni sereine.',
      interpretation:
        'Il y a des moments où “ça tient”, avec des collaborations qui fonctionnent, et d’autres où la lassitude et la tension reprennent le dessus. Tu vis dans un climat en dents de scie, qui demande déjà une bonne capacité d’adaptation.'
    },
    high: {
      summary: 'Tu décris une ambiance qui, la plupart du temps, tire plutôt vers la lourdeur.',
      interpretation:
        'Les tensions, les fatigues et les incompréhensions sont souvent présentes en arrière-plan, même quand tout le monde “fait comme si de rien n’était”. On peut continuer à avancer, mais rarement avec légèreté ou enthousiasme.'
    },
    very_high: {
      summary:
        'Tu montres une ambiance globalement pesante, parfois proche du “on tient parce qu’on n’a pas le choix”.',
      interpretation:
        'Les tensions accumulées, les non-dits, les injustices perçues et la fatigue créent un climat où peu de personnes semblent vraiment bien. Dans ce contexte, rester implique un coût personnel important, et il devient logique de te poser la question de ce que tu acceptes encore… ou plus.'
    }
  }
} as const;

// Narratives par sous-thème pour B3 – Règles & décisions
// Niveau agrégé (sous-thème), jamais question par question. Front-only : ne pas logger ni envoyer au backend.
export const P1_BLOCK_B3_THEME_NARRATIVES = {
  roles_decisionnels: {
    very_low: {
      summary: 'Les rôles décisionnels te semblent clairs et stables.',
      interpretation:
        'Tu vois qui décide de quoi, ce qui réduit les zones grises et soutient la confiance dans les décisions.'
    },
    low: {
      summary: 'Les rôles décisionnels paraissent globalement identifiés, avec peu de flou.',
      interpretation:
        'La plupart des décisions ont un pilote clair, même si quelques cas restent à préciser.'
    },
    medium: {
      summary:
        'Tu montres que les rôles décisionnels sont à peu près identifiés, mais avec des zones grises.',
      interpretation:
        'Globalement, tu vois à peu près qui décide de quoi, mais certains périmètres restent flous ou se chevauchent. Cela crée des moments où tu dois deviner qui est vraiment aux commandes, ou constater que plusieurs personnes se marchent dessus sans que ce soit clarifié.'
    },
    high: {
      summary:
        'Tu décris une structure où les rôles décisionnels sont souvent flous ou contestés.',
      interpretation:
        'Dans de nombreuses situations, il n’est pas clair qui a réellement la main pour trancher, ou cette main est remise en question. Tu peux te retrouver à subir des décisions venues “d’en haut” sans que le rôle de chacun soit explicite, ou à voir des décisions prises par des personnes qui ne sont pas censées en avoir la légitimité.'
    },
    very_high: {
      summary:
        'Tu montres un système où la question “qui décide ici ?” est presque toujours problématique.',
      interpretation:
        'Les rôles décisionnels semblent soit concentrés de manière opaque, soit distribués de façon arbitraire, soit totalement absents. Tu peux avoir la sensation que les règles officielles sur “qui décide” et la réalité effective n’ont plus grand-chose à voir, ce qui mine profondément la confiance dans la structure.'
    }
  },
  coulisses: {
    very_low: {
      summary: 'Tu perçois peu ou pas de décisions prises en coulisses.',
      interpretation:
        'Les arbitrages semblent se faire dans les espaces prévus, ce qui renforce la lisibilité collective.'
    },
    low: {
      summary: 'Les coulisses paraissent limitées et ponctuelles.',
      interpretation:
        'La plupart des décisions suivent un circuit visible, même si quelques cas peuvent se traiter ailleurs.'
    },
    medium: {
      summary:
        'Tu indiques que certaines décisions passent par des coulisses, mais pas toutes.',
      interpretation:
        'Il arrive que des arbitrages se fassent hors des espaces prévus, puis soient officialisés après coup. Ce n’est pas systématique, mais suffisamment présent pour que tu doives parfois deviner où se prennent vraiment les décisions.'
    },
    high: {
      summary:
        'Tu décris un fonctionnement où beaucoup de décisions importantes semblent prises “en coulisses”.',
      interpretation:
        'Des décisions arrivent déjà ficelées, sans que tu voies vraiment le processus ni qui a pesé. La transparence devient variable : certaines choses sont discutées, d’autres semblent décidées ailleurs puis entérinées. Cela nourrit le sentiment que le vrai pouvoir circule hors des instances visibles.'
    },
    very_high: {
      summary:
        'Tu montres un système où les coulisses semblent être l’endroit principal des décisions.',
      interpretation:
        'Les décisions clés paraissent se jouer dans des cercles restreints, hors du regard collectif, puis sont simplement annoncées. Cette opacité rend la gouvernance difficilement prévisible et peut donner l’impression que les instances officielles servent surtout à valider a posteriori.'
    }
  },
  regles_ecrites: {
    very_low: {
      summary: 'Les règles écrites te semblent claires et accessibles.',
      interpretation:
        'Tu sais où trouver les repères formels, ce qui limite les incertitudes sur le cadre.'
    },
    low: {
      summary: 'Les règles écrites existent et sont globalement consultables.',
      interpretation:
        'Il reste peut-être quelques trous, mais l’essentiel du cadre est documenté et utilisable.'
    },
    medium: {
      summary:
        'Tu indiques que des règles écrites existent, mais qu’elles ne couvrent pas tout ou ne sont pas toujours accessibles.',
      interpretation:
        'Certaines règles sont documentées, d’autres restent implicites ou dispersées. Tu dois parfois chercher ou demander pour savoir “comment ça se passe”, ce qui crée déjà des écarts entre la théorie et la pratique.'
    },
    high: {
      summary:
        'Tu décris une situation où les règles importantes sont peu écrites ou peu consultables.',
      interpretation:
        'Les repères formels manquent ou sont peu utilisés. Les personnes se fient beaucoup au bouche-à-oreille ou aux habitudes, ce qui rend l’application des règles très variable selon les contextes et les personnes.'
    },
    very_high: {
      summary:
        'Tu montres un fonctionnement où les règles écrites sont quasi absentes ou largement déconnectées de la réalité.',
      interpretation:
        'Il est difficile de savoir sur quoi se baser pour décider ou contester : soit rien n’est écrit, soit ce qui est écrit ne correspond plus à ce qui se passe. Dans ce contexte, la “règle” dépend surtout de qui est présent et de son influence.'
    }
  },
  equite_regles: {
    very_low: {
      summary: 'Tu perçois une application des règles plutôt équitable.',
      interpretation:
        'Les décisions semblent suivre des critères communs, ce qui renforce le sentiment de justice.'
    },
    low: {
      summary: 'L’équité des règles paraît globalement respectée, avec quelques exceptions.',
      interpretation:
        'La plupart du temps, les règles s’appliquent de manière cohérente, même si quelques cas dévient.'
    },
    medium: {
      summary:
        'Tu signales que les règles ne s’appliquent pas toujours de la même manière, mais que ce n’est pas permanent.',
      interpretation:
        'Certaines situations sont traitées avec plus d’indulgence ou de sévérité selon les personnes ou les moments. Cela crée déjà une perception d’inégalité, sans être totalement systémique.'
    },
    high: {
      summary:
        'Tu décris une structure où l’application des règles paraît souvent inégale.',
      interpretation:
        'Selon les personnes ou les contextes, les mêmes règles peuvent être strictement appliquées ou largement contournées. Cela renforce le sentiment que “tout dépend de qui tu es face à toi”, ce qui érode la confiance dans la justice interne.'
    },
    very_high: {
      summary:
        'Tu montres un système où l’équité des règles semble très faible.',
      interpretation:
        'Les règles servent parfois d’arguments à géométrie variable : on les invoque ou on les oublie selon les intérêts. À ce niveau, la règle devient moins un repère partagé qu’un levier de pouvoir, ce qui fragilise fortement le collectif.'
    }
  },
  participation: {
    very_low: {
      summary: 'La participation aux décisions te semble bien distribuée et lisible.',
      interpretation:
        'Les personnes concernées paraissent pouvoir contribuer, ce qui soutient l’adhésion.'
    },
    low: {
      summary: 'La participation paraît plutôt ouverte, avec quelques limites ponctuelles.',
      interpretation:
        'Globalement, les décisions incluent les personnes concernées, même si certains sujets passent plus vite.'
    },
    medium: {
      summary:
        'Tu indiques que la participation aux décisions existe, mais de manière inégale selon les sujets.',
      interpretation:
        'Sur certains dossiers, tu peux contribuer ou poser des questions ; sur d’autres, tu découvres les décisions une fois actées. La légitimité de qui participe n’est pas toujours claire, ce qui crée des zones d’ombre.'
    },
    high: {
      summary:
        'Tu décris une situation où beaucoup de décisions se prennent sans réelle participation des personnes concernées.',
      interpretation:
        'Des décisions à fort impact sont prises par un petit noyau, avec peu ou pas de consultation en amont. Les espaces de participation ressemblent parfois plus à de la validation formelle qu’à un véritable partage de pouvoir.'
    },
    very_high: {
      summary:
        'Tu montres un système où les décisions importantes échappent largement aux personnes qui les vivent.',
      interpretation:
        'Les occasions de peser réellement sont rares ou peu influentes. Tu peux te sentir réduit·e à exécuter des choix déjà verrouillés, même quand ton expertise de terrain serait cruciale pour décider.'
    }
  },
  desaccord: {
    very_low: {
      summary: 'Le désaccord semble pouvoir s’exprimer sans gros risque.',
      interpretation:
        'Les discussions peuvent intégrer des points de vue divergents sans basculer en conflit.'
    },
    low: {
      summary: 'Tu perçois une certaine ouverture au désaccord, avec quelques tensions ponctuelles.',
      interpretation:
        'Les divergences peuvent être exprimées, même si certains sujets restent plus sensibles.'
    },
    medium: {
      summary:
        'Tu signales que les désaccords existent mais restent encore gérables.',
      interpretation:
        'Les divergences peuvent être abordées, même si ce n’est pas toujours confortable. Cependant, certains désaccords sont évités ou mal accompagnés, laissant des tensions en arrière-plan.'
    },
    high: {
      summary:
        'Tu décris une structure où les désaccords sont souvent mal accueillis ou mal traités.',
      interpretation:
        'Exprimer un désaccord peut vite te mettre en difficulté : étiquette “négatif·ve”, conflit latent, ou simple ignorance. Les tensions s’accumulent plutôt que de permettre des ajustements.'
    },
    very_high: {
      summary:
        'Tu montres un climat où le désaccord est quasiment assimilé à une faute.',
      interpretation:
        'Remettre en question une décision comporte un risque fort (mise à l’écart, disqualification). Les décisions semblent appliquées, mais l’adhésion est faible : on obéit par contrainte plus que par conviction.'
    }
  },
  suivi_decisions: {
    very_low: {
      summary: 'Les décisions semblent suivies d’effet de manière régulière.',
      interpretation:
        'Tu vois un lien clair entre ce qui est décidé et ce qui est réalisé, ce qui renforce la confiance.'
    },
    low: {
      summary: 'Le suivi des décisions paraît globalement correct, avec quelques loupés.',
      interpretation:
        'La plupart des décisions avancent, même si certaines traînent ou se perdent occasionnellement.'
    },
    medium: {
      summary:
        'Tu indiques que certaines décisions sont suivies d’effet, mais que d’autres se perdent en route.',
      interpretation:
        'Certaines décisions avancent, d’autres restent au stade d’annonce ou se diluent. Cela crée un doute récurrent sur ce qui sera vraiment mis en œuvre par rapport à ce qui est décidé.'
    },
    high: {
      summary:
        'Tu décris un fonctionnement où beaucoup de décisions ne sont pas vraiment suivies.',
      interpretation:
        'Les décisions sont prises et annoncées, mais leur mise en œuvre patine, change de forme ou n’est pas priorisée. Tu peux avoir l’impression que les réunions produisent surtout des résolutions sans impact.'
    },
    very_high: {
      summary:
        'Tu montres un système où le fossé entre décisions annoncées et réalités vécues est la norme.',
      interpretation:
        'Les décisions semblent surtout produire un récit, sans garantie d’exécution. Chaque nouvelle annonce peut être reçue avec scepticisme ou lassitude, faute de lien fiable avec le terrain.'
    }
  },
  changements_regles: {
    very_low: {
      summary: 'Les règles changent peu et sont généralement expliquées.',
      interpretation:
        'Le cadre paraît stable et lisible, ce qui limite les surprises et facilite l’adhésion.'
    },
    low: {
      summary: 'Les changements de règles restent rares ou bien accompagnés.',
      interpretation:
        'Quand il y a des ajustements, ils semblent annoncés et expliqués, avec un minimum de cadre.'
    },
    medium: {
      summary:
        'Tu indiques que les règles changent parfois sans être toujours bien expliquées.',
      interpretation:
        'Il arrive que des ajustements soient faits sans grande communication, ce qui crée déjà du flou, mais reste ponctuel.'
    },
    high: {
      summary:
        'Tu décris un fonctionnement où les règles ou façons de décider changent souvent sans explication claire.',
      interpretation:
        'Les repères se déplacent régulièrement : nouvelles règles, nouvelles priorités, nouveaux formats, avec peu d’accompagnement. Cela rend la gouvernance difficile à suivre et fragilise la confiance.'
    },
    very_high: {
      summary:
        'Tu montres un système où les règles semblent changer au gré des circonstances ou des personnes.',
      interpretation:
        'Les modifications sont fréquentes, peu documentées, parfois rétroactives. On peut avoir le sentiment que la règle du jeu n’est jamais stable, ce qui rend toute projection très incertaine.'
    }
  },
  responsabilite: {
    very_low: {
      summary: 'La responsabilité des décisions paraît clairement assumée.',
      interpretation:
        'Tu vois qui porte les choix et leurs conséquences, ce qui sécurise la gouvernance.'
    },
    low: {
      summary: 'La responsabilité est globalement identifiée, avec quelques zones floues.',
      interpretation:
        'La plupart du temps, les personnes assument leurs décisions, même si certains cas restent moins clairs.'
    },
    medium: {
      summary:
        'Tu signales que la responsabilité est parfois assumée, parfois diluée.',
      interpretation:
        'Dans certains cas, les personnes reconnaissent leurs choix. Dans d’autres, la responsabilité se perd dans un “nous” flou. Cela crée déjà un fond de flou sur qui porte vraiment les conséquences.'
    },
    high: {
      summary:
        'Tu décris un environnement où la responsabilité est souvent esquivée ou déplacée.',
      interpretation:
        'Face aux problèmes, tu observes des renvois de balle ou des justifications. Peu de personnes assument clairement leurs décisions, ce qui rend difficile le suivi et la correction des choix.'
    },
    very_high: {
      summary:
        'Tu montres un système où la responsabilité réelle des décisions est presque introuvable.',
      interpretation:
        'Les décisions se dissolvent dans des collectifs flous ou des niveaux hiérarchiques éloignés. Quand quelque chose tourne mal, la responsabilité semble toujours attribuée ailleurs, ce qui nourrit l’injustice et le cynisme.'
    }
  },
  recours: {
    very_low: {
      summary: 'Des recours lisibles semblent exister pour contester une décision.',
      interpretation:
        'Tu sais à qui t’adresser en cas de désaccord, ce qui réduit le sentiment d’impuissance.'
    },
    low: {
      summary: 'Les voies de recours paraissent présentes, avec quelques trous dans la raquette.',
      interpretation:
        'Tu as des options pour signaler un problème, même si certains sujets restent moins couverts.'
    },
    medium: {
      summary:
        'Tu indiques qu’il existe des recours sur certaines décisions, mais que ce n’est pas systématique.',
      interpretation:
        'Sur certains sujets, tu sais à qui t’adresser pour contester ; sur d’autres, le chemin est flou ou inexistant. Cela crée déjà un doute sur la capacité à corriger une décision perçue comme injuste.'
    },
    high: {
      summary:
        'Tu décris une structure où contester une décision est souvent compliqué ou risqué.',
      interpretation:
        'Les espaces de recours sont peu clairs, peu efficaces ou chargés de risques relationnels. Tu peux hésiter avant de signaler un problème, faute de voie de recours fiable.'
    },
    very_high: {
      summary:
        'Tu montres un système où il n’y a quasiment pas de recours effectif.',
      interpretation:
        'Les décisions semblent définitives, même quand elles posent problème. Signaler une injustice peut paraître vain ou dangereux, ce qui enferme dans un sentiment d’impuissance.'
    }
  },
  entorses_regles: {
    very_low: {
      summary: 'Les entorses paraissent rares et exceptionnelles.',
      interpretation:
        'Le cadre est généralement respecté, ce qui soutient la cohérence collective.'
    },
    low: {
      summary: 'Les écarts aux règles existent mais restent marginaux.',
      interpretation:
        'Il arrive que certaines règles soient adaptées, mais sans devenir une habitude.'
    },
    medium: {
      summary:
        'Tu signales des entorses aux règles qui restent encore ponctuelles.',
      interpretation:
        'Il arrive que certaines règles soient contournées “pour aller plus vite” ou par habitude, sans que ce soit systématique. Cela crée déjà des précédents qui fragilisent la cohérence globale.'
    },
    high: {
      summary:
        'Tu décris une situation où les entorses deviennent fréquentes.',
      interpretation:
        'De plus en plus de règles sont pliées ou ignorées, ce qui rend difficile de savoir ce qui est vraiment valable. La norme devient floue, et l’arbitraire gagne du terrain.'
    },
    very_high: {
      summary:
        'Tu montres un fonctionnement où les entorses sont presque la règle.',
      interpretation:
        'Les exceptions permanentes rendent le cadre largement illisible. Chacun interprète les règles selon sa position, ce qui augmente fortement les injustices et les tensions.'
    }
  },
  opacite: {
    very_low: {
      summary: 'Les décisions te semblent prises de manière très transparente.',
      interpretation:
        'Le “qui décide quoi et comment” paraît clair, ce qui favorise la confiance.'
    },
    low: {
      summary: 'La transparence décisionnelle paraît plutôt bonne, avec quelques zones grises.',
      interpretation:
        'La plupart des décisions sont expliquées, même si certains sujets restent moins détaillés.'
    },
    medium: {
      summary:
        'Tu indiques que certaines décisions manquent de transparence, mais pas toutes.',
      interpretation:
        'Il existe encore des décisions expliquées correctement, mais d’autres arrivent sans contexte. Cela oblige à lire entre les lignes pour comprendre ce qui se joue.'
    },
    high: {
      summary:
        'Tu décris un niveau d’opacité qui te laisse souvent dans le flou.',
      interpretation:
        'Les décisions tombent avec peu d’éléments sur le pourquoi, le comment, ou qui a décidé. Ce manque de transparence nourrit la défiance et complique l’adhésion.'
    },
    very_high: {
      summary:
        'Tu montres une opacité presque systémique sur les décisions.',
      interpretation:
        'Tu ne sais presque jamais qui décide ni sur quelle base. La gouvernance devient très difficile à lire, et il est compliqué de contester ou même de comprendre ce qui est attendu.'
    }
  }
} as const;

// Synthèse globale P1 – textes front-only pour le bilan global.
// Ne jamais logger avec des données utilisateur, ne jamais envoyer au backend.
export const P1_GLOBAL_ISSUES_COPY = {
  intro:
    'À partir de tes réponses, voici ce qui ressort le plus dans ta structure en ce moment. Ce ne sont pas des étiquettes sur toi ou sur les personnes, mais des zones où le fonctionnement actuel pèse particulièrement.',
  noStrongIssues:
    'D’après ce panorama, aucune zone ne ressort comme fortement sous tension. Il peut y avoir des irritations ponctuelles, mais rien qui ressemble à un blocage majeur. Tu peux t’en servir comme point de repère pour la suite, ou revenir plus tard si la situation évolue.',
  mainTitle: 'Ce qui pèse le plus en ce moment',
  secondaryTitle: 'Autres points à garder en tête'
} as const;

// Plan d’action P1 – microcopy front-only.
// Ne jamais logger ces textes avec des données utilisateur, ne jamais les envoyer au backend.
export const P1_ACTION_PLAN_COPY = {
  sectionTitle: 'Pistes d’action possibles',
  intro:
    'À partir de ce que tu as posé, voici quelques pistes concrètes pour commencer à agir. Ce ne sont pas des ordres ni un programme figé, mais des idées à adapter à ton contexte.',
  horizonLabels: {
    now: 'Maintenant (premiers pas)',
    soon: 'Bientôt (prochaines semaines)',
    later: 'Plus tard (chantiers plus lourds)'
  },
  empty:
    'Pour l’instant, aucune piste d’action claire ne ressort des réponses. Tu peux déjà t’appuyer sur le bilan pour observer ce qui se passe, et revenir plus tard si la situation évolue.',
  exportTitle: 'Exporter ce plan d’action',
  exportDescription:
    'Tu peux exporter ces pistes d’action au format texte pour les retravailler dans ton outil à toi (notes, pad partagé, document de travail…).',
  exportButtonLabel: 'Exporter en Markdown',
  exportDone:
    'Le plan d’action a été généré au format Markdown. Tu peux le copier et le coller dans ton espace de travail.'
} as const;

export const P1_GLOBAL_SUPPORTS_COPY = {
  mainTitle: 'Ce qui tient encore',
  intro:
    'Ces zones semblent relativement stables pour l’instant. Elles peuvent servir d’appuis pour sécuriser les sujets plus sensibles.'
} as const;
