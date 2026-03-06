// 홈 하단 미디어 노출 카드를 좌측으로 흐르게 렌더링하는 섹션입니다.
import { memo } from 'react'
import { MediaHighlightsRepository, type MediaHighlightItem } from '../../data/mediaHighlights'
import styles from './MediaHighlightsSection.module.css'

const mediaItems = MediaHighlightsRepository.getItems()
const marqueeItems = mediaItems.length > 0 ? [...mediaItems, ...mediaItems] : []

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

function renderMediaBody(item: MediaHighlightItem) {
  if (item.type === 'youtube') {
    return (
      <iframe
        className={styles.youtubeFrame}
        src={item.url}
        title={item.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }

  if (item.type === 'image') {
    const imageNode = (
      <>
        <img src={item.imageUrl} alt={item.title} className={styles.image} />
        <h3>{item.title}</h3>
      </>
    )

    if (!item.url) {
      return imageNode
    }

    return (
      <a
        href={item.url}
        target={isExternalUrl(item.url) ? '_blank' : undefined}
        rel={isExternalUrl(item.url) ? 'noopener noreferrer' : undefined}
        className={styles.mediaLink}
      >
        {imageNode}
      </a>
    )
  }

  return (
    <div className={styles.articleBody}>
      <h3>{item.title}</h3>
      <p>{item.previewText}</p>
      {item.url ? (
        <a
          href={item.url}
          target={isExternalUrl(item.url) ? '_blank' : undefined}
          rel={isExternalUrl(item.url) ? 'noopener noreferrer' : undefined}
          className={styles.mediaLink}
        >
          기사 보러가기
        </a>
      ) : null}
    </div>
  )
}

export const MediaHighlightsSection = memo(function MediaHighlightsSection() {
  if (marqueeItems.length === 0) {
    return null
  }

  return (
    <section className={styles.section} aria-label="미디어 노출">
      <div className={styles.track}>
        {marqueeItems.map((item, index) => (
          <article
            key={`${item.id}-${index}`}
            className={styles.card}
            data-type={item.type}
          >
            {renderMediaBody(item)}
          </article>
        ))}
      </div>
    </section>
  )
})
