# Projects JSON 데이터 구조

`projects.json`은 Projects 페이지의 연도 필터, 카드 목록, 자동 전환 주기를 관리하는 원본 데이터입니다.

## 최상위 구조

```json
{
  "defaultYear": 2025,
  "yearOrder": [2025, 2026],
  "rotationIntervalMs": 5500,
  "years": [ ... ]
}
```

### 필드 설명

- `defaultYear` (number): 최초 선택 연도
- `yearOrder` (number[]): 연도 필터 버튼 노출 순서
- `rotationIntervalMs` (number): 상단 대표 프로젝트 자동 전환 주기(ms)
- `years` (ProjectYearSource[]): 연도별 프로젝트 데이터

## `years[]` 항목 구조 (`ProjectYearSource`)

- `year` (number): 연도 키
- `projects` (ProjectSourceRecord[]): 해당 연도 프로젝트 목록

## `projects[]` 항목 구조 (`ProjectSourceRecord`)

- `id` (string): 프로젝트 고유 식별자
- `title` (string): 프로젝트명
- `summary` (string): 요약 설명
- `subtitle` (string): 영문 부제
- `awardTag` (string): 대표 성과/수상 태그
- `tags` (string[]): 보조 태그 목록

## 유지보수 가이드

1. `id`는 전체 연도 기준으로도 중복되지 않게 유지합니다.
2. `defaultYear`는 반드시 `yearOrder` 내부 값이어야 합니다.
3. `yearOrder`와 `years[].year` 값이 어긋나면 일부 연도 탭이 비거나 보이지 않을 수 있습니다.
4. 자동 전환 속도를 조절하려면 `rotationIntervalMs`만 수정하면 됩니다.
