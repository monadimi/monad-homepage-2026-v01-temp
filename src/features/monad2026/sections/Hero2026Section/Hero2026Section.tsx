// MONAD 2026 히어로 섹션입니다.
import { memo } from 'react'
import heroImage from '../../../../assets/monad-2026-hero.png'
import { text } from '../../../../content/text/textService'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './Hero2026Section.module.css'

interface Hero2026SectionProps {
  onApplyClick?: () => void
}

export const Hero2026Section = memo(function Hero2026Section({
  onApplyClick,
}: Hero2026SectionProps) {
  const title = text('monad2026', 'hero.title', 'We need you.')
  const subtitle = text(
    'monad2026',
    'hero.subtitle',
    '모나드의 최초가 될 1기를 모집합니다.',
  )
  const ctaLabel = text('monad2026', 'hero.cta', '지원하기')

  return (
    <section className={styles.section} aria-label="Monad 2026 hero">
      <img className={styles.backgroundImage} src={heroImage} alt="MONAD 2026 hero" />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <CTAButton
          label={ctaLabel}
          variant="outline"
          analyticsEvent="apply_click"
          analyticsContext="monad2026_hero"
          onClick={onApplyClick}
        />
      </div>
    </section>
  )
})
