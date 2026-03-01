// 일반/창업 활동과 IT 컨퍼런스 안내 섹션입니다.
import { memo } from 'react'
import { GraySvgLogo } from '../../components/GraySvgLogo/GraySvgLogo'
import styles from './ActivitySection.module.css'

const activityGeneralImage =
  'https://images.unsplash.com/photo-1510511233900-1982d92bd835?auto=format&fit=crop&w=560&h=360&q=80'
const activityStartupImage =
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=560&h=360&q=80'
const activityGrayA =
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=560&h=360&q=80&sat=-100'
const activityGrayB =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=560&h=360&q=80&sat=-100'

export const ActivitySection = memo(function ActivitySection() {
  return (
    <section className={styles.section} aria-label="활동 소개">
      <div className={styles.imageRow}>
        <article className={styles.imageCard}>
          <img src={activityGeneralImage} alt="일반동아리 활동" loading="lazy" />
          <h3 className={styles.imageTitle}>일반 동아리 활동</h3>
          <p className={styles.imageDescription}>팀 프로젝트와 기술 세미나를 중심으로 운영됩니다.</p>
        </article>

        <article className={styles.imageCard}>
          <img src={activityStartupImage} alt="창업동아리 활동" loading="lazy" />
          <h3 className={styles.imageTitle}>창업 동아리 활동</h3>
          <p className={styles.imageDescription}>아이디어 검증과 서비스 실험 중심으로 운영됩니다.</p>
        </article>
      </div>

      <div className={styles.phraseBlock}>
        <p className={styles.phraseText}>
          모나드는
          <br />
          <span className={styles.phraseHighlight}>[웹플]</span>이 필요합니다.
        </p>

        <div className={styles.logoWrap} aria-hidden="true">
          <GraySvgLogo />
        </div>
      </div>

      <div className={styles.cycleImageRow}>
        <article className={styles.miniCard}>
          <img src={activityGrayA} alt="모나드 활동 이미지 1" loading="lazy" />
          <p className={styles.miniTitle}>멘토 멘티</p>
          <p className={styles.miniHighlight}>로 배웁니다.</p>
        </article>
        <article className={styles.miniCard}>
          <img src={activityGrayB} alt="모나드 활동 이미지 2" loading="lazy" />
          <p className={styles.miniTitle}>해커톤</p>
          <p className={styles.miniHighlight}>을 진행합니다.</p>
        </article>
      </div>

      <div className={styles.activityGrid}>
        <div className={styles.activityColumn}>
          <h3 className={styles.columnTitle}>일반동아리 활동</h3>
          <p className={styles.columnItem}>기초 1:1 멘토 프로그램</p>
          <p className={styles.columnItem}>실무/협업 세션</p>
          <p className={styles.columnItem}>프로젝트 중심 활동</p>
        </div>

        <div className={styles.activityColumn}>
          <h3 className={styles.columnTitle}>창업동아리 활동</h3>
          <p className={styles.columnItem}>서비스 탐색과 MVP 실험</p>
          <p className={styles.columnItem}>문제 정의 및 사업화 기획</p>
          <p className={styles.columnItem}>팀 단위 결과 공유</p>
        </div>
      </div>

      <div className={styles.conferenceBlock}>
        <h3 className={styles.columnTitle}>IT 컨퍼런스</h3>
        <p className={styles.columnItem}>
          외부 연사와 함께 최신 기술 흐름을 공유하고 실무 관점의 인사이트를 연결합니다.
        </p>
      </div>
    </section>
  )
})
