// Projects 페이지 JSON 데이터를 UI 전용 모델로 변환하는 레이어입니다.
import projectsSource from './projects.json'

export interface ProjectItem {
  id: string
  year: number
  title: string
  summary: string
  subtitle: string
  awardTag: string
  tags: readonly string[]
}

interface ProjectSourceRecord {
  id: string
  title: string
  summary: string
  subtitle: string
  awardTag: string
  tags: string[]
}

interface ProjectYearSource {
  year: number
  projects: ProjectSourceRecord[]
}

interface ProjectsSource {
  defaultYear: number
  yearOrder: number[]
  rotationIntervalMs: number
  years: ProjectYearSource[]
}

const typedProjectsSource: ProjectsSource = projectsSource
const sourceYears = Array.isArray(typedProjectsSource.years) ? typedProjectsSource.years : []
const sourceYearOrder = Array.isArray(typedProjectsSource.yearOrder)
  ? typedProjectsSource.yearOrder.filter((year): year is number => typeof year === 'number')
  : []

export class ProjectsRepository {
  private static readonly defaultYear =
    typeof typedProjectsSource.defaultYear === 'number'
      ? typedProjectsSource.defaultYear
      : sourceYearOrder[0] ?? new Date().getFullYear()

  private static readonly yearOrder = sourceYearOrder

  private static readonly rotationIntervalMs =
    typeof typedProjectsSource.rotationIntervalMs === 'number' &&
    typedProjectsSource.rotationIntervalMs > 0
      ? typedProjectsSource.rotationIntervalMs
      : 4500

  private static readonly projects: readonly ProjectItem[] = sourceYears.flatMap(
    (yearGroup) =>
      (Array.isArray(yearGroup.projects) ? yearGroup.projects : []).map((project) => ({
        id: project.id,
        year: yearGroup.year,
        title: project.title,
        summary: project.summary,
        subtitle: project.subtitle,
        awardTag: project.awardTag,
        tags: Array.isArray(project.tags) ? project.tags : [],
      })),
  )

  public static getDefaultYear(): number {
    return ProjectsRepository.defaultYear
  }

  public static getYearOrder(): readonly number[] {
    return ProjectsRepository.yearOrder
  }

  public static getRotationIntervalMs(): number {
    return ProjectsRepository.rotationIntervalMs
  }

  public static getAllProjects(): readonly ProjectItem[] {
    return ProjectsRepository.projects
  }

  public static getProjectsByYear(year: number): readonly ProjectItem[] {
    return ProjectsRepository.projects.filter((project) => project.year === year)
  }
}
