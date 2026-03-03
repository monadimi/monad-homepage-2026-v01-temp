// "모나드는 [웹플]이 필요합니다." 소개 섹션입니다.
import { memo } from 'react'
import { CycleCard } from '../../components/CycleCard/CycleCard'
import { cycleItems } from '../../data/cycleData'
import styles from './CycleDynamicSection.module.css'

interface CycleDynamicSectionProps {
  activeIndex: number
}

function getSubjectParticle(word: string): '이' | '가' {
  const trimmedWord = word.trim()
  if (!trimmedWord) {
    return '이'
  }

  const lastCharacter = trimmedWord[trimmedWord.length - 1]
  const codePoint = lastCharacter.codePointAt(0)

  if (codePoint === undefined) {
    return '이'
  }

  // 한글 완성형(가~힣) 기준으로 종성 유무를 판단합니다.
  if (codePoint < 0xac00 || codePoint > 0xd7a3) {
    return '이'
  }

  const hasFinalConsonant = (codePoint - 0xac00) % 28 !== 0
  return hasFinalConsonant ? '이' : '가'
}

export const CycleDynamicSection = memo(function CycleDynamicSection({
  activeIndex,
}: CycleDynamicSectionProps) {
  const boundedIndex = Math.max(0, Math.min(cycleItems.length - 1, activeIndex))
  const cycle = cycleItems[boundedIndex]
  const particle = getSubjectParticle(cycle.label)

  return (
    <section className={styles.section} aria-label="모나드는 순환 포지션이 필요합니다">
      <div className={styles.layout}>
        <div className={styles.copyArea}>
          <p className={styles.statement}>
            모나드는
            <span className={styles.wordSlot} aria-live="polite">
              <span
                className={styles.wordTrack}
                style={{
                  transform: `translateY(-${boundedIndex * 25}%)`,
                }}
              >
                {cycleItems.map((item) => (
                  <span key={item.key} className={styles.word}>
                    {item.label}
                  </span>
                ))}
              </span>
            </span>
            {particle} 필요합니다.
          </p>
          <p className={styles.description}>{cycle.description}</p>
        </div>

        <div className={styles.cardViewport}>
          <div
            className={styles.cardTrack}
            style={{
              transform: `translateX(-${boundedIndex * 25}%)`,
            }}
          >
            {cycleItems.map((item) => (
              <div key={item.key} className={styles.cardSlide}>
                {item.cards.map((card) => (
                  <CycleCard key={card.id} card={card} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})
