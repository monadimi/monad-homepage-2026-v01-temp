// 업적 데이터 접근 레이어입니다.
// 실제 데이터 원본은 awards.json이며, 이 파일은 앱에서 쓰기 쉬운 형태로 변환합니다.
import awardPlaceholderImage from '../../../assets/award-placeholder.svg'
import { text } from '../../../content/text/textService'
import awardsSource from './awards.json'

export interface Award {
  id: string
  title: string
  subtitle: string
  highlight: string
  image: string
  additionalImages: readonly string[]
  year: number
  description: string
  teamMembers: string[]
  prize: string
  serviceUrl: string
}

interface AwardSourceRecord {
  id: string
  title: string
  subtitle: string
  highlight: string
  imageKey: string
  additionalImageIds?: string[]
  year: number
  description?: string
  teamMembers?: string[]
  prize?: string
  serviceUrl?: string
}

interface AwardsSource {
  defaultYear: number
  yearOrder: number[]
  awards: AwardSourceRecord[]
}

const staticImageRegistry: Readonly<Record<string, string>> = {
  placeholder: awardPlaceholderImage,
}

// 로컬 에셋 폴더(src/assets) 내 이미지를 자동 로드합니다.
// 파일명(확장자 제외)을 키로 사용합니다. 예: 2025-award-1.png -> "2025-award-1"
const localAwardImageModules = import.meta.glob<string>(
  '../../../assets/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  {
    eager: true,
    import: 'default',
  },
)

function toImageKeyFromPath(path: string): string {
  const fileName = path.split('/').pop() ?? ''
  return fileName.replace(/\.[^/.]+$/, '').toLowerCase()
}

function normalizeAssetId(rawValue: unknown): string {
  if (typeof rawValue !== 'string') {
    return ''
  }

  return rawValue.trim().toLowerCase().replace(/\.[^/.]+$/, '')
}

const localAwardImageRegistry: Readonly<Record<string, string>> = Object.entries(
  localAwardImageModules,
).reduce<Record<string, string>>((accumulator, [path, imageUrl]) => {
  const key = toImageKeyFromPath(path)
  if (!key || key in accumulator) {
    return accumulator
  }

  accumulator[key] = imageUrl
  return accumulator
}, {})

function resolveAwardImage(award: AwardSourceRecord): string {
  // 1) id와 동일한 파일명 우선 사용
  const normalizedId = normalizeAssetId(award.id)
  if (normalizedId && normalizedId in localAwardImageRegistry) {
    return localAwardImageRegistry[normalizedId]
  }

  // 2) imageKey와 동일한 파일명 사용 (기존 imageKey 흐름 호환)
  const normalizedImageKey = normalizeAssetId(award.imageKey)
  if (normalizedImageKey && normalizedImageKey in localAwardImageRegistry) {
    return localAwardImageRegistry[normalizedImageKey]
  }

  // 3) 정적 레지스트리(placeholder) 및 최종 기본 이미지 폴백
  return staticImageRegistry[normalizedImageKey] ?? awardPlaceholderImage
}

function resolveAdditionalAwardImages(award: AwardSourceRecord): readonly string[] {
  if (!Array.isArray(award.additionalImageIds)) {
    return []
  }

  const uniqueIds = Array.from(
    new Set(
      award.additionalImageIds
        .map((id) => normalizeAssetId(id))
        .filter((id) => id.length > 0),
    ),
  )

  return uniqueIds
    .map((id) => localAwardImageRegistry[id] ?? null)
    .filter((imageUrl): imageUrl is string => typeof imageUrl === 'string' && imageUrl.length > 0)
}

const typedAwardsSource: AwardsSource = awardsSource
const sourceAwards = Array.isArray(typedAwardsSource.awards) ? typedAwardsSource.awards : []
const sourceYearOrder = Array.isArray(typedAwardsSource.yearOrder)
  ? typedAwardsSource.yearOrder.filter((year): year is number => typeof year === 'number')
  : []

// 상세 정보가 비어 있을 때 사용하는 기본 문구입니다.
const defaultAwardDescription =
  text(
    'achievements',
    'fallback.description',
    "대한민국 정부 및 미국 백악관, UN이 공동개최한 '아주 대단하고 멋진 대회'에서 AI를 이용한 점심메뉴 예측 시스템 '대단한거'로 대상을 받았습니다.",
  )

const defaultAwardTeamMembers = [
  text('achievements', 'fallback.teamMember', '2701김디미'),
  text('achievements', 'fallback.teamMember', '2701김디미'),
  text('achievements', 'fallback.teamMember', '2701김디미'),
  text('achievements', 'fallback.teamMember', '2701김디미'),
  text('achievements', 'fallback.teamMember', '2701김디미'),
]

const defaultAwardPrize = text('achievements', 'fallback.prize', '1,000,000원')

const defaultAwardServiceUrl = text(
  'achievements',
  'fallback.serviceUrl',
  'https://youtu.be/dQw4w9WgXcQ?si=9SvW5757nWexx7K7',
)

export class AwardsRepository {
  // 기본 선택 연도
  private static readonly defaultYear =
    typeof typedAwardsSource.defaultYear === 'number'
      ? typedAwardsSource.defaultYear
      : sourceYearOrder[0] ?? new Date().getFullYear()

  private static readonly yearOrder: readonly number[] =
    sourceYearOrder

  // JSON 레코드를 화면 렌더링용 모델로 변환
  private static readonly records: readonly Award[] =
    sourceAwards.map((award) => ({
      id: award.id,
      title: award.title,
      subtitle: award.subtitle,
      highlight: award.highlight,
      image: resolveAwardImage(award),
      additionalImages: resolveAdditionalAwardImages(award),
      year: award.year,
      description: award.description ?? defaultAwardDescription,
      teamMembers: Array.isArray(award.teamMembers) ? award.teamMembers : defaultAwardTeamMembers,
      prize: typeof award.prize === 'string' ? award.prize : defaultAwardPrize,
      serviceUrl: typeof award.serviceUrl === 'string' ? award.serviceUrl : defaultAwardServiceUrl,
    }))

  // "1,000,000원" 같은 문자열을 합계 계산용 숫자로 변환합니다.
  private static parsePrizeAmount(prize: string): number {
    const normalizedNumberText = prize.replace(/[^\d]/g, '')
    return Number.parseInt(normalizedNumberText, 10) || 0
  }

  public static getDefaultYear(): number {
    return AwardsRepository.defaultYear
  }

  public static getAvailableYears(): readonly number[] {
    return AwardsRepository.yearOrder
  }

  // 연도 네비게이션에 포함된 총 연도 수를 반환합니다.
  public static getTrackedYearCount(): number {
    return AwardsRepository.yearOrder.length
  }

  public static getAwardsByYear(year: number): readonly Award[] {
    return AwardsRepository.records.filter((award) => award.year === year)
  }

  // 수상 카드 총 개수를 반환합니다.
  public static getTotalAwardsCount(): number {
    return AwardsRepository.records.length
  }

  // 수상 데이터의 상금을 자동 합산해 TOTAL EARN 계산에 사용합니다.
  public static getTotalPrizeAmount(): number {
    return AwardsRepository.records.reduce(
      (sum, award) => sum + AwardsRepository.parsePrizeAmount(award.prize),
      0,
    )
  }

  public static hasPreviousYear(year: number): boolean {
    const index = AwardsRepository.yearOrder.indexOf(year)
    return index >= 0 && index < AwardsRepository.yearOrder.length - 1
  }

  public static hasNextYear(year: number): boolean {
    const index = AwardsRepository.yearOrder.indexOf(year)
    return index > 0
  }

  public static getPreviousYear(year: number): number | null {
    const index = AwardsRepository.yearOrder.indexOf(year)

    if (index < 0 || index >= AwardsRepository.yearOrder.length - 1) {
      return null
    }

    return AwardsRepository.yearOrder[index + 1]
  }

  public static getNextYear(year: number): number | null {
    const index = AwardsRepository.yearOrder.indexOf(year)

    if (index <= 0) {
      return null
    }

    return AwardsRepository.yearOrder[index - 1]
  }
}
