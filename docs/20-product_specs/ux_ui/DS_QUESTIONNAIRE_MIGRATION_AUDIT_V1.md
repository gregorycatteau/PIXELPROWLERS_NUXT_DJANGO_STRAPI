# DS_QUESTIONNAIRE_MIGRATION_AUDIT_V1 — Inventaire Questionnaire → Atomes DS (ENFORCED)

> Objectif : inventorier TOUS les éléments UI qui composent un questionnaire (step).
> But : préparer une migration mécanique vers des atomes DS (Scale, QuestionCard, Progress, Nav…).
> Doc-only : aucun code modifié.

---

## 0) Méthode d’audit (obligatoire)

Scanner uniquement :
- `frontend_nuxt/app/`
- `frontend_nuxt/components/`
- `frontend_nuxt/pages/`
- `frontend_nuxt/layouts/`
- `frontend_nuxt/assets/css/pp.components.css`

Chercher les patterns :
- “question block” (texte question + aide + échelle/radios + skip)
- échelle **0–5** (boutons, radios, slider, chips)
- progression (bar, stepper, “0 / N”)
- navigation (suivant/précédent, finir, revenir)
- états UX : disabled, validation, erreurs, “question ignorée”
- microcopy standard (labels, “pas de collecte”, etc.)
- classes legacy (ex: *Question*, *Scale*, *Progress*, *StepNav*, etc.)
- composants dont le nom contient : `Question`, `Scale`, `Progress`, `Step`, `Panorama`, `Block`, `Survey`, `Form`

Ne pas inclure :
- Bilans/restitutions (E2, global bilan, hypothèses, etc.) sauf si un composant est partagé.

Note: les chemins `frontend_nuxt/components`, `frontend_nuxt/pages`, `frontend_nuxt/layouts` et `frontend_nuxt/assets/css/pp.components.css` sont absents dans ce repo. Scan effectué dans `frontend_nuxt/app/components`, `frontend_nuxt/app/pages`, `frontend_nuxt/app/layouts` et `frontend_nuxt/app/assets/css/pp.components.css`.

---

## 1) Résumé (à remplir)

- Nombre de composants “question” (nom contient Question) : **8**
- Nombre de composants “step questionnaire” (Step* E1/E3 etc.) : **8**
- Nombre d’occurrences “0–5” (labels ou boucles 0..5) : **0**
- Nombre d’occurrences “1–5” : **3**
- Nombre de blocs de progression (0/N, progress bar) : **8**
- Nombre de contrôles “skip/ignorer” : **4**
- Nombre de navigations step (prev/next) : **8**
- Nombre de styles questionnaire dans `pp.components.css` : **5**

---

## 2) Inventaire — composants questionnaire (core)

> Format strict :
> - `FILE: <path>`
> - `ROLE: <question_block|scale|progress|nav|wrapper|unknown>`
> - `USED_IN: <journey/step if obvious>`
> - `STRUCTURE: <1 ligne>`
> - `NOTES: <si nécessaire>`

FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue
ROLE: question_block
USED_IN: StepPanoramaE1, P1PanoramaE1, P1Questionnaire1E1, P1Questionnaire2E3, P1Block1Questionnaire, P1Block2Questionnaire, P1Block3Questionnaire, P1Block4Questionnaire
STRUCTURE: section group + badges (Question X/N + thèmes + status) + label/description/helper + scale + skip
NOTES: slot default override possible; classes legacy `JourneyQuestion*` + `pp-journey-question-card*`.

FILE: frontend_nuxt/app/components/journey/questionnaire/LikertScaleFiveSteps.vue
ROLE: scale
USED_IN: JourneyQuestionBlock (default controls)
STRUCTURE: fieldset + radiogroup + 5 labels (1–5) + sr-only label text
NOTES: classes `pp-likert-*`.

FILE: frontend_nuxt/app/components/journey/LikertScale.vue
ROLE: scale
USED_IN: aucune occurrence directe trouvée (rg)
STRUCTURE: fieldset + radiogroup + 5 labels (1–5) + skip button intégré
NOTES: classes `pp-likert-*`; copy P1.

FILE: frontend_nuxt/app/components/journey/questionnaire/QuestionSkipControl.vue
ROLE: nav
USED_IN: JourneyQuestionBlock (default controls)
STRUCTURE: button “Ignorer cette question” + état pressed
NOTES: classe `pp-likert-skip-button`.

FILE: frontend_nuxt/app/components/journey/JourneyProgressBar.vue
ROLE: progress
USED_IN: P1Questionnaire1E1, P1Questionnaire2E3
STRUCTURE: progressbar + label + valeur “current / total” + track/fill
NOTES: classes `JourneyProgress*`.

FILE: frontend_nuxt/app/components/journey/JourneyStepHeader.vue
ROLE: wrapper
USED_IN: StepPanoramaE1, P1PanoramaE1, P1Questionnaire1E1, P1Questionnaire2E3, P1Block1Questionnaire, P1Block2Questionnaire, P1Block3Questionnaire, P1Block4Questionnaire
STRUCTURE: header + title + subtitle
NOTES: classe `JourneyStep*`.

FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaE1.vue
ROLE: wrapper
USED_IN: journey core (E1_panorama)
STRUCTURE: header + helper skip notice + list JourneyQuestionBlock + nav buttons + validation error
NOTES: questionnaire step (non bilan).

FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaE1.vue
ROLE: wrapper
USED_IN: P1 step E1_panorama
STRUCTURE: header + helper skip notice + list JourneyQuestionBlock + nav buttons + validation error
NOTES: questionnaire step (non bilan).

FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire1E1.vue
ROLE: wrapper
USED_IN: P1 step E1 (Questionnaire 1)
STRUCTURE: header + progress bar + helper skip notice + list JourneyQuestionBlock + nav buttons
NOTES: questionnaire step (non bilan).

FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire2E3.vue
ROLE: wrapper
USED_IN: P1 step E3 (Questionnaire 2)
STRUCTURE: header + progress bar + helper skip notice + list JourneyQuestionBlock + nav buttons
NOTES: questionnaire step (non bilan).

FILE: frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue
ROLE: wrapper
USED_IN: P1 step B1_questions
STRUCTURE: header + helper skip notice + list JourneyQuestionBlock + followups dynamiques + nav + progress text
NOTES: questionnaire step (non bilan).

FILE: frontend_nuxt/app/components/journey/p1/P1Block2Questionnaire.vue
ROLE: wrapper
USED_IN: P1 step B2_questions
STRUCTURE: header + helper skip notice + list JourneyQuestionBlock + nav + progress text
NOTES: questionnaire step (non bilan).

FILE: frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue
ROLE: wrapper
USED_IN: P1 step B3_questions
STRUCTURE: header + helper skip notice + list JourneyQuestionBlock + followups dynamiques + nav + progress text
NOTES: questionnaire step (non bilan).

FILE: frontend_nuxt/app/components/journey/p1/P1Block4Questionnaire.vue
ROLE: wrapper
USED_IN: P1 step B4_questions
STRUCTURE: header + helper skip notice + list JourneyQuestionBlock + nav + progress text
NOTES: questionnaire step (non bilan).

---

## 3) Inventaire — occurrences “scale 0–5 / 1–5” (templates)

> Format strict par occurrence :
> - `FILE: <path>:<line>`
> - `PATTERN: <0-5 buttons|radio group|chips|slider|other>`
> - `CURRENT_CLASSES: <excerpt>`
> - `A11Y: <ok|unknown|needs>`
> - `TARGET_DS_ATOM: <PPScale5|PPScale5Compact|other>` (best guess)

FILE: frontend_nuxt/app/components/journey/questionnaire/LikertScaleFiveSteps.vue:53
PATTERN: radio group
CURRENT_CLASSES: `pp-likert-scale`, `pp-likert-track`, `pp-likert-step`, `pp-likert-step__number`, `pp-likert-step__label`
A11Y: ok
TARGET_DS_ATOM: PPScale5

FILE: frontend_nuxt/app/components/journey/LikertScale.vue:78
PATTERN: radio group
CURRENT_CLASSES: `pp-likert-scale`, `pp-likert-track`, `pp-likert-step`, `pp-likert-step__number`, `pp-likert-step__label`
A11Y: ok
TARGET_DS_ATOM: PPScale5

---

## 4) Inventaire — progression / navigation / skip

### 4.1 Progress
> - `FILE:line`
> - `PATTERN: <0/N text|bar|stepper>`
> - `TARGET_DS_ATOM: <PPProgress>`

- FILE: frontend_nuxt/app/components/journey/JourneyProgressBar.vue:2
  PATTERN: bar
  TARGET_DS_ATOM: PPProgress
- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:18
  PATTERN: 0/N text
  TARGET_DS_ATOM: PPProgress
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire1E1.vue:9
  PATTERN: bar
  TARGET_DS_ATOM: PPProgress
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire2E3.vue:10
  PATTERN: bar
  TARGET_DS_ATOM: PPProgress
- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue:107
  PATTERN: 0/N text
  TARGET_DS_ATOM: PPProgress
- FILE: frontend_nuxt/app/components/journey/p1/P1Block2Questionnaire.vue:42
  PATTERN: 0/N text
  TARGET_DS_ATOM: PPProgress
- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue:120
  PATTERN: 0/N text
  TARGET_DS_ATOM: PPProgress
- FILE: frontend_nuxt/app/components/journey/p1/P1Block4Questionnaire.vue:42
  PATTERN: 0/N text
  TARGET_DS_ATOM: PPProgress

### 4.2 Nav (prev/next)
> - `FILE:line`
> - `PATTERN: <buttons|sticky footer|other>`
> - `TARGET_DS_ATOM: <PPQuestionNav>`

- FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaE1.vue:39
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav
- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaE1.vue:38
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire1E1.vue:37
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire2E3.vue:38
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav
- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue:99
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav
- FILE: frontend_nuxt/app/components/journey/p1/P1Block2Questionnaire.vue:34
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav
- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue:112
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav
- FILE: frontend_nuxt/app/components/journey/p1/P1Block4Questionnaire.vue:34
  PATTERN: buttons
  TARGET_DS_ATOM: PPQuestionNav

### 4.3 Skip / Ignorer
> - `FILE:line`
> - `PATTERN: <link|button|chip>`
> - `TARGET_DS_ATOM: <PPSkipAction|PPChip|PPButton variant=ghost>`

- FILE: frontend_nuxt/app/components/journey/questionnaire/QuestionSkipControl.vue:18
  PATTERN: button
  TARGET_DS_ATOM: PPSkipAction
- FILE: frontend_nuxt/app/components/journey/LikertScale.vue:101
  PATTERN: button
  TARGET_DS_ATOM: PPSkipAction
- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue:92
  PATTERN: button
  TARGET_DS_ATOM: PPButton variant=ghost
- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue:105
  PATTERN: button
  TARGET_DS_ATOM: PPButton variant=ghost

---

## 5) Inventaire — styles questionnaire (pp.components.css)

- frontend_nuxt/app/assets/css/pp.components.css:250 `.pp-journey-question-chip`
- frontend_nuxt/app/assets/css/pp.components.css:251 `.pp-journey-theme-badge`
- frontend_nuxt/app/assets/css/pp.components.css:252 `.pp-journey-status-badge`
- frontend_nuxt/app/assets/css/pp.components.css:253 `.pp-journey-status-chip`
- frontend_nuxt/app/assets/css/pp.components.css:264 `.JourneyStepBadge`

---

## 6) Lots de migration (proposition mécanique)

> On veut des lots “petits et sûrs” :
> - Lot Q1 : échelles 0–5 → `PPScale5`
> - Lot Q2 : question wrapper (titre+aide+scale) → `PPQuestionCard`
> - Lot Q3 : progress → `PPProgress`
> - Lot Q4 : nav/skip → `PPQuestionNav` / `PPChip`

### 6.1 Lot Q1
- FILE: frontend_nuxt/app/components/journey/questionnaire/LikertScaleFiveSteps.vue
- FILE: frontend_nuxt/app/components/journey/LikertScale.vue
- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue

### 6.2 Lot Q2
- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue
- FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaE1.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaE1.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire1E1.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire2E3.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block2Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block4Questionnaire.vue

### 6.3 Lot Q3
- FILE: frontend_nuxt/app/components/journey/JourneyProgressBar.vue
- FILE: frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire1E1.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire2E3.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block2Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block4Questionnaire.vue

### 6.4 Lot Q4
- FILE: frontend_nuxt/app/components/journey/questionnaire/QuestionSkipControl.vue
- FILE: frontend_nuxt/app/components/journey/LikertScale.vue
- FILE: frontend_nuxt/app/components/journey/steps/StepPanoramaE1.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1PanoramaE1.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire1E1.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Questionnaire2E3.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block2Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue
- FILE: frontend_nuxt/app/components/journey/p1/P1Block4Questionnaire.vue

---

## 7) Points bloquants (si existants)

> Exemples :
> - scale rendu dynamiquement avec markup custom
> - mélange 0–5 / 1–5 incohérent
> - dépendance à classes legacy non documentées
> - a11y fragile (labels absents, role incorrect)

- frontend_nuxt/app/components/journey/JourneyQuestionBlock.vue:42 slot de contrôle optionnel → migration PPQuestionCard doit préserver le slot custom.
- frontend_nuxt/app/components/journey/p1/P1Block1Questionnaire.vue:36 followups dynamiques (packs conditionnels) → totalQuestions/ordre varient.
- frontend_nuxt/app/components/journey/p1/P1Block3Questionnaire.vue:49 followups dynamiques (packs conditionnels + affichage partiel) → totalQuestions/ordre varient.
- frontend_nuxt/app/components/journey/LikertScale.vue:72 duplication de composant scale (LikertScale vs LikertScaleFiveSteps) → choisir stratégie de consolidation.

---

## 8) Reco de guards (post-migration)

Proposer :
- 1 guard anti “ad-hoc scales” (interdire anciennes classes scale)
- 1 guard anti “ad-hoc question wrappers”
- 1 guard anti “multiple h1 in step” si pertinent

- Guard anti ad-hoc scales: interdire `pp-likert-*` hors `PPScale5` (et interdire `LikertScale*` imports en templates).
- Guard anti ad-hoc question wrappers: interdire `.JourneyQuestionBlock` et `.JourneyQuestion*` dans templates.
- Guard anti multiple h1 in step: s’assurer d’un seul `<h1>` par step questionnaire (StepPanoramaE1 + P1Questionnaire* + P1Block*).

--- END FILE ---
