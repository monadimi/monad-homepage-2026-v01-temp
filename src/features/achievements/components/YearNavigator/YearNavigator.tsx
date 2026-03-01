// 연도 이전/다음 이동 UI입니다.
// 버튼 활성화 여부는 상위에서 전달받아 제어합니다.
import { memo } from 'react'
import styles from './YearNavigator.module.css'

interface YearNavigatorProps {
  year: number
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
}

export const YearNavigator = memo(function YearNavigator({
  year,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: YearNavigatorProps) {
  return (
    <div className={styles.navigator}>
      <button
        type="button"
        className={styles.arrowButton}
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous year"
      >
        ‹
      </button>

      <span className={styles.yearLabel}>{year}</span>

      <button
        type="button"
        className={styles.arrowButton}
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next year"
      >
        ›
      </button>
    </div>
  )
})
