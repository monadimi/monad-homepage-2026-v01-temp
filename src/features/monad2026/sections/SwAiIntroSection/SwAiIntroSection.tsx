// SW·AI 융합 동아리 소개 섹션입니다.
import { memo } from 'react'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import styles from './SwAiIntroSection.module.css'

export const SwAiIntroSection = memo(function SwAiIntroSection() {
  return (
    <section className={styles.section} aria-label="SW AI 융합 동아리">
      <div className={styles.grid}>
        <div className={styles.mediaBox} aria-hidden="true" />
        <div className={styles.copy}>
          <SectionTitle text="SW/AI 융합 동아리" />
          <p className={styles.description}>
            우리는 기획보다는 IT에 더 집중합니다. 우리는 기획보다는 IT에 더 집중합니다.
            우리는 기획보다는 IT에 더 집중합니다. 우리는 기획보다는 IT에 더 집중합니다.
          </p>
        </div>
      </div>
    </section>
  )
})
