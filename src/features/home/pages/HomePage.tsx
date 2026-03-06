// 홈 페이지 조립 컴포넌트입니다.
// 섹션 순서를 고정해 메인 랜딩 화면을 구성합니다.
import { memo } from 'react'
import { HeroSection } from '../sections/HeroSection/HeroSection'
import { MediaHighlightsSection } from '../sections/MediaHighlightsSection/MediaHighlightsSection'
import { PossibilitySection } from '../sections/PossibilitySection/PossibilitySection'
import { WhatIsMonadSection } from '../sections/WhatIsMonadSection/WhatIsMonadSection'
import styles from './HomePage.module.css'

export const HomePage = memo(function HomePage() {
  return (
    <article className={styles.page}>
      <HeroSection />
      <PossibilitySection />
      <WhatIsMonadSection />
      <MediaHighlightsSection />
    </article>
  )
})
