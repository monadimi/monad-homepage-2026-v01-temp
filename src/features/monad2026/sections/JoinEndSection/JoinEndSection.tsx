// 하단 Join Us 배경 섹션입니다.
import { memo } from 'react'
import joinImage from '../../../../assets/monad-2026-join-end.png'
import { text } from '../../../../content/text/textService'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './JoinEndSection.module.css'

interface JoinEndSectionProps {
  onApplyClick?: () => void
}

export const JoinEndSection = memo(function JoinEndSection({
  onApplyClick,
}: JoinEndSectionProps) {
  const title = text('monad2026', 'join.title', 'Join us.')
  const ctaLabel = text('monad2026', 'join.cta', '지원하기')

  return (
    <section className={styles.section} aria-label="Join end section">
      <img className={styles.backgroundImage} src={joinImage} alt="Join us background" />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <CTAButton
          label={ctaLabel}
          variant="outline"
          analyticsEvent="apply_click"
          analyticsContext="monad2026_join"
          onClick={onApplyClick}
        />
      </div>
    </section>
  )
})
