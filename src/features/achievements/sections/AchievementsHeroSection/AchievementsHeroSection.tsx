// 업적 페이지 상단 Hero 섹션입니다.
// 배경 이미지 위에 좌/우 통계 텍스트 블록을 배치합니다.
import { memo } from 'react'
import achievementsHeroBackground from '../../../../assets/achievements-hero-bg.png'
import { Container } from '../../../../core/layout/Container/Container'
import { HeroStatsBlock } from '../../components/HeroStatsBlock/HeroStatsBlock'
import styles from './AchievementsHeroSection.module.css'

interface AchievementsHeroSectionProps {
  leftPrimary: string
  leftSecondary: string
  rightPrimary: string
  rightSecondary: string
}

export const AchievementsHeroSection = memo(function AchievementsHeroSection({
  leftPrimary,
  leftSecondary,
  rightPrimary,
  rightSecondary,
}: AchievementsHeroSectionProps) {
  return (
    <section className={styles.section} aria-label="Achievements hero">
      <img
        src={achievementsHeroBackground}
        alt="Achievements hero"
        className={styles.backgroundImage}
      />

      <div className={styles.fadeOverlay} />

      <Container>
        <div className={styles.statsRow}>
          <HeroStatsBlock
            primary={leftPrimary}
            secondary={leftSecondary}
            align="left"
          />
          <HeroStatsBlock
            primary={rightPrimary}
            secondary={rightSecondary}
            align="right"
          />
        </div>
      </Container>
    </section>
  )
})
