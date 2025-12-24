---
id: openapi-client-howto
title: "OpenAPI — Génération Client TypeScript"
status: active
owner: Dan
owners: ["Dan", "Heider"]
  - Dan
date: 2025-12-24
created: 2025-12-24
updated: 2025-12-24
version: "1.0.0"
scope: frontend
tags:
  - openapi
  - typescript
  - tooling
  - api-client
---

# OpenAPI — Génération Client TypeScript

> **TL;DR** : Générer un client TypeScript typé depuis `openapi.v1.yaml` pour éviter les erreurs d'intégration et accélérer le développement frontend.

---

## 📋 Prérequis

| Outil | Version pinnée | Installation |
|-------|----------------|--------------|
| Node.js | `>=20.x` | Via `.nvmrc` |
| npm | `>=10.x` | Inclus avec Node |
| openapi-typescript | `7.4.4` | `npm install -D openapi-typescript@7.4.4` |
| openapi-fetch | `0.13.4` | `npm install openapi-fetch@0.13.4` |

> ⚠️ **Versions pinnées obligatoires** — Ne pas utiliser `latest` ou `^x.y.z` pour ces dépendances critiques.

---

## 🎯 Stratégie retenue : B — Génération locale + commit

### Pourquoi ce choix ?

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **A) CI + artifact** | Client toujours frais, pas de fichier généré dans le repo | Complexité CI, dépendance à l'artifact store, délai de build |
| **B) Local + commit** ✅ | Simple, reproductible, versionné, review possible du diff | Nécessite de re-générer après chaque modif de spec |

**Recommandation** : Option B pour PixelProwlers car :
- Spec OpenAPI évolue lentement (endpoints stables)
- Équipe réduite, pas besoin d'overhead CI
- Permet de reviewer les changements de types dans les PR
- Fonctionne offline

---

## 🚀 Génération du client

### 1. Installation (one-time)

```bash
cd frontend_nuxt
npm install -D openapi-typescript@7.4.4
npm install openapi-fetch@0.13.4
```

### 2. Génération des types

```bash
# Depuis frontend_nuxt/
npx openapi-typescript ../docs/30-tech_specs/backend/openapi.v1.yaml \
  --output ./app/types/api.generated.ts \
  --export-type \
  --alphabetize
```

### 3. Script npm (recommandé)

Ajouter dans `frontend_nuxt/package.json` :

```json
{
  "scripts": {
    "api:generate": "openapi-typescript ../docs/30-tech_specs/backend/openapi.v1.yaml --output ./app/types/api.generated.ts --export-type --alphabetize",
    "api:validate": "python ../tools/openapi_validate.py"
  }
}
```

Usage :
```bash
npm run api:generate  # Régénère les types
npm run api:validate  # Valide la spec OpenAPI
```

---

## 📁 Structure des fichiers générés

```
frontend_nuxt/
├── app/
│   ├── types/
│   │   ├── api.generated.ts    # ← Généré (commit OK)
│   │   └── index.ts            # Re-export manuel
│   └── composables/
│       └── useApi.ts           # Client typé
```

### Exemple de fichier généré

```typescript
// app/types/api.generated.ts (extrait)
export interface paths {
  "/api/v1/health/": {
    get: operations["getHealth"];
  };
  "/api/v1/contact/": {
    post: operations["submitContact"];
  };
  // ...
}

export interface components {
  schemas: {
    ContactRequest: {
      email: string;
      subject: "question_generale" | "demande_accompagnement" | "signalement_bug" | "autre";
      message: string;
      honeypot?: string;
    };
    // ...
  };
}
```

---

## 🔌 Utilisation dans le code

### Composable API typé

```typescript
// app/composables/useApi.ts
import createClient from 'openapi-fetch';
import type { paths } from '~/types/api.generated';

const client = createClient<paths>({
  baseUrl: useRuntimeConfig().public.apiBase,
});

export function useApi() {
  return {
    // Health check
    async getHealth() {
      const { data, error } = await client.GET('/api/v1/health/');
      return { data, error };
    },
    
    // Contact form
    async submitContact(body: paths['/api/v1/contact/']['post']['requestBody']['content']['application/json']) {
      const { data, error } = await client.POST('/api/v1/contact/', { body });
      return { data, error };
    },
  };
}
```

### Usage dans un composant

```vue
<script setup lang="ts">
const { submitContact } = useApi();

async function handleSubmit() {
  const { data, error } = await submitContact({
    email: 'test@example.com',
    subject: 'question_generale',  // ← Autocomplete TypeScript!
    message: 'Mon message...',
    honeypot: '',
  });
  
  if (error) {
    console.error('Erreur:', error);
    return;
  }
  
  console.log('Succès:', data);
}
</script>
```

---

## 🧪 Mock Server (optionnel)

### Avec Prism (Stoplight)

Prism permet de simuler l'API backend pendant le développement frontend.

```bash
# Installation globale (ou via npx)
npm install -g @stoplight/prism-cli@5.11.2

# Démarrage du mock server
prism mock ../docs/30-tech_specs/backend/openapi.v1.yaml --port 4010
```

**Script npm :**

```json
{
  "scripts": {
    "api:mock": "npx @stoplight/prism-cli@5.11.2 mock ../docs/30-tech_specs/backend/openapi.v1.yaml --port 4010"
  }
}
```

### Configuration Nuxt pour le mock

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4010',
    },
  },
});
```

**Usage :**
```bash
# Terminal 1 : Mock server
npm run api:mock

# Terminal 2 : Dev server Nuxt
npm run dev
```

---

## 🔄 Workflow de mise à jour

### Quand régénérer ?

1. **Après modification de `openapi.v1.yaml`**
2. **Avant une PR touchant à l'API**
3. **Si erreurs TypeScript sur les types API**

### Checklist PR

- [ ] J'ai mis à jour `openapi.v1.yaml` si nécessaire
- [ ] J'ai lancé `npm run api:generate`
- [ ] J'ai vérifié le diff de `api.generated.ts`
- [ ] Les types compilent (`npm run typecheck`)

---

## ⚠️ Contraintes doctrine PixelProwlers

| Règle | Application |
|-------|-------------|
| **No PII in logs** | Le client généré ne log JAMAIS les payloads |
| **No tracking** | Pas de télémétrie dans `openapi-fetch` |
| **Versions pinnées** | Voir tableau prérequis |
| **Erreurs neutres** | Le client expose les erreurs telles que retournées par l'API |

---

## 📚 Ressources

- [openapi-typescript docs](https://openapi-ts.dev/)
- [openapi-fetch docs](https://openapi-ts.dev/openapi-fetch/)
- [Prism mock server](https://stoplight.io/open-source/prism)
- [OpenAPI spec source](../backend/openapi.v1.yaml)
- [API Spec documentation](../backend/API_SPEC_V1.md)

---

## 🔗 Voir aussi

- [API_SPEC_V1.md](../backend/API_SPEC_V1.md) — Spécification API complète
- [openapi.v1.yaml](../backend/openapi.v1.yaml) — Fichier OpenAPI source
- [tools/openapi_validate.py](../../../tools/openapi_validate.py) — Validateur OpenAPI

---

**Owner** : Dan  
**Dernière mise à jour** : 2025-12-24
