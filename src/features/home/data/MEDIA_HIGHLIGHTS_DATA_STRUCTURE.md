# Home Media Highlights JSON 데이터 구조

`mediaHighlights.json`은 홈 하단의 "미디어 노출" 흐르는 카드 섹션 데이터 원본입니다.

## 최상위 구조

```json
{
  "items": [ ... ]
}
```

## `items[]` 항목 구조 (`MediaHighlightSource`)

- `id` (string): 항목 고유 식별자
- `type` (string): 항목 타입
  - `youtube`
  - `article`
  - `image`
- `title` (string): 카드 제목
- `url` (string, optional): 클릭 시 이동할 링크
- `previewText` (string, optional): 기사형 카드 설명 텍스트
- `imageUrl` (string, optional): 이미지형 카드 이미지 URL

## 타입별 권장 필드

### 1) `youtube`
- 필수 권장: `id`, `type`, `title`, `url`
- `url`은 일반 YouTube 링크(`watch?v=`) 또는 `embed` 링크 모두 허용

### 2) `article`
- 필수 권장: `id`, `type`, `title`, `url`, `previewText`

### 3) `image`
- 필수 권장: `id`, `type`, `title`, `imageUrl`
- 선택: `url` (이미지 클릭 이동 링크)

## 유지보수 가이드

1. `id`는 전체 배열에서 중복되지 않게 유지합니다.
2. 카드 3개 이상을 유지하면 흐르는 섹션의 가독성이 안정적입니다.
3. 너무 긴 제목/설명은 모바일에서 줄바꿈이 과해질 수 있으므로 적정 길이를 권장합니다.
