// Hero 좌/우 통계 텍스트 블록입니다.
// 정렬 방향만 props로 바꿔 재사용합니다.
import { memo } from 'react'
import styles from './HeroStatsBlock.module.css'

type HeroStatsAlignment = 'left' | 'right'

interface HeroStatsBlockProps {
  primary: string
  secondary: string
  align: HeroStatsAlignment
}

export const HeroStatsBlock = memo(function HeroStatsBlock({
  primary,
  secondary,
  align,
}: HeroStatsBlockProps) {
  return (
    <div className={`${styles.block} ${align === 'right' ? styles.right : styles.left}`}>
      <p className={styles.primary}>{primary}</p>
      <p className={styles.secondary}>{secondary}</p>
    </div>
  )
})
