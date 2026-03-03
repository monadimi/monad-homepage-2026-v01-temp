#!/usr/bin/env python3
"""텍스트 번들 레지스트리/파일 검증 스크립트입니다."""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
REGISTRY_PATH = REPO_ROOT / "src/content/text/text-bundles.json"


def load_json(path: Path):
    with path.open(encoding="utf-8") as file:
        return json.load(file)


def fail(message: str) -> None:
    print(f"[validate:texts] 오류: {message}")
    sys.exit(1)


def main() -> None:
    if not REGISTRY_PATH.exists():
        fail(f"레지스트리 파일이 없습니다: {REGISTRY_PATH}")

    registry = load_json(REGISTRY_PATH)
    if not isinstance(registry, dict):
        fail("text-bundles.json 루트는 객체여야 합니다.")

    bundles = registry.get("bundles")
    if not isinstance(bundles, list) or len(bundles) == 0:
        fail("text-bundles.json의 bundles는 1개 이상 배열이어야 합니다.")

    seen_bundle_ids: set[str] = set()
    total_entries = 0

    for bundle_meta in bundles:
        if not isinstance(bundle_meta, dict):
            fail("bundles 항목은 객체여야 합니다.")

        bundle_id = str(bundle_meta.get("id", "")).strip()
        bundle_file = str(bundle_meta.get("file", "")).strip()
        bundle_locale = str(bundle_meta.get("locale", "")).strip()

        if not bundle_id:
            fail("bundle.id는 필수입니다.")
        if bundle_id in seen_bundle_ids:
            fail(f"중복 bundle.id: {bundle_id}")
        seen_bundle_ids.add(bundle_id)

        if not bundle_file:
            fail(f"{bundle_id}: bundle.file은 필수입니다.")
        if not bundle_locale:
            fail(f"{bundle_id}: bundle.locale은 필수입니다.")

        bundle_path = (REPO_ROOT / bundle_file).resolve()
        if not bundle_path.exists():
            fail(f"{bundle_id}: 번들 파일이 없습니다: {bundle_file}")

        bundle_payload = load_json(bundle_path)
        if not isinstance(bundle_payload, dict):
            fail(f"{bundle_id}: 번들 루트는 객체여야 합니다.")

        payload_id = str(bundle_payload.get("id", "")).strip()
        if payload_id != bundle_id:
            fail(f"{bundle_id}: 번들 파일 id({payload_id})가 레지스트리 id와 다릅니다.")

        entries = bundle_payload.get("entries")
        if not isinstance(entries, list):
            fail(f"{bundle_id}: entries는 배열이어야 합니다.")

        seen_entry_ids: set[str] = set()
        for index, entry in enumerate(entries):
            if not isinstance(entry, dict):
                fail(f"{bundle_id}: entries[{index}]는 객체여야 합니다.")

            entry_id = str(entry.get("id", "")).strip()
            if not entry_id:
                fail(f"{bundle_id}: entries[{index}].id는 필수입니다.")
            if entry_id in seen_entry_ids:
                fail(f"{bundle_id}: 중복 엔트리 키 id={entry_id}")
            seen_entry_ids.add(entry_id)

            value = entry.get("value")
            if not isinstance(value, str):
                fail(f"{bundle_id}: entries[{index}].value는 문자열이어야 합니다.")

        total_entries += len(entries)

    print(
        f"[validate:texts] OK · bundles={len(bundles)} · entries={total_entries} · registry={REGISTRY_PATH.relative_to(REPO_ROOT)}"
    )


if __name__ == "__main__":
    main()
