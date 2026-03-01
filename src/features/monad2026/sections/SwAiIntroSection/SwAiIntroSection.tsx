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
            소프트웨어와 인공지능을 연결해 더 넓은 관점으로 프로젝트를 설계하고 실행합니다.
          </p>
        </div>
      </div>
    </section>
  )
})
