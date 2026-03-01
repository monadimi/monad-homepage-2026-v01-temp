// MONAD 2026 페이지를 조립하는 루트 컴포넌트입니다.
import { memo } from 'react'
import { FaqSection } from '../sections/FaqSection/FaqSection'
import { Hero2026Section } from '../sections/Hero2026Section/Hero2026Section'
import { JoinEndSection } from '../sections/JoinEndSection/JoinEndSection'
import styles from './Monad2026Page.module.css'

export const Monad2026Page = memo(function Monad2026Page() {
  return (
    <article className={styles.page}>
      <div className={styles.pageInner}>
        <Hero2026Section />
        {/*
          요청에 따라 중간 소개/활동 섹션을 임시 주석 처리:
          <ITIntroSection />
          <SwAiIntroSection />
          <ProofSection />
          <ActivitySection />
        */}
        <JoinEndSection />
        <FaqSection />
      </div>
    </article>
  )
})
