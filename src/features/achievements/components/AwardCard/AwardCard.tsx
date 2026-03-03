// 개별 업적 카드 컴포넌트입니다.
// 호버 시 "더 알아보기"를 노출하고 클릭으로 상세 모달을 여는 트리거 카드입니다.
import { memo } from 'react'
import { text } from '../../../../content/text/textService'
import type { Award } from '../../data/awards'
import styles from './AwardCard.module.css'

interface AwardCardProps {
  award: Award
  onOpenDetails: (award: Award) => void
}

export const AwardCard = memo(function AwardCard({
  award,
  onOpenDetails,
}: AwardCardProps) {
  const detailAriaSuffix = text(
    'achievements',
    'awardCard.detailAriaSuffix',
    '상세 보기',
  )
  const moreLabel = text('achievements', 'awardCard.moreLabel', '더 알아보기')

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.cardButton}
        aria-label={`${award.title} ${detailAriaSuffix}`}
        onClick={() => onOpenDetails(award)}
      >
        <div className={styles.visualLayer}>
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
        </div>

        <div className={styles.hoverOverlay} aria-hidden="true">
          <span className={styles.moreText}>{moreLabel}</span>
        </div>
      </button>
    </article>
  )
})
