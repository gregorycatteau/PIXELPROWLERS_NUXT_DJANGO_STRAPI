#!/usr/bin/env python3
"""SSOT validator for PX_V1_3 resources catalog."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ZERO_WIDTH_RE = re.compile(r"[\u200B-\u200D\u2060\uFEFF]")
URL_SCHEME_RE = re.compile(r"[a-zA-Z][a-zA-Z0-9+.-]*://")
PATH_TRAVERSAL_RE = re.compile(r"\.\.")

DEFAULT_CATALOG_PATH = Path(
    "docs/20-product_specs/ux_content/PX_V1_3_RESOURCES_CATALOG_V1.json"
)
DEFAULT_SCHEMA_PATH = Path("docs/30-tech_specs/backend/resources_catalog.schema.json")


def load_json(path: Path) -> Tuple[Dict[str, Any] | List[Any] | None, str | None]:
    try:
        content = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return None, f"File not found: {path}"
    except OSError as exc:
        return None, f"Failed to read {path}: {exc}"

    try:
        return json.loads(content), None
    except json.JSONDecodeError as exc:
        return None, f"Invalid JSON in {path}: {exc}"


def is_safe_string(value: str) -> List[str]:
    issues: List[str] = []
    if "\x00" in value:
        issues.append("contains null byte")
    if ZERO_WIDTH_RE.search(value):
        issues.append("contains zero-width character")
    if "\\" in value:
        issues.append("contains backslash")
    if PATH_TRAVERSAL_RE.search(value):
        issues.append("contains path traversal '..'")
    if value.startswith("/") or value.startswith("//"):
        issues.append("contains absolute path")
    if URL_SCHEME_RE.search(value):
        issues.append("contains absolute URL")
    return issues


def _schema_field(schema: Dict[str, Any], path: List[str]) -> Dict[str, Any]:
    cursor: Dict[str, Any] = schema
    for key in path:
        cursor = cursor.get(key, {})
    return cursor


def validate_catalog(data: Any, schema: Dict[str, Any], source_path: str) -> List[str]:
    errors: List[str] = []

    def add_error(path: str, message: str) -> None:
        errors.append(f"{source_path}:{path}: {message}")

    if not isinstance(data, dict):
        add_error("$", "root must be an object")
        return errors

    required_top = set(schema.get("required", []))
    for key in required_top:
        if key not in data:
            add_error(f"$.{key}", "missing required field")

    if set(data.keys()) - set(schema.get("properties", {}).keys()):
        add_error("$", "unknown top-level field(s)")

    version_schema = _schema_field(schema, ["properties", "version"])
    version = data.get("version")
    if not isinstance(version, str):
        add_error("$.version", "must be a string")
    else:
        pattern = version_schema.get("pattern")
        if pattern and not re.match(pattern, version):
            add_error("$.version", "must match semantic version pattern")
        max_len = version_schema.get("maxLength")
        if max_len and len(version) > max_len:
            add_error("$.version", f"length must be <= {max_len}")
        for issue in is_safe_string(version):
            add_error("$.version", issue)

    resources = data.get("resources")
    if not isinstance(resources, list):
        add_error("$.resources", "must be an array")
        return errors

    if not resources:
        add_error("$.resources", "must contain at least one resource")

    resource_schema = _schema_field(schema, ["properties", "resources", "items"])
    resource_props = resource_schema.get("properties", {})
    resource_required = set(resource_schema.get("required", []))

    for idx, resource in enumerate(resources):
        path_prefix = f"$.resources[{idx}]"
        if not isinstance(resource, dict):
            add_error(path_prefix, "resource must be an object")
            continue

        missing = resource_required - set(resource.keys())
        for key in sorted(missing):
            add_error(f"{path_prefix}.{key}", "missing required field")

        extras = set(resource.keys()) - set(resource_props.keys())
        if extras:
            add_error(path_prefix, f"unknown field(s): {', '.join(sorted(extras))}")

        for field, field_schema in resource_props.items():
            if field not in resource:
                continue
            value = resource[field]

            if field_schema.get("type") == "string":
                if not isinstance(value, str):
                    add_error(f"{path_prefix}.{field}", "must be a string")
                    continue
                min_len = field_schema.get("minLength")
                max_len = field_schema.get("maxLength")
                if min_len and len(value) < min_len:
                    add_error(
                        f"{path_prefix}.{field}", f"length must be >= {min_len}"
                    )
                if max_len and len(value) > max_len:
                    add_error(
                        f"{path_prefix}.{field}", f"length must be <= {max_len}"
                    )
                pattern = field_schema.get("pattern")
                if pattern and not re.match(pattern, value):
                    add_error(f"{path_prefix}.{field}", "invalid format")
                enum = field_schema.get("enum")
                if enum and value not in enum:
                    add_error(
                        f"{path_prefix}.{field}",
                        f"must be one of: {', '.join(enum)}",
                    )
                for issue in is_safe_string(value):
                    add_error(f"{path_prefix}.{field}", issue)

            elif field_schema.get("type") == "array":
                if not isinstance(value, list):
                    add_error(f"{path_prefix}.{field}", "must be an array")
                    continue
                min_items = field_schema.get("minItems")
                max_items = field_schema.get("maxItems")
                if min_items and len(value) < min_items:
                    add_error(
                        f"{path_prefix}.{field}", f"must contain >= {min_items} items"
                    )
                if max_items and len(value) > max_items:
                    add_error(
                        f"{path_prefix}.{field}", f"must contain <= {max_items} items"
                    )
                if field_schema.get("uniqueItems") and len(value) != len(set(value)):
                    add_error(f"{path_prefix}.{field}", "items must be unique")

                item_schema = field_schema.get("items", {})
                for item_idx, item in enumerate(value):
                    item_path = f"{path_prefix}.{field}[{item_idx}]"
                    if item_schema.get("type") == "string":
                        if not isinstance(item, str):
                            add_error(item_path, "must be a string")
                            continue
                        max_len = item_schema.get("maxLength")
                        if max_len and len(item) > max_len:
                            add_error(item_path, f"length must be <= {max_len}")
                        pattern = item_schema.get("pattern")
                        if pattern and not re.match(pattern, item):
                            add_error(item_path, "invalid format")
                        for issue in is_safe_string(item):
                            add_error(item_path, issue)
                    else:
                        add_error(item_path, "unsupported item schema")
            else:
                add_error(f"{path_prefix}.{field}", "unsupported schema type")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate PX_V1_3 resources catalog SSOT data."
    )
    parser.add_argument(
        "--catalog",
        type=Path,
        default=DEFAULT_CATALOG_PATH,
        help="Path to resources catalog JSON",
    )
    parser.add_argument(
        "--schema",
        type=Path,
        default=DEFAULT_SCHEMA_PATH,
        help="Path to JSON schema",
    )
    args = parser.parse_args()

    schema, schema_err = load_json(args.schema)
    if schema_err:
        print(schema_err, file=sys.stderr)
        return 1

    if not isinstance(schema, dict):
        print(f"Invalid schema object in {args.schema}", file=sys.stderr)
        return 1

    data, data_err = load_json(args.catalog)
    if data_err:
        print(data_err, file=sys.stderr)
        return 1

    errors = validate_catalog(data, schema, str(args.catalog))
    if errors:
        for err in errors:
            print(f"ERROR: {err}", file=sys.stderr)
        print(f"\nValidation failed: {len(errors)} error(s).", file=sys.stderr)
        return 1

    print("Resources catalog validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
