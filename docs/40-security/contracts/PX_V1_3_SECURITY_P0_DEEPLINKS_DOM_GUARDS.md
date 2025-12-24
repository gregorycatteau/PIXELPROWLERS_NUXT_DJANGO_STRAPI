---
id: PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS
version: 1.0.0
status: stable
date: 2025-12-23
owners: ["Eva", "Dan"]
scope: ["frontend_nuxt/app"]
tags:
  - security
  - privacy
  - deep-links
  - guards
---

# P0 — Contract Sécurité : Deep links /ressources + Guard DOM injection

## 0) Objectif

Verrouiller deux surfaces d’attaque “classiques” et ultra rentables pour un attaquant :
- **Deep links** (query params) → injection, filtres fantômes, confusion UX, payloads lourds (DoS UX).
- **DOM injection** côté scripts/composables → contournement de `no-v-html` (template-only).

Ce contrat est **canonique**. Toute implémentation qui s’en écarte est considérée comme une régression sécurité.

---

## 1) Décision — SafeDeepLinkKit (canonique & obligatoire)

### Décision
**OUI** à un `SafeDeepLinkKit` central, canonique, obligatoire.

### Exigence
Tout lien vers `/ressources` avec des filtres **DOIT** :
- être **construit** via `buildResourcesDeepLink(filters)`
- être **lu** via `parseResourcesDeepLink(route.query)`

Aucun parsing “ad hoc” de `route.query` n’est accepté en dehors du kit.

---

## 2) Contract strict deep links (anti injection / anti DoS UX)

### 2.1 Allowlist stricte
Seuls les params **nécessaires au produit** sont acceptés. Tout le reste est **droppé silencieusement**.

### 2.2 Sanitize systématique (strings)
Pipeline obligatoire sur chaque param string :
1. Unicode normalize **NFKC**
2. strip **zero-width** (ZWJ/ZWNJ/ZWSP, etc.)
3. `trim`
4. **normalisation espaces** (plusieurs → 1)
5. **clamp** longueur (par champ)

### 2.3 Drop silencieux (inconnus, invalides, arrays hors règles)
- Tout param inconnu → drop
- Tout param invalide (format, enum, taille) → drop
- Tout param `string[]` hors règles → drop

### 2.4 Defaults safe (état neutre)
Si aucun param valide → état neutre :
- pas de filtres fantômes
- pas de tri “bizarre”
- pas de page hors bornes

### 2.5 Interdits (tracking / debug)
**Interdit** (drop immédiat) :
- `utm_*`, `gclid`, `fbclid`
- `ref`, `source`, `campaign`
- tout param “debug” (ex: `debug`, `trace`, `profile`, etc.)

### 2.6 Pas de logs des query brutes en prod
Aucun log de `route.query` brut (payload hostile).  
Si log nécessaire → logger **uniquement** l’état parsed/safe (et encore, avec parcimonie).

### 2.7 Anti casse : cap global & chars de contrôle
Durcissements obligatoires :
- **Cap global** : si la query string dépasse un seuil (ex: 2–4 KB) → fallback neutre (ne pas parser).
- **Chars de contrôle** : si un param contient des caractères de contrôle → drop.
- **Decode safe** : parsing défensif (pas d’exception fatale).

---

## 3) Allowlist recommandée (v1) — “safe by default”

> À adapter au data model, mais la philosophie est immuable.

### 3.1 Spécifications

- `q`
  - type : string
  - taille : `0..120`
  - sanitize : NFKC + stripZW + trim + espaces normalisés
  - règle : pas de regex lourde / pas de parsing coûteux

- `topic`
  - type : slug
  - taille : `1..32`
  - pattern : `^[a-z0-9_-]{1,32}$`

- `tag`
  - type : multi
  - max : **5 tags**
  - taille tag : `1..24`
  - pattern : `^[a-z0-9_-]{1,24}$`
  - drop : au-delà des limites

- `type`
  - type : enum allowlist
  - ex : `tool|checklist|guide|article|video`
  - invalid → drop

- `level`
  - type : enum allowlist
  - ex : `intro|intermediate|advanced`
  - invalid → drop

- `page`
  - type : int
  - clamp : `1..50`

- `sort` (optionnel)
  - type : enum allowlist
  - ex : `relevance|newest|title`
  - défaut : `relevance`

- `dir` (optionnel)
  - type : enum
  - `asc|desc`
  - défaut : `desc`

### 3.2 Règles Vue Router (string | string[])
Vue Router peut fournir `string | string[]`.

- Pour tous les champs **sauf `tag`** :
  - si `array` → prendre **le premier** et drop le reste

- Pour `tag` :
  - accepter `string[]` **dans la limite** max 5 (drop le reste)

---

## 4) Guard minimal anti DOM injection (“no-innerhtml”) — GO

### 4.1 Décision
**OUI**. Complément logique à `no-v-html` (template-only).  
Sans ça, injection possible via composables/scripts.

### 4.2 Périmètre
Scanner uniquement :
- `frontend_nuxt/app/**/*.ts`
- sections `<script>` des `.vue` sous `frontend_nuxt/app/**`

Exclure :
- `docs/**`, `**/*.md`, `fixtures/**`, `testdata/**`

### 4.3 Patterns (précis, anti faux positifs)
- `\.innerHTML\s*=`
- `\.outerHTML\s*=`
- `insertAdjacentHTML\s*\(`

### 4.4 Process d’exception (rare, audité)
Allowlist par commentaire explicite :
- `// pp-allow:dangerous-dom`

Toute exception doit être revue (risque XSS/DOM clobbering/logic bombs).

---

## 5) Validation CI (minimum)

- Tests unitaires sur `parseResourcesDeepLink()` :
  - inconnus → drop
  - invalides → drop
  - arrays → règles Router respectées
  - unicode (zero-width) → normalisé
  - querystring trop longue → fallback neutre

- Tripwire `no-innerhtml` :
  - bloque les patterns
  - pas de faux positifs sur docs/fixtures

---

## 6) Changelog
- 1.0.0 (2025-12-23) : création du contrat P0 Deep links + Guard DOM injection.
