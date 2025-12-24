---
id: DS_BADGE_MIGRATION_AUDIT_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Heider", "Dan"]
scope: ["docs/20-product_specs/**"]
tags: ["product_specs", "ux_ui", "design_system"]
---

# DS_BADGE_MIGRATION_AUDIT_V1 — Inventaire Badge/Tag → PPBadge (ENFORCED)

> Objectif : inventaire exhaustif pour migration mécanique vers `<PPBadge />`.
> Source DS : futur `frontend_nuxt/app/components/PPBadge.vue`
> Classes badge actuelles (à vérifier) : `.pp-badge*`, `*Badge*`, `*Tag*`, `*Pill*`, `chip`

---

## 0) Méthode d’audit (obligatoire)

Scanner uniquement ces répertoires (front) :
- `frontend_nuxt/app/`
- `frontend_nuxt/components/`
- `frontend_nuxt/pages/`
- `frontend_nuxt/layouts/`
- `frontend_nuxt/assets/css/pp.components.css`

Chercher les occurrences :
- classes contenant `badge` (ex: `pp-badge-pill`, `*Badge*`, etc.)
- classes contenant `tag` / `pill` / `chip`
- composants dont le nom contient `Badge` / `Tag`

---

## 1) Résumé (à remplir)

- Nombre total de composants `.vue` avec nom contenant `Badge` ou `Tag` : **0**
- Nombre total d’occurrences de classes contenant `badge` dans templates : **14**
- Nombre total d’occurrences de classes contenant `tag|pill|chip` dans templates : **41**
- Nombre de styles “badge” définis dans `pp.components.css` : **9**

---

## 2) Inventaire — composants Badge/Tag existants

> Format strict :
> - `FILE: <path>`
> - `ROLE: <status|selected|priority|meta|unknown>`
> - `STRUCTURE: <short description>`
> - `CLASSES: <excerpt>`
> - `NOTES: <only if needed>`

Aucun composant `.vue` nommé Badge/Tag.

---

## 3) Inventaire — usages “badge-like” dans les templates

> Format strict par occurrence :
> - `FILE: <path>:<line>`
> - `ELEMENT: <span|div|button|...>`
> - `CLASSES: <excerpt>`
> - `TEXT/ROLE: <ex: "Sélectionné", "Prioritaire", "Niveau 3", etc.>`
> - `TARGET_PPBadge: <neutral|accent|success|warning|danger|outline>` (best guess)

- FILE: frontend_nuxt/app/components/journey/JourneyStepHeader.vue:3
- ELEMENT: p
- CLASSES: JourneyStepBadge
- TEXT/ROLE: "Important"
- TARGET_PPBadge: accent

- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:17
- ELEMENT: span
- CLASSES: pp-journey-question-chip
- TEXT/ROLE: "Question X / Y"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:20
- ELEMENT: span
- CLASSES: ['pp-journey-theme-badge', themeClass]
- TEXT/ROLE: themeLabel (thématique)
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:25
- ELEMENT: span
- CLASSES: ['pp-journey-status-badge', statusClass]
- TEXT/ROLE: "Réponse enregistrée" / "Mis de côté"
- TARGET_PPBadge: success

- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:24
- ELEMENT: span
- CLASSES: pp-globalbilan-summary-chip inline-flex items-center gap-1
- TEXT/ROLE: "Répondu" + count
- TARGET_PPBadge: success

- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:27
- ELEMENT: span
- CLASSES: pp-globalbilan-summary-chip inline-flex items-center gap-1
- TEXT/ROLE: "Non répondu" + count
- TARGET_PPBadge: warning

- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:30
- ELEMENT: span
- CLASSES: pp-globalbilan-summary-chip inline-flex items-center gap-1
- TEXT/ROLE: "Non vu" + count
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:15
- ELEMENT: button
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Lecture rapide"
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:18
- ELEMENT: button
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Tout lire"
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:52
- ELEMENT: button
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Tous"
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:62
- ELEMENT: button
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "{{ tag }}" (filtre)
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:22
- ELEMENT: span
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Hypothèse {{ hypo.index }}"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/bilan/EngagementLevelsPanel.vue:26
- ELEMENT: component
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "{{ level.ctaLabel }}" (CTA)
- TARGET_PPBadge: accent

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:29
- ELEMENT: div
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "{{ chip.label }}" + "{{ chip.value }}"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:34
- ELEMENT: div
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Blocs" + valeur
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:40
- ELEMENT: div
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Maturité" + valeur
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:132
- ELEMENT: button
- CLASSES: pp-globalbilan-reperes-pill
- TEXT/ROLE: "✅ Soutiens / appuis"
- TARGET_PPBadge: accent

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:140
- ELEMENT: button
- CLASSES: pp-globalbilan-reperes-pill
- TEXT/ROLE: "⚠️ Points à surveiller"
- TARGET_PPBadge: warning

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:148
- ELEMENT: button
- CLASSES: pp-globalbilan-reperes-pill
- TEXT/ROLE: "🔥 Ce qui pèse le plus"
- TARGET_PPBadge: danger

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:300
- ELEMENT: button
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Mode focus"
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:307
- ELEMENT: button
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Mode détails"
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/p1/P1BlocksHub.vue:65
- ELEMENT: span
- CLASSES: pp-journey-status-chip
- TEXT/ROLE: "{{ block.statusLabel }}"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/p1/P1HypothesesSection.vue:19
- ELEMENT: span
- CLASSES: pp-globalbilan-summary-chip
- TEXT/ROLE: "Hypothèse {{ idx + 1 }}"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/p1/P1Bilan1E2.vue:15
- ELEMENT: div
- CLASSES: BilanPill pp-journey-reveal
- TEXT/ROLE: axe.label + score
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:55
- ELEMENT: button
- CLASSES: pp-bilan-axis-summary-chip
- TEXT/ROLE: axis.labelShort + score + tone
- TARGET_PPBadge: outline

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:83
- ELEMENT: span
- CLASSES: pp-bilan-axis-score-chip
- TEXT/ROLE: "Score {{ axis.score ?? 0 }}"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:14
- ELEMENT: span
- CLASSES: home-journey-badge
- TEXT/ROLE: "Bientôt"
- TARGET_PPBadge: warning

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:17
- ELEMENT: span
- CLASSES: pp-journey-card-title-chip
- TEXT/ROLE: titre de parcours
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/home/FitSection.vue:14
- ELEMENT: span
- CLASSES: pp-badge-pill
- TEXT/ROLE: "Ce que tu peux attendre"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/home/FitSection.vue:27
- ELEMENT: span
- CLASSES: pp-badge-pill
- TEXT/ROLE: "Ce n’est pas pour toi si…"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/home/AxesSection.vue:23
- ELEMENT: span
- CLASSES: pp-badge-pill
- TEXT/ROLE: "{{ axis.badge }}"
- TARGET_PPBadge: accent

- FILE: frontend_nuxt/app/components/home/TimelineSection.vue:20
- ELEMENT: div
- CLASSES: TimelineBadge pp-badge-accent
- TEXT/ROLE: "{{ index + 1 }}" (étape)
- TARGET_PPBadge: accent

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:26
- ELEMENT: div
- CLASSES: CardSelectedBadge pp-badge-pill
- TEXT/ROLE: "Parcours sélectionné"
- TARGET_PPBadge: success

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:28
- ELEMENT: div
- CLASSES: pp-emoji-badge IndicatorBadge
- TEXT/ROLE: icône (emoji)
- TARGET_PPBadge: accent

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:30
- ELEMENT: p
- CLASSES: pp-badge-pill CardTag
- TEXT/ROLE: "{{ item.tag }}"
- TARGET_PPBadge: neutral

- FILE: frontend_nuxt/app/components/home/ManifestoSection.vue:7
- ELEMENT: div
- CLASSES: pp-manifesto-badge
- TEXT/ROLE: "PP"
- TARGET_PPBadge: accent

- FILE: frontend_nuxt/app/components/home/HomeHowWeWorkSection.vue:14
- ELEMENT: div
- CLASSES: home-how-badge
- TEXT/ROLE: "{{ idx + 1 }}"
- TARGET_PPBadge: neutral

---

## 4) Inventaire — styles badge CSS

### 4.1 Styles dans pp.components.css
> Lister les classes DS déjà liées aux badges/tags, si existantes.

- .pp-pill
- .pp-badge-accent
- .pp-badge-pill
- .pp-emoji-badge
- .pp-manifesto-badge
- .pp-globalbilan-summary-chips
- .pp-globalbilan-summary-chip
- .pp-globalbilan-reperes-pills
- .pp-globalbilan-reperes-pill

---

## 5) Lots de migration (proposition mécanique)

> Lots simples :
> - Lot A : spans/divs avec classes `pp-badge-*` → `<PPBadge>`
> - Lot B : badges inline “ad hoc” (rounded + bg + text-xs) → `<PPBadge>`
> - Lot C : badges interactifs (button/chip) → `<PPBadge as="button">` (si nécessaire)

### 5.1 Lot A
- FILE: frontend_nuxt/app/components/home/FitSection.vue:14
- FILE: frontend_nuxt/app/components/home/FitSection.vue:27
- FILE: frontend_nuxt/app/components/home/AxesSection.vue:23
- FILE: frontend_nuxt/app/components/home/TimelineSection.vue:20
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:26
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:30

### 5.2 Lot B
- FILE: frontend_nuxt/app/components/journey/JourneyStepHeader.vue:3
- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:17
- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:20
- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:25
- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:24
- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:27
- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:30
- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:22
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:29
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:34
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:40
- FILE: frontend_nuxt/app/components/journey/p1/P1BlocksHub.vue:65
- FILE: frontend_nuxt/app/components/journey/p1/P1HypothesesSection.vue:19
- FILE: frontend_nuxt/app/components/journey/p1/P1Bilan1E2.vue:15
- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:83
- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:14
- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:17
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:28
- FILE: frontend_nuxt/app/components/home/ManifestoSection.vue:7
- FILE: frontend_nuxt/app/components/home/HomeHowWeWorkSection.vue:14

### 5.3 Lot C
- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:15
- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:18
- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:52
- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:62
- FILE: frontend_nuxt/app/components/journey/bilan/EngagementLevelsPanel.vue:26
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:132
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:140
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:148
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:300
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:307
- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:55

---

## 6) Points bloquants (si existants)

> Exemples :
> - badge utilisé comme bouton
> - badge utilisé comme layout container
> - dépendance à une classe legacy non documentée

- Plusieurs badges sont des boutons interactifs (pp-globalbilan-summary-chip, pp-globalbilan-reperes-pill, pp-bilan-axis-summary-chip) avec états actifs/pressed à préserver.
- Des badges sont définis dans des styles locaux (JourneyStepBadge, home-journey-badge, home-how-badge) non centralisés dans pp.components.css.
- Certains “chips” portent des contenus composés (icône + label + score + état) qui peuvent nécessiter slots dédiés dans PPBadge.
