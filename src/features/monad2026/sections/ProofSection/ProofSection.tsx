// 팀원 후기와 증거 메시지를 보여주는 섹션입니다.
import { memo, useMemo, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { text } from '../../../../content/text/textService'
import { CTAButton } from '../../components/CTAButton/CTAButton'
import styles from './ProofSection.module.css'

export const ProofSection = memo(function ProofSection() {
  const navigate = useNavigate()
  const repeatedWord = text('monad2026', 'proof.patternWord', '실적들이 나열될 곳입니다 ')
  // 텍스트 길이를 기준으로 반복 수/시작 지점을 자동 계산해 줄마다 다른 지점에서 시작하도록 구성합니다.
  const patternRows = useMemo(() => {
    const rowCount = 14
    const safeWord = repeatedWord.length > 0 ? repeatedWord : '실적 '
    const minimumCharactersPerLine = 220
    const repeatCount = Math.max(8, Math.ceil(minimumCharactersPerLine / safeWord.length))
    const baseLine = safeWord.repeat(repeatCount)
    const lineLength = baseLine.length
    const goldenRatioStep = 0.61803398875

    return Array.from({ length: rowCount }, (_, index) => {
      const distributedRatio = (index * goldenRatioStep) % 1
      const startIndex = Math.floor(distributedRatio * lineLength)
      const rotatedLine = `${baseLine.slice(startIndex)}${baseLine.slice(0, startIndex)}`

      const startShiftCh = Math.round((distributedRatio - 0.5) * safeWord.length * 0.9)

      return {
        line: rotatedLine,
        startShift: `${startShiftCh}ch`,
        duration: `${360 + (index % 7) * 30}s`,
        delay: `${-index * 1.15}s`,
      }
    })
  }, [repeatedWord])
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
        {patternRows.map((row, index) => (
          <div
            key={`pattern-${index}`}
            className={styles.patternRow}
            style={
              {
                '--pattern-start-shift': row.startShift,
                '--pattern-duration': row.duration,
                '--pattern-delay': row.delay,
              } as CSSProperties
            }
          >
            <div className={styles.patternTrack}>
              <span className={styles.patternWord}>{row.line}</span>
              <span className={styles.patternWord}>{row.line}</span>
            </div>
          </div>
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
