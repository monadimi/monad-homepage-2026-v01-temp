// 공통 헤더입니다.
// 데스크톱은 가로 메뉴, 모바일은 햄버거 메뉴를 사용합니다.
import { memo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Container } from '../Container/Container'
import { NavigationService } from '../../navigation/NavigationService'
import styles from './Header.module.css'

const navItems = NavigationService.getNavItems()

// 데스크톱 링크 클래스 계산
function getDesktopNavLinkClassName(isActive: boolean): string {
  return `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
}

// 모바일 링크 클래스 계산
function getMobileNavLinkClassName(isActive: boolean): string {
  return `${styles.mobileNavLink} ${isActive ? styles.navLinkActive : ''}`.trim()
}

export const Header = memo(function Header() {
  // 모바일 메뉴 열림 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.hamburgerButton}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-global-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span
              className={`${styles.menuLine} ${styles.menuLineTop} ${
                isMenuOpen ? styles.menuLineTopOpen : ''
              }`}
            />
            <span
              className={`${styles.menuLine} ${styles.menuLineMiddle} ${
                isMenuOpen ? styles.menuLineMiddleOpen : ''
              }`}
            />
            <span
              className={`${styles.menuLine} ${styles.menuLineBottom} ${
                isMenuOpen ? styles.menuLineBottomOpen : ''
              }`}
            />
          </button>

          <nav className={styles.desktopNavigation} aria-label="Global navigation">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.key} className={styles.navItem}>
                  <NavLink
                    to={item.path}
                    end={item.isHome}
                    className={({ isActive }) => getDesktopNavLinkClassName(isActive)}
                  >
                    {item.navLabel}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
      >
        <Container>
          <nav
            id="mobile-global-navigation"
            className={styles.mobileNavigation}
            aria-label="Mobile navigation"
          >
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li key={`mobile-${item.key}`} className={styles.mobileNavItem}>
                  <NavLink
                    to={item.path}
                    end={item.isHome}
                    className={({ isActive }) => getMobileNavLinkClassName(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.navLabel}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  )
})
