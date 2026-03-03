#!/usr/bin/env python3
"""
로컬 전용 JSON 관리 GUI 서버입니다.

- 라이트 모드 사이드바 UI에서 데이터 탭을 선택합니다.
- 표(Table)로 현재 데이터를 확인합니다.
- 새 데이터 추가/수정/삭제를 GUI에서 수행하면 Python이 JSON 파일에 반영합니다.
- UI 텍스트 번들은 레지스트리(text-bundles.json) 기준으로 탭이 자동 생성됩니다.
- 실행 시 원격 동기화 상태를 확인해 pull이 필요한 상태면 실행을 차단합니다.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from copy import deepcopy
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

REPO_ROOT = Path(__file__).resolve().parents[2]
INDEX_HTML_PATH = Path(__file__).with_name("index.html")
TEXT_REGISTRY_PATH = REPO_ROOT / "src/content/text/text-bundles.json"


# 각 데이터 탭의 필드 스키마를 명시적으로 정의합니다.
BASE_DATASET_SPECS: dict[str, dict[str, Any]] = {
    "awards": {
        "id": "awards",
        "label": "Achievements · Awards",
        "description": "수상 카드용 데이터를 관리합니다.",
        "file": "src/features/achievements/data/awards.json",
        "mode": "root_array",
        "array_key": "awards",
        "year_order_key": "yearOrder",
        "fields": [
            {"key": "year", "label": "연도", "input": "number", "required": True, "placeholder": "2026"},
            {"key": "id", "label": "ID", "input": "text", "required": True, "placeholder": "2026-award-1"},
            {
                "key": "title",
                "label": "제목",
                "input": "text",
                "required": True,
                "placeholder": "2026 아주 대단하고 멋진 대회",
            },
            {
                "key": "subtitle",
                "label": "부제",
                "input": "text",
                "required": True,
                "placeholder": "국무총리대통령상기상",
            },
            {
                "key": "highlight",
                "label": "강조 라벨",
                "input": "text",
                "required": True,
                "placeholder": "대상",
            },
            {
                "key": "imageKey",
                "label": "이미지 키",
                "input": "text",
                "required": True,
                "placeholder": "placeholder",
            },
        ],
    },
    "members": {
        "id": "members",
        "label": "Members",
        "description": "멤버 카드/상세 프로필 데이터를 관리합니다.",
        "file": "src/features/members/data/members.json",
        "mode": "yearly_array",
        "years_key": "years",
        "year_key": "year",
        "items_key": "members",
        "year_order_key": "yearOrder",
        "year_meta_fields": ["generationLabel"],
        "fields": [
            {"key": "year", "label": "연도", "input": "number", "required": True, "placeholder": "2025"},
            {
                "key": "generationLabel",
                "label": "기수 라벨",
                "input": "text",
                "required": False,
                "placeholder": "예: 1기",
                "help": "같은 연도의 멤버 행에서 수정하면 해당 연도의 기수 라벨이 함께 반영됩니다.",
            },
            {
                "key": "id",
                "label": "ID",
                "input": "text",
                "required": True,
                "placeholder": "member-9-홍길동",
            },
            {"key": "name", "label": "이름", "input": "text", "required": True, "placeholder": "홍길동"},
            {"key": "code", "label": "코드", "input": "text", "required": True, "placeholder": "24WP"},
            {
                "key": "intro",
                "label": "소개",
                "input": "multiline",
                "required": True,
                "placeholder": "멤버 소개 문구",
            },
            {
                "key": "roles",
                "label": "역할",
                "input": "comma_list",
                "required": True,
                "placeholder": "planner, developer, designer",
                "help": "쉼표(,)로 구분해 입력합니다.",
            },
            {
                "key": "quote",
                "label": "한마디",
                "input": "multiline",
                "required": True,
                "placeholder": "자신이 하고싶은 한마디",
            },
            {
                "key": "github",
                "label": "GitHub URL",
                "input": "url",
                "required": True,
                "placeholder": "https://github.com/username",
            },
            {
                "key": "githubLabel",
                "label": "GitHub 라벨",
                "input": "text",
                "required": True,
                "placeholder": "username - Overview",
            },
            {
                "key": "imageKey",
                "label": "이미지 키",
                "input": "text",
                "required": True,
                "placeholder": "jesiwon",
            },
            {
                "key": "achievements",
                "label": "성과 목록",
                "input": "line_list",
                "required": False,
                "placeholder": "한 줄에 하나씩 입력",
                "help": "줄바꿈 기준으로 배열이 생성됩니다.",
            },
            {
                "key": "stacks",
                "label": "스택",
                "input": "stack_list",
                "required": False,
                "default": [],
                "help": "아래 UI에서 스택 행을 추가/수정해 관리합니다.",
            },
        ],
    },
    "projects": {
        "id": "projects",
        "label": "Projects",
        "description": "프로젝트 소개 카드 데이터를 관리합니다.",
        "file": "src/features/projects/data/projects.json",
        "mode": "yearly_array",
        "years_key": "years",
        "year_key": "year",
        "items_key": "projects",
        "year_order_key": "yearOrder",
        "fields": [
            {"key": "year", "label": "연도", "input": "number", "required": True, "placeholder": "2026"},
            {
                "key": "id",
                "label": "ID",
                "input": "text",
                "required": True,
                "placeholder": "2026-new-project",
            },
            {
                "key": "title",
                "label": "프로젝트명",
                "input": "text",
                "required": True,
                "placeholder": "NEW PROJECT",
            },
            {
                "key": "subtitle",
                "label": "부제",
                "input": "text",
                "required": True,
                "placeholder": "Neural Observation and ...",
            },
            {
                "key": "summary",
                "label": "요약",
                "input": "multiline",
                "required": True,
                "placeholder": "프로젝트 요약 설명",
            },
            {
                "key": "awardTag",
                "label": "수상 태그",
                "input": "text",
                "required": True,
                "placeholder": "어디어디 대회 우수상",
            },
            {
                "key": "tags",
                "label": "태그",
                "input": "comma_list",
                "required": False,
                "placeholder": "AI, NLP, Education",
                "help": "쉼표(,)로 구분해 입력합니다.",
            },
        ],
    },
}


def read_text_registry() -> dict[str, Any]:
    if not TEXT_REGISTRY_PATH.exists():
        return {"bundles": []}

    with TEXT_REGISTRY_PATH.open(encoding="utf-8") as registry_file:
        payload = json.load(registry_file)

    if not isinstance(payload, dict):
        raise RuntimeError("텍스트 레지스트리(text-bundles.json) 형식이 올바르지 않습니다.")

    return payload


def build_text_dataset_specs() -> dict[str, dict[str, Any]]:
    registry_payload = read_text_registry()
    bundles = registry_payload.get("bundles", [])
    if not isinstance(bundles, list):
        raise RuntimeError("텍스트 레지스트리 bundles는 배열이어야 합니다.")

    text_specs: dict[str, dict[str, Any]] = {}

    for bundle in bundles:
        if not isinstance(bundle, dict):
            continue

        bundle_id = str(bundle.get("id", "")).strip()
        bundle_label = str(bundle.get("label", bundle_id)).strip() or bundle_id
        bundle_locale = str(bundle.get("locale", "ko")).strip() or "ko"
        bundle_description = str(bundle.get("description", "")).strip()
        bundle_file = str(bundle.get("file", "")).strip()

        if not bundle_id or not bundle_file:
            continue

        dataset_id = f"text-{bundle_id}"
        text_specs[dataset_id] = {
            "id": dataset_id,
            "label": f"Text · {bundle_label}",
            "description": f"{bundle_description} ({bundle_locale})".strip(),
            "file": bundle_file,
            "mode": "root_array",
            "array_key": "entries",
            "fields": [
                {
                    "key": "id",
                    "label": "텍스트 키",
                    "input": "text",
                    "required": True,
                    "placeholder": "예: nav.home",
                },
                {
                    "key": "value",
                    "label": "텍스트 값",
                    "input": "multiline",
                    "required": True,
                    "placeholder": "실제 UI에 노출할 문구를 입력하세요.",
                },
                {
                    "key": "description",
                    "label": "설명",
                    "input": "text",
                    "required": False,
                    "placeholder": "해당 텍스트의 용도 메모",
                },
            ],
        }

    return text_specs


DATASET_SPECS: dict[str, dict[str, Any]] = {
    **BASE_DATASET_SPECS,
    **build_text_dataset_specs(),
}


def run_git_command(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-C", str(REPO_ROOT), *args],
        check=False,
        capture_output=True,
        text=True,
    )


def ensure_remote_fetched() -> None:
    """원격 최신 커밋 기준으로 비교하기 위해 fetch를 먼저 수행합니다."""
    fetch_result = run_git_command(["fetch", "--quiet", "origin"])
    if fetch_result.returncode != 0:
        stderr = fetch_result.stderr.strip()
        raise RuntimeError(f"원격 동기화(fetch) 실패: {stderr or '알 수 없는 오류'}")


def resolve_compare_target() -> str:
    """동기화 비교 대상을 결정합니다."""
    upstream_result = run_git_command(
        ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]
    )
    if upstream_result.returncode == 0:
        return upstream_result.stdout.strip()

    main_exists_result = run_git_command(["show-ref", "--verify", "refs/remotes/origin/main"])
    if main_exists_result.returncode == 0:
        return "origin/main"

    raise RuntimeError(
        "업스트림 브랜치를 확인할 수 없습니다. "
        "현재 브랜치 업스트림을 설정하거나 origin/main 브랜치가 존재해야 합니다."
    )


def ensure_pulled_latest() -> None:
    """현재 브랜치가 원격 기준보다 뒤쳐지면 실행을 차단합니다."""
    ensure_remote_fetched()
    compare_target = resolve_compare_target()
    compare_result = run_git_command(
        ["rev-list", "--left-right", "--count", f"HEAD...{compare_target}"]
    )
    if compare_result.returncode != 0:
        raise RuntimeError("브랜치 동기화 상태를 확인할 수 없습니다.")

    parts = compare_result.stdout.strip().split()
    if len(parts) != 2:
        raise RuntimeError("브랜치 비교 결과를 해석할 수 없습니다.")

    ahead_count, behind_count = (int(parts[0]), int(parts[1]))
    if behind_count > 0:
        raise RuntimeError(
            f"현재 브랜치가 비교 대상({compare_target})보다 {behind_count}커밋 뒤쳐져 있습니다. "
            "git pull 후 다시 실행해주세요."
        )

    if ahead_count > 0:
        print(
            f"[안내] 현재 브랜치가 비교 대상({compare_target})보다 "
            f"{ahead_count}커밋 앞서 있습니다."
        )


# ---- 데이터셋 핸들링 유틸 ----

def read_dataset_file(spec: dict[str, Any]) -> dict[str, Any]:
    file_path = (REPO_ROOT / spec["file"]).resolve()
    return json.loads(file_path.read_text(encoding="utf-8"))


def write_dataset_file(spec: dict[str, Any], data: dict[str, Any]) -> None:
    file_path = (REPO_ROOT / spec["file"]).resolve()
    file_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def count_rows(spec: dict[str, Any], data: dict[str, Any]) -> int:
    if spec["mode"] == "root_array":
        rows = data.get(spec["array_key"], [])
        return len(rows) if isinstance(rows, list) else 0

    years = data.get(spec["years_key"], [])
    if not isinstance(years, list):
        return 0

    count = 0
    for year_block in years:
        if not isinstance(year_block, dict):
            continue
        items = year_block.get(spec["items_key"], [])
        if isinstance(items, list):
            count += len(items)
    return count


def get_rows(spec: dict[str, Any], data: dict[str, Any]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []

    if spec["mode"] == "root_array":
        for item in data.get(spec["array_key"], []):
            if isinstance(item, dict):
                rows.append(deepcopy(item))
        return rows

    years = data.get(spec["years_key"], [])
    if not isinstance(years, list):
        return rows

    for year_block in years:
        if not isinstance(year_block, dict):
            continue
        year_value = year_block.get(spec["year_key"])
        year_meta_fields = spec.get("year_meta_fields", [])
        items = year_block.get(spec["items_key"], [])
        if not isinstance(items, list):
            continue

        for item in items:
            if not isinstance(item, dict):
                continue
            row = {"year": year_value}
            if isinstance(year_meta_fields, list):
                for meta_key in year_meta_fields:
                    if isinstance(meta_key, str) and meta_key in year_block:
                        row[meta_key] = deepcopy(year_block[meta_key])
            row.update(deepcopy(item))
            rows.append(row)

    return rows


def update_year_order(data: dict[str, Any], year_order_key: str, year: int) -> None:
    year_order = data.get(year_order_key)
    if not isinstance(year_order, list):
        data[year_order_key] = [year]
        return

    if year in year_order:
        return

    original = list(year_order)
    year_order.append(year)

    # 기존 정렬 방향(오름/내림)을 가능한 유지합니다.
    if len(original) >= 2:
        descending = original[0] > original[1]
        year_order.sort(reverse=descending)


def create_year_block(spec: dict[str, Any], data: dict[str, Any], year: int) -> dict[str, Any]:
    def infer_members_generation_label() -> str:
        years = data.get(spec["years_key"], [])
        if not isinstance(years, list):
            return "미정"

        candidates: list[tuple[int, int]] = []
        for year_block in years:
            if not isinstance(year_block, dict):
                continue

            year_value = year_block.get(spec["year_key"])
            generation_label = year_block.get("generationLabel")
            if not isinstance(year_value, int) or not isinstance(generation_label, str):
                continue

            match = re.fullmatch(r"\s*(\d+)\s*기\s*", generation_label)
            if not match:
                continue

            candidates.append((year_value, int(match.group(1))))

        if not candidates:
            return "미정"

        candidates.sort(key=lambda item: item[0])
        base_year, base_generation = candidates[0]
        inferred_generation = base_generation + (year - base_year)
        if inferred_generation < 0:
            return "미정"

        return f"{inferred_generation}기"

    # members는 연도 블록에 UI 문구 메타가 필요하므로 기본값을 채웁니다.
    if spec["id"] == "members":
        return {
            "year": year,
            "title": f"MONAD {year}",
            "generationLabel": infer_members_generation_label(),
            "heroTitle": "MEMBERS OF MONAD",
            "heroSubtitle": "모나드의 단자들을 소개합니다.",
            "members": [],
        }

    if spec["id"] == "projects":
        return {"year": year, "projects": []}

    return {spec["year_key"]: year, spec["items_key"]: []}


def is_empty_value(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, (list, dict)):
        return len(value) == 0
    return False


def parse_field_value(field: dict[str, Any], raw_value: Any) -> Any:
    input_type = field.get("input", "text")
    raw = raw_value.strip() if isinstance(raw_value, str) else raw_value

    if input_type in {"text", "url", "multiline"}:
        return str(raw or "")

    if input_type == "number":
        if raw in ("", None):
            return None
        try:
            return int(raw)
        except (TypeError, ValueError) as error:
            raise ValueError(f"{field['label']}은(는) 숫자여야 합니다.") from error

    if input_type == "comma_list":
        if raw in ("", None):
            return []
        if isinstance(raw, str):
            return [token.strip() for token in raw.split(",") if token.strip()]
        if isinstance(raw, list):
            return [str(token).strip() for token in raw if str(token).strip()]
        raise ValueError(f"{field['label']}의 형식이 올바르지 않습니다.")

    if input_type == "line_list":
        if raw in ("", None):
            return []
        if isinstance(raw, str):
            return [line.strip() for line in raw.splitlines() if line.strip()]
        if isinstance(raw, list):
            return [str(token).strip() for token in raw if str(token).strip()]
        raise ValueError(f"{field['label']}의 형식이 올바르지 않습니다.")

    if input_type == "json":
        if raw in ("", None):
            return None
        if isinstance(raw, str):
            try:
                return json.loads(raw)
            except json.JSONDecodeError as error:
                raise ValueError(
                    f"{field['label']} JSON 문법 오류: {error.msg} (line {error.lineno})"
                ) from error
        return raw

    if input_type == "stack_list":
        # 스택 전용 UI는 hidden input으로 JSON 문자열을 전송합니다.
        if raw in ("", None):
            return []

        if isinstance(raw, str):
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError as error:
                raise ValueError(
                    f"{field['label']} JSON 문법 오류: {error.msg} (line {error.lineno})"
                ) from error
        else:
            parsed = raw

        if not isinstance(parsed, list):
            raise ValueError(f"{field['label']}는 배열 형식이어야 합니다.")

        normalized: list[dict[str, Any]] = []
        for index, item in enumerate(parsed):
            if not isinstance(item, dict):
                raise ValueError(f"{field['label']} {index + 1}번째 항목이 객체가 아닙니다.")

            stack_id = str(item.get("id", "")).strip()
            stack_label = str(item.get("label", "")).strip()
            icon_key = str(item.get("iconKey", "")).strip()
            if not stack_id or not stack_label or not icon_key:
                raise ValueError(
                    f"{field['label']} {index + 1}번째 항목은 id/label/iconKey가 모두 필요합니다."
                )

            value_raw = item.get("value", 0)
            try:
                value = float(value_raw)
            except (TypeError, ValueError) as error:
                raise ValueError(
                    f"{field['label']} {index + 1}번째 value는 숫자여야 합니다."
                ) from error

            # 게이지 범위를 벗어나는 값은 자동 보정합니다.
            value = max(0.0, min(1.0, value))

            normalized.append(
                {
                    "id": stack_id,
                    "label": stack_label,
                    "iconKey": icon_key,
                    "value": value,
                }
            )

        return normalized

    return raw


def normalize_payload_to_row(spec: dict[str, Any], values: dict[str, Any]) -> dict[str, Any]:
    normalized: dict[str, Any] = {}

    for field in spec["fields"]:
        key = field["key"]
        input_type = field.get("input", "text")
        raw_value = values.get(key, field.get("default", ""))
        parsed = parse_field_value(field, raw_value)

        if field.get("required") and is_empty_value(parsed):
            raise ValueError(f"필수 필드 누락: {field['label']}")

        # 선택 입력 문자열은 공백일 때 생략합니다.
        if not field.get("required") and input_type in {"text", "url", "multiline"} and parsed == "":
            continue

        if parsed is None and not field.get("required"):
            continue

        normalized[key] = parsed

    return normalized


def parse_row_key(raw_key: Any) -> dict[str, Any]:
    if not isinstance(raw_key, dict):
        raise ValueError("row key 형식이 올바르지 않습니다.")

    row_id = str(raw_key.get("id", "")).strip()
    if not row_id:
        raise ValueError("row key에 id가 필요합니다.")

    year_raw = raw_key.get("year")
    year: int | None
    if year_raw in (None, ""):
        year = None
    else:
        try:
            year = int(year_raw)
        except (TypeError, ValueError) as error:
            raise ValueError("row key의 year는 숫자여야 합니다.") from error

    return {"id": row_id, "year": year}


def find_matches(spec: dict[str, Any], data: dict[str, Any], row_id: str, year: int | None) -> list[dict[str, Any]]:
    matches: list[dict[str, Any]] = []

    if spec["mode"] == "root_array":
        rows = data.get(spec["array_key"], [])
        if not isinstance(rows, list):
            return matches

        for index, item in enumerate(rows):
            if not isinstance(item, dict):
                continue
            if str(item.get("id", "")).strip() != row_id:
                continue
            item_year = item.get("year")
            if year is not None and item_year != year:
                continue
            matches.append(
                {
                    "token": f"root:{index}",
                    "mode": "root",
                    "container": rows,
                    "index": index,
                    "row": item,
                    "year": item_year,
                }
            )

        return matches

    years = data.get(spec["years_key"], [])
    if not isinstance(years, list):
        return matches

    for block_index, year_block in enumerate(years):
        if not isinstance(year_block, dict):
            continue
        block_year = year_block.get(spec["year_key"])
        if year is not None and block_year != year:
            continue

        items = year_block.get(spec["items_key"], [])
        if not isinstance(items, list):
            continue

        for index, item in enumerate(items):
            if not isinstance(item, dict):
                continue
            if str(item.get("id", "")).strip() != row_id:
                continue
            matches.append(
                {
                    "token": f"yearly:{block_index}:{index}",
                    "mode": "yearly",
                    "container": items,
                    "index": index,
                    "row": item,
                    "year": block_year,
                    "year_block": year_block,
                }
            )

    return matches


def locate_single_match(spec: dict[str, Any], data: dict[str, Any], key: dict[str, Any]) -> dict[str, Any]:
    matches = find_matches(spec, data, key["id"], key.get("year"))
    if not matches:
        raise ValueError("대상 row를 찾지 못했습니다.")

    if len(matches) > 1:
        raise ValueError("같은 id를 가진 row가 여러 개입니다. year까지 지정해주세요.")

    return matches[0]


def ensure_unique_row_id(spec: dict[str, Any], data: dict[str, Any], row_id: str, ignore_token: str | None) -> None:
    matches = find_matches(spec, data, row_id, None)
    for match in matches:
        if ignore_token is not None and match["token"] == ignore_token:
            continue
        raise ValueError(f"동일한 ID가 이미 존재합니다: {row_id}")


def append_row(spec: dict[str, Any], row: dict[str, Any]) -> int:
    data = read_dataset_file(spec)
    row_id = str(row.get("id", "")).strip()
    if not row_id:
        raise ValueError("row에 id가 필요합니다.")

    ensure_unique_row_id(spec, data, row_id, ignore_token=None)

    if spec["mode"] == "root_array":
        rows = data.setdefault(spec["array_key"], [])
        if not isinstance(rows, list):
            raise RuntimeError("대상 JSON 구조가 올바르지 않습니다.")

        rows.append(row)
        year_value = row.get("year")
        if isinstance(year_value, int):
            year_order_key = spec.get("year_order_key")
            if isinstance(year_order_key, str):
                update_year_order(data, year_order_key, year_value)

        write_dataset_file(spec, data)
        return len(rows)

    year_value = row.get("year")
    if not isinstance(year_value, int):
        raise ValueError("연도(year)는 숫자여야 합니다.")

    years = data.setdefault(spec["years_key"], [])
    if not isinstance(years, list):
        raise RuntimeError("연도 데이터 구조가 올바르지 않습니다.")

    target_block = None
    for candidate in years:
        if isinstance(candidate, dict) and candidate.get(spec["year_key"]) == year_value:
            target_block = candidate
            break

    if target_block is None:
        target_block = create_year_block(spec, data, year_value)
        years.append(target_block)

    items = target_block.setdefault(spec["items_key"], [])
    if not isinstance(items, list):
        raise RuntimeError("아이템 데이터 구조가 올바르지 않습니다.")

    row_without_year = deepcopy(row)
    row_without_year.pop("year", None)

    year_meta_fields = spec.get("year_meta_fields", [])
    if isinstance(year_meta_fields, list):
        for meta_key in year_meta_fields:
            if not isinstance(meta_key, str):
                continue
            if meta_key in row_without_year:
                target_block[meta_key] = row_without_year.pop(meta_key)

    items.append(row_without_year)

    year_order_key = spec.get("year_order_key")
    if isinstance(year_order_key, str):
        update_year_order(data, year_order_key, year_value)

    write_dataset_file(spec, data)
    return len(items)


def update_row(spec: dict[str, Any], key: dict[str, Any], row: dict[str, Any]) -> int:
    data = read_dataset_file(spec)
    target = locate_single_match(spec, data, key)

    new_id = str(row.get("id", "")).strip()
    if not new_id:
        raise ValueError("수정 데이터에 id가 필요합니다.")

    ensure_unique_row_id(spec, data, new_id, ignore_token=target["token"])

    if spec["mode"] == "root_array":
        target["container"][target["index"]] = row

        year_value = row.get("year")
        if isinstance(year_value, int):
            year_order_key = spec.get("year_order_key")
            if isinstance(year_order_key, str):
                update_year_order(data, year_order_key, year_value)

        write_dataset_file(spec, data)
        return len(target["container"])

    new_year = row.get("year")
    if not isinstance(new_year, int):
        raise ValueError("연도(year)는 숫자여야 합니다.")

    row_without_year = deepcopy(row)
    row_without_year.pop("year", None)
    year_meta_fields = spec.get("year_meta_fields", [])
    old_year = target["year"]

    if old_year == new_year:
        if isinstance(year_meta_fields, list):
            for meta_key in year_meta_fields:
                if not isinstance(meta_key, str):
                    continue
                if meta_key in row_without_year:
                    target["year_block"][meta_key] = row_without_year.pop(meta_key)

        target["container"][target["index"]] = row_without_year
    else:
        del target["container"][target["index"]]

        years = data.setdefault(spec["years_key"], [])
        if not isinstance(years, list):
            raise RuntimeError("연도 데이터 구조가 올바르지 않습니다.")

        new_block = None
        for candidate in years:
            if isinstance(candidate, dict) and candidate.get(spec["year_key"]) == new_year:
                new_block = candidate
                break

        if new_block is None:
            new_block = create_year_block(spec, data, new_year)
            years.append(new_block)

        items = new_block.setdefault(spec["items_key"], [])
        if not isinstance(items, list):
            raise RuntimeError("아이템 데이터 구조가 올바르지 않습니다.")

        if isinstance(year_meta_fields, list):
            for meta_key in year_meta_fields:
                if not isinstance(meta_key, str):
                    continue
                if meta_key in row_without_year:
                    new_block[meta_key] = row_without_year.pop(meta_key)

        items.append(row_without_year)

    year_order_key = spec.get("year_order_key")
    if isinstance(year_order_key, str):
        update_year_order(data, year_order_key, new_year)

    write_dataset_file(spec, data)
    return count_rows(spec, data)


def delete_row(spec: dict[str, Any], key: dict[str, Any]) -> int:
    data = read_dataset_file(spec)
    target = locate_single_match(spec, data, key)

    del target["container"][target["index"]]
    write_dataset_file(spec, data)
    return count_rows(spec, data)


def dataset_summary(spec: dict[str, Any]) -> dict[str, Any]:
    data = read_dataset_file(spec)
    return {
        "id": spec["id"],
        "label": spec["label"],
        "description": spec["description"],
        "rowCount": count_rows(spec, data),
        "fields": spec["fields"],
    }


def dataset_detail(spec: dict[str, Any]) -> dict[str, Any]:
    data = read_dataset_file(spec)
    return {
        "id": spec["id"],
        "label": spec["label"],
        "description": spec["description"],
        "fields": spec["fields"],
        "rowCount": count_rows(spec, data),
        "rows": get_rows(spec, data),
        "file": spec["file"],
    }


class JsonManagerHandler(BaseHTTPRequestHandler):
    index_html: str = ""

    def _is_local_request(self) -> bool:
        return self.client_address[0] in {"127.0.0.1", "::1"}

    def _write_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _write_html(self, html: str) -> None:
        body = html.encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict[str, Any]:
        content_length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(content_length).decode("utf-8")
        return json.loads(raw)

    def do_GET(self) -> None:  # noqa: N802
        if not self._is_local_request():
            self._write_json(HTTPStatus.FORBIDDEN, {"error": "로컬 요청만 허용됩니다."})
            return

        parsed = urlparse(self.path)

        if parsed.path == "/":
            self._write_html(self.index_html)
            return

        if parsed.path == "/api/datasets":
            self._write_json(
                HTTPStatus.OK,
                {"datasets": [dataset_summary(spec) for spec in DATASET_SPECS.values()]},
            )
            return

        if parsed.path == "/api/dataset":
            dataset_id = parse_qs(parsed.query).get("datasetId", [""])[0]
            spec = DATASET_SPECS.get(dataset_id)
            if spec is None:
                self._write_json(HTTPStatus.BAD_REQUEST, {"error": "지원하지 않는 데이터 탭입니다."})
                return

            self._write_json(HTTPStatus.OK, {"dataset": dataset_detail(spec)})
            return

        self._write_json(HTTPStatus.NOT_FOUND, {"error": "지원하지 않는 경로입니다."})

    def do_POST(self) -> None:  # noqa: N802
        if not self._is_local_request():
            self._write_json(HTTPStatus.FORBIDDEN, {"error": "로컬 요청만 허용됩니다."})
            return

        parsed = urlparse(self.path)

        try:
            payload = self._read_json_body()
            dataset_id = str(payload.get("datasetId", "")).strip()
            values = payload.get("values", {})
            raw_key = payload.get("key", {})

            spec = DATASET_SPECS.get(dataset_id)
            if spec is None:
                raise ValueError("지원하지 않는 데이터 탭입니다.")

            if parsed.path == "/api/dataset/add":
                if not isinstance(values, dict):
                    raise ValueError("values는 객체 형태여야 합니다.")
                row = normalize_payload_to_row(spec, values)
                tab_row_count = append_row(spec, row)
                total_row_count = dataset_summary(spec)["rowCount"]
                self._write_json(
                    HTTPStatus.OK,
                    {
                        "ok": True,
                        "action": "add",
                        "datasetId": dataset_id,
                        "tabRowCount": tab_row_count,
                        "totalRowCount": total_row_count,
                    },
                )
                return

            if parsed.path == "/api/dataset/update":
                if not isinstance(values, dict):
                    raise ValueError("values는 객체 형태여야 합니다.")
                key = parse_row_key(raw_key)
                row = normalize_payload_to_row(spec, values)
                tab_row_count = update_row(spec, key, row)
                total_row_count = dataset_summary(spec)["rowCount"]
                self._write_json(
                    HTTPStatus.OK,
                    {
                        "ok": True,
                        "action": "update",
                        "datasetId": dataset_id,
                        "tabRowCount": tab_row_count,
                        "totalRowCount": total_row_count,
                    },
                )
                return

            if parsed.path == "/api/dataset/delete":
                key = parse_row_key(raw_key)
                total_row_count = delete_row(spec, key)
                self._write_json(
                    HTTPStatus.OK,
                    {
                        "ok": True,
                        "action": "delete",
                        "datasetId": dataset_id,
                        "totalRowCount": total_row_count,
                    },
                )
                return

            self._write_json(HTTPStatus.NOT_FOUND, {"error": "지원하지 않는 경로입니다."})
        except json.JSONDecodeError:
            self._write_json(HTTPStatus.BAD_REQUEST, {"error": "요청 본문 JSON 형식이 올바르지 않습니다."})
        except (ValueError, RuntimeError) as error:
            self._write_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
        except OSError as error:
            self._write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"error": f"파일 저장 실패: {error}"})

    def log_message(self, fmt: str, *args: object) -> None:
        print(f"[json-manager] {self.address_string()} - {fmt % args}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="로컬 JSON 관리 GUI 서버")
    parser.add_argument("--host", default="127.0.0.1", help="서버 바인드 호스트")
    parser.add_argument("--port", type=int, default=8765, help="서버 포트")
    parser.add_argument(
        "--skip-sync-check",
        action="store_true",
        help="pull 상태 검사 없이 실행합니다.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()

    if not args.skip_sync_check:
        ensure_pulled_latest()

    JsonManagerHandler.index_html = INDEX_HTML_PATH.read_text(encoding="utf-8")

    server = ThreadingHTTPServer((args.host, args.port), JsonManagerHandler)
    print(f"[json-manager] 실행 주소: http://{args.host}:{args.port}")
    print("[json-manager] 종료하려면 Ctrl+C 를 누르세요.")
    server.serve_forever()


if __name__ == "__main__":
    main()
