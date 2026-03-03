// 팀원 후기와 증거 메시지를 보여주는 섹션입니다.
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './ProofSection.module.css'

const repeatedWord = '실적들이 나열될 곳입니다 '

const patternRows = Array.from({ length: 14 }, (_, index) => `${repeatedWord}${repeatedWord}${index}`)

export const ProofSection = memo(function ProofSection() {
  const navigate = useNavigate()

  return (
    <section className={styles.section} aria-label="팀원이 증명합니다">
      <div className={styles.patternLayer} aria-hidden="true">
        {patternRows.map((line, index) => (
          <span key={`pattern-${index}`} className={styles.patternWord}>
            {line}
          </span>
        ))}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>
          <span className={styles.accent}>팀원</span>이 증명합니다.
        </h2>
        <p className={styles.description}>
          대충 우리 동아리원들 대단하다는 내용 대충 우리 동아리원들 대단하다는 내용
          대충 우리 동아리원들 대단하다는 내용 대충 우리 동아리원들 대단하다는 내용
        </p>
        <CTAButton
          label="더 알아보기"
          variant="outline"
          onClick={() => navigate('/members')}
        />
      </div>
    </section>
  )
})
