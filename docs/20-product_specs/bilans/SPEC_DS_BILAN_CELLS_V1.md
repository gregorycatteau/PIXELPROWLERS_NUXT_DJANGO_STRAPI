---
id: SPEC_DS_BILAN_CELLS_V1
version: 1.0.0
status: draft
date: 2025-12-31
owners: ["Marty"]
scope: ["pixelprowlers.io", "journeys:*", "bilan:*"]
tags: ["spec", "bilan", "contract", "security"]
---

# SPEC — DS Bilan Cells v1

## Objectif
Définir des cellules UI réutilisables pour rendre un bilan universel, lisible et neutre.

## Principes UX
- Ton neutre, pas d’alarmisme.
- Lisibilité maximale (phrases courtes, hiérarchie claire).
- Pas de jargon technique non expliqué.
- Aucune HTML injection (pas de `v-html`).

## Cellules

### 1) BilanSection
**Rôle** : conteneur de section.
- Entrées : `title`, `description` (optionnel), `state` (empty/partial/full).
- Contenu : slot pour cartes ou listes.
- UI : état vide via DS state cell, jamais d’état ad-hoc inline.

### 2) BilanRepereCard
**Rôle** : synthèse “repères”.
- Entrées : `title`, `summary`, `badge` (optionnel), `emoji` (optionnel).
- Affiche : label clair + 1–2 phrases max.

### 3) BilanRiskCard
**Rôle** : risques / tensions prioritaires.
- Entrées : `title`, `summary`, `severity` (optionnel), `signals` (liste courte).
- Affiche : 1 insight principal + signaux maximum 2–3.

### 4) BilanRecommendationCard
**Rôle** : recommandations actionnables.
- Entrées : `title`, `summary`, `effort` (optionnel), `impact` (optionnel).
- Affiche : une phrase claire + détails courts.

### 5) BilanActionCard
**Rôle** : actions immédiates.
- Entrées : `title`, `description`, `ctaLabel` (optionnel), `ctaTarget` (relatif uniquement).
- Affiche : action concrète sans promesse excessive.

## États
- **empty** : message neutre + invitation à compléter le parcours.
- **partial** : message neutre + indique qu’il manque des repères.
- **full** : contenu complet, pas de disclaimers inutiles.

## Interdits
- `v-html`
- `innerHTML`
- remote assets
- logs/console de données utilisateur
