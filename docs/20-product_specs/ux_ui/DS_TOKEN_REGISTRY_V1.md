# DS_TOKEN_REGISTRY_V1 — Registry Tokens (ENFORCED)

> Statut : **ENFORCED**
> Ce registry décrit les tokens canons du Design System PixelProwlers (préfixe `--pp-*`),
> ainsi que les alias de compatibilité autorisés temporairement.

Référence :
- `docs/20-product_specs/ux_ui/UX_INDEX_V1.md`
- `docs/20-product_specs/ux_ui/DS_CSS_ARCHITECTURE_V1.md`

---

## 0) Règles strictes

- Tout nouveau token doit être préfixé **`--pp-`**.
- Les tokens historiques `--color-*` peuvent exister en alias temporaire (migration).
- Les tokens ambigus sont interdits (ex: `--color-text`) : s’ils apparaissent dans le code, ils doivent pointer vers le canon via alias.

---

## 1) Tokens canons (V1)

### 1.1 Couleurs primitives (V1)
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

### 1.2 Couleurs sémantiques (V1)
- `--pp-color-bg-page`
- `--pp-color-bg-section`
- `--pp-color-bg-card`
- `--pp-color-text-primary`
- `--pp-color-text-muted`
- `--pp-color-text-invert`
- `--pp-color-accent-strong`
- `--pp-color-accent-quiet`
- `--pp-color-accent-border`

### 1.3 Typographie (V1)
- `--pp-font-sans` (temporaire = system font stack, 0 remote)
- `--pp-font-display`
- `--pp-font-alt`

### 1.4 Rayons / ombres / motion (V1)
- `--pp-radius-sm`, `--pp-radius-md`, `--pp-radius-lg`, `--pp-radius-xl`, `--pp-radius-pill`
- `--pp-shadow-soft`, `--pp-shadow-elevated`, `--pp-shadow-accent`
- `--pp-motion-fast`, `--pp-motion-base`, `--pp-ease-standard`

### 1.5 Focus tokens (V1) — A11y enforced
- `--pp-focus-ring` : couleur du focus ring
- `--pp-focus-ring-offset` : couleur de l’offset du focus ring

### 1.6 CTA tokens (V1) — source unique pour tous les CTA
- `--pp-cta-primary-bg`
- `--pp-cta-primary-bg-hover`
- `--pp-cta-primary-text`
- `--pp-cta-primary-shadow`
- `--pp-cta-secondary-bg`
- `--pp-cta-secondary-bg-hover`
- `--pp-cta-secondary-text`
- `--pp-cta-secondary-border`

### 1.7 Card tokens (V1.2) — atome PPCard + états
- `--pp-card-bg`
- `--pp-card-bg-soft`
- `--pp-card-bg-accent`
- `--pp-card-border`
- `--pp-card-border-strong`
- `--pp-card-radius`
- `--pp-card-shadow`
- `--pp-card-shadow-hover`
- `--pp-card-pad`
- `--pp-card-active-ring`
- `--pp-card-active-border`

### 1.8 Badge tokens (V1) — atome PPBadge
- `--pp-badge-radius`
- `--pp-badge-pad-x`
- `--pp-badge-pad-y`
- `--pp-badge-font-sm`
- `--pp-badge-font-md`
- `--pp-badge-border`
- `--pp-badge-bg-neutral`
- `--pp-badge-text-neutral`
- `--pp-badge-bg-accent`
- `--pp-badge-text-accent`
- `--pp-badge-border-accent`
- `--pp-badge-bg-success`
- `--pp-badge-text-success`
- `--pp-badge-bg-warning`
- `--pp-badge-text-warning`
- `--pp-badge-bg-danger`
- `--pp-badge-text-danger`

### 1.9 Chip tokens (V1) — atome PPChip
- `--pp-chip-radius`
- `--pp-chip-pad-x`
- `--pp-chip-pad-y`
- `--pp-chip-font-sm`
- `--pp-chip-font-md`
- `--pp-chip-border`
- `--pp-chip-border-strong`
- `--pp-chip-bg`
- `--pp-chip-bg-hover`
- `--pp-chip-text`
- `--pp-chip-selected-bg`
- `--pp-chip-selected-border`
- `--pp-chip-selected-text`
- `--pp-chip-accent-bg`
- `--pp-chip-accent-border`

### 1.10 SectionHeader tokens (V1) — atome PPSectionHeader
- `--pp-section-gap`
- `--pp-section-gap-compact`
- `--pp-section-title-size`
- `--pp-section-title-leading`
- `--pp-section-title-weight`
- `--pp-section-eyebrow-size`
- `--pp-section-eyebrow-letter`
- `--pp-section-lead-size`
- `--pp-section-lead-leading`
- `--pp-section-divider`

## PageHeader (PPPageHeader) — Tokens

- `--pp-pageheader-gap`
- `--pp-pageheader-gap-compact`
- `--pp-pageheader-eyebrow-size`
- `--pp-pageheader-title-size`
- `--pp-pageheader-title-size-compact`
- `--pp-pageheader-lead-size`
- `--pp-pageheader-lead-size-compact`
- `--pp-pageheader-actions-gap`

## Scale5 (PPScale5) — Tokens (V1.7)

- `--pp-scale5-radius`
- `--pp-scale5-gap`
- `--pp-scale5-track-bg`
- `--pp-scale5-track-border`
- `--pp-scale5-step-bg`
- `--pp-scale5-step-border`
- `--pp-scale5-step-text`
- `--pp-scale5-step-bg-selected`
- `--pp-scale5-step-border-selected`
- `--pp-scale5-step-text-selected`
- `--pp-scale5-label-text`

## Progress (PPProgress) — Tokens (V1.8)

- `--pp-progress-gap`
- `--pp-progress-label-size`
- `--pp-progress-label-text`
- `--pp-progress-count-size`
- `--pp-progress-count-text`
- `--pp-progress-bar-h`
- `--pp-progress-bar-bg`
- `--pp-progress-bar-border`
- `--pp-progress-fill-bg`
- `--pp-progress-radius`
- `--pp-progress-hint-size`
- `--pp-progress-hint-text`

---

## 2) Alias compat (DEPRECATED) — tolérés temporairement

> Ces alias existent uniquement pour éviter les régressions liées aux tokens ambigus.
> Ils doivent disparaître à terme, une fois toutes les références migrées.

Alias texte (dépréciés) :
- `--color-text` → `--color-text-primary`
- `--color-text-secondary` → `--color-text-muted`
- `--color-text-strong` → `--color-text-primary`

Alias surfaces/borders (dépréciés) :
- `--color-border` → `--color-border-soft`
- `--color-border-strong` → `--color-stroke`
- `--color-bg` → `--color-bg-page`
- `--color-bg-soft` → `--color-bg-section`
- `--color-card` → `--color-bg-card`

---

## 3) Interdits

- Création de tokens sans préfixe `--pp-`
- Usage de `--color-text` dans le code applicatif (doit être migré vers `--pp-color-text-primary` à terme)
- Couleurs hardcodées dans les CTA (ex: `bg-orange-500`)

---

## 4) Changelog
### V1.8
- Ajout : atome `PPProgress` (bar + meta x/y, tokens `--pp-progress-*`).

### V1.7
- Ajout : atome `PPScale5` (scale 5 steps, radios natifs, focus-visible DS).
- Ajout : tokens Scale5 (`--pp-scale5-*`).

### V1.6
- Ajout : atome `PPPageHeader` (page-level header, support `h1|h2`, slots eyebrow/title/lead/meta/actions).
- Ajout : tokens PageHeader (`--pp-pageheader-*`).
- Ajout : styles DS `.pp-page-header__*` branchés sur tokens.
- V1 : création du registry + focus tokens + alias compat (dépréciés).
- V1.1 : ajout des Card tokens (PPCard).
- V1.2 : ajout `--pp-card-pad` + tokens d’état actif (ring/border) pour cartes “journey”.
- V1.3 : ajout des Badge tokens + création PPBadge + compat CSS.
- V1.4 : ajout des Chip tokens + création PPChip.
- V1.5 : ajout des SectionHeader tokens + création PPSectionHeader.

--- END FILE ---
