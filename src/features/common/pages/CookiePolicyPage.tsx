// 쿠키 정책 페이지입니다.
import { memo } from 'react'
import { text } from '../../../content/text/textService'
import { Container } from '../../../core/layout/Container/Container'
import styles from './CookiePolicyPage.module.css'

interface CookiePolicySection {
  title: string
  body: string
}

export const CookiePolicyPage = memo(function CookiePolicyPage() {
  const title = text('global', 'cookie.title', 'Cookie Policy')
  const lastUpdated = text('global', 'cookie.lastUpdated', 'Last Updated: March 8, 2026')
  const intro = text(
    'global',
    'cookie.intro',
    'MONAD 웹사이트는 서비스 품질 향상과 트래픽 분석을 위해 쿠키를 사용합니다.',
  )

  const sections: CookiePolicySection[] = [
    {
      title: text('global', 'cookie.section.collection.title', '1. 수집하는 정보'),
      body: text(
        'global',
        'cookie.section.collection.body',
        '쿠키를 통해 방문 경로, 페이지 조회, 버튼 클릭 등의 익명 이벤트 데이터를 수집할 수 있습니다.',
      ),
    },
    {
      title: text('global', 'cookie.section.purpose.title', '2. 사용 목적'),
      body: text(
        'global',
        'cookie.section.purpose.body',
        '수집된 정보는 콘텐츠 개선, UI 최적화, 운영 안정성 점검을 위해 사용됩니다.',
      ),
    },
    {
      title: text('global', 'cookie.section.analytics.title', '3. 분석 도구'),
      body: text(
        'global',
        'cookie.section.analytics.body',
        '본 사이트는 Google Analytics 4 (G-X2SGEVJEDP)를 사용합니다. Google의 데이터 처리 방식은 Google 개인정보처리방침을 따릅니다.',
      ),
    },
    {
      title: text('global', 'cookie.section.control.title', '4. 쿠키 제어'),
      body: text(
        'global',
        'cookie.section.control.body',
        '사용자는 브라우저 설정에서 쿠키 저장을 차단하거나 삭제할 수 있습니다. 단, 일부 기능이 제한될 수 있습니다.',
      ),
    },
    {
      title: text('global', 'cookie.section.contact.title', '5. 문의'),
      body: text(
        'global',
        'cookie.section.contact.body',
        '정책 관련 문의는 MONAD 운영진 채널(Instagram 또는 GitHub)을 통해 전달해 주세요.',
      ),
    },
  ]

  return (
    <section className={styles.section} aria-label={title}>
      <Container>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.updatedAt}>{lastUpdated}</p>
            <p className={styles.intro}>{intro}</p>
          </header>

          <div className={styles.content}>
            {sections.map((section) => (
              <section key={section.title} className={styles.block}>
                <h2 className={styles.blockTitle}>{section.title}</h2>
                <p className={styles.blockBody}>{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </Container>
    </section>
  )
})
