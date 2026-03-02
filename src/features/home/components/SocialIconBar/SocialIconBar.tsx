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
      {items.map((item) => {
        const isPlaceholderLink = item.href.trim() === '#'
        const isExternalLink = /^https?:\/\//i.test(item.href)

        return (
          <li key={item.label} className={styles.item}>
            <a
              href={item.href}
              aria-label={item.label}
              className={styles.link}
              target={isExternalLink ? '_blank' : undefined}
              rel={isExternalLink ? 'noopener noreferrer' : undefined}
              onClick={
                isPlaceholderLink
                  ? (event) => {
                      // 미정 링크는 화면 이동 없이 아이콘만 유지합니다.
                      event.preventDefault()
                    }
                  : undefined
              }
            >
              <img src={item.iconSrc} alt="" className={styles.icon} aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
})
