"""
Vues API pour l'Opération 125.

Stub MVP - Endpoint /api/v1/gate125/register/ pour inscription.
Implémente la spec API_SPEC_V1.md avec erreurs neutres.
Requiert API Key en production (stub: accès ouvert).
"""
from __future__ import annotations

import logging
from typing import Any

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.logging import categorize_user_agent, get_client_ip, hash_ip

logger = logging.getLogger(__name__)

# Messages de réponse (constantes pour cohérence)
MSG_SUCCESS = "Inscription enregistrée."
MSG_VALIDATION_ERROR = "Données invalides"
MSG_UNAUTHORIZED = "Accès non autorisé"


class Gate125RegisterView(APIView):
    """
    POST /api/v1/gate125/register/

    Inscription à l'Opération 125.
    Stub MVP - retourne succès pour toute requête valide.
    Rate limit: 10/h/IP (géré par middleware futur).
    Auth: API Key (stub: non implémenté).
    """

    authentication_classes: list[Any] = []
    permission_classes: list[Any] = []

    def post(self, request, *args, **kwargs) -> Response:
        """
        POST /api/v1/gate125/register/

        Stub: valide minimalement et retourne succès.
        En production, vérifier API Key + valider données.
        """
        # Extraction IP pour logging (hashée)
        client_ip = get_client_ip(request)
        ip_hash = hash_ip(client_ip)
        ua_category = categorize_user_agent(request.META.get("HTTP_USER_AGENT"))

        # Stub MVP: validation minimale
        email = request.data.get("email", "")
        if not email or "@" not in email:
            logger.info(
                "Gate125 validation failed",
                extra={
                    "ip_hash": ip_hash,
                    "ua_category": ua_category,
                    "endpoint": "/api/v1/gate125/register/",
                },
            )
            return Response(
                {"error": MSG_VALIDATION_ERROR},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Stub MVP: log et retourne succès sans persister
        logger.info(
            "Gate125 registration stub",
            extra={
                "ip_hash": ip_hash,
                "ua_category": ua_category,
                "endpoint": "/api/v1/gate125/register/",
            },
        )

        return Response(
            {"success": True, "message": MSG_SUCCESS},
            status=status.HTTP_201_CREATED,
        )
