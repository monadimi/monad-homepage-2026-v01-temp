# Members JSON 데이터 구조

`members.json`은 Members 페이지 렌더링에 사용하는 원본 데이터입니다.  
런타임에서는 `members.ts`의 `MembersRepository`가 이 파일을 읽어 UI 모델로 정규화합니다.

## 최상위 구조

```json
{
  "defaultYear": 2025,
  "yearOrder": [2025],
  "years": [ ... ]
}
```

### 필드 설명

- `defaultYear` (number): 최초 진입 시 선택할 연도
- `yearOrder` (number[]): 연도 탭 표시 순서
- `years` (MemberYearSource[]): 연도별 멤버 데이터

## `years[]` 항목 구조 (`MemberYearSource`)

- `year` (number): 데이터 연도 키
- `title` (string): 섹션 제목 (예: `MONAD 2025`)
- `generationLabel` (string): 기수 라벨 (예: `0기`)
- `heroTitle` (string): 상단 히어로 타이틀
- `heroSubtitle` (string): 상단 히어로 서브타이틀
- `members` (MemberSourceRecord[]): 해당 연도의 멤버 목록

## `members[]` 항목 구조 (`MemberSourceRecord`)

- `id` (string): 고유 식별자 (권장: `member-{순번}-{이름}`)
- `name` (string): 멤버명
- `code` (string): 카드 상단 코드 텍스트
- `intro` (string): 소개 문구
- `roles` (string[]): 역할 키 목록  
  - 현재 권장 값: `planner`, `developer`, `designer`
- `quote` (string): 멘트/한마디
- `github` (string): GitHub URL
- `githubLabel` (string): 링크 표시 라벨
- `imageKey` (string): 이미지 레지스트리 키 (`members.ts`의 `imageRegistry`에서 매핑)
  - 로컬 방식 기준: `src/assets/members` 파일명(확장자 제외)
    - 예: `src/assets/members/dana.png` → `imageKey: "dana"`
- `achievements` (string[]): 주요 이력 목록
- `stacks` (MemberStackSource[]): 기술 스택 목록

## `stacks[]` 항목 구조 (`MemberStackSource`)

- `id` (string): 스택 고유 키
- `label` (string): 화면 표시명
- `iconKey` (string): 아이콘 키  
  - 문자열 제한 없음 (자유 확장)
- `value` (number): 숙련도/강조 값 (0 ~ 1)

## 유지보수 가이드

1. 멤버를 추가/삭제할 때 `id`는 중복되지 않게 관리합니다.
2. `roles`, `imageKey`를 확장할 때는 `members.ts`의 매핑 규칙도 함께 갱신합니다.
   - 현재는 `src/assets/members` 폴더의 파일을 자동 인식합니다.
3. `iconKey`는 제한 없이 추가할 수 있으며, 미정의 키는 UI에서 축약 텍스트로 표시됩니다.
4. `yearOrder`에는 `years[].year`에 존재하는 값만 넣습니다.
5. `defaultYear`는 항상 `yearOrder`에 포함된 값으로 유지합니다.
