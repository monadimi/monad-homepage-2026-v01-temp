// 하단 Join Us 배경 섹션입니다.
import { memo } from 'react'
import joinImage from '../../../../assets/monad-2026-join-end.png'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './JoinEndSection.module.css'

interface JoinEndSectionProps {
  onApplyClick?: () => void
}

export const JoinEndSection = memo(function JoinEndSection({
  onApplyClick,
}: JoinEndSectionProps) {
  return (
    <section className={styles.section} aria-label="Join end section">
      <img className={styles.backgroundImage} src={joinImage} alt="Join us background" />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>Join us.</h2>
        <CTAButton label="지원하기" variant="outline" onClick={onApplyClick} />
      </div>
    </section>
  )
})
