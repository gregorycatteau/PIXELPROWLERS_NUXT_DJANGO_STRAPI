import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_health_ok():
    client = APIClient()
    response = client.get("/api/v1/health/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_contact_invalid_payload_returns_neutral_error():
    client = APIClient()
    response = client.post("/api/v1/contact/", data={}, format="json")
    assert response.status_code == 400
    assert response.json() == {"error": "Données invalides"}


@pytest.mark.django_db
def test_contact_honeypot_silent_success():
    client = APIClient()
    payload = {
        "email": "user@example.com",
        "subject": "question_generale",
        "message": "Bonjour, ceci est un message valide.",
        "honeypot": "bot",
    }
    response = client.post("/api/v1/contact/", data=payload, format="json")
    assert response.status_code == 201
    assert response.json().get("success") is True
    assert "email" not in response.content.decode("utf-8").lower()


@pytest.mark.django_db
def test_resources_stub_ok():
    client = APIClient()
    response = client.get("/api/v1/resources/")
    assert response.status_code == 200
