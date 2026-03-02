import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import githubIcon from '../../../assets/github.svg'
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
  return (
    <article
      className={`${styles.projectCard} ${large ? styles.projectCardLarge : ''}`}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.cardPlatformChip}>AI-Powered Analysis Platform</div>

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
            <a href="/" aria-label="Go home" className={styles.iconLink}>
              <span className={styles.homeGlyph}>⌂</span>
            </a>
            <a href="#" aria-label="GitHub link" className={styles.iconLink}>
              <img src={githubIcon} alt="" />
            </a>
          </div>

          <div className={styles.mockSelectWrap}>
            <label className={styles.mockSelectLabel}>학교 선택</label>
            <button type="button" className={styles.mockSelectButton}>
              학교를 선택하세요
            </button>
          </div>
        </div>
      ) : null}
    </article>
  )
})

export const ProjectsPage = memo(function ProjectsPage() {
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
      <section className={styles.heroSection} aria-label="Projects hero">
        <div className={styles.heroBackground} aria-hidden="true" />

        <div className={styles.heroBrand}>
          <MonadLogo variant="footerMark" />
          <span>Projects</span>
        </div>

        <p className={styles.platformChip}>AI-Powered Analysis Platform</p>

        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowLeft}`}
          onClick={handlePreviousFeatured}
          aria-label="Previous project"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          onClick={handleNextFeatured}
          aria-label="Next project"
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
            <a href="/" aria-label="Go home" className={styles.iconLink}>
              <span className={styles.homeGlyph}>⌂</span>
            </a>
            <a href="#" aria-label="GitHub link" className={styles.iconLink}>
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
          aria-label="Scroll to all projects"
        >
          ˅
        </button>
      </section>

      <section className={styles.allProjectsSection} ref={gridRef}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ALL PROJECTS</h2>

          <div className={styles.yearFilter} role="tablist" aria-label="Year filter">
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
