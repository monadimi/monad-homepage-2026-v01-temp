// 멤버 페이지 JSON 데이터를 앱 렌더링 모델로 변환하는 레이어입니다.
import { text } from '../../../content/text/textService'
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
const sourceYears = Array.isArray(typedMembersSource.years) ? typedMembersSource.years : []
const sourceYearOrder = Array.isArray(typedMembersSource.yearOrder)
  ? typedMembersSource.yearOrder.filter((year): year is number => typeof year === 'number')
  : []

// 로컬 에셋 폴더(src/assets/members) 내 이미지를 자동 로드합니다.
// 파일명(확장자 제외)을 imageKey로 사용합니다. 예: dana.png -> "dana"
const localMemberImageModules = import.meta.glob<string>(
  '../../../assets/members/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  {
    eager: true,
    import: 'default',
  },
)

function toImageKeyFromPath(path: string): string {
  const fileName = path.split('/').pop() ?? ''
  return fileName.replace(/\.[^/.]+$/, '').toLowerCase()
}

const localMemberImageRegistry: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(localMemberImageModules).map(([path, imageUrl]) => [toImageKeyFromPath(path), imageUrl]),
)

// 기존 데이터 호환용 별칭입니다. 점진적으로 JSON의 imageKey를 파일명 기준으로 맞추면 됩니다.
const imageKeyAliasRegistry: Readonly<Record<string, string>> = {
  jesiwon: 'member-placeholder',
}

const defaultMemberImage =
  localMemberImageRegistry['member-placeholder'] ??
  Object.values(localMemberImageRegistry)[0] ??
  ''

// 역할 키를 화면 표기 라벨/아이콘으로 변환하는 사전입니다.
const roleRegistry: Readonly<Record<MemberRoleKey, MemberRole>> = {
  planner: {
    key: 'planner',
    label: text('members', 'role.planner.label', '기획'),
    icon: '💡',
  },
  developer: {
    key: 'developer',
    label: text('members', 'role.developer.label', '개발'),
    icon: '</>',
  },
  designer: {
    key: 'designer',
    label: text('members', 'role.designer.label', '디자인'),
    icon: '🎨',
  },
}

function resolveMemberImage(imageKey: string): string {
  const normalizedKey = imageKey.trim().toLowerCase()
  const aliasedKey = imageKeyAliasRegistry[normalizedKey] ?? normalizedKey
  return localMemberImageRegistry[aliasedKey] ?? defaultMemberImage
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
  private static readonly yearOrder = sourceYearOrder

  // 페이지 첫 진입 시 항상 "멤버가 실제로 존재하는 최신 연도"를 우선으로 사용합니다.
  // (예: 최신 연도 블록이 비어 있으면 직전 연도로 자동 폴백)
  private static readonly defaultYear =
    sourceYears
      .filter((yearGroup) => Array.isArray(yearGroup.members) && yearGroup.members.length > 0)
      .map((yearGroup) => yearGroup.year)
      .sort((a, b) => b - a)[0] ??
    (MembersRepository.yearOrder.length > 0
      ? Math.max(...MembersRepository.yearOrder)
      : typedMembersSource.defaultYear)

  private static readonly yearGroups: readonly MemberYearGroup[] =
    sourceYears.map((yearGroup) => ({
      year: yearGroup.year,
      title: yearGroup.title,
      generationLabel: yearGroup.generationLabel,
      heroTitle: yearGroup.heroTitle,
      heroSubtitle: yearGroup.heroSubtitle,
      members: (Array.isArray(yearGroup.members) ? yearGroup.members : []).map((member) => ({
        id: member.id,
        name: member.name,
        code: member.code,
        intro: member.intro,
        roles: (Array.isArray(member.roles) ? member.roles : []).map((roleKey) => normalizeRole(roleKey)),
        quote: member.quote,
        github: member.github,
        githubLabel: member.githubLabel,
        // imageKey가 없거나 잘못된 경우에도 UI가 깨지지 않도록 기본 이미지를 사용합니다.
        image: resolveMemberImage(member.imageKey),
        achievements: Array.isArray(member.achievements) ? member.achievements : [],
        stacks: (Array.isArray(member.stacks) ? member.stacks : []).map((stack) => ({
          id: stack.id,
          label: stack.label,
          // iconKey 제한을 두지 않고 JSON 값을 그대로 전달합니다.
          iconKey: stack.iconKey,
          value: stack.value,
        })),
      })),
    }))

  private static readonly emptyYearGroup: MemberYearGroup = {
    year: MembersRepository.defaultYear,
    title: `MONAD ${MembersRepository.defaultYear}`,
    generationLabel: '미정',
    heroTitle: 'MEMBERS OF MONAD',
    heroSubtitle: '모나드의 단자들을 소개합니다.',
    members: [],
  }

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
    const preferred = MembersRepository.getYearGroupByYear(MembersRepository.defaultYear)
    if (preferred && preferred.members.length > 0) {
      return preferred
    }

    const firstNonEmpty = MembersRepository.yearGroups.find(
      (yearGroup) => yearGroup.members.length > 0,
    )
    if (firstNonEmpty) {
      return firstNonEmpty
    }

    return MembersRepository.yearGroups[0] ?? MembersRepository.emptyYearGroup
  }
}
