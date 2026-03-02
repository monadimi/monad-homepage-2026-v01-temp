import achievementsHeroImage from '../../assets/achievements-hero-bg.png'
import homeHeroImage from '../../assets/home-hero.png'
import monad2026HeroImage from '../../assets/monad-2026-hero.png'
import monadLogoImage from '../../assets/monad-logo.png'

export interface RouteSeoConfig {
  title: string
  description: string
  keywords: string
  imagePath: string
  imageAlt: string
}

export const SITE_NAME = 'MONAD'
export const DEFAULT_LOCALE = 'ko_KR'

const sharedKeywords = [
  'MONAD',
  '모나드',
  'AI',
  'SW',
  '학생 개발',
  '프로젝트',
  'DIMIGO',
].join(', ')

export const defaultSeoConfig: RouteSeoConfig = {
  title: 'MONAD | 학생 주도 AI·SW 커뮤니티',
  description:
    'MONAD는 학생 주도의 AI·SW 활동을 통해 프로젝트, 수상, 연구를 이어가는 커뮤니티입니다.',
  keywords: sharedKeywords,
  imagePath: homeHeroImage,
  imageAlt: 'MONAD 메인 비주얼',
}

const routeSeoConfigMap: Readonly<Record<string, RouteSeoConfig>> = {
  '/': defaultSeoConfig,
  '/achievements': {
    title: 'Achievements | MONAD',
    description:
      'MONAD 멤버들이 참여한 대회와 프로젝트 성과를 연도별로 확인할 수 있습니다.',
    keywords: `${sharedKeywords}, achievements, awards, 수상`,
    imagePath: achievementsHeroImage,
    imageAlt: 'MONAD Achievements 페이지 비주얼',
  },
  '/members': {
    title: 'Members | MONAD',
    description:
      'MONAD 멤버들의 소개, 역할, 기술 스택, 활동 이력을 확인할 수 있습니다.',
    keywords: `${sharedKeywords}, members, team, 멤버`,
    imagePath: monadLogoImage,
    imageAlt: 'MONAD Members 페이지 비주얼',
  },
  '/projects': {
    title: 'Projects | MONAD',
    description: 'MONAD의 연도별 프로젝트와 핵심 성과를 확인할 수 있습니다.',
    keywords: `${sharedKeywords}, projects, portfolio, 프로젝트`,
    imagePath: monadLogoImage,
    imageAlt: 'MONAD Projects 페이지 비주얼',
  },
  '/monad-2026': {
    title: 'MONAD 2026 | MONAD',
    description:
      'MONAD 2026 프로그램 소개, 교육 로드맵, 활동 구조와 FAQ를 확인할 수 있습니다.',
    keywords: `${sharedKeywords}, monad 2026, curriculum, 교육`,
    imagePath: monad2026HeroImage,
    imageAlt: 'MONAD 2026 페이지 비주얼',
  },
}

function normalizePathname(pathname: string): string {
  if (pathname === '/') {
    return pathname
  }

  return pathname.replace(/\/+$/, '')
}

export function getSeoConfigByPathname(pathname: string): RouteSeoConfig {
  const normalizedPathname = normalizePathname(pathname)
  return routeSeoConfigMap[normalizedPathname] ?? defaultSeoConfig
}
