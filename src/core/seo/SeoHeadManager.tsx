// 페이지별 메타 태그를 동적으로 관리하는 컴포넌트입니다.
// 화면에는 아무것도 렌더링하지 않으며, head 태그만 업데이트합니다.
import { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../analytics/googleAnalytics'
import {
  DEFAULT_LOCALE,
  SITE_NAME,
  getSeoConfigByPathname,
} from './seoConfig'

function upsertMetaByName(name: string, content: string): void {
  let tag = document.head.querySelector(`meta[name="${name}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function upsertMetaByProperty(property: string, content: string): void {
  let tag = document.head.querySelector(`meta[property="${property}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function upsertCanonicalLink(href: string): void {
  let link = document.head.querySelector('link[rel="canonical"]')

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }

  link.setAttribute('href', href)
}

function upsertJsonLd(data: Record<string, unknown>): void {
  const scriptId = 'monad-seo-jsonld'
  let script = document.getElementById(scriptId)

  if (!script) {
    script = document.createElement('script')
    script.id = scriptId
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(data)
}

export const SeoHeadManager = memo(function SeoHeadManager() {
  const location = useLocation()

  useEffect(() => {
    const seo = getSeoConfigByPathname(location.pathname)
    const origin = window.location.origin
    const canonicalUrl = `${origin}${location.pathname}`
    const imageUrl = seo.imagePath.startsWith('http')
      ? seo.imagePath
      : `${origin}${seo.imagePath}`

    document.title = seo.title
    document.documentElement.lang = 'ko'

    upsertCanonicalLink(canonicalUrl)
    upsertMetaByName('description', seo.description)
    upsertMetaByName('keywords', seo.keywords)
    upsertMetaByName(
      'robots',
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    )
    upsertMetaByName('theme-color', '#0f0f0f')
    upsertMetaByName('application-name', SITE_NAME)
    upsertMetaByName('apple-mobile-web-app-title', SITE_NAME)
    upsertMetaByName('twitter:card', 'summary_large_image')
    upsertMetaByName('twitter:title', seo.title)
    upsertMetaByName('twitter:description', seo.description)
    upsertMetaByName('twitter:image', imageUrl)

    upsertMetaByProperty('og:type', 'website')
    upsertMetaByProperty('og:locale', DEFAULT_LOCALE)
    upsertMetaByProperty('og:site_name', SITE_NAME)
    upsertMetaByProperty('og:title', seo.title)
    upsertMetaByProperty('og:description', seo.description)
    upsertMetaByProperty('og:url', canonicalUrl)
    upsertMetaByProperty('og:image', imageUrl)
    upsertMetaByProperty('og:image:alt', seo.imageAlt)

    upsertJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url: canonicalUrl,
      inLanguage: 'ko',
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: origin,
      },
    })

    // SPA 라우팅에서도 페이지뷰가 누락되지 않도록 경로 변경 시 수동 전송합니다.
    trackPageView({
      title: seo.title,
      location: canonicalUrl,
      path: location.pathname,
    })
  }, [location.pathname])

  return null
})
