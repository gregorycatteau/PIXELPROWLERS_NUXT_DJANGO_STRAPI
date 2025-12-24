# Guards Registry — SSOT V1.3

> **Source of Truth** pour tous les guards de sécurité et qualité du frontend.

## Vue d'ensemble

| Catégorie | Nombre | CI obligatoire |
|-----------|--------|----------------|
| Sécurité P0 | 5 | ✅ Oui |
| DS / Design System | 18 | ⚠️ Optionnel |
| Resources / Deeplinks | 6 | ✅ Oui (r3) |
| Journey / Bilan | 8 | ✅ Oui |
| **Total** | **37** | - |

---

## Registre complet

### 🔴 Sécurité P0 (bloquant CI)

| Script npm | Fichier guard | Scope | Règle | Niveau |
|------------|---------------|-------|-------|--------|
| `no-remote-assets:guard` | `scripts/guards/no-remote-assets.mjs` | `app/**/*.vue` | Interdit les assets externes (CDN, http://) | P0 |
| `no-v-html:guard` | `tools/no_v_html_guard.ts` | `app/**/*.vue` | Interdit `v-html` (XSS) | P0 |
| `no-innerhtml:guard` | `scripts/guards/no-innerhtml.mjs` | `app/**/*.{vue,ts}` | Interdit `.innerHTML`, `insertAdjacentHTML` | P0 |
| `no-console:guard` | `tools/no_console_guard.ts` | `app/**/*.{vue,ts}` | Interdit `console.*` | P0 |
| `data-only:guard` | `tools/data_only_strings_guard.ts` | `app/data/*.ts` | Strings data-only (pas de HTML) | P0 |

### 🟡 DS / Design System (optionnel CI)

| Script npm | Fichier guard | Scope | Règle | Notes DX |
|------------|---------------|-------|-------|----------|
| `cta:guard` | `scripts/guards/no-legacy-cta-classes.mjs` | `app/**/*.vue` | Interdit classes CTA legacy | Migration DS |
| `card:guard` | `scripts/guards/no-ad-hoc-card-wrappers.mjs` | `app/**/*.vue` | Interdit wrappers card ad-hoc | Migration DS |
| `ppcard:guard` | `scripts/guards/no-ppcard-style-classes.mjs` | `app/**/*.vue` | Interdit styles PPCard legacy | Migration DS |
| `badgeA:guard` | `scripts/guards/no-legacy-badge-classes-a.mjs` | `app/**/*.vue` | Interdit classes badge A | Migration DS |
| `badgeB:guard` | `scripts/guards/no-legacy-badge-classes-b.mjs` | `app/**/*.vue` | Interdit classes badge B | Migration DS |
| `chip:guard` | `scripts/guards/no-legacy-chip-classes-c.mjs` | `app/**/*.vue` | Interdit classes chip legacy | Migration DS |
| `sectionheader:guard` | `scripts/guards/no-legacy-sectionheader-classes.mjs` | `app/**/*.vue` | Interdit classes section header legacy | Migration DS |
| `pageheaderC1:guard` | `scripts/guards/no-legacy-pageheader-classes-c1.mjs` | `app/**/*.vue` | Interdit classes page header C1 | Migration DS |
| `pageheaderC2:guard` | `scripts/guards/no-legacy-pageheader-classes-c2.mjs` | `app/**/*.vue` | Interdit classes page header C2 | Migration DS |
| `pageheaderC3:guard` | `scripts/guards/no-legacy-pageheader-classes-c3.mjs` | `app/**/*.vue` | Interdit classes page header C3 | Migration DS |
| `scale:guard` | `scripts/guards/no-legacy-scale-classes-q1.mjs` | `app/**/*.vue` | Interdit classes scale legacy | Migration DS |
| `progress:guard` | `scripts/guards/no-legacy-progress-classes-q3.mjs` | `app/**/*.vue` | Interdit classes progress legacy | Migration DS |
| `questionnav:guard` | `scripts/guards/no-legacy-question-nav-q4.mjs` | `app/**/*.vue` | Interdit nav questionnaire legacy | Migration DS |
| `skip:guard` | `scripts/guards/no-legacy-skip-patterns-q4.mjs` | `app/**/*.vue` | Interdit patterns skip legacy | Migration DS |
| `questionwrapper:guard` | `scripts/guards/no-legacy-question-wrapper-q2.mjs` | `app/**/*.vue` | Interdit wrappers question legacy | Migration DS |
| `questionnaireshell:guard` | `scripts/guards/no-legacy-questionnaire-shell-q5.mjs` | `app/**/*.vue` | Interdit shell questionnaire legacy | Migration DS |
| `badgechip:r3a:guard` | `scripts/guards/no-legacy-badge-chip-r3a.mjs` | `app/**/*.vue` | Interdit badge/chip legacy R3 | Migration DS |
| `bilansectionheader:guard` | `scripts/guards/no-legacy-bilan-sectionheaders-r4.mjs` | `app/**/*.vue` | Interdit section headers bilan legacy | Migration DS |

### 🟢 Resources / Deeplinks (CI obligatoire r3)

| Script npm | Fichier guard | Scope | Règle | Notes DX |
|------------|---------------|-------|-------|----------|
| `resourcesdeeplink:guard` | `scripts/guards/no-manual-resources-query.mjs` | Scoped | Interdit manipulation manuelle route.query | **Canonique** (env scope) |
| `resourcesdeeplink:r1:guard` | alias → canonique | 2 fichiers | Scope pilot | Compat |
| `resourcesdeeplink:r2:guard` | alias → canonique | 6 fichiers | Scope r2 | Compat |
| `resourcesdeeplink:r3:guard` | alias → canonique | 12 fichiers | Scope r3 (CI) | **Défaut CI** |
| `resourceslib:r1:guard` | `scripts/guards/no-legacy-resources-library-r1.mjs` | Page ressources | Interdit patterns menhir | - |
| `resourceslib:r2:guard` | `scripts/guards/no-menhir-resources-page-r2.mjs` | Page ressources | Interdit patterns menhir R2 | - |
| `resources:r1:guard` | `scripts/guards/no-legacy-resources-r1.mjs` | Composants bilan | Interdit patterns resources legacy | - |
| `hypatter:r1:guard` | `scripts/guards/no-legacy-hyp-atter-r1.mjs` | Composants bilan | Interdit hyp/atterrissage legacy | - |

### 🔵 Journey / Bilan (CI obligatoire)

| Script npm | Fichier guard | Scope | Règle | Notes DX |
|------------|---------------|-------|-------|----------|
| `bilan:guard` | `tools/bilan_adapter_guard.ts` | Journey adapters | Vérifie adapters bilan | Nécessite `nuxi prepare` |
| `journey:guard` | `tools/journey_manifest_guard.ts` | Journey manifests | Vérifie manifests journey | - |
| `journey:nodup` | `tools/journey_no_wrappers_guard.ts` | Journey wrappers | Interdit wrappers dupliqués | - |
| `engagement:guard` | `tools/engagement_guard.ts` | Engagement levels | Vérifie niveaux engagement | - |
| `markdown-safe:guard` | `tools/markdown_safe_guard.ts` | Data files | Vérifie markdown safe | - |
| `reco:guard` | `tools/recommendations_guard.ts` | Recommendations | Vérifie recommandations | - |
| `bilanshell:guard` | `scripts/guards/no-legacy-bilan-shell-r1.mjs` | Bilan shell | Interdit shell bilan legacy | - |
| `bilancard:guard` | `scripts/guards/no-legacy-bilan-cards-r2.mjs` | Bilan cards | Interdit cards bilan legacy | - |

---

## Ordre d'exécution CI recommandé

```bash
# 1. Sécurité P0 (stop-on-fail)
npm run no-remote-assets:guard
npm run no-v-html:guard
npm run no-innerhtml:guard
npm run no-console:guard
npm run data-only:guard

# 2. Journey/Bilan (stop-on-fail)
npm run bilan:guard
npm run journey:guard
npm run engagement:guard
npm run markdown-safe:guard
npm run reco:guard

# 3. Resources/Deeplinks (stop-on-fail)
npm run resourcesdeeplink:guard
npm run resourceslib:r2:guard

# 4. DS (optionnel, non bloquant)
# npm run cta:guard
# npm run card:guard
# ...
```

---

## Commande CI unifiée

```bash
npm run guards:ci
```

Exécute tous les guards P0 + obligatoires dans l'ordre recommandé.

---

## Fichier de scopes resourcesdeeplink

Chemin : `frontend_nuxt/scripts/guards/scopes/resourcesdeeplink.scopes.json`

```json
{
  "pilot": [
    "app/pages/ressources.vue",
    "app/composables/useResourcesLibrary.ts"
  ],
  "r2": [
    "app/pages/ressources.vue",
    "app/composables/useResourcesLibrary.ts",
    "app/components/resources/library/PPResourcesLibraryShell.vue",
    "app/components/resources/library/PPResourcesLibraryFilters.vue",
    "app/components/resources/library/PPResourcesLibraryGrid.vue",
    "app/components/resources/library/PPResourcesLibraryPagination.vue"
  ],
  "r3": [
    "app/pages/ressources.vue",
    "app/composables/useResourcesLibrary.ts",
    "app/components/resources/library/PPResourcesLibraryShell.vue",
    "app/components/resources/library/PPResourcesLibraryFilters.vue",
    "app/components/resources/library/PPResourcesLibraryGrid.vue",
    "app/components/resources/library/PPResourcesLibraryPagination.vue",
    "app/components/resources/library/PPResourcesLibraryToolbar.vue",
    "app/components/journey/bilan/ResourcesActionsPanel.vue",
    "app/components/journey/bilan/BilanLandingPanel.vue",
    "app/components/journey/bilan/BilanHypothesesSection.vue",
    "app/components/journey/bilan/GlobalBilanEngine.vue",
    "app/utils/deeplinks/resourcesDeepLink.ts"
  ]
}
```

---

## Notes DX

### Ajouter un nouveau guard

1. Créer le fichier dans `scripts/guards/` ou `tools/`
2. Ajouter le script npm dans `package.json`
3. Mettre à jour ce registre
4. Si P0/obligatoire, ajouter à `guards:ci`

### Exceptions / Allowlist

Certains guards supportent des allowlists. Voir la documentation de chaque guard.

---

**Dernière mise à jour** : 2024-12-24
