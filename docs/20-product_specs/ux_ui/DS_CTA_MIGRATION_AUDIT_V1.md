---
id: DS_CTA_MIGRATION_AUDIT_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Heider", "Dan"]
scope: ["docs/20-product_specs/**"]
tags: ["product_specs", "ux_ui", "design_system"]
---

# DS_CTA_MIGRATION_AUDIT_V1 — Inventaire CTA → PPButton (ENFORCED)

> Objectif : inventaire exhaustif pour migration mécanique vers `<PPButton />`.
> Source DS : `frontend_nuxt/app/components/PPButton.vue`
> Classes DS CTA : `.pp-cta-primary`, `.pp-cta-secondary`, `.pp-cta-ghost`, `.home-cta-primary`, `.home-cta-secondary`

---

## 0) Méthode d’audit (obligatoire)

Scanner uniquement ces répertoires (front) :
- `frontend_nuxt/app/`
- `frontend_nuxt/components/`
- `frontend_nuxt/pages/`
- `frontend_nuxt/layouts/`

Chercher les occurrences des classes CTA :
- `pp-cta-primary`
- `pp-cta-secondary`
- `pp-cta-ghost`
- `home-cta-primary`
- `home-cta-secondary`

Chercher aussi les usages existants de :
- `<PPButton`

---

## 1) Résumé (à remplir)

- Nombre total d’occurrences `pp-cta-primary` : **3**
- Nombre total d’occurrences `pp-cta-secondary` : **6**
- Nombre total d’occurrences `pp-cta-ghost` : **0**
- Nombre total d’occurrences `home-cta-primary` : **1**
- Nombre total d’occurrences `home-cta-secondary` : **1**
- Nombre total d’usages `<PPButton` : **0**

---

## 2) Inventaire détaillé — CTA à migrer

> Format strict pour chaque occurrence :
> - `FILE: <path>:<line>`
> - `ELEMENT: <button|a|NuxtLink|other>`
> - `CURRENT: <class list excerpt>`
> - `TARGET PPButton:` variant + props minimales (`to` ou `href` si applicable)
> - `NOTES:` (seulement si nécessaire : ex. target _blank)

### 2.1 pp-cta-primary — Résultats
- FILE: frontend_nuxt/app/components/journey/JourneyEngineUniversal.vue:13
- ELEMENT: button
- CURRENT: class="pp-cta-primary"
- TARGET PPButton: variant="primary"
- NOTES:

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:47
- ELEMENT: NuxtLink
- CURRENT: class="IndicatorsPrimaryButton pp-cta-primary"
- TARGET PPButton: variant="primary" :to="{ path: '/accompagnement-formation', query: { parcours: selectedJourneyId } }"
- NOTES:

- FILE: frontend_nuxt/app/components/journey/p1/P1JourneyOrchestrator.vue:13
- ELEMENT: button
- CURRENT: class="pp-cta-primary"
- TARGET PPButton: variant="primary"
- NOTES:

### 2.2 pp-cta-secondary — Résultats
- FILE: frontend_nuxt/app/components/journey/ResourceCard.vue:8
- ELEMENT: a
- CURRENT: class="pp-cta-secondary inline-flex w-auto"
- TARGET PPButton: variant="secondary" href="..." target="_blank"
- NOTES: @click.prevent + window.open

- FILE: frontend_nuxt/app/components/journey/JourneyEngineUniversal.vue:16
- ELEMENT: button
- CURRENT: class="pp-cta-secondary"
- TARGET PPButton: variant="secondary"
- NOTES:

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:57
- ELEMENT: button
- CURRENT: class="IndicatorsSecondaryButton pp-cta-secondary"
- TARGET PPButton: variant="secondary"
- NOTES:

- FILE: frontend_nuxt/app/components/home/ContactSection.vue:13
- ELEMENT: NuxtLink
- CURRENT: class="pp-cta-secondary"
- TARGET PPButton: variant="secondary" to="/accompagnement-formation"
- NOTES:

- FILE: frontend_nuxt/app/components/journey/p1/P1JourneyOrchestrator.vue:16
- ELEMENT: button
- CURRENT: class="pp-cta-secondary"
- TARGET PPButton: variant="secondary"
- NOTES:

- FILE: frontend_nuxt/app/pages/parcours/[journeySlug].vue:61
- ELEMENT: NuxtLink
- CURRENT: class="pp-cta-secondary inline-flex w-auto"
- TARGET PPButton: variant="secondary" to="/"
- NOTES:

### 2.3 pp-cta-ghost — Résultats
Aucun.

### 2.4 home-cta-primary — Résultats
- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:18
- ELEMENT: button
- CURRENT: class="home-cta-primary"
- TARGET PPButton: variant="primary"
- NOTES:

### 2.5 home-cta-secondary — Résultats
- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:21
- ELEMENT: button
- CURRENT: class="home-cta-secondary"
- TARGET PPButton: variant="secondary"
- NOTES:

---

## 3) Inventaire — usages existants de PPButton

### 3.1 <PPButton — Résultats
Aucun.

---

## 4) Lots de migration (proposition mécanique)

> Construire des lots “simples et sûrs” :
> - Lot A : <NuxtLink class="pp-cta-primary|secondary"> → <PPButton :to="..." variant="...">
> - Lot B : <a class="pp-cta-primary|secondary"> → <PPButton href="..." target="..." variant="...">
> - Lot C : <button class="pp-cta-primary|secondary"> → <PPButton variant="...">
> - Lot D : home-cta-* idem (variant primary/secondary)

### 4.1 Lot A (NuxtLink → PPButton)
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:47
- FILE: frontend_nuxt/app/components/home/ContactSection.vue:13
- FILE: frontend_nuxt/app/pages/parcours/[journeySlug].vue:61

### 4.2 Lot B (a → PPButton)
- FILE: frontend_nuxt/app/components/journey/ResourceCard.vue:8

### 4.3 Lot C (button → PPButton)
- FILE: frontend_nuxt/app/components/journey/JourneyEngineUniversal.vue:13
- FILE: frontend_nuxt/app/components/journey/JourneyEngineUniversal.vue:16
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:57
- FILE: frontend_nuxt/app/components/journey/p1/P1JourneyOrchestrator.vue:13
- FILE: frontend_nuxt/app/components/journey/p1/P1JourneyOrchestrator.vue:16

### 4.4 Lot D (home-cta-* → PPButton)
- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:18
- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:21

---

## 5) Points bloquants (si existants)

> Ne noter ici que les cas où la migration mécanique n’est pas triviale :
> - CTA généré dynamiquement
> - classes conditionnelles complexes
> - slot/structure HTML non standard
> - dépendances à un style local

- ResourceCard: lien <a> avec @click.prevent + window.open (comportement non standard).
