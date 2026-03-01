// 연도 선택 섹션입니다.
// 실제 조작 UI는 YearNavigator 컴포넌트를 재사용합니다.
import { memo } from 'react'
import { Container } from '../../../../core/layout/Container/Container'
import { YearNavigator } from '../../components/YearNavigator/YearNavigator'
import styles from './YearSelectorSection.module.css'

interface YearSelectorSectionProps {
  year: number
  availableYears: readonly number[]
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
}

export const YearSelectorSection = memo(function YearSelectorSection({
  year,
  availableYears,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: YearSelectorSectionProps) {
  return (
    <section className={styles.section} aria-label="Year selector">
      <Container>
        <div className={styles.content}>
          <YearNavigator
            year={year}
            canGoPrevious={canGoPrevious && availableYears.length > 1}
            canGoNext={canGoNext && availableYears.length > 1}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
      </Container>
    </section>
  )
})
