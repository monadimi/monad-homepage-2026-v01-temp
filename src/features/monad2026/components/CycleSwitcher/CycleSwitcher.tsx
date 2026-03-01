// 순환 키워드 문구를 보여주는 컴포넌트입니다.
import { memo } from 'react'
import type { CycleItem } from '../../data/cycleData'
import styles from './CycleSwitcher.module.css'

interface CycleSwitcherProps {
  items: readonly CycleItem[]
  currentIndex: number
}

export const CycleSwitcher = memo(function CycleSwitcher({
  items,
  currentIndex,
}: CycleSwitcherProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.statement}>
        모나드는
        <span className={styles.wordSlot}>
          {items.map((item, index) => (
            <span
              key={item.key}
              className={`${styles.word} ${index === currentIndex ? styles.wordActive : ''}`}
            >
              [{item.label}]
            </span>
          ))}
        </span>
        이 필요합니다.
      </p>

      <p className={styles.description}>{items[currentIndex].description}</p>
    </div>
  )
})
