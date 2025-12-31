# SPEC — PPJourneyStepShell v1

## Purpose
Shell universel pour les parcours : navigation et guards centralisés, calculés uniquement depuis le schema.

## Inputs
- `manifest`: manifest du parcours
- `schema`: schema du parcours (ordre des steps)
- `stepId`: step effectif (déjà résolu par la route)

## Computed
- `allowedStepIds`: allowlist **schema-only** (Set)
- `prevStepId` / `nextStepId`: calculés via l'ordre du schema
- `effectiveStep`: fourni par la route, validé par allowlist

## Security
- Parsing strict de `route.query.step` via `parseStepParam` partagé (route/shell).
- Rejet de la proto-pollution : `__proto__`, `constructor`, `prototype`.
- ASCII-only, length clamp 1..60, pattern strict : `^E[0-9]*_[a-z0-9_]+$`.
- Fallback neutre vers l'entrée si step invalide (pas de throw, pas de redirect).

## UX
- États neutres via DS state cells (pas d'états ad-hoc inline).
- Navigation par défaut rendue par le shell (guardée par CI).

## Forbidden
- `v-html`
- `innerHTML`
- remote assets
- `console`

## Notes
- `PPJourneyStepShell` ne doit jamais construire de liens hors schema.
- Hooks tracking : TODO hors scope.
