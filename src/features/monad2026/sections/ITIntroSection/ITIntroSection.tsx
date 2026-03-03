// IT 중심 동아리 소개 섹션입니다.
import { memo } from 'react'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import styles from './ITIntroSection.module.css'

interface ITIntroSectionProps {
  dock?: 'left' | 'right' | 'center'
}

export const ITIntroSection = memo(function ITIntroSection({
  dock = 'center',
}: ITIntroSectionProps) {
  const dockClassName =
    dock === 'right' ? styles.dockRight : dock === 'left' ? styles.dockLeft : styles.dockCenter

  return (
    <section className={`${styles.section} ${dockClassName}`.trim()} aria-label="IT 중심 동아리">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <SectionTitle text="IT 중심 동아리" />
          <p className={styles.description}>
            우리는 기획보다는 IT에 더 집중합니다. 우리는 기획보다는 IT에 더 집중합니다.
            우리는 기획보다는 IT에 더 집중합니다. 우리는 기획보다는 IT에 더 집중합니다.
          </p>
        </div>
        <div className={styles.mediaBox} aria-hidden="true" />
      </div>
    </section>
  )
})
