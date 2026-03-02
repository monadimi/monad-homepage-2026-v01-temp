// MONAD 2026 히어로 섹션입니다.
import { memo } from 'react'
import heroImage from '../../../../assets/2026hero.png'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './Hero2026Section.module.css'

export const Hero2026Section = memo(function Hero2026Section() {
  return (
    <section className={styles.section} aria-label="Monad 2026 hero">
      <img className={styles.backgroundImage} src={heroImage} alt="MONAD 2026 hero" />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>We need you.</h1>
        <p className={styles.subtitle}>모나드의 최초가 될 1기를 모집합니다.</p>
        <CTAButton label="지원하기" variant="outline" />
      </div>
    </section>
  )
})
