import json

from django.conf import settings as dj_settings
from django.core.cache import cache
from django.http import JsonResponse

from apps.core.middleware import RateLimitMiddleware


class DummyRequest:
    def __init__(self, path: str, method: str = "GET", meta: dict | None = None) -> None:
        self.path = path
        self.method = method
        self.META = meta or {"REMOTE_ADDR": "127.0.0.1", "HTTP_USER_AGENT": "pytest"}


def _ensure_settings():
    if not dj_settings.configured:
        dj_settings.configure(
            SECRET_KEY="test-secret-key",
            DEFAULT_CHARSET="utf-8",
            USE_TZ=True,
            CACHES={
                "default": {
                    "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
                    "LOCATION": "rate_limit_tests",
                }
            },
        )

    dj_settings.PX_RATE_LIMITS = {
        "contact": {"limit": 3, "window": 60},
        "gate125": {"limit": 2, "window": 2},
        "resources": {"limit": 2, "window": 2},
    }
    dj_settings.PX_COOLDOWNS = {
        "contact": 300,
        "gate125": 1,
    }


def test_rate_limit_middleware_behaviors():
    _ensure_settings()
    cache.clear()

    middleware = RateLimitMiddleware(lambda _req: JsonResponse({"ok": True}, status=200))

    # A) health is unlimited
    for _ in range(5):
        response = middleware(DummyRequest("/api/v1/health/"))
        assert response.status_code == 200

    # B) contact: 3 ok then 429 + cooldown
    for _ in range(3):
        response = middleware(DummyRequest("/api/v1/contact/", method="POST"))
        assert response.status_code == 200

    response = middleware(DummyRequest("/api/v1/contact/", method="POST"))
    assert response.status_code == 429
    assert json.loads(response.content) == {"error": "Trop de requêtes"}
    assert response.headers.get("Retry-After")
    assert response.headers.get("X-RateLimit-Limit")
    assert response.headers.get("X-RateLimit-Remaining") == "0"
    assert response.headers.get("X-RateLimit-Reset")

    # C) cooldown active => 429 + Retry-After > 0
    response = middleware(DummyRequest("/api/v1/contact/", method="POST"))
    assert response.status_code == 429
    assert int(response.headers.get("Retry-After", "0")) > 0

    # D) resources: no Retry-After
    for _ in range(2):
        response = middleware(DummyRequest("/api/v1/resources/", method="GET"))
        assert response.status_code == 200
    response = middleware(DummyRequest("/api/v1/resources/", method="GET"))
    assert response.status_code == 429
    assert json.loads(response.content) == {"error": "Trop de requêtes"}
    assert response.headers.get("Retry-After") is None
    assert response.headers.get("X-RateLimit-Limit")
    assert response.headers.get("X-RateLimit-Remaining") == "0"
    assert response.headers.get("X-RateLimit-Reset")

    # E) gate125: cooldown and headers
    for _ in range(2):
        response = middleware(DummyRequest("/api/v1/gate125/register/", method="POST"))
        assert response.status_code == 200
    response = middleware(DummyRequest("/api/v1/gate125/register/", method="POST"))
    assert response.status_code == 429
    assert json.loads(response.content) == {"error": "Trop de requêtes"}
    assert int(response.headers.get("Retry-After", "0")) > 0

    # F) neutral body (no leak)
    body = json.dumps(json.loads(response.content)).lower()
    assert "limit" not in body
    assert "window" not in body
