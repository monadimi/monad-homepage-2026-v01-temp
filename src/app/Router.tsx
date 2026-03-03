// 앱 공통 레이아웃과 라우팅을 연결하는 파일입니다.
import { memo, useEffect } from 'react'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom'
import { Footer } from '../core/layout/Footer/Footer'
import { Header } from '../core/layout/Header/Header'
import {
  NavigationService,
  type NavigableRoute,
} from '../core/navigation/NavigationService'
import { SeoHeadManager } from '../core/seo/SeoHeadManager'
import { AchievementsPage } from '../features/achievements/pages/AchievementsPage'
import { ComingSoonPage } from '../features/common/pages/ComingSoonPage'
import { HomePage } from '../features/home/pages/HomePage'
import { MembersPage } from '../features/members/pages/MembersPage'
import { Monad2026Page } from '../features/monad2026/pages/Monad2026Page'
import { ProjectsPage } from '../features/projects/pages/ProjectsPage'
import styles from './Router.module.css'

// 페이지 전환 시 이전 스크롤 위치를 유지하지 않고 항상 최상단으로 이동시킵니다.
const ScrollTopOnRouteChange = memo(function ScrollTopOnRouteChange() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
})

// 모든 페이지에서 재사용되는 공통 셸입니다.
const AppLayout = memo(function AppLayout() {
  return (
    <div className={styles.appShell}>
      <SeoHeadManager />
      <ScrollTopOnRouteChange />
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
})

const homeRoute = NavigationService.getHomeRoute()
const nonHomeRoutes = NavigationService.getContentRoutes()

// 네비게이션 정의를 기준으로 라우트를 생성해 경로 관리 지점을 단일화합니다.
const routeChildren = [
  {
    index: true,
    element: homeRoute ? <HomePage /> : <ComingSoonPage title="Home" />,
  },
  ...nonHomeRoutes.map((route: NavigableRoute) => {
    if (route.key === 'achievements') {
      return {
        path: route.segment,
        element: <AchievementsPage />,
      }
    }

    if (route.key === 'members') {
      return {
        path: route.segment,
        element: <MembersPage />,
      }
    }

    if (route.key === 'monad2026') {
      return {
        path: route.segment,
        element: <Monad2026Page />,
      }
    }

    if (route.key === 'projects') {
      return {
        path: route.segment,
        element: <ProjectsPage />,
      }
    }

    return {
      path: route.segment,
      element: <ComingSoonPage title={route.pageTitle} />,
    }
  }),
]

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routeChildren,
  },
])

// RouterProvider는 앱에서 단 한 번만 마운트합니다.
export const Router = memo(function Router() {
  return <RouterProvider router={browserRouter} />
})
