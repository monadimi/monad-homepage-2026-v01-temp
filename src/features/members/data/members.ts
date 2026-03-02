// 멤버 페이지 JSON 데이터를 앱 렌더링 모델로 변환하는 레이어입니다.
import membersSource from './members.json'

export type MemberRoleKey = 'planner' | 'developer' | 'designer'

export interface MemberRole {
  key: MemberRoleKey
  label: string
  icon: string
}

export interface MemberStack {
  id: string
  label: string
  // 스택 아이콘 키는 JSON에서 자유롭게 확장할 수 있도록 문자열 전체를 허용합니다.
  iconKey: string
  value: number
}

export interface MemberProfile {
  id: string
  name: string
  code: string
  intro: string
  roles: readonly MemberRole[]
  quote: string
  github: string
  githubLabel: string
  image: string
  achievements: readonly string[]
  stacks: readonly MemberStack[]
}

export interface MemberYearGroup {
  year: number
  title: string
  generationLabel: string
  heroTitle: string
  heroSubtitle: string
  members: readonly MemberProfile[]
}

interface MemberStackSource {
  id: string
  label: string
  iconKey: string
  value: number
}

interface MemberSourceRecord {
  id: string
  name: string
  code: string
  intro: string
  roles: string[]
  quote: string
  github: string
  githubLabel: string
  imageKey: string
  achievements: string[]
  stacks: MemberStackSource[]
}

interface MemberYearSource {
  year: number
  title: string
  generationLabel: string
  heroTitle: string
  heroSubtitle: string
  members: MemberSourceRecord[]
}

interface MembersSource {
  defaultYear: number
  yearOrder: number[]
  years: MemberYearSource[]
}

const typedMembersSource: MembersSource = membersSource

// 역할 키를 화면 표기 라벨/아이콘으로 변환하는 사전입니다.
const roleRegistry: Readonly<Record<MemberRoleKey, MemberRole>> = {
  planner: {
    key: 'planner',
    label: '기획',
    icon: '💡',
  },
  developer: {
    key: 'developer',
    label: '개발',
    icon: '</>',
  },
  designer: {
    key: 'designer',
    label: '디자인',
    icon: '🎨',
  },
}

// JSON의 imageKey를 실제 이미지 URL로 매핑합니다.
// 디자인 시안과 동일하게 동일 인물 컷을 반복 노출할 수 있도록 기본 키를 제공합니다.
const imageRegistry: Readonly<Record<string, string>> = {
  jesiwon:
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=1200&q=80',
}

function normalizeRole(roleKey: string): MemberRole {
  if (roleKey === 'planner') {
    return roleRegistry.planner
  }

  if (roleKey === 'developer') {
    return roleRegistry.developer
  }

  if (roleKey === 'designer') {
    return roleRegistry.designer
  }

  // 정의되지 않은 역할 값은 기본적으로 개발자로 처리해 렌더링 안정성을 유지합니다.
  return roleRegistry.developer
}

export class MembersRepository {
  private static readonly defaultYear = typedMembersSource.defaultYear

  private static readonly yearOrder = typedMembersSource.yearOrder

  private static readonly yearGroups: readonly MemberYearGroup[] =
    typedMembersSource.years.map((yearGroup) => ({
      year: yearGroup.year,
      title: yearGroup.title,
      generationLabel: yearGroup.generationLabel,
      heroTitle: yearGroup.heroTitle,
      heroSubtitle: yearGroup.heroSubtitle,
      members: yearGroup.members.map((member) => ({
        id: member.id,
        name: member.name,
        code: member.code,
        intro: member.intro,
        roles: member.roles.map((roleKey) => normalizeRole(roleKey)),
        quote: member.quote,
        github: member.github,
        githubLabel: member.githubLabel,
        // imageKey가 없거나 잘못된 경우에도 UI가 깨지지 않도록 기본 이미지를 사용합니다.
        image: imageRegistry[member.imageKey] ?? imageRegistry.jesiwon,
        achievements: member.achievements,
        stacks: member.stacks.map((stack) => ({
          id: stack.id,
          label: stack.label,
          // iconKey 제한을 두지 않고 JSON 값을 그대로 전달합니다.
          iconKey: stack.iconKey,
          value: stack.value,
        })),
      })),
    }))

  public static getDefaultYear(): number {
    return MembersRepository.defaultYear
  }

  public static getYearOrder(): readonly number[] {
    return MembersRepository.yearOrder
  }

  public static getYearGroupByYear(year: number): MemberYearGroup | null {
    return MembersRepository.yearGroups.find((group) => group.year === year) ?? null
  }

  public static getDefaultYearGroup(): MemberYearGroup {
    return (
      MembersRepository.getYearGroupByYear(MembersRepository.defaultYear) ??
      MembersRepository.yearGroups[0]
    )
  }
}
