---
id: DS_CSS_ARCHITECTURE_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Heider", "Dan"]
scope: ["docs/20-product_specs/**"]
tags: ["product_specs", "ux_ui", "design_system"]
---

# DS_CSS_ARCHITECTURE_V1 — Architecture CSS Design System (ENFORCED)

> Statut : **ENFORCED**
> Cette doc définit l’architecture “légale” de la couche CSS du Design System PixelProwlers.

---

## 0) Objectif

- Rendre le Design System **strict, standardisé et reproductible** sur tous les parcours.
- Permettre : **“je modifie 1 token CTA → tous les CTA changent partout”**.
- Stopper la dérive : `main.css` ne doit plus être un monolithe ingérable.

---

## 1) Source de vérité (SSOT)

- Entrée canon : `frontend_nuxt/assets/css/main.css`
- `main.css` doit devenir un **agrégateur** (imports), pas un fourre-tout.
- Les styles DS sont organisés par couches : tokens / base / components / utilities.

---

## 2) Architecture de fichiers (V1)

Chemins :

- `frontend_nuxt/assets/css/main.css` (entrée / agrégateur)
- `frontend_nuxt/assets/css/pp.tokens.css` (tokens uniquement, via `@theme`)
- `frontend_nuxt/assets/css/pp.base.css` (`@layer base`)
- `frontend_nuxt/assets/css/pp.components.css` (`@layer components`)
- `frontend_nuxt/assets/css/pp.utilities.css` (`@layer utilities`)

Règle :
- `main.css` contient :
  - `@import "tailwindcss";`
  - éventuels commentaires/plug-ins
  - puis `@import "./pp.*.css";`
- Les 4 fichiers `pp.*.css` contiennent exclusivement leurs couches.

---

## 3) Couches CSS (règles strictes)

### 3.1 Tokens (pp.tokens.css)
Contient :
- `@theme { ... }` uniquement
- Tokens DS canons `--pp-*`
- Alias temporaires (migration) autorisés si explicitement documentés

Interdit :
- `@layer base/components/utilities`
- classes `.pp-*`

### 3.2 Base (pp.base.css)
Contient :
- `@layer base { ... }` : éléments HTML, :root, body, liens, typographie globale

Interdit :
- classes DS `.pp-*` (sauf exceptions rares documentées)
- styles page-specific

### 3.3 Components (pp.components.css)
Contient :
- `@layer components { ... }`
- classes DS strictes `.pp-*` (primitives : CTA, card, badge, accordion, etc.)

Interdit :
- classes page-specific (ex: `.pp-globalbilan-*`, `.home-*`)
  - ces classes appartiennent soit à un pattern officiel (documenté), soit doivent être migrées vers primitives/patterns.

### 3.4 Utilities (pp.utilities.css)
Contient :
- `@layer utilities { ... }`
- helpers génériques DS : focus ring, animations utilitaires, petites classes de confort

Interdit :
- styles page-specific
- duplication de composants (un utility n’est pas un bouton)

---

## 4) Convention tokens (ENFORCED)

- Tout token DS doit être préfixé : `--pp-*`
- Les tokens “historiques” (ex : `--color-*`) peuvent exister en alias uniquement.
- Interdit : création de nouveaux tokens sans préfixe `--pp-`.

---

## 5) Convention classes (ENFORCED)

- Préfixe DS : `.pp-*`
- Les primitives DS doivent être définies une seule fois (pas de doublons).
- Interdit : CTA hardcodés dans les vues (`bg-orange-500`, etc.)
- Interdit : variantes ad hoc non déclarées (pas de “juste un petit bouton spécial ici”).

---

## 6) Privacy-first (ENFORCED)

- Interdit : remote fonts/assets (Google Fonts, CDN tiers)
- Fonts : mode transitoire autorisé = **system font stack**
- Liens externes : rel safe requis (côté composants/templating)

---

## 7) Checklist conformité (à utiliser en review)

- [ ] Le changement est-il un token `--pp-*` plutôt qu’un hardcode ?
- [ ] Le style est-il dans la bonne couche (tokens/base/components/utilities) ?
- [ ] Aucun style page-specific n’a été ajouté au DS ?
- [ ] Aucun remote asset n’a été introduit ?
- [ ] Les CTA reposent bien sur `--pp-cta-*` ?

---

## 8) Changelog

- V1 : définition de l’architecture en couches + découpage en fichiers + règles enforced.
