// 앱 전역 라우트 메타데이터입니다.
// Header 표시 라벨과 실제 경로를 함께 관리합니다.
export type AppRouteKey =
  | 'home'
  | 'achievements'
  | 'members'
  | 'projects'
  | 'monad2026'

export interface AppRouteDefinition {
  key: AppRouteKey
  path: string
  segment: string | null
  navLabel: string
  pageTitle: string
  isHome: boolean
  showInNavigation: boolean
}

export const appRoutes: readonly AppRouteDefinition[] = [
  {
    key: 'home',
    path: '/',
    segment: null,
    navLabel: 'Home',
    pageTitle: 'Home',
    isHome: true,
    showInNavigation: true,
  },
  {
    key: 'achievements',
    path: '/achievements',
    segment: 'achievements',
    navLabel: 'Achievements',
    pageTitle: 'Achievements',
    isHome: false,
    showInNavigation: true,
  },
  {
    key: 'members',
    path: '/members',
    segment: 'members',
    navLabel: 'Members',
    pageTitle: 'Members',
    isHome: false,
    showInNavigation: true,
  },
  {
    key: 'projects',
    path: '/projects',
    segment: 'projects',
    navLabel: 'Projects',
    pageTitle: 'Projects',
    isHome: false,
    showInNavigation: true,
  },
  {
    key: 'monad2026',
    path: '/monad-2026',
    segment: 'monad-2026',
    navLabel: 'MONAD 2026',
    pageTitle: 'MONAD 2026',
    isHome: false,
    showInNavigation: true,
  },
] as const
