"""
Utilitaires de sanitization pour les inputs utilisateur.

Implémente les règles de sécurité définies dans API_SPEC_V1.md:
- NFKC normalization (Unicode canonicalization)
- Suppression des caractères zero-width (anti-spoofing)
- Trim whitespace
- Clamping de longueur
"""
from __future__ import annotations

import re
import unicodedata

# Pattern pour les caractères zero-width (anti-spoofing)
# Inclut: ZWSP, ZWNJ, ZWJ, WJ, BOM
ZERO_WIDTH_PATTERN = re.compile(r"[\u200b\u200c\u200d\u2060\ufeff]")


def sanitize_string(value: str, max_length: int = 1000) -> str:
    """
    Sanitize une chaîne utilisateur selon les règles PixelProwlers.

    1. NFKC normalization (Unicode canonicalization)
    2. Suppression des caractères zero-width (anti-spoofing)
    3. Clamping de longueur
    4. Strip whitespace

    Args:
        value: La chaîne à sanitizer
        max_length: Longueur maximale autorisée (défaut: 1000)

    Returns:
        La chaîne sanitizée, ou chaîne vide si None/vide
    """
    if not value:
        return ""

    # 1. NFKC normalization
    normalized = unicodedata.normalize("NFKC", value)

    # 2. Suppression caractères zero-width
    cleaned = ZERO_WIDTH_PATTERN.sub("", normalized)

    # 3. Clamping longueur + 4. Strip
    return cleaned[:max_length].strip()


def sanitize_email(email: str) -> str:
    """
    Sanitize un email selon les règles PixelProwlers.

    - Max 254 chars (RFC 5321)
    - NFKC + zero-width strip
    - Lowercase (norme email)

    Args:
        email: L'email à sanitizer

    Returns:
        L'email sanitizé en lowercase
    """
    sanitized = sanitize_string(email, max_length=254)
    return sanitized.lower()


def validate_in_allowlist(value: str, allowlist: frozenset[str]) -> bool:
    """
    Vérifie qu'une valeur est dans une allowlist.

    Args:
        value: La valeur à vérifier
        allowlist: L'ensemble des valeurs autorisées

    Returns:
        True si la valeur est dans l'allowlist
    """
    return value in allowlist
