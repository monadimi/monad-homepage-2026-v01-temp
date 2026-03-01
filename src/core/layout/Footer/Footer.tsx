// 공통 푸터입니다.
// 홈/업적 페이지 모두 동일한 컴포넌트를 재사용합니다.
import { memo } from 'react'
import dimigoLogo from '../../../assets/dimigo.png'
import { MonadLogo } from '../../../features/home/components/MonadLogo/MonadLogo'
import {
  HomeContentModel,
  type SocialIconItem,
} from '../../../features/home/models/HomeContentModel'
import { Container } from '../Container/Container'
import { SocialIconBar } from '../../../features/home/components/SocialIconBar/SocialIconBar'
import styles from './Footer.module.css'

const footerIcons: readonly SocialIconItem[] = HomeContentModel.getSocialIcons()

export const Footer = memo(function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerInner}>
          <div className={styles.leftColumn}>
            <img src={dimigoLogo} alt="Dimigo" className={styles.dimigoLogo} />
          </div>

          <div className={styles.centerColumn}>
            <MonadLogo variant="footerMark" />
            <p className={styles.copyright}>
              {HomeContentModel.getFooterCopyright()}
            </p>
          </div>

          <div className={styles.rightColumn}>
            <a href="#" className={styles.cookieLink}>
              {HomeContentModel.footerCookieLabel}
            </a>
            <SocialIconBar items={footerIcons} variant="compact" />
          </div>
        </div>
      </Container>
    </footer>
  )
})
