// "가능성을 연결하다" 비디오 섹션입니다.
import { memo } from 'react'
import sectionVideo from '../../../../assets/section1.mp4'
import { VideoBackground } from '../../components/VideoBackground/VideoBackground'
import styles from './PossibilitySection.module.css'

export const PossibilitySection = memo(function PossibilitySection() {
  return (
    <section className={styles.section} aria-label="가능성을 연결하다">
      <VideoBackground src={sectionVideo} ariaLabel="가능성을 연결하다 section video" />
    </section>
  )
})
