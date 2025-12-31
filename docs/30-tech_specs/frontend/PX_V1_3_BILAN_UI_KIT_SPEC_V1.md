---
id: PX_V1_3_BILAN_UI_KIT_SPEC_V1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan", "Heider"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "bilan", "ui", "spec", "accessibility"]
---

# PX V1.3 — Bilan UI Kit (Spec V1)

## Objectif
Spec de l'UI Kit pour tous les bilans globaux, basee sur un contrat unique (UniversalBilanViewModel).

## Scope
- Rendu du bilan global (GlobalBilanEngine).
- Reutilisation stricte des cellules DS existantes.
- Etats neutres (loading/empty/error).

## Sections obligatoires (ordre)
1) **Header bilan**
   - Titre + sous-titre
   - Chips resume (axes, blocs, maturite si dispo)
2) **Panorama**
   - Resume axes + blocs
3) **Ce qui pese le plus** (issues)
4) **Hypotheses**
5) **Atterrissage** (plans)
6) **Actions**
7) **Ressources**
8) **Export**

Sections optionnelles:
- Repere/intro (version publique)
- Engagement levels
- Skip signal
- Supports

Si un module est absent dans le VM, la section est masquee (pas d'etat vide).

## Composants DS a reutiliser
- Shell: `PPBilanShell`
- Sections: `PPBilanSection`
- Cards: `PPCard` (variant soft/accent)
- Actions: `PPActionsPanel`
- Ressources: `ResourcesActionsPanel` ou `ResourcesList`
- States: `PPEmptyState`, `PPErrorState`, `PPLoadingState`
- Buttons/links: `PPButton`, `NuxtLink` (internes uniquement)
- Chips/badges: `PPBadge`, `PPChip`

Interdits: composants custom ad-hoc hors DS.

## Microcopy (baseline)
- Header: "Bilan global" + subtitle prive/public selon parcours.
- Empty: "Bilan indisponible pour le moment."
- Error: "Une erreur est survenue. Reviens plus tard."
- Loading: "Preparation du bilan..."

Les textes sont render en plain text, sans HTML.

## Accessibilite
- `aria-labelledby` sur le container du bilan.
- Focus management sur heading principal.
- Navigation clavier: CTA accessibles par tab order naturel.
- Contrast conforme tokens DS.
- Aucun texte critique uniquement en couleur.

## Etats UI
### Loading
- Afficher `PPLoadingState` ou skeleton DS.
- Aucun appel externe.

### Empty
- `PPEmptyState` + CTA retour vers E2 (si dispo).
- Texte neutre, privacy-first.

### Error
- `PPErrorState` + CTA retour.
- Pas d'error detail technique.

## Securite
- Pas de `v-html` / `innerHTML`.
- Liens internes uniquement (SafeDeepLink pour ressources).
- Aucune image distante.
- Erreurs neutres et sans PII.

## References
- `docs/30-tech_specs/frontend/PX_V1_3_UNIVERSAL_BILAN_VIEWMODEL_RFC_V1.md`
- `docs/30-tech_specs/frontend/PX_V1_3_ACTIONS_PANEL_UNIVERSAL_R1.md`
