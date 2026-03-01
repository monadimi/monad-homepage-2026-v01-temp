// 사이클 섹션에서 사용하는 카드 컴포넌트입니다.
import { memo } from 'react'
import type { CycleCardData } from '../../data/cycleData'
import styles from './CycleCard.module.css'

interface CycleCardProps {
  card: CycleCardData
}

export const CycleCard = memo(function CycleCard({ card }: CycleCardProps) {
  return (
    <article className={styles.card}>
      <img
        src={card.image}
        alt={card.title}
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.overlay} />
      <div className={styles.copy}>
        <p className={styles.title}>{card.title}</p>
        <p className={styles.subtitle}>{card.subtitle}</p>
      </div>
    </article>
  )
})
