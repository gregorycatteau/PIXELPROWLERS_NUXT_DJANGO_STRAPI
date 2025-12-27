---
id: PX_V1_3_BACKEND_CACHE_FAILCLOSED_DECISION
version: 1.3.0
status: draft
date: 2025-12-27
owners: ["Tom", "Eva"]
scope: ["backend_django", "api:v1", "cache"]
tags: ["backend", "cache", "redis", "ratelimit", "security", "decision"]
---

# Backend Cache Fail‑Closed — Decision V1.3

## Objectif
Rendre le rate limiting fiable en prod multi‑instance via cache partagé, avec fail‑closed en cas d'indisponibilité.

## Décision
- **Prod** : cache Redis (env `REDIS_URL` ou `REDIS_HOST/PORT/DB`).
- **Dev/Test** : LocMem accepté (fail‑open).
- **Fail‑closed prod** : si cache indisponible, renvoyer 429 neutre + `Retry-After` court.
- **Readiness** : check cache optionnel activé en prod si Redis configuré.

## Justification (ROI++)
- Anti‑abus effectif en multi‑instance.
- Réduction brute‑force/spam sur endpoints publics.
- Comportement prévisible en incident cache (neutre, privacy‑first).

## Menaces & mitigations
- Cache down → blocage prod : retry short + monitoring + alerting.
- Contournement rate limit sans cache partagé : Redis obligatoire en prod.
- Leak logs : logs minimaux sans PII.

## DoD
- Cache Redis configuré en prod via env.
- Fail‑closed activé uniquement en prod.
- Test unitaire fail‑closed (cache error) vert.

## Références
- `docs/30-tech_specs/backend/API_SPEC_V1.md`
- `docs/40-security/POLITIQUES_OPSEC_PRIVACY.md`
