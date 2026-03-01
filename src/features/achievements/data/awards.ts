// 업적 데이터 접근 레이어입니다.
// 실제 데이터 원본은 awards.json이며, 이 파일은 앱에서 쓰기 쉬운 형태로 변환합니다.
import awardPlaceholderImage from '../../../assets/award_placeholder.svg'
import awardsSource from './awards.json'

export interface Award {
  id: string
  title: string
  subtitle: string
  highlight: string
  image: string
  year: number
}

interface AwardSourceRecord {
  id: string
  title: string
  subtitle: string
  highlight: string
  imageKey: string
  year: number
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
    }))

  public static getDefaultYear(): number {
    return AwardsRepository.defaultYear
  }

  public static getAvailableYears(): readonly number[] {
    return AwardsRepository.yearOrder
  }

  public static getAwardsByYear(year: number): readonly Award[] {
    return AwardsRepository.records.filter((award) => award.year === year)
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
