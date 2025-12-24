---
id: P1_GLOBAL_BILAN_REFACTOR_AUDIT
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "frontend"]
---

# P1 Global Bilan — Refactor Audit

- **Fichier source** : `frontend_nuxt/app/components/journey/p1/P1GlobalBilan.vue`
- **Taille** : 1 618 lignes (template + script)

## Responsabilités identifiées
- **UI/Rendering** : toutes les sections du bilan (repères, panorama, blocs explorés, tensions, soutiens, hypothèses, atterrissage, ressources, plan d’action, export, options, aside).
- **State & interactions locales** : toggles UI (focus/details, repères, expansions issues/blocs/hypothèses, sélection hypothèses max 2, landing “fait”, survol atterrissage), highlights, scroll anchors.
- **Logic métier léger** : calcul d’agrégats (complétude, labels, segments, tri axes panorama), mapping band → score/label, mapping données hypothèses → plans/puces, plans d’atterrissage statiques.
- **Données** : récupération des scores/storage via composables (diagnostic, export, ressources, narratives), construction markdown export.
- **Export/print** : copie texte exportable, print, clear storage, navigation hub.
- **Navigation** : sommaire/anchors, CTA vers ressources, hypothèses, atterrissage.

## Sections Template
- Entête parcours (JourneyLayout + JourneyStepHeader)
- Repères (intro, raccourcis)
- Panorama & blocs (scores panorama, blocs explorés)
- Ce qui pèse le plus (issues/tensions)
- Soutiens principaux
- Hypothèses structurantes (sélection + plan de vérification)
- Atterrissage systémique (protocole lié aux hypothèses + section système existante)
- Ressources à télécharger
- Plan d’action
- Export (copie/print/clear) — désormais composant dédié
- Options “Ce que tu peux choisir maintenant”
- Aside desktop + mobile

## Refs / Computed dominants
- **State refs** : `selectedHypothesisIds`, `focusDetails`, `repereOpen`, `exportMode`, `copied`, `clearMessage`, `highlightTarget`, `hypothesisDetailsExpanded`, `expandedIssueIds`, `expandedBlockIds`, `landingDone`.
- **Computed clés** : `scores`, `exportText`, `exportModeWarning`, `alerts/watchlist/hasSupports`, `axisSummary/axisSummaryLabel`, `panoramaAxesSorted/priorityAxisIds`, `panoramaCompletenessLabel`, `blockSummaries/completedBlocksLabel`, `globalSkipSummary/hasGlobalMissing`, `selectedHypotheses`, `actionsByHorizon/filteredActionsByHorizon`, `systemicFollowupPacks/answers/statuses`, `issue summary/effects/signals helpers`, `hypothesis bullets/plan helpers`, `landingPlan`.

## Proposition de découpage
Composants (dans `app/components/journey/bilan/`):
1) **BilanPanoramaCard** : section panorama (legend + axes triés + segments + badges + complétude). Props: scores, meta, answered/skipped, axis order, priority logic; Emits: none.
2) **BilanBlocksSummary** : section “Blocs explorés” cockpit (stats, jauge, CTA, détails). Props: block summaries, completion helper; Emits: toggle details.
3) **BilanIssuesList** : “Ce qui pèse le plus” progressive cards. Props: issues + mapping helpers; Emits: expand toggle; Slots optional for CTA override.
4) **BilanHypothesesSection** : sélection max 2 + bullets + plan de vérif; Props: hypotheses, selectedIds, max, helpers; Emits: toggle select, toggle details.
5) **BilanLandingPanel** : protocole atterrissage basé sur sélection + “marquer fait”; Props: selected hypotheses, plans, done set; Emits: toggle done, scroll to resources/hypothèses.
6) **BilanActionPlanGrid** : horizon cards (actionsByHorizon); Props: lists + copy.
7) **BilanExportPanel** (déjà extrait) : export/copie/print/clear.
8) **BilanOptionsList** : “Ce que tu peux choisir maintenant”.
9) **BilanAside** (existant P1GlobalBilanAside) rester partagé.

Composables (dans `app/composables/`):
- **useBilanPanorama** : préparation des axes (tri, segments, labels, badges, complétude).
- **useBilanBlocks** : formats blockSummaries, completion %, detail toggles.
- **useBilanIssues** : mapping issues → summary/effects/signals/impact score.
- **useBilanHypothesesSelection** : sélection max N, détails, plans de vérif, landing plans, done flags.
- **useScrollHighlight** : scroll + highlight timer for anchors (atterrissage/hypothèses/export).

## Réutilisable vs spécifique P1
- **Réutilisable multi-parcours** : layout Journey*, aside nav, export panel, blocks summary cockpit, issues cards pattern, selection-with-limit pattern, scroll highlight helper.
- **Spécifique P1** : contenus/copy P1, mapping axes panorama P1, plans d’atterrissage statiques par hypothèse P1, ressources P1, action plan P1, narratives P1.
