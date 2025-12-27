"""
Serializers pour le formulaire de contact.

Implémente la spec API_SPEC_V1.md:
- Champ subject avec allowlist enum
- Sanitization NFKC + zero-width strip
- Validation stricte des longueurs
- Messages d'erreur génériques (anti-probing)
"""
from __future__ import annotations

from rest_framework import serializers

from apps.core.sanitizers import sanitize_email, sanitize_string, validate_in_allowlist

from .models import ContactMessage, Prospect

# Subjects autorisés (allowlist enum)
VALID_SUBJECTS = frozenset([
    "question_generale",
    "demande_accompagnement",
    "signalement_bug",
    "autre",
])


class ContactMessageSerializer(serializers.Serializer):
    """
    Valide et structure les données du formulaire de contact.

    Champs:
    - email: Email RFC 5322, max 254 chars (obligatoire)
    - subject: Enum allowlist (obligatoire)
    - message: Corps du message, 10-2000 chars (obligatoire)
    - honeypot: Champ caché anti-bot (doit être vide)
    """

    email = serializers.EmailField(max_length=254)
    subject = serializers.CharField(max_length=50)
    message = serializers.CharField(min_length=10, max_length=2000)
    honeypot = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_email(self, value: str) -> str:
        """Sanitize et valide l'email."""
        return sanitize_email(value)

    def validate_subject(self, value: str) -> str:
        """Valide que le subject est dans l'allowlist."""
        sanitized = sanitize_string(value, max_length=50)
        if not validate_in_allowlist(sanitized, VALID_SUBJECTS):
            # Message générique (anti-probing)
            raise serializers.ValidationError("Valeur invalide")
        return sanitized

    def validate_message(self, value: str) -> str:
        """Sanitize le message."""
        sanitized = sanitize_string(value, max_length=2000)
        if len(sanitized) < 10:
            raise serializers.ValidationError("Valeur invalide")
        return sanitized

    def validate_honeypot(self, value: str) -> str:
        """
        Vérifie que le honeypot est vide.

        Note: La gestion du honeypot rempli est faite dans la vue
        pour retourner un faux succès (silent drop).
        """
        return value.strip() if value else ""

    def create(self, validated_data: dict) -> ContactMessage:
        """
        Crée ou met à jour le prospect puis enregistre le message.

        Note: Le champ honeypot est géré dans la vue avant d'appeler create().
        """
        email = validated_data["email"]
        subject = validated_data["subject"]
        message = validated_data["message"]

        # Créer ou récupérer le prospect
        prospect, created = Prospect.objects.get_or_create(
            email=email,
            defaults={"name": "", "organisation": ""},
        )

        # Créer le message de contact
        return ContactMessage.objects.create(
            prospect=prospect,
            message=f"[{subject}] {message}",
        )
