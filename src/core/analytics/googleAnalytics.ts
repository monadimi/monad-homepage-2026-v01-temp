// Google Analytics(GA4) 추적 유틸입니다.
export const GA_MEASUREMENT_ID = 'G-X2SGEVJEDP'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

interface PageViewPayload {
  title: string
  location: string
  path: string
}

type AnalyticsEventValue = string | number | boolean | null | undefined
type AnalyticsEventParams = Record<string, AnalyticsEventValue>

export function trackPageView(payload: PageViewPayload): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', 'page_view', {
    page_title: payload.title,
    page_location: payload.location,
    page_path: payload.path,
    send_to: GA_MEASUREMENT_ID,
  })
}

function normalizeEventName(eventName: string): string {
  const normalized = eventName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')

  if (!normalized) {
    return 'custom_event'
  }

  return normalized.slice(0, 40)
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', normalizeEventName(eventName), {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  })
}
