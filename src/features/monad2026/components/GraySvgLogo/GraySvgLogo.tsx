// 그레이 톤 SVG 로고 컴포넌트입니다.
// stroke 색상은 테마 토큰으로 제어합니다.
import { memo } from 'react'
import styles from './GraySvgLogo.module.css'

export const GraySvgLogo = memo(function GraySvgLogo() {
  return (
    <svg
      className={styles.logo}
      viewBox="0 0 160 160"
      aria-label="Gray Monad logo"
      role="img"
    >
      <g className={styles.logoStroke}>
        <path d="M52 28L112 60V138H88V74L48 52L28 84V138H52V96L14 74L28 46" />
        <path d="M86 30L112 16L128 36L102 50" />
        <circle cx="80" cy="16" r="12" />
        <circle cx="24" cy="96" r="12" />
        <circle cx="122" cy="96" r="12" />
      </g>
    </svg>
  )
})
