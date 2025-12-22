# Engagement N1-N4 — Smoke tests

Valider la presence du module engagement dans le Global Bilan, les CTA et l export.

## P1
- Parcours: `/parcours/ma-structure-dysfonctionne?step=E_global_bilan`
- Attendu: bloc N1-N4 present, CTA sans URL externe.
- Attendu: CTA N1 -> /ressources, CTA N2/N3/N4 -> /contact.
- Export: section "Options de suite (N1-N4)" presente.

## P2
- Parcours: `/parcours/nos-outils-numeriques-nous-epuisent?step=E_global_bilan`
- Attendu: bloc N1-N4 present, CTA safe (contact/ressources).
- Export: section "Options de suite (N1-N4)" presente.

## P3
- Parcours: `/parcours/je-suis-en-transition?step=E_global_bilan`
- Attendu: bloc N1-N4 present, CTA safe (contact/ressources).
- Export: section "Options de suite (N1-N4)" presente.

## P4
- Parcours: `/parcours/parcours-60-minutes?step=E_global_bilan`
- Attendu: bloc N1-N4 present, CTA safe (contact/ressources).
- Export: section "Options de suite (N1-N4)" presente.

## Module absent
- Scenario: manif sans engagement.
- Attendu: aucun rendu du panel N1-N4.
