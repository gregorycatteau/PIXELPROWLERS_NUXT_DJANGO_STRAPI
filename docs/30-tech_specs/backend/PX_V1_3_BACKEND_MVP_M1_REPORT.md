---
id: PX_V1_3_BACKEND_MVP_M1_REPORT
version: 1.3.0
status: active
date: 2025-12-27
owners: ["Tom", "Eva"]
scope: ["backend_django", "api:v1"]
tags: ["backend", "mvp", "api", "ratelimit", "cooldown", "privacy", "logging", "openapi"]
---

# Backend MVP M1 — Report V1.3

## Objectif
Rendre auditable l'état réel du backend MVP (M1) et sa conformité au contrat API V1.3.

## Périmètre / Out of scope
- ✅ Inclus : endpoints V1 publics (health, contact, resources, gate125), middleware anti‑abus, logging no‑PII, tests existants.
- ❌ Out of scope : auth Gate125, cache partagé prod, purge/rétention DB, monitoring/observability.

## Résumé exécutif
- Rate limiting + cooldown appliqués sur endpoints publics, health exempté.
- Headers `X-RateLimit-*` renvoyés sur 429, `Retry-After` seulement si cooldown.
- Fingerprint anti‑abus HMAC‑SHA256 basé sur `REMOTE_ADDR` + UA normalisé + groupe.
- Honeypot contact en silent drop (faux succès) pour anti‑bot.
- Logs sans PII : pas d'email/message/IP brute, seulement hash/prefix.
- OpenAPI et API_SPEC alignés sur la politique rate limit/cooldown/headers.
- Tests backend présents pour sanitizers/logging + middleware rate limit.

## Ce qui est livré
- Endpoints V1 :
  - `GET /api/v1/health/`
  - `GET /api/v1/health/ready/`
  - `POST /api/v1/contact/`
  - `GET /api/v1/resources/` (stub public)
  - `POST /api/v1/gate125/register/` (stub public)
- Modules backend :
  - `backend_django/apps/core/ratelimit.py` (fingerprint, window, cooldown, headers)
  - `backend_django/apps/core/middleware.py` (RateLimitMiddleware)
  - `backend_django/apps/contact/views.py` (honeypot + erreurs neutres)
  - `backend_django/apps/health/views.py` (health/ready)
  - `backend_django/pixel_backend/settings/base.py` (PX_RATE_LIMITS/PX_COOLDOWNS)

## Anti‑abus (règles exactes)
- Contact: 3 req / 60s / IP, cooldown 300s.
- Gate125: 10 req / 3600s / IP, cooldown 3600s.
- Resources: 60 req / 60s / IP, pas de cooldown.
- Health/ready: illimité.
- 429 renvoie : `{"error":"Trop de requêtes"}` + headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- `Retry-After` seulement si cooldown actif (contact/gate125).

## Neutralité & privacy
- Erreurs neutres : 400/429/500 sans détails exploitables.
- Honeypot contact : valeur non vide ⇒ silent drop (201 faux succès).
- Logging no‑PII : pas d'email/message/IP brute, fingerprint HMAC, `fp_prefix` uniquement.

## Tests
- `backend_django/tests/test_ratelimit.py`
- `backend_django/tests/test_logging.py`
- `backend_django/tests/test_sanitizers.py`

Commandes :
```bash
cd backend_django && python3 -m pytest -q && cd ..
```

## Limitations / risques
- Cache local par défaut (LocMem) : non partagé entre instances en prod.
- Pas de confiance dans `X-Forwarded-For` (exigence sécurité) : attention si proxy sans REMOTE_ADDR fiable.
- Gate125 reste un stub public (auth API Key non implémentée).
- Pas de purge/rétention DB automatisée documentée ici.

## Next ROI++ candidates
- Cache partagé prod (Redis/Memcached) + métriques rate limiting.
- Auth Gate125 (API Key) + validation complète du payload.
- Rétention/purge automatisée des messages contact.
- pytest-django pour tests d'intégration DRF réalistes.

## Références
- `docs/30-tech_specs/backend/API_SPEC_V1.md`
- `docs/30-tech_specs/backend/openapi.v1.yaml`
- `docs/40-security/INCIDENT_RESPONSE_V1.md`
- `docs/40-security/SECURITY_INDEX.md`
- `docs/40-security/ARCHITECTURE_SECURITE.md`
