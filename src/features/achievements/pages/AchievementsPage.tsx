// Achievements 페이지 조립 컴포넌트입니다.
// 연도 상태를 기준으로 Hero/연도 선택기/그리드를 연결합니다.
import { memo, useMemo, useState } from 'react'
import { AwardsRepository } from '../data/awards'
import { AwardsGridSection } from '../sections/AwardsGridSection/AwardsGridSection'
import { AchievementsHeroSection } from '../sections/AchievementsHeroSection/AchievementsHeroSection'
import { YearSelectorSection } from '../sections/YearSelectorSection/YearSelectorSection'
import styles from './AchievementsPage.module.css'

const availableYears = AwardsRepository.getAvailableYears()

export const AchievementsPage = memo(function AchievementsPage() {
  // 현재 선택 연도 상태
  const [year, setYear] = useState<number>(AwardsRepository.getDefaultYear())

  // 선택 연도에 맞는 카드 데이터
  const awards = useMemo(() => AwardsRepository.getAwardsByYear(year), [year])

  const canGoPrev = AwardsRepository.hasPreviousYear(year)
  const canGoNext = AwardsRepository.hasNextYear(year)

  const handlePreviousYear = () => {
    const nextYear = AwardsRepository.getPreviousYear(year)

    if (nextYear !== null) {
      setYear(nextYear)
    }
  }

  const handleNextYear = () => {
    const nextYear = AwardsRepository.getNextYear(year)

    if (nextYear !== null) {
      setYear(nextYear)
    }
  }

  return (
    <article className={styles.page}>
      <AchievementsHeroSection
        leftPrimary="11 AWARDS"
        leftSecondary="OVER 2 YEARS"
        rightPrimary="₩100,000,000"
        rightSecondary="TOTAL EARN"
      />

      <YearSelectorSection
        year={year}
        availableYears={availableYears}
        canGoPrevious={canGoPrev}
        canGoNext={canGoNext}
        onPrevious={handlePreviousYear}
        onNext={handleNextYear}
      />

      <AwardsGridSection awards={awards} />
    </article>
  )
})
