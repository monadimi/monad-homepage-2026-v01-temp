// 업적 카드 그리드 섹션입니다.
// 전달받은 카드 목록을 4열 기준 그리드로 렌더링합니다.
import { memo } from 'react'
import { Container } from '../../../../core/layout/Container/Container'
import type { Award } from '../../data/awards'
import { AwardCard } from '../../components/AwardCard/AwardCard'
import styles from './AwardsGridSection.module.css'

interface AwardsGridSectionProps {
  awards: readonly Award[]
}

export const AwardsGridSection = memo(function AwardsGridSection({
  awards,
}: AwardsGridSectionProps) {
  return (
    <section className={styles.section} aria-label="Awards grid">
      <Container>
        <div className={styles.grid}>
          {awards.map((award) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      </Container>
    </section>
  )
})
