// 업적 카드 그리드 섹션입니다.
// 전달받은 카드 목록을 4열 기준 그리드로 렌더링합니다.
import { memo, useEffect, useMemo, useState } from 'react'
import { Container } from '../../../../core/layout/Container/Container'
import type { Award } from '../../data/awards'
import { AwardCard } from '../../components/AwardCard/AwardCard'
import styles from './AwardsGridSection.module.css'

interface AwardsGridSectionProps {
  awards: readonly Award[]
}

export const AwardsGridSection = memo(function AwardsGridSection({
  awards,
}: AwardsGridSectionProps) {
  // 현재 상세 팝업으로 연 카드 상태입니다.
  const [selectedAwardId, setSelectedAwardId] = useState<string | null>(null)

  const selectedAward = useMemo(
    () => awards.find((award) => award.id === selectedAwardId) ?? null,
    [awards, selectedAwardId],
  )

  const closeModal = () => {
    setSelectedAwardId(null)
  }

  useEffect(() => {
    if (!selectedAward) {
      return undefined
    }

    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscClose)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscClose)
    }
  }, [selectedAward])

  return (
    <section className={styles.section} aria-label="Awards grid">
      <Container>
        <div className={styles.grid}>
          {awards.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              onOpenDetails={(targetAward) => setSelectedAwardId(targetAward.id)}
            />
          ))}
        </div>
      </Container>

      {selectedAward ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={closeModal}
        >
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="award-detail-title"
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseButton}
              aria-label="상세 팝업 닫기"
              onClick={closeModal}
            >
              ×
            </button>

            <div className={styles.modalHero}>
              <img
                src={selectedAward.image}
                alt={selectedAward.title}
                className={styles.modalImage}
              />
              <div className={styles.modalHeroGradient} />
              <div className={styles.modalHeroText}>
                <p className={styles.modalTitle}>{selectedAward.title}</p>
                <h3 id="award-detail-title" className={styles.modalHighlight}>
                  {selectedAward.highlight}
                </h3>
                <p className={styles.modalSubtitle}>{selectedAward.subtitle}</p>
              </div>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>{selectedAward.description}</p>

              <section className={styles.metaSection} aria-label="팀원">
                <h4 className={styles.metaLabel}>팀원</h4>
                <p className={styles.metaValue}>
                  {selectedAward.teamMembers.join(', ')}
                </p>
              </section>

              <section className={styles.metaSection} aria-label="상금">
                <h4 className={styles.metaLabel}>상금</h4>
                <p className={styles.metaValue}>{selectedAward.prize}</p>
              </section>

              <section className={styles.metaSection} aria-label="서비스 링크">
                <h4 className={styles.metaLabel}>서비스 이용해보기</h4>
                <a
                  className={styles.metaLink}
                  href={selectedAward.serviceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedAward.serviceUrl}
                </a>
              </section>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
})
