# P1 – Panorama · Narratives (Talia)

Document de référence pour le câblage des textes de bilan Panorama (E2).

- Moteur : `useP1PanoramaNarrative.ts`
- Config : `p1PanoramaNarratives`, `p1PanoramaSuggestions`, `p1Copy.panorama.bilan`

---

## 1) Synthèse – « Ce que tu viens de poser »

> Intention : redire calmement ce que la personne vient de montrer, axe par axe, sans jugement.  
> 0–2 ≈ low, 2–3.5 ≈ medium, 3.5–5 ≈ high (indics internes, pas exposés tels quels).

| key                                      | axe          | bucket | Texte FR (max ~2 phrases) |
|------------------------------------------|-------------|--------|---------------------------|
| p1.panorama.human.low.summary            | humain      | low    | Sur l’axe humain, tu décris plutôt un climat soutenant, avec des tensions limitées ou ponctuelles. Les relations ne semblent pas être le principal point de friction aujourd’hui. |
| p1.panorama.human.medium.summary         | humain      | medium | Sur l’axe humain, tu signales des tensions récurrentes mais pas écrasantes. Le climat relationnel pèse par moments, sans prendre toute la place. |
| p1.panorama.human.high.summary           | humain      | high   | Sur l’axe humain, tu décris un climat lourd où les relations, la confiance et les non-dits pèsent fortement. Le vécu relationnel semble être au cœur de ce qui coince pour toi. |
| p1.panorama.governance.low.summary       | gouvernance | low    | Côté gouvernance, tu sembles avoir une lecture globalement claire de qui décide et comment les choses se tranchent. Les zones floues existent sans paraître centrales pour l’instant. |
| p1.panorama.governance.medium.summary    | gouvernance | medium | Côté gouvernance, tu pointes des zones de flou ou d’incohérence qui reviennent régulièrement. Les règles et les décisions ne sont ni catastrophiques ni pleinement confortables. |
| p1.panorama.governance.high.summary      | gouvernance | high   | Côté gouvernance, tu décris un fort sentiment de flou sur les règles et les décisions. Qui décide quoi, où et comment semble être une source majeure de tension. |
| p1.panorama.organization.low.summary     | organisation| low    | Sur l’organisation du quotidien, tu sembles percevoir un fonctionnement globalement lisible. Les imprévus existent mais sans donner l’impression de chaos permanent. |
| p1.panorama.organization.medium.summary  | organisation| medium | Sur l’organisation du quotidien, tu signales des couacs réguliers : priorités qui bougent, informations qui circulent mal, imprévus qui bousculent. Ce n’est pas “ingérable”, mais ça consomme de l’énergie. |
| p1.panorama.organization.high.summary    | organisation| high   | Sur l’organisation du quotidien, tu décris un fonctionnement très instable : priorités qui changent, manque de visibilité, surprises fréquentes. Le ressenti est proche du mode “impro permanente”. |
| p1.panorama.resources.low.summary        | ressources  | low    | Côté ressources (temps, énergie, moyens, outils), tu ne signales pas de surcharge massive. La structure semble tenir son rythme sans t’épuiser en continu. |
| p1.panorama.resources.medium.summary     | ressources  | medium | Côté ressources, tu décris une tension diffuse : charge parfois lourde, fatigue qui revient, dépendances à certains outils ou personnes. Ça tient, mais au prix d’efforts notables. |
| p1.panorama.resources.high.summary       | ressources  | high   | Côté ressources, tu pointes une forte saturation : charge élevée, mode pompier, dépendance à quelques personnes ou outils clés. La soutenabilité du système semble clairement en question. |

---

## 2) Interprétation – « Ce qu’on peut en comprendre »

> Intention : donner des pistes de lecture systémiques, sans verdict, en normalisant le fait que ces situations sont fréquentes dans les collectifs à impact.

| key                                            | axe          | bucket | Texte FR (max ~3 phrases) |
|-----------------------------------------------|-------------|--------|---------------------------|
| p1.panorama.human.low.interpretation          | humain      | low    | Quand l’axe humain apparaît plutôt apaisé, cela peut vouloir dire que les relations tiennent malgré les contraintes. Les tensions éventuelles se gèrent sans prendre toute la scène. Cela laisse de la place pour travailler d’abord sur d’autres dimensions du système. |
| p1.panorama.human.medium.interpretation       | humain      | medium | Un niveau intermédiaire sur l’axe humain signale souvent des collectifs qui “tiennent” mais s’usent : on coopère, mais avec des frottements récurrents. Il peut y avoir des non-dits ou des malentendus qui s’installent dans la durée. C’est un bon moment pour revisiter les espaces de parole et les règles de jeu. |
| p1.panorama.human.high.interpretation         | humain      | high   | Quand le score humain est élevé, c’est souvent le signe que les tensions relationnelles prennent le pas sur le reste : conflits, méfiance, fatigue émotionnelle. Ce n’est pas un échec individuel, c’est le système qui met beaucoup de pression sur les personnes. Travailler sur les règles du jeu et la redistribution de la charge peut aider à remettre du souffle. |
| p1.panorama.governance.low.interpretation     | gouvernance | low    | Un axe gouvernance peu tendu laisse entendre que les circuits de décision sont suffisamment lisibles pour toi. Il peut bien sûr rester des zones grises, mais elles ne semblent pas structurer ton malaise. Tu peux utiliser cette relative clarté comme appui pour traiter d’autres blocages. |
| p1.panorama.governance.medium.interpretation  | gouvernance | medium | Un niveau intermédiaire en gouvernance décrit souvent des structures où “ça fonctionne à peu près”, mais où les décisions sont parfois ressenties comme floues ou inégales. On navigue avec des règles partielles, mêlant formel et informel. Clarifier quelques rôles et circuits clés peut déjà changer beaucoup de choses. |
| p1.panorama.governance.high.interpretation    | gouvernance | high   | Un score élevé en gouvernance indique que le “qui décide quoi, où et comment” est vécu comme très confus ou injuste. Dans beaucoup de collectifs, cela se traduit par des contournements, des frustrations et une perte de confiance. Mettre à plat les rôles décisionnels et les règles appliquées en vrai devient alors un chantier central. |
| p1.panorama.organization.low.interpretation   | organisation| low    | Quand l’organisation du quotidien est peu en tension, cela signifie souvent que les routines tiennent et que les imprévus restent gérables. Le système n’est pas parfait, mais il ne t’empêche pas de te projeter. Tu peux t’appuyer sur cette stabilité relative pour travailler d’autres axes. |
| p1.panorama.organization.medium.interpretation| organisation| medium | Un niveau intermédiaire sur l’organisation décrit souvent des collectifs pris entre bonne volonté et manque de structuration : on avance, mais avec des accrocs réguliers. Les priorités, la circulation d’information ou la planification peuvent être sources de friction. Mettre un peu de cadre sans rigidifier peut déjà alléger beaucoup de monde. |
| p1.panorama.organization.high.interpretation  | organisation| high   | Un score élevé sur l’organisation signale un quotidien très chahuté : urgences, replanifications, décisions qui arrivent tard, manque de visibilité. Ce n’est pas forcément un défaut de personnes, mais souvent le signe d’un système qui n’a jamais été pensé pour durer. Clarifier les rythmes, les repères et les points de passage devient un enjeu majeur. |
| p1.panorama.resources.low.interpretation      | ressources  | low    | Quand l’axe ressources est peu tendu, cela peut indiquer que la charge, les moyens et les outils sont à peu près proportionnés aux ambitions actuelles. Il reste toujours des tensions, mais elles ne mettent pas tout le monde au bord de la rupture. Tu peux en profiter pour travailler la qualité du fonctionnement plutôt que la survie. |
| p1.panorama.resources.medium.interpretation   | ressources  | medium | Un niveau intermédiaire en ressources renvoie souvent à un équilibre fragile : ça passe, mais sans beaucoup de marge. Les personnes clés, le temps, les financements ou les outils sont sollicités au maximum. Se poser la question de ce qu’on maintient absolument, et de ce qu’on peut alléger, devient un levier important. |
| p1.panorama.resources.high.interpretation     | ressources  | high   | Un score élevé en ressources indique une structure en mode survie : surcharge, dépendances fortes, sentiment de ne jamais rattraper le flux. C’est fréquent dans les projets à impact qui veulent “tout tenir”. Nommer ces limites permet souvent de remettre du réalisme dans les ambitions et de sécuriser ce qui compte le plus. |

---

## 3) Suggestions – « Ce qu’on te propose d’explorer maintenant »

> Intention : formuler des invitations, pas des ordres.  
> Mapping indicatif :  
> - humain → Bloc 1 (Climat & ressenti)  
> - gouvernance → Bloc 3 (Règles & décisions)  
> - organisation → Bloc 2 (Mouvement & prévisibilité) et/ou Bloc 4 (Structure & robustesse)  
> - ressources → Bloc 2 et Bloc 4

| key                                         | axe          | blockId | intensity | Texte FR (max ~2 phrases) |
|---------------------------------------------|-------------|---------|-----------|---------------------------|
| p1.panorama.suggest.b1.human.medium         | humain      | b1      | medium    | Comme l’axe humain ressort déjà assez présent, le bloc 1 peut t’aider à mettre des mots plus précis sur le climat, les places de chacun·e et les non-dits. Si tu le souhaites, tu peux commencer par là pour mieux voir comment tu te situes dans la structure. |
| p1.panorama.suggest.b1.human.high           | humain      | b1      | high      | L’axe humain est particulièrement en tension dans tes réponses. Explorer le bloc 1 en premier peut t’aider à clarifier ce qui se joue dans les relations, la confiance et le sentiment de légitimité, sans désigner de coupables. |
| p1.panorama.suggest.b3.governance.medium    | gouvernance | b3      | medium    | Tu pointes déjà des flous sur les règles et les décisions, sans que tout soit bloqué. Le bloc 3 peut t’aider à voir plus finement où ça coince : qui décide, comment, et ce que ça produit au quotidien. À toi de voir si tu veux y passer maintenant ou plus tard. |
| p1.panorama.suggest.b3.governance.high      | gouvernance | b3      | high      | La gouvernance ressort comme un axe très sensible dans ton panorama. Le bloc 3 te propose de décortiquer les circuits de décision et la gestion du désaccord, pour transformer du “flou frustrant” en cartes plus lisibles. Tu peux choisir d’y aller en priorité si ça résonne. |
| p1.panorama.suggest.b2.organization.medium  | organisation| b2      | medium    | Tu décris un quotidien parfois chahuté mais pas complètement hors de contrôle. Le bloc 2 “Mouvement & prévisibilité” peut t’aider à voir comment les priorités, les changements et les projets s’imbriquent. Si tu veux mieux comprendre le tempo de ta structure, c’est un bon point de passage. |
| p1.panorama.suggest.b2.organization.high    | organisation| b2      | high      | L’organisation du quotidien semble très instable dans tes réponses. Le bloc 2 peut t’aider à cartographier le rythme, les urgences et la manière dont les décisions bousculent le terrain. Tu peux choisir d’y aller en premier pour sortir du ressenti de chaos. |
| p1.panorama.suggest.b4.organization.medium  | organisation| b4      | medium    | Au-delà du rythme, certaines réponses laissent penser que la structure elle-même manque peut-être de lisibilité. Le bloc 4 “Structure & robustesse” t’aidera à explorer l’organigramme réel, les dépendances et les plans B possibles. |
| p1.panorama.suggest.b4.organization.high    | organisation| b4      | high      | Tes réponses suggèrent que la structure telle qu’elle est conçue aujourd’hui pèse fortement sur le fonctionnement. Le bloc 4 peut t’aider à repérer où la maison tient sur quelques piliers fragiles, et où il serait utile de consolider. Tu peux le choisir en priorité si c’est là que tu veux mettre le focus. |
| p1.panorama.suggest.b2.resources.medium     | ressources  | b2      | medium    | La question des ressources apparaît sous tension, sans être encore au bord de la rupture. Le bloc 2 peut t’aider à voir comment le rythme des projets et des urgences consomme l’énergie disponible, et ce qui pourrait être ajusté. |
| p1.panorama.suggest.b2.resources.high       | ressources  | b2      | high      | Tu décris une forte saturation côté ressources, avec un ressenti proche du mode pompier. Le bloc 2 peut t’aider à comprendre comment le tempo et la façon de gérer les crises alimentent cette fatigue, et où se situent les leviers de régulation possibles. |
| p1.panorama.suggest.b4.resources.medium     | ressources  | b4      | medium    | Tes réponses montrent aussi des dépendances à certaines personnes ou outils, sans que tout repose sur un seul point de rupture. Le bloc 4 t’aidera à cartographier ces dépendances et à imaginer des plans de continuité raisonnables. |
| p1.panorama.suggest.b4.resources.high       | ressources  | b4      | high      | Quand les ressources sont très tendues, la question de la robustesse du système devient centrale. Le bloc 4 peut t’aider à repérer où la structure est trop dépendante de quelques personnes, outils ou financeurs, et ce qui mériterait d’être sécurisé en priorité. |

> Remarque : si d’autres combinaisons axis → blockId existent dans `p1PanoramaSuggestions`, on peut dupliquer cette logique de formulation en gardant le même ton : constat + invitation, jamais d’injonction.

---

## 4) Titres & microcopy de section (bilan Panorama)

Clés attendues dans `p1Copy.panorama.bilan` :

- `summaryTitle`  
- `interpretationTitle`  
- `nextStepsTitle`  
- éventuellement une phrase de garde-fou / rappel souveraineté.

### Propositions

- `p1Copy.panorama.bilan.summaryTitle`  
  > **Ce que tu viens de poser**

  Texte court éventuel sous le titre (optionnel, si besoin de sous-titre) :  
  > Un aperçu rapide des tensions que tu as signalées, axe par axe.

- `p1Copy.panorama.bilan.interpretationTitle`  
  > **Ce qu’on peut en comprendre**

  Sous-titre possible :  
  > Quelques pistes de lecture pour situer ta structure, sans verdict ni jugement.

- `p1Copy.panorama.bilan.nextStepsTitle`  
  > **Ce que tu peux explorer maintenant**

  Sous-titre possible :  
  > Des blocs d’atelier proposés en priorité, que tu es libre de suivre… ou pas.

- (option) `p1Copy.panorama.bilan.sovereigntyReminder`  
  > **Rappel souveraineté**  
  > Ce bilan est calculé sur cet appareil et n’est pas envoyé au serveur. Tu peux continuer, faire une pause ou tout effacer : c’est toi qui choisis.

---

## Commentaires Talia (notes internes)

- Garder l’affichage par blocs très lisible : idéalement une carte par axe avec la synthèse, puis la ou les interprétations juste en dessous, puis les suggestions.  
- Éviter d’afficher plus de deux suggestions à la fois pour ne pas recréer une sensation de surcharge.  
- Si plusieurs axes sont “high”, il peut être utile de préciser visuellement qu’il n’y a pas d’ordre imposé : “Tu peux commencer par le bloc qui te parle le plus”.  
- En cas de score “tout bas partout”, envisager un micro-texte spécifique pour normaliser : parfois, le ressenti de malaise vient d’ailleurs que de la structure (ou nécessite un autre parcours).
