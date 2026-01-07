"""
Purge contact data older than retention window.

Dry-run by default; use --apply to delete.
"""
from __future__ import annotations

from datetime import timedelta

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.contact.models import ContactMessage


class Command(BaseCommand):
    help = "Purge contact data older than the retention window (dry-run by default)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Apply deletions (default is dry-run).",
        )
        parser.add_argument(
            "--batch-size",
            type=int,
            default=1000,
            help="Batch size for deletions.",
        )

    def handle(self, *args, **options):
        apply = options["apply"]
        batch_size = options["batch_size"]

        retention_days = int(getattr(settings, "CONTACT_RETENTION_DAYS", 180))
        cutoff = timezone.now() - timedelta(days=retention_days)

        messages_qs = ContactMessage.objects.filter(created_at__lt=cutoff)
        messages_count = messages_qs.count()

        if not apply:
            self.stdout.write(
                f"[dry-run] contact_messages_to_delete={messages_count} cutoff={cutoff.date()}"
            )
            return

        deleted_messages = 0
        while True:
            ids = list(messages_qs.values_list("id", flat=True)[:batch_size])
            if not ids:
                break
            ContactMessage.objects.filter(id__in=ids).delete()
            deleted_messages += len(ids)

        self.stdout.write(
            f"contact_messages_deleted={deleted_messages} cutoff={cutoff.date()}"
        )
