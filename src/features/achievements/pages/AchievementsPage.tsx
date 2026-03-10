// Achievements 페이지 조립 컴포넌트입니다.
// 연도 상태를 기준으로 Hero/연도 선택기/그리드를 연결합니다.
import { memo, useEffect, useMemo, useState } from 'react'
import { text, textFormat } from '../../../content/text/textService'
import { Container } from '../../../core/layout/Container/Container'
import { AwardsRepository } from '../data/awards'
import { AwardsGridSection } from '../sections/AwardsGridSection/AwardsGridSection'
import { AchievementsHeroSection } from '../sections/AchievementsHeroSection/AchievementsHeroSection'
import { YearSelectorSection } from '../sections/YearSelectorSection/YearSelectorSection'
import styles from './AchievementsPage.module.css'

const availableYears = AwardsRepository.getAvailableYears()
const COVERAGE_START_YEAR = 2025
const COVERAGE_START_MONTH_INDEX = 8 // September (0-indexed)

function getElapsedYearsSinceCoverageStart(now: Date): number {
  const elapsedMonths =
    (now.getFullYear() - COVERAGE_START_YEAR) * 12 +
    (now.getMonth() - COVERAGE_START_MONTH_INDEX)
  const normalizedElapsedMonths = Math.max(elapsedMonths, 0)
  const elapsedYears = normalizedElapsedMonths / 12
  return Math.floor(elapsedYears * 10) / 10
}

export const AchievementsPage = memo(function AchievementsPage() {
  // 현재 선택 연도 상태
  const [year, setYear] = useState<number>(AwardsRepository.getDefaultYear())
  // TOTAL EARN 숫자 카운트업 애니메이션 값
  const [animatedTotalEarn, setAnimatedTotalEarn] = useState(0)

  // 선택 연도에 맞는 카드 데이터
  const awards = useMemo(() => AwardsRepository.getAwardsByYear(year), [year])
  // 전체 수상 카드 개수
  const totalAwardsCount = useMemo(
    () => AwardsRepository.getTotalAwardsCount(),
    [],
  )
  // 2025년 9월부터 경과한 연 수를 계산한 뒤, 소수점 첫째 자리에서 버림합니다.
  const coverageYearCount = useMemo(
    () => getElapsedYearsSinceCoverageStart(new Date()),
    [],
  )
  // 카드 데이터에 포함된 상금 전체 자동 합계
  const totalEarnAmount = useMemo(
    () => AwardsRepository.getTotalPrizeAmount(),
    [],
  )

  useEffect(() => {
    const animationDurationMs = 920
    const animationStartTime = performance.now()
    let animationFrameId = 0

    const animateCountUp = (now: number) => {
      const progress = Math.min(
        (now - animationStartTime) / animationDurationMs,
        1,
      )
      // 빠르게 올라가고 끝에서 부드럽게 멈추는 easing입니다.
      const easedProgress = 1 - (1 - progress) ** 3
      setAnimatedTotalEarn(Math.round(totalEarnAmount * easedProgress))

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animateCountUp)
      }
    }

    animationFrameId = window.requestAnimationFrame(animateCountUp)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [totalEarnAmount])

  const canGoPrev = AwardsRepository.hasPreviousYear(year)
  const canGoNext = AwardsRepository.hasNextYear(year)

  const formattedTotalEarn = `₩${animatedTotalEarn.toLocaleString('ko-KR')}`
  const formattedYearCoverage = textFormat(
    'achievements',
    'hero.coverageTemplate',
    { count: coverageYearCount.toFixed(1), suffix: coverageYearCount === 1 ? '' : 'S' },
    `OVER ${coverageYearCount.toFixed(1)} YEAR${coverageYearCount === 1 ? '' : 'S'}`,
  )
  const totalEarnLabel = text('achievements', 'hero.totalEarnLabel', 'TOTAL EARN')

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
        leftPrimary={`${totalAwardsCount} AWARDS`}
        leftSecondary={formattedYearCoverage}
        rightPrimary={formattedTotalEarn}
        rightSecondary={totalEarnLabel}
      />

      <Container>
        <p className={styles.disclaimer}>* 팀원 개인 수상 실적 제외</p>
      </Container>

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
