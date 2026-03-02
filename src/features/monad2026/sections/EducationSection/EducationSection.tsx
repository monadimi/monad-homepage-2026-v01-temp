// 교육 파트 소개 섹션입니다.
import { memo } from 'react'
import educationVisual from '../../../../assets/monad-2026-activity-general.svg'
import { GraySvgLogo } from '../../components/GraySvgLogo/GraySvgLogo'
import styles from './EducationSection.module.css'

const educationDescription =
  '저희는 서로 멘토와 멘티로 어쩌고 저쩌고 저희는 서로 멘토와 멘티로 어쩌고 저쩌고 저희는 서로 멘토와 멘티로 어쩌고 저쩌고.'

const hackathonDescription =
  '저희는 해커톤을 진행해서 어쩌고 저쩌고 저희는 해커톤을 진행해서 어쩌고 저쩌고 저희는 해커톤을 진행해서 어쩌고 저쩌고.'

export const EducationSection = memo(function EducationSection() {
  return (
    <section className={styles.section} aria-label="교육 활동">
      <div className={styles.layout}>
        <article className={styles.card}>
          <div className={styles.mediaWrap}>
            <img src={educationVisual} alt="멘토 멘티 교육" loading="lazy" />
          </div>
          <div className={styles.copy}>
            <h3 className={styles.headline}>
              <span className={styles.accent}>멘토 멘티</span>로 배웁니다.
            </h3>
            <p className={styles.description}>{educationDescription}</p>
          </div>
        </article>

        <div className={styles.centerMark} aria-hidden="true">
          <div className={styles.logoScale}>
            <GraySvgLogo />
          </div>
          <p className={styles.centerLabel}>EDU</p>
        </div>

        <article className={styles.card}>
          <div className={styles.mediaWrap}>
            <img src={educationVisual} alt="해커톤 활동" loading="lazy" />
          </div>
          <div className={styles.copy}>
            <h3 className={styles.headline}>
              <span className={styles.accent}>해커톤</span>을 진행합니다.
            </h3>
            <p className={styles.description}>{hackathonDescription}</p>
          </div>
        </article>
      </div>
    </section>
  )
})
