// 랜딩 상단 Hero 이미지 섹션입니다.
import { memo } from 'react'
import heroImage from '../../../../assets/hero.png'
import styles from './HeroSection.module.css'

export const HeroSection = memo(function HeroSection() {
  return (
    <section className={styles.section} aria-label="Monad hero">
      <img src={heroImage} alt="Monad hero artwork" className={styles.heroImage} />
    </section>
  )
})
