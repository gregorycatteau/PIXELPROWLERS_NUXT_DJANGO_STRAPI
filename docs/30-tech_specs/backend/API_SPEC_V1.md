---
id: API_SPEC_V1
version: "1.3"
status: active
date: 2025-12-24
owners: ["Tom"]
  - Tom
scope: backend
tags:
  - backend
  - api
  - spec
  - security
  - contracts
---

# API Specification — PixelProwlers Backend V1.3

> **Document pré-OpenAPI** : Suffisamment structuré pour générer un `openapi.yaml` sans réinventer la roue.
> **Sécurité by default** : Validation stricte, erreurs neutres, rate limiting, logs sans PII.

---

## 1. Overview

### 1.1 Scope

Cette spécification couvre l'API REST du backend Django PixelProwlers :
- **Formulaire de contact** — Endpoint public avec anti-abus
- **Gate Operation 125** — Endpoints séparés, accès restreint (future)
- **Health & Status** — Endpoints internes

### 1.2 Versioning

| Version API | Status | Base Path |
|-------------|--------|-----------|
| v1 | **Active** | `/api/v1/` |

**Règle de versioning** :
- Changements non-breaking : version mineure (1.1, 1.2)
- Changements breaking : nouvelle version majeure (v2)
- Endpoints dépréciés : 6 mois de notice minimum

### 1.3 Environnements

| Environnement | Base URL | Notes |
|---------------|----------|-------|
| Development | `http://localhost:8000` | Hot reload, debug=True |
| Test | `http://localhost:8001` | DB test isolée |
| Production | `https://api.pixelprowlers.com` | HTTPS only |

> ⚠️ Aucune URL interne exposée. Les URLs ci-dessus sont des exemples publics.

---

## 2. Authentication & Authorization

### 2.1 Classification des endpoints

| Type | Auth requise | Exemple |
|------|--------------|---------|
| **Public** | Non | `/api/v1/contact/`, `/api/v1/health/` |
| **Protected** | Oui | `/api/v1/admin/*`, `/api/v1/gate125/*` |
| **Internal** | mTLS | Service-to-service (future) |

### 2.2 Options d'authentification (non finalisées)

| Méthode | Usage prévu | Status |
|---------|-------------|--------|
| Session Django | Admin panel | Actif |
| Token JWT | API mobile/SPA (future) | Planifié |
| mTLS | Service interne | Planifié |
| API Key | Gate Operation 125 | Planifié |

> **Note** : L'auth finale sera décidée lors de l'implémentation des endpoints protégés.

### 2.3 Principes PixelProwlers

- **Parcours sans compte** : Les endpoints publics (contact, diagnostic P1) ne requièrent pas d'authentification
- **Minimisation** : Aucune donnée utilisateur stockée au-delà du nécessaire
- **No tracking** : Pas d'UTM, pas de fingerprinting, pas de cookies tiers

---

## 3. Endpoints

### 3.1 Table des endpoints

| Méthode | Path | But | Auth | Rate Limit |
|---------|------|-----|------|------------|
| `GET` | `/api/v1/health/` | Health check | Non | ∞ |
| `GET` | `/api/v1/health/ready/` | Readiness probe | Non | ∞ |
| `POST` | `/api/v1/contact/` | Soumettre formulaire contact | Non | 3/min/IP |
| `GET` | `/api/v1/resources/` | Liste ressources | Non | 60/min/IP |
| `POST` | `/api/v1/gate125/register/` | Inscription Operation 125 | API Key | 10/h/IP |

---

### 3.2 Endpoint : Health Check

```
GET /api/v1/health/
```

**Response Success (200)**
```json
{
  "status": "healthy",
  "version": "1.3.0",
  "timestamp": "2025-12-24T12:00:00Z"
}
```

**Response Unhealthy (503)**
```json
{
  "status": "unhealthy",
  "version": "1.3.0",
  "timestamp": "2025-12-24T12:00:00Z"
}
```

---

### 3.3 Endpoint : Contact Form

```
POST /api/v1/contact/
Content-Type: application/json
```

**Request Body Schema**
```json
{
  "email": "string (required, max 254 chars, RFC 5322)",
  "subject": "string (required, max 200 chars, enum allowed)",
  "message": "string (required, min 10, max 2000 chars)",
  "honeypot": "string (must be empty)"
}
```

**Subjects Allowlist (enum)**
```
- "question_generale"
- "demande_accompagnement"
- "signalement_bug"
- "autre"
```

**Response Success (201)**
```json
{
  "success": true,
  "message": "Votre message a bien été envoyé."
}
```

**Response Errors (neutres)**

| Code | Body | Cause réelle (non exposée) |
|------|------|---------------------------|
| 400 | `{"error": "Données invalides"}` | Validation failed |
| 429 | `{"error": "Trop de requêtes"}` | Rate limit exceeded |
| 500 | `{"error": "Erreur serveur"}` | Internal error |

> **Anti-probing** : Toutes les erreurs retournent des messages génériques.

---

### 3.4 Endpoint : Gate Operation 125 (Future)

```
POST /api/v1/gate125/register/
Authorization: Api-Key <KEY>
Content-Type: application/json
```
Header alternatif accepté : `X-API-Key: <KEY>`

**Request Body Schema**
```json
{
  "email": "string (required, max 254 chars)",
  "organization": "string (optional, max 200 chars)",
  "role": "string (enum: porteur_projet, formateur, accompagnant, autre)"
}
```

**Response Success (201)**
```json
{
  "success": true,
  "message": "Inscription enregistrée."
}
```

**Response Errors (neutres)**

| Code | Body | Cause réelle (non exposée) |
|------|------|---------------------------|
| 401 | `{"error": "Accès non autorisé"}` | API Key manquante ou invalide |

> **Isolation** : Gate 125 endpoints sur path séparé, API Key obligatoire, rate limit strict.

---

### 3.5 Endpoint : Resources Catalog (Option A)

```
GET /api/v1/resources/
```

**Source** : Catalogue SSOT versionné (pas de DB).

**Query params (allowlist + clamp)**  
- `q` : recherche simple (title/summary), max 120 chars  
- `tags` : CSV (max 5 tags)  
- `category` : allowlist du catalogue  
- `level` : allowlist du catalogue  
- `journey` : allowlist du catalogue  
- `type` : allowlist du catalogue  
- `limit` : 1..50 (default 20)  
- `offset` : 0..1000 (default 0)  

**Response Success (200)**
```json
{
  "resources": [
    {
      "id": "res-001",
      "slug": "canvas-probleme",
      "title": "Canvas probleme",
      "summary": "Un canevas simple pour clarifier le probleme a traiter.",
      "tags": ["diagnostic", "clarte"],
      "category": "tool",
      "level": "intro",
      "journey": "p1",
      "type": "tool",
      "path": "/ressources/canvas-probleme"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

**Response Errors (neutres)**

| Code | Body | Cause réelle (non exposée) |
|------|------|---------------------------|
| 400 | `{"error": "Données invalides"}` | Paramètre invalide |

> **Sécurité** : liens relatifs uniquement, aucune URL externe.

---

## 4. Validation & Sanitization

### 4.1 Règles de validation string

| Champ | Règle | Rationale |
|-------|-------|-----------|
| `email` | RFC 5322, max 254 chars | Standard email |
| `subject` | Allowlist enum | Anti-injection |
| `message` | min 10, max 2000 chars | Spam prevention |
| Tous strings | NFKC normalization | Unicode canonicalization |
| Tous strings | Strip zero-width chars | Anti-spoofing |
| Tous strings | Trim whitespace | Cleanup |

### 4.2 Implémentation validation

```python
import unicodedata
import re

def sanitize_string(value: str, max_length: int = 1000) -> str:
    """
    Sanitize user input string.
    - NFKC normalization
    - Remove zero-width characters
    - Clamp length
    - Strip whitespace
    """
    if not value:
        return ""
    
    # NFKC normalization
    normalized = unicodedata.normalize('NFKC', value)
    
    # Remove zero-width characters
    zero_width_pattern = r'[\u200b\u200c\u200d\u2060\ufeff]'
    cleaned = re.sub(zero_width_pattern, '', normalized)
    
    # Clamp length and strip
    return cleaned[:max_length].strip()
```

### 4.3 Validation enum (allowlists)

```python
VALID_SUBJECTS = frozenset([
    "question_generale",
    "demande_accompagnement", 
    "signalement_bug",
    "autre"
])

VALID_ROLES_GATE125 = frozenset([
    "porteur_projet",
    "formateur",
    "accompagnant",
    "autre"
])
```

---

## 5. Anti-abus & Rate Limiting

### 5.1 Configuration par endpoint

| Endpoint | Rate | Window | Scope | Action overflow |
|----------|------|--------|-------|-----------------|
| `/api/v1/contact/` | 3 | 1 min | IP | 429 + cooldown 5 min |
| `/api/v1/gate125/*` | 10 | 1 hour | IP | 429 + cooldown 1 hour |
| `/api/v1/resources/` | 60 | 1 min | IP | 429 |
| `/api/v1/health/*` | ∞ | - | - | - |

Notes :
- En production multi‑instance, le rate limiting nécessite un **cache partagé** (Redis).
- En cas d'indisponibilité du cache en prod, la réponse est **fail‑closed** (429 neutre).

### 5.2 Headers de rate limit

```http
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1703419200
```

Notes :
- Ces headers sont renvoyés pour toute réponse **429** des endpoints rate-limités.
- `Retry-After` est présent uniquement quand un cooldown est actif (contact, gate125).
- En production, le rate limiting doit s'appuyer sur un cache partagé (ex: Redis).

### 5.3 Honeypot anti-bot

```python
# Contact form includes hidden honeypot field
# If filled, silently drop submission (no error visible to attacker)
if request.data.get('honeypot'):
    # Log attempt without details
    logger.warning("Honeypot triggered", extra={"ip_hash": hash_ip(ip)})
    # Return success to not reveal detection
    return Response({"success": True, "message": "Votre message a bien été envoyé."})
```

### 5.4 Protections additionnelles

- **CAPTCHA** : Optionnel pour contact form (décision UX en cours)
- **IP reputation** : Blocklist des IP connus malveillants (future)
- **Geo-blocking** : Non activé (produit francophone mais ouvert)

---

## 6. Logging Policy

### 6.1 Principes

| Règle | Description |
|-------|-------------|
| **NO PII** | Jamais d'email, nom, message en clair dans les logs |
| **NO payload brut** | Logs structurés uniquement |
| **NO query brute** | En prod, paramètres sensibles redactés |
| **Correlation ID** | `X-Request-Id` non stable (généré par requête) |

### 6.2 Structure des logs

```json
{
  "timestamp": "2025-12-24T12:00:00.123Z",
  "level": "INFO",
  "service": "pixel_backend",
  "request_id": "uuid-v4-ephemeral",
  "endpoint": "/api/v1/contact/",
  "method": "POST",
  "status": 201,
  "duration_ms": 45,
  "ip_hash": "sha256:abc123...",
  "user_agent_category": "browser_desktop"
}
```

### 6.3 Redaction automatique

```python
REDACTED_FIELDS = frozenset([
    'email', 'password', 'token', 'api_key',
    'message', 'subject', 'name', 'phone'
])

def redact_payload(data: dict) -> dict:
    """Redact sensitive fields from log payload."""
    return {
        k: '[REDACTED]' if k.lower() in REDACTED_FIELDS else v
        for k, v in data.items()
    }
```

### 6.4 IP hashing

```python
import hashlib

def hash_ip(ip: str, salt: str = DAILY_SALT) -> str:
    """
    Hash IP with daily rotating salt.
    Prevents IP tracking while allowing abuse detection.
    """
    return hashlib.sha256(f"{salt}:{ip}".encode()).hexdigest()[:16]
```

---

## 7. Transport Security & CORS/CSRF

### 7.1 Transport

| Environnement | Protocol | HSTS |
|---------------|----------|------|
| Development | HTTP | Non |
| Production | HTTPS only | Oui (max-age=31536000) |

### 7.2 CORS Configuration

```python
CORS_ALLOWED_ORIGINS = [
    "https://pixelprowlers.com",
    "https://www.pixelprowlers.com",
]

# Development only
if DEBUG:
    CORS_ALLOWED_ORIGINS += [
        "http://localhost:3000",
        "http://localhost:3001",
    ]

CORS_ALLOW_METHODS = ["GET", "POST", "OPTIONS"]
CORS_ALLOW_HEADERS = ["Content-Type", "X-Request-Id"]
CORS_EXPOSE_HEADERS = ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"]
```

### 7.3 CSRF Protection

| Endpoint type | CSRF |
|---------------|------|
| API JSON (POST) | Token cookie + header |
| Admin forms | Django CSRF middleware |
| Health checks | Exempt |

```python
# API views with CSRF token via cookie
@method_decorator(ensure_csrf_cookie)
def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)
```

### 7.4 Security Headers

```python
SECURE_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "0",  # Deprecated, rely on CSP
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}
```

---

## 8. Payload Examples (neutres, sans PII)

### 8.1 Contact Form — Valid Request

```bash
curl -X POST https://api.example.com/api/v1/contact/ \
  -H "Content-Type: application/json" \
  -H "X-Request-Id: $(uuidgen)" \
  -d '{
    "email": "example@domain.com",
    "subject": "question_generale",
    "message": "Bonjour, je souhaite en savoir plus sur vos services.",
    "honeypot": ""
  }'
```

**Response**
```json
{
  "success": true,
  "message": "Votre message a bien été envoyé."
}
```

### 8.2 Contact Form — Validation Error

```bash
curl -X POST https://api.example.com/api/v1/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "subject": "unknown_subject",
    "message": "Hi"
  }'
```

**Response (400)**
```json
{
  "error": "Données invalides"
}
```

> **Note** : L'erreur ne précise PAS quel champ est invalide (anti-probing).

### 8.3 Rate Limited Request

```bash
# After 4th request in 1 minute
curl -X POST https://api.example.com/api/v1/contact/ \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**Response (429)**
```json
{
  "error": "Trop de requêtes"
}
```

**Headers**
```http
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1703419500
Retry-After: 300
```

---

## 9. Error Handling

### 9.1 Codes HTTP utilisés

| Code | Signification | Usage |
|------|---------------|-------|
| 200 | OK | GET success |
| 201 | Created | POST success |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Auth required (future) |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Maintenance/unhealthy |

### 9.2 Format erreur standard

```json
{
  "error": "Message générique (jamais technique)",
  "code": "ERROR_CODE_OPTIONAL"
}
```

### 9.3 Erreurs neutres (anti-probing)

| Situation réelle | Message affiché |
|-----------------|-----------------|
| Email invalide | "Données invalides" |
| Subject non-allowlisté | "Données invalides" |
| Message trop court | "Données invalides" |
| Honeypot rempli | "Votre message a bien été envoyé." (silent drop) |
| DB error | "Erreur serveur" |
| Rate limited | "Trop de requêtes" |

---

## 10. Future Endpoints (Roadmap)

| Endpoint | Priority | Sprint cible |
|----------|----------|--------------|
| `GET /api/v1/resources/` | P1 | V1.3 |
| `GET /api/v1/resources/:id/` | P2 | V1.4 |
| `POST /api/v1/gate125/register/` | P1 | V1.3.1 |
| `POST /api/v1/diagnostic/submit/` | P2 | V1.5 |

---

## 11. OpenAPI Generation Notes

Ce document est conçu pour faciliter la génération d'un `openapi.yaml` :

```yaml
# Exemple de mapping vers OpenAPI
paths:
  /api/v1/contact/:
    post:
      operationId: submitContact
      summary: Soumettre un formulaire de contact
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ContactRequest'
      responses:
        '201':
          $ref: '#/components/responses/ContactSuccess'
        '400':
          $ref: '#/components/responses/ValidationError'
        '429':
          $ref: '#/components/responses/RateLimited'
```

---

## References

| Document | Lien |
|----------|------|
| Incident Response | [INCIDENT_RESPONSE_V1.md](../../40-security/INCIDENT_RESPONSE_V1.md) |
| Security Gates | [SECURITY_GATES.md](../../40-security/SECURITY_GATES.md) |
| Coding Rulebook | [CODING_RULEBOOK_V1.md](../quality/CODING_RULEBOOK_V1.md) |
| Environments | [ENVIRONMENTS.md](../../00-foundations/ENVIRONMENTS.md) |

---

## Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| 1.0 | 2025-12-24 | Tom | Création initiale |

---

> **Doctrine PixelProwlers** : Privacy-first, minimisation, erreurs neutres, no tracking, no remote assets.
