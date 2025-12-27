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

from apps.core.sanitizers import sanitize_string

from .catalog import build_allowlists, load_catalog

MAX_Q_LEN = 120
MAX_TAGS = 5
MAX_LIMIT = 50
MAX_OFFSET = 1000

MSG_VALIDATION_ERROR = "Données invalides"

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

        Retourne la liste des ressources.
        """
        resources, etag = load_catalog()
        if_none_match = request.META.get("HTTP_IF_NONE_MATCH")
        if if_none_match and if_none_match == etag:
            return Response(status=status.HTTP_304_NOT_MODIFIED, headers={"ETag": etag})

        allowlists = build_allowlists(resources)

        q = self._get_text_param(request, "q", MAX_Q_LEN)
        tags = self._get_tags_param(request)
        category = self._get_allowlist_param(request, "category", allowlists["category"])
        level = self._get_allowlist_param(request, "level", allowlists["level"])
        journey = self._get_allowlist_param(request, "journey", allowlists["journey"])
        rtype = self._get_allowlist_param(request, "type", allowlists["type"])
        limit = self._get_int_param(request, "limit", default=20, min_value=1, max_value=MAX_LIMIT)
        offset = self._get_int_param(request, "offset", default=0, min_value=0, max_value=MAX_OFFSET)

        if any(value is None for value in [q, tags, category, level, journey, rtype, limit, offset]):
            return Response({"error": MSG_VALIDATION_ERROR}, status=status.HTTP_400_BAD_REQUEST)
        if tags and not all(tag in allowlists["tags"] for tag in tags):
            return Response({"error": MSG_VALIDATION_ERROR}, status=status.HTTP_400_BAD_REQUEST)

        filtered = self._apply_filters(resources, q, tags, category, level, journey, rtype)
        total = len(filtered)
        paged = filtered[offset : offset + limit]

        payload = {
            "resources": [self._serialize(resource) for resource in paged],
            "total": total,
            "limit": limit,
            "offset": offset,
        }
        return Response(payload, status=status.HTTP_200_OK, headers={"ETag": etag})

    @staticmethod
    def _serialize(resource) -> dict[str, Any]:
        return {
            "id": resource.id,
            "slug": resource.slug,
            "title": resource.title,
            "summary": resource.summary,
            "tags": resource.tags,
            "category": resource.category,
            "level": resource.level,
            "journey": resource.journey,
            "type": resource.type,
            "path": resource.path,
        }

    @staticmethod
    def _get_text_param(request, name: str, max_len: int) -> str:
        value = request.query_params.get(name, "")
        if value == "":
            return ""
        sanitized = sanitize_string(value, max_length=max_len)
        if not sanitized:
            return ""
        if len(sanitized) > max_len:
            return None
        return sanitized

    @staticmethod
    def _get_tags_param(request) -> list[str]:
        raw = request.query_params.get("tags", "")
        if raw == "":
            return []
        parts = [sanitize_string(part, max_length=24).lower() for part in raw.split(",")]
        parts = [part for part in parts if part]
        if len(parts) > MAX_TAGS:
            return None
        return parts

    @staticmethod
    def _get_allowlist_param(request, name: str, allowlist: set[str]) -> str:
        value = request.query_params.get(name, "")
        if value == "":
            return ""
        sanitized = sanitize_string(value, max_length=32).lower()
        if sanitized not in allowlist:
            return None
        return sanitized

    @staticmethod
    def _get_int_param(request, name: str, default: int, min_value: int, max_value: int) -> int:
        raw = request.query_params.get(name)
        if raw is None or raw == "":
            return default
        try:
            value = int(raw)
        except ValueError:
            return None
        if value < min_value:
            return None
        if value > max_value:
            return max_value
        return value

    @staticmethod
    def _apply_filters(resources, q, tags, category, level, journey, rtype):
        filtered = resources
        if q:
            lowered = q.lower()
            filtered = [
                resource
                for resource in filtered
                if lowered in resource.title.lower() or lowered in resource.summary.lower()
            ]
        if tags:
            filtered = [
                resource for resource in filtered if any(tag in resource.tags for tag in tags)
            ]
        if category:
            filtered = [resource for resource in filtered if resource.category == category]
        if level:
            filtered = [resource for resource in filtered if resource.level == level]
        if journey:
            filtered = [resource for resource in filtered if resource.journey == journey]
        if rtype:
            filtered = [resource for resource in filtered if resource.type == rtype]
        return filtered
