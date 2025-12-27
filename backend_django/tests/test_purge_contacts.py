import datetime

import pytest
from django.core.management import call_command
from django.utils import timezone

from apps.contact.models import ContactMessage, Prospect


def _set_created_at(obj, value):
    obj.__class__.objects.filter(id=obj.id).update(created_at=value)


@pytest.mark.django_db
def test_purge_contacts_dry_run_keeps_data():
    now = timezone.now()
    old = now - datetime.timedelta(days=200)

    prospect = Prospect.objects.create(name="Test", email="a@example.com", organisation="")
    message = ContactMessage.objects.create(prospect=prospect, message="old")
    _set_created_at(prospect, old)
    _set_created_at(message, old)

    call_command("purge_contacts")

    assert Prospect.objects.count() == 1
    assert ContactMessage.objects.count() == 1


@pytest.mark.django_db
def test_purge_contacts_apply_deletes_old():
    now = timezone.now()
    old = now - datetime.timedelta(days=200)
    recent = now - datetime.timedelta(days=10)

    old_prospect = Prospect.objects.create(name="Old", email="old@example.com", organisation="")
    old_message = ContactMessage.objects.create(prospect=old_prospect, message="old")
    _set_created_at(old_prospect, old)
    _set_created_at(old_message, old)

    new_prospect = Prospect.objects.create(name="New", email="new@example.com", organisation="")
    new_message = ContactMessage.objects.create(prospect=new_prospect, message="new")
    _set_created_at(new_prospect, recent)
    _set_created_at(new_message, recent)

    call_command("purge_contacts", apply=True)

    assert ContactMessage.objects.count() == 1
    assert Prospect.objects.count() == 1
    assert ContactMessage.objects.first().message == "new"
