"""
Purge contact data older than retention window.

Dry-run by default; use --apply to delete.
"""
from __future__ import annotations

import calendar
from datetime import datetime

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.contact.models import ContactMessage, Prospect


def _subtract_months(value: datetime, months: int) -> datetime:
    month_index = (value.month - 1) - months
    year = value.year + (month_index // 12)
    month = (month_index % 12) + 1
    day = min(value.day, calendar.monthrange(year, month)[1])
    return value.replace(year=year, month=month, day=day)


class Command(BaseCommand):
    help = "Purge contact data older than 6 months (dry-run by default)."

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

        cutoff = _subtract_months(timezone.now(), 6)

        messages_qs = ContactMessage.objects.filter(created_at__lt=cutoff)
        messages_count = messages_qs.count()

        if not apply:
            self.stdout.write(
                f"[dry-run] contact_messages_to_delete={messages_count} cutoff={cutoff.date()}"
            )
            prospects_count = Prospect.objects.filter(
                created_at__lt=cutoff, messages__isnull=True
            ).count()
            self.stdout.write(
                f"[dry-run] prospects_to_delete={prospects_count} cutoff={cutoff.date()}"
            )
            return

        deleted_messages = 0
        while True:
            ids = list(messages_qs.values_list("id", flat=True)[:batch_size])
            if not ids:
                break
            ContactMessage.objects.filter(id__in=ids).delete()
            deleted_messages += len(ids)

        prospects_qs = Prospect.objects.filter(created_at__lt=cutoff, messages__isnull=True)
        prospects_count = prospects_qs.count()
        deleted_prospects = 0
        while True:
            ids = list(prospects_qs.values_list("id", flat=True)[:batch_size])
            if not ids:
                break
            Prospect.objects.filter(id__in=ids).delete()
            deleted_prospects += len(ids)

        self.stdout.write(
            f"contact_messages_deleted={deleted_messages} cutoff={cutoff.date()}"
        )
        self.stdout.write(
            f"prospects_deleted={deleted_prospects} cutoff={cutoff.date()}"
        )
