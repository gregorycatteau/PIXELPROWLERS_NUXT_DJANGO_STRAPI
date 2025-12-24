---
id: CODING_RULEBOOK_V1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Eva", "Dan"]
scope: ["frontend_nuxt/**", "docs/30-tech_specs/**"]
tags: ["coding", "conventions", "security", "vue", "nuxt", "typescript", "ds"]
---

# Coding Rulebook (V1) — PixelProwlers

## 1) Objectif

Ce document définit les conventions de code, règles de sécurité et bonnes pratiques pour le développement frontend PixelProwlers (Nuxt 3, Vue 3, TypeScript).

---

## 2) Conventions Vue/Nuxt

### 2.1 Structure des composants

```vue
<template>
  <!-- Markup HTML/Vue -->
</template>

<script setup lang="ts">
// Imports
// Props/Emits
// Composables
// Computed/Ref
// Functions
</script>

<style scoped>
/* Styles scoped uniquement */
</style>
```

### 2.2 Règles TypeScript strict

```typescript
// ✅ CORRECT
interface Props {
  title: string
  count?: number
}
const props = defineProps<Props>()

// ❌ INTERDIT
const props = defineProps({
  title: String,  // Pas de typage TS
})
```

### 2.3 Architecture anti-menhir

| Règle | Description | Guard |
|-------|-------------|-------|
| Pages thin | Pages = orchestration, pas de logique | Revue PR |
| Composants atomiques | 1 composant = 1 responsabilité | Revue PR |
| Composables pour logique | Extraire la logique dans `composables/` | Revue PR |
| Max 200 lignes | Composant > 200 lignes → refactor | Warning |

```typescript
// ✅ CORRECT - Page thin
<template>
  <PPJourneyStepShell>
    <P1IntroContent />
  </PPJourneyStepShell>
</template>

// ❌ INTERDIT - Menhir
<template>
  <!-- 500+ lignes de markup -->
</template>
```

---

## 3) Sécurité Frontend

### 3.1 Dangerous DOM (P0)

| Pattern | Niveau | Guard |
|---------|--------|-------|
| `v-html` | ❌ INTERDIT | `no_v_html_guard.ts` |
| `innerHTML` | ❌ INTERDIT | `no-innerhtml.mjs` |
| `outerHTML` | ❌ INTERDIT | `no-innerhtml.mjs` |
| `insertAdjacentHTML` | ❌ INTERDIT | `no-innerhtml.mjs` |
| `document.write` | ❌ INTERDIT | `no-innerhtml.mjs` |

```vue
<!-- ❌ INTERDIT -->
<div v-html="userContent"></div>

<!-- ✅ CORRECT -->
<div>{{ sanitizedText }}</div>
```

**Exception documentée uniquement** : Si absolument nécessaire, créer une PR avec :
1. Justification technique
2. Sanitization prouvée
3. Scope limité
4. Ajout dans allowlist du guard

### 3.2 Liens sécurisés

```typescript
// ✅ CORRECT
const ALLOWED_SCHEMES = ['http:', 'https:', 'mailto:']

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (!ALLOWED_SCHEMES.includes(parsed.protocol)) {
      return '#'
    }
    // Strip UTM params
    parsed.searchParams.delete('utm_source')
    parsed.searchParams.delete('utm_medium')
    parsed.searchParams.delete('utm_campaign')
    return parsed.toString()
  } catch {
    return '#'
  }
}
```

```vue
<!-- ✅ CORRECT -->
<a :href="sanitizedUrl" target="_blank" rel="noopener noreferrer">
  Lien externe
</a>

<!-- ❌ INTERDIT -->
<a :href="userProvidedUrl">Lien</a>
```

### 3.3 Sanitization Unicode

```typescript
// ✅ CORRECT - Pour tous les inputs utilisateur
function sanitizeInput(input: string): string {
  return input
    .normalize('NFKC')                    // Normalisation Unicode
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Strip zero-width chars
    .trim()
}

// Usage dans composables
const searchQuery = computed(() => sanitizeInput(rawQuery.value))
```

---

## 4) Design System & Tailwind

### 4.1 Tokens CSS

```css
/* ✅ CORRECT - Utiliser les tokens */
.my-component {
  color: var(--pp-color-primary);
  padding: var(--pp-spacing-md);
  border-radius: var(--pp-radius-default);
}

/* ❌ INTERDIT - Valeurs hardcodées */
.my-component {
  color: #3b82f6;
  padding: 16px;
  border-radius: 8px;
}
```

### 4.2 Classes Tailwind

```vue
<!-- ✅ CORRECT - Classes DS via @apply -->
<style scoped>
.pp-button {
  @apply pp-btn pp-btn-primary;
}
</style>

<!-- ❌ INTERDIT - Classes ad hoc -->
<template>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click
  </button>
</template>
```

### 4.3 Composants DS

| Règle | Description |
|-------|-------------|
| 1 endroit | Composant DS défini dans `app/components/PP*.vue` |
| 100% rendu | Le composant gère tout son rendu |
| Props typées | Interfaces TypeScript obligatoires |
| Slots nommés | Pour la composition |

```vue
<!-- ✅ CORRECT - Composant DS atomique -->
<PPButton variant="primary" size="md" @click="handleClick">
  Valider
</PPButton>

<!-- ❌ INTERDIT - Réimplémenter le style -->
<button class="custom-button-style">Valider</button>
```

---

## 5) Performance & Assets

### 5.1 No Remote Assets

```vue
<!-- ❌ INTERDIT - Assets externes -->
<img src="https://external-cdn.com/image.png" />
<link href="https://fonts.googleapis.com/css2?family=..." />

<!-- ✅ CORRECT - Assets locaux -->
<img src="/images/local-image.webp" />
<!-- Fonts auto-hébergées via nuxt.config.ts -->
```

**Guard** : `no-remote-assets.mjs`

### 5.2 Images optimisées

| Format | Usage | Max size |
|--------|-------|----------|
| WebP | Photos, illustrations | 200KB |
| AVIF | Photos (fallback WebP) | 150KB |
| SVG | Icônes, logos | 10KB |
| PNG | Screenshots (rare) | 500KB |

```vue
<!-- ✅ CORRECT - Picture avec fallbacks -->
<picture>
  <source srcset="/hero.avif" type="image/avif" />
  <source srcset="/hero.webp" type="image/webp" />
  <img src="/hero.png" alt="Description" loading="lazy" />
</picture>
```

---

## 6) Accessibilité (a11y)

### 6.1 Focus management

```vue
<!-- ✅ CORRECT -->
<button
  @click="handleClick"
  @keydown.enter="handleClick"
  @keydown.space="handleClick"
>
  Action
</button>

<!-- Focus visible obligatoire -->
<style scoped>
button:focus-visible {
  outline: 2px solid var(--pp-color-focus);
  outline-offset: 2px;
}
</style>
```

### 6.2 Labels et ARIA

```vue
<!-- ✅ CORRECT -->
<label for="email-input">Email</label>
<input
  id="email-input"
  type="email"
  aria-describedby="email-hint"
  aria-required="true"
/>
<p id="email-hint">Votre adresse email professionnelle</p>

<!-- ❌ INTERDIT -->
<input type="email" placeholder="Email" />
```

### 6.3 Checklist a11y minimale

- [ ] Tous les inputs ont un label associé
- [ ] Images ont un alt descriptif (ou `alt=""` si décoratif)
- [ ] Focus visible sur éléments interactifs
- [ ] Contraste couleurs ≥ 4.5:1 (texte) / 3:1 (UI)
- [ ] Navigation clavier possible

---

## 7) Tests

### 7.1 Smoke tests requis

Chaque feature doit avoir un fichier smoke test dans `docs/55-qa/`.

```markdown
## Smoke Test — <Feature>

### Setup
1. ...

### Tests
- [ ] ST-001: <Description>
- [ ] ST-002: <Description>

### Cleanup
1. ...
```

### 7.2 Couverture minimale

| Type | Obligatoire | Recommandé |
|------|-------------|------------|
| Smoke tests | ✅ | - |
| Unit tests composables | ✅ | - |
| Component tests | - | ✅ |
| E2E tests | - | ✅ (parcours critiques) |

---

## 8) Guards de sécurité

### 8.1 Liste des guards actifs

| Guard | Fichier | Scope | CI |
|-------|---------|-------|-----|
| No v-html | `no_v_html_guard.ts` | `**/*.vue` | ✅ |
| No innerHTML | `no-innerhtml.mjs` | `**/*.vue`, `**/*.ts` | ✅ |
| No remote assets | `no-remote-assets.mjs` | `**/*.vue` | ✅ |
| No DS page prod | `no-ds-page-in-prod.mjs` | `pages/ds.vue` | ✅ |

### 8.2 Exécution

```bash
# Tous les guards
npm run guards

# Guard spécifique
npm run guard:no-v-html
npm run guard:no-innerhtml
npm run guard:no-remote-assets
```

### 8.3 Ajout d'exception

1. Créer PR avec justification
2. Ajouter dans `guard_allowlist/`
3. Documenter dans le guard concerné
4. Review sécurité obligatoire

---

## 9) Checklist PR Code

Avant de merger une PR code :

- [ ] TypeScript strict (pas de `any`)
- [ ] Composants < 200 lignes
- [ ] Pas de v-html / innerHTML
- [ ] Assets locaux uniquement
- [ ] Labels sur tous les inputs
- [ ] Focus visible sur interactifs
- [ ] Guards passent (`npm run guards`)
- [ ] Smoke test créé/mis à jour si nouvelle feature

---

## Références

- [PX_NO_VHTML_DOCTRINE_V1](../frontend/PX_NO_VHTML_DOCTRINE_V1.md) — Doctrine no-v-html
- [PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS](../../40-security/contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md) — Guards DOM
- [DS_CSS_ARCHITECTURE_V1](../../20-product_specs/ux_ui/DS_CSS_ARCHITECTURE_V1.md) — Architecture CSS
- [DS_COMPONENT_CATALOG_V1](../../20-product_specs/ux_ui/DS_COMPONENT_CATALOG_V1.md) — Catalogue DS
