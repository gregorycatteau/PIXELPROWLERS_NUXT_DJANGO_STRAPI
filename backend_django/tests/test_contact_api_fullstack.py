import pytest
from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APIClient

from apps.contact.models import ContactMessage


def _valid_payload(**overrides):
    payload = {
        "firstName": "Alex",
        "lastName": "Doe",
        "email": "alex@example.com",
        "message": "Bonjour, ceci est un message valide.",
        "consent": True,
        "clientTimeOnPageSeconds": 5,
        "honeypot": "",
    }
    payload.update(overrides)
    return payload


@pytest.mark.django_db
@override_settings(PX_CONTACT_MIN_SECONDS=3)
def test_contact_success_sends_emails_and_saves():
    client = APIClient()
    response = client.post("/api/v1/contact/", data=_valid_payload(), format="json")
    assert response.status_code == 200
    body = response.json()
    assert body.get("status") == "ok"
    assert body.get("ticketId")
    assert ContactMessage.objects.count() == 1
    assert len(mail.outbox) == 2


@pytest.mark.django_db
def test_contact_payload_too_long_returns_400():
    client = APIClient()
    response = client.post(
        "/api/v1/contact/",
        data=_valid_payload(message="a" * 50000),
        format="json",
    )
    assert response.status_code == 400
    body = response.json()
    assert body.get("status") == "error"
    assert "message" in body.get("errors", {})


@pytest.mark.django_db
def test_contact_email_crlf_injection_rejected():
    client = APIClient()
    response = client.post(
        "/api/v1/contact/",
        data=_valid_payload(email="evil@example.com\r\nBcc: attacker@example.com"),
        format="json",
    )
    assert response.status_code == 400
    body = response.json()
    assert body.get("status") == "error"
    assert "email" in body.get("errors", {})


@pytest.mark.django_db
def test_contact_honeypot_silent_drop_no_email_no_insert():
    client = APIClient()
    response = client.post(
        "/api/v1/contact/",
        data=_valid_payload(honeypot="bot-field"),
        format="json",
    )
    assert response.status_code == 200
    body = response.json()
    assert body.get("status") == "ok"
    assert body.get("ticketId") is None
    assert ContactMessage.objects.count() == 0
    assert len(mail.outbox) == 0


@pytest.mark.django_db
@override_settings(
    PX_CONTACT_RATE_LIMITS={"minute": {"limit": 1, "window": 60}, "hour": {"limit": 1, "window": 3600}}
)
def test_contact_rate_limit_neutral_response():
    cache.clear()
    client = APIClient()
    response_ok = client.post("/api/v1/contact/", data=_valid_payload(), format="json")
    assert response_ok.status_code == 200
    response_blocked = client.post("/api/v1/contact/", data=_valid_payload(), format="json")
    assert response_blocked.status_code == 200
    body = response_blocked.json()
    assert body.get("status") == "error"
    assert body.get("message") == "Reessaie plus tard."
    assert ContactMessage.objects.count() == 1
    assert len(mail.outbox) == 2


@pytest.mark.django_db
def test_contact_strips_zero_width_and_control_chars():
    client = APIClient()
    response = client.post(
        "/api/v1/contact/",
        data=_valid_payload(message="Salut\u200b\u0007 monde"),
        format="json",
    )
    assert response.status_code == 200
    message = ContactMessage.objects.first().message
    assert "\u200b" not in message
    assert "\u0007" not in message
