---
id: PX_V1_3_1_P1_HYPOTHESES_STRUCTURANTES_COPY
version: 1.0.0
scope: P1
surface: global_bilan
tone: atterrissage_direct
rules:
  - front_only
  - no_raw_answers
  - no_network
  - no_tracking_fine
---

# P1 — Hypothèses structurantes (atterrissage + première vérif)

## H1 — mission_cash_arbitrage
title: "Mission ↔ cash : l’arbitrage n’est pas tenu"
body: >
  Quand la mission et le financement tirent dans des directions différentes, la structure se met à “tenir au jour le jour”.
  Les tensions humaines montent parce que personne ne sait quel critère gagne quand ça coince : impact, urgence, visibilité, budget.
  Résultat fréquent : décisions contestées, épuisement, et sentiment d’injustice.
firstCheck: >
  Où est écrit l’arbitrage officiel quand mission et cash se contredisent ?
  (1 page : critères, qui tranche, et comment on l’assume.)
triggers:
  - blockId: B1
    themeId: sens_alignement
    minBand: high
    confidence: [confirmed, clarified, protected, unclear]
    weight: 2
  - blockId: B1
    themeId: charge_fatigue
    minBand: high
    weight: 1
  - blockId: B3
    themeId: suivi_decisions
    minBand: medium
    weight: 1

## H2 — gouvernance_floue
title: "Gouvernance floue : qui décide quoi n’est pas clair"
body: >
  Ici, le problème n’est pas “les gens” : c’est l’absence de cadre stable.
  Quand les règles de décision sont grises, tout devient négociable — donc conflictuel.
  La structure brûle de l’énergie à interpréter, se justifier, et contester au lieu d’avancer.
firstCheck: >
  Qui a le pouvoir de dire non — et sur quelle base — quand un projet est “finançable” mais incohérent ?
triggers:
  - blockId: B3
    themeId: roles_decisionnels
    minBand: high
    confidence: [confirmed, clarified, protected, unclear]
    weight: 2
  - blockId: B3
    themeId: regles_ecrites
    minBand: high
    weight: 2
  - blockId: B3
    themeId: participation
    minBand: medium
    weight: 1

## H3 — coulisses_et_opacite
title: "Coulisses : la décision réelle n’est pas traçable"
body: >
  Quand l’info circule en privé et que les décisions se prennent “ailleurs”, la structure devient instable.
  Les personnes finissent par se protéger : non-dits, retrait, clans, ou sur-réactivité.
  C’est une mécanique classique : l’opacité fabrique du conflit, puis le conflit renforce l’opacité.
firstCheck: >
  Peux-tu retracer une décision importante récente : qui a proposé, qui a tranché, sur quels critères, et où c’est écrit ?
triggers:
  - blockId: B1
    themeId: non_dits
    minBand: very_high
    confidence: [confirmed, clarified, protected, unclear]
    weight: 3
  - blockId: B3
    themeId: coulisses
    minBand: high
    weight: 2
  - blockId: B3
    themeId: opacite
    minBand: medium
    weight: 1

## H4 — dependance_mortelle
title: "Point de dépendance mortel : une chute suffit"
body: >
  Une structure peut sembler “fonctionner”, jusqu’au jour où une dépendance critique saute :
  une personne-clé, un financeur, un prestataire, un outil, une autorisation, un accès.
  Là, tout se dérègle d’un coup : urgence, tensions, reproches, décisions précipitées.
firstCheck: >
  Quel est votre point de dépendance mortel (personne / financeur / presta / outil) — et quel est le plan B réaliste ?
triggers:
  - blockId: B1
    themeId: isolement
    minBand: high
    confidence: [confirmed, clarified, protected, unclear]
    weight: 2
  - blockId: B1
    themeId: previsibilite
    minBand: medium
    weight: 1
  - blockId: B3
    themeId: responsabilite
    minBand: medium
    weight: 1

## H5 — charge_capacite_reelle
title: "Capacité réelle non pilotée : la structure s’épuise"
body: >
  Quand la charge n’est pas mesurée et discutée, la structure glisse vers un mode pompier.
  La fatigue abîme la qualité des échanges et rend la décision plus dure, plus émotionnelle, plus courte.
  À terme : désengagement, absentéisme, turnover, ou explosion d’un conflit “de trop”.
firstCheck: >
  Avez-vous un indicateur simple qui mesure la capacité réelle (énergie / charge / turnover) — et qui a autorité pour dire “stop” ?
triggers:
  - blockId: B1
    themeId: charge_fatigue
    minBand: very_high
    confidence: [confirmed, clarified, protected, unclear]
    weight: 3
  - blockId: B1
    themeId: ambiance_globale
    minBand: high
    weight: 1
  - blockId: B1
    themeId: reconnaissance
    minBand: medium
    weight: 1

## H6 — controles_faciles_a_contourner
title: "Contrôles contournables : la fraude/incident est “facile”"
body: >
  Si la validation est floue, la traçabilité faible, et les exceptions fréquentes,
  alors un abus (ou une erreur grave) devient une question de temps.
  Ce n’est pas du cynisme : c’est de la mécanique. Une structure à impact attire aussi des opportunistes.
firstCheck: >
  Si j’étais un escroc : quelle est la ligne de validation la plus facile à contourner chez vous — et quel contrôle simple la rendrait robuste ?
triggers:
  - blockId: B3
    themeId: entorses
    minBand: high
    confidence: [confirmed, clarified, protected, unclear]
    weight: 2
  - blockId: B3
    themeId: changements_regles
    minBand: medium
    weight: 1
  - blockId: B3
    themeId: recours
    minBand: medium
    weight: 1
