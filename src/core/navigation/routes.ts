// 앱 전역 라우트 메타데이터입니다.
// Header 표시 라벨과 실제 경로를 함께 관리합니다.
import { text } from '../../content/text/textService'
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
    navLabel: text('global', 'nav.home', 'Home'),
    pageTitle: text('global', 'page.home', 'MONAD'),
    isHome: true,
    showInNavigation: true,
  },
  {
    key: 'achievements',
    path: '/achievements',
    segment: 'achievements',
    navLabel: text('global', 'nav.achievements', 'Achievements'),
    pageTitle: text('global', 'page.achievements', 'Achievements'),
    isHome: false,
    showInNavigation: true,
  },
  {
    key: 'members',
    path: '/members',
    segment: 'members',
    navLabel: text('global', 'nav.members', 'Members'),
    pageTitle: text('global', 'page.members', 'Members'),
    isHome: false,
    showInNavigation: true,
  },
  {
    key: 'projects',
    path: '/projects',
    segment: 'projects',
    navLabel: text('global', 'nav.projects', 'Projects'),
    pageTitle: text('global', 'page.projects', 'Projects'),
    isHome: false,
    showInNavigation: true,
  },
  {
    key: 'monad2026',
    path: '/monad-2026',
    segment: 'monad-2026',
    navLabel: text('global', 'nav.monad2026', 'MONAD 2026'),
    pageTitle: text('global', 'page.monad2026', 'MONAD 2026'),
    isHome: false,
    showInNavigation: true,
  },
] as const
