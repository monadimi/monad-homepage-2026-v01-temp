# Awards JSON 데이터 구조

`awards.json`은 Achievements 페이지 카드 목록의 원본 데이터입니다.

## 최상위 구조

```json
{
  "defaultYear": 2025,
  "yearOrder": [2026, 2025, 2024, 2023],
  "awards": [ ... ]
}
```

### 필드 설명

- `defaultYear` (number): 초기 선택 연도
- `yearOrder` (number[]): 연도 네비게이션 표시 순서
- `awards` (AwardSource[]): 수상 내역 목록

## `awards[]` 항목 구조 (`AwardSource`)

- `id` (string): 고유 식별자
- `year` (number): 수상 연도 (연도 필터 기준)
- `title` (string): 대회/프로그램명
- `subtitle` (string): 부제/주최 정보
- `highlight` (string): 강조 텍스트 (예: 대상, 우수상)
- `imageKey` (string): 카드 이미지 키 (렌더링 레이어에서 URL 매핑)
- `description` (string, optional): 카드 확장 상태에서 노출할 상세 설명
- `teamMembers` (string[], optional): 수상 프로젝트 참여 인원 목록
- `prize` (string, optional): 상금/지원금 정보
- `serviceUrl` (string, optional): 서비스 데모/소개 링크

## 유지보수 가이드

1. `yearOrder`에 없는 연도는 UI에서 선택 탭이 보이지 않을 수 있습니다.
2. `id`는 연도별로도 중복되지 않게 관리합니다.
3. `imageKey`를 새로 추가할 때는 렌더링 코드의 매핑 사전도 함께 갱신합니다.
