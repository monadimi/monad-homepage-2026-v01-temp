// 동적 사이클 섹션 데이터입니다.
import cycleDeconImage from '../../../assets/monad-2026-cycle-decon.svg'
import cycleEbiImage from '../../../assets/monad-2026-cycle-ebi.svg'
import cycleLiberationImage from '../../../assets/monad-2026-cycle-liberation.svg'
import cycleWebplImage from '../../../assets/monad-2026-cycle-webpl.svg'
import { text } from '../../../content/text/textService'

export type CycleKey = 'wp' | 'eb' | 'hd' | 'dc'

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
    key: 'wp',
    label: text('monad2026', 'cycle.wp.label', '웹플'),
    description: text(
      'monad2026',
      'cycle.wp.description',
      '웹 개발의 기본기와 제품화 감각을 함께 키우며 아이디어를 실제 서비스로 연결합니다.',
    ),
    cards: [
      {
        id: 'wp-card-a',
        title: text('monad2026', 'cycle.wp.cardA.title', '웹플 프로젝트'),
        subtitle: text('monad2026', 'cycle.wp.cardA.subtitle', '기획부터 배포까지 전 과정 실습'),
        image: cycleWebplImage,
      },
      {
        id: 'wp-card-b',
        title: text('monad2026', 'cycle.wp.cardB.title', '프론트엔드 스터디'),
        subtitle: text(
          'monad2026',
          'cycle.wp.cardB.subtitle',
          '컴포넌트 구조와 상태 관리 심화',
        ),
        image: cycleWebplImage,
      },
    ],
  },
  {
    key: 'eb',
    label: text('monad2026', 'cycle.eb.label', '이비'),
    description: text(
      'monad2026',
      'cycle.eb.description',
      '브랜딩과 비즈니스 인사이트를 접목해 기술 프로젝트를 실제 문제 해결의 흐름으로 확장합니다.',
    ),
    cards: [
      {
        id: 'eb-card-a',
        title: text('monad2026', 'cycle.eb.cardA.title', '브랜딩 워크숍'),
        subtitle: text('monad2026', 'cycle.eb.cardA.subtitle', '제품 메시지와 사용자 관점 정리'),
        image: cycleEbiImage,
      },
      {
        id: 'eb-card-b',
        title: text('monad2026', 'cycle.eb.cardB.title', '문제정의 세션'),
        subtitle: text('monad2026', 'cycle.eb.cardB.subtitle', '실행 가능한 MVP 범위 설정'),
        image: cycleEbiImage,
      },
    ],
  },
  {
    key: 'hd',
    label: text('monad2026', 'cycle.hd.label', '해방'),
    description: text(
      'monad2026',
      'cycle.hd.description',
      '고정된 기술 영역에서 벗어나 새로운 도메인을 탐색하며 스스로 확장 가능한 학습 루프를 만듭니다.',
    ),
    cards: [
      {
        id: 'hd-card-a',
        title: text('monad2026', 'cycle.hd.cardA.title', '도메인 리서치'),
        subtitle: text(
          'monad2026',
          'cycle.hd.cardA.subtitle',
          '사회 문제 기반 기술 적용 탐색',
        ),
        image: cycleLiberationImage,
      },
      {
        id: 'hd-card-b',
        title: text('monad2026', 'cycle.hd.cardB.title', '실험 프로젝트'),
        subtitle: text(
          'monad2026',
          'cycle.hd.cardB.subtitle',
          '짧은 주기 프로토타입 반복',
        ),
        image: cycleLiberationImage,
      },
    ],
  },
  {
    key: 'dc',
    label: text('monad2026', 'cycle.dc.label', '디컨'),
    description: text(
      'monad2026',
      'cycle.dc.description',
      '복잡한 문제를 분해하고 핵심을 구조화해 협업 가능한 개발 문서와 실행 계획으로 정리합니다.',
    ),
    cards: [
      {
        id: 'dc-card-a',
        title: text('monad2026', 'cycle.dc.cardA.title', '문제 분해 세션'),
        subtitle: text(
          'monad2026',
          'cycle.dc.cardA.subtitle',
          '요구사항과 우선순위 구조화',
        ),
        image: cycleDeconImage,
      },
      {
        id: 'dc-card-b',
        title: text('monad2026', 'cycle.dc.cardB.title', '아키텍처 리뷰'),
        subtitle: text('monad2026', 'cycle.dc.cardB.subtitle', '설계 검증과 리스크 분석'),
        image: cycleDeconImage,
      },
    ],
  },
]
