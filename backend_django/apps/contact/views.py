"""
Vues API pour le formulaire de contact (full-stack).

Implémente la spec V1.3:
- Erreurs neutres (anti-oracle)
- Honeypot + time-gate + rate limit
- Logging sécurisé sans PII
"""
from __future__ import annotations

import hashlib
import logging
from typing import Any

from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.logging import categorize_user_agent, get_client_ip
from apps.core.ratelimit import rate_limit_hit

from .models import ContactMessage
from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)

# Messages de réponse (constantes pour cohérence)
MSG_SUCCESS = "Merci, nous avons bien reçu votre demande."
MSG_VALIDATION_ERROR = "Données invalides"
MSG_TRY_LATER = "Reessaie plus tard."
MSG_SERVER_ERROR = "Erreur serveur"

CONTACT_GROUP = "contact"


def _hash_value(value: str) -> str:
    secret = settings.SECRET_KEY.encode()
    return hashlib.sha256(secret + value.encode()).hexdigest()


def _safe_header(value: str, fallback: str) -> str:
    cleaned = (value or fallback).replace("\r", " ").replace("\n", " ").strip()
    return cleaned or fallback


def _ip_prefix(ip: str) -> str:
    if not ip or ip == "unknown":
        return "unknown"
    try:
        import ipaddress

        addr = ipaddress.ip_address(ip)
        prefix = 64 if addr.version == 6 else 24
        network = ipaddress.ip_network(f"{ip}/{prefix}", strict=False)
        return str(network)
    except Exception:
        return "unknown"


def _get_rate_limits() -> dict[str, dict[str, int]]:
    return getattr(
        settings,
        "PX_CONTACT_RATE_LIMITS",
        {
            "minute": {"limit": 5, "window": 60},
            "hour": {"limit": 20, "window": 3600},
        },
    )


def _rate_limit_blocked(ip_hash: str) -> bool:
    limits = _get_rate_limits()
    for window_name, config in limits.items():
        limit = int(config["limit"])
        window = int(config["window"])
        key = f"rl:{CONTACT_GROUP}:{window_name}:{ip_hash}"
        allowed, _remaining, _reset = rate_limit_hit(cache, key, limit, window)
        if not allowed:
            return True
    return False


class ContactMessageView(APIView):
    """
    Endpoint POST /api/v1/contact/

    Réception des messages du formulaire de contact.
    Public, sans authentification.
    Rate limit: 3/min/IP (géré par middleware).
    """

    authentication_classes: list[Any] = []
    permission_classes: list[Any] = []

    def post(self, request, *args, **kwargs) -> Response:
        """
        POST /api/v1/contact/

        Valide, traite le honeypot, enregistre le message.
        Retourne toujours des réponses neutres (anti-probing).
        """
        # Extraction IP pour logging (hashée) et stockage minimisé
        client_ip = get_client_ip(request)
        ip_hash = _hash_value(client_ip) if client_ip and client_ip != "unknown" else "unknown"
        ip_prefix = _ip_prefix(client_ip)
        ua_category = categorize_user_agent(request.META.get("HTTP_USER_AGENT"))
        ua_hash = _hash_value(request.META.get("HTTP_USER_AGENT", "")[:200]) if request.META.get("HTTP_USER_AGENT") else ""

        # Vérification honeypot AVANT validation complète
        # Si rempli, silent drop avec faux succès
        honeypot_value = request.data.get("honeypot", "")
        if honeypot_value and honeypot_value.strip():
            logger.warning(
                "Honeypot triggered",
                extra={
                    "ip_hash": ip_hash,
                    "ua_category": ua_category,
                    "endpoint": "/api/v1/contact/",
                },
            )
            # Faux succès pour ne pas révéler la détection
            return Response({"status": "ok", "ticketId": None, "message": MSG_SUCCESS}, status=status.HTTP_200_OK)

        # Validation des données
        serializer = ContactMessageSerializer(data=request.data)

        if not serializer.is_valid():
            # Log sans détails des erreurs (anti-probing)
            logger.info(
                "Contact validation failed",
                extra={
                    "ip_hash": ip_hash,
                    "ua_category": ua_category,
                    "endpoint": "/api/v1/contact/",
                },
            )
            errors = {
                field: str(messages[0]) if messages else "Valeur invalide"
                for field, messages in serializer.errors.items()
            }
            return Response(
                {"status": "error", "message": MSG_VALIDATION_ERROR, "errors": errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Time-gate (anti-abus) - bloque si absent ou trop rapide
        min_seconds = int(getattr(settings, "PX_CONTACT_MIN_SECONDS", 3))
        elapsed = serializer.validated_data.get("clientTimeOnPageSeconds")
        if elapsed is None or elapsed < min_seconds:
            logger.info(
                "Contact timegate blocked",
                extra={
                    "ip_hash": ip_hash,
                    "ua_category": ua_category,
                    "endpoint": "/api/v1/contact/",
                },
            )
            return Response(
                {"status": "error", "message": MSG_TRY_LATER},
                status=status.HTTP_200_OK,
            )

        # Rate limit (anti-abus)
        if _rate_limit_blocked(ip_hash):
            logger.info(
                "Contact rate limited",
                extra={
                    "ip_hash": ip_hash,
                    "ua_category": ua_category,
                    "endpoint": "/api/v1/contact/",
                },
            )
            return Response(
                {"status": "error", "message": MSG_TRY_LATER},
                status=status.HTTP_200_OK,
            )

        try:
            data = serializer.validated_data
            contact_message = ContactMessage.objects.create(
                first_name=data.get("firstName", ""),
                last_name=data.get("lastName", ""),
                email=data["email"],
                message=data["message"],
                consent=data["consent"],
                consented_at=timezone.now(),
                ip_prefix=ip_prefix,
                ip_hash=ip_hash[:64],
                user_agent_hash=ua_hash[:64],
            )

            support_email = _safe_header(
                getattr(settings, "CONTACT_SUPPORT_EMAIL", "contact@pixelprowlers.io"),
                "contact@pixelprowlers.io",
            )
            from_email = _safe_header(
                getattr(settings, "CONTACT_FROM_EMAIL", support_email),
                support_email,
            )
            notify_subject = _safe_header(
                getattr(settings, "CONTACT_NOTIFY_SUBJECT", "Nouveau message de contact"),
                "Nouveau message de contact",
            )
            ack_subject = _safe_header(
                getattr(settings, "CONTACT_ACK_SUBJECT", "Nous avons bien reçu votre message"),
                "Nous avons bien reçu votre message",
            )

            notify_body = (
                "Nouveau message reçu via le formulaire de contact.\n\n"
                f"Ticket: {contact_message.ticket_id}\n"
                f"Prénom: {contact_message.first_name or '-'}\n"
                f"Nom: {contact_message.last_name or '-'}\n"
                f"Email: {contact_message.email}\n\n"
                "Message:\n"
                f"{contact_message.message}\n"
            )
            send_mail(
                notify_subject,
                notify_body,
                from_email,
                [support_email],
                fail_silently=False,
            )

            ack_body = (
                "Bonjour,\n\n"
                "Merci pour votre message. Nous reviendrons vers vous si besoin.\n"
                f"Référence: {contact_message.ticket_id}\n\n"
                "PixelProwlers\n"
            )
            send_mail(
                ack_subject,
                ack_body,
                from_email,
                [contact_message.email],
                fail_silently=False,
            )

            logger.info(
                "Contact message created",
                extra={
                    "ip_hash": ip_hash,
                    "ua_category": ua_category,
                    "endpoint": "/api/v1/contact/",
                    "ticket_id": str(contact_message.ticket_id),
                },
            )
            return Response(
                {
                    "status": "ok",
                    "ticketId": str(contact_message.ticket_id),
                    "message": MSG_SUCCESS,
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            # Log l'erreur sans détails sensibles
            logger.exception(
                "Contact creation failed",
                extra={
                    "ip_hash": ip_hash,
                    "endpoint": "/api/v1/contact/",
                },
            )
            return Response(
                {"status": "error", "message": MSG_SERVER_ERROR},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
