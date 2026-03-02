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

export class ProjectsRepository {
  private static readonly defaultYear = typedProjectsSource.defaultYear

  private static readonly yearOrder = typedProjectsSource.yearOrder

  private static readonly rotationIntervalMs = typedProjectsSource.rotationIntervalMs

  private static readonly projects: readonly ProjectItem[] = typedProjectsSource.years.flatMap(
    (yearGroup) =>
      yearGroup.projects.map((project) => ({
        id: project.id,
        year: yearGroup.year,
        title: project.title,
        summary: project.summary,
        subtitle: project.subtitle,
        awardTag: project.awardTag,
        tags: project.tags,
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
