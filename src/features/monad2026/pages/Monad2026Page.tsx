// MONAD 2026 페이지를 조립하는 루트 컴포넌트입니다.
import { memo } from 'react'
import { Hero2026Section } from '../sections/Hero2026Section/Hero2026Section'
import { ITIntroSection } from '../sections/ITIntroSection/ITIntroSection'
import { SwAiIntroSection } from '../sections/SwAiIntroSection/SwAiIntroSection'
import { ProofSection } from '../sections/ProofSection/ProofSection'
import { EducationSection } from '../sections/EducationSection/EducationSection'
import { CycleDynamicSection } from '../sections/CycleDynamicSection/CycleDynamicSection'
import { ActivitySection } from '../sections/ActivitySection/ActivitySection'
import { JoinEndSection } from '../sections/JoinEndSection/JoinEndSection'
import { FaqSection } from '../sections/FaqSection/FaqSection'
import styles from './Monad2026Page.module.css'

export const Monad2026Page = memo(function Monad2026Page() {
  return (
    <article className={styles.page}>
      <div className={styles.pageInner}>
        <Hero2026Section />
        <ITIntroSection />
        <SwAiIntroSection />
        <ProofSection />
        <EducationSection />
        <CycleDynamicSection />
        <ActivitySection />
        <JoinEndSection />
        <FaqSection />
      </div>
    </article>
  )
})
