// "what is MONAD?" 소개 섹션입니다.
// 좌측 제목, 중앙 로고, 우측 설명 텍스트를 3열로 배치합니다.
import { memo } from 'react'
import { Container } from '../../../../core/layout/Container/Container'
import { MonadLogo } from '../../components/MonadLogo/MonadLogo'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import { SocialIconBar } from '../../components/SocialIconBar/SocialIconBar'
import { HomeContentModel } from '../../models/HomeContentModel'
import styles from './WhatIsMonadSection.module.css'

const socialIcons = HomeContentModel.getSocialIcons()

export const WhatIsMonadSection = memo(function WhatIsMonadSection() {
  return (
    <section className={styles.section} aria-label={HomeContentModel.whatIsTitle}>
      <Container>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <SectionTitle text={HomeContentModel.whatIsTitle} variant="mono" />
          </div>

          <div className={styles.middleColumn}>
            <div className={styles.logoStack}>
              <MonadLogo variant="section" />
              <SocialIconBar items={socialIcons} />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <p className={styles.description}>{HomeContentModel.whatIsDescription}</p>
          </div>
        </div>
      </Container>
    </section>
  )
})
