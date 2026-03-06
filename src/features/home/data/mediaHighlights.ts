// 홈 하단 미디어 노출 섹션 JSON 데이터를 화면 렌더링 모델로 변환합니다.
import mediaHighlightsSource from './mediaHighlights.json'

export type MediaHighlightType = 'youtube' | 'article' | 'image'

export interface MediaHighlightItem {
  id: string
  type: MediaHighlightType
  title: string
  url: string
  previewText: string
  imageUrl: string
}

interface MediaHighlightSource {
  id?: string
  type?: string
  title?: string
  url?: string
  previewText?: string
  imageUrl?: string
}

interface MediaHighlightsPayload {
  items?: MediaHighlightSource[]
}

const typedPayload: MediaHighlightsPayload = mediaHighlightsSource
const rawItems = Array.isArray(typedPayload.items) ? typedPayload.items : []

const allowedTypes = new Set<MediaHighlightType>(['youtube', 'article', 'image'])

function normalizeType(type?: string): MediaHighlightType {
  if (type && allowedTypes.has(type as MediaHighlightType)) {
    return type as MediaHighlightType
  }
  return 'article'
}

function normalizeYoutubeEmbedUrl(url: string): string {
  if (!url) {
    return ''
  }

  try {
    const parsedUrl = new URL(url)
    const host = parsedUrl.hostname.toLowerCase()

    if (host.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.replace('/', '').trim()
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    if (host.includes('youtube.com')) {
      if (parsedUrl.pathname.includes('/embed/')) {
        return url
      }

      const videoId = parsedUrl.searchParams.get('v')?.trim() ?? ''
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    return url
  } catch {
    return url
  }
}

const normalizedItems: readonly MediaHighlightItem[] = rawItems
  .map((item, index) => {
    const type = normalizeType(item.type)
    const fallbackId = `media-item-${index + 1}`
    const id = typeof item.id === 'string' && item.id.trim() ? item.id : fallbackId
    const title = typeof item.title === 'string' && item.title.trim() ? item.title : 'MONAD Media'
    const rawUrl = typeof item.url === 'string' ? item.url : ''
    const url = type === 'youtube' ? normalizeYoutubeEmbedUrl(rawUrl) : rawUrl

    return {
      id,
      type,
      title,
      url,
      previewText: typeof item.previewText === 'string' ? item.previewText : '',
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
    }
  })
  .filter((item) => {
    // 타입별 최소 표시 조건을 만족하는 데이터만 섹션에 노출합니다.
    if (item.type === 'youtube') {
      return item.url.length > 0
    }

    if (item.type === 'image') {
      return item.imageUrl.length > 0
    }

    return item.url.length > 0 || item.previewText.length > 0
  })

export class MediaHighlightsRepository {
  public static getItems(): readonly MediaHighlightItem[] {
    return normalizedItems
  }
}
