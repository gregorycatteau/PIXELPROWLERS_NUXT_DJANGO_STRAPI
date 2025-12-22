# Resources & Actions Panel — Smoke tests

Valider le panneau universel Actions & ressources, ses filtres et ses CTA.

## P1
- Parcours: `/parcours/ma-structure-dysfonctionne?step=E_global_bilan`
- Attendu: panneau present, recommandations visibles si disponibles.
- Attendu: bibliotheque filtrable par tags, recherche locale OK.
- CTA file: uniquement chemins allowlistes, pas d URL externe.
- Export: sections Recommandations + Bibliotheque presentes.

## P2
- Parcours: `/parcours/nos-outils-numeriques-nous-epuisent?step=E_global_bilan`
- Attendu: panneau present, aucune URL externe.
- Attendu: si liste vide, message neutre affiche.

## P3
- Parcours: `/parcours/je-suis-en-transition?step=E_global_bilan`
- Attendu: panneau present, filtrage local OK.

## P4
- Parcours: `/parcours/parcours-60-minutes?step=E_global_bilan`
- Attendu: panneau present, CTA safe.

## CTA allowlist bloque
- Scenario: item avec filePath non allowliste.
- Attendu: bouton desactive, pas d ouverture externe.
