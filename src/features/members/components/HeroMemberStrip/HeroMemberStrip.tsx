import { memo, useMemo } from 'react'
import { text } from '../../../../content/text/textService'
import { MonadLogo } from '../../../home/components/MonadLogo/MonadLogo'
import type { MemberYearGroup } from '../../data/members'
import styles from './HeroMemberStrip.module.css'

interface HeroMemberStripProps {
  yearGroup: MemberYearGroup
}

export const HeroMemberStrip = memo(function HeroMemberStrip({
  yearGroup,
}: HeroMemberStripProps) {
  const sectionAriaLabel = text('members', 'hero.sectionAria', 'Members hero strip')
  const marqueeMembers = useMemo(() => {
    if (yearGroup.members.length === 0) {
      return []
    }

    return [...yearGroup.members, ...yearGroup.members, ...yearGroup.members]
  }, [yearGroup.members])

  return (
    <section className={styles.section} aria-label={sectionAriaLabel}>
      <div className={styles.marqueeTrack}>
        {marqueeMembers.map((member, index) => (
          <article className={styles.heroCard} key={`${member.id}-${index}`} aria-hidden="true">
            <img src={member.image} alt="" />
            <div className={styles.heroCardOverlay} />
            <p className={styles.heroCardName}>{member.name}</p>
          </article>
        ))}
      </div>

      <div className={styles.centerOverlay}>
        <MonadLogo variant="section" />
        <h1>{yearGroup.heroTitle}</h1>
        <p>{yearGroup.heroSubtitle}</p>
      </div>
    </section>
  )
})
