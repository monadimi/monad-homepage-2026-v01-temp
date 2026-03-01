// "모나드는 [웹플]이 필요합니다." 정적 소개 섹션입니다.
import { memo } from 'react'
import { CycleCard } from '../../components/CycleCard/CycleCard'
import { GraySvgLogo } from '../../components/GraySvgLogo/GraySvgLogo'
import { cycleItems } from '../../data/cycleData'
import styles from './CycleDynamicSection.module.css'

const fixedItem = cycleItems[0]

export const CycleDynamicSection = memo(function CycleDynamicSection() {
  return (
    <section className={styles.section} aria-label="모나드는 웹플이 필요합니다">
      <div className={styles.layout}>
        <div className={styles.copyArea}>
          <p className={styles.statement}>
            모나드는
            <br />
            <span className={styles.highlight}>[웹플]</span>이 필요합니다.
          </p>
          <p className={styles.description}>
            개발과 기획을 넘나들며 혼자서도 끝까지 구현할 수 있는 힘을 키우는 교육
            사이클을 운영합니다.
          </p>
        </div>

        <div className={styles.cardArea}>
          <GraySvgLogo />
          <div className={styles.cardStack}>
            <CycleCard card={fixedItem.cards[0]} />
            <CycleCard card={fixedItem.cards[1]} />
          </div>
        </div>
      </div>
    </section>
  )
})
