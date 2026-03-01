// 팀원 후기와 증거 메시지를 보여주는 섹션입니다.
import { memo } from 'react'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './ProofSection.module.css'

const repeatedWord = '팀원이 증명합니다.'

export const ProofSection = memo(function ProofSection() {
  return (
    <section className={styles.section} aria-label="팀원이 증명합니다">
      <div className={styles.patternLayer} aria-hidden="true">
        {Array.from({ length: 40 }).map((_, index) => (
          <span key={`pattern-${index}`} className={styles.patternWord}>
            {repeatedWord}
          </span>
        ))}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>팀원이 증명합니다.</h2>
        <p className={styles.description}>
          모나드에서의 1년은 실전 프로젝트, 협업, 발표까지 연결되는 성장의 시간을 만듭니다.
        </p>
        <CTAButton label="지원하기" variant="outline" />
      </div>
    </section>
  )
})
