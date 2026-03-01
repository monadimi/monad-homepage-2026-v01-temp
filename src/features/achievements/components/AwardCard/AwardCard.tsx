// 개별 업적 카드 컴포넌트입니다.
// 이미지, 하단 그라디언트, 텍스트 정보를 카드 내부에 고정 배치합니다.
import { memo } from 'react'
import type { Award } from '../../data/awards'
import styles from './AwardCard.module.css'

interface AwardCardProps {
  award: Award
}

export const AwardCard = memo(function AwardCard({ award }: AwardCardProps) {
  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={award.image}
        alt={award.title}
        loading="lazy"
      />
      <div className={styles.gradientOverlay} />
      <div className={styles.textContent}>
        <p className={styles.title}>{award.title}</p>
        <p className={styles.highlight}>{award.highlight}</p>
        <p className={styles.subtitle}>{award.subtitle}</p>
      </div>
    </article>
  )
})
