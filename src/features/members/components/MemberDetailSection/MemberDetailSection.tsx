import { memo, type CSSProperties } from 'react'
import githubIcon from '../../../../assets/github.svg'
import { text } from '../../../../content/text/textService'
import type { MemberProfile } from '../../data/members'
import styles from './MemberDetailSection.module.css'

interface MemberDetailSectionProps {
  member: MemberProfile
}

function getRoleChipClassName(roleKey: MemberProfile['roles'][number]['key']): string {
  if (roleKey === 'planner') {
    return styles.roleChipPlanner
  }

  if (roleKey === 'developer') {
    return styles.roleChipDeveloper
  }

  return styles.roleChipDesigner
}

function getStackIcon(iconKey: MemberProfile['stacks'][number]['iconKey']): string {
  if (iconKey === 'python') {
    return 'Py'
  }

  if (iconKey === 'typescript') {
    return 'TS'
  }

  if (iconKey === 'c') {
    return 'C'
  }

  if (iconKey === 'react') {
    return 'R'
  }

  // 정의되지 않은 키도 표시할 수 있도록 앞 글자를 축약 아이콘으로 사용합니다.
  return iconKey.trim().slice(0, 2).toUpperCase() || '•'
}

export const MemberDetailSection = memo(function MemberDetailSection({
  member,
}: MemberDetailSectionProps) {
  const sectionAriaLabel = text('members', 'detail.sectionAria', 'Member detail')
  const stackTitle = text('members', 'detail.stackTitle', '기술 스택')
  const leftStacks = member.stacks.filter((_, index) => index % 2 === 0)
  const rightStacks = member.stacks.filter((_, index) => index % 2 === 1)

  return (
    <section className={styles.section} aria-label={sectionAriaLabel}>
      <div className={styles.photoPanel}>
        <div className={styles.photoMask}>
          <img src={member.image} alt={`${member.name} profile`} />
        </div>
      </div>

      <div className={styles.profilePanel} key={member.id}>
        <div className={styles.identityBlock}>
          <div className={styles.nameRow}>
            <h2>{member.name}</h2>
            <span>{member.code}</span>
          </div>

          <p className={styles.intro}>{member.intro}</p>

          <div className={styles.roleRow}>
            {member.roles.map((role) => (
              <span
                key={`${member.id}-${role.key}`}
                // 역할별로 배지 색을 분리해 designer도 화면에서 바로 식별되게 합니다.
                className={`${styles.roleChip} ${getRoleChipClassName(role.key)}`}
              >
                <span>{role.icon}</span>
                {role.label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.stackArea}>
          <h3>{stackTitle}</h3>
          <div className={styles.stackGrid}>
            <div className={styles.stackColumn}>
              {leftStacks.map((stack) => (
                <div key={`${member.id}-${stack.id}`} className={styles.stackRow}>
                  <span className={styles.stackIcon}>{getStackIcon(stack.iconKey)}</span>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ '--stack-progress': String(stack.value) } as CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.stackColumn}>
              {rightStacks.map((stack) => (
                <div key={`${member.id}-${stack.id}`} className={styles.stackRow}>
                  <span className={styles.stackLabel}>{stack.label}</span>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ '--stack-progress': String(stack.value) } as CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className={styles.quote}>“{member.quote}”</p>
      </div>

      <div className={styles.achievementPanel}>
        <ul>
          {member.achievements.map((achievement) => (
            <li key={`${member.id}-${achievement}`}>{achievement}</li>
          ))}
        </ul>

        <a href={member.github} className={styles.githubLink}>
          <img src={githubIcon} alt="" />
          {member.githubLabel}
        </a>
      </div>

      <div className={styles.topGradient} aria-hidden="true" />
      <div className={styles.bottomGradient} aria-hidden="true" />
    </section>
  )
})
