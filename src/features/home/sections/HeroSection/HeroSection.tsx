// 랜딩 상단 Hero 비디오 섹션입니다.
import { memo } from 'react'
import heroVideo from '../../../../assets/hero.mp4'
import styles from './HeroSection.module.css'

export const HeroSection = memo(function HeroSection() {
  return (
    <section className={styles.section} aria-label="Monad hero">
      <video
        className={styles.heroVideo}
        src={heroVideo}
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-label="Monad hero video"
      />
    </section>
  )
})
