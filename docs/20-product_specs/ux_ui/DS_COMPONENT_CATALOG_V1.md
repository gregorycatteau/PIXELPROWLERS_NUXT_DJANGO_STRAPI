# DS_COMPONENT_CATALOG_V1 — Primitives UI (ENFORCED)

> Statut : **ENFORCED**
> Ce catalogue définit les primitives UI obligatoires (V1) et leurs variants autorisés.
> Toute UI doit être construite à partir de ces primitives + tokens DS.

---

## 0) Règles générales

- Les primitives sont fournies sous forme de **classes DS `.pp-*`** (layer components/utilities).
- Variabilité autorisée uniquement via variants **déclaratifs** (enum de classes), pas via styles ad hoc.
- Les CTA doivent dépendre exclusivement des tokens `--pp-cta-*`.

---

## 1) Variants globaux autorisés (V1)

### 1.1 Density
- `compact`
- `default`
- `comfort`

### 1.2 Intent (quand pertinent)
- `neutral`
- `accent`
- `success`
- `warning`
- `danger`

> Note : V1 = limiter les intents aux cas nécessaires (éviter l’explosion combinatoire).

---

## 2) Primitives obligatoires (V1)

## 2.1 CTA / Button
### But
- Unifier tous les CTA (home, journey, bilan, etc.) sur une source unique.

### Classes (minimales)
- `.pp-cta-primary`
- `.pp-cta-secondary`

### States (obligatoires)
- default
- hover
- focus-visible
- disabled

### Règles enforced
- Interdit : CTA custom dans les vues (pas de `bg-*` hardcodé).
- Interdit : duplication `.home-cta-*`, `.pp-journey-cta-*` si elles divergent.
  - (Soit elles deviennent des alias stricts, soit elles disparaissent.)

---

## 2.2 Card
### But
- Conteneur standard pour contenus et restitutions.

### Classes
- `.pp-card`
- `.pp-card-hover`
- `.pp-card-accent`
- `.pp-card-indicator`

### Règles
- La card ne doit pas réimplémenter un CTA (séparation des responsabilités).

---

## 2.3 Badge / Tag / Pill
### But
- Indiquer un état, un niveau, une priorité, un label court.

### Classes
- `.pp-pill`
- `.pp-badge-accent`
- `.pp-badge-pill`
- `.pp-emoji-badge`

### Règles
- Un badge = court, scannable, pas un paragraphe.

---

## 2.4 Section Header
### But
- Standardiser titres de sections + sous-titres + kicker.

### Classes
- `.pp-section-header`
- `.pp-section-label`
- `.pp-section-title`
- `.pp-section-desc`

---

## 2.5 Accordion / Disclosure
### But
- Détails “à la demande”, sans densifier la vue par défaut.

### Exigences A11y
- `aria-expanded`
- `aria-controls`
- focus visible
- clavier (Enter/Space)

> L’implémentation peut vivre en composant Vue, mais le style doit rester DS.

---

## 2.6 Scale 0–5 (restitution unique)
### But
- Restitution standard pour tous les questionnaires et bilans.

### Exigences UX
- Compréhension en 1–2 secondes : 0 = faible impact, 5 = très important
- Labels et repères cohérents partout

### Exigences A11y
- en mode interactif : rôles + clavier
- en mode read-only : lecture claire + texte alternatif si nécessaire

---

## 2.7 Progress (questionnaires)
### But
- Montrer l’avancement et réduire l’anxiété utilisateur.

### Format V1
- bar simple ou segments
- état “0/N” / “N/N” optionnel

---

## 2.8 Chips (stats)
### But
- Résumer “répondu / ignoré / à faire” de manière scannable.

### Exigences
- pas de densité excessive
- valeurs courtes + icône optionnelle

---

## 2.9 Callout / Notice
### But
- Mettre en évidence une info importante sans agressivité.

### Exigences
- neutre, non culpabilisant
- pas de “grave”, privilégier “important/prioritaire”

---

## 3) Patterns (rappel : uniques)
- Questionnaire pattern unique
- Bilan pattern unique
- Hypothèses → Atterrissage pattern unique

Référence : `docs/20-product_specs/ux_ui/UX_INDEX_V1.md`

---

## 4) Changelog
- V1 : catalogue minimal primitives + règles de variants + exigences A11y/UX.
