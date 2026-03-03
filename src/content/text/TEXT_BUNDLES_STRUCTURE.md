# TEXT BUNDLES DATA STRUCTURE

웹사이트 UI 텍스트를 JSON으로 관리하기 위한 구조 설명 문서입니다.

## 1) 레지스트리 파일

- 파일: `src/content/text/text-bundles.json`
- 역할: 어떤 텍스트 번들을 앱/LWEET이 로드할지 목록으로 관리

```json
{
  "version": 1,
  "defaultLocale": "ko",
  "bundles": [
    {
      "id": "global",
      "label": "Global UI",
      "locale": "ko",
      "description": "네비게이션/공통 UI 텍스트",
      "file": "src/content/text/global.ko.json"
    }
  ]
}
```

### 필드 설명

- `version` (number): 레지스트리 버전
- `defaultLocale` (string): 기본 언어 코드
- `bundles` (array): 번들 메타 목록
  - `id` (string): 번들 고유 ID (예: `global`, `home`)
  - `label` (string): LWEET 탭 이름
  - `locale` (string): 언어 코드 (예: `ko`)
  - `description` (string): 번들 설명
  - `file` (string): 실제 번들 JSON 파일 경로

## 2) 번들 파일

- 파일 패턴: `src/content/text/*.ko.json`
- 역할: 실제 UI 문자열 엔트리 보관

```json
{
  "id": "global",
  "locale": "ko",
  "entries": [
    {
      "id": "nav.home",
      "value": "Home",
      "description": "헤더 메뉴 Home"
    }
  ]
}
```

### 필드 설명

- `id` (string): 번들 ID (레지스트리의 `bundles[].id`와 동일)
- `locale` (string): 번들 언어 코드
- `entries` (array): 텍스트 엔트리 목록
  - `id` (string, 필수): 텍스트 키
  - `value` (string, 필수): 실제 UI 문구
  - `description` (string, 선택): 용도 설명

## 3) 텍스트 키 네이밍 규칙

- 권장 형식: `도메인.영역.의미`
  - 예: `nav.home`, `hero.title`, `faq.item1.question`
- 고유해야 하며 같은 번들 내부에서 중복 불가

## 4) 템플릿 문자열

- `{year}`처럼 플레이스홀더를 사용할 수 있습니다.
- 코드에서 `textFormat(...)`으로 치환합니다.

예시:

- 값: `© {year} MONAD. All rights reserved.`
- 파라미터: `{ "year": 2026 }`

## 5) 검증

아래 명령으로 레지스트리/번들 형식을 검증합니다.

```bash
npm run validate:texts
```

검증 항목:
- 번들 ID 중복
- 파일 존재 여부
- 번들/레지스트리 ID 일치
- 엔트리 키 중복
- 엔트리 값 타입(string) 확인
