"""
Vues API pour le formulaire de contact.

Implémente la spec API_SPEC_V1.md:
- Erreurs neutres (anti-probing)
- Honeypot silent drop (faux succès)
- Logging sécurisé sans PII
"""
from __future__ import annotations

import logging
from typing import Any

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.logging import categorize_user_agent, get_client_ip, hash_ip

from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)

# Messages de réponse (constantes pour cohérence)
MSG_SUCCESS = "Votre message a bien été envoyé."
MSG_VALIDATION_ERROR = "Données invalides"
MSG_RATE_LIMITED = "Trop de requêtes"
MSG_SERVER_ERROR = "Erreur serveur"


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
        # Extraction IP pour logging (hashée)
        client_ip = get_client_ip(request)
        ip_hash = hash_ip(client_ip)
        ua_category = categorize_user_agent(request.META.get("HTTP_USER_AGENT"))

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
            return Response(
                {"success": True, "message": MSG_SUCCESS},
                status=status.HTTP_201_CREATED,
            )

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
            # Réponse neutre (ne pas révéler quel champ est invalide)
            return Response(
                {"error": MSG_VALIDATION_ERROR},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Création du message
        try:
            serializer.save()
            logger.info(
                "Contact message created",
                extra={
                    "ip_hash": ip_hash,
                    "ua_category": ua_category,
                    "endpoint": "/api/v1/contact/",
                },
            )
            return Response(
                {"success": True, "message": MSG_SUCCESS},
                status=status.HTTP_201_CREATED,
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
            # Réponse neutre
            return Response(
                {"error": MSG_SERVER_ERROR},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
