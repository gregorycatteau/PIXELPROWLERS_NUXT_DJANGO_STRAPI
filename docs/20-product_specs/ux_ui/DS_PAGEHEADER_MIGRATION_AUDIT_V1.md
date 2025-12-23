# DS_PAGEHEADER_MIGRATION_AUDIT_V1 — Inventaire PageHeader → PPPageHeader (ENFORCED)

> Objectif : inventaire exhaustif pour migration mécanique vers `<PPPageHeader />` (atome DS page-level).
> On ne modifie pas de code ici : on dresse l’inventaire + lots + blockers.

---

## 0) Méthode d’audit (obligatoire)

Scanner uniquement :
- `frontend_nuxt/app/`
- `frontend_nuxt/components/`
- `frontend_nuxt/pages/`
- `frontend_nuxt/layouts/`

Chercher les patterns de “page header” legacy :
- `h1` ou `h2` en haut de page + texte d’intro + actions
- classes legacy : `SectionIntro`, `PrimaryCard`, `SecondaryCard`, `Hero*`, `PageHeader*`
- pages statiques qui répètent : intro bloc + CTA
- composants home/hero qui jouent le rôle de “page header” (sans être un <header> standard)

Ne pas inclure les headers de section (h2/h3/h4 au milieu de page) : ils relèvent de PPSectionHeader.

---

## 1) Résumé (à remplir)

- Nombre total d’occurrences `SectionIntro` : **10**
- Nombre total d’occurrences `PrimaryCard` : **5**
- Nombre total d’occurrences `Hero` (classes ou composants) qui font office de header : **2**
- Nombre total de `h1` détectés dans pages/layouts : **9**
- Nombre de “page header-like containers” (h1/h2 + lead + actions) : **12**

---

## 2) Inventaire — pages concernées (priorité)

> Format strict :
> - `FILE: <path>:<line>`
> - `ROLE: <home|static|journey|legal|unknown>`
> - `CURRENT_PATTERN: <SectionIntro/PrimaryCard/Hero/custom>`
> - `TITLE_LEVEL: <h1|h2>`
> - `LEAD: <present|absent>`
> - `ACTIONS: <none|cta|mixed>`
> - `WRAPPER: <none|PPCard candidate|already card>`
> - `TARGET_PPPageHeader: as="h1|h2" align="left|center" density="compact|comfort" + slots used`

- FILE: frontend_nuxt/app/pages/accompagnement-formation.vue:4
- ROLE: static
- CURRENT_PATTERN: SectionIntro/PrimaryCard
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: already card
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/confidentialite.vue:4
- ROLE: legal
- CURRENT_PATTERN: SectionIntro/PrimaryCard
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: already card
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/a-propos.vue:4
- ROLE: static
- CURRENT_PATTERN: SectionIntro/PrimaryCard
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: already card
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/relinium.vue:4
- ROLE: static
- CURRENT_PATTERN: SectionIntro/PrimaryCard
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: already card
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/mentions-legales.vue:4
- ROLE: legal
- CURRENT_PATTERN: SectionIntro/PrimaryCard
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: already card
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/contact.vue:3
- ROLE: static
- CURRENT_PATTERN: custom
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: none
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/blog.vue:3
- ROLE: static
- CURRENT_PATTERN: custom
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: none
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/ressources.vue:3
- ROLE: static
- CURRENT_PATTERN: custom
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: none
- WRAPPER: none
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead

- FILE: frontend_nuxt/app/pages/parcours/[journeySlug].vue:5
- ROLE: journey
- CURRENT_PATTERN: custom
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: cta
- WRAPPER: none
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead/actions

---

## 3) Inventaire — composants header-like (Hero / Intro)

> Même format strict, mais pour les composants (ex: HomeHeroSection, etc.)
- `FILE: ...`

- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:4
- ROLE: home
- CURRENT_PATTERN: Hero/custom
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: mixed
- WRAPPER: none
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots title/lead/actions/meta

- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:10
- ROLE: home
- CURRENT_PATTERN: Hero/custom
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: cta
- WRAPPER: none
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots eyebrow/title/lead/actions

- FILE: frontend_nuxt/app/components/journey/p1/P1IntroE0.vue:8
- ROLE: journey
- CURRENT_PATTERN: custom
- TITLE_LEVEL: h1
- LEAD: present
- ACTIONS: cta
- WRAPPER: none
- TARGET_PPPageHeader: as="h1" align="left" density="comfort" + slots title/lead/actions

---

## 4) Lots de migration (proposition mécanique)

> Lots “simples et sûrs” :
> - Lot C1 : pages statiques `PrimaryCard SectionIntro` → `PPCard + PPPageHeader`
> - Lot C2 : hero home (si applicable) → `PPPageHeader align="center" + actions`
> - Lot C3 : pages légales (confidentialité/mentions) → `PPPageHeader` sans CTA (density compact)

### 4.1 Lot C1 (pages statiques)
- FILE: frontend_nuxt/app/pages/accompagnement-formation.vue:4
- FILE: frontend_nuxt/app/pages/a-propos.vue:4
- FILE: frontend_nuxt/app/pages/relinium.vue:4
- FILE: frontend_nuxt/app/pages/contact.vue:3
- FILE: frontend_nuxt/app/pages/blog.vue:3
- FILE: frontend_nuxt/app/pages/ressources.vue:3

### 4.2 Lot C2 (hero/home)
- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:4
- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:10

### 4.3 Lot C3 (pages légales)
- FILE: frontend_nuxt/app/pages/confidentialite.vue:4
- FILE: frontend_nuxt/app/pages/mentions-legales.vue:4

---

## 5) Points bloquants (si existants)

> Exemples :
> - plusieurs h1 sur une page
> - titre composé très custom (span gradients etc.)
> - actions layout exotique (grid/absolute)
> - dépendance à styles legacy non documentés

Lister `FILE:line` + 1 phrase max.

- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:4 — actions + microcopy imbriqués, risque de mapping slot/meta.
- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:10 — lead multi-paragraphes + actions en bas (layout hero spécifique).
- FILE: frontend_nuxt/app/components/journey/p1/P1IntroE0.vue:8 — header + CTA séparés en footer, nécessite arbitrage slots/actions.
- FILE: frontend_nuxt/app/pages/parcours/[journeySlug].vue:5 — actions CTA immédiatement après header, dépendance au layout `space-y-3`.

---

## 6) Reco de guard (post-migration)

- Quelles classes legacy interdire après migration (ex: SectionIntro / PrimaryCard SectionIntro / Hero header wrappers)
- Tolérances transitoires éventuelles
- Nom du script guard + npm script recommandé

- Classes legacy à interdire: `SectionIntro`, `PrimaryCard SectionIntro`, `home-section-header`, `pp-section-header` dans les top-of-page containers, `Hero*` wrappers utilisés pour titres h1.
- Tolérances transitoires: `SectionIntro` sur pages non migrées tant que Lot C n’est pas terminé.
- Guard recommandé: `frontend_nuxt/scripts/guards/no-legacy-pageheader-classes.mjs` + script `pageheader:guard` dans `frontend_nuxt/package.json`.

---

--- END FILE ---
