// 공통 헤더입니다.
// 데스크톱은 가로 메뉴, 모바일은 햄버거 메뉴를 사용합니다.
import { memo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import monadLogoWithText from '../../../assets/monad-logo-wtxt.png'
import { text } from '../../../content/text/textService'
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
  const homeAriaLabel = text('global', 'header.homeAria', 'Go to MONAD home')
  const menuToggleAriaLabel = text(
    'global',
    'header.menuToggleAria',
    'Toggle navigation menu',
  )
  const desktopNavAriaLabel = text('global', 'header.desktopNavAria', 'Global navigation')
  const mobileNavAriaLabel = text('global', 'header.mobileNavAria', 'Mobile navigation')

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerInner}>
          {/* 모바일 전용 좌측 브랜드 로고입니다. */}
          <NavLink
            to="/"
            end
            className={styles.mobileBrandLink}
            aria-label={homeAriaLabel}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={monadLogoWithText} alt="MONAD" className={styles.mobileBrandImage} />
          </NavLink>

          <button
            type="button"
            className={styles.hamburgerButton}
            aria-label={menuToggleAriaLabel}
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

          <nav className={styles.desktopNavigation} aria-label={desktopNavAriaLabel}>
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
            aria-label={mobileNavAriaLabel}
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
