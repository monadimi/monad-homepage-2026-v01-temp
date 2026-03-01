// SNS 아이콘 바 공통 컴포넌트입니다.
// default/compact/micro 크기 변형을 지원합니다.
import { memo } from 'react'
import type { SocialIconItem } from '../../models/HomeContentModel'
import styles from './SocialIconBar.module.css'

type SocialIconBarVariant = 'default' | 'compact' | 'micro'

interface SocialIconBarProps {
  items: readonly SocialIconItem[]
  variant?: SocialIconBarVariant
}

const variantClassNameMap: Record<SocialIconBarVariant, string> = {
  default: styles.default,
  compact: styles.compact,
  micro: styles.micro,
}

export const SocialIconBar = memo(function SocialIconBar({
  items,
  variant = 'default',
}: SocialIconBarProps) {
  return (
    <ul className={`${styles.list} ${variantClassNameMap[variant]}`}>
      {items.map((item) => (
        <li key={item.label} className={styles.item}>
          <a href={item.href} aria-label={item.label} className={styles.link}>
            <img src={item.iconSrc} alt="" className={styles.icon} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
})
