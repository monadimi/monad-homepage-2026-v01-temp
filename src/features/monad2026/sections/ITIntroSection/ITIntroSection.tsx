// IT 중심 동아리 소개 섹션입니다.
import { memo } from 'react'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import styles from './ITIntroSection.module.css'

export const ITIntroSection = memo(function ITIntroSection() {
  return (
    <section className={styles.section} aria-label="IT 중심 동아리">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <SectionTitle text="IT 중심 동아리" />
          <p className={styles.description}>
            실무에 가까운 개발 과정을 경험하며 문제를 구조적으로 해결하는 힘을 기릅니다.
          </p>
        </div>
        <div className={styles.mediaBox} aria-hidden="true" />
      </div>
    </section>
  )
})
