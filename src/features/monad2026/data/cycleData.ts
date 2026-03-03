// 동적 사이클 섹션 데이터입니다.
import cycleDeconImage from '../../../assets/monad-2026-cycle-decon.svg'
import cycleEbiImage from '../../../assets/monad-2026-cycle-ebi.svg'
import cycleLiberationImage from '../../../assets/monad-2026-cycle-liberation.svg'
import cycleWebplImage from '../../../assets/monad-2026-cycle-webpl.svg'
import { text } from '../../../content/text/textService'

export type CycleKey = 'webpl' | 'ebi' | 'liberation' | 'decon'

export interface CycleCardData {
  id: string
  title: string
  subtitle: string
  image: string
}

export interface CycleItem {
  key: CycleKey
  label: string
  description: string
  cards: readonly [CycleCardData, CycleCardData]
}

export const cycleItems: readonly CycleItem[] = [
  {
    key: 'webpl',
    label: text('monad2026', 'cycle.webpl.label', '웹플'),
    description: text(
      'monad2026',
      'cycle.webpl.description',
      '웹 개발의 기본기와 제품화 감각을 함께 키우며 아이디어를 실제 서비스로 연결합니다.',
    ),
    cards: [
      {
        id: 'webpl-card-a',
        title: text('monad2026', 'cycle.webpl.cardA.title', '웹플 프로젝트'),
        subtitle: text('monad2026', 'cycle.webpl.cardA.subtitle', '기획부터 배포까지 전 과정 실습'),
        image: cycleWebplImage,
      },
      {
        id: 'webpl-card-b',
        title: text('monad2026', 'cycle.webpl.cardB.title', '프론트엔드 스터디'),
        subtitle: text(
          'monad2026',
          'cycle.webpl.cardB.subtitle',
          '컴포넌트 구조와 상태 관리 심화',
        ),
        image: cycleWebplImage,
      },
    ],
  },
  {
    key: 'ebi',
    label: text('monad2026', 'cycle.ebi.label', '이비'),
    description: text(
      'monad2026',
      'cycle.ebi.description',
      '브랜딩과 비즈니스 인사이트를 접목해 기술 프로젝트를 실제 문제 해결의 흐름으로 확장합니다.',
    ),
    cards: [
      {
        id: 'ebi-card-a',
        title: text('monad2026', 'cycle.ebi.cardA.title', '브랜딩 워크숍'),
        subtitle: text('monad2026', 'cycle.ebi.cardA.subtitle', '제품 메시지와 사용자 관점 정리'),
        image: cycleEbiImage,
      },
      {
        id: 'ebi-card-b',
        title: text('monad2026', 'cycle.ebi.cardB.title', '문제정의 세션'),
        subtitle: text('monad2026', 'cycle.ebi.cardB.subtitle', '실행 가능한 MVP 범위 설정'),
        image: cycleEbiImage,
      },
    ],
  },
  {
    key: 'liberation',
    label: text('monad2026', 'cycle.liberation.label', '해방'),
    description: text(
      'monad2026',
      'cycle.liberation.description',
      '고정된 기술 영역에서 벗어나 새로운 도메인을 탐색하며 스스로 확장 가능한 학습 루프를 만듭니다.',
    ),
    cards: [
      {
        id: 'liberation-card-a',
        title: text('monad2026', 'cycle.liberation.cardA.title', '도메인 리서치'),
        subtitle: text(
          'monad2026',
          'cycle.liberation.cardA.subtitle',
          '사회 문제 기반 기술 적용 탐색',
        ),
        image: cycleLiberationImage,
      },
      {
        id: 'liberation-card-b',
        title: text('monad2026', 'cycle.liberation.cardB.title', '실험 프로젝트'),
        subtitle: text(
          'monad2026',
          'cycle.liberation.cardB.subtitle',
          '짧은 주기 프로토타입 반복',
        ),
        image: cycleLiberationImage,
      },
    ],
  },
  {
    key: 'decon',
    label: text('monad2026', 'cycle.decon.label', '디컨'),
    description: text(
      'monad2026',
      'cycle.decon.description',
      '복잡한 문제를 분해하고 핵심을 구조화해 협업 가능한 개발 문서와 실행 계획으로 정리합니다.',
    ),
    cards: [
      {
        id: 'decon-card-a',
        title: text('monad2026', 'cycle.decon.cardA.title', '문제 분해 세션'),
        subtitle: text(
          'monad2026',
          'cycle.decon.cardA.subtitle',
          '요구사항과 우선순위 구조화',
        ),
        image: cycleDeconImage,
      },
      {
        id: 'decon-card-b',
        title: text('monad2026', 'cycle.decon.cardB.title', '아키텍처 리뷰'),
        subtitle: text('monad2026', 'cycle.decon.cardB.subtitle', '설계 검증과 리스크 분석'),
        image: cycleDeconImage,
      },
    ],
  },
]
