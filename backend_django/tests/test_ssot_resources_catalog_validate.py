import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from tools import ssot_resources_catalog_validate as validator  # noqa: E402


def _load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def test_catalog_valid():
    catalog_path = (
        ROOT / "docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_CATALOG_V1.json"
    )
    schema_path = ROOT / "docs/30-tech_specs/backend/resources_catalog.schema.json"
    data = _load_json(catalog_path)
    schema = _load_json(schema_path)

    errors = validator.validate_catalog(data, schema, str(catalog_path))

    assert errors == []


def test_catalog_rejects_path_traversal():
    catalog_path = (
        ROOT / "docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_CATALOG_V1.json"
    )
    schema_path = ROOT / "docs/30-tech_specs/backend/resources_catalog.schema.json"
    data = _load_json(catalog_path)
    schema = _load_json(schema_path)

    data["resources"][0]["slug"] = "../evil"

    errors = validator.validate_catalog(data, schema, str(catalog_path))

    assert any("path traversal" in err for err in errors)
