// MONAD 로고 공통 컴포넌트입니다.
// 용도에 따라 section/footerMark 크기만 바꿔 재사용합니다.
import { memo } from 'react'
import logoImage from '../../../../assets/monad-logo.png'
import styles from './MonadLogo.module.css'

type MonadLogoVariant = 'section' | 'footerMark'

interface MonadLogoProps {
  variant?: MonadLogoVariant
}

const variantClassNameMap: Record<MonadLogoVariant, string> = {
  section: styles.section,
  footerMark: styles.footerMark,
}

export const MonadLogo = memo(function MonadLogo({
  variant = 'section',
}: MonadLogoProps) {
  return (
    <img
      src={logoImage}
      alt="Monad logo"
      className={`${styles.base} ${variantClassNameMap[variant]}`}
    />
  )
})
