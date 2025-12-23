# DS_CARD_MIGRATION_AUDIT_V1 — Inventaire Card → PPCard (ENFORCED)

> Objectif : inventaire exhaustif pour migration mécanique vers `PPCard` (atome DS).
> On ne modifie pas de code ici : on dresse la carte du terrain.

---

## 0) Méthode d’audit (obligatoire)

Scanner uniquement ces répertoires (front) :
- `frontend_nuxt/app/`
- `frontend_nuxt/components/`
- `frontend_nuxt/pages/`
- `frontend_nuxt/layouts/`
- `frontend_nuxt/assets/css/pp.components.css`

Chercher les occurrences (patterns fréquents de “cards”) :
- classes contenant `card` (ex: `*Card*`, `pp-card`, `journey-card`, `resource-card`, etc.)
- `rounded-` + `border` + `bg-` combinés dans un même conteneur
- `shadow-` sur conteneur
- `backdrop-blur` / `ring-` sur conteneur
- composants dont le nom contient `Card` (ResourceCard, etc.)

---

## 1) Résumé (à remplir)

- Nombre total de composants `.vue` avec nom contenant `Card` : **4**
- Nombre total d’occurrences de classes contenant `card` dans templates : **96**
- Nombre total de “containers” (rounded+border+bg) détectés : **12**
- Nombre de styles “card” définis dans `pp.components.css` : **14**

---

## 2) Inventaire — composants Card existants

> Format strict :
> - `FILE: <path>`
> - `ROLE: <resource|bilan|question|hypothesis|generic|unknown>`
> - `STRUCTURE: <short description>`
> - `CLASSES: <container class excerpt>`
> - `NOTES: <only if needed>`

- FILE: frontend_nuxt/app/components/journey/ResourceCard.vue
- ROLE: resource
- STRUCTURE: article avec header (niveau + titre), description, CTA
- CLASSES: ResourceCard pp-journey-card-interactive
- NOTES: 

- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue
- ROLE: bilan
- STRUCTURE: section avec header puis cartes internes (pp-globalbilan-card + grid axes)
- CLASSES: pp-globalbilan-card (container interne)
- NOTES: 

- FILE: frontend_nuxt/app/components/journey/CarrefourChoiceCard.vue
- ROLE: question
- STRUCTURE: article avec header, description, bouton CTA
- CLASSES: CarrefourChoiceCard pp-card pp-journey-card-interactive
- NOTES: 

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue
- ROLE: generic
- STRUCTURE: article avec header, sections problème/solution, CTA
- CLASSES: home-journey-card pp-journey-card
- NOTES: 

---

## 3) Inventaire — “card-like containers” dans les templates

> Format strict par occurrence :
> - `FILE: <path>:<line>`
> - `ELEMENT: <div|section|article|...>`
> - `CLASSES: <excerpt>`
> - `WHY_CARD_LIKE: <rounded/border/bg/shadow/ring/etc.>`
> - `TARGET_PPCard: <default|hoverable|accent|indicator>` (best guess)

- FILE: frontend_nuxt/app/components/resources/ResourceList.vue:10
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaE1.vue:33
- ELEMENT: div
- CLASSES: pp-journey-card-soft
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaBilanE2.vue:14
- ELEMENT: div
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaBilanE2.vue:26
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaBilanE2.vue:47
- ELEMENT: section
- CLASSES: pp-journey-card-soft space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/ResourceCard.vue:2
- ELEMENT: article
- CLASSES: ResourceCard pp-journey-card-interactive
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/journey/JourneyEngineUniversal.vue:5
- ELEMENT: div
- CLASSES: pp-card p-4 sm:p-5 space-y-2 border border-[color:var(--color-accent-border)] bg-[color:var(--color-accent-quiet)]
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:2
- ELEMENT: section
- CLASSES: pp-globalbilan-card space-y-4
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:30
- ELEMENT: article
- CLASSES: pp-globalbilan-theme-card flex flex-col gap-4 rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanIssuesList.vue:113
- ELEMENT: article
- CLASSES: pp-globalbilan-theme-card space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanExportPanel.vue:6
- ELEMENT: div
- CLASSES: pp-globalbilan-card space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:13
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/ResourcesActionsPanel.vue:81
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:18
- ELEMENT: article
- CLASSES: pp-globalbilan-theme-card flex flex-col gap-4 rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:123
- ELEMENT: div
- CLASSES: pp-globalbilan-card space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue:7
- ELEMENT: div
- CLASSES: pp-globalbilan-card space-y-4
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue:41
- ELEMENT: div
- CLASSES: pp-globalbilan-axe-card h-full w-full min-w-0 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/EngagementLevelsPanel.vue:13
- ELEMENT: article
- CLASSES: pp-globalbilan-option-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanLandingPanel.vue:14
- ELEMENT: div
- CLASSES: pp-globalbilan-card space-y-3 max-w-3xl
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanLandingPanel.vue:29
- ELEMENT: div
- CLASSES: pp-globalbilan-card text-sm text-[color:var(--color-text-muted)] space-y-1 max-w-3xl
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:49
- ELEMENT: div
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:74
- ELEMENT: div
- CLASSES: pp-globalbilan-card pp-globalbilan-card--primary space-y-5 max-w-3xl mx-auto
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: accent

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:226
- ELEMENT: article
- CLASSES: pp-globalbilan-theme-card space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:319
- ELEMENT: div
- CLASSES: pp-globalbilan-card space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:354
- ELEMENT: div
- CLASSES: pp-globalbilan-card space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/GlobalBilanEngine.vue:434
- ELEMENT: details
- CLASSES: pp-globalbilan-aside-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: indicator

- FILE: frontend_nuxt/app/components/journey/p1/P1GlobalBilanAside.vue:21
- ELEMENT: div
- CLASSES: pp-globalbilan-aside-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: indicator

- FILE: frontend_nuxt/app/pages/parcours/[journeySlug].vue:56
- ELEMENT: div
- CLASSES: pp-card p-6 space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/accompagnement-formation.vue:4
- ELEMENT: div
- CLASSES: PrimaryCard SectionIntro
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/accompagnement-formation.vue:13
- ELEMENT: article
- CLASSES: SecondaryCard OfferCard
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/confidentialite.vue:4
- ELEMENT: div
- CLASSES: PrimaryCard SectionIntro
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/a-propos.vue:4
- ELEMENT: div
- CLASSES: PrimaryCard SectionIntro
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/a-propos.vue:13
- ELEMENT: div
- CLASSES: SecondaryCard PillarCard
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1BlocksHub.vue:59
- ELEMENT: article
- CLASSES: pp-bilan-card-soft space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/relinium.vue:4
- ELEMENT: div
- CLASSES: PrimaryCard SectionIntro
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/relinium.vue:13
- ELEMENT: article
- CLASSES: SecondaryCard LabCard
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/pages/mentions-legales.vue:4
- ELEMENT: div
- CLASSES: PrimaryCard SectionIntro
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1SystemicLandingSection.vue:16
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1SystemicLandingSection.vue:163
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Bilan.vue:14
- ELEMENT: article
- CLASSES: pp-bilan-block-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Bilan.vue:18
- ELEMENT: div
- CLASSES: pp-bilan-block-card-text space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Bilan.vue:23
- ELEMENT: article
- CLASSES: pp-bilan-block-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Bilan.vue:27
- ELEMENT: div
- CLASSES: pp-bilan-block-card-text space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Bilan.vue:33
- ELEMENT: section
- CLASSES: pp-bilan-block-stats-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: indicator

- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Bilan.vue:66
- ELEMENT: article
- CLASSES: pp-bilan-block-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Bilan.vue:69
- ELEMENT: div
- CLASSES: pp-bilan-block-card-text space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Bilan.vue:61
- ELEMENT: article
- CLASSES: pp-bilan-block-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Bilan.vue:64
- ELEMENT: div
- CLASSES: pp-bilan-block-card-text space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1HypothesesSection.vue:16
- ELEMENT: article
- CLASSES: pp-globalbilan-hypothesis-card space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1JourneyOrchestrator.vue:5
- ELEMENT: div
- CLASSES: pp-card p-4 sm:p-5 space-y-2 border border-[color:var(--color-accent-border)] bg-[color:var(--color-accent-quiet)]
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:36
- ELEMENT: div
- CLASSES: pp-journey-card-soft space-y-2
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:93
- ELEMENT: article
- CLASSES: pp-bilan-axis-card pp-bilan-axis-card-tensions
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:100
- ELEMENT: article
- CLASSES: pp-bilan-axis-card pp-bilan-axis-card-interpretation
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:162
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:177
- ELEMENT: article
- CLASSES: pp-journey-card-soft space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaBilanE2.vue:220
- ELEMENT: section
- CLASSES: pp-journey-card-soft space-y-3
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/CarrefourChoiceCard.vue:2
- ELEMENT: article
- CLASSES: CarrefourChoiceCard pp-card pp-journey-card-interactive
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:3
- ELEMENT: article
- CLASSES: home-journey-card pp-journey-card
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:9
- ELEMENT: div
- CLASSES: home-journey-card-header
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:19
- ELEMENT: section
- CLASSES: home-journey-card-section home-journey-card-problem
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:28
- ELEMENT: section
- CLASSES: home-journey-card-mainflow
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:29
- ELEMENT: div
- CLASSES: home-journey-card-section home-journey-card-solution
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:38
- ELEMENT: div
- CLASSES: home-journey-card-cta
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:41
- ELEMENT: button
- CLASSES: home-journey-card-button
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/FitSection.vue:12
- ELEMENT: article
- CLASSES: pp-card pp-card-hover pp-tilt-card FitCard
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/home/FitSection.vue:13
- ELEMENT: div
- CLASSES: FitCardHeader
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/FitSection.vue:25
- ELEMENT: article
- CLASSES: pp-card pp-card-hover pp-tilt-card FitCard
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/home/FitSection.vue:26
- ELEMENT: div
- CLASSES: FitCardHeader
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeNowSection.vue:12
- ELEMENT: article
- CLASSES: home-now-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/AxesSection.vue:19
- ELEMENT: article
- CLASSES: pp-card pp-card-hover AxisCard pp-reveal
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:18
- ELEMENT: button
- CLASSES: pp-card-journey pp-tilt-card pp-reveal
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:19
- ELEMENT: button
- CLASSES: [{ IndicatorWide: index === 0 }, selectedJourneyId === item.journeyId ? 'pp-card-journey-active' : '']
- WHY_CARD_LIKE: class contains card + active state
- TARGET_PPCard: accent

- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:26
- ELEMENT: div
- CLASSES: CardSelectedBadge pp-badge-pill
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/TimelineSection.vue:25
- ELEMENT: div
- CLASSES: TimelineContent pp-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeFitAudienceSection.vue:9
- ELEMENT: article
- CLASSES: home-fit-card home-fit-card-highlight
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeFitAudienceSection.vue:15
- ELEMENT: article
- CLASSES: home-fit-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HomeHowWeWorkSection.vue:12
- ELEMENT: article
- CLASSES: home-how-card
- WHY_CARD_LIKE: class contains card
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:54
- ELEMENT: button
- CLASSES: HeroJourneyCard pp-tilt-card
- WHY_CARD_LIKE: class contains card + hover/interactive
- TARGET_PPCard: hoverable

- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:55
- ELEMENT: button
- CLASSES: { HeroJourneyCardActive: journey.id === selectedJourneyId }
- WHY_CARD_LIKE: class contains card + active state
- TARGET_PPCard: accent

- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:11
- ELEMENT: article
- CLASSES: rounded-xl border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] p-4 space-y-3
- WHY_CARD_LIKE: rounded+border+bg
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:135
- ELEMENT: article
- CLASSES: rounded-lg border border-white/20 bg-[color:var(--color-panel-soft)] p-4 space-y-3
- WHY_CARD_LIKE: rounded+border+bg
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue:21
- ELEMENT: div
- CLASSES: space-y-2 rounded-lg border border-[color:var(--color-stroke)] bg-[color:var(--color-panel-soft)] px-3 py-3
- WHY_CARD_LIKE: rounded+border+bg
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanLandingPanel.vue:39
- ELEMENT: article
- CLASSES: flex flex-col gap-3 rounded-xl border border-white/20 bg-[color:var(--color-panel-soft)] p-4
- WHY_CARD_LIKE: rounded+border+bg
- TARGET_PPCard: default

- FILE: frontend_nuxt/app/components/journey/bilan/BilanLandingPanel.vue:6
- ELEMENT: div
- CLASSES: pp-globalbilan-section-header + ring-2 ring-[color:var(--color-primary)] rounded-lg (conditional)
- WHY_CARD_LIKE: ring
- TARGET_PPCard: indicator

---

## 4) Inventaire — styles card CSS

### 4.1 Styles dans pp.components.css
> Lister les classes DS déjà liées aux cards, si existantes.

- .pp-card
- .pp-card-hover
- .pp-card-accent
- .pp-card-indicator
- .pp-card-journey
- .pp-card-journey-active
- .pp-globalbilan-card
- .pp-globalbilan-card--primary
- .pp-globalbilan-option-card
- .pp-globalbilan-theme-card
- .pp-globalbilan-hypothesis-card
- .pp-globalbilan-check-card
- .pp-globalbilan-axe-card
- .pp-globalbilan-aside-card

---

## 5) Lots de migration (proposition mécanique)

> On prépare des lots simples :
> - Lot A : composants `*Card.vue` → wrapper `PPCard`
> - Lot B : containers “rounded+border+bg” → `PPCard`
> - Lot C : cards interactives (hover/ring) → `PPCard hoverable`

### 5.1 Lot A
- FILE: frontend_nuxt/app/components/journey/ResourceCard.vue
- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue
- FILE: frontend_nuxt/app/components/journey/CarrefourChoiceCard.vue
- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue

### 5.2 Lot B
- FILE: frontend_nuxt/app/components/journey/bilan/BilanBlocksSummary.vue:11
- FILE: frontend_nuxt/app/components/journey/bilan/BilanHypothesesSection.vue:135
- FILE: frontend_nuxt/app/components/journey/bilan/BilanPanoramaCard.vue:21
- FILE: frontend_nuxt/app/components/journey/bilan/BilanLandingPanel.vue:39

### 5.3 Lot C
- FILE: frontend_nuxt/app/components/journey/ResourceCard.vue:2
- FILE: frontend_nuxt/app/components/journey/CarrefourChoiceCard.vue:2
- FILE: frontend_nuxt/app/components/home/HomeJourneyCard.vue:3
- FILE: frontend_nuxt/app/components/home/FitSection.vue:12
- FILE: frontend_nuxt/app/components/home/FitSection.vue:25
- FILE: frontend_nuxt/app/components/home/AxesSection.vue:19
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:18
- FILE: frontend_nuxt/app/components/home/RecognitionSection.vue:19
- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:54
- FILE: frontend_nuxt/app/components/home/HeroSectionDraft.vue:55

---

## 6) Points bloquants (si existants)

> Exemples :
> - card très spécifique avec layout unique
> - dépendance à une classe legacy non documentée
> - logique conditionnelle complexe sur classes

- HomeJourneyCard : nombreux sous-blocs internes avec classes *card* (header/sections/cta) qui compliquent un wrapping mécanique unique.
- BilanPanoramaCard : plusieurs sous-containers card-like imbriqués (pp-globalbilan-card + axes + badges) à clarifier avant migration.
- Classes home-*/PrimaryCard/SecondaryCard réparties dans pages legacy (accompagnement-formation, a-propos, relinium, mentions-legales) sans mapping DS clair.
