"""Modèles de données pour le formulaire de contact."""
from django.db import models


class Prospect(models.Model):
    """Personne ayant pris contact au moins une fois."""

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    organisation = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:  # pragma: no cover - représentation simple
        return f"{self.name} <{self.email}>"


class ContactMessage(models.Model):
    """Message reçu via le formulaire."""

    prospect = models.ForeignKey(Prospect, related_name="messages", on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:  # pragma: no cover - représentation simple
        return f"Message de {self.prospect.email} ({self.created_at:%Y-%m-%d})"
