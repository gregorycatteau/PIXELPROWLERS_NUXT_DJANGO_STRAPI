"""
Rate limiting utilities for PixelProwlers.

Privacy-friendly by design: fingerprints are HMACs of IP + UA + endpoint group,
and raw IP/UA are never stored or logged.
"""
from __future__ import annotations

import hashlib
import hmac
import time
from typing import Any

from django.conf import settings

from apps.core.sanitizers import sanitize_string

UA_TRUNCATE_LEN = 64


def normalize_text_nfkc_stripzw(value: str) -> str:
    """Normalize text with NFKC + strip zero-width chars + clamp."""
    return sanitize_string(value or "", max_length=UA_TRUNCATE_LEN)


def get_client_fingerprint(request: Any, endpoint_group: str) -> str:
    """
    Build a non-PII fingerprint for anti-abuse checks.

    - IP source: REMOTE_ADDR only (no X-Forwarded-For)
    - UA: NFKC + strip ZW + truncate
    - HMAC-SHA256 with SECRET_KEY
    """
    ip = request.META.get("REMOTE_ADDR", "")
    ua_raw = request.META.get("HTTP_USER_AGENT", "")
    ua_norm = normalize_text_nfkc_stripzw(ua_raw)[:UA_TRUNCATE_LEN]
    message = f"{ip}|{ua_norm}|{endpoint_group}".encode()
    secret = settings.SECRET_KEY.encode()
    return hmac.new(secret, message, hashlib.sha256).hexdigest()


def rate_limit_hit(cache: Any, key: str, limit: int, window_seconds: int) -> tuple[bool, int, int]:
    """
    Track and evaluate a rate limit window.

    Returns:
        (allowed, remaining, reset_epoch)
    """
    now = int(time.time())
    state = cache.get(key)
    if not state or now >= int(state.get("reset_epoch", 0)):
        reset_epoch = now + int(window_seconds)
        state = {"count": 0, "reset_epoch": reset_epoch}

    count = int(state.get("count", 0))
    if count + 1 > int(limit):
        cache.set(key, state, timeout=int(window_seconds))
        return False, 0, int(state["reset_epoch"])

    count += 1
    state["count"] = count
    cache.set(key, state, timeout=int(window_seconds))
    remaining = max(0, int(limit) - count)
    return True, remaining, int(state["reset_epoch"])


def cooldown_hit(cache: Any, key: str, cooldown_seconds: int) -> tuple[bool, int]:
    """
    Check if a cooldown is active for a client key.

    Returns:
        (allowed, retry_after_seconds)
    """
    now = int(time.time())
    cooldown_until = cache.get(key)
    if not cooldown_until:
        return True, 0

    cooldown_until = int(cooldown_until)
    if now >= cooldown_until:
        cache.delete(key)
        return True, 0

    retry_after = max(1, cooldown_until - now)
    return False, retry_after


def build_headers(
    limit: int,
    remaining: int,
    reset_epoch: int,
    retry_after: int | None = None,
) -> dict[str, str]:
    """Build standard rate limit headers."""
    headers = {
        "X-RateLimit-Limit": str(int(limit)),
        "X-RateLimit-Remaining": str(max(0, int(remaining))),
        "X-RateLimit-Reset": str(int(reset_epoch)),
    }
    if retry_after is not None:
        headers["Retry-After"] = str(int(retry_after))
    return headers
