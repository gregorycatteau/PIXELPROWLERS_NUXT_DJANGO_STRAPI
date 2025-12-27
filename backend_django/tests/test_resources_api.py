import pytest
from rest_framework.test import APIClient

from apps.resources.catalog import load_catalog


@pytest.mark.django_db
def test_resources_list_ok():
    client = APIClient()
    response = client.get("/api/v1/resources/")
    assert response.status_code == 200
    payload = response.json()
    assert "resources" in payload
    assert isinstance(payload["resources"], list)
    assert payload["total"] >= 1
    first = payload["resources"][0]
    assert "path" in first
    assert first["path"].startswith("/ressources/")


@pytest.mark.django_db
def test_resources_filters_ok():
    resources, _etag = load_catalog()
    sample = resources[0]
    client = APIClient()
    response = client.get(
        "/api/v1/resources/",
        data={"tags": sample.tags[0], "category": sample.category},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] >= 1
    for item in payload["resources"]:
        assert sample.tags[0] in item["tags"]
        assert item["category"] == sample.category


@pytest.mark.django_db
def test_resources_invalid_param_neutral():
    client = APIClient()
    response = client.get("/api/v1/resources/", data={"category": "invalid"})
    assert response.status_code == 400
    assert response.json() == {"error": "Données invalides"}
