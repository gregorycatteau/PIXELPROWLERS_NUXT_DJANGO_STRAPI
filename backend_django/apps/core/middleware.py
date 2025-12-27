"""Middleware for privacy-friendly rate limiting with cooldowns."""
from __future__ import annotations

import logging
import time
from typing import Any

from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse

from apps.core.ratelimit import (
    build_headers,
    cooldown_hit,
    get_client_fingerprint,
    rate_limit_hit,
)

logger = logging.getLogger(__name__)

MSG_RATE_LIMITED = "Trop de requêtes"


class RateLimitMiddleware:
    """Apply rate limits and cooldowns to public endpoints."""

    def __init__(self, get_response: Any) -> None:
        self.get_response = get_response

    def __call__(self, request):
        group = self._get_endpoint_group(request)
        if not group:
            return self.get_response(request)

        limits = getattr(settings, "PX_RATE_LIMITS", {})
        cooldowns = getattr(settings, "PX_COOLDOWNS", {})
        config = limits.get(group)
        if not config:
            return self.get_response(request)

        limit = int(config["limit"])
        window = int(config["window"])
        cooldown_seconds = int(cooldowns.get(group, 0))

        fingerprint = get_client_fingerprint(request, group)
        rate_key = f"rl:{group}:{fingerprint}"
        cooldown_key = f"rl:cool:{group}:{fingerprint}"

        try:
            if cooldown_seconds > 0:
                allowed, retry_after = cooldown_hit(cache, cooldown_key, cooldown_seconds)
                if not allowed:
                    reset_epoch = self._get_reset_epoch(rate_key, window)
                    headers = build_headers(limit, 0, reset_epoch, retry_after=retry_after)
                    self._log_rate_limited(request, group, fingerprint)
                    return JsonResponse({"error": MSG_RATE_LIMITED}, status=429, headers=headers)

            allowed, remaining, reset_epoch = rate_limit_hit(cache, rate_key, limit, window)
            if not allowed:
                retry_after = None
                if cooldown_seconds > 0:
                    cooldown_until = int(time.time()) + cooldown_seconds
                    cache.set(cooldown_key, cooldown_until, timeout=cooldown_seconds)
                    retry_after = cooldown_seconds
                headers = build_headers(limit, 0, reset_epoch, retry_after=retry_after)
                self._log_rate_limited(request, group, fingerprint)
                return JsonResponse({"error": MSG_RATE_LIMITED}, status=429, headers=headers)
        except Exception:
            return self._handle_cache_failure(request, group, limit, window, fingerprint)

        return self.get_response(request)

    @staticmethod
    def _get_endpoint_group(request) -> str | None:
        path = request.path
        method = request.method.upper()

        if path.startswith("/api/v1/health/"):
            return None

        if method == "POST" and path == "/api/v1/contact/":
            return "contact"
        if method == "GET" and path == "/api/v1/resources/":
            return "resources"
        if method == "POST" and path == "/api/v1/gate125/register/":
            return "gate125"

        return None

    @staticmethod
    def _get_reset_epoch(rate_key: str, window: int) -> int:
        state = cache.get(rate_key)
        if state and "reset_epoch" in state:
            return int(state["reset_epoch"])
        return int(time.time()) + int(window)

    @staticmethod
    def _log_rate_limited(request, group: str, fingerprint: str) -> None:
        logger.info(
            "rate_limited",
            extra={
                "event": "rate_limited",
                "group": group,
                "method": request.method,
                "fp_prefix": fingerprint[:8],
            },
        )

    def _handle_cache_failure(self, request, group: str, limit: int, window: int, fingerprint: str):
        fail_closed = getattr(settings, "PX_CACHE_FAIL_CLOSED", False)
        retry_after = int(getattr(settings, "PX_CACHE_FAIL_RETRY_AFTER", 60))
        if fail_closed:
            reset_epoch = int(time.time()) + retry_after
            headers = build_headers(limit, 0, reset_epoch, retry_after=retry_after)
            logger.warning(
                "rate_limit_cache_error",
                extra={
                    "event": "rate_limit_cache_error",
                    "group": group,
                    "method": request.method,
                    "fp_prefix": fingerprint[:8],
                },
            )
            return JsonResponse({"error": MSG_RATE_LIMITED}, status=429, headers=headers)

        logger.warning(
            "rate_limit_cache_error_allow",
            extra={
                "event": "rate_limit_cache_error_allow",
                "group": group,
                "method": request.method,
                "fp_prefix": fingerprint[:8],
            },
        )
        return self.get_response(request)
