import { appRoutes, type AppRouteDefinition } from './routes'

export type NavigableRoute = AppRouteDefinition & { segment: string }

// 라우트 접근을 캡슐화한 서비스 클래스입니다.
// 컴포넌트는 이 클래스를 통해서만 라우트 정보를 읽습니다.
export class NavigationService {
  public static getRoutes(): readonly AppRouteDefinition[] {
    return appRoutes
  }

  public static getNavItems(): readonly AppRouteDefinition[] {
    return appRoutes.filter((route) => route.showInNavigation)
  }

  public static getHomeRoute(): AppRouteDefinition | undefined {
    return appRoutes.find((route) => route.isHome)
  }

  public static getContentRoutes(): readonly NavigableRoute[] {
    return appRoutes.filter(
      (route): route is NavigableRoute => !route.isHome && route.segment !== null,
    )
  }
}
