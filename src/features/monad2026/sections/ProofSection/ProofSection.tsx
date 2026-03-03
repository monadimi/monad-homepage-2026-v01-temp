// 팀원 후기와 증거 메시지를 보여주는 섹션입니다.
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { text } from '../../../../content/text/textService'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './ProofSection.module.css'

export const ProofSection = memo(function ProofSection() {
  const navigate = useNavigate()
  const repeatedWord = text('monad2026', 'proof.patternWord', '실적들이 나열될 곳입니다 ')
  const patternRows = Array.from(
    { length: 14 },
    (_, index) => `${repeatedWord}${repeatedWord}${index}`,
  )
  const titleAccent = text('monad2026', 'proof.titleAccent', '팀원')
  const titleSuffix = text('monad2026', 'proof.titleSuffix', '이 증명합니다.')
  const description = text(
    'monad2026',
    'proof.description',
    '대충 우리 동아리원들 대단하다는 내용 대충 우리 동아리원들 대단하다는 내용 대충 우리 동아리원들 대단하다는 내용 대충 우리 동아리원들 대단하다는 내용',
  )
  const ctaLabel = text('monad2026', 'proof.cta', '더 알아보기')

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
          <span className={styles.accent}>{titleAccent}</span>
          {titleSuffix}
        </h2>
        <p className={styles.description}>{description}</p>
        <CTAButton
          label={ctaLabel}
          variant="outline"
          onClick={() => navigate('/members')}
        />
      </div>
    </section>
  )
})
