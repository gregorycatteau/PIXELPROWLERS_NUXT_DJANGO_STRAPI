"""
Serializers pour le formulaire de contact (full-stack).

Implémente la spec V1.3:
- Sanitization NFKC + zero-width strip + strip contrôles
- Validation stricte des longueurs
- Messages d'erreur neutres par champ
"""
from __future__ import annotations

import re
import unicodedata

from rest_framework import serializers

from apps.core.sanitizers import ZERO_WIDTH_PATTERN, sanitize_email

ERROR_INVALID = "Valeur invalide"
ERROR_REQUIRED = "Champ requis"

CONTROL_CHARS_PATTERN = re.compile(r"[\u0000-\u001f\u007f]")


def _strip_control_chars(value: str, allow_newlines: bool = False) -> str:
    if allow_newlines:
        value = value.replace("\r", "\n")
        return re.sub(r"[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]", "", value)
    return CONTROL_CHARS_PATTERN.sub("", value)


def _sanitize_text(value: str, max_length: int, allow_newlines: bool = False) -> str:
    if not value:
        return ""
    normalized = unicodedata.normalize("NFKC", value)
    cleaned = ZERO_WIDTH_PATTERN.sub("", normalized)
    cleaned = _strip_control_chars(cleaned, allow_newlines=allow_newlines)
    cleaned = cleaned.strip()
    if len(cleaned) > max_length:
        raise serializers.ValidationError(ERROR_INVALID)
    return cleaned


def _reject_crlf(value: str) -> str:
    if "\r" in value or "\n" in value:
        raise serializers.ValidationError(ERROR_INVALID)
    return value


class ContactMessageSerializer(serializers.Serializer):
    """Valide les données du formulaire de contact."""

    firstName = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True,
        error_messages={"required": ERROR_REQUIRED, "blank": ERROR_INVALID, "max_length": ERROR_INVALID},
    )
    lastName = serializers.CharField(
        max_length=80,
        required=False,
        allow_blank=True,
        error_messages={"required": ERROR_REQUIRED, "blank": ERROR_INVALID, "max_length": ERROR_INVALID},
    )
    email = serializers.EmailField(
        max_length=120,
        error_messages={"required": ERROR_REQUIRED, "blank": ERROR_REQUIRED, "invalid": ERROR_INVALID},
    )
    message = serializers.CharField(
        max_length=4000,
        min_length=10,
        error_messages={
            "required": ERROR_REQUIRED,
            "blank": ERROR_REQUIRED,
            "max_length": ERROR_INVALID,
            "min_length": ERROR_INVALID,
        },
    )
    consent = serializers.BooleanField(
        error_messages={"required": ERROR_REQUIRED, "invalid": ERROR_INVALID},
    )
    honeypot = serializers.CharField(required=False, allow_blank=True, default="")
    clientTimeOnPageSeconds = serializers.FloatField(required=False, min_value=0)

    def validate_firstName(self, value: str) -> str:
        cleaned = _sanitize_text(value, max_length=80)
        return _reject_crlf(cleaned)

    def validate_lastName(self, value: str) -> str:
        cleaned = _sanitize_text(value, max_length=80)
        return _reject_crlf(cleaned)

    def validate_email(self, value: str) -> str:
        sanitized = sanitize_email(value)
        return _reject_crlf(sanitized)

    def validate_message(self, value: str) -> str:
        sanitized = _sanitize_text(value, max_length=4000, allow_newlines=True)
        if len(sanitized) < 10:
            raise serializers.ValidationError(ERROR_INVALID)
        return sanitized

    def validate_consent(self, value: bool) -> bool:
        if value is not True:
            raise serializers.ValidationError(ERROR_INVALID)
        return value

    def validate_honeypot(self, value: str) -> str:
        return _sanitize_text(value, max_length=120)
