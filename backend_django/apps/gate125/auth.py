"""
API Key auth for Gate125 endpoints.

Privacy-first: never log keys, compare in constant time, allow key rotation.
"""
from __future__ import annotations

import hashlib
import hmac
import re
from typing import Iterable

from django.conf import settings
from rest_framework.exceptions import APIException
from rest_framework.permissions import BasePermission

AUTH_PREFIX = "Api-Key "
API_KEY_PATTERN = re.compile(r"^[\x21-\x7E]+$")  # visible ASCII, no spaces


class Gate125Unauthorized(APIException):
    status_code = 401
    default_detail = {"error": "Accès non autorisé"}
    default_code = "unauthorized"


def _split_keys(values: Iterable[str]) -> list[str]:
    return [value.strip() for value in values if value and value.strip()]


def _load_allowed_hashes() -> list[str]:
    raw_keys = _split_keys(getattr(settings, "GATE125_API_KEYS", []))
    hashed_keys = _split_keys(getattr(settings, "GATE125_API_KEY_HASHES", []))

    allowed = []
    for key in raw_keys:
        allowed.append(hashlib.sha256(key.encode("utf-8")).hexdigest())
    for key_hash in hashed_keys:
        allowed.append(key_hash.lower())
    return allowed


def _extract_api_key(request) -> str:
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    if auth_header.startswith(AUTH_PREFIX):
        return auth_header[len(AUTH_PREFIX) :]

    x_api_key = request.META.get("HTTP_X_API_KEY", "")
    if x_api_key:
        return x_api_key

    return ""


def _is_valid_format(api_key: str) -> bool:
    if not api_key:
        return False
    if not API_KEY_PATTERN.match(api_key):
        return False
    return True


def _matches_allowed(api_key: str) -> bool:
    candidate = hashlib.sha256(api_key.encode("utf-8")).hexdigest()
    for allowed_hash in _load_allowed_hashes():
        if hmac.compare_digest(candidate, allowed_hash):
            return True
    return False


class Gate125ApiKeyPermission(BasePermission):
    message = "Accès non autorisé"

    def has_permission(self, request, view) -> bool:
        api_key = _extract_api_key(request)
        if not _is_valid_format(api_key):
            raise Gate125Unauthorized()
        if not _matches_allowed(api_key):
            raise Gate125Unauthorized()
        return True
