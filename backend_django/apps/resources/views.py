"""
Vues API pour les ressources éducatives.

Stub MVP - Endpoint /api/v1/resources/ pour lister les ressources.
Implémente la spec API_SPEC_V1.md avec erreurs neutres.
"""
from __future__ import annotations

from typing import Any

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class ResourcesListView(APIView):
    """
    GET /api/v1/resources/

    Liste les ressources éducatives disponibles.
    Stub MVP - retourne une liste vide avec structure conforme.
    Rate limit: 60/min/IP (géré par middleware futur).
    """

    authentication_classes: list[Any] = []
    permission_classes: list[Any] = []

    def get(self, request, *args, **kwargs) -> Response:
        """
        GET /api/v1/resources/

        Retourne la liste des ressources (stub: liste vide).
        """
        # Stub MVP: structure conforme mais données vides
        return Response(
            {
                "resources": [],
                "total": 0,
                "page": 1,
                "per_page": 20,
            },
            status=status.HTTP_200_OK,
        )
