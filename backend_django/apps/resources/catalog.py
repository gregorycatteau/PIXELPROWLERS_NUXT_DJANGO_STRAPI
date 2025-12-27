"""
SSOT-backed resources catalog loader and validation.
"""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from django.conf import settings

from apps.core.sanitizers import sanitize_string

CATALOG_PATH = (
    Path(settings.BASE_DIR).parent.parent
    / "docs"
    / "20-product_specs"
    / "ux_content"
    / "PX_V1_3_RESOURCES_CATALOG_V1.json"
)

SLUG_PATTERN = re.compile(r"^[a-z0-9-]{3,64}$")


@dataclass(frozen=True)
class CatalogResource:
    id: str
    slug: str
    title: str
    summary: str
    tags: list[str]
    category: str
    level: str
    journey: str
    type: str

    @property
    def path(self) -> str:
        return f"/ressources/{self.slug}"


def _safe_text(value: str, max_len: int) -> str:
    return sanitize_string(value, max_length=max_len)


def _load_raw() -> dict[str, Any]:
    content = CATALOG_PATH.read_text(encoding="utf-8")
    return json.loads(content)


def _etag(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def load_catalog() -> tuple[list[CatalogResource], str]:
    content = CATALOG_PATH.read_bytes()
    payload = json.loads(content.decode("utf-8"))
    resources = []

    for item in payload.get("resources", []):
        try:
            rid = _safe_text(item["id"], 64)
            slug = _safe_text(item["slug"], 64).lower()
            title = _safe_text(item["title"], 140)
            summary = _safe_text(item["summary"], 400)
            tags = [ _safe_text(tag, 24).lower() for tag in item.get("tags", []) ]
            category = _safe_text(item["category"], 32).lower()
            level = _safe_text(item["level"], 32).lower()
            journey = _safe_text(item["journey"], 16).lower()
            rtype = _safe_text(item["type"], 32).lower()

            if not rid or not slug or not SLUG_PATTERN.match(slug):
                continue
            if not title or not summary:
                continue
            if not tags or any(not tag for tag in tags):
                continue

            resources.append(
                CatalogResource(
                    id=rid,
                    slug=slug,
                    title=title,
                    summary=summary,
                    tags=tags,
                    category=category,
                    level=level,
                    journey=journey,
                    type=rtype,
                )
            )
        except Exception:
            continue

    return resources, _etag(content)


def build_allowlists(resources: list[CatalogResource]) -> dict[str, set[str]]:
    return {
        "tags": {tag for resource in resources for tag in resource.tags},
        "category": {resource.category for resource in resources},
        "level": {resource.level for resource in resources},
        "journey": {resource.journey for resource in resources},
        "type": {resource.type for resource in resources},
    }
