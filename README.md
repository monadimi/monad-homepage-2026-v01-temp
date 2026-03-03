# MONAD Homepage 2026

디미고 전공동아리 **MONAD** 홈페이지 프론트엔드 프로젝트입니다.

- React + TypeScript + Vite 기반 SPA
- 공통 Header / Footer 재사용 구조
- 데이터(awards, members, projects)는 JSON 기반으로 관리
- 로컬 전용 JSON GUI 관리 툴 포함

---

## 1) 주요 페이지

- `/` Home
- `/achievements` Achievements
- `/members` Members
- `/projects` Projects
- `/monad-2026` MONAD 2026

라우트 정의 기준 파일:
- `src/core/navigation/routes.ts`
- `src/app/Router.tsx`

---

## 2) 기술 스택

- **Runtime**: React 19, React Router 7
- **Language**: TypeScript
- **Build Tool**: Vite
- **Lint**: ESLint
- **Local Data Tool**: Python 3 (내장 HTTP 서버)

---

## 3) 시작하기

### 요구사항

- Node.js 20+
- npm 10+
- Python 3.10+

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 린트 / 빌드

```bash
npm run lint
npm run build
npm run preview
```

---

## 4) JSON 데이터 관리

실서비스 콘텐츠는 아래 JSON 파일들을 기준으로 렌더링됩니다.

- `src/features/achievements/data/awards.json`
- `src/features/members/data/members.json`
- `src/features/projects/data/projects.json`

데이터 구조 설명 문서:
- `src/features/achievements/data/AWARDS_DATA_STRUCTURE.md`
- `src/features/members/data/MEMBERS_DATA_STRUCTURE.md`
- `src/features/projects/data/PROJECTS_DATA_STRUCTURE.md`

---

## 5) 로컬 JSON GUI 매니저

JSON을 코드 편집 없이 GUI로 추가/수정/삭제할 수 있는 로컬 툴입니다.

### 실행

```bash
npm run json-manager
# 또는
python3 tools/json-manager/server.py
```

기본 주소:
- `http://127.0.0.1:8765`

### 특징

- 라이트 모드 대시보드
- 사이드바 탭으로 데이터셋 전환
- 표(Table) 기반 조회
- 새 데이터 추가 / 편집 / 삭제
- Members의 `stacks` 전용 행 편집 UI
- 로컬 접속만 허용 (`127.0.0.1`, `::1`)

### 실행 전 동기화 검사

기본적으로 서버 시작 시 아래를 확인합니다.

1. `git fetch origin`
2. 현재 브랜치가 비교 대상보다 뒤쳐져 있는지 검사
   - 업스트림이 있으면 업스트림 기준
   - 업스트림이 없으면 `origin/main` 기준

뒤쳐져 있으면 실행이 차단되며 `git pull` 후 재실행해야 합니다.

필요 시 강제 실행:

```bash
python3 tools/json-manager/server.py --skip-sync-check
```

상세 문서:
- `tools/json-manager/README.md`

---

## 6) 프로젝트 구조 (요약)

```text
src/
  app/                # Router, App shell
  core/
    layout/           # Header/Footer
    navigation/       # 라우트 메타
    seo/              # 페이지별 SEO 메타
    theme/            # 전역 스타일/토큰
  features/
    home/
    achievements/
    members/
    projects/
    monad2026/
public/               # favicon, robots.txt, manifest 등
tools/json-manager/   # 로컬 JSON GUI 관리 툴 (Python + HTML)
```

---

## 7) 협업 메모

- 페이지 전환 시 스크롤은 항상 상단으로 초기화됩니다.
- SEO 메타는 `src/core/seo`에서 중앙 관리합니다.
- 콘텐츠 수정은 가능하면 JSON + 데이터 구조 문서를 함께 갱신해 주세요.

