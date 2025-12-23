# DS_SECTIONHEADER_MIGRATION_AUDIT_V1 — Inventaire SectionHeader → PPSectionHeader (ENFORCED)

> Objectif : inventaire exhaustif pour migration mécanique vers `<PPSectionHeader />` (atome DS).
> On ne modifie pas de code ici : on dresse la carte du terrain + lots de migration.

---

## 0) Méthode d’audit (obligatoire)

Scanner uniquement ces répertoires (front) :
- `frontend_nuxt/app/`
- `frontend_nuxt/components/`
- `frontend_nuxt/pages/`
- `frontend_nuxt/layouts/`
- `frontend_nuxt/assets/css/pp.components.css`

Chercher les patterns “section header” :
- composants dont le nom contient `Header` ou `SectionHeader`
- classes contenant `header` ou `section-header` ou `SectionIntro`
- conteneurs avec structure typique :
  - `h2|h3|h4` + lead (`p` muted) + actions (CTA/chips)
  - conteneur avec `border-b` / `pb-*` / `space-y-*` autour d’un titre
- classes DS existantes liées aux headers (si présentes dans CSS), ex :
  - `pp-globalbilan-section-header`
  - `SectionIntro`
  - `PrimaryCard SectionIntro` (si utilisé comme “header-like”)
- repérer aussi les “headers implicites” : blocs où on répète toujours la même structure (titre + texte d’intro + actions)

---

## 1) Résumé (à remplir)

- Nombre total de composants `.vue` dont le nom contient `Header` : **2**
- Nombre total d’occurrences de `pp-section-header` dans templates : **9**
- Nombre total d’occurrences de classes contenant `section-header` : **25**
- Nombre total d’occurrences de classes contenant `SectionIntro` : **5**
- Nombre total de conteneurs “header-like” détectés (h2/h3/h4 + lead + actions) : **31**
- Nombre total de styles “header/section” définis dans `pp.components.css` : **14**

---

## 2) Inventaire — composants header existants

> Format strict :
> - `FILE: <path>`
> - `ROLE: <journey|bilan|home|legal|generic|unknown>`
> - `STRUCTURE: <short description>`
> - `TITLE_LEVELS: <h2|h3|h4>`
> - `CLASSES: <container class excerpt>`
> - `ACTIONS: <none|cta|chips|mixed>`
> - `TARGET_PPSectionHeader: as=... density=... eyebrow? lead? slots?`

- FILE: frontend_nuxt/app/components/PPSectionHeader.vue
- ROLE: generic
- STRUCTURE: header with eyebrow/title/lead/meta/actions slots
- TITLE_LEVELS: h2|h3|h4
- CLASSES: pp-section-header / pp-section-header__*
- ACTIONS: mixed
- TARGET_PPSectionHeader: as=h2|h3|h4 density=compact|comfort eyebrow? lead? slots? (already target)

- FILE: frontend_nuxt/app/components/journey/JourneyStepHeader.vue
- ROLE: journey
- STRUCTURE: header with optional “Important” badge + h2 title + subtitle
- TITLE_LEVELS: h2
- CLASSES: JourneyStepHeader
- ACTIONS: none
- TARGET_PPSectionHeader: as=h2 density=compact eyebrow? (badge via meta slot) lead=yes slots=meta

---

## 3) Inventaire — “header-like containers” dans les templates

> Format strict par occurrence :
> - `FILE: <path>:<line>`
> - `ELEMENT: <header|div|section|...>`
> - `TITLE: <h2|h3|h4> (texte ou binding si simple)`
> - `LEAD: <present|absent> (p muted / intro)`
> - `ACTIONS: <present|absent> (cta/chips)`
> - `CLASSES: <excerpt>`
> - `WHY_HEADER_LIKE: <border-b/pb/space-y/title+lead/actions/etc.>`
> - `TARGET_PPSectionHeader: as="h2|h3|h4" density="compact|comfort" eyebrow=<yes/no> lead=<yes/no> actions=<yes/no>`

⚠️ Important :
- Donne un inventaire exhaustif mais **sans doublonner** : si un même bloc est répété via v-for, tu listes l’occurrence template unique.
- Prioriser les parcours/journey/bilan (industrialisation) avant les pages statiques.

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:19
- ELEMENT: section
- TITLE: h2 (via JourneyStepHeader)
- LEAD: present (subtitle)
- ACTIONS: present (summary chips)
- CLASSES: pp-globalbilan-header
- WHY_HEADER_LIKE: title+lead+meta/chips in header container
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=yes (meta slot)

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:72
- ELEMENT: div
- TITLE: h2 ("Repères (version publique)")
- LEAD: absent
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: section header container with title
- TARGET_PPSectionHeader: as="h2" density="compact" eyebrow=no lead=no actions=no

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:217
- ELEMENT: div
- TITLE: h2 (binding)
- LEAD: present (intro + extra line)
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: title + lead + supporting copy
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no (meta slot for extra line)

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:297
- ELEMENT: div
- TITLE: h2 (binding)
- LEAD: present
- ACTIONS: present (PPChip mode toggles)
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: title + lead + actions row
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=yes

- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue:3
- ELEMENT: div
- TITLE: h2 ("Panorama & blocs")
- LEAD: absent
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: section header container with title
- TARGET_PPSectionHeader: as="h2" density="compact" eyebrow=no lead=no actions=no

- FILE: frontend_nuxt/app/components/journey/bilan/EngagementLevelsPanel.vue:3
- ELEMENT: div
- TITLE: h2 ("Options de suite (N1-N4)")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: title + intro paragraph
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/journey/bilan/BilanLandingPanel.vue:5
- ELEMENT: div
- TITLE: h2 ("Atterrissage systémique")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: title + lead, framed section
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:3
- ELEMENT: div
- TITLE: h2 ("Actions & ressources")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: title + intro paragraph
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:3
- ELEMENT: div
- TITLE: h2 (binding)
- LEAD: present
- ACTIONS: absent (actions row is outside header container)
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: title + intro paragraph
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanExportPanel.vue:3
- ELEMENT: div
- TITLE: h2 (binding)
- LEAD: absent
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: section header container with title
- TARGET_PPSectionHeader: as="h2" density="compact" eyebrow=no lead=no actions=no

- FILE: frontend_nuxt/app/components/journey/p1/P1HypothesesSection.vue:3
- ELEMENT: div
- TITLE: h2 (binding)
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header
- WHY_HEADER_LIKE: title + intro paragraph
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:3
- ELEMENT: div
- TITLE: h2 ("Hypothèses structurantes")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-globalbilan-section-header space-y-1
- WHY_HEADER_LIKE: title + lead + meta line (selection count)
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no (meta slot)

- FILE: frontend_nuxt/app/components/home/FitSection.vue:3
- ELEMENT: div
- TITLE: h2 ("Clarifions vite si on avance ou non")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-section-header
- WHY_HEADER_LIKE: title + lead + eyebrow
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/AxesSection.vue:3
- ELEMENT: header
- TITLE: h2 ("Trois axes pour rendre ta situation lisible")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-section-header
- WHY_HEADER_LIKE: title + lead + eyebrow
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/TimelineSection.vue:3
- ELEMENT: header
- TITLE: h2 ("Quatre étapes, pas plus")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-section-header
- WHY_HEADER_LIKE: title + lead + eyebrow
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:3
- ELEMENT: header
- TITLE: h2 ("Indices que tu es vraiment au bon endroit")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-section-header
- WHY_HEADER_LIKE: title + lead + eyebrow
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/HomeFitAudienceSection.vue:3
- ELEMENT: header
- TITLE: h2 (binding)
- LEAD: present (subtitle)
- ACTIONS: absent
- CLASSES: home-section-header
- WHY_HEADER_LIKE: title + lead in header container
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/HomeNowSection.vue:3
- ELEMENT: header
- TITLE: h2 (binding)
- LEAD: present (subtitle)
- ACTIONS: absent
- CLASSES: home-section-header
- WHY_HEADER_LIKE: title + lead in header container
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:4
- ELEMENT: div
- TITLE: h1 (binding)
- LEAD: present (subtitle + microcopy)
- ACTIONS: present (primary/secondary CTA)
- CLASSES: home-section-header space-y-4
- WHY_HEADER_LIKE: hero header with title + lead + actions
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=yes (needs h1 support)

- FILE: frontend_nuxt/app/components/home/HomeJourneysGridSection.vue:3
- ELEMENT: header
- TITLE: h2 (binding)
- LEAD: present
- ACTIONS: absent
- CLASSES: home-section-header
- WHY_HEADER_LIKE: title + subtitle
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/HomeHowWeWorkSection.vue:3
- ELEMENT: header
- TITLE: h2 (binding)
- LEAD: present (subtitle)
- ACTIONS: absent
- CLASSES: home-section-header
- WHY_HEADER_LIKE: title + subtitle
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no

- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:10
- ELEMENT: div
- TITLE: h1 ("Salut… aujourd’hui, tu en es où, pour de vrai ?")
- LEAD: present (multi-paragraph lead)
- ACTIONS: absent
- CLASSES: HeroLeft pp-section-header
- WHY_HEADER_LIKE: title + lead + eyebrow in header container
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support)

- FILE: frontend_nuxt/app/components/home/ManifestoSection.vue:10
- ELEMENT: div
- TITLE: h2 ("Ce qu’on te promet, sans maquillage")
- LEAD: present
- ACTIONS: absent
- CLASSES: ManifesteContent pp-section-header
- WHY_HEADER_LIKE: title + lead, followed by long content
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=no lead=yes actions=no (may need slot for long content)

- FILE: frontend_nuxt/app/pages/contact.vue:3
- ELEMENT: header
- TITLE: h1 ("Nous écrire")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-section-header
- WHY_HEADER_LIKE: page header with eyebrow + title + lead
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support)

- FILE: frontend_nuxt/app/pages/blog.vue:3
- ELEMENT: header
- TITLE: h1 ("Nos notes et retours d’expérience arrivent bientôt")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-section-header
- WHY_HEADER_LIKE: page header with eyebrow + title + lead
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support)

- FILE: frontend_nuxt/app/pages/ressources.vue:3
- ELEMENT: header
- TITLE: h1 ("Ressources")
- LEAD: present
- ACTIONS: absent
- CLASSES: pp-section-header
- WHY_HEADER_LIKE: page header with eyebrow + title + lead
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support)

- FILE: frontend_nuxt/app/pages/accompagnement-formation.vue:4
- ELEMENT: div
- TITLE: h1 ("Formats courts pour avancer vite")
- LEAD: present
- ACTIONS: absent
- CLASSES: PrimaryCard SectionIntro
- WHY_HEADER_LIKE: title + lead + eyebrow inside PrimaryCard
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support + PrimaryCard coupling)

- FILE: frontend_nuxt/app/pages/confidentialite.vue:4
- ELEMENT: div
- TITLE: h1 ("Politique de confidentialité")
- LEAD: present
- ACTIONS: absent
- CLASSES: PrimaryCard SectionIntro
- WHY_HEADER_LIKE: title + lead + eyebrow inside PrimaryCard
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support + PrimaryCard coupling)

- FILE: frontend_nuxt/app/pages/a-propos.vue:4
- ELEMENT: div
- TITLE: h1 ("PixelProwlers, studio pluriactif")
- LEAD: present
- ACTIONS: absent
- CLASSES: PrimaryCard SectionIntro
- WHY_HEADER_LIKE: title + lead + eyebrow inside PrimaryCard
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support + PrimaryCard coupling)

- FILE: frontend_nuxt/app/pages/relinium.vue:4
- ELEMENT: div
- TITLE: h1 ("Relinium — labo interne")
- LEAD: present
- ACTIONS: absent
- CLASSES: PrimaryCard SectionIntro
- WHY_HEADER_LIKE: title + lead + eyebrow inside PrimaryCard
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support + PrimaryCard coupling)

- FILE: frontend_nuxt/app/pages/mentions-legales.vue:4
- ELEMENT: div
- TITLE: h1 ("Mentions légales")
- LEAD: present
- ACTIONS: absent
- CLASSES: PrimaryCard SectionIntro
- WHY_HEADER_LIKE: title + lead + eyebrow inside PrimaryCard
- TARGET_PPSectionHeader: as="h2" density="comfort" eyebrow=yes lead=yes actions=no (needs h1 support + PrimaryCard coupling)

---

## 4) Inventaire — styles header CSS (pp.components.css)

Lister ici les classes CSS qui servent de “section header”, ex :
- `.pp-globalbilan-section-header`
- `.SectionIntro`
- toute autre classe “header-like”

Format :
- `CLASS: <name>`
- `FILE: frontend_nuxt/assets/css/pp.components.css:<approx line>`
- `NOTES: <role / usage guess>`

- CLASS: .pp-section-header
- FILE: frontend_nuxt/assets/css/pp.components.css:20
- NOTES: legacy section header container (home/pages)

- CLASS: .pp-section-label
- FILE: frontend_nuxt/assets/css/pp.components.css:24
- NOTES: eyebrow label for section headers

- CLASS: .pp-section-title
- FILE: frontend_nuxt/assets/css/pp.components.css:28
- NOTES: legacy section header title

- CLASS: .pp-section-desc
- FILE: frontend_nuxt/assets/css/pp.components.css:32
- NOTES: legacy section header lead/description

- CLASS: .pp-section-header
- FILE: frontend_nuxt/assets/css/pp.components.css:163
- NOTES: PPSectionHeader atom container

- CLASS: .pp-section-header--compact
- FILE: frontend_nuxt/assets/css/pp.components.css:167
- NOTES: PPSectionHeader compact density

- CLASS: .pp-section-header__eyebrow
- FILE: frontend_nuxt/assets/css/pp.components.css:171
- NOTES: PPSectionHeader eyebrow

- CLASS: .pp-section-header__title
- FILE: frontend_nuxt/assets/css/pp.components.css:175
- NOTES: PPSectionHeader title

- CLASS: .pp-section-header__lead
- FILE: frontend_nuxt/assets/css/pp.components.css:179
- NOTES: PPSectionHeader lead

- CLASS: .pp-section-header__meta
- FILE: frontend_nuxt/assets/css/pp.components.css:183
- NOTES: PPSectionHeader meta slot

- CLASS: .pp-section-header__actions
- FILE: frontend_nuxt/assets/css/pp.components.css:187
- NOTES: PPSectionHeader actions slot

- CLASS: .pp-globalbilan-header
- FILE: frontend_nuxt/assets/css/pp.components.css:266
- NOTES: Global Bilan page header wrapper (JourneyStepHeader + summary chips)

- CLASS: .pp-globalbilan-section-header
- FILE: frontend_nuxt/assets/css/pp.components.css:282
- NOTES: Global Bilan section header blocks

- CLASS: .home-section-header
- FILE: frontend_nuxt/assets/css/pp.components.css:431
- NOTES: Home section headers (title + subtitle)

---

## 5) Lots de migration (proposition mécanique)

> Construire des lots “simples et sûrs” :
> - Lot A : headers déjà quasi-standard (border-b/pb/lead/actions) → migration mécanique immédiate vers `<PPSectionHeader>`
> - Lot B : headers partiellement standards (titre + lead mais actions atypiques) → migration avec petits ajustements de slot
> - Lot C : headers fortement legacy (SectionIntro/PrimaryCard etc.) → à cadrer après DS stable

### 5.1 Lot A (migration mécanique facile)
- FILE: frontend_nuxt/app/components/home/FitSection.vue:3
- FILE: frontend_nuxt/app/components/home/AxesSection.vue:3
- FILE: frontend_nuxt/app/components/home/TimelineSection.vue:3
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:3
- FILE: frontend_nuxt/app/components/home/HomeFitAudienceSection.vue:3
- FILE: frontend_nuxt/app/components/home/HomeNowSection.vue:3
- FILE: frontend_nuxt/app/components/home/HomeJourneysGridSection.vue:3
- FILE: frontend_nuxt/app/components/home/HomeHowWeWorkSection.vue:3
- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue:3
- FILE: frontend_nuxt/app/components/journey/bilan/EngagementLevelsPanel.vue:3
- FILE: frontend_nuxt/app/components/journey/bilan/BilanLandingPanel.vue:5
- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:3
- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:3
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanExportPanel.vue:3
- FILE: frontend_nuxt/app/components/journey/p1/P1HypothesesSection.vue:3
- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:3
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:72

### 5.2 Lot B (quelques slots/actions)
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:19
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:217
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:297
- FILE: frontend_nuxt/app/components/home/ManifestoSection.vue:10

### 5.3 Lot C (legacy / pages statiques / styles historiques)
- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:4
- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:10
- FILE: frontend_nuxt/app/pages/contact.vue:3
- FILE: frontend_nuxt/app/pages/blog.vue:3
- FILE: frontend_nuxt/app/pages/ressources.vue:3
- FILE: frontend_nuxt/app/pages/accompagnement-formation.vue:4
- FILE: frontend_nuxt/app/pages/confidentialite.vue:4
- FILE: frontend_nuxt/app/pages/a-propos.vue:4
- FILE: frontend_nuxt/app/pages/relinium.vue:4
- FILE: frontend_nuxt/app/pages/mentions-legales.vue:4

---

## 6) Points bloquants (si existants)

> Ne noter ici que les cas où la migration mécanique n’est pas triviale :
> - titres injectés via slot complexe
> - niveaux h2/h3 incohérents
> - actions trop custom (layout grid/absolute)
> - dépendance à une classe legacy non documentée
> - usage “header” couplé à PPCard ou autre wrapper

- FILE: frontend_nuxt/app/components/home/HomeHeroSection.vue:4 — titre en h1 (PPSectionHeader ne supporte pas h1) + actions complexes.
- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:10 — h1 + lead multi-paragraphes + layout hero spécifique.
- FILE: frontend_nuxt/app/pages/contact.vue:3 — h1 sur page statique (support h1 requis).
- FILE: frontend_nuxt/app/pages/blog.vue:3 — h1 sur page statique (support h1 requis).
- FILE: frontend_nuxt/app/pages/ressources.vue:3 — h1 sur page statique (support h1 requis).
- FILE: frontend_nuxt/app/pages/accompagnement-formation.vue:4 — wrapper `PrimaryCard SectionIntro` couplé + h1.
- FILE: frontend_nuxt/app/pages/confidentialite.vue:4 — wrapper `PrimaryCard SectionIntro` couplé + h1.
- FILE: frontend_nuxt/app/pages/a-propos.vue:4 — wrapper `PrimaryCard SectionIntro` couplé + h1.
- FILE: frontend_nuxt/app/pages/relinium.vue:4 — wrapper `PrimaryCard SectionIntro` couplé + h1.
- FILE: frontend_nuxt/app/pages/mentions-legales.vue:4 — wrapper `PrimaryCard SectionIntro` couplé + h1.
- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:19 — header composé (JourneyStepHeader + summary chips) nécessite mapping meta/actions.
- FILE: frontend_nuxt/app/components/home/ManifestoSection.vue:10 — header contient une longue section de contenu (liste + note) au sein du même bloc.

---

## 7) Reco de guard (post-migration)

> À remplir : comment empêcher le retour de headers ad hoc après migration
- Pattern legacy à interdire (classes, structures)
- Où brancher le guard (npm script)
- Ce que le guard doit tolérer (transitoire Lot C)

- Pattern legacy à interdire: `.pp-section-header` (usage direct), `.home-section-header`, `.pp-globalbilan-section-header`, `.pp-globalbilan-header` en templates (remplacés par `<PPSectionHeader>`).
- Où brancher le guard: `frontend_nuxt/scripts/guards/no-legacy-sectionheader-classes.mjs` + script `sectionheader:guard` dans `frontend_nuxt/package.json`.
- Ce que le guard doit tolérer: pages Lot C avec `SectionIntro` et `PrimaryCard` tant que le support h1/legacy n’est pas traité.

---

--- END FILE ---
