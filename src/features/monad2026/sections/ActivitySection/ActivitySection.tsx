// 일반/창업 활동과 IT 컨퍼런스 안내 섹션입니다.
import { memo } from 'react'
import styles from './ActivitySection.module.css'

const startupItems = [
  {
    title: '1팀 1배포 목표',
    description: '단순 기획에서 멈추지 않고 직접 실천하는 동아리',
  },
  {
    title: '입학설명회 준비',
    description: '입학설명회를 준비합니다. 입학설명회를 준비합니다.',
  },
  {
    title: '공통대회 참가',
    description: '코드페어, 코드페어, 코드페어, 등의 공통대회를 참가합니다',
  },
] as const

export const ActivitySection = memo(function ActivitySection() {
  return (
    <section className={styles.section} aria-label="창업 및 일반 동아리 활동">
      <div className={styles.row}>
        <div className={styles.rowInner}>
          {/* 모바일에서는 창업동아리 활동 타이틀을 설명 목록 위로 올립니다. */}
          <h2 className={`${styles.sectionTitle} ${styles.startupSectionTitle}`}>창업동아리 활동</h2>

          <div className={styles.startupList}>
            {startupItems.map((item) => (
              <article key={item.title} className={styles.startupItem}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.rowInner}>
          <h2 className={styles.sectionTitle}>일반동아리 활동</h2>

          <article className={styles.conferenceBlock}>
            <h3 className={styles.itemTitle}>IT 컨퍼런스</h3>
            <p className={styles.itemDescription}>
              동아리 17차시 동안 한 주에 2~3명씩 발표해서 생기부를 채웁니다. 또한 심화탐구 팀도
              구성하여 발표를 진행합니다.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
})
