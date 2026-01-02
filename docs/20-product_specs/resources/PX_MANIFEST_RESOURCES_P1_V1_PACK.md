---
id: PX_MANIFEST_RESOURCES_P1_V1_PACK
version: 1.0.0
status: active
date: 2026-01-02
owners: ["Jared", "Marty"]
scope: ["pixelprowlers.io", "P1", "ressources"]
tags: ["manifest", "resources", "p1", "v1", "roi", "security", "library"]
---

# Manifest — Pack Ressources P1 v1 (10 published)

## Objectif
Figé V1 : une bibliothèque **petite mais qui cogne**, orientée **action < 10 min**.
Pas de vitrine, pas de narration, pas de liens externes. On construit une **machine à faire faire**.

## Tag de release
- `resources-p1-v1.0.0`

## Doctrine V1 (non négociable)
- **P1 only** : P2–P5 = **404 strict** en prod (feature-flag seulement en dev/preview interne)
- **Hard cap** : exactement **10 ressources published** (guard `=== 10`)
- **Recos Bilan** : pack-only, **≤ 3**, déterministes, fallback = `[]` + CTA “Explorer la bibliothèque”
- **Contenu texte-only** : pas de HTML, pas de rendu markdown, pas de `v-html`
- **No-URL** : aucune URL dans les bullets tant que `SafeLink` n’existe pas
- **Publication policy** (published) :
  - `outcome` **obligatoire**
  - `contentBlocks.length >= 2`
  - `>= 1 contentBlock.kind === "action"`
- **Related graph** : hub → enfants, **zéro cycle**, fan-out ≤ 6, 0 unknown slugs
  - En V1 : les **enfants ne pointent vers personne** (pas de retours, pas de liens croisés)

## Liste officielle des 10 slugs (exact match)
### Grappe A — Réunions & décisions (Hub A)
- `reunion-30min-sans-noyade` (HUB)
- `decision-log-minimal`
- `compte-rendu-utile-1page`
- `matrice-responsabilites-raci-lite`

### Grappe B — Communication & flux (Hub B)
- `rituel-hebdo-15min` (HUB)
- `charte-canaux-3-couleurs`
- `tableau-bord-3-signaux`

### Grappe C — Hygiène numérique / reprise en main (Hub C)
- `inventaire-acces-30min` (HUB)
- `mfa-partout-en-20min`
- `backups-test-15min`

## Graphe related “hub → enfants” (V1)
### Hub A
- `reunion-30min-sans-noyade` → [
  `decision-log-minimal`,
  `compte-rendu-utile-1page`,
  `matrice-responsabilites-raci-lite`
]

### Hub B
- `rituel-hebdo-15min` → [
  `charte-canaux-3-couleurs`,
  `tableau-bord-3-signaux`
]

### Hub C
- `inventaire-acces-30min` → [
  `mfa-partout-en-20min`,
  `backups-test-15min`
]

### Règle V1 pour les enfants
- `decision-log-minimal` → []
- `compte-rendu-utile-1page` → []
- `matrice-responsabilites-raci-lite` → []
- `charte-canaux-3-couleurs` → []
- `tableau-bord-3-signaux` → []
- `mfa-partout-en-20min` → []
- `backups-test-15min` → []

## QA “anti-honte cosmique” (5 min)
Sur preview prod :
- `/ressources` → **10 visibles** (pas 9, pas 11)
- un draft → **404**
- chaque ressource du pack :
  - `outcome` visible et court
  - ≥2 blocs dont 1 action
  - bullets lisibles (pas de pavés)
- bilan/reco :
  - ≤3 recos
  - slugs uniquement du pack
  - stable au refresh

## DoD release (green line)
- `npm run --prefix frontend_nuxt typecheck`
- `npm run --prefix frontend_nuxt guards:ci`
- `npm run --prefix frontend_nuxt build`
- `python3 tools/ssot_generate_indexes.py --check`

## KPI V1 (pilotage)
- #published = **10** (fixe)
- % avec action = **100%**
- time-to-value (action) < **10 min**
- graph health = **0 cycles / fan-out ≤ 6 / 0 unknown slugs**
