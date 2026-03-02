// "모나드는 [웹플]이 필요합니다." 소개 섹션입니다.
import { memo } from 'react'
import needCardAImage from '../../../../assets/monad-2026-activity-gray-a.svg'
import needCardBImage from '../../../../assets/monad-2026-activity-gray-b.svg'
import { CycleCard } from '../../components/CycleCard/CycleCard'
import type { CycleCardData } from '../../data/cycleData'
import styles from './CycleDynamicSection.module.css'

const needCards: readonly CycleCardData[] = [
  {
    id: 'need-card-a',
    title: '좋은 점 1',
    subtitle:
      '모나드는 세계 최고 동아리이기 때문에 어쩌고 저쩌고 이래서 웹플에게 좋습니다. 모나드는 세계 최고 동아리이기 때문에 어쩌고 저쩌고 이래서 웹플에게 좋습니다.',
    image: needCardAImage,
  },
  {
    id: 'need-card-b',
    title: '좋은 점 1',
    subtitle:
      '모나드는 세계 최고 동아리이기 때문에 어쩌고 저쩌고 이래서 웹플에게 좋습니다. 모나드는 세계 최고 동아리이기 때문에 어쩌고 저쩌고 이래서 웹플에게 좋습니다.',
    image: needCardBImage,
  },
]

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
        </div>

        <div className={styles.cardArea}>
          {needCards.map((card) => (
            <CycleCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
})
