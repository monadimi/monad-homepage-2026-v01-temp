// 아직 구현되지 않은 라우트용 공통 플레이스홀더 페이지입니다.
import { memo } from 'react'
import { text } from '../../../content/text/textService'
import { Container } from '../../../core/layout/Container/Container'
import styles from './ComingSoonPage.module.css'

interface ComingSoonPageProps {
  title: string
}

export const ComingSoonPage = memo(function ComingSoonPage({
  title,
}: ComingSoonPageProps) {
  const subtitle = text('global', 'comingSoon.subtitle', 'Coming Soon')

  return (
    <section className={styles.section} aria-label={title}>
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </Container>
    </section>
  )
})
