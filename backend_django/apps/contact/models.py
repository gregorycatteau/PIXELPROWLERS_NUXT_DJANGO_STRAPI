"""Modèles de données pour le formulaire de contact."""
from __future__ import annotations

import uuid

from django.db import models


class ContactMessage(models.Model):
    """Message reçu via le formulaire de contact (full-stack)."""

    STATUS_NEW = "new"
    STATUS_SEEN = "seen"
    STATUS_REPLIED = "replied"
    STATUS_SPAM = "spam"

    STATUS_CHOICES = [
        (STATUS_NEW, "Nouveau"),
        (STATUS_SEEN, "Vu"),
        (STATUS_REPLIED, "Répondu"),
        (STATUS_SPAM, "Spam"),
    ]

    ticket_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    first_name = models.CharField(max_length=80, blank=True)
    last_name = models.CharField(max_length=80, blank=True)
    email = models.EmailField(max_length=120)
    message = models.TextField()
    consent = models.BooleanField(default=False)
    consented_at = models.DateTimeField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_NEW)
    ip_prefix = models.CharField(max_length=64, blank=True)
    ip_hash = models.CharField(max_length=64, blank=True)
    user_agent_hash = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:  # pragma: no cover - représentation simple
        return f"Contact {self.ticket_id} ({self.created_at:%Y-%m-%d})"
