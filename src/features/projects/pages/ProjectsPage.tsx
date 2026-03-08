import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import githubIcon from '../../../assets/github.svg'
import { text } from '../../../content/text/textService'
import { MonadLogo } from '../../home/components/MonadLogo/MonadLogo'
import { ProjectsRepository, type ProjectItem } from '../data/projects'
import styles from './ProjectsPage.module.css'

const allProjects = ProjectsRepository.getAllProjects()
const years = ProjectsRepository.getYearOrder()
const autoRotateIntervalMs = ProjectsRepository.getRotationIntervalMs()

interface ProjectCardProps {
  project: ProjectItem
  onMouseEnter?: () => void
}

type ProjectCardToneStyle = CSSProperties & {
  '--card-glow-start': string
  '--card-glow-mid': string
  '--card-glow-end': string
  '--card-glow-accent': string
  '--card-border': string
  '--card-border-hover': string
}

type HeroToneStyle = CSSProperties & {
  '--hero-radial-left': string
  '--hero-radial-right': string
  '--hero-gradient-start': string
  '--hero-gradient-end': string
}

function createProjectSeed(projectId: string): number {
  return projectId.split('').reduce((accumulator, char, index) => {
    return accumulator + char.charCodeAt(0) * (index + 17)
  }, 0)
}

function createProjectCardToneStyle(projectId: string): ProjectCardToneStyle {
  const seed = createProjectSeed(projectId)
  const baseHue = (seed % 80) + 205
  const secondaryHue = (baseHue + 26 + (seed % 28)) % 360
  const accentHue = (baseHue + 144 + (seed % 36)) % 360

  return {
    '--card-glow-start': `hsl(${baseHue} 47% 14%)`,
    '--card-glow-mid': `hsla(${secondaryHue} 78% 64% / 0.28)`,
    '--card-glow-end': `hsl(${(baseHue + 18) % 360} 56% 22%)`,
    '--card-glow-accent': `hsla(${accentHue} 82% 66% / 0.33)`,
    '--card-border': `hsla(${baseHue} 36% 72% / 0.2)`,
    '--card-border-hover': `hsla(${accentHue} 88% 70% / 0.58)`,
  }
}

function createHeroToneStyle(projectId: string): HeroToneStyle {
  const seed = createProjectSeed(projectId)
  const baseHue = (seed % 70) + 206
  const secondaryHue = (baseHue + 128 + (seed % 24)) % 360

  return {
    '--hero-radial-left': `hsla(${baseHue} 78% 66% / 0.28)`,
    '--hero-radial-right': `hsla(${secondaryHue} 74% 66% / 0.24)`,
    '--hero-gradient-start': `hsl(${(baseHue + 6) % 360} 44% 14%)`,
    '--hero-gradient-end': `hsl(${(secondaryHue + 14) % 360} 62% 22%)`,
  }
}

const ProjectCard = memo(function ProjectCard({
  project,
  onMouseEnter,
}: ProjectCardProps) {
  const homeAriaLabel = text('projects', 'card.homeAria', 'Go home')
  const githubAriaLabel = text('projects', 'card.githubAria', 'GitHub link')
  const cardToneStyle = useMemo(() => createProjectCardToneStyle(project.id), [project.id])

  return (
    <article className={styles.projectCard} style={cardToneStyle} onMouseEnter={onMouseEnter}>
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.cardMiniBrand}>
        <MonadLogo variant="footerMark" />
        <span>{project.title}</span>
      </div>

      <div className={styles.cardTitleRow}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <span className={styles.cardSubTitle}>{project.subtitle}</span>
      </div>

      <div className={styles.cardTags}>
        <span className={`${styles.tag} ${styles.tagPrimary}`}>{project.awardTag}</span>
        {project.tags.map((tag) => (
          <span key={`${project.id}-${tag}`} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.cardLinks}>
        <a href={project.websiteUrl} aria-label={homeAriaLabel} className={styles.iconLink}>
          <span className={styles.homeGlyph}>⌂</span>
        </a>
        <a href={project.githubUrl} aria-label={githubAriaLabel} className={styles.iconLink}>
          <img src={githubIcon} alt="" />
        </a>
      </div>
    </article>
  )
})

export const ProjectsPage = memo(function ProjectsPage() {
  const sectionAriaLabel = text('projects', 'hero.sectionAria', 'Projects hero')
  const brandLabel = text('projects', 'hero.brandLabel', 'Projects')
  const previousProjectAriaLabel = text(
    'projects',
    'hero.previousProjectAria',
    'Previous project',
  )
  const nextProjectAriaLabel = text('projects', 'hero.nextProjectAria', 'Next project')
  const scrollToAllAriaLabel = text(
    'projects',
    'hero.scrollToAllAria',
    'Scroll to all projects',
  )
  const allProjectsTitle = text('projects', 'section.allProjectsTitle', 'ALL PROJECTS')
  const yearFilterAriaLabel = text('projects', 'section.yearFilterAria', 'Year filter')

  const gridRef = useRef<HTMLElement | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(
    ProjectsRepository.getDefaultYear(),
  )
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isHoverPreviewActive, setIsHoverPreviewActive] = useState(false)

  const filteredProjects = useMemo(
    () => ProjectsRepository.getProjectsByYear(selectedYear),
    [selectedYear],
  )

  useEffect(() => {
    if (filteredProjects.length <= 1 || isHoverPreviewActive) {
      return
    }

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % filteredProjects.length)
    }, autoRotateIntervalMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [filteredProjects, isHoverPreviewActive])

  const featuredProject =
    filteredProjects[featuredIndex] ?? filteredProjects[0] ?? allProjects[0] ?? null

  // 선택된 프로젝트 id 기준으로 히어로 배경 톤을 동적으로 변경합니다.
  const heroToneStyle = useMemo(
    () => createHeroToneStyle(featuredProject?.id ?? 'hero-default'),
    [featuredProject?.id],
  )

  const compactProjects = useMemo(() => filteredProjects, [filteredProjects])

  const handleNextFeatured = useCallback(() => {
    if (filteredProjects.length === 0) {
      return
    }

    setFeaturedIndex((current) => (current + 1) % filteredProjects.length)
  }, [filteredProjects.length])

  const handlePreviousFeatured = useCallback(() => {
    if (filteredProjects.length === 0) {
      return
    }

    setFeaturedIndex((current) => {
      if (current === 0) {
        return filteredProjects.length - 1
      }

      return current - 1
    })
  }, [filteredProjects.length])

  const handleScrollToGrid = useCallback(() => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (!featuredProject) {
    return null
  }

  return (
    <article className={styles.page}>
      <section className={styles.heroSection} aria-label={sectionAriaLabel}>
        <div className={styles.heroBackground} style={heroToneStyle} aria-hidden="true" />

        <div className={styles.heroBrand}>
          <MonadLogo variant="footerMark" />
          <span>{brandLabel}</span>
        </div>

        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowLeft}`}
          onClick={handlePreviousFeatured}
          aria-label={previousProjectAriaLabel}
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          onClick={handleNextFeatured}
          aria-label={nextProjectAriaLabel}
        >
          ›
        </button>

        <div className={styles.heroFeature}>
          <div className={styles.heroLogoWrap}>
            <MonadLogo variant="section" />
            <h1>{featuredProject.title}</h1>
          </div>

          <p className={styles.heroSummary}>{featuredProject.summary}</p>

          <div className={styles.heroTags}>
            <span className={`${styles.tag} ${styles.tagPrimary}`}>{featuredProject.awardTag}</span>
            {featuredProject.tags.map((tag) => (
              <span key={`hero-${tag}`} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className={styles.heroLinks}>
            <a href={featuredProject.websiteUrl} aria-label="Go home" className={styles.iconLink}>
              <span className={styles.homeGlyph}>⌂</span>
            </a>
            <a href={featuredProject.githubUrl} aria-label="GitHub link" className={styles.iconLink}>
              <img src={githubIcon} alt="" />
            </a>
          </div>
        </div>

        <div className={styles.heroGhostText} aria-hidden="true">
          <strong>{featuredProject.title}</strong>
          <span>{featuredProject.subtitle}</span>
        </div>

        <button
          type="button"
          className={styles.scrollButton}
          onClick={handleScrollToGrid}
          aria-label={scrollToAllAriaLabel}
        >
          ˅
        </button>
      </section>

      <section className={styles.allProjectsSection} ref={gridRef}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{allProjectsTitle}</h2>

          <div className={styles.yearFilter} role="tablist" aria-label={yearFilterAriaLabel}>
            {years.map((year) => {
              const isActive = year === selectedYear

              return (
                <button
                  key={year}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.yearButton} ${isActive ? styles.yearButtonActive : ''}`}
                  onClick={() => {
                    setSelectedYear(year)
                    setFeaturedIndex(0)
                  }}
                >
                  {year}
                </button>
              )
            })}
          </div>
        </div>

        <div
          className={styles.gridWrap}
          onMouseLeave={() => {
            setIsHoverPreviewActive(false)
          }}
        >
          {compactProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onMouseEnter={() => {
                const sourceIndex = filteredProjects.indexOf(project)
                if (sourceIndex < 0) {
                  return
                }

                setIsHoverPreviewActive(true)
                setFeaturedIndex(sourceIndex)
              }}
            />
          ))}
        </div>
      </section>
    </article>
  )
})
