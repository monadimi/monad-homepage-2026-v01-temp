// 섹션 제목 공통 컴포넌트입니다.
// mono/display 스타일 변형을 제공합니다.
import { memo } from 'react'
import styles from './SectionTitle.module.css'

type SectionTitleVariant = 'mono' | 'display'

interface SectionTitleProps {
  text: string
  variant?: SectionTitleVariant
}

const variantClassNameMap: Record<SectionTitleVariant, string> = {
  mono: styles.mono,
  display: styles.display,
}

export const SectionTitle = memo(function SectionTitle({
  text,
  variant = 'display',
}: SectionTitleProps) {
  return <h2 className={`${styles.base} ${variantClassNameMap[variant]}`}>{text}</h2>
})
