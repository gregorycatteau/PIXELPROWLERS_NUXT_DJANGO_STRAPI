"""
Utilitaires de logging sécurisé pour PixelProwlers.

Implémente les règles de la doctrine:
- NO PII dans les logs (jamais d'email, nom, message en clair)
- IP hashée avec salt rotatif journalier
- Redaction automatique des champs sensibles
- Logs structurés
"""
from __future__ import annotations

import hashlib
import os
from datetime import date
from typing import Any

# Champs sensibles à redacter automatiquement
REDACTED_FIELDS = frozenset([
    "email",
    "password",
    "token",
    "api_key",
    "message",
    "subject",
    "name",
    "phone",
    "organisation",
    "organization",
    "nom",
    "prenom",
    "telephone",
])


def _get_daily_salt() -> str:
    """
    Génère un salt basé sur la date du jour et une clé secrète.

    Le salt change chaque jour pour empêcher le tracking IP long-terme
    tout en permettant la détection d'abus sur une journée.
    """
    secret = os.environ.get("IP_HASH_SECRET", "dev-salt-change-in-prod")
    today = date.today().isoformat()
    return f"{secret}:{today}"


def hash_ip(ip: str) -> str:
    """
    Hash une IP avec salt rotatif journalier.

    Permet la détection d'abus tout en empêchant le tracking long-terme.

    Args:
        ip: L'adresse IP à hasher

    Returns:
        Hash SHA256 tronqué à 16 caractères (64 bits d'entropie)
    """
    if not ip:
        return "unknown"

    salt = _get_daily_salt()
    full_hash = hashlib.sha256(f"{salt}:{ip}".encode()).hexdigest()
    return full_hash[:16]


def redact_payload(data: dict[str, Any]) -> dict[str, Any]:
    """
    Redacte les champs sensibles d'un payload pour le logging.

    Args:
        data: Le dictionnaire à redacter

    Returns:
        Copie du dictionnaire avec les champs sensibles remplacés par '[REDACTED]'
    """
    if not data:
        return {}

    return {
        k: "[REDACTED]" if k.lower() in REDACTED_FIELDS else v
        for k, v in data.items()
    }


def categorize_user_agent(user_agent: str | None) -> str:
    """
    Catégorise un User-Agent sans le logger en entier (anti-fingerprinting).

    Args:
        user_agent: Le header User-Agent

    Returns:
        Une catégorie générique (browser_desktop, browser_mobile, bot, unknown)
    """
    if not user_agent:
        return "unknown"

    ua_lower = user_agent.lower()

    # Détection bots
    bot_patterns = ["bot", "crawler", "spider", "curl", "wget", "python", "httpx"]
    if any(pattern in ua_lower for pattern in bot_patterns):
        return "bot"

    # Détection mobile
    mobile_patterns = ["mobile", "android", "iphone", "ipad"]
    if any(pattern in ua_lower for pattern in mobile_patterns):
        return "browser_mobile"

    # Détection navigateur desktop
    browser_patterns = ["chrome", "firefox", "safari", "edge", "opera"]
    if any(pattern in ua_lower for pattern in browser_patterns):
        return "browser_desktop"

    return "unknown"


def get_client_ip(request) -> str:
    """
    Extrait l'IP client d'une requête Django.

    Gère les proxies (X-Forwarded-For) de manière sécurisée.

    Args:
        request: L'objet HttpRequest Django

    Returns:
        L'adresse IP du client
    """
    # En production derrière un proxy de confiance
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        # Prend la première IP (client original)
        return x_forwarded_for.split(",")[0].strip()

    return request.META.get("REMOTE_ADDR", "unknown")
