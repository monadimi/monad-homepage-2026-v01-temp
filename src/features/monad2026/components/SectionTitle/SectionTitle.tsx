// MONAD 2026 전용 섹션 타이틀 컴포넌트입니다.
import { memo } from 'react'
import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  text: string
}

export const SectionTitle = memo(function SectionTitle({ text }: SectionTitleProps) {
  return <h2 className={styles.title}>{text}</h2>
})
