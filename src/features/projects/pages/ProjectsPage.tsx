import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  large?: boolean
  onMouseEnter?: () => void
}

const ProjectCard = memo(function ProjectCard({
  project,
  large = false,
  onMouseEnter,
}: ProjectCardProps) {
  const platformChip = text(
    'projects',
    'common.platformChip',
    'AI-Powered Analysis Platform',
  )
  const homeAriaLabel = text('projects', 'card.homeAria', 'Go home')
  const githubAriaLabel = text('projects', 'card.githubAria', 'GitHub link')
  const schoolLabel = text('projects', 'card.schoolLabel', '학교 선택')
  const schoolPlaceholder = text('projects', 'card.schoolPlaceholder', '학교를 선택하세요')

  return (
    <article
      className={`${styles.projectCard} ${large ? styles.projectCardLarge : ''}`}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.cardPlatformChip}>{platformChip}</div>

      <div className={styles.cardMiniBrand}>
        <MonadLogo variant="footerMark" />
        <span>{project.title}</span>
      </div>

      <div className={styles.cardTitleRow}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <span className={styles.cardSubTitle}>{project.subtitle}</span>
      </div>

      {large ? <p className={styles.cardSummary}>{project.summary}</p> : null}

      <div className={styles.cardTags}>
        <span className={`${styles.tag} ${styles.tagPrimary}`}>{project.awardTag}</span>
        {project.tags.map((tag) => (
          <span key={`${project.id}-${tag}`} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      {large ? (
        <div className={styles.cardLinksAndSelect}>
          <div className={styles.cardLinks}>
            <a href={project.websiteUrl} aria-label={homeAriaLabel} className={styles.iconLink}>
              <span className={styles.homeGlyph}>⌂</span>
            </a>
            <a href={project.githubUrl} aria-label={githubAriaLabel} className={styles.iconLink}>
              <img src={githubIcon} alt="" />
            </a>
          </div>

          <div className={styles.mockSelectWrap}>
            <label className={styles.mockSelectLabel}>{schoolLabel}</label>
            <button type="button" className={styles.mockSelectButton}>
              {schoolPlaceholder}
            </button>
          </div>
        </div>
      ) : null}
    </article>
  )
})

export const ProjectsPage = memo(function ProjectsPage() {
  const sectionAriaLabel = text('projects', 'hero.sectionAria', 'Projects hero')
  const brandLabel = text('projects', 'hero.brandLabel', 'Projects')
  const platformChip = text(
    'projects',
    'common.platformChip',
    'AI-Powered Analysis Platform',
  )
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

  const filteredProjects = useMemo(
    () => ProjectsRepository.getProjectsByYear(selectedYear),
    [selectedYear],
  )

  useEffect(() => {
    if (filteredProjects.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % filteredProjects.length)
    }, autoRotateIntervalMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [filteredProjects])

  const featuredProject =
    filteredProjects[featuredIndex] ?? filteredProjects[0] ?? allProjects[0] ?? null

  const compactProjects = useMemo(() => {
    if (filteredProjects.length === 0) {
      return []
    }

    return Array.from({ length: 10 }, (_, index) =>
      filteredProjects[index % filteredProjects.length],
    )
  }, [filteredProjects])

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
        <div className={styles.heroBackground} aria-hidden="true" />

        <div className={styles.heroBrand}>
          <MonadLogo variant="footerMark" />
          <span>{brandLabel}</span>
        </div>

        <p className={styles.platformChip}>{platformChip}</p>

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

        <div className={styles.gridWrap}>
          {compactProjects.map((project, index) => (
            <ProjectCard
              key={`${project.id}-${index}`}
              project={project}
              onMouseEnter={() => {
                const sourceIndex = filteredProjects.indexOf(project)

                if (sourceIndex >= 0) {
                  setFeaturedIndex(sourceIndex)
                }
              }}
            />
          ))}

          <ProjectCard project={featuredProject} large />
        </div>
      </section>
    </article>
  )
})
