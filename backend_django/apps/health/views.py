"""
Vues Health Check pour PixelProwlers Backend.

Endpoints:
- GET /api/v1/health/ - Health check général
- GET /api/v1/health/ready/ - Readiness probe (vérifie DB)
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from django.conf import settings
from django.core.cache import cache
from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Version API (à synchroniser avec openapi.yaml)
API_VERSION = "1.3.0"


class HealthView(APIView):
    """
    Health check général.

    Retourne toujours un statut (healthy/unhealthy) avec version et timestamp.
    Rate limit: illimité (utilisé par les orchestrateurs).
    """

    authentication_classes: list[Any] = []
    permission_classes: list[Any] = []

    def get(self, request, *args, **kwargs) -> Response:
        """
        GET /api/v1/health/

        Retourne le statut du service.
        """
        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        return Response(
            {
                "status": "healthy",
                "version": API_VERSION,
                "timestamp": now,
            },
            status=status.HTTP_200_OK,
        )


class ReadinessView(APIView):
    """
    Readiness probe.

    Vérifie que le service est prêt à recevoir du trafic:
    - Connexion DB fonctionnelle

    Utilisé par Kubernetes/Docker pour les health checks.
    Rate limit: illimité.
    """

    authentication_classes: list[Any] = []
    permission_classes: list[Any] = []

    def get(self, request, *args, **kwargs) -> Response:
        """
        GET /api/v1/health/ready/

        Vérifie la connectivité DB et retourne le statut.
        """
        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        # Vérification DB
        db_ok = self._check_database()
        cache_ok = True
        if getattr(settings, "PX_HEALTH_CHECK_CACHE", False):
            cache_ok = self._check_cache()

        if db_ok and cache_ok:
            return Response(
                {
                    "status": "healthy",
                    "version": API_VERSION,
                    "timestamp": now,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "status": "unhealthy",
                    "version": API_VERSION,
                    "timestamp": now,
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    def _check_database(self) -> bool:
        """
        Vérifie la connexion à la base de données.

        Returns:
            True si la DB répond, False sinon
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            return True
        except Exception:
            # Log sans détails (anti-probing)
            return False

    def _check_cache(self) -> bool:
        """
        Vérifie la connectivité cache (optionnel).
        """
        try:
            cache_key = "health_cache_check"
            cache.set(cache_key, "1", timeout=5)
            return cache.get(cache_key) == "1"
        except Exception:
            return False
