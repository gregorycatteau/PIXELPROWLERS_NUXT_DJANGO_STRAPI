import datetime

import pytest
from django.core.management import call_command
from django.utils import timezone

from apps.contact.models import ContactMessage


def _set_created_at(obj, value):
    obj.__class__.objects.filter(id=obj.id).update(created_at=value)


@pytest.mark.django_db
def test_purge_contacts_dry_run_keeps_data():
    now = timezone.now()
    old = now - datetime.timedelta(days=200)

    message = ContactMessage.objects.create(
        first_name="Test",
        last_name="User",
        email="a@example.com",
        message="old",
        consent=True,
        consented_at=now,
    )
    _set_created_at(message, old)

    call_command("purge_contacts")

    assert ContactMessage.objects.count() == 1


@pytest.mark.django_db
def test_purge_contacts_apply_deletes_old():
    now = timezone.now()
    old = now - datetime.timedelta(days=200)
    recent = now - datetime.timedelta(days=10)

    old_message = ContactMessage.objects.create(
        first_name="Old",
        last_name="User",
        email="old@example.com",
        message="old",
        consent=True,
        consented_at=now,
    )
    _set_created_at(old_message, old)

    new_message = ContactMessage.objects.create(
        first_name="New",
        last_name="User",
        email="new@example.com",
        message="new",
        consent=True,
        consented_at=now,
    )
    _set_created_at(new_message, recent)

    call_command("purge_contacts", apply=True)

    assert ContactMessage.objects.count() == 1
    assert ContactMessage.objects.first().message == "new"
