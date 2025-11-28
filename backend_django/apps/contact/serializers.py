"""Serializers pour le formulaire de contact."""
from rest_framework import serializers

from .models import ContactMessage, Prospect


class ContactMessageSerializer(serializers.Serializer):
    """Valide et structure les données reçues via le formulaire."""

    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    organisation = serializers.CharField(max_length=255, allow_blank=True, required=False)
    message = serializers.CharField()
    honeypot = serializers.CharField(required=False, allow_blank=True)

    def validate_honeypot(self, value: str) -> str:
        """Détecte un remplissage automatisé via le champ caché."""
        if value:
            raise serializers.ValidationError("Requête ignorée.")
        return value

    def create(self, validated_data: dict) -> ContactMessage:
        """Crée ou met à jour le prospect puis journalise le message."""
        validated_data.pop("honeypot", None)
        prospect, _ = Prospect.objects.get_or_create(
            email=validated_data["email"],
            defaults={
                "name": validated_data["name"],
                "organisation": validated_data.get("organisation", ""),
            },
        )
        # Met à jour les métadonnées si le prospect existait déjà
        prospect.name = validated_data["name"]
        prospect.organisation = validated_data.get("organisation", "")
        prospect.save(update_fields=["name", "organisation"])

        return ContactMessage.objects.create(
            prospect=prospect,
            message=validated_data["message"],
        )
