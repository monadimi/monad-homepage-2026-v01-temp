# LWEET (Local Web Editor for Easy Text)

로컬에서만 실행되는 MONAD JSON GUI 관리 도구입니다.

## 핵심 기능

- 라이트 모드 대시보드 UI
- 사이드바에서 데이터 탭 선택
  - Achievements · Awards
  - Members
  - Projects
  - Home · Media Highlights
  - Text · *(레지스트리 기반 동적 생성)*
    - 현재: Global UI / Home / MONAD 2026 / Achievements / Members / Projects
- 사이드바는 고정, 우측 데이터 영역만 스크롤
- 각 탭에서 데이터 표(Table) 조회
- **새 데이터 추가 / 편집 / 삭제** 지원
- 행 **상/하 이동(순서 변경)** 지원
- Members의 `stacks`는 전용 행 편집 UI로 관리 (`id/label/iconKey/value`)
- 텍스트 번들은 레지스트리(`src/content/text/text-bundles.json`) 기반으로 자동 탭 생성
- 저장은 Python 서버가 처리(유효성 검사 + pretty JSON 포맷)

## 텍스트 번들 구조

- 레지스트리: `src/content/text/text-bundles.json`
- 실제 번들: `src/content/text/*.ko.json`
  - `entries` 배열의 각 항목을 편집합니다.
  - 필수 필드: `id`, `value`
  - 선택 필드: `description`

검증 명령:

```bash
npm run validate:texts
npm run validate:data
```

## 실행 제약

- 기본적으로 `127.0.0.1` 로컬 접속만 허용
- 실행 시 `git fetch origin` 후 동기화 상태 확인
  - 현재 브랜치 업스트림이 있으면 업스트림 기준
  - 업스트림이 없으면 `origin/main` 기준
- 원격보다 뒤쳐졌으면 실행 차단 (`git pull` 후 재실행)

## 실행 방법

```bash
npm run json-manager
# 또는
python3 tools/json-manager/server.py
```

기본 주소: `http://127.0.0.1:8765`

## 옵션

- `--port <number>`: 포트 변경
- `--host <addr>`: 바인드 주소 변경 (기본 `127.0.0.1`)
- `--skip-sync-check`: pull 상태 검사 생략

예시:

```bash
python3 tools/json-manager/server.py --port 8780
```
