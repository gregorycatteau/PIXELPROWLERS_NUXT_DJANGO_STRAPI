---
id: PX_V1_3_UNIVERSAL_BILAN_VIEWMODEL_RFC_V1
version: 1.0.0
status: active
date: 2025-12-27
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend", "bilan", "rfc", "contract", "security"]
---

# PX V1.3 — UniversalBilanViewModel (RFC V1)

## Objectif
Definir un contrat universel pour tous les bilans (P1..P5 + parcours generes), stable, data-only, et compatible avec la securite privacy-first.

Le ViewModel est la seule interface entre:
- l'engine de bilan (adapter + composables), et
- l'UI (GlobalBilanEngine + cellules DS).

## Scope
- Bilan global (E_global_bilan) pour tous les parcours.
- Bilan panorama (E2) et bilans de blocs restent hors scope, mais peuvent reutiliser des champs du modele.

## Invariants
- **Agregats only**: aucun contenu issu directement de reponses brutes.
- **No PII**: aucun champ libre associe a une personne.
- **Data-only**: le VM est un POJO, sans dependance UI.
- **No HTML**: tout texte est rendu comme texte, jamais comme HTML.

## Nommage
- **UniversalBilanViewModel** est le nom de contrat fonctionnel.
- Son implementation actuelle est `GlobalBilanViewModel` (voir `frontend_nuxt/app/types/bilan.ts`).
- Toute evolution V1 reste retrocompatible sur les champs obligatoires.

## Structure (schema V1)
Le contrat reprend le shape de `GlobalBilanViewModel` et en fixe les champs obligatoires et interdits.

### Champs obligatoires
- `copy`: labels et microcopy publics (data-only)
- `axisSummaryLabel`
- `completedBlocksLabel`
- `panoramaAnsweredLabel`
- `summaryNav`: [{ id, label }]
- `panorama`: { answeredCount, skippedCount, completenessLabel, axes, blocks, completedLabel }
- `blocksSummaryHeading`
- `completedBlocks`
- `exportPanel`: { exportText, clearMessage, copied, missingInfo, eraseCopyLabel, focusDetails, hasGlobalMissing, globalSkipText, globalMissing }

### Champs optionnels
- `meta`: { isEmpty?, partial?, maturity?, ... }
- `modules`: sections enrichies (issues, hypotheses, landing, actions, resources, recommendations, engagement, skipSignal).

### Champs interdits (liste minimale)
Interdits explicites et derivations equivalentes:
- `rawAnswers`, `answersByQuestion`, `answersByQuestionId`
- `perQuestion`, `perQuestion*`, `answers*`, `responses*`
- toute cle du type `p*_q*` ou `q*_*`

Tout ajout de champ doit rester "agregat only" et sans references a des identifiants de question.

## Mapping (diagnostic -> recommandations -> actions -> ressources)
Pipeline standard:
1) **Diagnostic** (scores, meta, completude) -> `panorama`, `issues`, `hypotheses`.
2) **Recommandations** derivees -> `modules.recommendations`.
3) **Actions** construites depuis bilan + reco -> `modules.actions` ou `modules.resourcesActions`.
4) **Ressources** derives uniquement via allowlist -> `modules.resources` ou `modules.resourcesActions`.

Regles:
- Les recommandations et actions ne peuvent pas referencer de reponse brute.
- Les ressources utilisent des ids allowlistes (pointers ressources + SafeDeepLink).

## Regles d'affichage (etat du VM)
### Etat "empty"
- `meta.isEmpty === true` ou VM generique par defaut.
- UI: message neutre + CTA retour (pas de detail, pas d'erreur sensible).

### Etat "partial"
- `meta.partial === true` ou `engineState === partial_vm`.
- UI: affiche les sections disponibles avec un message neutre (pas de bruit).

### Etat "ready"
- Tous les champs obligatoires et les sections modules presentes selon le manifest.

## Invariants cross-journeys (P1..P5)
- `summaryNav` doit toujours contenir les sections visibles.
- `panorama.axes` et `panorama.blocks` peuvent etre vides, jamais `null`.
- `exportPanel.exportText` ne contient que des agregats publics (pas de PII).
- `modules.actions` ou `modules.resourcesActions` doit etre compatible `PPActionsPanel`.

## Extensibilite (parcours generes)
Un parcours genere peut:
- fournir uniquement les champs obligatoires,
- utiliser `meta.maturity = "stub"` ou `"core"`,
- omettre `modules.*` non disponibles.

Le rendu doit rester stable (fallback etat vide).

## Securite
- No `v-html` / `innerHTML`.
- Texte normalise avant rendu (NFKC + strip zero-width si applique).
- Liens internes uniquement (SafeDeepLinkKit pour ressources).
- Erreurs neutres, pas de logs sensibles.

## References
- `docs/30-tech_specs/frontend/BILAN_ENGINE_ADAPTER_GUIDE.md`
- `docs/30-tech_specs/frontend/PX_V1_3_ACTIONS_PANEL_UNIVERSAL_R1.md`
- `docs/30-tech_specs/frontend/PX_JOURNEY_ENGINE_UNIVERSAL_V1.md`
