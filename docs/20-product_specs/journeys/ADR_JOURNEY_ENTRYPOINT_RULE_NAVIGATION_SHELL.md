---
id: PX_ADR_JOURNEY_ENTRYPOINT_RULE_NAVIGATION_SHELL
title: "ADR — Journey Entrypoint Rule + Navigation Shell"
version: 1.0.0
status: draft
date: 2025-12-31
owners: ["Marty"]
scope: ["pixelprowlers.io", "frontend_nuxt", "journeys"]
tags: ["ssot", "adr", "journey", "entrypoint", "navigation", "shell", "security"]
---

# ADR — JourneyEntrypointRule + NavigationShell

## Status
Accepted

## Context
Les parcours doivent suivre une chaine unique et predictable : E0_intro → questionnaire unique → bilan → ressources → sortie. La route /parcours/[journeySlug] doit rester fine, et la navigation doit provenir exclusivement de l'ordre du schema. La sécurité impose un parsing strict de ?step, un allowlist schema-only, et un fallback neutre (pas de redirect, pas de 404) pour les steps invalides.

## Decision
1) **Règle d'entrée unique**
   - L'entrée par défaut d'un parcours est **le premier step du schema** (attendu : `E0_intro`).

2) **Navigation basée sur le schema**
   - `prev/next` sont calculés **uniquement** depuis l'ordre du schema.
   - Les liens de navigation ne peuvent pas référencer des steps hors schema.

3) **Step invalide**
   - `?step` invalide **ne renvoie pas 404**.
   - Fallback silencieux vers l'entrée (premier step du schema), **sans redirection**.

4) **Répartition des responsabilités**
   - La route `/parcours/[journeySlug]` résout : manifest, schema, allowed steps, effective step.
   - `PPJourneyStepShell` gère : nav (prev/next), guards UI, baseline UX.

## Consequences
- Les parcours deviennent déterministes et sécurisés (allowlist schema-only).
- Le shell impose une navigation cohérente et empêche toute fuite via query.
- Les erreurs de slug sont traitées en 404 (niveau route/middleware), mais les steps invalides restent en 200 avec fallback neutre.

## Non-Goals
- Pas de redirections automatiques.
- Pas de tracking/analytics ajoutés (TODO séparé si besoin).
