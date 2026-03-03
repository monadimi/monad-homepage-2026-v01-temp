#!/usr/bin/env python3
"""awards/members/projects JSON 데이터 구조를 검증합니다."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]

AWARDS_PATH = REPO_ROOT / "src/features/achievements/data/awards.json"
MEMBERS_PATH = REPO_ROOT / "src/features/members/data/members.json"
PROJECTS_PATH = REPO_ROOT / "src/features/projects/data/projects.json"


def fail(message: str) -> None:
    print(f"[validate:data] 오류: {message}")
    sys.exit(1)


def load_json(path: Path) -> Any:
    if not path.exists():
        fail(f"파일이 없습니다: {path.relative_to(REPO_ROOT)}")

    try:
        with path.open(encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as error:
        fail(
            f"{path.relative_to(REPO_ROOT)} JSON 문법 오류: {error.msg} "
            f"(line {error.lineno}, col {error.colno})"
        )


def expect_dict(value: Any, path: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        fail(f"{path}는 객체여야 합니다.")
    return value


def expect_string(value: Any, path: str) -> str:
    if not isinstance(value, str) or value.strip() == "":
        fail(f"{path}는 비어있지 않은 문자열이어야 합니다.")
    return value


def expect_int(value: Any, path: str) -> int:
    if not isinstance(value, int):
        fail(f"{path}는 정수여야 합니다.")
    return value


def expect_number(value: Any, path: str) -> float:
    if not isinstance(value, (int, float)):
        fail(f"{path}는 숫자여야 합니다.")
    return float(value)


def expect_string_list(value: Any, path: str) -> list[str]:
    if not isinstance(value, list):
        fail(f"{path}는 배열이어야 합니다.")
    normalized: list[str] = []
    for index, item in enumerate(value):
        normalized.append(expect_string(item, f"{path}[{index}]"))
    return normalized


def expect_int_list(value: Any, path: str) -> list[int]:
    if not isinstance(value, list):
        fail(f"{path}는 배열이어야 합니다.")

    normalized: list[int] = []
    for index, item in enumerate(value):
        normalized.append(expect_int(item, f"{path}[{index}]"))

    return normalized


def validate_year_order(
    year_order: list[int],
    used_years: set[int],
    default_year: int,
    dataset_name: str,
) -> None:
    if len(year_order) == 0:
        fail(f"{dataset_name}.yearOrder는 1개 이상이어야 합니다.")

    if len(set(year_order)) != len(year_order):
        fail(f"{dataset_name}.yearOrder에 중복 연도가 있습니다.")

    if default_year not in year_order:
        fail(f"{dataset_name}.defaultYear({default_year})가 yearOrder에 없습니다.")

    missing_in_order = sorted(used_years - set(year_order))
    if missing_in_order:
        fail(f"{dataset_name}.yearOrder에 없는 연도가 데이터에 존재합니다: {missing_in_order}")

    missing_in_data = sorted(set(year_order) - used_years)
    if missing_in_data:
        fail(f"{dataset_name}.yearOrder에만 있고 데이터가 없는 연도가 있습니다: {missing_in_data}")


def validate_awards() -> int:
    payload = expect_dict(load_json(AWARDS_PATH), "awards")

    default_year = expect_int(payload.get("defaultYear"), "awards.defaultYear")
    year_order = expect_int_list(payload.get("yearOrder"), "awards.yearOrder")

    awards = payload.get("awards")
    if not isinstance(awards, list):
        fail("awards.awards는 배열이어야 합니다.")

    seen_ids: set[str] = set()
    used_years: set[int] = set()

    for index, raw_award in enumerate(awards):
        award = expect_dict(raw_award, f"awards.awards[{index}]")

        award_id = expect_string(award.get("id"), f"awards.awards[{index}].id")
        if award_id in seen_ids:
            fail(f"awards.awards[{index}].id 중복: {award_id}")
        seen_ids.add(award_id)

        award_year = expect_int(award.get("year"), f"awards.awards[{index}].year")
        used_years.add(award_year)

        expect_string(award.get("title"), f"awards.awards[{index}].title")
        expect_string(award.get("subtitle"), f"awards.awards[{index}].subtitle")
        expect_string(award.get("highlight"), f"awards.awards[{index}].highlight")
        expect_string(award.get("imageKey"), f"awards.awards[{index}].imageKey")

        if "description" in award and award["description"] is not None:
            expect_string(award["description"], f"awards.awards[{index}].description")
        if "prize" in award and award["prize"] is not None:
            expect_string(award["prize"], f"awards.awards[{index}].prize")
        if "serviceUrl" in award and award["serviceUrl"] is not None:
            expect_string(award["serviceUrl"], f"awards.awards[{index}].serviceUrl")
        if "teamMembers" in award and award["teamMembers"] is not None:
            expect_string_list(award["teamMembers"], f"awards.awards[{index}].teamMembers")

    validate_year_order(year_order, used_years, default_year, "awards")
    return len(awards)


def validate_members() -> tuple[int, int]:
    payload = expect_dict(load_json(MEMBERS_PATH), "members")

    default_year = expect_int(payload.get("defaultYear"), "members.defaultYear")
    year_order = expect_int_list(payload.get("yearOrder"), "members.yearOrder")

    years = payload.get("years")
    if not isinstance(years, list):
        fail("members.years는 배열이어야 합니다.")

    used_years: set[int] = set()
    seen_member_ids: set[str] = set()
    total_members = 0

    for year_index, raw_year_group in enumerate(years):
        year_group = expect_dict(raw_year_group, f"members.years[{year_index}]")
        year = expect_int(year_group.get("year"), f"members.years[{year_index}].year")

        if year in used_years:
            fail(f"members.years[{year_index}].year 중복: {year}")
        used_years.add(year)

        expect_string(year_group.get("title"), f"members.years[{year_index}].title")
        expect_string(
            year_group.get("generationLabel"),
            f"members.years[{year_index}].generationLabel",
        )
        expect_string(year_group.get("heroTitle"), f"members.years[{year_index}].heroTitle")
        expect_string(
            year_group.get("heroSubtitle"),
            f"members.years[{year_index}].heroSubtitle",
        )

        members = year_group.get("members")
        if not isinstance(members, list):
            fail(f"members.years[{year_index}].members는 배열이어야 합니다.")

        for member_index, raw_member in enumerate(members):
            member = expect_dict(
                raw_member,
                f"members.years[{year_index}].members[{member_index}]",
            )

            member_id = expect_string(
                member.get("id"),
                f"members.years[{year_index}].members[{member_index}].id",
            )
            if member_id in seen_member_ids:
                fail(f"members.members.id 중복: {member_id}")
            seen_member_ids.add(member_id)

            expect_string(
                member.get("name"),
                f"members.years[{year_index}].members[{member_index}].name",
            )
            expect_string(
                member.get("code"),
                f"members.years[{year_index}].members[{member_index}].code",
            )
            expect_string(
                member.get("intro"),
                f"members.years[{year_index}].members[{member_index}].intro",
            )
            expect_string(
                member.get("quote"),
                f"members.years[{year_index}].members[{member_index}].quote",
            )
            expect_string(
                member.get("github"),
                f"members.years[{year_index}].members[{member_index}].github",
            )
            expect_string(
                member.get("githubLabel"),
                f"members.years[{year_index}].members[{member_index}].githubLabel",
            )
            expect_string(
                member.get("imageKey"),
                f"members.years[{year_index}].members[{member_index}].imageKey",
            )

            roles = expect_string_list(
                member.get("roles"),
                f"members.years[{year_index}].members[{member_index}].roles",
            )
            if len(roles) == 0:
                fail(f"members.years[{year_index}].members[{member_index}].roles는 1개 이상이어야 합니다.")

            expect_string_list(
                member.get("achievements"),
                f"members.years[{year_index}].members[{member_index}].achievements",
            )

            stacks = member.get("stacks")
            if not isinstance(stacks, list):
                fail(f"members.years[{year_index}].members[{member_index}].stacks는 배열이어야 합니다.")

            stack_ids: set[str] = set()
            for stack_index, raw_stack in enumerate(stacks):
                stack = expect_dict(
                    raw_stack,
                    f"members.years[{year_index}].members[{member_index}].stacks[{stack_index}]",
                )
                stack_id = expect_string(
                    stack.get("id"),
                    f"members.years[{year_index}].members[{member_index}].stacks[{stack_index}].id",
                )
                if stack_id in stack_ids:
                    fail(
                        f"members.years[{year_index}].members[{member_index}] "
                        f"stacks.id 중복: {stack_id}"
                    )
                stack_ids.add(stack_id)

                expect_string(
                    stack.get("label"),
                    f"members.years[{year_index}].members[{member_index}].stacks[{stack_index}].label",
                )
                expect_string(
                    stack.get("iconKey"),
                    f"members.years[{year_index}].members[{member_index}].stacks[{stack_index}].iconKey",
                )
                value = expect_number(
                    stack.get("value"),
                    f"members.years[{year_index}].members[{member_index}].stacks[{stack_index}].value",
                )
                if value < 0 or value > 1:
                    fail(
                        f"members.years[{year_index}].members[{member_index}].stacks[{stack_index}].value는 0~1 사이여야 합니다."
                    )

            total_members += 1

    validate_year_order(year_order, used_years, default_year, "members")
    return len(years), total_members


def validate_projects() -> tuple[int, int]:
    payload = expect_dict(load_json(PROJECTS_PATH), "projects")

    default_year = expect_int(payload.get("defaultYear"), "projects.defaultYear")
    year_order = expect_int_list(payload.get("yearOrder"), "projects.yearOrder")
    rotation_interval_ms = expect_int(
        payload.get("rotationIntervalMs"),
        "projects.rotationIntervalMs",
    )
    if rotation_interval_ms <= 0:
        fail("projects.rotationIntervalMs는 1 이상이어야 합니다.")

    years = payload.get("years")
    if not isinstance(years, list):
        fail("projects.years는 배열이어야 합니다.")

    used_years: set[int] = set()
    seen_project_ids: set[str] = set()
    total_projects = 0

    for year_index, raw_year_group in enumerate(years):
        year_group = expect_dict(raw_year_group, f"projects.years[{year_index}]")
        year = expect_int(year_group.get("year"), f"projects.years[{year_index}].year")

        if year in used_years:
            fail(f"projects.years[{year_index}].year 중복: {year}")
        used_years.add(year)

        projects = year_group.get("projects")
        if not isinstance(projects, list):
            fail(f"projects.years[{year_index}].projects는 배열이어야 합니다.")

        for project_index, raw_project in enumerate(projects):
            project = expect_dict(
                raw_project,
                f"projects.years[{year_index}].projects[{project_index}]",
            )
            project_id = expect_string(
                project.get("id"),
                f"projects.years[{year_index}].projects[{project_index}].id",
            )
            if project_id in seen_project_ids:
                fail(f"projects.projects.id 중복: {project_id}")
            seen_project_ids.add(project_id)

            expect_string(
                project.get("title"),
                f"projects.years[{year_index}].projects[{project_index}].title",
            )
            expect_string(
                project.get("summary"),
                f"projects.years[{year_index}].projects[{project_index}].summary",
            )
            expect_string(
                project.get("subtitle"),
                f"projects.years[{year_index}].projects[{project_index}].subtitle",
            )
            expect_string(
                project.get("awardTag"),
                f"projects.years[{year_index}].projects[{project_index}].awardTag",
            )

            tags = expect_string_list(
                project.get("tags"),
                f"projects.years[{year_index}].projects[{project_index}].tags",
            )
            if len(tags) == 0:
                fail(f"projects.years[{year_index}].projects[{project_index}].tags는 1개 이상이어야 합니다.")

            total_projects += 1

    validate_year_order(year_order, used_years, default_year, "projects")
    return len(years), total_projects


def main() -> None:
    awards_count = validate_awards()
    members_year_count, members_count = validate_members()
    projects_year_count, projects_count = validate_projects()

    print(
        "[validate:data] OK · "
        f"awards={awards_count} · "
        f"members={members_count} (years={members_year_count}) · "
        f"projects={projects_count} (years={projects_year_count})"
    )


if __name__ == "__main__":
    main()
