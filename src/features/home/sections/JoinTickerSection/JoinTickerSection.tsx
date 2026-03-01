// 모집 안내 텍스트 티커 섹션입니다.
// 동일 트랙을 2개 붙여 끊김 없는 무한 루프를 만듭니다.
import { memo } from 'react'
import { HomeContentModel } from '../../models/HomeContentModel'
import styles from './JoinTickerSection.module.css'

const tickerItems = HomeContentModel.getTickerItems()

function renderTickerGroup(groupPrefix: string) {
  return tickerItems.map((item, index) => (
    <span key={`${groupPrefix}-${index}`} className={styles.tickerItem}>
      {item}
    </span>
  ))
}

export const JoinTickerSection = memo(function JoinTickerSection() {
  return (
    <section className={styles.section} aria-label="Recruitment ticker">
      <div className={styles.viewport}>
        <div className={styles.track}>
          <div className={styles.group}>{renderTickerGroup('group-a')}</div>
          <div className={styles.group} aria-hidden="true">
            {renderTickerGroup('group-b')}
          </div>
        </div>
      </div>
    </section>
  )
})
