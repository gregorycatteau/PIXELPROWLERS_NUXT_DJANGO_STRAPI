# UX_INDEX_V1 — PixelProwlers Design System & UX Patterns (ENFORCED)

> Statut : **ENFORCED** (obligatoire)
> Source de vérité UX/UI : **Tokens + Primitives + Patterns**.
> Toute UI hors DS = **non conforme** (sauf exception documentée + validée).

---

## 0) Périmètre & objectifs

### Périmètre
- Front : **Nuxt 4 + Tailwind 4**
- CSS tokens : **`@theme` dans `@/assets/css/main.css`**
- Composants UI : Vue (API composition), TS

### Objectifs
- **Standardisation totale** : un seul langage UI sur tous les parcours
- **Réutilisabilité maximale** : “je change 1 token CTA → tout bouge partout”
- **Patterns uniques** : questionnaires identiques / bilans identiques / restitutions identiques
- **Privacy-first réel** : **zéro remote asset** (fonts incluses), pas de tracking par défaut
- **A11y baseline** : focus visible + clavier + aria sur patterns interactifs

---

## 1) Principes non négociables

### 1.1 Privacy-first UI
- **Interdit** : remote assets (Google Fonts, CDN tiers, trackers, pixels)
- **Interdit** : `v-html` sur contenu non-sanitizé
- **Interdit** : liens sortants avec paramètres traçants (UTM, IDs uniques)
- **Obligatoire** : liens externes safe (`rel="noopener noreferrer"`, politique referrer stricte si applicable)
- **Obligatoire** : aucune persistance par défaut (pas de localStorage/sessionStorage) sauf exception documentée

### 1.2 Standardisation enforced
- **Tout CTA** doit passer par le DS (classes DS / composant DS).
- **Aucun** “CTA local” (ex : `bg-orange-500`) ne doit exister dans les vues.
- Variabilité autorisée uniquement via **variants déclaratifs** (enum), jamais via layout ad hoc.

### 1.3 Ergonomie : “scan → confort → détails”
- **Scan (1–2 s)** : compréhension immédiate (score, priorité, état)
- **Confort (20 s)** : lecture reposante (line length, leading, spacing)
- **Détails** : uniquement à la demande (accordion/disclosure standardisé)

### 1.4 Microcopy : intensité contrôlée
- On dit **“important / prioritaire”**, pas “grave”.
- Neutralité : pas de culpabilisation, pas de jugement.
- On décrit des **mécanismes**, pas des personnes.

---

## 2) Architecture CSS (design system strict)

### 2.1 Source de vérité
- Fichier canon : `frontend_nuxt/assets/css/main.css`
- Les tokens DS doivent être gérés via `@theme` (variables CSS)

### 2.2 Convention de nommage tokens (V1)
- Préfixe DS : `--pp-*`
- Les tokens historiques `--color-*` peuvent exister temporairement **uniquement** comme alias de migration.
- Toute nouvelle variable doit être créée en `--pp-*`.

---

## 3) Registry tokens (V1 — minimal obligatoire)

> But : permettre “1 token change tout”.
> Les CTA doivent dépendre uniquement de `--pp-cta-*`.

### 3.1 Couleurs primitives (V1)
- `--pp-color-surface`
- `--pp-color-panel`
- `--pp-color-panel-alt`
- `--pp-color-panel-soft`
- `--pp-color-stroke`
- `--pp-color-border-soft`
- `--pp-color-brand`
- `--pp-color-brand-soft`
- `--pp-color-accent`
- `--pp-color-accent-soft`
- `--pp-color-ink`
- `--pp-color-muted`
- `--pp-color-success`
- `--pp-color-success-soft`
- `--pp-color-error`
- `--pp-color-error-soft`

### 3.2 Couleurs sémantiques (V1)
- `--pp-color-bg-page`
- `--pp-color-bg-section`
- `--pp-color-bg-card`
- `--pp-color-text-primary`
- `--pp-color-text-muted`
- `--pp-color-text-invert`
- `--pp-color-accent-strong`
- `--pp-color-accent-quiet`
- `--pp-color-accent-border`

### 3.3 Typographie (V1)
- `--pp-font-sans` (temporaire : **system stack** tant que fonts non choisies)
- `--pp-font-display`
- `--pp-font-alt`

### 3.4 Rayons / ombres / motion (V1)
- `--pp-radius-sm`, `--pp-radius-md`, `--pp-radius-lg`, `--pp-radius-xl`, `--pp-radius-pill`
- `--pp-shadow-soft`, `--pp-shadow-elevated`, `--pp-shadow-accent`
- `--pp-motion-fast`, `--pp-motion-base`, `--pp-ease-standard`

### 3.5 CTA tokens (V1 — obligatoires)
- `--pp-cta-primary-bg`
- `--pp-cta-primary-bg-hover`
- `--pp-cta-primary-text`
- `--pp-cta-primary-shadow`
- `--pp-cta-secondary-bg`
- `--pp-cta-secondary-bg-hover`
- `--pp-cta-secondary-text`
- `--pp-cta-secondary-border`

---

## 4) Primitives UI obligatoires (V1)

> Toute implémentation UI doit s’appuyer sur ces primitives (classes DS et/ou composants DS).

### 4.1 Primitives minimales
- **Button / CTA** : primaire, secondaire, ghost (option), danger (option)
- **Card**
- **Badge / Tag**
- **Callout / Notice**
- **Accordion / Disclosure**
- **Scale 0–5** (segments)
- **Progress** (questionnaire)
- **Section Header** (label + titre + description)
- **Chips** (stats : répondu / ignoré / à voir)

### 4.2 États UI standard
- default / hover / focus-visible / disabled / loading
- empty state standard : 2 lignes + CTA neutre

---

## 5) Patterns uniques (restitution standardisée)

### 5.1 Pattern Questionnaire (tous parcours)
- Structure : intro → questions → progression → validation → bilan
- Échelle : **0–5** (toujours la même présentation)
- Skip : autorisé, explicitement indiqué
- Progress : toujours visible et cohérent

### 5.2 Pattern Bilan (tous parcours)
- Repères (lecture humaine)
- Panorama (axes + scores)
- Ce qui pèse le plus (cartes confort, sans pavé)
- Hypothèses (bascule lecture structure, sélection max 2)
- Atterrissage (protocole actionnable)
- Ressources (support, filtrées, sans pression)

### 5.3 Pattern Hypothèses → Atterrissage (V1)
- L’utilisateur sélectionne 1–2 hypothèses max
- Un plan apparaît immédiatement (local, non persisté)
- CTA “Aller à Atterrissage” scroll + highlight
- Atterrissage : protocole max 3 étapes + résultat attendu

---

## 6) Accessibilité (baseline enforced)

- Focus visible sur tous éléments interactifs
- Navigation clavier complète (Tab/Enter/Escape si accordéons)
- `aria-expanded`, `aria-controls` pour accordéons
- Contraste suffisant (à vérifier sur CTA et badges)
- Motion : respecter `prefers-reduced-motion` sur animations importantes

---

## 7) Règles d’implémentation (ENFORCED)

### Interdits
- Inline styles dans les templates
- Couleurs hardcodées dans les vues (ex : `bg-orange-500`)
- Remote fonts/assets
- `v-html` sur contenus data-only
- Patterns “inventés” sans validation DS

### Obligatoires
- CTA : dépendre des tokens `--pp-cta-*`
- Tokens DS : nouveaux tokens en `--pp-*`
- Patterns : questionnaire/bilan identiques entre parcours

---

## 8) QA UX (checklist)

- Scan 1–2 s : score/état lisible immédiatement
- Confort : largeur de lecture maîtrisée + leading/spacing cohérents
- Détails : repliés par défaut, accessibles, non “janky”
- Privacy : zéro requête tiers, zéro remote asset
- A11y : focus visible, clavier, aria

---

## 9) Changelog

- V1 : création index + règles DS strict + registry tokens minimal + patterns uniques.
