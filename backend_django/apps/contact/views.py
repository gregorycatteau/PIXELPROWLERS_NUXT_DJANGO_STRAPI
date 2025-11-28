"""Vues API pour le formulaire de contact."""
import logging
from typing import Any, Dict

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)


class ContactMessageView(APIView):
    """Réception des messages du formulaire de contact."""

    authentication_classes: list[Any] = []
    permission_classes: list[Any] = []

    def post(self, request, *args, **kwargs) -> Response:
        """Valide les données, crée les objets et retourne un statut JSON."""
        serializer = ContactMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"status": "error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        message = serializer.save()
        logger.info("Contact créé : %s à %s", message.prospect.email, message.created_at.isoformat())
        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)
