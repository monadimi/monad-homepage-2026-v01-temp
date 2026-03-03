// 업적 데이터 접근 레이어입니다.
// 실제 데이터 원본은 awards.json이며, 이 파일은 앱에서 쓰기 쉬운 형태로 변환합니다.
import awardPlaceholderImage from '../../../assets/award-placeholder.svg'
import awardsSource from './awards.json'

export interface Award {
  id: string
  title: string
  subtitle: string
  highlight: string
  image: string
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

const imageRegistry: Readonly<Record<string, string>> = {
  placeholder: awardPlaceholderImage,
}

const typedAwardsSource: AwardsSource = awardsSource

// 상세 정보가 비어 있을 때 사용하는 기본 문구입니다.
const defaultAwardDescription =
  "대한민국 정부 및 미국 백악관, UN이 공동개최한 '아주 대단하고 멋진 대회'에서 AI를 이용한 점심메뉴 예측 시스템 '대단한거'로 대상을 받았습니다."

const defaultAwardTeamMembers = [
  '2701김디미',
  '2701김디미',
  '2701김디미',
  '2701김디미',
  '2701김디미',
]

const defaultAwardPrize = '1,000,000원'

const defaultAwardServiceUrl =
  'https://youtu.be/dQw4w9WgXcQ?si=9SvW5757nWexx7K7'

export class AwardsRepository {
  // 기본 선택 연도
  private static readonly defaultYear = typedAwardsSource.defaultYear

  private static readonly yearOrder: readonly number[] =
    typedAwardsSource.yearOrder

  // JSON 레코드를 화면 렌더링용 모델로 변환
  private static readonly records: readonly Award[] =
    typedAwardsSource.awards.map((award) => ({
      id: award.id,
      title: award.title,
      subtitle: award.subtitle,
      highlight: award.highlight,
      image: imageRegistry[award.imageKey] ?? awardPlaceholderImage,
      year: award.year,
      description: award.description ?? defaultAwardDescription,
      teamMembers: award.teamMembers ?? defaultAwardTeamMembers,
      prize: award.prize ?? defaultAwardPrize,
      serviceUrl: award.serviceUrl ?? defaultAwardServiceUrl,
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
