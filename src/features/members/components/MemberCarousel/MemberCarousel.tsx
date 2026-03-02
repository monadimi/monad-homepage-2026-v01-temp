import { memo, useMemo } from 'react'
import type { MemberProfile } from '../../data/members'
import styles from './MemberCarousel.module.css'

interface MemberCarouselProps {
  members: readonly MemberProfile[]
  selectedMemberId: string
  yearLabel: string
  onSelectMember: (memberId: string) => void
  onPrevMember: () => void
  onNextMember: () => void
}

function getThumbRoleClassName(roleKey: MemberProfile['roles'][number]['key']): string {
  if (roleKey === 'planner') {
    return styles.thumbRolePlanner
  }

  if (roleKey === 'developer') {
    return styles.thumbRoleDeveloper
  }

  return styles.thumbRoleDesigner
}

function getLoopedMember(
  members: readonly MemberProfile[],
  index: number,
): MemberProfile | null {
  if (members.length === 0) {
    return null
  }

  const normalizedIndex = ((index % members.length) + members.length) % members.length
  return members[normalizedIndex]
}

export const MemberCarousel = memo(function MemberCarousel({
  members,
  selectedMemberId,
  yearLabel,
  onSelectMember,
  onPrevMember,
  onNextMember,
}: MemberCarouselProps) {
  const selectedIndex = members.findIndex((member) => member.id === selectedMemberId)

  const visibleMembers = useMemo(() => {
    if (members.length === 0) {
      return []
    }

    const anchorIndex = selectedIndex >= 0 ? selectedIndex : 0
    return Array.from({ length: 7 }, (_, slotIndex) =>
      getLoopedMember(members, anchorIndex - 3 + slotIndex),
    ).filter((member): member is MemberProfile => member !== null)
  }, [members, selectedIndex])

  return (
    <section className={styles.section} aria-label="Member carousel">
      <button
        type="button"
        className={`${styles.navButton} ${styles.leftButton}`}
        onClick={onPrevMember}
        aria-label="Previous member"
      >
        ←
      </button>

      <div className={styles.trackWrap}>
        {visibleMembers.map((member, index) => {
          const isSelected = member.id === selectedMemberId
          return (
            <button
              key={`thumb-${member.id}-${index}`}
              type="button"
              className={`${styles.thumbCard} ${isSelected ? styles.thumbCardSelected : ''}`}
              onClick={() => onSelectMember(member.id)}
              aria-label={`${member.name} 보기`}
            >
              <img src={member.image} alt="" />
              <div className={styles.thumbOverlay} />

              <div className={styles.thumbText}>
                <span>{member.code}</span>
                <strong>{member.name}</strong>
              </div>

              <div className={styles.thumbRoles}>
                {member.roles.map((role) => (
                  <span
                    key={`${member.id}-${role.key}`}
                    // 캐러셀에서도 역할별 색을 통일해 인지성을 높입니다.
                    className={getThumbRoleClassName(role.key)}
                  >
                    {role.label}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className={`${styles.navButton} ${styles.rightButton}`}
        onClick={onNextMember}
        aria-label="Next member"
      >
        →
      </button>

      <p className={styles.yearLabel}>{`< ${yearLabel} >`}</p>

      <div className={styles.leftFade} aria-hidden="true" />
      <div className={styles.rightFade} aria-hidden="true" />
    </section>
  )
})
