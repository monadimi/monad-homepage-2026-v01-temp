// 교육 파트 소개 섹션입니다.
import { memo } from 'react'
import hackathonVisual from '../../../../assets/hackathon.png'
import mentorVisual from '../../../../assets/mentor.png'
import { text } from '../../../../content/text/textService'
import { GraySvgLogo } from '../../components/GraySvgLogo/GraySvgLogo'
import styles from './EducationSection.module.css'

export const EducationSection = memo(function EducationSection() {
  const firstTitleAccent = text('monad2026', 'education.first.titleAccent', '멘토 멘티')
  const firstTitleSuffix = text('monad2026', 'education.first.titleSuffix', '로 배웁니다.')
  const firstDescription = text(
    'monad2026',
    'education.first.description',
    '저희는 서로 멘토와 멘티로 어쩌고 저쩌고 저희는 서로 멘토와 멘티로 어쩌고 저쩌고 저희는 서로 멘토와 멘티로 어쩌고 저쩌고.',
  )
  const secondTitleAccent = text('monad2026', 'education.second.titleAccent', '해커톤')
  const secondTitleSuffix = text('monad2026', 'education.second.titleSuffix', '을 진행합니다.')
  const secondDescription = text(
    'monad2026',
    'education.second.description',
    '저희는 해커톤을 진행해서 어쩌고 저쩌고 저희는 해커톤을 진행해서 어쩌고 저쩌고 저희는 해커톤을 진행해서 어쩌고 저쩌고.',
  )

  return (
    <section className={styles.section} aria-label="교육 활동">
      <div className={styles.layout}>
        <article className={styles.card}>
          <div className={styles.mediaWrap}>
            <img src={mentorVisual} alt="멘토 멘티 교육" loading="lazy" />
          </div>
          <div className={styles.copy}>
            <h3 className={styles.headline}>
              <span className={styles.accent}>{firstTitleAccent}</span>
              {firstTitleSuffix}
            </h3>
            <p className={styles.description}>{firstDescription}</p>
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
            <img src={hackathonVisual} alt="해커톤 활동" loading="lazy" />
          </div>
          <div className={styles.copy}>
            <h3 className={styles.headline}>
              <span className={styles.accent}>{secondTitleAccent}</span>
              {secondTitleSuffix}
            </h3>
            <p className={styles.description}>{secondDescription}</p>
          </div>
        </article>
      </div>
    </section>
  )
})
